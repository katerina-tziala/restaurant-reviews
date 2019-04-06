<h1>Restaurant Reviews App: Stage 2</h1>
This is the second stage of the three stage course material project <b>Restaurant Reviews</b>. Building upon the responsive and accessible design that was developed in the first stage, the app should now connect to an external server
to retrieve JSON data. The preparation to start working on this project and implement the requirements documented below, included:

 - Fork and clone the [**server**](https://github.com/udacity/mws-restaurant-stage-2) repository.
 - Run the development server locally to develop the project code.<br><br>
<h2>Project Requirements</h2>
Build off of your existing Restaurant Reviews app to create a fully-featured app that communicates with a backend server and handles asynchronous requests.

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


<h2>Auditing the Restaurant Reviews App</h2>


