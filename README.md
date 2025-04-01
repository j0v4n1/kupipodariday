KupiPodariDay API

KupiPodariDay is a backend API built with NestJS, TypeORM, and PostgreSQL for a wishlist service. Users can create wishlists, contribute to others' gifts, and manage their profiles securely.

🚀 Features

User authentication (signup, login, JWT-based authorization)

Wishlist management (create, update, delete wishes)

Gift crowdfunding (users can contribute to gifts)

User profiles (view, edit, search by username/email)

Popular and latest wishes (sorted by copy count and creation date)

DTO validation & security (class-validator, guards, bcrypt for password hashing)

📜 API Endpoints

Authentication

POST /auth/signup – Register a new user

POST /auth/signin – Login and receive tokens

Users

GET /users/:id – Get user profile

PATCH /users/:id – Update user profile (only owner)

GET /users/search?query= – Search by username or email

Wishes

POST /wishes – Create a wish

GET /wishes/:id – Get wish details

PATCH /wishes/:id – Update wish (if no contributions exist)

DELETE /wishes/:id – Delete wish (if no contributions exist)

POST /wishes/:id/copy – Copy a wish to your profile

Offers (Contributions)

POST /offers – Contribute to a gift

GET /offers/:id – View contribution details

Wishlists

POST /wishlists – Create a wishlist

GET /wishlists/:id – Get wishlist details

PATCH /wishlists/:id – Update wishlist (only owner)

DELETE /wishlists/:id – Delete wishlist (only owner)

🛠 Technologies

Backend: NestJS, TypeORM, PostgreSQL

Authentication: Passport.js, JWT, bcrypt

Validation: class-validator, ValidationPipe

Security: Guards, DTO validation, hashed passwords

Developed by Иван Климовский
