export const api = async (endpoint, options = {}) => {
  // If your proxy is set up, this will always hit http://localhost:5000/api/...
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  return response;
};