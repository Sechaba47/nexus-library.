# Nexus Library

A web-based community library management system built with **React**. The system allows librarians to manage books, users, stock availability, and library transactions through a simple web interface.

## Features

* Librarian login
* Dashboard with library statistics
* Add, update, and delete books
* Manage library users/members
* Add, update, and delete users
* Track book availability and stock quantities
* Add new book stock
* Deduct stock when books are borrowed
* Search and manage library records
* Transaction tracking
* Form validation
* Data persistence using browser Local Storage
* React Router navigation
* Reusable React components
* React Hooks such as `useState` and `useEffect`

## Technologies Used

* **React**
* **JavaScript**
* **HTML5**
* **CSS3**
* **React Router**
* **Local Storage**
* **Vite**
* **Git & GitHub**

## Project Structure

```text
nexus-library/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── package.json
├── vite.config.js
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the project folder

```bash
cd nexus-library
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will then be available through the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## Running the Project

After installing the dependencies, open a new Command Prompt/Terminal if necessary and navigate back to the project directory:

```bash
cd "C:\Users\Sechaba Thoabala\Documents\Books\Web development\nexus-library"
```

Then run:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Data Storage

Nexus Library uses **Local Storage** to save application data in the browser.

This allows information such as:

* Books
* Users
* Stock quantities
* Transactions
* Login/session information

to remain available after refreshing the page.

> Note: Because the application uses Local Storage instead of a backend database, the data is stored locally in the browser and is not shared between different devices.

## Default Library Users

The system includes sample library members for testing:

* Mohapi Thoabala
* Sello Thoabala
* Tumelo Mabuti
* Tumelo Khutlang
* Ratile Thulo
* Thabo Pali

The librarian is:

**Sechaba Thoabala**

## Main Functionality

### Book Management

Librarians can:

* Add new books
* Update existing books
* Delete books
* View book information
* Track available quantities

Each book can contain information such as:

* Title
* Author
* Genre
* ISBN
* Quantity

### Stock Management

The system allows librarians to manage book availability by:

* Adding stock
* Deducting stock
* Tracking current quantities
* Recording stock-related transactions

### User Management

Librarians can manage library members by:

* Adding users
* Updating user information
* Removing users
* Viewing membership information
* Assigning user roles

## React Concepts Demonstrated

This project demonstrates several core React concepts required for the assignment:

### `useState`

Used to manage application state such as books, users, forms, and stock quantities.

### `useEffect`

Used for operations such as loading and synchronizing data with Local Storage.

### Component Composition

The application is divided into reusable components instead of putting the entire application into one component.

### Controlled Forms

Form inputs are controlled through React state and include validation before submission.

### React Router

React Router is used to navigate between different sections/pages of the application.

## Development

To run the application during development:

```bash
npm run dev
```

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Assignment

This project was developed as part of a **Semester 2 React Web Application assignment** for a community library management system.

The project demonstrates practical use of React, component-based development, state management, form handling, routing, and browser-based data persistence.

## Author

**Sechaba Thoabala**

Nexus Library
React Community Library Management System
