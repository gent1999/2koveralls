import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 16 / 9 }) {
  const [crop, setCrop] = useState({
    unit: '%',
    x: 5,
    y: 5,
    width: 90,
    height: 90 / aspectRatio,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;

    // Center the crop
    const cropWidth = 90;
    const cropHeight = (cropWidth / aspectRatio) * (width / height);

    setCrop({
      unit: '%',
      width: cropWidth,
      height: Math.min(cropHeight, 90),
      x: (100 - cropWidth) / 2,
      y: (100 - Math.min(cropHeight, 90)) / 2,
      aspect: aspectRatio,
    });
  }, [aspectRatio]);

  const getCroppedImage = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        const croppedPreview = canvas.toDataURL('image/jpeg');
        onCropComplete(croppedFile, croppedPreview);
      }
    }, 'image/jpeg', 0.95);
  }, [completedCrop, onCropComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden border border-ink-line bg-ink-soft">
        <div className="border-b border-ink-line p-4">
          <h3 className="text-lg font-semibold text-bone">Crop Image</h3>
          <p className="text-sm text-bone-dim">Adjust the crop area for the best display on the home page</p>
        </div>

        <div className="flex max-h-[60vh] justify-center overflow-auto bg-ink p-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              crossOrigin="anonymous"
              onLoad={onImageLoad}
              className="max-h-[55vh] max-w-full"
            />
          </ReactCrop>
        </div>

        <div className="flex items-center justify-between border-t border-ink-line p-4">
          <div className="text-sm text-bone-dim">
            Recommended: 16:9 aspect ratio for best display
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="border border-ink-line px-4 py-2 text-sm font-medium text-bone-dim transition-colors hover:border-bone hover:text-bone"
            >
              Cancel
            </button>
            <button
              onClick={getCroppedImage}
              className="border border-brand bg-brand px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-dim"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
