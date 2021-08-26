import {useEffect} from 'react';
import {motion, useAnimation} from "framer-motion";

const VocabCounter = ({count}: {count: number}) => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            scale: 1,
            transition: {
                type: "spring",
                velocity: 50,
                stiffness: 700,
                damping: 80
            }
        });
    }, [count]);

    return (
        <motion.div
            animate={controls}
            style={{display: 'inline-flex'}}
        >
        {count}
        </motion.div>
    )
};

export default VocabCounter;