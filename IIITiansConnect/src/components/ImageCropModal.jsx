import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

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

export default function ImageCropModal({ file, onClose, onCrop }) {
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
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-4">
        <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex justify-between gap-3">
          <button
  type="button"   // ✅ ADD THIS
  onClick={onClose}
  className="flex-1 border rounded-lg py-2"
>
  Cancel
</button>

<button
  type="button"   // ✅ ADD THIS
  onClick={handleSave}
  className="flex-1 bg-indigo-600 text-white rounded-lg py-2"
>
  Crop & Save
</button>

        </div>
      </div>
    </div>
  );
}
