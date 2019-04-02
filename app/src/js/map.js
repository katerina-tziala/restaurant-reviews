let mapBoxLayer = null;
let mapMarkers = [];
let mapTimeout = 0;
let mapInitializing = false;
let mapLoaded = false;

/**
** Toggle map.
**/
const toggleMap = () => {
  const action = self.mapButton.getAttribute("aria-label").split(" ")[0].toLowerCase();
  toggleMapButtonDisplay(action);
  if (!self.mapLoaded) {
    initMap(getMapInitParams());
  } else {
    const displayMap = action === "show" ? true : false;
    toggleMapDisplay(displayMap);
    if (InterfaceManager.getUserView() !== "restaurant") {
      self.neighborhoodSelectWidget.closeSelectBox("null", true);
      self.cuisineSelectWidget.closeSelectBox("null", true);
      console.log("select widget");
    }
  }
};

/**
** Handle display of button to open/close map.
**/
const toggleMapButtonDisplay = (action) => {
  const next_action = action === "show" ? "hide" : "show";
  const next_icon = next_action === "hide" ? "fa-map-marker-alt" : "fa-map";
  const buttonText = getMabButtonLabelTitle(next_action);
  self.mapButton.setAttribute("aria-label", buttonText);
  self.mapButton.title = buttonText;
  const icon = self.mapButton.getElementsByTagName("I")[0];
  if (next_action === "hide") {
    icon.classList.remove("location_icon", "fa-map-marker-alt");
    icon.classList.add("map_icon", "fa-map");
  } else {
    icon.classList.remove("map_icon", "fa-map");
    icon.classList.add("location_icon", "fa-map-marker-alt");
  }
}

/**
** Get title and label from map button.
**/
const getMabButtonLabelTitle = (next_action) => {
  const label_part_a = InterfaceManager.getUserView() === "restaurant" ? "restaurant" : "results";
  const label_part_b = next_action === "show" ? "on" : "from";
  const label = next_action + " " + label_part_a + " " + label_part_b + " map";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
** Get params to initialize the map based on the view.
**/
const getMapInitParams = () => {
  const view = InterfaceManager.getUserView();
  let mapInitParams;
  if(view === "restaurant"){
    mapInitParams = {
      lat: self.restaurant.latlng.lat,
      lng: self.restaurant.latlng.lng,
      zoomLevel: 16,
      restaurants: [self.restaurant]
    };
  } else {
    mapInitParams = {
      lat: 40.722216,
      lng: -73.987501,
      zoomLevel: 12,
      restaurants: self.restaurants
    };
  }
  return mapInitParams;
};

/**
** Reset map variables.
**/
const resetMap = () => {
  self.mapBoxLayer = null;
  removeMarkers();
  self.mapTimeout = 0;
  self.mapInitializing = false;
  self.mapLoaded = false;
}

/**
** Initialize map.
**/
const initMap = (params) => {
  resetMap();
  self.mapInitializing = true;
  displayMap();
  setTimeout(() => {
    Promise.all([FileLoader.loadFile("link", appParams.mapBox.cssFile),
    FileLoader.loadFile("script", appParams.mapBox.jsFile)]).then(() => {
      self.mapBoxLayer = new L.map("map", {
          center: [params.lat, params.lng],
          zoom: params.zoomLevel,
          scrollWheelZoom: false
        });
        L.tileLayer(appParams.mapBox.leaflet_tile_layer_link, appParams.mapBox.leaflet_params).addTo(self.mapBoxLayer);
        self.mapLoaded = true;
        addMarkersToMap(params.restaurants);
        self.mapInitializing = false;
      }).catch((error) => {
        self.mapLoaded = false;
        mapFailure();
      });
  }, 700);
};

/**
** Display map.
**/
const displayMap = () => {
 InterfaceManager.displayElement(self.mapContainer);
 self.mapTimeout = setTimeout(() => {
   self.mapContainer.classList.add(appParams.cssClasses.displayMap);
 }, 200);
};

/**
** Hide map.
**/
 const hideMap = () => {
   self.mapContainer.classList.remove(appParams.cssClasses.displayMap);
   self.mapTimeout = setTimeout(() => {
      InterfaceManager.hideElement(self.mapContainer);
    }, 800);
};

/**
** Display and/or hide map.
**/
const toggleMapDisplay = (display) => {
  if (!self.mapLoaded) {
    mapFailure();
  } else {
    if (!self.mapInitializing) {
       clearTimeout(self.mapTimeout);
       if(display) {
         displayMap();
       } else {
         hideMap();
       }
    }
  }
};

/**
** Add markers for all restaurants to the map.
**/
const addMarkersToMap = (restaurants) => {
  if (self.mapBoxLayer && self.mapLoaded) {
    restaurants.forEach(restaurant => {
      const marker_params = {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      };
      const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], marker_params);
      marker.addTo(self.mapBoxLayer);
      self.mapMarkers.push(marker);
      const markerRedirection = () => { window.location.href = marker.options.url; };
      marker.on("click", markerRedirection);
      marker.on("keypress", (event) => {
        if (event.originalEvent.keyCode === 13) {
          markerRedirection();
        }
      });
    });
  }
};

/**
** Remove markers from the map.
**/
const removeMarkers = () => {
  if (self.mapBoxLayer && self.mapLoaded && self.mapMarkers && self.mapMarkers.length > 0) {
    self.mapMarkers.forEach(marker => marker.remove());
  }
  self.mapMarkers = [];
};

/**
** Enable map for users based on view.
**/
const enableMap = () => {
  self.mapButton.setAttribute("onclick", "toggleMap(event)");
  self.mapButton.classList.remove(appParams.cssClasses.disableMapButton);
  const currentAction = self.mapButton.getAttribute("aria-label").split(" ")[0].toLowerCase();
  if (currentAction === "hide" || currentAction === "show"){
    const prev_action = currentAction === "show" ? "hide" : "show";
    toggleMapButtonDisplay(prev_action);
  } else {
    toggleMapButtonDisplay("hide");
  }
};

/**
** Disable map for users when they are offline and map was not loaded.
**/
const disableMap = () => {
  self.mapContainer.classList.remove(appParams.cssClasses.displayMap);
  InterfaceManager.hideElement(self.mapContainer);
  self.mapButton.removeAttribute("onclick");
  self.mapButton.classList.add(appParams.cssClasses.disableMapButton);
  self.mapButton.setAttribute("aria-label", "Map is currently unavailable");
  self.mapButton.title = "Map is currently unavailable";
  toggleMapButtonDisplay("hide");
  resetMap();
};

/**
** Handle map failure.
**/
const mapFailure = () => {
  // self.mapContainer.classList.remove(appParams.cssClasses.displayMap);
  // InterfaceManager.hideElement(self.mapContainer);
  // toggleMapButtonDisplay("hide");
  // resetMap();
  disableMap();
  console.log("map failure notification");
  console.log("enable map button after notification");
};







//
