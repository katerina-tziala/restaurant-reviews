class DisplayManager {
  static _hidenClass = "hidden";

  /**
  ** Display element.
  **/
  static displayElement(element) {
    element.classList.remove(this._hidenClass);
  }

  /**
  ** Hide element.
  **/
  static hideElement(element) {
    element.classList.add(this._hidenClass);
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
  ** Get the displayed view to the user.
  **/
  static getUserView() {
    const url = window.location.href;
    const view = url.split("/").pop().split(".")[0];
    return view === "" ? null : view;
  }

  /**
  ** Redirect user.
  **/
  static redirectUser(redirectLink) {
    window.location.replace(redirectLink);
  }

  /**
  ** Get a parameter by name from page URL.
  **/
  static getParameterByName(name, url) {
    if (!url)
      url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
      results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /**
  ** Decode HTML entities.
  **/
  static decodeEntities(encodedString) {
    let textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
  }

  /**
  ** Format date for review.
  **/
  static formatDate(incomingdate) {
    const date = new Date(incomingdate);
    const dateparts = date.toString().split(" ");
    const formated = dateparts[2]+" "+dateparts[1]+" "+dateparts[3];
    return formated;
  }

}
