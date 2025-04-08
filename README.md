# STDISCM_ProblemSet4_DistributedFaultTolerance

Distributed systems allow for fault tolerance.  For this exercise you are tasked to create an online enrollment system with different services distributed across multiple nodes.

The system should have the following bare-minimum features:

1) Login/logout. Track sessions across different nodes. (Use OAuth / JWT)
2) View available courses.
3) Students to enroll to open courses.
4) Students to view previous grades.
5) Faculty to be able to upload grades.

The application should be web based using MVC.  The view will be a node on its own.  While the rest of the features / API / controllers will also be on a separate node.
Use of networked virtual machines/bare-metal computers is recommended.

When a node is down, on the features supported by that node should stop working, but the rest of the application should still work.

## Slides
https://docs.google.com/presentation/d/1jRAXIWoUqALTKpbHmSpHNAFz2he88n4_/edit?usp=sharing&ouid=101928301120544085464&rtpof=true&sd=true

## Dependencies and Prerequisites

- **Node.js and npm**
  - Recommended Node.js version: v14 or above
  - npm is installed automatically with Node.js

- **MongoDB**
  - A running MongoDB server is required and MongoDB Compass
  - Each service can use its own database (e.g., "auth_service" and "course_service")

- **Oracle VirtualBox (latest version)**
  - Setup a Windows 11 virtual machine
  - On the VM, install Node.js, npm, and MongoDB

- **Text Editor/IDE**
  - Visual Studio Code (or your preferred code editor)

- **Network Configuration**
  - Ensure that your VM’s network is configured as a "Bridged Adapter" so the host machine can access the VM’s IP address

## Repository Structure

The repository is organized into separate folders (each representing a node):

distributed-enrollment<br>
├── frontend/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;# Frontend (View) node running on your host (port 8080)<br>
├── broker/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Broker (API Gateway) node running on your host (port 3000)<br>
├── auth-service/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Auth Service node (handles login/authentication) to run on the VM (port 4000)<br>
└── course-service/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Course Service node (handles courses, enrollments, grades) to run on the VM (port 5000)<br>

## Installing

1. **Clone the Repository**

   Clone this repository to both your host machine and your virtual machine.

2. **Install Dependencies in Each Node**

   For each node (Frontend, Broker, Auth Service, Course Service), open a terminal in the respective folder and run:
  
       npm install

   This will install all Node.js dependencies required for that node (e.g., Express, EJS, mongoose, axios, jsonwebtoken, etc.).

## Executing the Program

### Overview

- **Host Machine:**  
  - Run the **Frontend** node (running on port 8080) and the **Broker** node (running on port 3000).

- **Virtual Machine (VM):**  
  - Run the **Auth Service** node (running on port 4000) and the **Course Service** node (running on port 5000).

- The **Broker** acts as the central API gateway, forwarding API requests from the Frontend to the correct backend (Auth Service or Course Service). It also performs health checks to determine if a backend service is up.

### Instructions

1. **Set Up the Virtual Machine**

   - Install Oracle VirtualBox (latest version) on your host machine.
   - Create and set up a Windows 11 virtual machine.
   - On the VM, install:
       - Node.js and npm
       - MongoDB (and ensure it is running)
   - Clone the repository on the VM
   - On the VM, navigate to the `auth-service` folder and install dependencies:

         cd distributed-enrollment/auth-service
         npm install
         node app.js

       This starts the Auth Service node on port 4000.

   - On the VM, navigate to the `course-service` folder and install dependencies:

         cd distributed-enrollment/course-service
         npm install
         node app.js

       This starts the Course Service node on port 5000.

2. **Set Up the Host Machine**

   - On your host machine, clone the repository (if not already done).
   - In the host’s terminal, navigate to the `frontend` folder and install dependencies:

         cd distributed-enrollment/frontend
         npm install
         node app.js

       This starts the Frontend node on port 8080.

   - In another terminal on the host, navigate to the `broker` folder and install dependencies:

         cd distributed-enrollment/broker
         npm install
         node app.js

       This starts the Broker node on port 3000.

   - **Configure Environment Variables via .env:**
     
     To ease testing in various VMS, in the Broker’s folder, ensure the `.env` file contains the correct endpoints for the backend services. For example:

         AUTH_SERVICE_URL=http://<VM_IP_ADDRESS>:4000
         COURSE_SERVICE_URL=http://<VM_IP_ADDRESS>:5000

     Replace `<VM_IP_ADDRESS>` with your VM’s IP address.
     
     To find the VM's IP address:
       - On Windows (inside the VM): open Command Prompt and run `ipconfig`

3. **Using the Application**

   - On your host machine, open a web browser and navigate to:  
     `http://localhost:8080`
   - You will see the homepage of the Distributed Enrollment System.
   - Click the **Login** button.
   - Log in with the dummy credentials:
       - **Student:** username: `student1` / password: `password`
       - **Faculty:** username: `faculty1` / password: `password`
   - After login, you will be taken to the dashboard:
       - **Students** can view courses, enroll in a course, and view grades.
       - **Faculty** have options to view student details and upload grades.
   - All API calls (e.g., login, course enrollment) are forwarded by the Broker. If one backend node (Auth or Course Service) is down, specific error messages will be displayed on the Frontend.

4. **Simulating Fault Tolerance**

   - **Simulate Node Failure:**
     
     To simulate a failure, stop one of the backend services (for example, stop the Course Service on the VM by pressing `Ctrl+C` in its terminal).
     
   - **Test Error Handling:**
     
     On the Frontend, perform an operation that depends on the downed service (e.g., enroll in a course or view student details). You should see a detailed error message (e.g., "Course service is down") displayed on the Frontend.
     
   - **Restore Service:**
     
     Restart the stopped service to resume full functionality.

