import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/videos';

export const uploadVideo = async (formData, onUploadProgress) => {
    return await axios.post(`${API_BASE_URL}/upload`, formData, {
        onUploadProgress,
    });
};

export const getVideoStatus = async (videoId) => {
    return await axios.get(`${API_BASE_URL}/${videoId}/status`);
};
