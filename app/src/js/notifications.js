class NotificationsManager {
  _displayClassCSS = "display_notification";

  _notificationMessages = {
    clear: {
      title: "",
      message: ""},
    offline: {
      title: "Unable to connect! retrying...",
      message: "You are able to use the Restaurant Reviews app while offline!"},
    offline_noMap: {
      title: "Unable to connect! retrying...",
      message: `You are able to use the Restaurant Reviews app while offline!<br><i><b>Notice: </b>The map is not currently available since it was not loaded yet!<i>`},
    online: {
      title: "You are back online!",
      message: "Internet connection was successfully re-established!"},
    update: {
      title: "update available",
      message: "A new version of the Restaurant Reviews app is available!"},
    unable_to_connect_retrying: {
      title: "Unable to connect!",
      message: `Retrying in <span id="message_timer"></span>`},
    map_failure: {
      title: "Ooops!",
      message: `Map wasn't loaded successfully!<br>To be able to display the map check your internet connection and refresh the app.`}
  };

  _notificationTimeout = 0;
  _notificationInterval = 0;
  _notificationCountdown = 0;

  constructor() {
    this.createNotificationsHTML();
    this.notificationContainer = document.getElementById("notification_container");
    this.notificationHeader = document.getElementById("notification_header");
    this.notificationTitle = document.getElementById("notification_title");
    this.notificationBody = document.getElementById("notification_body");

  }

  /**
  ** Create HTML for notifications.
  **/
  createNotificationsHTML() {
    const notification_container = document.createElement("div");
    notification_container.setAttribute("id", "notification_container");
    notification_container.classList.add("notification");
    const notification_header = document.createElement("div");
    notification_header.setAttribute("id", "notification_header");
    const notification_bell = document.createElement("i");
    notification_bell.setAttribute("id", "notification_bell");
    notification_bell.classList.add("fas", "fa-bell");
    const notification_title = document.createElement("p");
    notification_title.setAttribute("id", "notification_title");
    notification_header.append(notification_bell, notification_title);
    const notification_body = document.createElement("div");
    notification_body.setAttribute("id", "notification_body");
    notification_container.append(notification_header, notification_body);
    document.body.appendChild(notification_container);
  }

  /**
  ** Display notification.
  **/
  displayNotification() {
    this.notificationContainer.classList.add(this._displayClassCSS);
    this.notificationContainer.setAttribute("role", "alert");
    this.notificationContainer.setAttribute("aria-live", "assertive");
  }

  /**
  ** Hide notification.
  **/
  hideNotification() {
    this.notificationContainer.classList.remove(this._displayClassCSS);
    this.notificationContainer.removeAttribute("role");
    this.notificationContainer.removeAttribute("aria-live");
  }

  /**
  ** Get notification content.
  **/
  getNotificationContent(key) {
    return this._notificationMessages[key];
  }
  /**
  ** Create notification content.
  **/
  createNotificationContent(notification) {
    this.notificationTitle.innerHTML = notification.title;
    this.notificationBody.innerHTML= notification.message;
  }

  /**
  ** Display a countdown notification. When it reaches to 0 clear countdown execute the next function.
  **/
  addNotificationCountDown(callback) {
    this._notificationCountdown = 0;
    this._notificationInterval = 0;
    this._notificationCountdown = 5;
    let timer = document.getElementById("message_timer");
    timer.innerHTML = this._notificationCountdown;
    this._notificationInterval = setInterval(() => {
      this._notificationCountdown--;
      if (this._notificationCountdown < 1) {
        this.clearNotificationCountDown();
        callback();
      }
      timer.innerHTML = this._notificationCountdown;
    }, 1000);
  };

  /**
  ** Clear notification.
  **/
  clearNotification() {
    this.createNotificationContent(this.getNotificationContent("clear"));

    console.log("clearNotification");
  //  removeFreezer();
    if (this._notificationTimeout > 0) {
      clearTimeout(this._notificationTimeout);
    }

    if (this._notificationInterval > 0) {
      clearNotificationCountDown();
    }

    //this.notificationContainer.classList.remove("update_app");


  };

  /**
  ** Clear notification count down.
  **/
  clearNotificationCountDown() {
    clearInterval(this._notificationInterval);
    this._notificationCountdown = 0;
  }


  /**
  ** Remove notification.
  **/
  removeNotification() {
    this.hideNotification();
    this._notificationTimeout = setTimeout(() => {this.clearNotification();}, 4000);
  }



  /////////////////////////// GENERATE NOTIFICATIONS ///////////////////////////
  /**
  ** Generate basic notification.
  **/
  generateBasicNotification(notification, timeout) {
    this.createNotificationContent(notification);
    this.createGotItButton();
    this.displayNotification();
    this._notificationTimeout = setTimeout(() => {this.hideNotification();}, timeout);
  }

  /**
  ** Generate update notification.
  **/
  generateUpdateNotification() {
    this.createNotificationContent(this.getNotificationContent("update"));
    const container = document.createElement("div");
    container.className = "buttons_wrapper";
    const updateButton = DisplayManager.createButton("btn_update", "update", "update app", updateApp);
    updateButton.classList.add("notification_button", "update_btn");
    const dismissButton = DisplayManager.createButton("btn_dismiss", "dismiss", "dismiss update", dismissUpdate);
    dismissButton.classList.add("notification_button", "update_btn");
    container.append(updateButton, dismissButton);
    //this.notificationContainer.classList.add("update_app");
    this.notificationBody.append(container);
    this.displayNotification();
  }







  ////////////////////// CREATE BUTTONS FOR NOTIFICATIONS //////////////////////


  getButtonsContainer() {
    let buttonsContainer = this.notificationBody.querySelectorAll(".buttons_wrapper");
    if (buttonsContainer.length > 0) {
      buttonsContainer = buttonsContainer[0];
    } else {
      buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("buttons_wrapper");
    }
    return buttonsContainer;
  }

  /**
  ** Create "got it" button for notification.
  **/
  createGotItButton() {
    const buttonsContainer = this.getButtonsContainer();
    const gotitButton = DisplayManager.createButton("btn_gotit", "got it", "close notification", closeNotification);
    gotitButton.classList.add("notification_button", "gotit_btn");
    buttonsContainer.append(gotitButton);
    this.notificationBody.append(buttonsContainer);
  }
  /**
  ** Create "refresh"/ "retry" button for notification.
  **/
  createReActionButton(type, title, callback) {
    const buttonsContainer = this.getButtonsContainer();
    let buttonText = type;
    if(buttonText.split("_").length > 1){
      buttonText = buttonText.split("_")[0];
    }
    const button = DisplayManager.createButton(`btn_${type}`, buttonText, title, callback);
    button.classList.add("notification_button", `btn_${type}`);
    buttonsContainer.append(button);
    this.notificationBody.append(buttonsContainer);
  }
}
