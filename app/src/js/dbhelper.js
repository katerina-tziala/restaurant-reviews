"use strict";
/**
 * Common database helper functions.
 */
class DBHelper {
  /**
  ** Restaurants URL.
  **/
  static get RESTAURANTS_URL() {
    return appParams.endpoints.restaurants;
  }
  /**
  ** Reviews URL.
  **/
  static get REVIEWS_URL() {
    return appParams.endpoints.reviews;
  }
  /**
  ** Request headers.
  **/
  static get REQUEST_HEADERS() {
    const dataheaders = new Headers();
    dataheaders.append('Accept', 'application/json; charset=utf-8');
    return dataheaders;
  }

  /**
  ** Check if indexed db is supported.
  **/
  static get INDEXED_DB_SUPPORT() {
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    const transactions = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
    const keys = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!(indexedDB) || !(transactions) || !(keys)) {
      return false;
    }else {
      return true;
    }
  }

  /**
  ** Index DB Store.
  **/
  static get AppStore() {
    return new DataStore();
  }

  /**
  ** Fetch data.
  **/
  static async fetchData(url) {
    const request = new Request(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'reload',
      credentials:'same-origin',
      headers: DBHelper.REQUEST_HEADERS});
    try {
      const fetchResult = fetch(request);
      const response = await fetchResult;
      const jsonData = await response.json();
      return Promise.resolve(jsonData);
    } catch(error){
      throw Error(error);
    }
  }

  /**
  ** Get data with proper error handling.
  **/
  static getData(url, target, callback) {
    DBHelper.fetchData(url, target).then((response)=>{
      const responseData = {
        "target": target
      }
      if (target==="restaurants" || target==="reviews") {
        let refactorkey = target.substring(0, target.length-1);
        const returnData = DBHelper.refactorData(refactorkey, response);
        responseData.data = returnData;
        DBHelper.updateIndexedDB(responseData, 'GETALL');
      }else{
        const returnData = DBHelper.refactorData(target, [response])[0];
        responseData.data = returnData;
        DBHelper.updateIndexedDB(responseData, 'GET');
      }
      callback(null, responseData.data);
    }).catch((error) => callback(error, null));
  }

  /**
  ** Refactor fetched data.
  **/
  static refactorData(target, data) {
    let returnData = JSON.parse(JSON.stringify(data));
    switch (target) {
      case "restaurant":
        returnData.forEach(item => {
          if (!('is_favorite' in item)) {
            item.is_favorite=false;
          }else{
            item.is_favorite=item.is_favorite.toString()==="true"?true:false;
          }
          if (!('photograph' in item)) {
            item.photograph=item.id.toString();
          }
        });
        return returnData;
        break;
      default:
        return returnData;
        break;
    }
  }

  /**
  ** Update indexed db.
  **/
  static updateIndexedDB(response, method) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      switch (method) {
        case 'GETALL':
          DBHelper.AppStore.cacheAll(response.target, response.data);
          break;
        case 'DELETE':
          DBHelper.AppStore.deleteOne(response.target+"s", response.data.id);
          break;
        default:
          DBHelper.AppStore.cacheOne(response.target+"s", response.data);
          break;
      }
    }
  }

  /**
  ** Fetch all restaurants.
  **/
  static fetchRestaurants(callback) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      DBHelper.AppStore.getCachedData('restaurants').then((response) => {
        if (response.length > 0) {
          callback(null, response);
          callback = () => {}; // don't call callback again from fetch
          }
          DBHelper.getData(DBHelper.RESTAURANTS_URL,'restaurants', callback);
        });
    } else {
      DBHelper.getData(DBHelper.RESTAURANTS_URL,'restaurants', callback);
    }
  }

  /**
  ** Fetch a restaurant by its ID.
  **/
  static fetchRestaurantById(id, callback) {
    if (DBHelper.IndexedDBSupport) {
      DBHelper.AppStore.getCachedDataById('restaurants', parseInt(id)).then((response) => {
        if (response.length > 0) {
          callback(null, response[0]);
          callback = () => {}; // don't call callback again from fetch
        }
        DBHelper.getData(DBHelper.RESTAURANTS_URL+`/${id}`,'restaurant', callback);
      });
    }else{
      DBHelper.getData(DBHelper.RESTAURANTS_URL+`/${id}`,'restaurant', callback);
    }
  }

  /**
  ** Fetch all reviews.
  **/
  static fetchReviews(callback) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      DBHelper.AppStore.getCachedData('reviews').then((response) => {
        if (response.length > 0) {
          callback(null, response);
          callback = () => {}; // don't call callback again from fetch
        }
        DBHelper.getData(DBHelper.REVIEWS_URL,'reviews', callback);
      });
    }else{
      DBHelper.getData(DBHelper.REVIEWS_URL,'reviews', callback);
    }
  }

  /**
  ** Fetch reviews of a restaurant.
  **/
  static fetchRestaurantReviews(id, callback) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      DBHelper.AppStore.getCachedDataByIndex('reviews', 'byRestaurant', parseInt(id)).then((response) => {
        if (response.length > 0) {
          callback(null, response);
          callback = () => {}; // don't call callback again from fetch
        }
        DBHelper.getData(DBHelper.REVIEWS_URL+`?restaurant_id=`+parseInt(id),'reviews', callback);
      });
    }else{
      DBHelper.getData(DBHelper.REVIEWS_URL+`?restaurant_id=`+parseInt(id),'reviews', callback);
    }
  }





  /**
  ** Fetch restaurants by a cuisine and a neighborhood with proper error handling.
  **/
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
  ** Fetch all parameters from restaurants (neighborhoods, restaurants) with proper error handling.
  **/
  static fetchUniqueRestaurantParams(param, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all parameters from all restaurants based on key
        const params = restaurants.map((v, i) => restaurants[i][param]);
        // Remove duplicates from parameters
        const uniqueParams = params.filter((v, i) => params.indexOf(v) == i);
        callback(null, uniqueParams);
      }
    });
  }

  /**
  ** Restaurant page URL.
  **/
  static urlForRestaurant(restaurant) {
    return (`restaurant.html?id=${restaurant.id}`);
  }

  /**
  ** Restaurant image URL.
  **/
  static imageUrlForRestaurant(restaurant) {
    let image = restaurant.photograph + '.jpg';
    return (`img/${image}`);
  }

}
