import React, { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes

  // Prevent default drag behaviors
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Highlight drop zone
  const highlight = () => {
    dropZoneRef.current.classList.add('drag-over');
  };

  // Unhighlight drop zone
  const unhighlight = () => {
    dropZoneRef.current.classList.remove('drag-over');
  };

  // Handle file drop
  const handleDrop = (e) => {
    preventDefaults(e);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles([...droppedFiles]);
    }
  };

  // Add files to state
  const addFiles = (newFiles) => {
    const updatedFiles = [...files];
    newFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" exceeds 30MB limit and won't be added.`);
        return;
      }
      const isDuplicate = updatedFiles.some(
        (existingFile) => existingFile.name === file.name && existingFile.size === file.size
      );
      if (!isDuplicate) {
        updatedFiles.push(file);
      }
    });
    setFiles(updatedFiles);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles([...selectedFiles]);
      fileInputRef.current.value = null; // Reset input
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Remove file
  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  // Simulate upload
  const handleUpload = () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          alert(`${files.length} file(s) uploaded successfully!`);
          setFiles([]);
          setIsUploading(false);
          return 0;
        }
        return prev + 20;
      });
    }, 300); // Simulates a 1.5-second upload
  };

  return (
    <div className="upload-container">
      <h1>File Upload System</h1>

      <div
        className="upload-area"
        ref={dropZoneRef}
        onClick={() => fileInputRef.current.click()}
        onDragEnter={highlight}
        onDragOver={(e) => {
          preventDefaults(e);
          highlight();
        }}
        onDragLeave={unhighlight}
        onDrop={(e) => {
          handleDrop(e);
          unhighlight();
        }}
      >
        <div className="upload-icon">📤</div>
        <h3>Drag & Drop Files Here</h3>
        <p>or</p>
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="fileInput" className="browse-btn">
          Browse Files
        </label>
        <p className="size-limit">Max file size: 30MB</p>
      </div>

      <div className="file-list">
        <h3>Selected Files:</h3>
        <ul id="fileListItems">
          {files.map((file, index) => (
            <li key={index}>
              <span>{`${file.name} (${formatFileSize(file.size)})`}</span>
              <span
                onClick={() => removeFile(index)}
                style={{ cursor: 'pointer', color: '#ff0066', fontSize: '20px' }}
              >
                ×
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={files.length === 0 || isUploading}
      >
        {isUploading ? `Uploading... ${progress}%` : 'Upload Files'}
      </button>
    </div>
  );
};

export default FileUpload;