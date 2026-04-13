import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";

function getCroppedImg(imageSrc, crop) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    };
  });
}

export default function ImageCropModal({ file, onClose, onCrop, aspect = 1 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const imageUrl = URL.createObjectURL(file);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    const blob = await getCroppedImg(imageUrl, croppedAreaPixels);
    onCrop(new File([blob], file.name, { type: "image/jpeg" }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-stone-50/80 rounded-[2rem] w-full max-w-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl dark:bg-zinc-900/90 border border-white dark:border-zinc-800"
      >
        <div className="mb-5 px-1">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Crop Profile Photo</h3>
          <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-widest opacity-70">Institute Workspace</p>
        </div>

        <div 
          className="relative w-full bg-zinc-100 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
          style={{ aspectRatio: aspect || 1 }}
        >
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            classes={{
              containerClassName: "rounded-2xl",
              mediaClassName: "rounded-2xl",
            }}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zoom</span>
             <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-sm font-bold shadow-lg hover:shadow-indigo-500/20 transition-all border border-transparent active:scale-95"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
