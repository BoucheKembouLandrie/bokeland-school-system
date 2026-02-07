export const formatDate = (dateString: string | Date | undefined | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const format = localStorage.getItem('date_format') || 'dd/mm/yyyy';

    if (format === 'mm/dd/yyyy') {
        return `${month}/${day}/${year}`;
    }

    return `${day}/${month}/${year}`;
};
