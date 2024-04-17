export const isTodayMessage = (date: string) => {
    const today = new Date();
    const updatedAt = new Date(date);
    return updatedAt.getDate() < today.getDate()
        ? updatedAt.toLocaleDateString('en-US', { weekday: 'short' })
        : updatedAt.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
          });
};
