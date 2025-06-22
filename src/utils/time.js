export const formatDisplayTime = (timeString) => {
    // This function assumes timeString is in "HH:MM AM/PM" format
    // and just returns it. We can add more complex logic here if needed.
    return timeString;
};

export const getAmPmSymbol = (date) => {
    const hours = date.getHours();
    return hours < 12 ? '☀️' : '🌙';
};

export const formatNextAlarmDate = (date) => {
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();

    if (isToday) {
        return 'Today';
    }

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = tomorrow.toDateString() === date.toDateString();

    if (isTomorrow) {
        return 'Tomorrow';
    }

    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}; 