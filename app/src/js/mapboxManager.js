class MapboxManager {
  _MAPBOX_API_KEY = "pk.eyJ1Ijoia2F0ZXJpbmF0emlhbGEiLCJhIjoiY2pwenNqdHF3MGU5MDQ4bzRudGdlanZ6eCJ9.kGbzX08otPecWpIvfKU3ZA";
  _MapBoxCSS = {
    type: "text/css",
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.3.1/dist/leaflet.css",
    integrity: "sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==",
    crossorigin: " "
  }
  _MapBoxJS = {
    type: "application/javascript",
    src: "https://unpkg.com/leaflet@1.3.1/dist/leaflet.js",
    integrity: "sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==",
    crossorigin: " ",
    charset: "utf-8"
  }
  _LeafletMapBox_Params = {
      mapboxToken: this._MAPBOX_API_KEY,
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
  };
  _LeafletTileLayerLink = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}";
  _MapMarkers = [];
  _mapDisplayClassCSS = "displaymap";
  _mapTimeout = null;
  _mapInitializing = null;

  constructor(lat, lng, zoom, restaurants){
    this.lat = lat;
    this.lng = lng;
    this.zoomLevel = zoom;
    this.mapContainer = document.getElementById("map_container");
    this.initMap(restaurants);
  }

  /**
  ** Initialize map.
  **/
  initMap(restaurants) {
    this.displayMap();
    this._mapInitializing = true;
    setTimeout(() => {
      Promise.all([FileLoader.loadFile("link", this._MapBoxCSS),FileLoader.loadFile("script", this._MapBoxJS)]).then(() => {
            this.MapLayer = new L.map("map", {
              center: [this.lat, this.lng],
              zoom: this.zoomLevel,
              scrollWheelZoom: false
            });
            L.tileLayer(this._LeafletTileLayerLink, this._LeafletMapBox_Params).addTo(this.MapLayer);
            this.addMarkersToMap(restaurants);
            this._mapInitializing = false;
        }).catch(() => {
          console.log('loading failure!');
        });
    }, 700)
  }

  /**
  ** Add markers for all restaurants to the map.
  **/
  addMarkersToMap(restaurants) {
    restaurants.forEach(restaurant => {
      const map_params = {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      }
      const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], map_params);
      marker.addTo(this.MapLayer);
      this._MapMarkers.push(marker);
      const markerRedirection = () => {
       window.location.href = marker.options.url;
     };
      marker.on("click", markerRedirection);
      marker.on("keypress", (event) => {
        if (event.originalEvent.keyCode===13) {
          markerRedirection();
        }
      });
    });
  }

  /**
  ** Remove markers from the map.
  **/
  removeMarkers() {
    if (this._MapMarkers) {
      this._MapMarkers.forEach(marker => marker.remove());
     }
    this._MapMarkers = [];
  }

  /**
  ** Display and/or hide map.
  **/
   toggleMap(displayMap) {
     if (!this._mapInitializing) {
        clearTimeout(this._mapTimeout);
        if(displayMap) {
          this.displayMap();
        } else {
          this.hideMap();
        }
     }
   }

  /**
  ** Display map.
  **/
 displayMap() {
   DisplayManager.displayElement(this.mapContainer);
   this._mapTimeout = setTimeout(() => {
     this.mapContainer.classList.add(this._mapDisplayClassCSS);
   }, 200);
 }

 /**
 ** Hide map.
 **/
  hideMap() {
     this.mapContainer.classList.remove(this._mapDisplayClassCSS);
     this._mapTimeout = setTimeout(() => {
       DisplayManager.hideElement(this.mapContainer);
     }, 800);
   }
}
