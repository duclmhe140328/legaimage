import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlaceholdersAndVanishInput } from "./ui/Input";
import axios from "axios";
import { TypewriterEffect } from "./ui/TypeWrite";
import {
  Facebook,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

function Generate() {
  const placeholders = [
    "Bạn muốn tạo hình ảnh như nào?",
    "Nhập câu lệnh ở đây...",
  ];

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    if (generated) return;
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${api}`,
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setImageUrl(`data:image/jpeg;base64,${response.data.image_data}`);
      } else {
        setError("Failed to generate image");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = `imagify-${Date.now()}.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="p-3 flex flex-col">
        <div className="flex flex-col md:flex-row p-5 md:mx-8">
          <Link to="/">
            <h1 className="text-3xl font-bold text-white">Lega Imagine.</h1>
          </Link>
        </div>

        <div className="w-full flex flex-col">
          {loading && (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
              <h2 className="text-zinc-900 dark:text-white mt-4">Chờ xíu...</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Đang tạo hình ảnh của bạn</p>
            </div>
          )}

          {error && (
            <div className="mb-4 text-white bg-red-800 p-3 rounded-lg">
              {error}
            </div>
          )}

          {imageUrl && (
            <div className="mt-8 mb-8 mx-auto flex flex-col justify-center items-center">
              <img
                src={imageUrl}
                alt="Generated"
                className="rounded-lg shadow-lg max-w-lg"
              />
              <button
                onClick={handleDownload}
                className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24px"
                  width="24px"
                >
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    stroke="#f1f1f1"
                    d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                  />
                </svg>
                Download
              </button>
            </div>
          )}

          {!imageUrl && !loading && (
            <div className="mt-28 mb-28">
              <TypewriterEffect
                words={[
                  { text: "Generate" },
                  { text: "awesome" },
                  { text: "images" },
                  { text: "with" },
                  { text: "Imagify" },
                ]}
                className="text-white text-center text-3xl md:text-6xl"
              />
            </div>
          )}

          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* ✅ Footer */}
      <footer className="mt-16 px-6 py-10 bg-[#111] text-gray-400 border-t border-gray-700">
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
        <p className="text-center text-xs text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Generate;
