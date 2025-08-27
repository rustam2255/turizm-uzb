import React from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: { id: number | string; image: string }[];
  title?: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, images, title }) => {
  if (!isOpen) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 bg-black/90 z-[10000] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 z-[10001] bg-white/80 hover:bg-white p-2 rounded-full"
        whileHover={{ scale: 1.1 }}
      >
        <X className="w-6 h-6 text-[rgba(25,110,150,255)]" />
      </motion.button>

      {title && (
        <h2 className="text-white text-center text-lg md:text-2xl font-semibold mt-6">{title}</h2>
      )}

      <div className="flex-1 overflow-y-auto p-4 relative z-[10000]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1200px] mx-auto">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <img
                src={image.image}
                alt={`${title || "Gallery"} ${index + 1}`}
                loading="lazy"
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

export default GalleryModal;
