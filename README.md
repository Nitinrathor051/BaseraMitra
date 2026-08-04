BaseraMitra

BaseraMitra is a full-stack MERN real estate platform that connects property owners with customers looking to rent or buy properties. It provides a secure, responsive, and user-friendly experience with role-based authentication and dedicated dashboards for customers and property owners.

Features

* JWT-based Authentication and Authorization
* Role-Based Access (Customer and Owner)
* Add, Update and Delete Property Listings
* Search and Filter Properties
* Save Favorite Properties
* Send Property Inquiries
* Fully Responsive User Interface
* Cloudinary Image Upload
* REST API with Express.js
* Protected Routes

Tech Stack

Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Toastify
* Framer Motion
* Lucide React

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Zod
* Multer
* Cloudinary

Project Structure

BaseraMitra/

* client/

  * src/
  * public/
* server/

  * controllers/
  * models/
  * routes/
  * middleware/
  * validators/
  * utils/

Installation

Clone the repository

git clone <repository-url>

Install dependencies

Frontend

cd client
npm install

Backend

cd server
npm install

Run the project

Backend

npm run dev

Frontend

npm run dev

Environment Variables

Create a .env file inside the server folder.

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

User Roles

Customer

* Register and Login
* Browse Properties
* Save Favorite Properties
* Send Property Inquiries
* Manage Profile

Owner

* Register and Login
* Become Property Owner
* Add Property
* Update Property
* Delete Property
* View My Properties
* Manage Inquiries

Future Enhancements

* Google Maps Integration
* Real-time Chat
* Payment Gateway
* Email Notifications
* Advanced Search Filters
* Property Reviews and Ratings
* Admin Dashboard

Author

Nitin Rathor

GitHub: https://github.com/Nitinrathor051

LinkedIn: https://www.linkedin.com/in/nitin-rathor-345719248

License

This project is developed for learning and portfolio purposes.
