class InterfaceManager {
  /**
  ** Display element.
  **/
  static displayElement(element) {
    element.classList.remove(appParams.cssClasses.hidden);
  }

  /**
  ** Hide element.
  **/
  static hideElement(element) {
    element.classList.add(appParams.cssClasses.hidden);
  }

  /**
  ** Set tabindex of multiple elements.
  **/
  static setTabIndex(elements, value) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute("tabindex", value);
    }
  }

  /**
  ** Hide loader.
  **/
  static hideLoader() {
    self.spinner.classList.remove(appParams.cssClasses.spinClass);
    InterfaceManager.hideElement(self.loader);
    InterfaceManager.displayElement(self.main);
  }

  /**
  ** Show loader.
  **/
  static showLoader() {
    self.spinner.classList.add(appParams.cssClasses.spinClass);
    InterfaceManager.hideElement(self.main);
    InterfaceManager.displayElement(self.loader);
  }

  /**
  ** Check if loader is displayed.
  **/
  static loaderIsDisplayed() {
    return !self.loader.classList.contains(appParams.cssClasses.hidden) ? true : false;
  }

  /**
  ** Get the displayed view to the user.
  **/
  static getUserView() {
    const url = window.location.href;
    const view = url.split("/").pop().split(".")[0];
    return view === "" ? null : view;
  }

  /**
  ** Get a parameter by name from page URL.
  **/
  static getParameterByName(name, url) {
    if (!url)
      url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
      results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
  ** Redirect user.
  **/
  static redirectUser(redirectLink) {
    window.location.replace(redirectLink);
  }

  /**
  ** Reload the app.
  **/
  static reloadApp() {
    DBHelper.clearIndexedBD();
    window.location.href = window.location.href;
  }

  /**
  ** Refresh the app.
  **/
  static refreshApp() {
    DBHelper.clearIndexedBD();
    window.location.reload(true);
  }

  /**
  ** Decode HTML entities.
  **/
  static decodeEntities(encodedString) {
    let textArea = document.createElement("textarea");
    textArea.innerHTML = encodedString;
    return textArea.value;
  }

  /**
  ** Format date for review.
  **/
  static formatDate(dateToFormat) {
    const date = new Date(dateToFormat);
    const dateparts = date.toString().split(" ");
    const formated = dateparts[2]+" "+dateparts[1]+" "+dateparts[3];
    return formated;
  }

  /**
  ** Get time.
  **/
  static getTime(dateToGetTime) {
    let date = new Date(dateToGetTime),
        hours = (date.getHours()<10?"0":"") + date.getHours(),
        minutes = (date.getMinutes()<10?"0":"") + (date.getMinutes());
    return hours+":"+ minutes;
  }

  /**
  ** Get date and time.
  **/
  static getDateTime(date) {
    const datestring = InterfaceManager.formatDate(date);
    const time = InterfaceManager.getTime(date);
    const datetime = datestring + ", " + time;
    return datetime;
  }


  /**
  ** Create button.
  **/
  static createButton(id, text, aria, functionName) {
   const button = document.createElement("button");
   button.innerHTML = text;
   button.setAttribute("id", id);
   button.setAttribute("aria-label", aria);
   button.addEventListener("click", functionName);
   button.type = "button";
   return button;
  }

  /**
  ** Remove message about restaurants/reviews results.
  **/
  static removeNoResultsFetchingeMessage() {
    const fetcherMessage = document.querySelectorAll(".fetcherMessageContainer");
    if (fetcherMessage.length>0) {
      fetcherMessage[0].remove();
    }
  }

  /**
  ** Display proper message about fetching restaurants/reviews results.
  **/
  static displayNoResultsFetchingMessage(type, container, list) {
    const div = document.createElement("div");
    div.className = "fetcherMessageContainer";
    const p = document.createElement("p");
    p.className = "fetcherMessage";
    p.setAttribute("role" , "alert")
    p.setAttribute("aria-live" , "assertive");
    const feedback_icon = document.createElement("i");
    feedback_icon.classList.add("fas", "fa-exclamation-triangle", "feedback_icon");
    const message_p = document.createElement("p");
    message_p.innerHTML = appParams.noResultsFetchingMessages[type];
    message_p.className = "fetcherFeedback";
    p.append(feedback_icon, message_p);
    div.append(p);
    container.insertBefore(div, list);
  }

  /**
  ** Display freezer layer.
  **/
  static displayFreezer() {
    const freezer = document.createElement("div");
    freezer.className = appParams.cssClasses.freezer;
    document.body.appendChild(freezer);
  }

  /**
  ** Remove freezer layer.
  **/
  static removeFreezer() {
    const freezer = document.querySelectorAll(".freezer");
    if (freezer.length>0) {
      freezer[0].remove();
    }
  }

}
