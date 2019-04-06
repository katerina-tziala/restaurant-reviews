<h1>Restaurant Reviews App</h1>
<h2>Branches</h2>
This repository is split into the following branches based on the app's phase of development.

 - [**restaurant_reviews-stage_1**](https://github.com/katerina-tziala/restaurant/tree/restaurant_reviews-stage_1)**:** Building upon the provided restaurant reviews website, converts the existing static design into a fully responsive design that renders appropriately in any viewport including desktop, tablet, and mobile displays. Additionally, implements all standard accessibility features that are currently missing with the use of semantic markup and ARIA atributes. Finally, starts converting this website to a Progressive Web Application by caching some assets for offline use.


 - [**restaurant_reviews-stage_2**](https://github.com/katerina-tziala/restaurant/tree/restaurant_reviews-stage_2)**:** Building upon the responsive and accessible design that was developed in **restaurant_reviews-stage_1**, the app now retrieves JSON data from an external server by using Asynchronous JavaScript requests with the use of the fetch() API. Received data are stored in the client side in order to be accessible offline using the IndexedDB API. Appropriate meta-tags and the app manifest are implemented to take a step further in the implementation of a PWA. The Gulp build system is utilized to bundle, optimize and build the app. Performance benchmarks, measured using the Lighthouse, are satisfied (Progressive Web App >90, Performance >70, Accessibility >90).<br>
 <i>The app now must be run alongside with the [**mws-stage-restaurant-stage-2**](https://github.com/udacity/mws-restaurant-stage-2) back end data server.</i>
 
 




<h2>asd</h2>

 - CSS3, Flexbox and media queries for responsive design
 - Semantic HTML5 markup and ARIA atributes for accessibility
 - Vanilla Javascript following the ES6 JavaScript Syntax (arrow functions, destructuring, sting literals, sets, etc.)
 -  Cache API and a ServiceWorker for offline use
 - Pull data through Ajax (Fetch API) from a live data source
 - Cache the JSON response data on the client with IndexedDB for offline access
 - Create a build system with  Gulp
