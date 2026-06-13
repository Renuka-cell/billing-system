# Optical Shop Billing & Invoice Management System

## Project Overview

The Optical Shop Billing & Invoice Management System is a full-stack web application developed to automate and digitize the daily operations of an optical store. The system enables efficient management of customers, invoices, prescriptions, payments, staff, and shop information through a secure and user-friendly interface.

The application is built using Django REST Framework for the backend and React.js for the frontend. It provides secure authentication, role-based access control, invoice generation, PDF downloads, customer history tracking, staff management, payment monitoring, and shop settings management.

---

## Features

### Authentication & Authorization

- JWT Authentication
- Access Token and Refresh Token Support
- Automatic Token Refresh
- Protected Routes
- Secure Session Management
- Role-Based Access Control

### User Roles

#### Admin

- Dashboard Access
- Create Invoice
- Search Customer
- Customer History
- Invoice Management
- All Invoices
- Staff Management
- Shop Settings
- Payment Updates
- Invoice Editing
- Invoice Deletion

#### Staff

- Create Invoice
- Search Customer
- Customer History

---

### Customer Management

- Customer Search
- Customer Billing History
- Prescription History Tracking
- Customer Information Storage

### Invoice Management

- Create Invoice
- Edit Invoice
- Delete Invoice
- Search Invoices
- Invoice Pagination
- Download PDF Invoice

### Prescription Management

- Right Eye (RE) Prescription
- Left Eye (LE) Prescription
- SPH
- CYL
- AXIS
- ADD
- Lens Type Management
- Prescription Popup View

### Payment Management

- Payment Tracking
- Due Amount Calculation
- Partial Payment Support
- Payment Status Updates
- Payment Mode Management

### Staff Management

- Create Staff Accounts
- Edit Staff Information
- Delete Staff Accounts
- Reset Password
- Role Assignment

### Shop Settings

- Shop Name Management
- Address Management
- Phone Number Management
- Email Management
- GST Number Management
- Dynamic Shop Information in Invoice PDFs

### PDF Invoice Generation

- Professional Invoice Layout
- Customer Details
- Prescription Details
- Payment Information
- Dynamic Shop Information
- Downloadable PDF Format

---

## Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast
- Lucide React

### 1. Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- SQLite3

### PDF Generation

- ReportLab

---
## Installation Guide

### Clone Repository
```bash
git clone <repository-url>
cd BILLING_SYSTEM
```
---
## Backend Setup

### Create Virtual Environment
```bash
python -m venv venv
```
### Activate Virtual Environment
#### Windows
```bash
venv\Scripts\Activate
```

#### Linux/Mac
```bash
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Run Database Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

#### Start Backend Server
```bash
python manage.py runserver
```

#### Backend Server URL
```bash
http://127.0.0.1:8000
```
---
## 
