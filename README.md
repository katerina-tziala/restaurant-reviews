# <img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/rr_logo-72x72.png" alt="restaurant reviews logo" width="44" height="44" align="left">Restaurant Reviews: Stage 4

This is the fourth stage of the <b>Restaurant Reviews</b> project. Building upon the PWA that was developed incrementally in the three previous stages, this stage includes the necessary changes to host the app and create a live demo. 


## Project Requirements

  - **Update the app to work with a hosted NoSQL Database and a RESTful API:** Set up a NoSQL Database that contains the required data of the app, and create RESTful API to perform CRUD (Create, Read, Update, Delete) operations against the DB. Update the client application in order to make use of the new API.
   
 - **Responsive Design:** The application maintains a responsive design on mobile, tablet and desktop viewports. All new features are responsive, including the form to add a review and the control for marking a restaurant as a favorite.

 - **Accessibility:** The application retains accessibility features from the previous projects. Images have alternate text, the application uses appropriate focus management for navigation, semantic elements and ARIA attributes are used correctly. Roles are correctly defined for all elements of the review form. Modal or interstitial windows appropriately lock focus.

 - **Performance Requirements:** The application still satisfies performance benchmarks (measure performance using the Lighthouse):
   - **Progressive Web App** score should be at **90 or better**.
   - **Performance** score should be at **90 or better**.
   - **Accessibility** score should be at **90 or better**.

## Setting up a hosted NoSQL Database and a RESTful API

For this stage an online database solution that offers both NoSQL DB storage and exposes a RESTful API was required.
After an extensive research, I decided to use
[**restdb.io**](https://restdb.io/): a NoSQL database cloud service, Database-as-a-Service (DBaaS), that offers the online NoSQL database backend for web and serverless applications. Furthermore, it is a simple to use, developer friendly and no-cost NoSQL database with data management app, schema builder, and REST API instantly available
([**restdb.io features**](https://restdb.io/features/)).

 - **Create DB & Collection**<br>
    - After creating an account, the first thing to do was to create a database.
    <p align="center">
      <img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/create_database.png" alt="create database" width="100%" height="auto">
    </p>
    
    - Once the database was created I added two collections, with the required fields and relations for each one of them: ***restaurants*** and ***reviews***.
    <p align="center">
      <img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/collections.png" alt="database collections" width="100%" height="auto">
    </p>
    
      1. ***restaurants collection***
        <p align="center"><img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/restaurants_collection.png" alt="restaurants collection" width="100%" height="auto"></p>
    
      2. ***reviews collection***
         <p align="center"><img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/reviews_collection.png" alt="reviews collection" width="100%" height="auto"></p>
        
    - Finally, I added the necessary data for each collection.
     
     1. ***restaurants collection data***
        <p align="center"><img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/restaurants_data.png" alt="restaurants collection data" width="100%" height="auto"></p>
        
      2. ***reviews collection data***
         <p align="center"><img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/reviews_data.png" alt="reviews collection data" width="100%" height="auto"></p>

 - **Manage REST API**<br>
    Once the database and collections were created, I defined the API key and tested the endpoints for all CRUD operations with the use of [**postman**](https://www.getpostman.com/).
 
## Local Setup of the Project

1. Create an online NoSQL database backend and a REST API on [**restdb.io**](https://restdb.io/) as described above. 

2. Fork and clone the [**restaurant-reviews-stage-4**](https://github.com/katerina-tziala/restaurant/tree/restaurant-reviews-stage-4) repository.

3. Navigate from your terminal inside the /app folder and run  ***npm install*** to install the project's dependencies.

4.  Make sure that the ***app_params*** of in the *config.json* file inside the **gulp_tasks** folder are defined appropriately:

    - **_APP_PATH:** The url of the path of the app (e.g.: `http://localhost:<PORT>/`).

    - **_START_URL_:** The url of the index.html file (e.g.: `http://localhost:<PORT>/index.html`).

    - **_SCOPE_:** Scope of application.

    - **_DATABASE_API_KEY:** Add your own API key for the [**restdb.io**](https://restdb.io/) database.

    - **_MAPBOX_API_KEY_:** Add your own [**Mapbox API key**](https://www.mapbox.com/?utm_source=googlesearch&utm_medium=paid-search&utm_campaign=CHKO-GG-PR01-Mapbox-BR.Broad-INT-Search&utm_content=search-ad&gclid=EAIaIQobChMI1szU_9-74QIVz-F3Ch3miw9IEAAYASAAEgLAHfD_BwE).
    
    - **_RESTAURANTS_URL_:** The url to fetch the restaurants, which is provided from the [**restdb.io**](https://restdb.io/).
    
    - **_REVIEWS_URL_:** The url to fetch the reviews, which is provided from the [**restdb.io**](https://restdb.io/).
      <p align="center">
        <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_4/app_params.png" alt="change app parameters" width="80%" height="auto">
      </p>
5. Navigate from your terminal inside the /app folder and run ***gulp*** to bundle and build the app.
    <p align="center">
        <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/bundle_app.png" alt="running gulp to build the app" width="80%" height="auto">
    </p>

6. Choose the /dist folder of the project from the *Web Server for Chrome* app.
    <p align="center">
        <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_4/server.png" alt="setting up local server" width="40%" height="auto">
    </p>

7. Launch the website with the ***Web Server for Chrome*** app!
 
## Upload Live Demo

1. Create an online NoSQL database backend and a REST API on [**restdb.io**](https://restdb.io/) as described above. 

2. Fork and clone the [**restaurant_reviews-stage_4**](https://github.com/katerina-tziala/restaurant/tree/restaurant_reviews-stage_4) repository.

3. Navigate from your terminal inside the /app folder and run  ***npm install*** to install the project's dependencies.

4. Make sure that the ***app_params*** of in the *config.json* file inside the **gulp_tasks** folder are defined appropriately:

    - **_APP_PATH:** The url of the path of the app (`https://katerina-tziala.github.io/restaurant_reviews_app/`).

    - **_START_URL_:** The url of the index.html file (`https://katerina-tziala.github.io/restaurant_reviews_app/index.html`).

    - **_SCOPE_:** Scope of application (`/restaurant_reviews_app/`).

    - **_DATABASE_API_KEY:** Add your own API key for the [**restdb.io**](https://restdb.io/) database.

    - **_MAPBOX_API_KEY_:** Add your own [**Mapbox API key**](https://www.mapbox.com/?utm_source=googlesearch&utm_medium=paid-search&utm_campaign=CHKO-GG-PR01-Mapbox-BR.Broad-INT-Search&utm_content=search-ad&gclid=EAIaIQobChMI1szU_9-74QIVz-F3Ch3miw9IEAAYASAAEgLAHfD_BwE).

    - **_RESTAURANTS_URL_:** The url to fetch the restaurants, which is provided from the [**restdb.io**](https://restdb.io/).

    - **_REVIEWS_URL_:** The url to fetch the reviews, which is provided from the [**restdb.io**](https://restdb.io/).
      <p align="center">
        <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_4/app_params.png" alt="change app parameters" width="80%" height="auto">
      </p>

5. Update the scope of the Service Worker in the ***config.json*** file inside the ***gulp_tasks*** folder:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;from&nbsp;&nbsp;&nbsp;<img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/sw_scope.png" alt="service worker scope of localhost" width="29.5%" height="auto">&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;<img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/sw_demo_scope.png" alt="service worker scope of demo app" width="40%" height="auto">

6. Navigate from your terminal inside the /app folder and run ***gulp*** to bundle and build the app.
  <p align="center">
      <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_4/bundle_app_demo.png" alt="running gulp to build the app" width="80%" height="auto">
  </p>

7. Upload all files located in the ***/dist*** folder of the project to the ***docs*** folder of the master branch in one of your github repositories.

8. In the **GitHub Pages** section of your repository settings, select the **/docs** to build and launch your app.
        <p align="center"><img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/github_pages.png" alt="github pages" width="80%" height="auto"></p>

## Auditing the Restaurant Reviews App

When launching the app locally all metrics (Responsive Design, Accessibility, Performance) are maintained. For the ***Live Demo*** of the app, performance metrics are illustraded in the following figures:

   - **Lighthouse Metrics for index.html**
   <p align="center">
      <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_4/RR-S4_audit_index.png" alt="lighthouse metrincs for index page" width="100%" height="auto">
      </p><br>

   - **Lighthouse Metrics for restaurant.html**
   <p align="center">
      <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_4/RR-S4_audit_restaurant.png" alt="lighthouse metrincs for restaurant page" width="100%" height="auto">
      </p>
<br><br>

## Progressive Wep App

The  ***Restaurant Reviews App***  is a PWA. Such web applications are installable and live on the user's home screen, without the need for an app store. In stages 2 and 3 it was illustrated how the app can be installed on the home page of the  ***Chrome***  browser. The following figure illustrates how the app can be installed on a mobile device.<br>
 <p align="center">
  <img src="https://github.com/katerina-tziala/restaurant_reviews_app/blob/master/repository_images/stage_4/rr_pwa_mobile.png" alt="installing the app on a mobile device" width="100%" height="auto">
  </p>

