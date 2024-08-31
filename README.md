# **Gym Management Application**

## **Overview**
This is a web-based application for a **Gym** maintaining a database of `gymMember`, `gymClass` and `memberClass`(enrollments). This project provides CRUD functionality for **Creating**, **Retrieving** (Searching), **Updating**, and **Deleting** ,  `gymMember`, `gymClass` and `memberClass` information from a MongoDB database.

This project was made as part of two assignments, assignment 06 and 07, from my module, **Web Information Processing** in Maynooth University, National University of Ireland Maynooth.

Assignment 06 - Build the Backend: a Node.js application that implements the RESTful API functionality for gym members, classes and enrollments.

Assignment 07 - Build the Frontend which consumes the Restful API from assignment 06.

## Technologies Used

### Frontend
- HTML
- CSS (Bootstrap, Bootsnipp)
- JavaScript (jQuery, AJAX)

### Backend
- Express.js
- Node.js
- MongoDB Atlas
- CORS
- Postman

### Browser
- Google Chrome Version 124.0.6367.119 (Official Build) (64-bit)

### Operating System
- Windows

## Project Setup

### Backend Setup

1. **Install Node.js:**
   - [Download Node.js](https://nodejs.org/en/download)
   - Initialize npm: `cd backend` then `npm init -y`

2. **Install Dependencies:**
   - Express for the server: `npm i express`
   - Nodemon for automatic server restarts: `npm i nodemon`
   - Mongoose for MongoDB connection: `npm i mongoose`
   - Dotenv for environment variables: `npm i dotenv`
   - CORS for cross-origin requests: `npm i cors`

3. **Run the Backend:**
   - Start the server: `cd backend` then `npm run dev`
   - Expected output:
     ```
     [nodemon] 3.1.0
     [nodemon] to restart at any time, enter `rs`
     [nodemon] watching path(s): *.*
     [nodemon] watching extensions: js,mjs,cjs,json
     [nodemon] starting `node index.js`
     App connected to the database
     App is listening to port: 5555
     ```

### Frontend Setup

1. **Create Frontend:**
   - Organize your project structure with a root directory (e.g., `assignment-07` or `GYM`) containing folders for `frontend` and `backend`.

2. **Setup Frontend Environment:**
   - Navigate to the frontend directory: `cd frontend`
   - Create the required HTML, CSS, and JavaScript files:
     - `assignment-07.html` or `index.html`
     - `assignment-07.style` or `styles.css`
     - `assignment-07-gymClassCRUD.js` or `scripts.js`

3. **Include Libraries and Frameworks:**
   - Use CDN links for Bootstrap, jQuery, and Bootsnipp components. Add Bootstrap and CSS in the `<head>` section of your HTML file:
     ```html
     <!-- Bootstrap CSS -->
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
     
     <!-- Custom CSS -->
     <link rel="stylesheet" href="assignment-07.css">
     ```
    -Add jQuery and JS after the `</body>` section of your HTML file:

     ```
     </body>

<!-- JQuery import -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

<!-- Javascript files -->
<script src="assignment-07-gymClassCRUD.js"></script>
<script src="assignment-07-gymMemberCRUD.js"></script>
<script src="assignment-07-memberClassCRUD.js"></script>

</html>
     ```

4. **Run the Frontend:**
   - Right click `assignment-07.html`, then click 'Show in browser', to access the web application.


## DATABASE DESIGN

This project uses a NoSQL database design with MongoDB, focusing on collections for three main entities: `gymMember`, `gymClass`, and `memberClass`. These collections store documents that represent individual gym members, gym classes, and the relationship between members and the classes they are enrolled in.

### Data Modeling Approach

- **Entities and Collections**:
  - `gymMember`: Contains member details such as title, first name, last name, email address, and membership status.
  - `gymClass`: Contains details about gym classes, including the class name, day of the week, session length, price, and the current number of members.
  
- **Relationship (memberClass)**:
  - The `memberClass` collection links `gymMember` to `gymClass`. Each document in this collection represents a membership in a specific class, referencing a gym member and the class they are enrolled in.

- **GymMember Schema**:
  - `title`: String (e.g., Mx, Ms, Mr, Mrs, Miss, Dr, Other)
  - `firstName`: String
  - `lastName`: String
  - `emailAddress`: String (required and should be unique)
  - `premiumMembership`: Boolean (indicates if the member has a premium membership)

- **GymClass Schema**:
  - `className`: String (name of the gym class, e.g., Yoga, Pilates, etc.)
  - `classDay`: String (day of the week the class is held, e.g., Monday)
  - `sessionLengthHrs`: Number (duration of the class in hours)
  - `price`: Number (cost of the class)
  - `currentNumberOfMembers`: Number (current count of members enrolled in the class)

- **MemberClass Schema**:
  - `userID`: ObjectId (reference to `GymMember`)
  - `classID`: ObjectId (reference to `GymClass`)
  - `timestamps`: Automatically captures the creation and update timestamps

### Cascading Deletes

- **Maintaining Data Integrity**: To ensure data integrity, middleware functions are employed for cascading deletes and updating related data:
  - When a `gymMember` is deleted, all associated records in the `memberClass` collection are automatically removed using post-remove middleware. This ensures that no orphaned records remain.
  - Similarly, when a `gymClass` is deleted, any associated records in the `memberClass` collection are also removed. This maintains the integrity of the data by preventing references to non-existent classes.
  - The `memberClass` schema uses middleware to update the `currentNumberOfMembers` in `gymClass` whenever a member joins or leaves a class.

### Impact on Code Development

- **Pre-remove and Post-remove Middleware**: The use of pre-remove and post-remove middleware in the `gymMember` and `gymClass` schemas automates the maintenance of referential integrity. This reduces the need for manual handling of associated data deletions in the application logic.
- **Pre-save Middleware for Enrollment**: The pre-save middleware in the `memberClass` schema updates the `currentNumberOfMembers` field in the `gymClass` schema whenever a member joins or leaves a class. This dynamic updating helps keep the data accurate and reflects real-time changes in the class sizes.
- **Scalability and Flexibility**: MongoDB's document-based schema design provides flexibility, allowing easy modification of `gymMember`, `gymClass`, or `memberClass` structures. New fields can be added without major changes to the schema, supporting future scalability.
- **Error Handling and Logging**: Middleware includes basic logging and error handling, which aids in debugging and ensures that operations that affect data integrity are tracked and managed properly.

This structure ensures a well-organized and maintainable database design for the gym management system, allowing for efficient handling of member enrollments, class schedules, and related operations.

## Running the Project

1. **Backend:**
   - `cd backend`
   - `npm run dev`

2. **Frontend:**
   - Open `assignment-07.html` in your web browser.

## Testing Backend Routes in Postman

## Assignment06

### Gym Member Routes

1. **Create a New Gym Member (POST):**
   - **URL:** `http://localhost:5555/gymMember`
   - **Method:** POST
   - **Body (raw JSON):**
     ```json
     {
         "title": "Mr",
         "firstName": "Monty",
         "lastName": "Burns",
         "emailAddress": "monty.burns@gmail.com",
         "premiumMembership": true
     }
     ```

2. **Retrieve All Gym Members (GET):**
   - **URL:** `http://localhost:5555/gymMember`
   - **Method:** GET

3. **Retrieve a Random Gym Member (GET):**
   - **URL:** `http://localhost:5555/gymMember/random`
   - **Method:** GET

4. **Retrieve Gym Member by Matching First Name and Last Name (GET):**
   - **URL:** `http://localhost:5555/gymMember/matchingUsers?firstName=Lisa&lastName=Simpson`
   - **Method:** GET

5. **Retrieve Gym Member by ID (GET):**
   - **URL:** `http://localhost:5555/gymMember/663112c19a201cca3666b9db`
   - **Method:** GET

6. **Update Gym Member by ID (PUT):**
   - **URL:** `http://localhost:5555/gymMember/663112c19a201cca3666b9db`
   - **Method:** PUT
   - **Body (raw JSON):**
     ```json
     {
         "title": "Mr",
         "firstName": "Monty",
         "lastName": "Burns",
         "emailAddress": "monty.burns@gmail.com",
         "premiumMembership": false
     }
     ```

7. **Delete Gym Member by ID (DELETE):**
   - **URL:** `http://localhost:5555/gymMember/66354750cf58308af0f9407f`
   - **Method:** DELETE

### Gym Class Routes

1. **Create a New Gym Class (POST):**
   - **URL:** `http://localhost:5555/gymClass`
   - **Method:** POST
   - **Body (raw JSON):**
     ```json
     {
         "className": "BodyFat Burn Circuit",
         "classDay": "Thursday",
         "sessionLengthHrs": 1,
         "price": 18.99
     }
     ```

2. **Retrieve All Gym Classes (GET):**
   - **URL:** `http://localhost:5555/gymClass`
   - **Method:** GET

3. **Retrieve a Random Gym Class (GET):**
   - **URL:** `http://localhost:5555/gymClass/random`
   - **Method:** GET

4. **Retrieve Gym Class by Class Name (GET):**
   - **URL:** `http://localhost:5555/gymClass/byClassName?className=Boxing%20Bootcamp`
   - **Method:** GET

5. **Retrieve Gym Class by ID (GET):**
   - **URL:** `http://localhost:5555/gymClass/66326be8b936a36a1a6d6a45`
   - **Method:** GET

6. **Update Gym Class by ID (PUT):**
   - **URL:** `http://localhost:5555/gymClass/66326be8b936a36a1a6d6a45`
   - **Method:** PUT
   - **Body (raw JSON):**
     ```json
     {
         "className": "Firm Buns",
         "classDay": "Friday",
         "sessionLengthHrs": 1,
         "price": 12.99
     }
     ```

7. **Delete Gym Class by ID (DELETE):**
   - **URL:** `http://localhost:5555/gymClass/6632740922c0cab7c66c3d16`
   - **Method:** DELETE

### Enrollment (Member Class) Routes

1. **Create a Member Class Enrollment (POST):**
   - **URL:** `http://localhost:5555/memberClass`
   - **Method:** POST
   - **Body (raw JSON):**
     ```json
     {
         "userID": "663219b25cab47a1aaa6f7d1",
         "classID": "663275d43adff1782f55687d"
     }
     ```

2. **Retrieve All Member Class Enrollments (GET):**
   - **URL:** `http://localhost:5555/memberClass`
   - **Method:** GET

3. **Retrieve a Random Member Class Enrollment (GET):**
   - **URL:** `http://localhost:5555/memberClass/random`
   - **Method:** GET

4. **Retrieve All Classes by User ID (GET):**
   - **URL:** `http://localhost:5555/memberClass/matchingMemberClass?userID=663225f6a9b9982af6317cfa`
   - **Method:** GET

5. **Update Member Class by ID (PUT):**
   - **URL:** `http://localhost:5555/memberClass/66328c23fcca94fa96d1ade1`
   - **Method:** PUT
   - **Body (raw JSON):**
     ```json
     {
         "userID": "663219b25cab47a1aaa6f7d1",
         "classID": "663275d43adff1782f55687d"
     }
     ```

6. **Delete Member Class by ID (DELETE):**
   - **URL:** `http://localhost:5555/memberClass/66328c34fcca94fa96d1adeb`
   - **Method:** DELETE



## Frontend

## Overview

The frontend of this project is designed as a single HTML page that includes forms and interactive elements. The page provides CRUD functionality for Creating, Retrieving (Searching), Updating, and Deleting gymMember, gymClass and memberClass(enrollment) information.

Customers, Mobiles and Orders each have:
1. **Create Form** - A form for adding new gymMembers, gymClasss or memberClass(enrollments). Red asterix indicates a maditory field.

![Create Gym Member Form](https://github.com/DeclanDavis/Gym/blob/main/images/createGymMember.png?raw=true)

2. **Retrieve Form** - A search bar with an in page console view displaying the results in JSON format.  Can retrieve a gymMember, gymClass or memberClass(enrollment) randomly, by searching it's name or retrieve all the results.

![Retrieve Gym Member Form](https://github.com/DeclanDavis/Gym/blob/main/images/retrieveGymMember.png?raw=true)

3. **Update Form** - A form for updating a random gymMember, gymClass or memberClass(enrollment) information.

![Update Gym Member Form](https://github.com/DeclanDavis/Gym/blob/main/images/updateGymMember.png?raw=true)

4. **Delete Form** - A deletion form based on composite key depending on the entity and a confirmation box to confirm deletion.

![Delete Gym Member Form](https://github.com/DeclanDavis/Gym/blob/main/images/deleteGymMember.png?raw=true)

**JavaScript (AJAX and jQuery)**
   - Handles CRUD operations by sending AJAX requests to the backend and updating the frontend dynamically based on the responses.

## References

### Tutorials
- [Simple CRUD Application with jQuery, AJAX, and Express.js](https://www.youtube.com/watch?v=ldgl6z8dQtY)

### Documentation
- [W3Schools jQuery Tutorial](https://www.w3schools.com/jquery/default.asp)

### Tools and Services
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Postman](https://www.postman.com/)

