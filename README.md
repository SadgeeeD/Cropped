# Rooftop Garden Monitoring System 🌿

## 📚 Final Year Project — Temasek Polytechnic, School of Engineering

This project is a smart monitoring system for rooftop gardens, combining real-time data visualization, manual data entry, and machine learning-based image classification to assist in sustainable urban agriculture.

---

## 📌 Project Overview

The goal of this project is to build an interactive web application that:

- Displays real-time sensor data (temperature, humidity, soil moisture, etc.) from rooftop garden installations.
- Allows users to **manually log additional parameters** such as nitrate/nitrite levels that current sensors cannot detect.
- Integrates a machine learning model to detect **plant health conditions** through image uploads.
- Provides intuitive UI/UX for urban farmers or gardening enthusiasts to monitor, manage, and respond to plant health issues.

---

## 🛠 Tech Stack

| Layer        | Technology Used                     |
|--------------|-------------------------------------|
| Frontend     | React.js, Tailwind CSS              |
| Backend/API  | Node.js + Express                   |
| Database     | Microsoft SQL Server                |
| ML Model     | CNN (Convolutional Neural Network) trained with custom dataset |
| Tools        | Visual Studio Code, Git, Postman    |

---

## ✅ Features

### 🌡️ Sensor Dashboard
- Displays real-time sensor values via charts and tables.
- Clean, mobile-responsive design for accessible monitoring.

### 📝 Manual Data Entry
- Users can input additional garden metrics (e.g., nitrate levels).
- Data is validated and sent to the SQL database via Express API.

### 🌱 Image Classification
- Upload plant leaf images for health classification (healthy vs diseased).
- Uses CNN model trained on 11,000+ labeled images.

### 🔒 Authentication *(Optional if implemented)*
- Secure login for different user roles (admin, guest).

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Microsoft SQL Server
- Visual Studio Code
- Git

### 👥 Team Members
|Name     |	Role                              |
|---------|-----------------------------------|
| Darren  |Web Developer & ML Engineer        |
| Ethan   |App Developer & Database Dev       |
| Damien  |	Hardware Engineer                 |


### 📄 License
This project is for academic use only as part of the Final Year Project module at Temasek Polytechnic.


