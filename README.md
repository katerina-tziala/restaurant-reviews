<h1>Restaurant Reviews App: Stage 1</h1>
<h2>Project Requirements</h2>

 - **Make the provided site fully responsive:** All of the page elements should be usable and visible in any viewport, including desktop, tablet, and mobile displays. Images shouldn't overlap, and page elements should wrap when the viewport is too small to display them side by side.

 - **Make the provided site fully accessible:** Implement web accessibility features to ensure that all content-related images include appropriate alternate text that clearly describes the content of the images. Additionally, manage focus appropriately to allow easy navigation of the site, allowing users to noticeably tab through each of the important elements of the page. Finally, all site elements should be defined semantically with the use of semantic markup where possible, and ARIA attributes when semantic markup is not feasible. When required add screen-reader-only attributes when appropriate to add useful supplementary text.

 - **Cache the static site for offline use:** Using the Cache API and a ServiceWorker when available in the browser, the website caches responses to requests for site assets, so that any page (including images) that has been visited is accessible offline.

 - **Maintain the included functionality:** Ensure that implemented changes still facilitate the functionality of the website.
<br><br>
<h2>Local Setup of the Project</h2>

**1.** Fork and clone the [**restaurant_reviews-stage_1**](https://github.com/katerina-tziala/restaurant/tree/restaurant_reviews-stage_1) repository.

**2.** To launch the website install and use the [**Web Server for Chrome**](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb).

**3.** Choose the /src folder of the project from the *Web Server for Chrome* app.

**4.** Change the ***port*** and the ***start_url*** in the *variables.js* file with your own port provided by the *Web Server for Chrome*, and the generated url for the index.html file.

**5.** Get your own [**Mapbox API key**](https://www.mapbox.com/?utm_source=googlesearch&utm_medium=paid-search&utm_campaign=CHKO-GG-PR01-Mapbox-BR.Broad-INT-Search&utm_content=search-ad&gclid=EAIaIQobChMI1szU_9-74QIVz-F3Ch3miw9IEAAYASAAEgLAHfD_BwE). and add it in the ***mapboxToken*** in the *variables.js* file.

**6.** Launch the website!
<br><br>
<h2>Auditing the Restaurant Reviews App</h2>
After completing the first stage of the project the application was audited. The following figures illustrate the audit results for each interface.

 - **index.html:**<br>
   **1.** Responsive Design
   <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_1/RR-S1_Responsive_index.png" alt="restaurant reviews app, index page responsive layout" width="100%" height="auto">
    </p>
    **2.** Accessibility
   <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_1/RR-S1_Accessibility_index.png" alt="restaurant reviews app, index page accessibility audit" width="100%" height="auto">
    </p>
    **3.** Offline
   <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_1/RR-S1_Offline_index.png" alt="restaurant reviews app, index page offline" width="100%" height="auto">
    </p>
 
  - **restaurant.html:**<br>
   **1.** Responsive Design
   <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_1/RR-S1_Responsive_restaurant.png" alt="restaurant reviews app, restaurant page responsive layout" width="100%" height="auto">
    </p>
    **2.** Accessibility
   <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_1/RR-S1_Accessibility_restaurant.png" alt="restaurant reviews app, restaurant page accessibility audit" width="100%" height="auto">
    </p>
    **3.** Offline
   <p align="center">
    <img src="https://github.com/katerina-tziala/restaurant/blob/master/repository_images/stage_1/RR-S1_Offline_restaurant.png" alt="restaurant reviews app, restaurant page offline" width="100%" height="auto">
    </p>


