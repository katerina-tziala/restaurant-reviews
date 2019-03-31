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

  /**
  ** Get title and label from map button.
  **/
  static getMabButtonLabelTitle(next_action) {
    const label_part_a = DisplayManager.getUserView() === "restaurant" ? "restaurant" : "results";
    const label_part_b = next_action === "show" ? "on" : "from";
    const label = next_action + " " + label_part_a + " " + label_part_b + " map";
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  /**
  ** Handle display of button to open/close map.
  **/
  static handleMapButtonDisplay(button, action) {
    const next_action = action === "show" ? "hide" : "show";
    const next_icon = next_action === "hide" ? "fa-map-marker-alt" : "fa-map";
    button.setAttribute("aria-label", DisplayManager.getMabButtonLabelTitle(next_action));
    button.title = DisplayManager.getMabButtonLabelTitle(next_action);
    const icon = button.getElementsByTagName("I")[0];
    if (next_action === "hide") {
      icon.classList.remove("location_icon", "fa-map-marker-alt");
      icon.classList.add("map_icon", "fa-map");
    } else {
      icon.classList.remove("map_icon", "fa-map");
      icon.classList.add("location_icon", "fa-map-marker-alt");
    }
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


}
