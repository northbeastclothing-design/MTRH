export function updateClientOgpTags({
  title,
  description,
  url,
  image
}: {
  title: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  if (typeof document === 'undefined') return;

  document.title = title;

  const setMeta = (attr: string, key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  if (description) {
    setMeta('name', 'description', description);
    setMeta('property', 'og:description', description);
    setMeta('property', 'twitter:description', description);
  }

  setMeta('property', 'og:title', title);
  setMeta('property', 'twitter:title', title);

  if (url) {
    setMeta('property', 'og:url', url);
    setMeta('property', 'twitter:url', url);
  }

  if (image) {
    const cleanImg = (image.startsWith('http') && !image.includes('weserv.nl'))
      ? `https://images.weserv.nl/?url=${image}`
      : image;
    setMeta('property', 'og:image', cleanImg);
    setMeta('property', 'twitter:image', cleanImg);
  }
}
