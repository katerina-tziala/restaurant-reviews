"use strict";
const appParams = {
  start_url: "http://localhost:8887/index.html",
  scope: "/",
  databaseApiKey: "5c5428e3640ec41c0c24ec1e",
  endpoints: {
    restaurants: "https://restreviews-eb12.restdb.io/rest/restaurants",
    reviews: "https://restreviews-eb12.restdb.io/rest/reviews"
  },
  indexFiles: {
    js: [ "js/select_widget.js",
    "js/map.js",
    "js/favorite_toggler.js",
    "js/index.js"],
    css: [ "css/no_results_message.css",
    "css/map.css",
    "css/select_widget.css",
    "css/favorite_toggler.css",
    "css/index.css"]
  },
  restaurantFiles: {
    js: [ "js/map.js",
    "js/favorite_toggler.js",
    "js/restaurant.js",
    "js/reviews.js"],
    css: ["css/no_results_message.css",
    "css/map.css",
    "css/restaurant.css",
    "css/favorite_toggler.css",
    "css/reviews.css",
    "css/add_review.css"]
  },
  mapBox: {
    leaflet_tile_layer_link: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",
    leaflet_params: {
        mapboxToken: "pk.eyJ1Ijoia2F0ZXJpbmF0emlhbGEiLCJhIjoiY2pwenNqdHF3MGU5MDQ4bzRudGdlanZ6eCJ9.kGbzX08otPecWpIvfKU3ZA",
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    },
    cssFile: {
      type: "text/css",
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.3.1/dist/leaflet.css",
      integrity: "sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==",
      crossorigin: " "
    },
    jsFile: {
      type: "application/javascript",
      src: "https://unpkg.com/leaflet@1.3.1/dist/leaflet.js",
      integrity: "sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==",
      crossorigin: " ",
      charset: "utf-8"
    }
  },
  cssClasses: {
    hidden: "hidden",
    spinClass: "spin",
    displayMap: "displaymap",
    disableMapButton: "disabled",
    displayNotification: "display_notification",
    freezer: "freezer"
  },
  noResultsFetchingMessages: {
     restaurants: `<span>No results matching your criteria!</span><span>Please try again!</span><i>Hint: Search with a different combination of neighborhoods and cuisines!</i>`,
     reviews: `<span>No reviews yet!</span>`
  },
  notifications: {
    clear: { title: "", message: "", type:"cleared"},
    map_failure: {
      title: "Ooops!",
      message: "Map wasn't loaded successfully! Please try again.",
      type: "map_failure"
    },
    online: {
       title: "You are back online!",
       message: "Internet connection was successfully re-established!",
       type: "online"
     },
    offline: {
      title: "Unable to connect! retrying...",
      message: "You are able to use the Restaurant Reviews app while offline!",
      type: "offline"
    },
    offline_noMap: {
      title: "Unable to connect! retrying...",
      message: `You are able to use the Restaurant Reviews app while offline!<br><i><b>Notice: </b>The map is not currently available since it was not loaded yet!<i>`,
      type: "offline_noMap"
    },
    unable_to_connect_retrying: {
      title: "Unable to connect!",
      message: `Retrying in <span id="message_timer"></span>`,
      type: "unable_to_connect_retrying"
    },
    update: {
      title: "update available",
      message: "A new version of the Restaurant Reviews app is available!",
      type: "update"
    },
    failed_request_cached: {
      title: "Unable to connect! retrying...",
      message: "Your changes will be saved as soon as connection is re-established!",
      type: "failed_request_cached"
    },
    failed_request: {
        title: "Unable to connect!",
        message: "Your changes were not saved! Please try again later!",
        type: "failed_request"
    },
    unsaved_changes: {
      title: `You have <span id="unsaved_number"></span> unsaved <span id="unsaved_changes"></span>!`,
      message: `Your changes will be saved in <span id="message_timer">10<span>`,
      type: "unsaved_changes"
    },
    refresh: {
        title: "All your changes were successfully saved!",
        message: `Refreshing the app in <span id="message_timer">5<span>`,
        type: "refresh"
    },
    saving_changes: {
      title: "Your changes are being saved!",
      message: `Please wait...<br>You will be notified for the result as soon as possible`,
      type: "saving_changes"
    },
    retry: {
      title: "Unable to save your changes!",
      message: `Retrying in <span id="message_timer"></span>`,
      type: "retry"
    }
  }
};
