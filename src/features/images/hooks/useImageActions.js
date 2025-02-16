import { useState } from 'react';
import { message } from 'antd';
import { imageApi } from '../../../services/api/imageApi';

export const useImageActions = (onRefresh) => {
    const [loading, setLoading] = useState({
        star: false,
        delete: false,
        restore: false,
        update: false
    });

    const handleStarImage = async (image) => {
        setLoading(prev => ({ ...prev, star: true }));
        try {
            await imageApi.toggleStar(image._id);
            message.success(image.isStarred ? 'Removed from favorites' : 'Added to favorites');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error('Failed to update favorite status');
        } finally {
            setLoading(prev => ({ ...prev, star: false }));
        }
    };

    const handleTrashImage = async (image) => {
        setLoading(prev => ({ ...prev, delete: true }));
        try {
            await imageApi.moveToTrash(image._id);
            message.success('Image moved to trash');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error('Failed to move image to trash');
        } finally {
            setLoading(prev => ({ ...prev, delete: false }));
        }
    };

    const handleRestoreImage = async (image) => {
        setLoading(prev => ({ ...prev, restore: true }));
        try {
            await imageApi.restoreFromTrash(image._id);
            message.success('Image restored successfully');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error('Failed to restore image');
        } finally {
            setLoading(prev => ({ ...prev, restore: false }));
        }
    };

    const handleUpdateDescription = async (image, description) => {
        setLoading(prev => ({ ...prev, update: true }));
        try {
            await imageApi.updateDescription(image._id, description);
            message.success('Description updated successfully');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to update description');
            throw err;
        } finally {
            setLoading(prev => ({ ...prev, update: false }));
        }
    };

    const handlePermanentDelete = async (image) => {
        setLoading(prev => ({ ...prev, delete: true }));
        try {
            await imageApi.permanentDelete(image._id);
            message.success('Image permanently deleted');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error('Failed to delete image');
        } finally {
            setLoading(prev => ({ ...prev, delete: false }));
        }
    };

    return {
        loading,
        handleStarImage,
        handleTrashImage,
        handleRestoreImage,
        handleUpdateDescription,
        handlePermanentDelete
    };
}; 