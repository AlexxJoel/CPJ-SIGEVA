// function to format date to dd/mm/yyyy
export const formatDate = (date: Date) => {
    const d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = '' + d.getFullYear()
    return [day, month, year].join('/');
}