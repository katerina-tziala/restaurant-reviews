"use strict";
let restaurant, reviews, reviewsResults, reviewsList;
/**
** Render restaurant view.
**/
const renderRestaurantInfo = () => {
  self.reviewsResults = document.getElementById("reviews");
  self.reviewsList = document.getElementById("reviewsList");
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.InterfaceManager.hideLoader();
      self.restaurant = restaurant;
      fillBreadcrumb();
      fillRestaurantHTML();
    }
  });
};
/**
** Get current restaurant from page URL.
**/
const fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) {// restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = DisplayManager.getParameterByName("id");
  if (!id) { // no id found in URL
    error = "No restaurant id in URL"
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      callback(null, restaurant);
    });
  }
};
/**
** Add restaurant name to the breadcrumb navigation menu
**/
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById("breadcrumb");
  const li = document.createElement("li");
  const breadcrumb_a = document.createElement("a");
  breadcrumb_a.innerHTML = restaurant.name;
  breadcrumb_a.href = DBHelper.urlForRestaurant(restaurant);
  breadcrumb_a.setAttribute("aria-current", "page");
  li.append(breadcrumb_a);
  breadcrumb.appendChild(li);
};
/**
** Create restaurant HTML and add it to the webpage.
**/
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById("restaurantName");
  name.innerHTML = restaurant.name;
  const image = document.getElementById("restaurantImg");
  image.alt = "photo of restaurant: " + restaurant.name;
  image.className = 'restaurantImg';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  const cuisine = document.getElementById("cuisine");
  cuisine.innerHTML = restaurant.cuisine_type;
  const address = document.getElementById("address");
  address.innerHTML = `<span>${restaurant.neighborhood}</span><span>${restaurant.address}</span>`;
  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  self.reviews = restaurant.reviews;
  renderReviewsLink(restaurant.reviews.length, restaurant);
  fillRatingStats();
  fillReviewsHTML();
};

/**
** Create restaurant operating hours HTML table and add it to the webpage.
**/
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById("restaurantHours");
  for (let key in operatingHours) {
    const row = document.createElement("tr");
    const day = document.createElement("td");
    day.className = "hoursDay";
    day.innerHTML = key;
    row.appendChild(day);
    const time = document.createElement("td");
    time.className = "hoursTime";
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    hours.appendChild(row);
  }
};
/**
** Calculate total rating statistics and add them in the webpage.
**/
const fillRatingStats = (reviews = self.reviews) => {
  const total_rating = document.getElementById("total_rating");
  const total_reviews = document.getElementById("total_reviews");
  const reviews_numb = reviews.length;
  total_reviews.innerHTML = reviews_numb;
  if (reviews_numb > 0) {
    let sum_rating = 0;
    reviews.forEach(review => {
      sum_rating += parseInt(review.rating);
    });
    const avg = Number(Math.round(sum_rating/reviews_numb+'e'+1)+'e-'+1);
    total_rating.innerHTML = avg;
  }
};
/**
** Create anchor point for reviews and display the appropriate link text.
**/
const renderReviewsLink = (reviews_numb, restaurant) => {
  const reviews_link = document.getElementById("reviews_link");
  reviews_link.href = DBHelper.urlForRestaurant(restaurant) + "#reviews";
  if (reviews_numb === 1) {
    reviews_link.innerHTML = "review";
  }
}
/**
** Create all reviews HTML and add them to the webpage.
**/
const fillReviewsHTML = (reviews = self.reviews, reviewsList = self.reviewsList) => {
  self.reviewsList.innerHTML = "";
  if (!reviews || reviews.length === 0) {
    self.InterfaceManager.displayNoResultsFetchingMessage("reviews", self.reviewsResults, self.reviewsList);
    return;
  } else {
    self.InterfaceManager.removeNoResultsFetchingeMessage();
    reviews.forEach(review => {
       reviewsList.appendChild(createReviewHTML(review));
    });
  }
};
/**
** Create review HTML and add it to the webpage.
**/
const createReviewHTML = (review) => {
  const li = document.createElement("li");
  li.className = "reviewCard";
  li.setAttribute("role" , "listitem");
  const rating = populateReviewRating(review.rating);
  const review_info = document.createElement("div");
  review_info.className = "reviewInfo";
  const reviewer = document.createElement("p");
  reviewer.className = "reviewer";
  reviewer.innerHTML = `<span>by</span><b title="${review.name}">${review.name}</b>`;
  const created = document.createElement("p");
  created.className = "reviewCreationDate";
  created.innerHTML = DisplayManager.formatDate(review.date);
  review_info.append(reviewer, created);
  const comments = document.createElement("p");
  comments.className = "ratingComments";
  comments.innerHTML = DisplayManager.decodeEntities(review.comments);
  li.append(rating, review_info, comments);
  return li;
};
/**
** Toggle map of restaurant.
**/
const toggleMap = (event) => {
  const button = document.getElementById("mapButton");
  const action = button.getAttribute("aria-label").split(" ")[0].toLowerCase();
  DisplayManager.handleMapButtonDisplay(button, action);
  const displayMap = action === "show" ? true : false;
  if (self.MapManager) {
    self.MapManager.toggleMap(displayMap);
  } else {
    self.MapManager = new MapboxManager(self.restaurant.latlng.lat, self.restaurant.latlng.lng, 16, [self.restaurant]);
  }
};

/**
** Populate rating stars for review.
**/
const populateReviewRating = (rating) => {
  const review_rating = document.createElement("div");
  review_rating.classList.add("centeredFlexbox", "reviewRating");
  const p = document.createElement("p");
  p.className = "ratingHeader";
  p.innerHTML = "rating:";
  review_rating.append(p);
  for (let i = 1; i < 6; i++) {
    let star = document.createElement('div');
    star.classList.add("fas", "fa-star", "star_for_review");
    if (i<=rating) {
      star.classList.add("given_star");
    }
    review_rating.append(star);
  }
  return review_rating;
};
