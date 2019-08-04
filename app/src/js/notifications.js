"use strict";

// Display notification:
const displayNotification = () => {
  self.notificationContainer.classList.add(appParams.cssClasses.displayNotification);
  self.notificationContainer.setAttribute("role", "alert");
  self.notificationContainer.setAttribute("aria-live", "assertive");
};

// Hide notification:
const hideNotification = () => {
  self.notificationContainer.classList.remove(appParams.cssClasses.displayNotification);
  self.notificationContainer.removeAttribute("role");
  self.notificationContainer.removeAttribute("aria-live");
};

// Get notification content:
const getNotificationContent = (key) => {
  return appParams.notifications[key];
};

// Create notification content:
const createNotificationContent = (notification) => {
  self.notificationTitle.innerHTML = notification.title;
  self.notificationBody.innerHTML = notification.message;
  self.notificationContainer.setAttribute("notification_type", notification.type);
};

// Clear notification:
const clearNotification = () => {
  createNotificationContent(getNotificationContent("clear"));
  if (self.notificationTimeout > 0) {
    clearTimeout(self.notificationTimeout);
  }
  if (self.notificationInterval > 0) {
    clearNotificationCountDown();
  }
  InterfaceManager.removeFreezer();
};

// Display a countdown notification. When it reaches to 0 clear countdown execute the next function:
const addNotificationCountDown = (callback) => {
  self.notificationCountdown = 0;
  self.notificationInterval = 0;
  self.notificationCountdown = 5;
  let timer = document.getElementById("message_timer");
  timer.innerHTML = self.notificationCountdown;
  self.notificationInterval = setInterval(() => {
    self.notificationCountdown--;
    if (self.notificationCountdown < 1) {
      clearNotificationCountDown();
      callback();
      return;
    }
    timer.innerHTML = self.notificationCountdown;
  }, 1000);
};

// Clear notification count down:
const clearNotificationCountDown = () => {
  clearInterval(self.notificationInterval);
  self.notificationCountdown = 0;
};

// Close notification and clear timeout:
const closeNotification = (event) => {
  event.preventDefault();
  hideNotification();
  const notification_type = self.notificationContainer.getAttribute("notification_type");
  if (notification_type === "map_failure") {
    enableMap();
  }
};

/**
**  CREATE BUTTONS FOR NOTIFICATIONS
**/
// Create buttons container or get the existing one:
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

// Create "got it" button for notification:
const createGotItButton = () => {
  const buttonsContainer = getButtonsContainer();
  const gotitButton = InterfaceManager.createButton("btn_gotit", "got it", "close notification", closeNotification);
  gotitButton.classList.add("notification_button", "gotit_btn");
  buttonsContainer.append(gotitButton);
  self.notificationBody.append(buttonsContainer);
};

// Create action button for notification:
const createNotificationActionButton = (type, text, title, callback) => {
  const buttonsContainer = getButtonsContainer();
  const button = InterfaceManager.createButton(`btn_${type}`, text, title, callback);
  button.classList.add("notification_button", `btn_${type}`);
  buttonsContainer.append(button);
  self.notificationBody.append(buttonsContainer);
};

/**
**  GENERATE NOTIFICATIONS
**/
// Generate basic notification:
const generateBasicNotification = (notification, timeout) => {
  clearNotification();
  createNotificationContent(notification);
  createGotItButton();
  displayNotification();
  if (timeout > 0) {
    self.notificationTimeout = setTimeout(() => {hideNotification();}, timeout);
  }
};

// Generate update notification:
const generateUpdateNotification = () => {
  clearNotification();
  createNotificationContent(getNotificationContent("update"));
  createNotificationActionButton("update", "update", "update app", updateApp);
  createNotificationActionButton("dismiss", "dismiss", "dismiss update", dismissUpdate);
  displayNotification();
};

// Generate notification of failure on user action:
const generateFailureNotification = (idbsupport) => {
  let notification;
  if (idbsupport) {
    notification = getNotificationContent("failed_request_cached");
  }else{
    notification = getNotificationContent("failed_request");
  }
  generateBasicNotification(notification, 15000);
};

// Generate notification for unsaved changes:
const generateUnsavedChangesNotification = (failedRequestsNumber) => {
  clearNotification();
  createNotificationContent(getNotificationContent("unsaved_changes"));
  const chng = failedRequestsNumber === 1 ? "change" : "changes";
  const unsaved_number = document.getElementById("unsaved_number");
  unsaved_number.innerHTML = failedRequestsNumber;
  const unsaved_changes = document.getElementById("unsaved_changes");
  unsaved_changes.innerHTML = chng;
  createNotificationActionButton("savenow", "save now", "save changes now", saveNow);
  addNotificationCountDown(saveNow);
  InterfaceManager.displayFreezer();
  displayNotification();
};

// Generate notification to refresh the app:
const generateRefreshNotification = () => {
  clearNotification();
  createNotificationContent(getNotificationContent("refresh"));
  createNotificationActionButton("refresh", "refresh", "refresh app", InterfaceManager.refreshApp);
  addNotificationCountDown(InterfaceManager.refreshApp);
  displayNotification();
};
