# Stream Project

Stream is a platform designed to empower startups by connecting them with investors, simplifying the process of securing funding, and enabling growth through smart funding solutions. The platform provides startups with tools to showcase their projects and track performance while offering investors a streamlined interface to discover high-potential startups.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Installation and Setup](#installation-and-setup)
4. [Project Structure](#project-structure)
5. [Navigation](#navigation)
6. [Features](#features)
7. [Screenshots](#screenshots)
8. [Contributing](#contributing)
9. [License](#license)

## Project Overview

Stream addresses a pressing need in the startup ecosystem by providing a platform that facilitates the connection between investors and startups. It offers:

- A secure and intuitive environment for funding transactions.
- Tools for startups to track their performance and gain insights.
- Opportunities for investors to discover innovative projects with high growth potential.

## Tech Stack

- **Frontend:** Angular, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, PostgreSQL
- **Tools and Libraries:** ts-node-dev, Prisma, Angular CLI

## Installation and Setup

### Prerequisites

- Node.js (v14 or above)
- npm (v6 or above)
- Angular CLI (v12 or above)
- PostgreSQL (v12 or above)

### Stream Project Structure
stream/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Contains controller files for different routes
│   │   ├── middlewares/    # Middlewares for request validation and authentication
│   │   ├── models/         # Database models and schemas
│   │   ├── routes/         # API routes for the backend
│   │   └── services/       # Business logic and services
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # TypeScript configuration for the backend
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Reusable components for the frontend
│   │   │   ├── pages/      # Different pages for the application
│   │   │   └── services/   # Services for API calls and business logic
│   │   └── assets/         # Static assets like images, fonts, etc.
│   ├── angular.json        # Angular project configuration
│   ├── package.json        # Frontend dependencies
│   └── tsconfig.json       # TypeScript configuration for the frontend
└── README.md               # Project documentation

## The Project Navigation
Admin Dashboard: http://localhost:4200/admin/dashboard
Manage users, investors, organizations, startups, and projects.

User Dashboard: http://localhost:4200/dashboard
View and manage individual user profiles and activities.

Public Pages: Accessible via the home page for general information about the platform.

## Features

Project Showcase: Easily present projects to a global network of potential backers.
Performance Tracking: Track the progress and performance of funded projects.

For Investors
Discover Startups: Browse and invest in innovative startups.
Secure Investments: Make secure investments using state-of-the-art security protocols.

General
Customization: Tailor the platform to suit specific needs.
Security: Latest security measures to protect user data.
Support: 24/7 customer support for any inquiries.
Performance: Blazing-fast performance with an intuitive user interface.

## Screenshots

## Admin Dashboard
![Admin Dashboard](./admin/stream/frontend/screenshot/stream1.png)

### User Dashboard
![User Dashboard](./admin/stream/frontend/screenshots/stream2.png)

## Contributing
We welcome contributions to the Stream Project. To contribute, please follow these steps:

Fork the repository.
Create a new feature branch (feature/new-feature).
Commit your changes.
Push your branch and create a pull request.

## License 
MIT License

Copyright (c) [2024] [Adedayo A.Onasanya]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.