export function timeAgo(dateParam: Date) {
  const now: Date = new Date();
  const seconds = Math.round((+now - +dateParam) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  if (seconds < 5) {
    return "now";
  }
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }
  if (seconds < 90) {
    return "A minute ago";
  }
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
  if (hours < 24) {
    return `${hours} hours ago`;
  }
  if (days < 7) {
    return days > 1 ? `${days} days ago` : `${days} day ago`;
  }
  if (weeks < 4) {
    return weeks > 1 ? `${weeks} weeks ago` : `${weeks} week ago`;
  }
  if (months < 12) {
    return months > 1 ? `${months} months ago` : `${months} month ago`;
  }
  return "1 year ago";
}
