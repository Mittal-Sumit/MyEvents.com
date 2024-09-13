# MyEvent.com

A web application to manage events, track RSVPs, and send reminders. The platform allows admins to create and manage events, monitor guest lists, and track attendance, while users can register and view event details.

## Table of Contents
1. [Introduction]
2. [Features]
3. [Installation]
4. [Usage]
5. [Screenshots]
6. [Contact]

## Introduction

MyEvent.com is designed to streamline event organization, from creation and RSVP management to sending out reminders and tracking attendance. The platform includes role-based access control to manage permissions for admins and regular users. Users can register for events, while admins can monitor guest lists and event engagement.

## Features

- **User Registration and Authentication**
  - Users can create accounts, log in, reset passwords, and manage their profiles.
  - Admins can assign roles (User, Manager) to users.
  
- **Event Creation and Management**
  - Admins can create, update, and delete events.
  - Events include details like title, description, date, time, and location.
  
- **Event Registration (RSVPs)**
  - Users can view events, register for them, and receive reminders.
  
- **Guest List Management**
  - Admins can manage guest lists and monitor attendance.
  
- **Role-Based Access Control (RBAC)**
  - Control over who can manage events.
  
- **Reminders and Notifications**
  - Automated reminders are sent to registered users before events.

## Installation

### Prerequisites
- Node.js (>= 14.x)
- Python (>= 3.x)
- Django
- Django Rest Framework (DRF)
  
### Steps to install

1. Clone the repository:
   ```bash
   git clone https://github.com/Mittal-Sumit/MyEvents.com.git
   cd backend
Set up the backend (Django):

bash
Copy code
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Set up the frontend (React):

bash
Copy code
cd frontend
npm install
npm start

Usage

Admin Features:
Admins can log in and manage events, including creating new events, editing event details, and deleting events.
Admins can view and manage guest lists for each event.
Admins can analyze event attendance.

Manager Features:
Manager can create an account, log in, and view the list of available events.
Manager can register for events, and receive reminders before the event date.
Manager can view event details including date, time, and location.

User Features:
Users can create an account, log in, and view the list of available events.
Users can register for events, and receive reminders before the event date.
Users can view event details including date, time, and location.

Running the Project:
Backend: Run the Django server by navigating to the backend directory and using:

bash
Copy code
python manage.py runserver

Frontend: Run the React frontend using:

bash
Copy code
npm start


Contact
For more information or questions, please feel free to contact us:

Author: Sumit Mittal
Email: sushantm12345@gmail.com
