# Auto detect text files and perform LF normalization
* text=auto

# OSHETU (Okwetu)

# Intelligent Educational Monitoring and Assessment Platform

---

#  About the Project

**OSHETU (Okwetu)** is a web-based platform designed to modernize the monitoring of academic performance through continuous tracking and accessible digital interfaces for students and teachers.

The system enables users to manage subjects, organize the teaching process, and lays the foundation for intelligent assessments and real-time performance analysis.

---

# Problem

In many educational contexts, especially in developing systems, there are critical challenges:

* Lack of continuous monitoring of student progress
* Low level of digitalization in education systems
* Difficulty in organizing subjects and classes efficiently
* Limited technological interaction between students and teachers

---

# Solution

OSHETU provides a digital platform with:

* ✔ User authentication system (login and registration)
* ✔ Role-based access (Student and Teacher)
* ✔ Dedicated dashboards for each user type
* ✔ Subject and class organization
* ✔ Simple and accessible user interface

---

# Implemented Features

# Authentication

* User registration
* Login with email and password
* User role selection:

  * Student
  * Teacher

---

# Student Dashboard

* View enrolled subjects
* Search functionality (subjects/teachers)
* Card-based interface

---

# Teacher Dashboard

* View assigned classes
* Basic class organization
* Simple management interface

---

# Landing Page

* Project presentation
* Highlights of key features:

* Automated assessment (planned)
* Performance analysis (planned)
* Real-time reports (planned)

---

# Technologies Used

* HTML5
* CSS3
* JavaScript

---

# Project Status

> Work in Progress

# Completed:

* [x] Frontend structure
* [x] Authentication system
* [x] Role-based user system (Student/Teacher)
* [x] Basic dashboards
* [x] Functional UI

# In Progress:

* [ ] Automated assessment system
* [ ] Adaptive algorithms
* [ ] Structured database
* [ ] Advanced reporting system
* [ ] Backend integration

---

# Project Structure

```id="v9x2lp"
/project
│── index.html
│── login.html
│── cadastro.html
│── aluno.html
│── professor.html
│
├── css/
│   ├── style.css
│   ├── aluno.css
│   ├── professor.css
│
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── aluno.js
│   ├── professor.js
```

---

# Future Vision

OSHETU is planned to evolve into a full educational system including:

* Automated topic-based assessments
* Intelligent adaptive learning system
* Real-time performance monitoring
* Institutional reporting tools
* Integration with educational authorities

---

# Expected Impact

* Improved academic performance tracking
* Better organization of teaching processes
* Data-driven educational decisions
* Contribution to education system digitalization

---

# Author

**João Mukoma Doná Pedro**
Student interested in Engineering, Physics, and building technology-driven solutions with social impact.

---

# Note

This project is under active development and is part of a broader vision to digitally transform education systems.

---

# Architecture Update

The project now uses a modular frontend architecture prepared for Firebase and future Gemini API integration.

```text
js/
  config/
    firebase-config.example.js
  dashboard/
    aluno-dashboard.js
    professor-dashboard.js
    gestao-dashboard.js
  data/
    school-data.js
  services/
    firebase.js
    auth-service.js
    database-service.js
    ai-service.js
    analytics-service.js
  ui/
    cards.js
    charts.js
    loading.js
    notifications.js
  utils/
    storage.js
    formatters.js
```

Legacy files in `js/` remain as compatibility wrappers so existing references do not break.

Firebase setup notes are available in `docs/FIREBASE_SETUP.md`.
