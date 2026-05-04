'use client'

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Image as ImageIcon, X, Check, Scissors } from 'lucide-react';

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = 400;
  canvas.height = 400;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    400,
    400
  );

  return canvas.toDataURL('image/jpeg', 0.9);
}

export default function AvatarCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result as string));
      reader.readAsDataURL(file);
    }
  };

  const showCroppedImage = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const result = await getCroppedImg(imageSrc, croppedAreaPixels);
        setCroppedImage(result);
        setImageSrc(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {croppedImage && <input type="hidden" name="photoBase64" value={croppedImage} />}

      <label className="flex items-center gap-2 text-xs font-bold text-acvb-gold uppercase tracking-widest mb-3">
        <ImageIcon className="w-4 h-4" /> Nova Foto de Perfil
      </label>

      {croppedImage ? (
        <div className="flex flex-col gap-4 items-start">
          <img src={croppedImage} alt="Preview do Recorte" className="w-24 h-24 rounded-full object-cover border-2 border-acvb-gold shadow-[0_0_20px_-5px_rgba(185,141,59,0.5)]" />
          <button type="button" onClick={() => setCroppedImage(null)} className="text-[10px] bg-red-500/10 text-red-500 py-1.5 px-3 rounded-md font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">
            Cortar outra imagem
          </button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={onFileChange}
            className="w-full p-3 rounded-xl border border-white/10 bg-black/40 text-gray-400 focus:border-acvb-gold focus:outline-none transition-colors file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-acvb-gold file:text-black hover:file:bg-white cursor-pointer"
          />
          <p className="text-[10px] text-gray-500 mt-2">Selecione uma imagem. Você poderá enquadrá-la antes de salvar.</p>
        </div>
      )}

      {imageSrc && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg p-6 relative flex flex-col h-137.5 border-acvb-gold/30">
            <h3 className="text-white font-black text-xl mb-4 uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <Scissors className="w-5 h-5 text-acvb-gold"/> Ajustar Enquadramento
            </h3>
            
            <div className="relative w-full grow bg-black rounded-2xl overflow-hidden mb-6 border border-white/10">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 px-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-acvb-gold"
                />
              </div>
              
              <div className="flex gap-4">
                <button type="button" onClick={() => setImageSrc(null)} className="flex-1 py-3.5 bg-white/5 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                  <X className="w-4 h-4"/> Cancelar
                </button>
                <button type="button" onClick={showCroppedImage} className="flex-1 py-3.5 bg-acvb-gold text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(185,141,59,0.5)]">
                  <Check className="w-4 h-4"/> Confirmar Corte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}