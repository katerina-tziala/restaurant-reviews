class DisplayManager {
  static _hidenClass="hidden";

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
}
