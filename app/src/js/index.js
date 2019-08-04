"use strict";
let restaurants, neighborhoods, cuisines, neighborhoodSelect, neighborhoodsList, cuisineSelect, cuisineList, neighborhoodSelectWidget, cuisineSelectWidget, restaurantsList, restaurantResults;

// Render index view:
const renderIndex = () => {
  self.neighborhoodSelect = document.getElementById("select_neighborhood");
  self.neighborhoodsList = document.getElementById("neighborhoods_list");
  self.cuisineSelect = document.getElementById("select_cuisine");
  self.cuisineList = document.getElementById("cuisine_list");
  self.restaurantsList = document.getElementById("restaurantsList");
  self.restaurantResults = document.getElementById("filterResults");
  self.neighborhoodSelectWidget = null;
  self.cuisineSelectWidget = null;
  self.neighborhoods = [];
  self.cuisines = [];
  updateRestaurants();
  fetchNeighborhoods();
  fetchCuisines();
};

// Close select box when clicking outside the element:
document.addEventListener("click", (event) => {
  const selects = document.querySelectorAll(".select_widget");
  if (selects[0].contains(event.target)) {
    self.cuisineSelectWidget.closeSelectBox("null", true);
  }else if (selects[1].contains(event.target)) {
    self.neighborhoodSelectWidget.closeSelectBox("null", true);
  } else {
    self.neighborhoodSelectWidget.closeSelectBox("null", true);
    self.cuisineSelectWidget.closeSelectBox("null", true);
  }
});

// Fetch all neighborhoods and set their HTML:
const fetchNeighborhoods = () => {
  DBHelper.fetchUniqueRestaurantParams('neighborhood', (error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
        self.neighborhoods = neighborhoods.sort();
        const neighborhoodOptions = self.neighborhoods;
        neighborhoodOptions.unshift("All Neighborhoods");
        self.neighborhoodSelectWidget = new SelectWidget(self.neighborhoodSelect, self.neighborhoodsList, "n", updateRestaurants, neighborhoodOptions);
    }
  });
};

// Fetch all cuisines and set their HTML:
 const fetchCuisines = () => {
  DBHelper.fetchUniqueRestaurantParams('cuisine_type', (error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
        self.cuisines = cuisines.sort();
        const cuisineOptions = self.cuisines;
        cuisineOptions.unshift("All Cuisines");
        self.cuisineSelectWidget = new SelectWidget(self.cuisineSelect, self.cuisineList, "c", updateRestaurants, cuisineOptions);
    }
  });
};

// Update page and map for current restaurants:
const updateRestaurants = () => {
  const cuisine_id = self.cuisineList.getAttribute("aria-activedescendant");
  const neighborhood_id = self.neighborhoodsList.getAttribute("aria-activedescendant");
  let cuisine = document.getElementById(cuisine_id).getAttribute("value");
  cuisine = cuisine.startsWith("All") ? "all" : cuisine;
  let neighborhood = document.getElementById(neighborhood_id).getAttribute("value");
  neighborhood = neighborhood.startsWith("All") ? "all" : neighborhood;
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      InterfaceManager.hideLoader();
      if (restaurants.length) {
        fillRestaurantsHTML();
      } else {
        InterfaceManager.displayNoResultsFetchingMessage("restaurants", self.restaurantResults, self.restaurantsList);
      }
    }
  });
};


// Clear current restaurants, their HTML and remove their map markers:
const resetRestaurants = (restaurants, ul = self.restaurantsList) => {
  self.restaurants = [];
  ul.innerHTML = "";
  InterfaceManager.removeNoResultsFetchingeMessage();
  removeMarkers();
  self.restaurants = restaurants;
};

// Create all restaurants HTML and add them to the webpage:
const fillRestaurantsHTML = (restaurants = self.restaurants, ul = self.restaurantsList) => {
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap(self.restaurants);
};

// Create restaurant HTML:
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
