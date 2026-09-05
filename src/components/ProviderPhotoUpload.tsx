import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
};

export function ProviderPhotoUpload({
  value,
  onChange,
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"],
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(
    value instanceof File ? URL.createObjectURL(value) : value || null
  );

  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 🔥 Crop states
  const [showCrop, setShowCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const revokePreview = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  };

  async function getCroppedImg(imageSrc: string, crop: Area): Promise<File> {
    const image = new Image();

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx?.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob!], "avatar.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9
      );
    });
  }

  const handleFile = (file: File | null) => {
    setError(null);

    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      setError(
        `Formato não suportado. Use: ${acceptedTypes
          .map((t) => t.split("/")[1].toUpperCase())
          .join(", ")}`
      );
      return;
    }

    if (file.size > maxSizeBytes) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImageSrc(previewUrl);
    setShowCrop(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleRemove = () => {
    revokePreview();
    setPreview(null);
    onChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  const getInitials = () => "👤";

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-6 rounded-lg border-2 border-dashed transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          error && "border-red-300 bg-red-50/50",
          preview && "border-solid border-primary/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl overflow-hidden">
              <AvatarImage src={preview} className="object-cover w-full h-full" />
              <AvatarFallback className="text-4xl bg-muted">{getInitials()}</AvatarFallback>
            </Avatar>

            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-3 w-3 mr-1" />
              Trocar
            </Button>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary/60" />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium">Arraste uma foto ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP até {maxSizeMB}MB</p>
            </div>

            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Camera className="h-4 w-4 mr-2" />
              Selecionar foto
            </Button>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload de foto de perfil"
        />
      </div>

      {/* Crop modal */}
      {showCrop && imageSrc && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-[90%] max-w-md space-y-4">
            <div className="relative w-full h-64">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />

            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  if (!croppedAreaPixels) return;

                  const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

                  const previewUrl = URL.createObjectURL(croppedFile);

                  revokePreview();

                  setPreview(previewUrl);

                  onChange(croppedFile);
                  setShowCrop(false);
                }}
                className="w-1/2 h-10"
              >
                Confirmar
              </Button>

              <Button variant="outline" onClick={() => setShowCrop(false)} className="w-1/2 h-10">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {preview && !error && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle2 className="h-4 w-4" />
          Foto pronta para envio!
        </div>
      )}
    </div>
  );
}
