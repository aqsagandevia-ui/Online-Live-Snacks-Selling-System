# 🍿 Crunchy Bite — Online Live Snacks Selling System

> **Modern, Responsive, Real-Time Online Food Ordering Platform**  
> *Developed for MCA Academic Project, Viva Demonstration, and Portfolio Showcase.*

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
   - [Customer Features](#customer-features)
   - [Admin Portal Features](#admin-portal-features)
3. [Technology Stack](#-technology-stack)
4. [System Architecture & Database Schema](#-system-architecture--database-schema)
5. [Project Structure](#-project-structure)
6. [Installation & Setup Guide](#-installation--setup-guide)
7. [Default Demo Credentials](#-default-demo-credentials)
8. [REST API Documentation](#-rest-api-documentation)
9. [MCA Viva Presentation Guide & FAQ](#-mca-viva-presentation-guide--faq)

---

## 🌟 Project Overview

**Crunchy Bite** is a full-stack, responsive online food-ordering web application specialized in authentic Indian snacks, namkeens, freshly fried potato chips, spiced chaklis, and roasted corn snacks. 

It solves the problem of traditional snack purchasing by providing real-time snack browsing, smart keyword search, category filtering, multi-step checkout with coupons, live order status tracking timeline, interactive admin inventory management with low-stock alerts, and sales analytics.

---

## ✨ Key Features

### 👤 Customer Features
- **Modern Responsive UI**: Fully responsive across Mobile (360px–480px), Tablet (768px–1024px), and Desktop (1280px–1920px).
- **Dark / Light Mode**: Theme toggle switch with local storage persistence.
- **Smart Product Search**: Instant keyword search matching snack names, descriptions, categories, and ingredients with autocomplete suggestions.
- **Advanced Filtering & Sorting**: Filter by category, price slider (₹10 - ₹250+), star ratings (4.5★+, 4★+), and stock availability; sort by popularity, price, rating, or newest.
- **Product Details Modal**: High-res photos, ingredients list, preparation time, stock limiters, customer rating breakdown, and live review submission.
- **Shopping Cart & Coupons**: Dynamic quantity stepper `[-] Qty [+]`, subtotal calculation, free delivery thresholds, and working promo coupons (`SAVE10`, `CRUNCHY20`, `SNACK50`).
- **4-Step Checkout Wizard**:
  1. *Delivery Address* (Choose saved address or add new with full validation)
  2. *Order Review* (Itemized summary & savings calculation)
  3. *Payment Method* (Cash on Delivery or Instant Online UPI/Card simulation)
  4. *Order Confirmation* (Generated Order ID e.g. `CB-10024` with instant tracking button)
- **Live Order Status Tracking**: Visual 6-stage timeline (`Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Out for Delivery` ➔ `Delivered`) with polling for live status changes.
- **Order History**: Filter orders by status (`All`, `In Progress`, `Delivered`, `Cancelled`) with quick cancellation for pending orders.
- **User Profile & Address Book**: Manage personal details, phone, multiple delivery addresses, and change password.
- **Saved Wishlist**: Add/remove favorites with 1-click move to cart.
- **Non-blocking Toast Alerts**: Beautiful animated feedback for all cart, wishlist, and auth actions.
- **Mobile Bottom Navigation**: Bottom app bar (`Home`, `Menu`, `Cart`, `Orders`, `Profile`) for native app-like mobile experience.

### 👑 Admin Portal Features
- **KPI Summary Cards**: Total Revenue, Total Orders, Active Snacks, Total Customers, Pending Orders, and Low Stock Alerts.
- **Sales Analytics & Top Products**: Ranked list of top 5 best-selling snacks and category distribution.
- **Product & Inventory Management**: Add, edit, delete snack products; set stock levels and low-stock thresholds; quick +/- stock adjustment buttons in table.
- **Order Workflow Management**: View customer details and ordered items; update order status (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Out for Delivery` ➔ `Delivered` / `Cancelled`) which updates the customer's live tracking timeline.
- **Category Management**: Create and manage snack categories with dynamic product counts.
- **Coupon System**: Create percentage or flat cash discount coupons, minimum order limits, max discount caps, and active/inactive toggles.
- **Customer Directory**: View registered users, contact numbers, and saved addresses.
- **1-Click Database Reset & Seeder**: Instant button to re-populate 34 authentic snack products with real photos, descriptions, and categories.

---

## 🛠 Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18 (SPA), React Router v6, Context API (Auth, Cart, Theme, Toast), CSS3 Variables, Bootstrap 5 |
| **Backend** | Node.js, Express.js RESTful API, CORS, Body-Parser, Multer |
| **Authentication** | JWT (JSON Web Tokens), BCrypt.js password hashing |
| **Database** | MongoDB with Mongoose ODM |
| **Assets** | 59 Authentic Indian & Continental snack photos (`/photo/`) |

---

## 🚀 Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`

### Step 1: Start the Backend Server
```bash
# Navigate to the server folder
cd "home/server"

# Install backend dependencies
npm install

# Start Express server on Port 5000 (auto-seeds database on first launch)
node app.js
```
*Server will start at `http://localhost:5000` and automatically connect to MongoDB `mongodb://localhost:27017/productsdb`.*

### Step 2: Start the React Frontend
```bash
# Open a new terminal and navigate to the home folder
cd "home"

# Install frontend dependencies (if not already done)
npm install

# Start React development server
npm start
```
*Frontend will open automatically at `http://localhost:3000`.*

---

## 🔑 Default Demo Credentials

For instant evaluation and viva demonstration, pre-configured accounts are provided with **1-Click Demo Login buttons** on the Sign-In page and top announcement bar:

| Role | Email / Identifier | Password | Access / Capabilities |
|---|---|---|---|
| **Admin** | `admin@crunchybite.com` (or `aqsa`) | `admin123` (or `aqsa1234`) | Full Admin Dashboard, Sales Analytics, Inventory Editor, Order Status Workflow, Coupons |
| **Customer** | `customer@crunchybite.com` | `user123` | Snack Browsing, Cart, Checkout, Order Tracking, Saved Addresses, Wishlist |

### Active Promo Coupons:
- `SAVE10`: **10% OFF** on orders above ₹199
- `CRUNCHY20`: **20% OFF** on orders above ₹499
- `SNACK50`: **Flat ₹50 OFF** on orders above ₹299
- `WELCOME15`: **15% Welcome OFF** on orders above ₹150

---

**Developed By Aqsa ❤️**
