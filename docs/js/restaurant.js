"use strict";
let restaurant, reviews, reviewsResults, reviewsList, reviewLayer, reviewModal, ratingStars;

/**
** Render restaurant view.
**/
const renderRestaurantInfo = () => {
  self.reviewsResults = document.getElementById("reviews");
  self.reviewsList = document.getElementById("reviewsList");
  self.reviewLayer = document.getElementById("add_review_wrapper");
  self.reviewModal = document.getElementById("add_review_modal");
  const starNodes = document.querySelectorAll(".rrstar");
  const stars = Array.prototype.slice.call(starNodes, 0);
  self.ratingStars = stars.reverse();
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      InterfaceManager.hideLoader();
      self.restaurant = restaurant;
      fillBreadcrumb();
      fillRestaurantHTML();
    }
  });
  self.reviewLayer.addEventListener('keydown', trapModalKeys);
};

/**
** Get current restaurant from page URL.
**/
const fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) {// restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = InterfaceManager.getParameterByName("id");
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
  const imageContainer = document.querySelectorAll(".imageContainer")[0];
  imageContainer.append(createFavoriteBookmark(restaurant));
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
  document.getElementById("commentsfield").placeholder = `Enter your comments for the restaurant "${self.restaurant.name}" here!`;
  DBHelper.fetchRestaurantReviews(restaurant.id, (error, reviews) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.reviews = reviews;
      fillRatingStats();
      fillReviewsHTML();
    }
  });
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
** Create all reviews HTML and add them to the webpage.
**/
const fillReviewsHTML = (reviews = self.reviews, reviewsList = self.reviewsList) => {
  self.reviewsList.innerHTML = "";
  if (!reviews || reviews.length === 0) {
    InterfaceManager.displayNoResultsFetchingMessage("reviews", self.reviewsResults, self.reviewsList);
    return;
  } else {
    reviews.sort((item_a, item_b)=>{
        let sort_one = DBHelper.sortByDate(item_a, item_b, "desc", "updatedAt");
        let sort_two = DBHelper.sortByDate(item_a, item_b, "desc", "createdAt");
        let sort_three = DBHelper.sortByID(item_a, item_b, "desc");
        return  sort_one || sort_two || sort_three;
    });
    InterfaceManager.removeNoResultsFetchingeMessage();
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
  if (parseInt(review.id)>30 || review.id.toString().startsWith('temp')) {
    const editBtn = InterfaceManager.createButton(`edit_rev_${review.id}`, "", "edit review", editReview);
    editBtn.title = "Edit Review";
    editBtn.classList.add("fas", "fa-pencil-alt", "review_modification_btn", "edirreview");
    const delBtn = InterfaceManager.createButton(`delete_rev_${review.id}`, "", "delete review", deleteReview);
    delBtn.title = "Delete Review";
    delBtn.classList.add("fas", "fa-trash-alt", "review_modification_btn", "deletereview");
    li.append(delBtn, editBtn);
  }
  const rating = populateReviewRating(review.rating);
  const review_info = document.createElement("div");
  review_info.className = "reviewInfo";
  const reviewer = document.createElement("p");
  reviewer.className = "reviewer";
  reviewer.innerHTML = `<span>by</span><b title="${review.name}">${review.name}</b>`;
  const created = document.createElement("p");
  created.className = "reviewCreationDate";
  created.innerHTML = InterfaceManager.formatDate(review.createdAt);
  review_info.append(reviewer, created);
  if (new Date(review.updatedAt).getTime()>new Date(review.createdAt).getTime()) {
    const updated = document.createElement("p");
    updated.className = "reviewUpdateDate";
    updated.innerHTML = `Last updated: ${InterfaceManager.getDateTime(review.updatedAt)}`;
    review_info.append(updated);
  }
  const comments = document.createElement("p");
  comments.className = "ratingComments";
  comments.innerHTML = InterfaceManager.decodeEntities(review.comments);
  li.append(rating, review_info, comments);
  return li;
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
