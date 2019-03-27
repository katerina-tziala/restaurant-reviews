"use strict";
let main, loader, spinner;
let InterfaceManager, MapManager;


document.addEventListener("DOMContentLoaded", (event) => {
  initApp();

  console.log(DisplayManager.getUserView());

  

  if(DisplayManager.getUserView()==="index"){
    renderIndex();
  } else {
    console.log("hi");
    renderRestaurantInfo();
  }
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








//
