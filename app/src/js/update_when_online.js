"use strict";
/**
** Check if there are failed requests.
**/
const checkForFailedRequests = () => {
  return DBHelper.fetchFailedRequests().then(failedRequests => {
    if (failedRequests.length) {
      return failedRequests;
    } else {
      return [];
    }
  });
};

/**
** Validate failed requests.
**/
const validateFailedRequests = (failedRequests, callback) => {
  let requestsToSend = failedRequests.filter(request => request.method === "POST");
  const deleteRequests = failedRequests.filter(request => request.method === "DELETE");
  const patchRequests = failedRequests.filter(request => request.method === "PATCH");
  DBHelper.fetchData(DBHelper.REVIEWS_URL,"reviews").then((reviews)=>{
    const dbReviewsIds = reviews.map(review => review._id);
      const validDeleteRequests = getValidRequests(dbReviewsIds, deleteRequests);
      if (validDeleteRequests.length) {
        validDeleteRequests.forEach(request => requestsToSend.push(request));
      }
      const validUpdateRequests = getValidRequests(dbReviewsIds, patchRequests);
      if (validUpdateRequests.length) {
        validUpdateRequests.forEach(request => requestsToSend.push(request));
      }
      const requestsToSendIds = reviews.map(request => request._id);
      failedRequests.forEach(request => {
        if (!requestsToSendIds.includes(request._id)) {
          if (request.method === "PATCH") {
            const newId = "temp" + request.body.id;
            request.url = request.url.split("reviews/")[0] + "reviews/" + newId;
            request.targetId = newId;
            request.body._id = newId;
            requestsToSend.push(prepareRequestParams(request));
          } else {
            DBHelper.AppStore.deleteOne("failedRequests", request._id);
          }
        }
      });
      callback(null, requestsToSend);
  }).catch((error) => callback(error, null));
}

/**
** Check if data for update exist in database.
**/
const getValidRequests = (dbDataIds, requestsTocheck) => {
  const validRequests = [];
  if (requestsTocheck.length) {
    requestsTocheck.forEach(request => {
      if (request.targetId.startsWith("temp")) {
        validRequests.push(request);
      } else if (dbDataIds.includes(request.targetId)) {
        validRequests.push(request);
      }
    });
  }
  return validRequests;
}

/**
** Allow an eager user to save changes immediately.
**/
const saveNow = (event) => {
  clearNotificationCountDown();
  updateAppData();
  generateBasicNotification(getNotificationContent("saving_changes"), 15000);
};

/**
** Check if there are failed requests and then save them to the server.
**/
const updateAppData = () => {
  checkForFailedRequests().then((response) => {
    if (response.length) {
      saveRequests(response);
    }
  });
};

/**
** Save requests: Save the first request and remove it from the requests array and from IndexedDB.
** If it fails it will be restored in the database with a new id, so this request is being removed from the indexedDB.
** When there are no requests left check again if there are requests in the indexedDB.
** If so, the user will be notified again and the process will start again.
** If there are not any requests in the IndexedDB the user will be notified
** that everything was successfully stored and will be promped to refresh the app.
**/
const saveRequests = (requests) => {
  if (requests.length) {
    let requestToStore = requests[0];
    let sendingRequest = prepareRequestParams(requestToStore);
    setTimeout(() => {
      DBHelper.sendData(sendingRequest.url, sendingRequest.params, sendingRequest.target).then(() => {
        DBHelper.AppStore.deleteOne("failedRequests", requestToStore._id);
        requests.shift();
        saveRequests(requests);
      });
    }, 0);
  } else {
    checkForAppDataUpdate(true);
  }
};

/**
** Check if there are requests that have to be stored.
** Notify user for unsaved changes.
** When there are no more requests notify that all requests have been saved.
**/
const checkForAppDataUpdate = (caughtupmessage = false) => {
  checkForFailedRequests().then((response) => {
    if (response.length > 0) {
      generateUnsavedChangesNotification(response.length);
    } else {
      if (caughtupmessage) {
        generateRefreshNotification();
      }
    }
  });
};

/**
** Prepare request data and parameters.
**/
const prepareRequestParams = (request) => {
  const request_params = {
    "url": request.url,
    "target": request.target,
    "params": {method: request.method}
  };
  if ("body" in request) {
    let dataload = request.body;
    if ("_id" in dataload && dataload._id.toString().startsWith("temp") && request.targetId.startsWith("temp")) {
      request_params.url = request.url.split("/temp")[0];
      request_params.params.method = "POST";
      delete dataload["_id"];
      request_params.params.body = JSON.stringify(dataload);
    } else {
      request_params.params.body = JSON.stringify(dataload);
    }
  }
  return request_params;
};
