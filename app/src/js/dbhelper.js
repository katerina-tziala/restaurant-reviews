"use strict";
/**
** Common database helper functions.
**/
class DBHelper {
  // Get restaurants URL:
  static get RESTAURANTS_URL() {
    return appParams.endpoints.restaurants;
  }

  // Get reviews URL:
  static get REVIEWS_URL() {
    return appParams.endpoints.reviews;
  }

  // Get request headers:
  static get REQUEST_HEADERS() {
    const dataheaders = new Headers();
    dataheaders.append("Accept", "application/json; charset=UTF-8");
    dataheaders.append("Content-type", "application/json; charset=UTF-8");
    dataheaders.append("x-apikey", appParams.databaseApiKey);
    dataheaders.append("cache-control", "no-cache");
    return dataheaders;
  }

  // Check if indexed db is supported:
  static get INDEXED_DB_SUPPORT() {
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    const transactions = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
    const keys = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!(indexedDB) || !(transactions) || !(keys)) {
      return false;
    } else {
      return true;
    }
  }

  // Get IndexDB Store:
  static get AppStore() {
    return new DataStore();
  }

  // Get URL of one restaurant:
  static getRestaurantURL(id) {
    return DBHelper.RESTAURANTS_URL+`/${id}`;
  }

  // Get URL of one review:
  static getReviewURL(id) {
    return DBHelper.REVIEWS_URL+`/${id}`;
  }

  // Get URL of one review:
  static getReviewsURLBasedOnRestaurant(id) {
    return DBHelper.REVIEWS_URL + `?q={"restaurant_id":"${id}"}`;
  }

  // Check if id is temporary:
  static isTemporaryId(id) {
    return id.startsWith("temp") ? true : false;
  }

  // Fetch data:
  static async fetchData(url) {
    const request = new Request(url, {method: "GET", mode: "cors", cache: "reload", credentials:"same-origin", headers: DBHelper.REQUEST_HEADERS});
    try {
      const fetchResult = fetch(request);
      const response = await fetchResult;
      const jsonData = await response.json();
      return Promise.resolve(jsonData);
    } catch(error){
      throw Error(error);
    }
  }

  // Get data with proper error handling:
  static getData(url, target, callback) {
    DBHelper.fetchData(url, target).then((response)=>{
      const responseData = {target: target};
      if (target === "restaurants" || target === "reviews") {
        const returnData = response;
        responseData.data = returnData;
        DBHelper.updateIndexedDB(responseData, "GETALL");
      } else {
        const returnData = response;
        responseData.data = returnData;
        DBHelper.updateIndexedDB(responseData, "GET");
      }
      callback(null, responseData.data);
    }).catch((error) => callback(error, null));
  }

  // Update indexed db:
  static updateIndexedDB(response, method) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      switch (method) {
        case "GETALL":
          DBHelper.AppStore.cacheAll(response.target, response.data);
          break;
        case "DELETE":
          DBHelper.AppStore.deleteOne(response.target + "s", response.data._id);
          break;
        default:
          DBHelper.AppStore.cacheOne(response.target + "s", response.data);
          break;
      }
    }
  }

  // Fetch all restaurants:
  static fetchRestaurants(callback) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      DBHelper.AppStore.getCachedData("restaurants").then((response) => {
        if (response.length) {
          callback(null, response);
          callback = () => {}; // don"t call callback again from fetch
          }
          DBHelper.AppStore.deleteAll("restaurants");
          DBHelper.getData(DBHelper.RESTAURANTS_URL,"restaurants", callback);
        });
    } else {
      DBHelper.getData(DBHelper.RESTAURANTS_URL,"restaurants", callback);
    }
  }

  // Fetch a restaurant by its ID:
  static fetchRestaurantById(id, callback) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      DBHelper.AppStore.getCachedDataById("restaurants", id).then((response) => {
        if (response.length) {
          callback(null, response[0]);
          callback = () => {}; // don"t call callback again from fetch
        }
        DBHelper.getData(DBHelper.getRestaurantURL(id), "restaurant", callback);
      });
    } else {
      DBHelper.getData(DBHelper.getRestaurantURL(id), "restaurant", callback);
    }
  }

  // Fetch all reviews:
  static fetchReviews(callback) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      DBHelper.AppStore.getCachedData("reviews").then(response => {
        if (response.length) {
          callback(null, response);
          callback = () => {}; // don"t call callback again from fetch
        }
        DBHelper.AppStore.deleteAll("reviews");
        DBHelper.getData(DBHelper.REVIEWS_URL,"reviews", callback);
      });
    } else {
      DBHelper.getData(DBHelper.REVIEWS_URL,"reviews", callback);
    }
  }

  // Fetch reviews of a restaurant:
  static fetchRestaurantReviews(id, callback) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      DBHelper.AppStore.getCachedDataByIndex("reviews", "byRestaurant", id).then(response => {
        if (response.length) {
          callback(null, response);
          callback = () => {}; // don"t call callback again from fetch
        }
        DBHelper.getData(DBHelper.getReviewsURLBasedOnRestaurant(id), "reviews", callback);
      });
    } else {
      DBHelper.getData(DBHelper.getReviewsURLBasedOnRestaurant(id), "reviews", callback);
    }
  }

  // Fetch restaurants by a cuisine and a neighborhood with proper error handling:
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let filteredRestaurants = restaurants
        if (cuisine !== "all") { // filter by cuisine
          filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.cuisine_type == cuisine);
        }
        if (neighborhood !== "all") { // filter by neighborhood
          filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.neighborhood == neighborhood);
        }
        callback(null, filteredRestaurants);
      }
    });
  }

  // Fetch all parameters from restaurants (neighborhoods, restaurants) with proper error handling:
  static fetchUniqueRestaurantParams(param, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // get all parameters from all restaurants based on key
        const params = restaurants.map(restaurant => restaurant[param]);
        // remove duplicates from parameters
        const uniqueParams = params.filter((v, i) => params.indexOf(v) == i);
        callback(null, uniqueParams);
      }
    });
  }

  // Get restaurant page URL:
  static urlForRestaurant(restaurant) {
    return (`restaurant.html?id=${restaurant._id}`);
  }

  // Get restaurant image URL:
  static imageUrlForRestaurant(restaurant) {
    return (`img/${restaurant.photograph + ".jpg"}`);
  }

  // Mark restaurant as favorite or unmark it:
  static favoriteHandler(id, favorite) {
    const request_params = {
      method: "PATCH",
      body: JSON.stringify({is_favorite: favorite})
    };
    return DBHelper.sendData(DBHelper.getRestaurantURL(id), request_params, "restaurant");
  }

  // Add a new review:
  static postReview(review) {
    const request_params = {
      method: "POST",
      body: JSON.stringify(review)
    };
    return DBHelper.sendData(DBHelper.REVIEWS_URL, request_params, "review");
  }

  // Update a review:
  static updateReview(review) {
    const request_params = {
      method: "PATCH",
      body: JSON.stringify(review)
    };
    return DBHelper.sendData(DBHelper.getReviewURL(review._id), request_params, "review");
  }

  // Delete a review:
  static deleteReview(id) {
    if (DBHelper.isTemporaryId(id.toString())) {
      return DBHelper.getTargetId(DBHelper.getReviewURL(id), "review").then(id => {
        DBHelper.deleteExistingRequest({targetId: id, target: "review"});
        const returnData = {
          request_status: "fail",
          target: "review",
          data : []
        };
        return returnData;
      });
    } else {
      const request_params = {method: "DELETE"};
      return DBHelper.sendData(DBHelper.getReviewURL(id), request_params, "review");
    }
  }

  // Send data to server:
  static async sendData(url, request_params, target) {
    const headers = DBHelper.REQUEST_HEADERS;
    request_params.mode = "cors";
    request_params.credentials = "same-origin";
    request_params.headers = headers;
    request_params.json = true;
    const request = new Request(url, request_params);
    try {
      const fetchResult = fetch(request);
      const response = await fetchResult;
      const jsonData = await response.json();
      const returnData = {
        request_status: "success",
        target: target,
        data: jsonData
      };
      if (request_params.method === "DELETE") {
        returnData.data = {_id: jsonData.result[0]};
      }
      DBHelper.updateIndexedDB(returnData, request_params.method);
      return Promise.resolve(returnData);
    } catch(error) {
      const failed_request = request_params;
      failed_request.target = target;
      failed_request.url = url;
      failed_request.data = [];
      return DBHelper.handleFailedRequest(failed_request);
    }
  }

  // Get target id of failed request:
  static getTargetId(url, target) {
    const splitter = target + "s";
    let url_part = url.split(splitter).pop();
    if (target === "restaurant") {
      url_part = url_part.split("/?is_favorite")[0];
      return Promise.resolve(url_part.substring(1));
    } else {
      if (url_part) {
        return Promise.resolve(url_part.substring(1));
      } else {
        return DBHelper.AppStore.getStoreKeys("failedRequests").then(response => {
          const nextkey = response.length + 1;
          return `temp${nextkey}`;
        });
      }
    }
  }

  // Delete existing request:
  static deleteExistingRequest(newRequest) {
    DBHelper.AppStore.getCachedData("failedRequests").then((response) => {
      if (response.length) {
        const existingRequests = response.filter(response => response.target === newRequest.target && response.targetId === newRequest.targetId);
        if (existingRequests.length) {
          DBHelper.AppStore.deleteOne("failedRequests", existingRequests[0]._id);
        }
      }
    });
  }

  // Handle failed requests:
  static handleFailedRequest(failed_request) {
    const returnData = {
      request_status: "fail",
      target: failed_request.target,
      data : failed_request.data
    };
    if (DBHelper.INDEXED_DB_SUPPORT) {
      return DBHelper.getTargetId(failed_request.url, failed_request.target).then(id => {
        const requestToStore = {
          target: failed_request.target,
          url: failed_request.url,
          method: failed_request.method,
          targetId: id
        };
        if ("body" in failed_request) {
          const dataload = JSON.parse(failed_request.body);
          if (!("_id" in dataload) || !("id" in dataload)) {
            dataload._id = id;
            dataload.id = id;
          };
          requestToStore.body = dataload;
          returnData.data = dataload;
        }
        DBHelper.deleteExistingRequest(requestToStore);
        DBHelper.AppStore.cacheOne("failedRequests", requestToStore);
        return Promise.resolve(returnData);
      });
    } else {
      return Promise.resolve(returnData);
    }
  }

  // Sort item list by id:
  static sortByID(item_a, item_b, order_type) {
    const sortOrder = order_type === "asc" ? (-1) : 1;
    return (item_a._id === item_b._id) ? 0 : item_a._id < item_b._id ? sortOrder : -sortOrder;
  }

  // Sort data by date:
  static sortByDate(item_a, item_b, order_type, key) {
    let sortedData;
    if(order_type === "asc"){
      sortedData = parseFloat(new Date(item_a[key]).getTime()) - parseFloat(new Date(item_b[key]).getTime());
    } else {
      sortedData = parseFloat(new Date(item_b[key]).getTime()) - parseFloat(new Date(item_a[key]).getTime());
    }
    return sortedData;
  }

  // Fetch failed requests:
  static fetchFailedRequests() {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      return DBHelper.AppStore.getCachedData("failedRequests");
    } else {
      return Promise.resolve([]);
    }
  }

  // Clear IndexedDB:
  static clearIndexedBD() {
    DBHelper.AppStore.deleteAll("failedRequests");
    DBHelper.AppStore.deleteAll("restaurants");
    DBHelper.AppStore.deleteAll("reviews");
  }

}