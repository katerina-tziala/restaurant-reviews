"use strict";
/**
** Class to store and retrieve objects from IndexedDB.
**/
class DataStore {
  constructor() {
    this.cachename = "rr-app";
    this.openDatabase();
  }

  // Open database:
  openDatabase() {
    this.cache = idb.open(this.cachename, 1, (upgradeDb) => {
      switch (upgradeDb.oldVersion) {
        case 0:
          const restaurantStore = this.createStore(upgradeDb, "restaurants");
          const reviewsStore = this.createStore(upgradeDb, "reviews");
          reviewsStore.createIndex("byRestaurant", "restaurant_id");
          const requestStore = this.createStore(upgradeDb, "failedRequests", true);
          break;
        }
      });
  }

  // Create object store:
  createStore(upgradeDb, storename, autoIncrement = false) {
    return upgradeDb.createObjectStore(storename, {
      keyPath: "id",
      autoIncrement: autoIncrement
    });
  }

  // Get cached data:
  getCachedData(storename){
    return this.cache.then((db) => {
      return db.transaction(storename).objectStore(storename).getAll();
    });
  }
  
  // Get all from indexedDB based on storename, index and key:
  getCachedDataById(storename, key) {
    return this.cache.then((db) => {
      return db.transaction(storename).objectStore(storename).getAll(key);
    });
  }

  // Get all from indexedDB based on storename, index and key:
  getCachedDataByIndex(storename, index, key) {
   return this.cache.then((db) => {
     return db.transaction(storename).objectStore(storename).index(index).getAll(key);
   });
  }

  // Get all keys from a store:
  getStoreKeys(storename) {
    return this.cache.then((db) => {
       return db.transaction(storename).objectStore(storename).getAllKeys();
    });
  }

  // Put all objects in indexedDB:
  cacheAll(storename, objects) {
    this.cache.then((db) => {
      const tx = db.transaction(storename, "readwrite");
      const store = tx.objectStore(storename);
      objects.forEach((object) => {
        store.put(object);
      });
    });
  }

  // Put one object in indexedDB:
  cacheOne(storename, object) {
    this.cacheAll(storename, [object]);
  }

  // Delete one record from indexxedDB by key:
  deleteOne(storename, key) {
   this.cache.then((db) => {
     db.transaction(storename, "readwrite").objectStore(storename).delete(key);
   });
  }

  // delete all records from a store:
  deleteAll(storename) {
   this.cache.then((db) => {
     db.transaction(storename, "readwrite").objectStore(storename).clear();
   });
  }
}
