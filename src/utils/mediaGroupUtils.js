import { format, startOfHour, endOfHour, isValid } from 'date-fns';

export const groupMediaByHour = (items) => {
    if (!items || !items.length) return [];

    // Sort items by createdAt in descending order
    const sortedItems = [...items].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.deletedAt);
        const dateB = new Date(b.createdAt || b.deletedAt);
        return dateB - dateA;
    });

    // Group items by hour
    const groups = sortedItems.reduce((acc, item) => {
        const date = new Date(item.createdAt || item.deletedAt);

        // Skip invalid dates
        if (!isValid(date)) {
            console.warn('Invalid date for item:', item);
            return acc;
        }

        const hourStart = startOfHour(date);
        const hourEnd = endOfHour(date);
        const key = format(date, 'yyyy-MM-dd HH:00');

        if (!acc[key]) {
            acc[key] = {
                timeRange: `${format(hourStart, 'h:mm a')} - ${format(
                    hourEnd,
                    'h:mm a'
                )}`,
                items: [],
            };
        }

        acc[key].items.push(item);
        return acc;
    }, {});

    // Convert to array format
    return Object.entries(groups).map(([date, { timeRange, items }]) => [
        timeRange,
        items,
    ]);
}; 