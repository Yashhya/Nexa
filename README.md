# NEXA AI Commerce

A next-generation, industry-level production-ready AI-powered multi-vendor e-commerce platform. Features separate Admin, User, and Seller panels, a live AI shopping assistant with voice capabilities, Razorpay integration, and a premium futuristic UI.

## Features Included

- **Multi-Role Authentication**: Dedicated User, Seller, and Admin panels with protected routing.
- **AI Chatbot Assistant**: ARIA (Advanced Retail Intelligent Assistant) powered by Gemini API, capable of reading responses aloud (Voice/Text-to-Speech), executing real actions (search, add to cart, navigation), and providing smart recommendations.
- **Dynamic Theming**: "Hanging Lamp" pull-to-switch Light/Dark mode.
- **Real-Time Integration**: Socket.IO support for live notifications, order tracking, and dynamic updates.
- **Payments**: Razorpay test-mode integration for seamless checkout.
- **Seed Script**: Ready-to-use script populating the database with 70+ categorized real products, coupons, sellers, and an admin user.
- **Premium UI**: Deep-space theme with Tailwind CSS, Framer Motion animations, and 3D React Three Fiber avatar.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit, React Router, Framer Motion, React Three Fiber.
- **Backend**: Node.js, Express.js, Socket.IO.
- **Database**: MongoDB Atlas + Mongoose.
- **AI**: Google Gemini API.

## Installation & Setup

1. **Clone or Download the Project.**

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**:
   Update `backend/.env` with your actual MongoDB connection string, Gemini API key, and Razorpay test credentials. Example format provided in the file.
   Update `frontend/.env` with your `VITE_API_URL` and `VITE_RAZORPAY_KEY_ID`.

5. **Seed the Database**:
   Before running the seed script, ensure your current IP address is whitelisted in your MongoDB Atlas Network Access settings.
   ```bash
   cd backend
   node seed.js
   ```
   *Default Admin login:* `admin@nexa.com` | `Admin@123`

6. **Run the Application**:
   Start both backend and frontend servers:
   ```bash
   # Terminal 1 (Backend)
   cd backend
   npm start

   # Terminal 2 (Frontend)
   cd frontend
   npm run dev
   ```

7. **Access the platform**:
   Open `http://localhost:5174` (or your configured port) in your browser.

## Important Note

- This platform runs locally or can be deployed to production (e.g., Render/Vercel).
- The AI voice feature uses the browser's native Web Speech API.
- All product images are high-quality real images fetched from Unsplash.
