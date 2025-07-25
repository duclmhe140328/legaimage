"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import {
  Facebook,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import axios from "axios";

interface ImageData {
  id: string;
  prompt: string;
  imageData: string;
}

export function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const url = import.meta.env.VITE_IMG_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        if (!url) {
          throw new Error("Image URL is not defined in the environment variables.");
        }
        const response = await axios.get(url);

        if (!response.data) {
          throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
        }
        setImages(response.data);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDownload = (image: ImageData) => {
    const link = document.createElement("a");
    const isBase64 = image.imageData.startsWith("/9j") || image.imageData.startsWith("iVBOR");
    const imageUrl = isBase64
      ? `data:image/jpeg;base64,${image.imageData}`
      : `https://legaimage.onrender.com${image.imageData}`;

    link.href = imageUrl;
    link.download = `ai-image-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {error ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-80 px-5 md:px-10 items-center">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#171717] rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="h-64 bg-gray-700 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="h-10 bg-gray-700 rounded animate-pulse w-full"></div>
                  </div>
                </div>
              ))
            : images.map((image) => (
                <div
                  key={image.id}
                  className="bg-[#171717] rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="relative h-64 bg-gray-900">
                    {image.imageData.startsWith("/9j") ||
                    image.imageData.startsWith("iVBOR") ? (
                      <img
                        src={`data:image/jpeg;base64,${image.imageData}`}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://legaimage.onrender.com${image.imageData}`}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300">{image.prompt}</p>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleDownload(image)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-[#000000] hover:bg-[#00000054] cursor-pointer text-white rounded transition-colors"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Tải xuống hình ảnh
                    </button>
                  </div>
                </div>
              ))}
        </div>
      )}

      {!loading && images.length === 0 && !error && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-400">No images found. Try again later.</p>
        </div>
      )}

      {/* ✅ FOOTER */}
      <footer className="mt-20 px-6 py-10 bg-[#111] text-gray-400 border-t border-gray-700">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h3 className="text-white font-semibold text-lg">Developed by</h3>
            <p>Le Minh Duc & Dao Minh Thuyet</p>
            <p className="flex items-center justify-center md:justify-start mt-1 gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:contact@example.com" className="underline hover:text-white">
                contact@example.com
              </a>
            </p>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 hover:text-white transition" />
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 hover:text-white transition" />
            </a>
            <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-5 h-5 hover:text-white transition" />
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </>
  );
}
