import { motion } from "framer-motion";

const HorizontalSlideTransition = ({
  children,
  initialPos = -100,
  FinalPos = 0,
  ExitPos = 100,
  duration = 0.25,
  enableAnimation = true // Flag to enable or disable animation
}) => {
  const animationProps = enableAnimation
    ? {
        initial: { x: initialPos },
        animate: { x: FinalPos },
        exit: { x: ExitPos },
        transition: { duration }
      }
    : {}; // Empty object if animation is disabled

  return (
    <motion.div className="horizontal-slide-motion-div" {...animationProps}>
      {children}
    </motion.div>
  );
};

export default HorizontalSlideTransition;
