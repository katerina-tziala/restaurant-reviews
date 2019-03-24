"use strict";
let restaurants, neighborhoods, cuisines,
neighborhoodSelect, neighborhoodsList,
cuisineSelect, cuisineList;

/**
** Render index view.
**/
const renderIndex = () => {
  self.neighborhoodSelect = document.getElementById("select_neighborhood");
  self.neighborhoodsList = document.getElementById("neighborhoods_list");
  self.cuisineSelect = document.getElementById("select_cuisine");
  self.cuisineList = document.getElementById("cuisine_list");
  //self.restaurantsList = document.getElementById("restaurantsList");
  fetchNeighborhoods();
  fetchCuisines();
};
/**
** Update page and map for current restaurants.
**/
const updateRestaurants = () => {
  console.log("updateRestaurants");
};
/**
** Fetch all neighborhoods and set their HTML.
**/
const fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods.sort();
      fillOptionsHTML(self.neighborhoodsList,self.neighborhoods, "n");
      comboBoxManager(self.neighborhoodSelect, self.neighborhoodsList);
    }
  });
};
/**
** Fetch all cuisines and set their HTML.
**/
 const fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines.sort();
      fillOptionsHTML(self.cuisineList, self.cuisines, "c");
      comboBoxManager(self.cuisineSelect, self.cuisineList);
    }
  });
};
/**
** Fill options HTML for neighborhoods and cuisines.
**/
const fillOptionsHTML = (listbox, itemList, optkey) => {
  let index=1;
  const firstItem = listbox.getElementsByTagName("LI")[0];
  firstItem.setAttribute("aria-setsize", itemList.length+1);
  itemList.forEach(item => {
    const option = document.createElement("li");
    option.setAttribute("role", "option");
    option.setAttribute("value", item);
    option.setAttribute("id", `${optkey}_opt_${index}`);
    option.classList.add("selectoption");
    option.setAttribute("aria-setsize", itemList.length+1);
    option.setAttribute("aria-posinset", index+1);
    option.setAttribute("aria-selected", "false");
    option.innerHTML = item;
    listbox.append(option);
    index++;
  });
};
