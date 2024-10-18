import { motion } from "framer-motion"

const FadeTransition = ({ children, duration = 0.25 }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}        // Initial state of the component
            animate={{ opacity: 1}}         // State when the component is active
            exit={{ opacity: 0 }}           // State when the component is exiting
            transition={{ duration }}       // Duration of the animation
        >
            {children}
        </motion.div>
    )
}

export default FadeTransition;