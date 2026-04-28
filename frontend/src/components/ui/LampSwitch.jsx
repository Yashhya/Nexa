import React, { useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const LampSwitch = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isPulling, setIsPulling] = useState(false);
  const [pullCount, setPullCount] = useState(0);

  const handlePull = () => {
    setIsPulling(true);
    setPullCount(c => c + 1);
    toggleTheme();
    setTimeout(() => setIsPulling(false), 600);
  };

  return (
    <div className="lamp-switch-wrapper" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      {/* Rope + Lamp */}
      <div className="lamp-container" onClick={handlePull}>
        {/* Ceiling mount */}
        <div className="lamp-ceiling-mount" />

        {/* Rope */}
        <motion.div
          className="lamp-rope"
          animate={isPulling
            ? { scaleY: [1, 1.4, 0.9, 1.1, 1], rotate: [0, -8, 12, -6, 0] }
            : { scaleY: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ originY: 0 }}
        />

        {/* Lamp body */}
        <motion.div
          className={`lamp-body ${isDark ? 'lamp-dark' : 'lamp-light'}`}
          animate={isPulling
            ? { y: [0, 8, -3, 4, 0] }
            : { y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Lamp shade */}
          <div className="lamp-shade" />

          {/* Bulb glow */}
          <motion.div
            className="lamp-bulb"
            animate={{
              opacity: isDark ? 0.3 : 1,
              boxShadow: isDark
                ? '0 0 8px rgba(139, 92, 246, 0.5)'
                : '0 0 20px rgba(251, 191, 36, 0.9), 0 0 40px rgba(251, 191, 36, 0.5), 0 0 80px rgba(251, 191, 36, 0.2)'
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Pull knot at bottom of rope */}
          <div className="lamp-knot" />
        </motion.div>

        {/* Glow halo in light mode */}
        {!isDark && (
          <motion.div
            className="lamp-halo"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </div>

      {/* Label */}
      <span className="lamp-label">{isDark ? '🌙' : '☀️'}</span>
    </div>
  );
};

export default LampSwitch;
