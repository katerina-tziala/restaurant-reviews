<h1>Restaurant Reviews App: Stage 4</h1>
This is the fourth stage of the <b>Restaurant Reviews</b> project. Building upon the PWA that was developed incrementally in the three previous stages, this stage includes the necessary changes to host the app and create a live demo. 


<h2>Project Requirements</h2>

  - **Update the app to work with a hosted NoSQL Database and a RESTful API:** Set up a NoSQL Database that contains the required data of the app, and create RESTful API to perform CRUD (Create, Read, Update, Delete) operations against the DB. Update the client application in order to make use of the new API.
   
 - **Responsive Design:** The application maintains a responsive design on mobile, tablet and desktop viewports. All new features are responsive, including the form to add a review and the control for marking a restaurant as a favorite.

 - **Accessibility:** The application retains accessibility features from the previous projects. Images have alternate text, the application uses appropriate focus management for navigation, semantic elements and ARIA attributes are used correctly. Roles are correctly defined for all elements of the review form. Modal or interstitial windows appropriately lock focus.

 - **Performance Requirements:** The application still satisfies performance benchmarks (measure performance using the Lighthouse):
   - **Progressive Web App** score should be at **90 or better**.
   - **Performance** score should be at **90 or better**.
   - **Accessibility** score should be at **90 or better**.
<br><br>


<h2>Setting up a hosted NoSQL Database and a RESTful API</h2>
For this stage an online database solution that offers both NoSQL DB storage and exposes a RESTful API was required. After an extensive research I decided to use

[**restdb.io**](https://restdb.io/)

: a NoSQL database cloud service, Database-as-a-Service (DBaaS), that offers the online NoSQL database backend for web and serverless applications. Furthermore, it is a simple to use, developer friendly and no-cost NoSQL database with data management app, schema builder, and REST API instantly available

([**restdb.io features**](https://restdb.io/features/)).
