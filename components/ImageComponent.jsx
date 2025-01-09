import React, { useState } from "react";
import Modal from "react-modal";

// Set the app element for accessibility
Modal.setAppElement("#root");

const ImageComponent = ({ src, alt = "Image" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
return (
    <div>
        <img
            src={src}
            alt={alt}
            onClick={handleOpen}
            className="image-thumbnail"
        />
        
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Image Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <div className="modal-inner">
                <button
                    onClick={handleClose}
                    className="btn-close"
                >
                    X
                </button>
                <div className="modal-image-container">
                    <img
                        src={src}
                        alt={alt}
                        className="modal-image"
                    />
                </div>
            </div>
        </Modal>

        <style jsx>{`
            /* Modal Overlay */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 50;
            }

            /* Modal Content */
            .modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                max-width: 80vw;
                max-height: 95vh;
                position: relative;
            }

            /* Modal Inner Container */
            .modal-inner {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            /* Image Container */
            .modal-image-container {
                display: flex;
                justify-content: center;
                align-items: center;
                max-width: 80vw;
                height: 90vh;
            }

            /* Image Style */
            .modal-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
            }

            /* Thumbnail Image Style */
            .image-thumbnail {
                max-width: 60vw;
                max-height: 50vh;
                cursor: pointer;
                border-radius: 8px;
                margin-top: 5px;
                margin-bottom: 5px;
            }

            /* Close Button */
            .btn-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .btn-close:hover {
                background-color: #d32f2f;
            }
        `}</style>
    </div>
);
};

export default ImageComponent;
