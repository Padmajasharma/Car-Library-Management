# Car Library Management System

This is a full-stack web application built using the **MERN stack** (MongoDB, Express, React, Node.js). The system allows users to manage a car library with functionalities to **view, add, update, and delete** car information. The project is divided into two parts: the **frontend** (React) and the **backend** (Node.js with Express and MongoDB).

**LIVE LINK**: [Car Management System](https://car-library-management.vercel.app/)

## Prerequisites

Before starting the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (preferably the latest LTS version)
- [MongoDB](https://www.mongodb.com/try/download/community) (either running locally or using a cloud service like MongoDB Atlas)

## Getting Started

Follow these steps to get the project up and running:

### Step 1: Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/Amanyara21/Spyne-Assignment
cd Spyne-Assignment
```

### Step 2: Set Up the Frontend

1. Navigate to the frontend directory:

    ```bash
    cd car_library
    ```

2. Create a `.env` file in the `car_library` folder and add the following environment variable:

    ```bash
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

3. Install the frontend dependencies:

    ```bash
    npm install
    ```

4. Start the frontend development server:

    ```bash
    npm run dev
    ```

   The frontend should now be available at `http://localhost:5173`.

### Step 3: Set Up the Backend

1. Navigate to the backend directory:

    ```bash
    cd .. 
    cd backend
    ```

2. Create a `.env` file in the `backend` folder and add the following environment variables:

    ```bash
    MONGO_URI=mongodb://localhost:27017/carmanagement
    JWT_SECRET=testjwtsecret@123
    FRONTEND_URL=http://localhost:5173
    ```

   - `MONGO_URI` specifies the connection string to your MongoDB database.
   - `JWT_SECRET` is the secret key for generating JSON Web Tokens.
   - `FRONTEND_URL` is the URL of the frontend application.

3. Install the necessary backend dependencies:

    ```bash
    npm install
    ```

4. Start the backend server:

    ```bash
    npm start
    ```

   The backend should now be available at `http://localhost:5000`.

### Step 4: Access the Application

Once both frontend and backend servers are running, you can access the application:

- **Frontend**: Visit [http://localhost:5173](http://localhost:5173)
- The application should be fully functional and allow you to interact with the car library (view, add, update, and delete cars).

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
