"use strict";
let main, loader, spinner, mapButton;
let InterfaceManager, MapManager, Notifications;

const start_url = "http://localhost:8887/index.html";

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


//  console.log(self.Notifications.getNotificationContent("offline"));
//  self.Notifications.generateBasicNotification(self.Notifications.getNotificationContent("offline"), 5000);

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
  enableMap();
  const onlineNotification = self.Notifications.getNotificationContent("online");
  self.Notifications.generateBasicNotification(onlineNotification, 5000);
});

/**
** Notify users when offline.
**/
window.addEventListener("offline", (event) => {
  event.preventDefault();
  self.Notifications.clearNotification();
  let offlineNotification = "";
  if(!mapLoaded()) {
     offlineNotification = self.Notifications.getNotificationContent("offline_noMap");
    disableMap();
  } else {
    offlineNotification = self.Notifications.getNotificationContent("offline");
  }
  self.Notifications.generateBasicNotification(offlineNotification, 5000);
});






/**
** Close notification and clear timeout.
**/
const closeNotification = (event) => {
  event.preventDefault();
  self.Notifications.hideNotification();
  self.Notifications.clearNotification();
};



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






//
