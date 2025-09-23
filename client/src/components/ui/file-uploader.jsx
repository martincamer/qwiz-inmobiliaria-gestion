import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const FileUploader = ({
  onFileSelect,
  currentFiles = [],
  acceptedTypes = "all",
  multiple = true,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const getAcceptedTypes = () => {
    switch (acceptedTypes) {
      case "image":
        return "image/*";
      case "pdf":
        return ".pdf";
      case "document":
        return ".pdf,.doc,.docx";
      case "all":
      default:
        return "image/*,.pdf,.doc,.docx";
    }
  };

  const validateFile = (file) => {
    // Validar tamaño
    if (file.size > maxSize) {
      toast.error(
        `El archivo ${file.name} es muy grande. Máximo ${
          maxSize / 1024 / 1024
        }MB`
      );
      return false;
    }

    // Validar tipo
    const allowedTypes = getAcceptedTypes().split(",");
    const isValidType = allowedTypes.some((type) => {
      if (type === "image/*") return file.type.startsWith("image/");
      if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
      return file.type === type;
    });

    if (!isValidType) {
      toast.error(`Tipo de archivo no permitido: ${file.name}`);
      return false;
    }

    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
    // Reset input
    e.target.value = "";
  };

  const handleFiles = async (files) => {
    // Validar número máximo de archivos
    if (currentFiles.length + files.length > maxFiles) {
      toast.error(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    // Filtrar archivos válidos
    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = validFiles.map(async (file, index) => {
        const fileId = `${Date.now()}-${index}`;

        // Inicializar progreso
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { progress: 0, status: "uploading" },
        }));

        try {
          const formData = new FormData();
          formData.append("file", file);

          const fileType = file.type.startsWith("image/") ? "image" : "raw";
          const uploadPreset = fileType === "image" ? "imagenes" : "documentos";
          formData.append("upload_preset", uploadPreset);

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/de4aqqalo/${fileType}/upload`,
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress((prev) => ({
                  ...prev,
                  [fileId]: { progress, status: "uploading" },
                }));
              },
            }
          );

          // Marcar como completado
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: { progress: 100, status: "completed" },
          }));

          const fileData = {
            id: fileId,
            url: response.data.secure_url,
            publicId: response.data.public_id,
            name: file.name,
            type: fileType,
            size: file.size,
            preview: fileType === "image" ? response.data.secure_url : null,
            uploadedAt: new Date().toISOString(),
          };

          return fileData;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: { progress: 0, status: "error" },
          }));
          toast.error(`Error al subir ${file.name}`);
          return null;
        }
      });

      const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean);

      if (uploadedFiles.length > 0) {
        onFileSelect([...currentFiles, ...uploadedFiles]);
        toast.success(
          `${uploadedFiles.length} archivo(s) subido(s) exitosamente`
        );
      }

      // Limpiar progreso después de un tiempo
      setTimeout(() => {
        setUploadProgress({});
      }, 2000);
    } catch (error) {
      console.error("Error al subir archivos:", error);
      toast.error("Error inesperado al subir archivos");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    onFileSelect(updatedFiles);
    toast.success("Archivo eliminado");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type === "image") {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Zona de subida */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          uploading && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept={getAcceptedTypes()}
            multiple={multiple}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Subiendo archivos...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {multiple
                    ? "Arrastra archivos aquí"
                    : "Arrastra un archivo aquí"}
                </p>
                <p className="text-xs text-muted-foreground">
                  o{" "}
                  <span className="text-primary hover:underline">
                    haz clic para seleccionar
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Máximo {maxFiles} archivos, {formatFileSize(maxSize)} cada uno
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progreso de subida */}
      {Object.keys(uploadProgress).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-3">Progreso de subida:</h4>
            <div className="space-y-3">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">
                      Archivo {fileId.split("-")[1]}
                    </span>
                    <div className="flex items-center gap-1">
                      {progress.status === "uploading" && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      {progress.status === "completed" && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      {progress.status === "error" && (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span>{progress.progress}%</span>
                    </div>
                  </div>
                  <Progress value={progress.progress} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archivos subidos */}
      {currentFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">
                Archivos subidos ({currentFiles.length})
              </h4>
              {currentFiles.length > 0 && (
                <Badge variant="secondary">
                  {currentFiles.length}/{maxFiles}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentFiles.map((file, index) => (
                <Card key={file.id || index} className="relative group">
                  <CardContent className="p-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    {file.type === "image" && file.preview ? (
                      <div className="mb-2">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-20 object-cover rounded border"
                        />
                      </div>
                    ) : (
                      <div className="mb-2 flex items-center justify-center h-20 bg-muted rounded border">
                        {getFileIcon(file)}
                      </div>
                    )}

                    <div className="space-y-1">
                      <p
                        className="text-xs font-medium truncate"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      {file.uploadedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
