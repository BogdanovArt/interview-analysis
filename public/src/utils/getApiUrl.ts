const getApiUrl = (url: string) => {
  const protocol = document.location.protocol;
  const host = document.location.hostname;
  return `${protocol}//${host}/api${url}`;
};

export default getApiUrl;
