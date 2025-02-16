import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const videoApi = {
    getAll: async (query = '') => {
        const response = await axios.get(`${BASE_URL}/api/videos${query ? `?${query}` : ''}`);
        return response.data;
    },

    getStarred: async () => {
        const response = await axios.get(`${BASE_URL}/api/videos/starred`);
        return response.data;
    },

    toggleStar: async (id) => {
        const response = await axios.patch(`${BASE_URL}/api/videos/${id}/star`);
        return response.data;
    },

    moveToTrash: async (id) => {
        const response = await axios.patch(`${BASE_URL}/api/videos/${id}/trash`);
        return response.data;
    },

    upload: async (formData) => {
        const response = await axios.post(`${BASE_URL}/api/videos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateDescription: async (id, description) => {
        const response = await axios.patch(`${BASE_URL}/api/videos/${id}/description`, {
            description
        });
        return response.data;
    },

    permanentDelete: async (id) => {
        const response = await axios.delete(`${BASE_URL}/api/trash/${id}`);
        return response.data;
    },

    restoreFromTrash: async (id) => {
        const response = await axios.patch(`${BASE_URL}/api/trash/${id}/restore`);
        return response.data;
    }
}; 