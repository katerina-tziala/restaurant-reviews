"use strict";
/**
** Common database helper functions.
**/
class DBHelper {
// Get restaurants URL:
  static get RESTAURANTS_URL() {
    return appParams.endpoints.restaurants;
  }

  // Get request headers:
  static get REQUEST_HEADERS() {
    const dataheaders = new Headers();
    dataheaders.append('Accept', 'application/json; charset=utf-8');
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

  // Fetch data:
  static async fetchData(url) {
    const request = new Request(url, {method: 'GET',  mode: 'cors', cache: 'reload', credentials:'same-origin', headers: DBHelper.REQUEST_HEADERS});
    try {
      const fetchResult = fetch(request);
      const response = await fetchResult;
      const jsonData = await response.json();
      return Promise.resolve(jsonData);
    } catch(error){
      throw Error(error);
    }
  }

  // Fetch all restaurants:
  static fetchRestaurants(callback) {
    if (DBHelper.INDEXED_DB_SUPPORT) {
      DBHelper.AppStore.getCachedData('restaurants').then(response => {
        if (response.length > 0) {
          callback(null, response);
          callback = () => {}; // don't call callback again from fetch
          }
          DBHelper.fetchData(DBHelper.RESTAURANTS_URL).then(response => {
            DBHelper.AppStore.cacheAll('restaurants', response);
            callback(null, response);
          }).catch((error) => callback(error, null));
        });
    } else {
      DBHelper.fetchData(DBHelper.RESTAURANTS_URL).then(response => {
        DBHelper.AppStore.cacheAll('restaurants', response);
          callback(null, response);
        }).catch((error) => callback(error, null));
    }
  }

  // Fetch a restaurant by its ID:
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  // Fetch restaurants by a cuisine and a neighborhood with proper error handling:
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let filteredRestaurants  = restaurants
        if (cuisine !== 'all') { // filter by cuisine
          filteredRestaurants  = filteredRestaurants .filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood !== 'all') { // filter by neighborhood
          filteredRestaurants  = filteredRestaurants .filter(r => r.neighborhood == neighborhood);
        }
        callback(null, filteredRestaurants );
      }
    });
  }

  // Fetch all parameters from restaurants (neighborhoods, restaurants) with proper error handling:
  static fetchUniqueRestaurantParams(param, callback) {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all parameters from all restaurants based on key
        const params = restaurants.map(restaurant => restaurant[param]);
        // Remove duplicates from parameters
        const uniqueParams = params.filter((v, i) => params.indexOf(v) == i);
        callback(null, uniqueParams);
      }
    });
  }

  // Restaurant page URL:
  static urlForRestaurant(restaurant) {
    return (`restaurant.html?id=${restaurant.id}`);
  }

  // Restaurant image URL:
  static imageUrlForRestaurant(restaurant) {
    return (`img/${restaurant.photograph + '.jpg'}`);
  }

}
