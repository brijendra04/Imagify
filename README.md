# 🌟 Imagify

**Imagify** is a modern web application that allows users to create, edit, and enhance images using AI-powered tools.  
With a sleek frontend and a robust backend, Imagify makes image generation and manipulation simple and accessible.

---

## 📌 Overview

Imagify provides a user-friendly platform for:
- Generating AI-based images from text prompts.
- Editing and enhancing uploaded images.
- Storing and managing generated images securely.

It’s built with a **MERN stack** (MongoDB, Express, React, Node.js) and integrates with external APIs for advanced image processing.

---

## 🚀 Live Demo

🔗 **[Visit Imagify](https://imagify-green-psi.vercel.app)**

---

## 🛠 Tech Stack

**Frontend:** React.js, TailwindCSS, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Other Tools & APIs:** Cloudinary (for image storage), AI Image Generation API  

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)
- API keys for:
  - Cloudinary
  - Image generation service

---

### Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/brijendra04/Imagify.git
cd Imagify
2️⃣ Setup backend

cd server
npm install


Create a .env file in the server directory with:

MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key


Start the server:

npm start


3️⃣ Setup frontend

cd ../client
npm install


Create a .env file in the client directory with:

REACT_APP_BACKEND_URL=http://localhost:5000


Start the client:

npm start

✨ Features

🖼 AI Image Generation — Generate images from text prompts.

🎨 Image Editing — Apply filters, resize, and enhance images.

☁ Cloud Storage — Store and manage images via Cloudinary.

🔒 Secure Access — User authentication and authorization.

📱 Responsive Design — Works seamlessly across devices.

📜 API Endpoints

Base URL: http://localhost:5000

Method	Endpoint	Description
POST	/api/generate	Generate image from prompt
POST	/api/upload	Upload and store an image
GET	/api/images	Get all images for a user
🤝 Contributing

Contributions are welcome!

Fork this repository

Create your feature branch (git checkout -b feature-name)

Commit your changes (git commit -m 'Add new feature')

Push to the branch (git push origin feature-name)

Open a Pull Request

📄 License

This project is licensed under the MIT License.

📬 Contact

👤 Brijendra Pratap
GitHub: @brijendra04
LinkedIn: Brijendra Pratap
