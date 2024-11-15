Here's a sample `README.md` file for your MERN stack project based on the provided instructions:

---

# Car Management System

This project is a full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to manage a car library with functionalities to view, add, update, and delete car information. The project is divided into two parts: frontend (React) and backend (Node.js with Express and MongoDB).

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (preferably the latest LTS version)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or using a cloud service like MongoDB Atlas)

## Getting Started

### Step 1: Clone the repository

First, clone the repository to your local machine.

```bash
git clone https://github.com/Amanyara21/Spyne-Assignment
cd Spyne-Assignment
```


### Step 2: Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd car_library
    ```

2. Create a `.env` file inside the `car_library` folder and add the following environment variable:

    ```bash
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Start the frontend development server:

    ```bash
    npm run dev
    ```

   This will start the frontend on `http://localhost:5173`.

### Step 3: Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd ..
    cd backend
    ```

2. Create a `.env` file inside the `backend` folder and add the following environment variables:

    ```bash
    MONGO_URI=mongodb://localhost:27017/carmanagement
    JWT_SECRET=testjwtsecret@123
    FRONTEND_URL=http://localhost:5173
    ```

   - `MONGO_URI` is the connection string to your MongoDB database.
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

   This will start the backend on `http://localhost:5000`.

### Step 4: Access the Application

Once both frontend and backend servers are running:

- Visit the frontend at [http://localhost:5173](http://localhost:5173).
- The application should be fully functional, allowing you to interact with the car library.


## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
