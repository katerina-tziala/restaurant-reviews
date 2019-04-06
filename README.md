<h1>Restaurant Reviews App: Stage 2</h1>
This is the second stage of the three stage course material project <b>Restaurant Reviews</b>. Building upon the responsive and accessible design that was developed in the first stage, the app should now connect to an external server
to retrieve JSON data. The preparation to start working on this project and implement the requirements documented below, included:

 - Fork and clone the [**server**](https://github.com/udacity/mws-restaurant-stage-2) repository.
 - Run the development server locally to develop the project code.<br><br>
<h2>Project Requirements</h2>
 - **Application Data Source:** The client application should pull restaurant data from the development server by using Asynchronous JavaScript requests (AJAX) with the use of the fetch() API, parse the JSON response, and use the information to render the appropriate sections of the application UI.
 - **Offline Use:** The client application must work offline. Data received from the server (JSON responses) are cached in an offline accessible database using the IndexedDB API, which will create an app shell architecture. Any data previously accessed while connected is reachable while offline.

 - **Meet the Minimum Performance Requirements:** Optimize the site to ensure that the following performance benchmarks are satisfied (measure performance using the Lighthouse):
 
   - **Progressive Web App** score should be at **90 or better**.
   - **Performance** score should be at **70 or better**.
   - **Accessibility** score should be at **90 or better**.
 
 - **Responsive Design:** The application maintains a responsive design on mobile, tablet and desktop viewports.

 - **Accessibility:** The application retains accessibility features from the Stage 1 project. Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly.<br><br>
<h2>Local Setup of the Project</h2>

**1.** Fork and clone the [**server**](https://github.com/udacity/mws-restaurant-stage-2) repository.

**2.** Follow the README file of the server repository to get the Node development server up and running locally on your computer.

**3.** Fork and clone the [**restaurant_reviews-stage_2**](https://github.com/katerina-tziala/restaurant/tree/restaurant_reviews-stage_2) repository.

**4.** Navigate from your terminal inside the /app folder and run  ***npm install*** to install the project's dependencies.

**5.** Add your [**Mapbox API key**](https://www.mapbox.com/?utm_source=googlesearch&utm_medium=paid-search&utm_campaign=CHKO-GG-PR01-Mapbox-BR.Broad-INT-Search&utm_content=search-ad&gclid=EAIaIQobChMI1szU_9-74QIVz-F3Ch3miw9IEAAYASAAEgLAHfD_BwE) in the ***mapboxkey*** in the *config.json* file inside the **gulp_tasks** folder. Make sure that the ***app_params*** of this file are defined appropriately (check the path, the start_url, the scope and the endpoints).
<p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_2/app_params.png" alt="change app parameters" width="80%" height="auto">
</p>

**6.** Navigate from your terminal inside the /app folder and run  ***gulp*** to bundle and build the app.
<p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_2/bundle_app.png" alt="running gulp to build the app" width="80%" height="auto">
</p>

**7.** Choose the /dist folder of the project from the *Web Server for Chrome* app.
<p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_2/server.png" alt="setting up local server" width="40%" height="auto">
</p>

**8.** Launch the website with the ***Web Server for Chrome*** app and while the ***Node development server*** is up and running!

<h2>Auditing the Restaurant Reviews App</h2>
After completing the second stage of the project, the application was audited. The following figures illustrate the audit results.

 - **Application Data Source and Offline Use**
    <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_2/app_data.png" alt="caching data in Indexed DB" width="100%" height="auto">
    </p><br>
    
 - **Lighthouse Metrics for index.html**
 <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_2/RR-S2_audit_index.png" alt="lighthouse metrincs for index page" width="100%" height="auto">
    </p><br>
    
 - **Lighthouse Metrics for restaurant.html**
 <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_2/RR-S2_audit_restaurant.png" alt="lighthouse metrincs for restaurant page" width="100%" height="auto">
    </p><br>

<h2>Towards a Progressive Wep App</h2>
As stated by Google Developers, Progressive Web Apps are installable and live on the user's home screen, without the need for an app store. They offer an immersive full screen experience with help from a web app manifest file that allows us to control how our app appears and how it's launched. The following images illustrate how the browser (Chrome) installs the <b>Restaurant Reviews App</b> on the user's home screen.<br><br>
<p align="center">
 <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_2/pwa1.png" alt="restaurant reviews app, installing the app" width="100%" height="auto">
</p><br><br>
<p align="center">
 <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_2/pwa2.png" alt="restaurant reviews app, browser apps" width="100%" height="auto">
</p>


