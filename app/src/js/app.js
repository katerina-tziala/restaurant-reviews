"use strict";
let main, loader, spinner;
let InterfaceManager;

document.addEventListener("DOMContentLoaded", (event) => {
  initApp();
  renderIndex();
  self.InterfaceManager.hideLoader();
});

/**
** Initialize the App.
**/
const initApp = () => {
  self.main = document.getElementById("main");
  self.loader = document.getElementById("loader_container");
  self.spinner = document.getElementById("spinner");
  self.InterfaceManager = new UIManager(self.main, self.loader, self.spinner);
};
