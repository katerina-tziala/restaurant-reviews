"use strict";
let main, loader, spinner, mapContainer, mapButton, notificationContainer, notificationHeader, notificationTitle, notificationBody, newSWorker;
let notificationTimeout, notificationInterval, notificationCountdown = 0;
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

// Initialize the App:
const initApp = () => {
  registerServiceWorker();
  DBHelper.fetchRestaurants(() => {});
  DBHelper.fetchReviews(() => {});
  self.main = document.getElementById("main");
  self.loader = document.getElementById("loader_container");
  self.spinner = document.getElementById("spinner");
  self.mapButton = document.getElementById("mapButton");
  self.mapContainer = document.getElementById("map_container");
  self.notificationContainer = document.getElementById("notification_container");
  self.notificationHeader = document.getElementById("notification_header");
  self.notificationTitle = document.getElementById("notification_title");
  self.notificationBody = document.getElementById("notification_body");
  self.newSWorker = null;
  self.notificationTimeout = 0;
  self.notificationInterval = 0;
  self.notificationCountdown = 0;
  initView();
  checkForFailedRequests().then(response => {
    if (response.length) { validateFailedRequests(response, () => {}); }
  });
  setTimeout(() => {
    if (navigator.online) {
      checkForAppDataUpdate();
    }
  }, 10000);
};

// Initialize view depending on the page that was loaded:
const initView = () => {
  const pageView = InterfaceManager.getUserView();
  switch (pageView) {
    case "index":
      Promise.all(loadFiles("index")).then(() => {
        renderIndex();
      }).catch((error) => {
        clearNotification();
        createNotificationContent(getNotificationContent("unable_to_connect_retrying"));
        createNotificationActionButton("retry", "retry", "retry to connect", InterfaceManager.refreshApp);
        addNotificationCountDown(() =>  {InterfaceManager.refreshApp(); });
        displayNotification();
      });
      break;
    case "restaurant":
      Promise.all(loadFiles("restaurant")).then(() => {
        renderRestaurantInfo();
      }).catch((error) => {
        clearNotification();
        createNotificationContent(getNotificationContent("unable_to_connect_retrying"));
        createNotificationActionButton("retry", "retry", "retry to connect", InterfaceManager.refreshApp);
        addNotificationCountDown(() =>  {InterfaceManager.refreshApp(); });
        displayNotification();
      });
      break;
    default:
    InterfaceManager.redirectUser(appParams.start_url);
  }
};

// Load CSS and JavaScript files based on user view:
const loadFiles = (view) => {
  let filesToLoad = [];
  appParams[view+"Files"].css.forEach(file => {
    filesToLoad.push(FileLoader.loadFile("link", FileLoader.getFileParameters(file)));
  });
  appParams[view+"Files"].js.forEach(file => {
    filesToLoad.push(FileLoader.loadFile("script", FileLoader.getFileParameters(file)));
  });
  return filesToLoad;
};

// Notify users when online:
window.addEventListener("online", (event) => {
  event.preventDefault();
  if (InterfaceManager.loaderIsDisplayed()) {
    InterfaceManager.refreshApp();
  } else {
    enableMap();
    updateWhenOnline();
  }
});

// Update the app when back online:
const updateWhenOnline = () => {
  clearNotification();
  hideNotification();
  checkForFailedRequests().then((response) => {
     if (response.length) {
       validateFailedRequests(response, (error, requestsToSend) => {
         if (error) {
           clearNotification();
           createNotificationContent(getNotificationContent("retry"));
           createNotificationActionButton("retry", "retry", "retry now", updateWhenOnline);
           addNotificationCountDown(() => {
             updateWhenOnline();
           });
           displayNotification();
         } else if (requestsToSend && requestsToSend.length) {
           generateUnsavedChangesNotification(response.length);
         } else {
           generateBasicNotification(getNotificationContent("online"), 8000);
         }
       });
     } else {
       generateBasicNotification(getNotificationContent("online"), 8000);
     }
   });
};

// Notify users when offline:
window.addEventListener("offline", (event) => {
  event.preventDefault();
  let offlineNotification = "";
  if (InterfaceManager.loaderIsDisplayed()) {
    clearNotification();
    offlineNotification = getNotificationContent("unable_to_connect_retrying");
    createNotificationContent(offlineNotification);
    createNotificationActionButton("retry", "retry", "retry to connect", InterfaceManager.reloadApp);
    addNotificationCountDown(() => {
      InterfaceManager.reloadApp();
    });
    displayNotification();
  } else {
    if(!self.mapLoaded) {
      offlineNotification =  getNotificationContent("offline_noMap");
      disableMap();
    } else {
      offlineNotification =  getNotificationContent("offline");
    }
    generateBasicNotification(offlineNotification, 10000);
  }
});

// Refresh the app:
const refreshApp = () => {
  InterfaceManager.refreshApp();
};

/**
** SERVICE WORKER FUNCTIONS
**/
// Register service worker:
const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    // Register the service worker
    navigator.serviceWorker.register("ServiceWorker.js", {scope: appParams.app_scope}).then(reg => {
      if (!navigator.serviceWorker.controller) {
        return;
      }
      if (reg.waiting) {
        updateReady(reg.waiting);
        return;
      }
      if (reg.installing) {
        trackInstalling(reg.installing);
        return;
      }
      reg.addEventListener("updatefound", () =>{
        trackInstalling(reg.installing);
      });
    }).catch((error) => {
        console.log("Oh No! Service Worker registration failed! Error: " + error);
      });
  } else {
    console.log("Oh No! Service Workers are not supported!");
  }
};

// Track service worker installation:
const trackInstalling = (worker) => {
  worker.addEventListener("statechange", () => {
    if (worker.state == "installed") {
      updateReady(worker);
    }
  });
};


// When upadate is ready, then display notification:
const updateReady = (worker) => {
  self.newSWorker = worker;
  generateUpdateNotification();
};


// Dismiss update of the app:
const dismissUpdate = () => {
  hideNotification();
};


// Update the app:
const updateApp = () => {
  self.newSWorker.postMessage({action: "skipWaiting"});
  hideNotification();
  self.newSWorker = null;
};
