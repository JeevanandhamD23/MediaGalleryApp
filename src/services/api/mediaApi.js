import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const mediaApi = {
    getAll: async (query = '') => {
        const response = await axios.get(`${BASE_URL}/api/media${query}`);
        return response.data;
    },

    getStarred: async (query = '') => {
        const response = await axios.get(`${BASE_URL}/api/media/starred${query}`);
        return response.data;
    },

    getTrashItems: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/trash`);
            return response.data;  // This should contain { items: [...] }
        } catch (err) {
            console.error('Error fetching trash items:', err);
            throw err;
        }
    },

    restoreFromTrash: async (id) => {
        const response = await axios.patch(`${BASE_URL}/api/trash/${id}/restore`);
        return response.data;
    },

    permanentDelete: async (id) => {
        const response = await axios.delete(`${BASE_URL}/api/trash/${id}`);
        return response.data;
    },

    getStorageStats: async () => {
        const response = await axios.get(`${BASE_URL}/api/storage/stats`);
        return response.data;
    }
}; 