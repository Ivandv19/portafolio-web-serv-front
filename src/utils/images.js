export const getCloudflareImage = (url, width) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '';
  }

  const myDomain = 'portafolio-web-front.mgdc.site';
  const cdnPart = `https://${myDomain}/cdn-cgi/image/width=${width},format=auto,quality=85`;

  // 1. Tu dominio
  if (url.includes(myDomain)) {
    return url.replace(`https://${myDomain}/`, `${cdnPart}/`);
  }

  // 2. GitHub
  if (url.includes('avatars.githubusercontent.com')) {
    return `${cdnPart}/${url}`;
  }
  
  // 3. Pravatar 
  if (url.includes('i.pravatar.cc')) {
    return `${cdnPart}/${url}`;
  }

  // Fallback
  return url;
};