# 🔐 SecureLogin — Login Authentication System

A simple client-side login authentication system built using HTML, CSS, and JavaScript as part of the Oasis Infobyte Web Development & Designing Internship.

## 📌 Task

**Level 2 — Task 4: Login Authentication System**

The project provides user registration, login validation, session-based access to a protected dashboard, and logout functionality.

## ✨ Features

- User registration with username and email
- Password validation
  - Minimum 8 characters
  - At least 1 number
- Duplicate username/email detection
- Login using username or email
- Generic error message for invalid credentials
- Passwords stored as SHA-256 hashes instead of plain text
- Protected dashboard after successful login
- Automatic redirection when accessing the dashboard without a session
- Logout functionality
- Session management using localStorage
- Responsive and user-friendly interface
- Form validation and error handling

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Web Crypto API
- localStorage

## 📂 Project Structure

```text
WebDev-L2-Login-Authentication/
│
├── index.html
├── register.html
├── dashboard.html
├── style.css
├── script.js
├── README.md
│
└── screenshots/
    ├── creating account.png
    ├── error or invalid password.png
    ├── login authentication home page.png
    └── login success - dashboard open.png
    🔒 Authentication Flow
User creates an account through the registration page.
The password is validated before registration.
The password is converted into a SHA-256 hash.
User details are stored in localStorage.
The user logs in using their username/email and password.
After successful authentication, a session is created.
The protected dashboard is displayed only for authenticated users.
Logout removes the session and returns the user to the login page.
📸 Screenshots

The screenshots folder contains the main registration, validation, login, and dashboard outputs.

🎯 Internship Requirement

This project was developed as part of the Oasis Infobyte Web Development & Designing Internship — Level 2 Task 4.

👩‍💻 Author

Shaik Zara Sultana

B.Tech CSE — Artificial Intelligence
Narayana Engineering College, Nellore