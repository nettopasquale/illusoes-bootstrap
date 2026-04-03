import { FaHeart } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

export default function BotaoLike({curtido, curtidasTotais, onClick}) {
  return (
    <Button
      variant="light"
      onClick={onClick}
      className="d-flex align-items-center gap-2"
    >
      <motion.div
        animate={{ scale: curtido ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <FaHeart color={curtido ? "red" : "gray"} />
      </motion.div>

      {curtidasTotais}
    </Button>
  );
}
