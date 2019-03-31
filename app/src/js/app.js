"use strict";
let main, loader, spinner, mapButton;
let InterfaceManager, MapManager, Notifications;
let newSWorker;
const start_url = "http://localhost:8887/index.html";
const app_scope = "/";


document.addEventListener("DOMContentLoaded", (event) => {
  initApp();



  initView();
});











/**
** Initialize the App.
**/
const initApp = () => {
  self.main = document.getElementById("main");
  self.loader = document.getElementById("loader_container");
  self.spinner = document.getElementById("spinner");
  self.mapButton = document.getElementById("mapButton");
  self.InterfaceManager = new UIManager(self.main, self.loader, self.spinner);
  self.mapManager = null;
  self.Notifications = new NotificationsManager();

  self.newSWorker = null;

  //console.log(self.InterfaceManager.loaderIsDisplayed());



  // if (!navigator.onLine && !mapLoaded()) {
  //   disableMap();
  // } else {
  //   enableMap();
  // }


//  console.log(self.Notifications.getNotificationContent("offline"));
//  self.Notifications.generateBasicNotification(self.Notifications.getNotificationContent("offline"), 5000);
  registerServiceWorker();
};

/**
** Reload the app.
**/
const reloadApp = () => {
  window.location.href = window.location.href;
};

/**
** Refresh the app.
**/
const refreshApp = () => {
  window.location.reload(true);
};



/**
** Initialize view depending on the page that was loaded.
**/
const initView = () => {
  const pageView = DisplayManager.getUserView();

  switch (pageView) {
    case "index":
      renderIndex();
      break;
    case "restaurant":
      renderRestaurantInfo();
      break;
    default:
    DisplayManager.redirectUser(self.start_url);
  }
};



/**
** Notify users when online.
**/
window.addEventListener("online", (event) => {
  event.preventDefault();
  self.Notifications.clearNotification();
  if (self.InterfaceManager.loaderIsDisplayed()) {
    refreshApp();
  } else {
    enableMap();
    const onlineNotification = self.Notifications.getNotificationContent("online");
    self.Notifications.generateBasicNotification(onlineNotification, 5000);
  }
});

/**
** Notify users when offline.
**/
window.addEventListener("offline", (event) => {
  event.preventDefault();
  self.Notifications.clearNotification();
  let offlineNotification = "";
  if (self.InterfaceManager.loaderIsDisplayed()) {
    offlineNotification = self.Notifications.getNotificationContent("unable_to_connect_retrying");
    self.Notifications.createNotificationContent(offlineNotification);
    self.Notifications.createReActionButton("retry");
    self.Notifications.addNotificationCountDown(() => {
      reloadApp();
    });
    self.Notifications.displayNotification();
  } else {
    if(!mapLoaded()) {
       offlineNotification = self.Notifications.getNotificationContent("offline_noMap");
      disableMap();
    } else {
      offlineNotification = self.Notifications.getNotificationContent("offline");
    }
    self.Notifications.generateBasicNotification(offlineNotification, 5000);
  }
});






/**
** Close notification and clear timeout.
**/
const closeNotification = (event) => {
  event.preventDefault();
  self.Notifications.removeNotification();
};


/////////////////////////////////// MAP FUNCTIONS ///////////////////////////////////
/**
** Check if map was loaded.
**/
const mapLoaded = () => {
  return !self.MapManager ? false : true;
}

/**
** Disable map for users when they are offline and map was not loaded.
**/
const disableMap = () => {
  self.mapButton.removeAttribute("onclick");
  self.mapButton.classList.add("disabled");
  self.mapButton.setAttribute("aria-label", "Map is currently unavailable");
  self.mapButton.title = "Map is currently unavailable";
};

/**
** Enable map for users based on view.
**/
const enableMap = () => {
  self.mapButton.setAttribute("onclick", "toggleMap(event)");
  self.mapButton.classList.remove("disabled");
  const currentAction = self.mapButton.getAttribute("aria-label").split(" ")[0].toLowerCase();
  if (currentAction === "hide" || currentAction === "show"){
    const prev_action = currentAction === "show" ? "hide" : "show";
    DisplayManager.handleMapButtonDisplay(self.mapButton, prev_action);
  } else {
    DisplayManager.handleMapButtonDisplay(self.mapButton, "hide");
  }
};


////////////////////////////// SERVICE WORKER FUNCTIONS //////////////////////////////
/**
** Register service worker.
**/
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.register('ServiceWorker.js', {scope: self.app_scope}).then(reg => {
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
      reg.addEventListener('updatefound', () =>{
        trackInstalling(reg.installing);
      });
    }).catch((error) => {
        console.log('Oh No! Service Worker registration failed! Error: ' + error);
      });
  } else {
    console.log('Oh No! Service Workers are not supported!');
  }
};

/**
** Track service worker installation.
**/
const trackInstalling = (worker) => {
  worker.addEventListener('statechange', () => {
    if(worker.state == 'installed'){
      updateReady(worker);
    }
  });
};

/**
** When upadate is ready, then display notification.
**/
const updateReady = (worker) => {
  self.newSWorker = worker;
  self.Notifications.clearNotification();
  self.Notifications.generateUpdateNotification();
};

/**
** Dismiss update of the app.
**/
const dismissUpdate = (event) => {
  self.Notifications.removeNotification();
};

/**
** Update the app.
**/
const updateApp = (event) => {
  self.newSWorker.postMessage({action: 'skipWaiting'});
  self.Notifications.removeNotification();
  self.newSWorker = null;
};


//
