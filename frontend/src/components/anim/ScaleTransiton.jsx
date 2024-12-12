import { motion } from "framer-motion"

const ScaleTransition = (
    { children,
        key
    }) => {
    return (
        <motion.div
            className="scale-transition-motion-div"
            key={key}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
        >
            {children}
        </motion.div>
    )
}

export default ScaleTransition;