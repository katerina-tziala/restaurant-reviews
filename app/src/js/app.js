"use strict";
let main, loader, spinner;
let InterfaceManager, MapManager;
const app_link = "http://localhost:8887/index.html";

document.addEventListener("DOMContentLoaded", (event) => {
  initApp();
  initView();
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
/**
** Initialize view depending on the page that was loaded.
**/
const initView = () => {
  const pageView = DisplayManager.getUserView();
  if (pageView) {
    switch (pageView) {
      case "index":
        renderIndex();
        break;
      case "restaurant":
        renderRestaurantInfo();
        break;
    }
  } else {
    DisplayManager.redirectUser(self.app_link);
  }
};






//
