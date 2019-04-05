"use strict";
let notificationTimeout = 0;
let notificationInterval = 0;
let notificationCountdown = 0;


/**
** Display notification.
**/
const displayNotification = () => {
  self.notificationContainer.classList.add(appParams.cssClasses.displayNotification);
  self.notificationContainer.setAttribute("role", "alert");
  self.notificationContainer.setAttribute("aria-live", "assertive");
};

/**
** Hide notification.
**/
const hideNotification = () => {
  self.notificationContainer.classList.remove(appParams.cssClasses.displayNotification);
  self.notificationContainer.removeAttribute("role");
  self.notificationContainer.removeAttribute("aria-live");
};

/**
** Get notification content.
**/
const getNotificationContent = (key) => {
  return appParams.notifications[key];
};

/**
** Create notification content.
**/
const createNotificationContent = (notification) => {
  self.notificationTitle.innerHTML = notification.title;
  self.notificationBody.innerHTML = notification.message;
  self.notificationContainer.setAttribute("notification_type", notification.type);
};

/**
** Clear notification.
**/
const clearNotification = () => {
  createNotificationContent(getNotificationContent("clear"));
  if (self.notificationTimeout > 0) {
    clearTimeout(this.notificationTimeout);
  }
  if (self.notificationInterval > 0) {
    clearNotificationCountDown();
  }
    console.log("clearNotification");
  //  removeFreezer();
    //this.notificationContainer.classList.remove("update_app");


};


/**
** Clear notification count down.
**/
const clearNotificationCountDown = () => {
  clearInterval(self.notificationInterval);
  self.notificationCountdown = 0;
};


/////////////////////// CREATE BUTTONS FOR NOTIFICATIONS ///////////////////////
/**
** Create buttons container or get the existing one.
**/
const getButtonsContainer = () => {
  let buttonsContainer = self.notificationBody.querySelectorAll(".buttons_wrapper");
  if (buttonsContainer.length > 0) {
    buttonsContainer = buttonsContainer[0];
  } else {
    buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons_wrapper");
  }
  return buttonsContainer;
};

/**
** Create "got it" button for notification.
**/
const createGotItButton = () => {
  const buttonsContainer = getButtonsContainer();
  const gotitButton = InterfaceManager.createButton("btn_gotit", "got it", "close notification", closeNotification);
  gotitButton.classList.add("notification_button", "gotit_btn");
  buttonsContainer.append(gotitButton);
  self.notificationBody.append(buttonsContainer);
};

//////////////////////////// GENERATE NOTIFICATIONS ////////////////////////////
/**
** Generate basic notification.
**/
const generateBasicNotification = (notification, timeout) => {
  clearNotification();
  createNotificationContent(notification);
  createGotItButton();
  displayNotification();
  if(timeout > 0){
    self.notificationTimeout = setTimeout(() => {hideNotification();}, timeout);
  }
};

/////////////////////// INTERACTION FOR NOTIFICATIONS ///////////////////////
/**
** Close notification and clear timeout.
**/
const closeNotification = (event) => {
  event.preventDefault();
  hideNotification();
  const notification_type = self.notificationContainer.getAttribute("notification_type");
  if (notification_type === "map_failure") {
    enableMap();
  }
};





// class NotificationsManager {
//   _displayClassCSS = "display_notification";
//
//   _notificationMessages = {
//     clear: {
//       title: "",
//       message: ""},
//     offline: {
//       title: "Unable to connect! retrying...",
//       message: "You are able to use the Restaurant Reviews app while offline!"},
//     offline_noMap: {
//       title: "Unable to connect! retrying...",
//       message: `You are able to use the Restaurant Reviews app while offline!<br><i><b>Notice: </b>The map is not currently available since it was not loaded yet!<i>`},
//     online: {
//       title: "You are back online!",
//       message: "Internet connection was successfully re-established!"},
//     update: {
//       title: "update available",
//       message: "A new version of the Restaurant Reviews app is available!"},
//     unable_to_connect_retrying: {
//       title: "Unable to connect!",
//       message: `Retrying in <span id="message_timer"></span>`},
//     map_failure: {
//       title: "Ooops!",
//       message: `Map wasn't loaded successfully!<br>To be able to display the map check your internet connection and refresh the app.`}
//   };
//
//   _notificationTimeout = 0;
//   _notificationInterval = 0;
//   _notificationCountdown = 0;
//

//

//
//
//   /**
//   ** Display a countdown notification. When it reaches to 0 clear countdown execute the next function.
//   **/
//   addNotificationCountDown(callback) {
//     this._notificationCountdown = 0;
//     this._notificationInterval = 0;
//     this._notificationCountdown = 5;
//     let timer = document.getElementById("message_timer");
//     timer.innerHTML = this._notificationCountdown;
//     this._notificationInterval = setInterval(() => {
//       this._notificationCountdown--;
//       if (this._notificationCountdown < 1) {
//         this.clearNotificationCountDown();
//         callback();
//       }
//       timer.innerHTML = this._notificationCountdown;
//     }, 1000);
//   };
//



//
//
//   /**
//   ** Remove notification.
//   **/
//   removeNotification() {
//     this.hideNotification();
//     this._notificationTimeout = setTimeout(() => {this.clearNotification();}, 4000);
//   }
//
//
//
//   /////////////////////////// GENERATE NOTIFICATIONS ///////////////////////////
//   /**
//   ** Generate basic notification.
//   **/
//   generateBasicNotification(notification, timeout) {
//     this.createNotificationContent(notification);
//     this.createGotItButton();
//     this.displayNotification();
//     this._notificationTimeout = setTimeout(() => {this.hideNotification();}, timeout);
//   }
//
//   /**
//   ** Generate update notification.
//   **/
//   generateUpdateNotification() {
//     this.createNotificationContent(this.getNotificationContent("update"));
//     const container = document.createElement("div");
//     container.className = "buttons_wrapper";
//     const updateButton = DisplayManager.createButton("btn_update", "update", "update app", updateApp);
//     updateButton.classList.add("notification_button", "update_btn");
//     const dismissButton = DisplayManager.createButton("btn_dismiss", "dismiss", "dismiss update", dismissUpdate);
//     dismissButton.classList.add("notification_button", "update_btn");
//     container.append(updateButton, dismissButton);
//     //this.notificationContainer.classList.add("update_app");
//     this.notificationBody.append(container);
//     this.displayNotification();
//   }
//
//
//
//
//
//
//
//   ////////////////////// CREATE BUTTONS FOR NOTIFICATIONS //////////////////////
//
//
//   /**
//   ** Create "refresh"/ "retry" button for notification.
//   **/
//   createReActionButton(type, title, callback) {
//     const buttonsContainer = this.getButtonsContainer();
//     let buttonText = type;
//     if(buttonText.split("_").length > 1){
//       buttonText = buttonText.split("_")[0];
//     }
//     const button = DisplayManager.createButton(`btn_${type}`, buttonText, title, callback);
//     button.classList.add("notification_button", `btn_${type}`);
//     buttonsContainer.append(button);
//     this.notificationBody.append(buttonsContainer);
//   }
// }
