<h1>Restaurant Reviews App: Stage 3</h1>
This is the third and final stage of the three stage course material project <b>Restaurant Reviews</b>. Building upon the responsive, accessible and connected application that was developed incrementally in the first two stages, the app should now provide additional functionality. Users should now be able to create their own reviews and add restaurants in their favorites list. If the app is offline, form submissions should defer updating to the remote database until a connection is established. The preparation to start working on this project and implement the requirements documented below, included:

 - Fork and clone the [**stage-3 Node development server**](https://github.com/udacity/mws-restaurant-stage-3) repository.
 - Run the development server locally to develop the project code.<br><br>
 
<h2>Project Requirements</h2>
 
  - **User Interface:** Users are able to mark a restaurant as a favorite (and remove a restaurant from favorites), this toggle is visible in the application. Users are also able to add their own reviews for a restaurant. Form submission works properly and adds a new review to the database.

  - **Offline Use:** The client application works offline. JSON responses are cached using the IndexedDB API. Any data previously accessed while connected is reachable while offline. Users are able to mark a restaurant as a favorite (and remove a restaurant from favorites) while offline and the request is sent to the server when connectivity is re-established. Users are able to add a review to a restaurant while offline and the review is sent to the server when connectivity is re-established.
  
 - **Responsive Design:** The application maintains a responsive design on mobile, tablet and desktop viewports. All new features are responsive, including the form to add a review and the control for marking a restaurant as a favorite.

 - **Accessibility:** The application retains accessibility features from the previous projects. Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly. Roles are correctly defined for all elements of the review form. Modal or interstitial windows appropriately lock focus.

 - **Meet Performance Requirements:** Optimize the site to ensure that the following performance benchmarks are satisfied (measure performance using the Lighthouse):
   - **Progressive Web App** score should be at **90 or better**.
   - **Performance** score should be at **90 or better**.
   - **Accessibility** score should be at **90 or better**.
<br><br>
 
<h2>Local Setup of the Project</h2>

**1.** Fork and clone the [**stage-3 Node development server**](https://github.com/udacity/mws-restaurant-stage-3) repository.

**2.** Follow the README file of the server repository to get the Node development server up and running locally on your computer.

**3.** Fork and clone the [**restaurant_reviews-stage_3**](https://github.com/katerina-tziala/restaurant/tree/restaurant_reviews-stage_3) repository.

**4.** Navigate from your terminal inside the /app folder and run  ***npm install*** to install the project's dependencies.

**5.** Add your [**Mapbox API key**](https://www.mapbox.com/?utm_source=googlesearch&utm_medium=paid-search&utm_campaign=CHKO-GG-PR01-Mapbox-BR.Broad-INT-Search&utm_content=search-ad&gclid=EAIaIQobChMI1szU_9-74QIVz-F3Ch3miw9IEAAYASAAEgLAHfD_BwE) in the ***mapboxkey*** in the *config.json* file inside the **gulp_tasks** folder. Make sure that the ***app_params*** of this file are defined appropriately (check the path, the start_url, the scope and the endpoints).
<p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/app_params.png" alt="change app parameters" width="80%" height="auto">
</p>

**6.** Navigate from your terminal inside the /app folder and run ***gulp*** to bundle and build the app.
<p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/bundle_app.png" alt="running gulp to build the app" width="80%" height="auto">
</p>

**7.** Choose the /dist folder of the project from the *Web Server for Chrome* app.
<p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/server.png" alt="setting up local server" width="40%" height="auto">
</p>

**8.** Launch the website with the ***Web Server for Chrome*** app and while the ***Node development server*** is up and running!<br><br>

<h2>Auditing the Restaurant Reviews App</h2>
After completing the third stage of the project, the application was audited. The following figures illustrate the audit results.

 - **User Interface**
 
   - ***Add Restaurant to or Remove Restaurant from Favourites***
    <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/RR-S3_favorite-toggle.png" alt="add restaurant to or remove restaurant from favourites" width="100%" height="auto">
    </p><br>

   - ***Add, Edit or Delete Review***
    <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/RR-S3_adding_review.png" alt="add, edit or remove review" width="100%" height="auto">
    </p><br>

 - **Offline Use**
 
   - ***index.html offline***
    <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/RR-S3_offline_index.png" alt="index.html offline" width="100%" height="auto">
    </p><br>

   - ***restaurant.html offline***
    <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/RR-S3_offline_restaurant.png" alt="restaurant.html offline" width="100%" height="auto">
    </p><br>

   - ***cached assets and data***
    <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/RR-S3_cached_assets.png" alt="cached assets and data" width="100%" height="auto">
    </p><br> 
    
    
 - **Lighthouse Metrics for index.html**
 <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/RR-S3_audit_index.png" alt="lighthouse metrincs for index page" width="100%" height="auto">
    </p><br>
    
 - **Lighthouse Metrics for restaurant.html**
 <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/RR-S3_audit_restaurant.png" alt="lighthouse metrincs for restaurant page" width="100%" height="auto">
    </p><br>

<h2>Progressive Wep App</h2>

 - **Reliable:** Loads instantly even in uncertain network conditions.
 - **Fast:** Responds quickly to user interactions with silky smooth animations and no janky scrolling.
 - **Engaging:** Feels like a natural app on the device, with an immersive user experience.
<p align="center">
 <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/pwa1.png" alt="restaurant reviews app, installing the app" width="100%" height="auto">
</p><br><br>
<p align="center">
 <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_3/pwa2.png" alt="restaurant reviews app, browser apps" width="100%" height="auto">
</p>
