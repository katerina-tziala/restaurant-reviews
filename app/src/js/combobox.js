"use strict";
const comboBoxManager = (comboButton, comboList) => {
  comboButton.addEventListener("keydown", (event) => {
    const params = {
      "keyCode": event.keyCode,
      "comboButton": comboButton,
      "comboBox": comboList,
      "focusableElements": comboList.querySelectorAll(".selectoption")
    };
    handleComboBox(params);
  });
  comboButton.addEventListener("click", (event) => {
    event.preventDefault();
    const expanded = comboButton.getAttribute("aria-expanded")==="false"?false:true;
    const params = {
      "comboButton": comboButton,
      "comboBox": comboList,
      "focusableElements": comboList.querySelectorAll(".selectoption")
    };
    handleComboButton(comboButton);
    if (expanded) {
      params.target="null";
      closeComboBox(params);
      updateRestaurants();
    }else{
      openComboBox(params);
    }
  });
  comboList.addEventListener("keydown", (event) => {
    const params = {
      "keyCode": event.keyCode,
      "comboButton": comboButton,
      "comboBox": comboList,
      "focusableElements": comboList.querySelectorAll(".selectoption")
    };
    handleComboBox(params);
  });
  comboList.addEventListener("click", (event) => {
    event.preventDefault();
    const params = {
      "keyCode": event.keyCode,
      "comboButton": comboButton,
      "comboBox": comboList,
      "focusableElements": comboList.querySelectorAll(".selectoption"),
      "target": event.target
    };
    handleComboButton(comboButton);
    updateOptionAndButton(event.target, comboButton);
    closeComboBox(params);
    updateRestaurants();
  });
  hoverOptions(comboList.querySelectorAll(".selectoption"));
};
/**
** Focus on the hovered option.
**/
const hoverOptions = (options) => {
  options.forEach(option => {
    option.addEventListener("mouseover", (event) =>{
      event.target.focus();
    });
  });
};
/**
** Handle combobox display and interaction.
**/
const handleComboBox = (params) => {
  const currentid = parseInt(params.comboButton.getAttribute("aria-activedescendant").split("_").pop());
  const expanded = params.comboButton.getAttribute("aria-expanded")==="false"?false:true;
  params.expanded = expanded;
  switch (params.keyCode) {
    case 40://Down Arrow
      event.preventDefault();
      moveToNext(currentid+1, params.focusableElements, params.comboButton);
      if (!expanded) {
        updateRestaurants();
      }
      break;
    case 38://Up Arrow
      event.preventDefault();
      moveToPrev(currentid-1, params.focusableElements, params.comboButton);
      if (!expanded) {
        updateRestaurants();
      }
      break;
    case 36://Home
      event.preventDefault();
      moveToNext(params.focusableElements.length, params.focusableElements, params.comboButton);
      if (!expanded) {
        updateRestaurants();
      }
      break;
    case 35://End
      event.preventDefault();
      moveToPrev(-1, params.focusableElements, params.comboButton);
      if (!expanded) {
        updateRestaurants();
      }
      break;
    case 39://Right Arrow
      if (!expanded) {
        event.preventDefault();
        moveToNext(currentid+1, params.focusableElements, params.comboButton);
        updateRestaurants();
      }
      break;
    case 37://Left Arrow
      if (!expanded) {
        event.preventDefault();
        moveToPrev(currentid-1, params.focusableElements, params.comboButton);
        updateRestaurants();
      }
      break;
    case 13://Enter
      event.preventDefault();
      params.target = event.target;
      handleComboButton(params.comboButton);
      if (expanded) {
        closeComboBox(params);
        updateRestaurants();
      }else{
        openComboBox(params);
      }
      break;
    case 27://Escape
      if (expanded) {
        event.preventDefault();
        params.target = event.target;
        handleComboButton(params.comboButton);
        closeComboBox(params);
        updateRestaurants();
      }
      break;
    case 9://Tab
      if (expanded) {
        event.preventDefault();
        params.target = event.target;
        handleComboButton(params.comboButton);
        closeComboBox(params);
        updateRestaurants();
      }
      break;
    }
};
/**
** Close combo box.
**/
const closeComboBox = (params, outside=false) => {
  DisplayManager.hideElement(params.comboBox);
  DisplayManager.setTabIndex(params.focusableElements, -1);
  if (!outside) {
    params.comboButton.focus();
  }
  if (params.target!="null") {
    params.comboButton.setAttribute("aria-activedescendant", params.target.id);
  }
  for (var i = 0; i < params.focusableElements.length; i++) {
    if (params.focusableElements[i].classList.contains("selected")) {
      params.focusableElements[i].classList.remove("selected")
    }
  }
};
/**
** Open combo box.
**/
const openComboBox = (params) => {
  DisplayManager.displayElement(params.comboBox);
  params.comboButton.blur();
  const activedescendant = params.comboButton.getAttribute("aria-activedescendant");
  for (var i = 0; i < params.focusableElements.length; i++) {
    params.focusableElements[i].setAttribute("aria-selected", "false");
  }
  const active_element = document.getElementById(activedescendant);
  active_element.classList.add("selected");
  active_element.setAttribute("aria-selected", "true");
  DisplayManager.setTabIndex(params.focusableElements, 0);
  active_element.focus();
};
/**
** Handle display of select button.
**/
const handleComboButton = (button) => {
  const expanded = button.getAttribute("aria-expanded")==="false"?false:true;
  const aria_next_expanded = expanded===false?true:false;
  const arrow_prev = expanded===false?"arrow_down":"arrow_up";
  const arrow_next = expanded===false?"arrow_up":"arrow_down";
  const button_tabindex = expanded===false?(-1):0;
  const button_arrow = button.getElementsByTagName("SPAN")[1];
  button.setAttribute("aria-expanded", aria_next_expanded);
  button.setAttribute("tabindex", button_tabindex);
  button_arrow.classList.remove(arrow_prev);
  button_arrow.classList.add(arrow_next);
};
/**
** Move to previous option.
**/
const moveToPrev = (previd, focusableElements, button) => {
  if (previd<0) {
    updateOptionAndButton(focusableElements[focusableElements.length - 1], button);
  }else{
    updateOptionAndButton(focusableElements[previd], button);
  }
};
/**
** Move to next option.
**/
const moveToNext = (nextid, focusableElements, button) => {
  if (nextid>focusableElements.length - 1) {
    updateOptionAndButton(focusableElements[0], button);
  }else{
    updateOptionAndButton(focusableElements[nextid], button);
  }
};
/**
** Update select button and option.
**/
const updateOptionAndButton = (element, button) => {
  const expanded = button.getAttribute("aria-expanded")==="false"?false:true;
  const selectedOption = button.getElementsByTagName("SPAN")[0];
  selectedOption.innerHTML = element.innerHTML;
  button.setAttribute("aria-activedescendant", element.id);
  if (expanded) {
    element.focus();
  }
};
