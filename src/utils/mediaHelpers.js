import { format } from 'date-fns';

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const groupByDate = (items) => {
    const groups = items.reduce((acc, item) => {
        const date = new Date(item.createdAt);
        const key = format(date, 'yyyy-MM-dd');
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});

    return Object.entries(groups).map(([date, items]) => ({
        date,
        items,
        formattedDate: format(new Date(date), 'MMMM d, yyyy')
    }));
};

export const isImage = (mimetype) => mimetype.startsWith('image/');
export const isVideo = (mimetype) => mimetype.startsWith('video/');

export const getFileIcon = (mimetype) => {
    if (isImage(mimetype)) return 'file-image';
    if (isVideo(mimetype)) return 'video-camera';
    return 'file';
}; 