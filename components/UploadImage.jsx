import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import Modal from "react-modal";
import Clip from "../src/assets/teacher/clip.svg";
import leftArrow from "../src/assets/teacher/left_arrow.svg";
import rightArrow from "../src/assets/teacher/right_arrow.svg";
import deleteSVG from "../src/assets/teacher/delete.svg";
import { fi } from "date-fns/locale";

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

const UploadButton = ({
  maxSizeMB = 0.5,
  maxWidthOrHeight = 1920,
  setImageLink,
  setPreviewImages,
}) => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileChange = async (event) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      setUploadStatus("No files selected.");
      return;
    }

    try {
      //setLoading(true);
      setUploadStatus("");

      // Compress images and generate preview URLs
      const compressedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          const compressed = await compressImage(file);
          return compressed;
        })
      );

      const previews = compressedFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles(compressedFiles);
      setPreviewImages(previews);
      setPreviewUrls(previews);
      setCurrentIndex(0); // Reset carousel index
    } catch (error) {
      console.error("Compression error:", error);
      setUploadStatus("File compression failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadStatus("No files selected for upload.");
      return;
    }

    try {
      //setLoading(true);
      setUploadStatus("");

      // Upload the compressed files one by one
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "https://binekas-zipline.tagj8z.easypanel.host/api/upload",
          formData,
          {
            headers: {
              Authorization: `MTc0MTA1OTY2NjE1MA==.ODU3ZDg3NzU3NDYzYzJkZGZkMjJmNTM2ZGFmNzFjYjUuNDU0OTYwNzE5NTk5NDNlOTVmMjIyNGI4NzU4ZDYzMDMzZmI2MWZjYWQ4MjFjMmIxYjk5YjQ2MjQ2N2Y4ODdiMWQzZTQ3ZGY4MDU1MjIyOGE3YjBhNjgzMzQ3MzdkZjNiNjcwOGNlMzdjYjIyZDMwODVmMWYzODQxMjMzNDIwYzkzNzE4YTRjMTMyZDVjMWRkNWUzNmFiNGM5MTIzMDc1Mw==`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data.files[0];
      });

      const fileUrls = await Promise.all(uploadPromises);
      console.log("Uploaded files:", fileUrls);

      setImageLink(fileUrls);
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

  const handleNext = () => {
    if (currentIndex < previewUrls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
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
      >
        <h2 className="text-lg font-bold mb-4">Upload Images</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />

        {loading && <p>Compressing images...</p>}
        {uploadStatus && <p className="text-red-500">{uploadStatus}</p>}
        {previewUrls.length > 0 && (
          <div className="carousel">
            <div className="image-container">
              <img
                src={previewUrls[currentIndex]}
                alt={`Preview ${currentIndex + 1}`}
                className="w-full h-auto"
              />
            </div>
            <div className="carousel-controls flex justify-between mt-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className=""
              >
                <img src={leftArrow} alt="Next" className="w-4 h-4" />
              </button>
              <img
                onClick={() => {
                  const newPreviewUrls = previewUrls.filter(
                    (_, index) => index !== currentIndex
                  );
                  const newSelectedFiles = selectedFiles.filter(
                    (_, index) => index !== currentIndex
                  );
                  setPreviewUrls(newPreviewUrls);
                  setSelectedFiles(newSelectedFiles);
                  setPreviewImages(newPreviewUrls);
                  setCurrentIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : 0
                  );
                }}
                className="w-5 h-5 cursor-pointer"
                src={deleteSVG}
              ></img>
              <button
                onClick={handleNext}
                disabled={currentIndex === previewUrls.length - 1}
                className=""
              >
                <img src={rightArrow} alt="Next" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#00AFEF] text-white mt-4 rounded-md hover:bg-[#017aa7] px-4 py-2"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button
          onClick={() => {
            setIsModalOpen(false);
            setPreviewUrls([]);
            setSelectedFiles([]);
            setPreviewImages([]);
          }}
          className="bg-red-500 text-white mt-4 rounded-md hover:bg-red-700 px-4 py-2"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default UploadButton;
