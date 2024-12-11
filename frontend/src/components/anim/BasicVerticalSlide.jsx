import { motion } from "framer-motion"

const BasicVerticalSlide = ({ children, key }) => {
    return (
        <motion.div
            key={key}
            initial= {{ opacity: 0, y: 20 }}
            animate= {{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            exit= {{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
        >
            {children}
        </motion.div>
    )
}

export default BasicVerticalSlide;