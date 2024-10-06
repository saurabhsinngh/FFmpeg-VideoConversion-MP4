import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select a video to upload.');
      return;
    }

    const uploadStatuses = {};
    const uploadPromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'mp4') {
        alert(`${file.name} is already in MP4 format.`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      uploadStatuses[file.name] = 'Uploading';
      setUploadStatus({ ...uploadStatuses });

      const uploadPromise = axios.post('http://localhost:5000/api/videos/upload', formData, {
        onUploadProgress: (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            uploadStatuses[file.name] = `Uploading ${progress}%`;
            setUploadStatus({ ...uploadStatuses });
          }
        }
      })
      .then(response => {
        if (response.status === 200) {
          uploadStatuses[file.name] = 'Uploaded';
        } else {
          uploadStatuses[file.name] = 'Upload Failed';
        }
        setUploadStatus({ ...uploadStatuses });
      })
      .catch(error => {
        console.error('Upload failed:', error);
        uploadStatuses[file.name] = 'Upload Failed';
        setUploadStatus({ ...uploadStatuses });
      });

      uploadPromises.push(uploadPromise);
    }

    await Promise.all(uploadPromises);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="video/"
      />
      <button onClick={handleUpload}>Upload</button>
      <div>
        {Array.from(files).map((file) => (
          <div key={file.name}>
            {file.name} - {uploadStatus[file.name] || 'Pending'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
