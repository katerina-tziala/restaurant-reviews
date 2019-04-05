"use strict";
let main, loader, spinner, mapContainer, mapButton,
notificationContainer, notificationHeader, notificationTitle, notificationBody;

let newSWorker;


const start_url = "http://localhost:8887/index.html";
const app_scope = "/";

document.addEventListener("DOMContentLoaded", (event) => {
  initApp();
  initView();

//displayNotification();

});


/**
** Initialize the App.
**/
const initApp = () => {
  self.main = document.getElementById("main");
  self.loader = document.getElementById("loader_container");
  self.spinner = document.getElementById("spinner");
  self.mapButton = document.getElementById("mapButton");
  self.mapContainer = document.getElementById("map_container");
  self.notificationContainer = document.getElementById("notification_container");
  self.notificationHeader = document.getElementById("notification_header");
  self.notificationTitle = document.getElementById("notification_title");
  self.notificationBody = document.getElementById("notification_body");
  //self.InterfaceManager = new UIManager(self.main, self.loader, self.spinner);
  //self.mapManager = null;
  //self.Notifications = new NotificationsManager();
  self.newSWorker = null;

  //console.log(InterfaceManager.test());
//  registerServiceWorker();
};





/**
** Initialize view depending on the page that was loaded.
**/
const initView = () => {
  const pageView = InterfaceManager.getUserView();

  switch (pageView) {
    case "index":
      renderIndex();
      break;
    case "restaurant":
      renderRestaurantInfo();
      break;
    default:
    InterfaceManager.redirectUser(self.start_url);
  }
};



/**
** Notify users when online.
**/
// window.addEventListener("online", (event) => {
//   event.preventDefault();
//   self.Notifications.clearNotification();
//   if (self.InterfaceManager.loaderIsDisplayed()) {
//     refreshApp();
//   } else {
//     enableMap();
//     const onlineNotification = self.Notifications.getNotificationContent("online");
//     self.Notifications.generateBasicNotification(onlineNotification, 5000);
//   }
// });

/**
** Notify users when offline.
**/
// window.addEventListener("offline", (event) => {
//   event.preventDefault();
//   self.Notifications.clearNotification();
//   let offlineNotification = "";
//   if (self.InterfaceManager.loaderIsDisplayed()) {
//     offlineNotification = self.Notifications.getNotificationContent("unable_to_connect_retrying");
//     self.Notifications.createNotificationContent(offlineNotification);
//     self.Notifications.createReActionButton("retry", "retry to connect", reloadApp);
//     self.Notifications.addNotificationCountDown(() => {
//       reloadApp();
//     });
//     self.Notifications.displayNotification();
//   } else {
//     if(!mapLoaded()) {
//        offlineNotification = self.Notifications.getNotificationContent("offline_noMap");
//       disableMap();
//     } else {
//       offlineNotification = self.Notifications.getNotificationContent("offline");
//     }
//     self.Notifications.generateBasicNotification(offlineNotification, 5000);
//   }
// });










/////////////////////////////////// MAP FUNCTIONS ///////////////////////////////////



//
// const mapFailure = () => {
// //  self.Notifications.clearNotification();
//   const mapContainer = document.getElementById("map_container");
//   InterfaceManager.hideElement(mapContainer);
//   mapContainer.classList.remove("displaymap");
//   disableMap();
//   // self.Notifications.createNotificationContent(self.Notifications.getNotificationContent("map_failure"));
//   // self.Notifications.createReActionButton("refresh", "refresh the app", refreshApp);
//   // self.Notifications.createReActionButton("dismiss", "dissmiss map", closeNotification);
//   // self.Notifications.displayNotification();
// };

////////////////////////////// SERVICE WORKER FUNCTIONS //////////////////////////////
/**
** Register service worker.
**/
// const registerServiceWorker = () => {
//   if ('serviceWorker' in navigator) {
//     // Register the service worker
//     navigator.serviceWorker.register('ServiceWorker.js', {scope: self.app_scope}).then(reg => {
//       if (!navigator.serviceWorker.controller) {
//         return;
//       }
//       if (reg.waiting) {
//         updateReady(reg.waiting);
//         return;
//       }
//       if (reg.installing) {
//         trackInstalling(reg.installing);
//         return;
//       }
//       reg.addEventListener('updatefound', () =>{
//         trackInstalling(reg.installing);
//       });
//     }).catch((error) => {
//         console.log('Oh No! Service Worker registration failed! Error: ' + error);
//       });
//   } else {
//     console.log('Oh No! Service Workers are not supported!');
//   }
// };
//
// /**
// ** Track service worker installation.
// **/
// const trackInstalling = (worker) => {
//   worker.addEventListener('statechange', () => {
//     if(worker.state == 'installed'){
//       updateReady(worker);
//     }
//   });
// };
//
// /**
// ** When upadate is ready, then display notification.
// **/
// const updateReady = (worker) => {
//   self.newSWorker = worker;
//   self.Notifications.clearNotification();
//   self.Notifications.generateUpdateNotification();
// };
//
// /**
// ** Dismiss update of the app.
// **/
// const dismissUpdate = (event) => {
//   self.Notifications.removeNotification();
// };
//
// /**
// ** Update the app.
// **/
// const updateApp = (event) => {
//   self.newSWorker.postMessage({action: 'skipWaiting'});
//   self.Notifications.removeNotification();
//   self.newSWorker = null;
// };
