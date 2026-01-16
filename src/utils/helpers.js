//send either a Date object or an ISO date string to be formatted as Mon DD, YYYY, HH:MM AM/PM
export function formatDate(date) {
  if (!date) return '-';
  const dateStr = typeof date === 'string' ? date : date.toISOString();
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
  }).format(new Date(dateStr));
}

export function getImageURLByHeightSize(images, size) {
  images.sort((a, b) => a.height - b.height);
  const imgUrl = images?.find((img) => img.height >= size)?.url;
  return imgUrl;
}

export function getArtistsString(artists) {
  return artists.map((artist) => artist.name).join(', ');
}
