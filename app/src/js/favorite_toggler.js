/**
** Create HTML for favorite bookmark.
**/
const createFavoriteBookmark = (restaurant) => {
  const favoriteToggler = document.createElement('div');
  favoriteToggler.classList.add("favoriteToggler");
  const favoriteBookmark = document.createElement('div');
  favoriteBookmark.classList.add("fas", "fa-bookmark", "favoriteBookmark");
  const favoriteButton = InterfaceManager.createButton(`favoriteBookmark_${restaurant.id}`, "", "mark restaurant as favorite", toggleFavorite);
  favoriteButton.title = "mark restaurant as favorite";
  favoriteButton.classList.add("fas", "fa-heart", "favoriteButton");
  favoriteToggler.append(favoriteBookmark, favoriteButton);
  toggleFavoriteDisplay(favoriteButton, restaurant.is_favorite);
  return favoriteToggler;
};

/**
** Function to display properly the favorite button.
**/
const toggleFavoriteDisplay = (favoriteButton, is_favorite) =>{
  const favorite = is_favorite.toString() === "true" ? true : false;
  favoriteButton.setAttribute('aria-pressed', favorite);
  const toggle_title = favorite === true ? "Unmark restaurant from favorites!" : "Add restaurant to favorites!";
  const toggle_aria = favorite === true ? "remove restaurant from favorites" : "mark restaurant as favorite";
  favoriteButton.setAttribute('title', toggle_title);
  favoriteButton.setAttribute('aria-label', toggle_aria);
  const heartclassadd = favorite === true ? "favored":"unFavorite";
  const heartclassremove = favorite === true ? "unFavorite":"favored";
  favoriteButton.classList.remove(heartclassremove);
  favoriteButton.classList.add(heartclassadd);
};

/**
** Function to mark / unmark restaurant as favorite.
**/
const toggleFavorite = (event) => {
  event.preventDefault();
  const restaurant_id = parseInt(event.target.getAttribute("id").split("_").pop());
  const button = document.getElementById(`favoriteBookmark_${restaurant_id}`);
  const currentstate = button.getAttribute("aria-pressed");
  const nextstate = currentstate.toString() === "true" ? false : true;
  DBHelper.favoriteHandler(restaurant_id, nextstate).then((response)=>{
    switch (response.request_status) {
      case "fail":
        generateFailureNotification(DBHelper.INDEXED_DB_SUPPORT);
        if (DBHelper.INDEXED_DB_SUPPORT) {
          toggleFavoriteDisplay(button, nextstate);
          updateRestaurantVars(response.data);
        }
        break;
      default:
        toggleFavoriteDisplay(button, nextstate);
        updateRestaurantVars(response.data);
        break;
    }
  });
};

/**
** Update JavaScript variables: restaurants or restaurant.
**/
const updateRestaurantVars = (newRestaurant) => {
  if (InterfaceManager.getUserView() === "restaurant") {
    self.restaurant = newRestaurant;
  } else {
    let newRestaurants = self.restaurants.filter(restaurant => restaurant.id != newRestaurant.id);
    newRestaurants.push(newRestaurant);
    newRestaurants.sort((item_a, item_b)=>{
        return DBHelper.sortByID(item_a, item_b, "asc");
      });
    self.restaurants = [];
    self.restaurants =  newRestaurants;
  }
};
