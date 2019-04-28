"use strict";
/**
** Check if there are failed requests.
**/
const checkForFailedRequests = () => {
  return DBHelper.fetchFailedRequests().then((failedRequests) => {
    const failedRequestsNumber = failedRequests.length;
    if (failedRequestsNumber > 0) {
      return failedRequests;
    } else {
      return [];
    }
  });
};

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
    if (response.length > 0) {
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
  if (requests.length > 0) {
    let requestToStore = requests[0];
    let sendingRequest = prepareRequestParams(requestToStore);
    setTimeout(() => {
      DBHelper.sendData(sendingRequest.url, sendingRequest.params, sendingRequest.target).then(response => {
        DBHelper.AppStore.deleteOne("failedRequests", requestToStore._id);
        requests.shift();
        saveRequests(requests);
      });
    }, 500);
  }else{
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
