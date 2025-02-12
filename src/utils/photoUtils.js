export const groupPhotosByHour = (photos) => {
    // Create a map to store photos grouped by hour
    const groupedPhotos = new Map();

    photos.forEach(photo => {
        const date = new Date(photo.createdAt);
        const hour = date.getHours();
        // Create hour range string (e.g., "11 AM - 12 PM")
        const hourRange = `${formatHour(hour)} - ${formatHour((hour + 1) % 24)}`;

        if (!groupedPhotos.has(hourRange)) {
            groupedPhotos.set(hourRange, []);
        }
        groupedPhotos.get(hourRange).push(photo);
    });

    // Convert map to array and sort by hour
    return Array.from(groupedPhotos.entries())
        .sort((a, b) => {
            const hourA = getHourFromRange(a[0]);
            const hourB = getHourFromRange(b[0]);
            return hourA - hourB;
        });
};

const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${period}`;
};

const getHourFromRange = (range) => {
    const hour = parseInt(range.split(' ')[0]);
    const period = range.split(' ')[1];
    if (period === 'PM' && hour !== 12) return hour + 12;
    if (period === 'AM' && hour === 12) return 0;
    return hour;
}; 