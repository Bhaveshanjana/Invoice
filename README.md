# InvoiceGen

A full-stack invoice generation application built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS. The application allows users to create, preview, and download professional PDF invoices.

## Features

- Create Invoices: Fill out sender, receiver, items, bank details, and terms.
- Dynamic Items List: Add or remove invoice items with automatic amount calculations.
- Live Preview: View a responsive preview of the invoice.
- PDF Download: Generate and download a high-quality PDF version of the invoice.
- Dark/Light Mode: Beautiful UI with smooth theme switching via shadcn/ui.
- Mobile Responsive: Fully functional across desktop, tablet, and mobile devices.

## Tech Stack

- Frontend: React (Vite), React Router DOM, Tailwind CSS, Framer Motion, shadcn/ui, React Hook Form, @react-pdf/renderer
- Backend: Node.js, Express, MongoDB, Mongoose, Zod

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Create a `.env` file in the server directory with your MongoDB connection string:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Create a `.env` file in the client directory with the backend API URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Usage

1. Open the frontend application in your browser (typically http://localhost:5173).
2. Fill out the invoice form details, including Billed By, Billed To, and Item entries.
3. Use the invoice preview button to verify the layout.
4. Submit the invoice to save it to the database.
5. On the View Invoice page, click the download button to generate and save your PDF.
