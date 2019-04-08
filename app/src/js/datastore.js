"use strict";
/**
** Class to store and retrieve objects from IndexedDB.
**/
class DataStore {
  constructor(autoIncrement = false) {
    this.cachename = "rr-app";
    this.openDatabase(autoIncrement);
  }
  //open database
  openDatabase(autoIncrement = false) {
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
  //create object store
  createStore(upgradeDb, storename, autoIncrement = false) {
    return upgradeDb.createObjectStore(storename, {
      keyPath: "id",
      autoIncrement: autoIncrement
    });
  }
  //get cached data:
  getCachedData(storename){
    return this.cache.then((db) => {
      return db.transaction(storename).objectStore(storename).getAll();
    });
  }
  //get all from indexedDB based on storename, index and key
  getCachedDataById(storename, key) {
    return this.cache.then((db) => {
      return db.transaction(storename).objectStore(storename).getAll(key);
    });
  }
  //get all from indexedDB based on storename, index and key
  getCachedDataByIndex(storename, index, key) {
   return this.cache.then((db) => {
     return db.transaction(storename).objectStore(storename).index(index).getAll(key);
   });
  }
  //get all keys from a store
  getStoreKeys(storename) {
    return this.cache.then((db) => {
       return db.transaction(storename).objectStore(storename).getAllKeys();
    });
  }
  //put all objects in indexedDB:
  cacheAll(storename, objects) {
    this.cache.then((db) => {
      const tx = db.transaction(storename, "readwrite");
      const store = tx.objectStore(storename);
      objects.forEach((object) => {
        store.put(object);
      });
    });
  }
  //put one object in indexedDB:
  cacheOne(storename, object) {
    this.cacheAll(storename, [object]);
  }
  //delete one record from indexxedDB by key:
  deleteOne(storename, key) {
   this.cache.then((db) => {
     db.transaction(storename, "readwrite").objectStore(storename).delete(key);
   });
  }
}
