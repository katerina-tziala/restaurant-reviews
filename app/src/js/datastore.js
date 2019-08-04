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
          const restaurantStore = this.createStore(upgradeDb, 'restaurants');
          break;
        }
      });
  }

  // Create object store:
  createStore(upgradeDb, storename, autoIncrement = false) {
    return upgradeDb.createObjectStore(storename, {
      keyPath: 'id',
      autoIncrement: autoIncrement
    });
  }

  // Get cached data:
  getCachedData(storename){
    return this.cache.then((db) => {
      return db.transaction(storename).objectStore(storename).getAll();
    });
  }

  // Put all objects in indexedDB:
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
