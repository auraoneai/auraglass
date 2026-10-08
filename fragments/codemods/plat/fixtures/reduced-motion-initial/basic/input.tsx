import { motion } from 'framer-motion';
export const T = ({c}: {c: boolean}) => <motion.div animate={c ? { opacity: 0 } : {}}/>;
