class UIManager {
  _hideClass = "hidden";
  _spinClass = "spin";
  _noResultsFetchingMessages = {
     "restaurants": `<span>No results matching your criteria!</span><span>Please try again!</span><i>Hint: Search with a different combination of neighborhoods and cuisines!</i>`,
     "reviews": `<span>No reviews yet!</span>`
  };

  constructor(main, loader, spinner) {
      this.main = main;
      this.loader = loader;
      this.spinner = spinner;
  }

  /**
  ** Hide loader.
  **/
  hideLoader() {
    this.spinner.classList.remove(this._spinClass);
    DisplayManager.hideElement(this.loader);
    DisplayManager.displayElement(this.main);
  }

  /**
  ** Display proper message about fetching restaurants/reviews results.
  **/
  displayNoResultsFetchingMessage(type, container, list) {
    const div = document.createElement("div");
    div.className = "fetcherMessageContainer";
    const p = document.createElement("p");
    p.className = "fetcherMessage";
    p.setAttribute("role" , "alert")
    p.setAttribute("aria-live" , "assertive");
    const feedback_icon = document.createElement("i");
    feedback_icon.classList.add("fas", "fa-exclamation-triangle", "feedback_icon");
    const message_p = document.createElement("p");
    message_p.innerHTML = this._noResultsFetchingMessages[type];
    message_p.className = "fetcherFeedback";
    p.append(feedback_icon, message_p);
    div.append(p);
    container.insertBefore(div, list);
  };

  /**
  ** Remove message about restaurants/reviews results.
  **/
  removeNoResultsFetchingeMessage() {
    const fetcherMessage = document.querySelectorAll(".fetcherMessageContainer");
    if (fetcherMessage.length>0) {
      fetcherMessage[0].remove();
    }
  };
}
