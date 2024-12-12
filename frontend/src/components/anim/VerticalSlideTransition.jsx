import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const VerticalSlideTransition = ({
  children,
  enableAnimation = true, // Flag to enable or disable animation
  initialPos = '100dvh',    // Starting position off-screen
  finalPos = 0,            // Final position on screen
  stiffness = 100,         // Spring stiffness
  damping = 20             // Spring damping
}) => {
  const location = useLocation();

  if (location.pathname !== "/" || !enableAnimation) {
    // Render static content or nothing if not on the home page or animation is disabled
    return <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: -1 }}>{children}</div>;
  }

  const animationProps = {
    initial: { y: initialPos },
    animate: { y: finalPos },
    transition: { type: 'spring', stiffness, damping }
  };

  return (
    <motion.div
        className="vertical-slide-motion-div"
      {...animationProps}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1
      }}
    >
      {children}
    </motion.div>
  );
};

export default VerticalSlideTransition;
