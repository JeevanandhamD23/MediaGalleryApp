import { useState } from 'react';
import { message } from 'antd';
import { videoApi } from '../../../services/api/videoApi';

export const useVideoActions = (onRefresh) => {
    const [loading, setLoading] = useState({
        star: false,
        delete: false,
        restore: false,
        update: false,
    });

    const handleStarVideo = async (video) => {
        setLoading(prev => ({ ...prev, star: true }));
        try {
            await videoApi.toggleStar(video._id);
            message.success(video.isStarred ? 'Removed from favorites' : 'Added to favorites');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error('Failed to update favorite status');
            console.error('Star error:', err);
        } finally {
            setLoading(prev => ({ ...prev, star: false }));
        }
    };

    const handleTrashVideo = async (video) => {
        setLoading(prev => ({ ...prev, delete: true }));
        try {
            await videoApi.moveToTrash(video._id);
            message.success('Video moved to trash');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error('Failed to move video to trash');
            console.error('Trash error:', err);
        } finally {
            setLoading(prev => ({ ...prev, delete: false }));
        }
    };

    const handleRestoreVideo = async (video) => {
        setLoading(prev => ({ ...prev, restore: true }));
        try {
            await videoApi.restoreFromTrash(video._id);
            message.success('Video restored successfully');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error('Failed to restore video');
            console.error('Restore error:', err);
        } finally {
            setLoading(prev => ({ ...prev, restore: false }));
        }
    };

    const handleUpdateDescription = async (video, description) => {
        setLoading(prev => ({ ...prev, update: true }));
        try {
            await videoApi.updateDescription(video._id, description);
            message.success('Description updated successfully');
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error('Update description error:', err);
            message.error(err.response?.data?.message || 'Failed to update description');
            throw err;
        } finally {
            setLoading(prev => ({ ...prev, update: false }));
        }
    };

    const handlePermanentDelete = async (video) => {
        setLoading(prev => ({ ...prev, delete: true }));
        try {
            await videoApi.permanentDelete(video._id);
            message.success('Video permanently deleted');
            if (onRefresh) onRefresh();
        } catch (err) {
            message.error('Failed to delete video');
            console.error('Delete error:', err);
        } finally {
            setLoading(prev => ({ ...prev, delete: false }));
        }
    };

    return {
        loading,
        handleStarVideo,
        handleTrashVideo,
        handleRestoreVideo,
        handlePermanentDelete,
        handleUpdateDescription,
    };
}; 