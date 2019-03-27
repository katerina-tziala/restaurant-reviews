"use strict";
let restaurants, neighborhoods, cuisines,
neighborhoodSelect, neighborhoodsList, cuisineSelect, cuisineList,
restaurantsList, restaurantResults, mapCheckbox;
/**
** Render index view.
**/
const renderIndex = () => {
  self.neighborhoodSelect = document.getElementById("select_neighborhood");
  self.neighborhoodsList = document.getElementById("neighborhoods_list");
  self.cuisineSelect = document.getElementById("select_cuisine");
  self.cuisineList = document.getElementById("cuisine_list");
  self.restaurantsList = document.getElementById("restaurantsList");
  self.restaurantResults = document.getElementById("filterResults");
  self.mapCheckbox = document.getElementById("maptoggler");
  self.mapManager = null;
  fetchNeighborhoods();
  fetchCuisines();
  updateRestaurants();
  self.mapCheckbox.addEventListener("keyup", (event) => {
    if (event.keyCode===13) {
      event.preventDefault();
      const mapcheck = document.getElementById("mapcheck");
      if (mapcheck.checked) {
        mapcheck.checked=false;
      }else {
        mapcheck.checked=true;
      }
      toggleMap();
    }
  });
};
document.addEventListener("click", (event) => {
  const selects = document.querySelectorAll(".select_widget");
  if (selects[0].contains(event.target)) {
    closeSelectBox(self.cuisineSelect, self.cuisineList);
  }else if (selects[1].contains(event.target)) {
    closeSelectBox(self.neighborhoodSelect, self.neighborhoodsList);
  }else{
    closeSelectBox(self.neighborhoodSelect, self.neighborhoodsList);
    closeSelectBox(self.cuisineSelect, self.cuisineList);
  }
});
/**
** Close Select Box.
**/
const closeSelectBox = (comboButton, comboList) => {
  const expanded = comboButton.getAttribute("aria-expanded")==="false"?false:true;
  if (expanded) {
    handleComboButton(comboButton);
    const params = {
      "comboButton": comboButton,
      "comboBox": comboList,
      "focusableElements": comboList.querySelectorAll(".selectoption"),
      "target":"null"
    };
    closeComboBox(params, true);
  }
};
/**
** Toggle map.
**/
const toggleMap = () => {
  const mapcheckbox = document.getElementById("mapcheck");
  const displayMap = mapcheckbox.checked;
  if (self.MapManager) {
    self.MapManager.toggleMap(displayMap);
  } else {
    self.MapManager = new MapboxManager(40.722216, -73.987501, 12, self.restaurants);
  }
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
/**
** Update page and map for current restaurants.
**/
const updateRestaurants = () => {
  const cuisine_id = self.cuisineSelect.getAttribute("aria-activedescendant");
  const neighborhood_id = self.neighborhoodSelect.getAttribute("aria-activedescendant");
  const cuisine = document.getElementById(cuisine_id).getAttribute("value");
  const neighborhood = document.getElementById(neighborhood_id).getAttribute("value");
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      if(restaurants.length > 0) {
        fillRestaurantsHTML();
      } else {
        self.InterfaceManager.displayNoResultsFetchingMessage("restaurants", self.restaurantResults, self.restaurantsList);
      }
    }
  });
};
/**
** Clear current restaurants, their HTML and remove their map markers.
**/
const resetRestaurants = (restaurants, ul = self.restaurantsList) => {
  self.restaurants = [];
  ul.innerHTML = "";
  self.InterfaceManager.removeNoResultsFetchingeMessage();
  if (self.MapManager) {
    self.MapManager.removeMarkers();
  }
  self.restaurants = restaurants;
};
/**
** Create all restaurants HTML and add them to the webpage.
**/
const fillRestaurantsHTML = (restaurants = self.restaurants, ul = self.restaurantsList) => {
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  if (self.MapManager) {
    self.MapManager.addMarkersToMap(self.restaurants);
  }
};
/**
** Create restaurant HTML.
**/
const createRestaurantHTML = (restaurant) => {
  const li = document.createElement("li");
  li.className = "restaurantCard";
  li.setAttribute("role" , "listitem");
  const imageContainer = document.createElement("div");
  imageContainer.className = "imageContainer";
  const image = document.createElement("img");
  image.alt = "photo of restaurant: " + restaurant.name;
  image.className = "restaurantImg";
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  imageContainer.append(image);
  const name = document.createElement("h2");
  name.innerHTML = restaurant.name;
  name.className = "restaurantName";
  name.setAttribute("aria-label" , `${restaurant.name} , ${restaurant.neighborhood}`);
  const neighborhood = document.createElement("p");
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.className = "neighborhood";
  const address = document.createElement("p");
  address.className = "address";
  address.innerHTML = restaurant.address;
  const more = document.createElement("a");
  more.className = "more";
  more.setAttribute("role", "button");
  more.setAttribute("aria-label", "view details about restaurant " + restaurant.name);
  more.setAttribute("title", "View Details About Restaurant: " + restaurant.name);
  more.innerHTML = "View Details";
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(imageContainer, name, neighborhood, address, more);
  return li;
};
