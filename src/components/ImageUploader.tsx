import React, { useState, useCallback, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Image as ImageIcon,
  X,
  FileImage,
  CheckCircle,
} from "lucide-react";

interface ImageUploaderProps {
  onHashCalculated?: (hash: string) => void;
}

const ImageUploader = ({ onHashCalculated = () => {} }: ImageUploaderProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hashProgress, setHashProgress] = useState(0);
  const [hash, setHash] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleImageUpload(e.target.files[0]);
      }
    },
    [],
  );

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setHash(null);
    setHashProgress(0);
  };

  const calculateHash = async () => {
    if (!image) return;

    setIsCalculating(true);
    setHashProgress(0);

    try {
      // Simulate hash calculation with progress
      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setHashProgress(Math.floor((i / totalSteps) * 100));
      }

      // In a real implementation, we would calculate the actual SHA-256 hash here
      // For now, we'll simulate it with a mock hash
      const mockHash = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");

      setHash(mockHash);
      onHashCalculated(mockHash);
    } catch (error) {
      console.error("Error calculating hash:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setHash(null);
    setHashProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <FileImage className="mr-2 h-5 w-5 text-[#FF9933]" />
            Image Upload
          </CardTitle>
          {hash && (
            <Badge
              variant="outline"
              className="border-[#138808] text-[#138808]"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Hash Ready
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!imagePreview ? (
          <div
            className={`border-2 border-dashed rounded-xl p-12 w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging ? "border-[#FF9933] bg-[#FF9933]/5 scale-105" : "border-gray-300 hover:border-[#FF9933] hover:bg-gray-50"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? "bg-[#FF9933]/20" : "bg-gray-100"}`}
            >
              <Upload
                className={`h-8 w-8 ${isDragging ? "text-[#FF9933]" : "text-gray-400"}`}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isDragging ? "Drop your image here" : "Upload Image"}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Drag and drop an image file here, or click to browse and select
              from your device
            </p>
            <Badge variant="secondary" className="mt-3 text-xs">
              Supports: JPG, PNG, GIF, WebP
            </Badge>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden bg-gray-50 p-4">
              <div className="relative w-full max-h-80 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="object-contain max-h-80 rounded-lg shadow-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 shadow-lg"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#FF9933]/20 rounded-lg">
                    <FileImage className="h-4 w-4 text-[#FF9933]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {image?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round(image?.size ? image.size / 1024 : 0)} KB
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>

              {isCalculating ? (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-blue-800">
                      Calculating SHA-256 hash...
                    </span>
                    <span className="text-sm font-mono text-blue-600">
                      {hashProgress}%
                    </span>
                  </div>
                  <Progress value={hashProgress} className="h-3" />
                </div>
              ) : hash ? (
                <div className="p-4 bg-gradient-to-r from-[#138808]/5 to-[#138808]/10 rounded-lg border-2 border-[#138808]/20">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#138808]">
                      SHA-256 Hash Generated
                    </p>
                    <Badge className="bg-[#138808] text-white">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Complete
                    </Badge>
                  </div>
                  <div className="p-3 bg-white rounded-md border border-gray-200">
                    <p className="text-xs font-mono break-all text-gray-700">
                      {hash}
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={calculateHash}
                  className="w-full bg-gradient-to-r from-[#FF9933] to-[#FF9933]/80 hover:from-[#FF9933]/90 hover:to-[#FF9933]/70 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <FileImage className="mr-2 h-4 w-4" />
                  Calculate SHA-256 Hash
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
