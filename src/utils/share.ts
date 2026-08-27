/**
 * Handles Web Share API or Clipboard copying fallback for sharing items across the site.
 */
export const handleShare = async (
  title: string,
  text: string,
  url: string,
  onShowToast?: (msg: string) => void
) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      return;
    } catch (err: any) {
      if (err && err.name === 'AbortError') {
        // User closed or cancelled native share sheet
        return;
      }
    }
  }

  // Clipboard fallback
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    if (onShowToast) {
      onShowToast('Link copied to clipboard!');
    } else {
      alert('Link copied to clipboard!');
    }
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
};
