class UIManager {
  _hideClass = "hidden";
  _spinClass = "spin";
  constructor(main, loader, spinner){
      this.main = main;
      this.loader = loader;
      this.spinner = spinner;
  }





  /**
  ** Remove class.
  **/
  removeClass(element, classname) {
    element.classList.remove(classname);
  }

  /**
  ** Add class.
  **/
  addClass(element, classname) {
    element.classList.add(classname);
  }

  /**
  ** Display element.
  **/
  displayElement(element) {
    this.removeClass(element, this._hideClass);
  }

  /**
  ** Hide element.
  **/
  hideElement(element) {
    this.addClass(element, this._hideClass);
  }

  /**
  ** Hide loader.
  **/
  hideLoader() {
    this.removeClass(this.spinner, this._spinClass);
    this.hideElement(this.loader);
    this.displayElement(this.main);
  }



}
