"use client";

import React, { useState, useRef, useCallback } from "react";
import { X, Camera, Upload, RotateCw, ZoomIn, ZoomOut, Check } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/app/_lib/supabase";
import axios from "axios";
import "./avatar-modal.css";

const AvatarUploadModal = ({ isOpen, onClose, currentAvatar, userId, onSuccess }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || "");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleZoomChange = (e) => {
    setZoom(parseFloat(e.target.value));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Upload to Supabase
      const fileName = `${Math.random()}-${Date.now()}-${selectedImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const avatarUrl = `${supabaseURL}/storage/v1/object/public/user-avatars/${fileName}`;

      // Update user profile
      await axios.patch(
        `/api/v1/users/${userId}`,
        { photo: avatarUrl },
        { headers: { "Content-Type": "application/json" } }
      );

      setUploadSuccess(true);
      setTimeout(() => {
        toast.success("Profile photo updated successfully! 🎉");
        onSuccess(avatarUrl);
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setPreviewUrl(currentAvatar || "");
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setError("");
    setUploadSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="avatar-modal-backdrop" onClick={handleClose}>
      <div className="avatar-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Update Profile Photo</h2>
            <p className="modal-subtitle">Upload a new photo or drag and drop</p>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Avatar Preview */}
          <div className="avatar-preview-section">
            <div className="avatar-preview-circle">
              {uploadSuccess ? (
                <div className="success-checkmark">
                  <Check size={64} strokeWidth={3} />
                </div>
              ) : previewUrl ? (
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Avatar preview"
                  className="avatar-preview-image"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                  }}
                />
              ) : (
                <div className="avatar-preview-placeholder">
                  <Camera size={48} />
                  <p>No image selected</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Zone */}
          <div
            className={`upload-zone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload size={40} className="upload-icon" />
            <p className="upload-text">Drag and drop your image here</p>
            <p className="upload-subtext">or</p>
            <button
              className="choose-file-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={18} />
              Choose Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
              style={{ display: "none" }}
            />
            <p className="upload-hint">JPG, PNG, or WEBP • Max 5MB</p>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Image Editing Tools */}
          {selectedImage && !uploadSuccess && (
            <div className="editing-tools">
              <div className="tool-group">
                <label className="tool-label">Zoom</label>
                <div className="zoom-controls">
                  <button
                    className="tool-btn"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  >
                    <ZoomOut size={18} />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={handleZoomChange}
                    className="zoom-slider"
                  />
                  <button
                    className="tool-btn"
                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  >
                    <ZoomIn size={18} />
                  </button>
                  <span className="zoom-value">{Math.round(zoom * 100)}%</span>
                </div>
              </div>

              <div className="tool-group">
                <label className="tool-label">Rotate</label>
                <button className="tool-btn-large" onClick={handleRotate}>
                  <RotateCw size={18} />
                  Rotate 90°
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleClose} disabled={isUploading}>
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!selectedImage || isUploading || uploadSuccess}
          >
            {isUploading ? (
              <>
                <span className="btn-spinner"></span>
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <Check size={18} />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;
