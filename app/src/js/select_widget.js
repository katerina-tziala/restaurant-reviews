class SelectWidget {

  constructor(selectButton, selectList, optionKey, onOptionSelectFunction, selectedOptions) {
    this.selectButton = selectButton;
    this.selectList = selectList;
    this.optionKey = optionKey;
    this.onOptionSelect = onOptionSelectFunction;
    this.fillSelectOptionsHTLM(selectedOptions);
  }

  /**
  ** Fill options HTML for select widget.
  **/
  fillSelectOptionsHTLM(selectedOptions) {
    this.selectList.innerHTML="";
    for (let i = 0; i < selectedOptions.length; i++) {
      let selected = i === 0 ? true : false;
      let option = document.createElement("li");
      option.setAttribute("id", `${this.optionKey}_opt_${i}`);
      option.setAttribute("role", "option");
      option.setAttribute("value", selectedOptions[i]);
      option.classList.add("selectoption");
      option.setAttribute("aria-setsize", selectedOptions.length+1);
      option.setAttribute("aria-posinset", i+1);
      option.setAttribute("aria-selected", selected);
      option.innerHTML = selectedOptions[i];
      this.selectList.append(option);
    }
    this.selectList.setAttribute("aria-activedescendant", `${this.optionKey}_opt_${0}`);
    this.selectList.setAttribute("aria-expanded", "false");
    this.expanded = false;
    this.focusableElements = this.selectList.querySelectorAll(".selectoption");
    this.hoverOptions();
    this.selectWidgetManager();
  }

  /**
  ** Focus on the hovered option.
  **/
  hoverOptions() {
    this.focusableElements.forEach(option => {
      option.addEventListener("mouseover", (event) =>{
        event.target.focus();
      });
    });
  }

  /**
  ** Add event listeners for select widget.
  **/
  selectWidgetManager() {
    this.selectButton.addEventListener("keydown", (event) => {
      this.handleSelectWidgetInteraction(event.keyCode);
    });
    this.selectButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.toggleDisplayManager(this.expanded);
      this.toggleSelectOptions("null");
    });
    this.selectList.addEventListener("keydown", (event) => {
      this.handleSelectWidgetInteraction(event.keyCode);
    });
    this.selectList.addEventListener("click", (event) => {
      event.preventDefault();
      this.updateOptionAndButton(event.target);
      this.closeSelectBox(event.target);
      this.onOptionSelect();
    });
  }






  /**
  ** Handle select widget display and interaction.
  **/
  handleSelectWidgetInteraction(keyCode) {
    const currentid = parseInt(this.selectList.getAttribute("aria-activedescendant").split("_").pop());
    this.expanded = this.selectList.getAttribute("aria-expanded") === "false" ? false : true;
    switch (keyCode) {
      case 40://Down Arrow
        event.preventDefault();
        this.moveToNext(currentid + 1);
        this.selectOptionWhenClosed();
        break;
      case 38://Up Arrow
        event.preventDefault();
        this.moveToPrev(currentid - 1);
        this.selectOptionWhenClosed();
        break;
      case 36://Home
        event.preventDefault();
        this.moveToNext(this.focusableElements.length);
        this.selectOptionWhenClosed();
        break;
      case 35://End
        event.preventDefault();
        this.moveToPrev(-1);
        this.selectOptionWhenClosed();
        break;
      case 39://Right Arrow
        if (!this.expanded) {
          event.preventDefault();
          this.moveToNext(currentid + 1);
        }
        this.selectOptionWhenClosed();
        break;
      case 37://Left Arrow
        if (!this.expanded) {
          event.preventDefault();
          this.moveToPrev(currentid-1);
        }
        this.selectOptionWhenClosed();
        break;
      case 13://Enter
        event.preventDefault();
        this.toggleDisplayManager(this.expanded);
        this.toggleSelectOptions(event.target);
        break;
      case 27://Escape
        if (this.expanded) {
          event.preventDefault();
          this.toggleDisplayManager(this.expanded);
          this.toggleSelectOptions(event.target);
        }
        break;
      case 9://Tab
        if (this.expanded) {
          event.preventDefault();
          this.toggleDisplayManager(this.expanded);
          this.toggleSelectOptions(event.target);
        }
        break;
    }
  }

  /**
  ** Move to next option.
  **/
  moveToNext(nextid) {
    if (nextid > this.focusableElements.length - 1) {
      this.updateOptionAndButton(this.focusableElements[0]);
    } else {
      this.updateOptionAndButton(this.focusableElements[nextid]);
    }
  }

  /**
  ** Move to previous option.
  **/
  moveToPrev(previd) {
    if (previd < 0) {
      this.updateOptionAndButton(this.focusableElements[this.focusableElements.length - 1]);
    }else{
    this.  updateOptionAndButton(this.focusableElements[previd]);
    }
  }

  /**
  ** Select option when select is closed.
  **/
  selectOptionWhenClosed() {
    if (!this.expanded) {
      this.onOptionSelect();
    }
  }

  /**
  ** Update select button and option.
  **/
  updateOptionAndButton(element) {
    element.setAttribute("aria-selected", true);
    const selectedOption = this.selectButton.getElementsByTagName("SPAN")[0];
    selectedOption.innerHTML = element.innerHTML;
    this.selectList.setAttribute("aria-activedescendant", element.id);
    if (this.expanded) {
      element.focus();
    }
  }

  /**
  ** Handle display of select button and option list when opening/closing select options popup.
  **/
  toggleDisplayManager(expanded) {
     const arrow_prev = expanded === false ? "fa-caret-down" : "fa-caret-up";
     const arrow_next = expanded === false ? "fa-caret-up" : "fa-caret-down";
     const button_arrow = this.selectButton.getElementsByTagName("SPAN")[1];
     button_arrow.classList.remove(arrow_prev);
     button_arrow.classList.add(arrow_next);
     const button_tabindex = expanded === false ? (-1) : 0;
     this.selectList.setAttribute("aria-expanded", !expanded);
     this.selectButton.setAttribute("tabindex", button_tabindex);
  }

  /**
  ** Toggle select options list.
  **/
  toggleSelectOptions(target) {
    if (this.expanded) {
      this.closeSelectBox(target);
      this.onOptionSelect();
    } else {
      this.openSelectBox();
    }
  }

  /**
  ** Open select box.
  **/
  openSelectBox() {
    InterfaceManager.displayElement(this.selectList);
    this.selectButton.blur();
    const activedescendant = this.selectList.getAttribute("aria-activedescendant");
    for (let i = 0; i < this.focusableElements.length; i++) {
      this.focusableElements[i].setAttribute("aria-selected", "false");
    }
    const active_element = document.getElementById(activedescendant);
    active_element.classList.add("selected");
    active_element.setAttribute("aria-selected", "true");
    InterfaceManager.setTabIndex(this.focusableElements, 0);
    active_element.focus();
    this.expanded = true;
  }

  /**
  ** Close select box.
  **/
  closeSelectBox(target, outside = false) {
    InterfaceManager.hideElement(this.selectList);
    InterfaceManager.setTabIndex(this.focusableElements, -1);
    if (!outside) {
      this.selectButton.focus();
    }
    if (target!="null") {
      this.selectList.setAttribute("aria-activedescendant", target.id);
    }
    for (let i = 0; i < this.focusableElements.length; i++) {
      this.focusableElements[i].classList.remove("selected");
    }
    this.expanded = false;
    this.toggleDisplayManager(true);
  }

}
