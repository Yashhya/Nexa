import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <Helmet>
      <title>404 – Page Not Found | NEXA</title>
    </Helmet>
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-[120px] sm:text-[180px] font-black leading-none gradient-text text-glow select-none">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Let ARIA help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/home">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2">
              <Home size={18} /> Go Home
            </motion.button>
          </Link>
          <button onClick={() => window.history.back()}
            className="btn-outline flex items-center gap-2">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);

export default NotFoundPage;
