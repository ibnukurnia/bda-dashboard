
export const getTimeDifference = (date?: Date) => {
  if (!date) return ''
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `Refreshed 2 sec ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Refreshed ${minutes} min${minutes > 1 ? 's' : ''} ago`
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Refreshed ${hours} hour${hours > 1 ? 's' : ''} ago`
  }
};
