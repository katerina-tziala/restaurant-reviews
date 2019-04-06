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
          const restaurantStore = this.createStore(upgradeDb, 'restaurants');
          break;
        }
      });
  }
  //create object store
  createStore(upgradeDb, storename, autoIncrement = false) {
    return upgradeDb.createObjectStore(storename, {
      keyPath: 'id',
      autoIncrement: autoIncrement
    });
  }
  //get cached data:
  getCachedData(storename){
    return this.cache.then((db) => {
      return db.transaction(storename).objectStore(storename).getAll();
    });
  }
  //put all objects in indexedDB:
  cacheAll(storename, objects) {
    this.cache.then((db) => {
      const tx = db.transaction(storename, 'readwrite');
      const store = tx.objectStore(storename);
      objects.forEach((object) => {
        store.put(object);
      });
    });
  }
}
