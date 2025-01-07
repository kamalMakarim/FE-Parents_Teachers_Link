import React, { useState, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import Modal from "react-modal";
import Clip from "../src/assets/teacher/clip.svg";

// Modal Styling
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 50,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    background: "#fff",
  },
};

Modal.setAppElement("#root");

const UploadButton = ({ maxSizeMB = 0.5, maxWidthOrHeight = 1920, setImageLink}) => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      setUploadStatus("No file selected.");
      return;
    }

    try {
      setLoading(true);
      setUploadStatus("");

      // Compress the image
      const compressedFile = await compressImage(file);
      setSelectedFile(compressedFile);

      // Create a preview URL for the selected image
      const preview = URL.createObjectURL(compressedFile);
      setPreviewUrl(preview);
    } catch (error) {
      console.error("Compression error:", error);
      setUploadStatus("File compression failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadStatus("No file selected for upload.");
      return;
    }

    try {
      setLoading(true);
      setUploadStatus("");

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload the compressed file
      const response = await axios.post(
        "https://bukom-zipline.9retes.easypanel.host/api/upload",
        formData,
        {
          headers: {
            Authorization: `naPdbozWdkOTku6cwhYJXIxz.MTczNTk3NjUyMzQ1Mw`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = await response.data.files[0];
      setImageLink(fileUrl);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
    };

    return await imageCompression(file, options);
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#00AFEF] text-white rounded-md hover:bg-[#017aa7] h-full w-max px-4 py-2 flex items-center"
      >
        <img src={Clip} alt="Clip" className="w-5 h-5 object-cover" />
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Upload Image Modal"
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 transition-transform text-xl font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Upload Image</h2>

          {/* File Input Section */}
          <div className="w-full mb-4">
            <label
              htmlFor="file-input"
              className="block w-full py-3 border-2 border-dashed border-gray-300 text-center rounded-md cursor-pointer hover:border-gray-500"
            >
              {selectedFile
                ? "File ready for upload"
                : "Click to upload an image"}
            </label>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              style={{ display: "none" }}
            />
          </div>

          {/* Preview Section */}
          {previewUrl && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-md shadow-md"
                loading="lazy"
              />
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus && (
            <p className="mt-4 text-sm text-gray-700 text-center">
              {uploadStatus}
            </p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md mt-2"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UploadButton;
