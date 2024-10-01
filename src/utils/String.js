export const encodeString = (str) => {
    return str
      .replace(/"/g, '&quot;') // Replace double quotes
      .replace(/'/g, '&apos;'); // Replace single quotes
  };
  
// Function to decode special characters
export const decodeString = (str) => {
    return str
        .replace(/&quot;/g, '"') // Decode double quotes
        .replace(/&apos;/g, "'"); // Decode single quotes
};

export const cleanJsonString = (str) => {
  return str.replace(/[^\x20-\x7E]/g, ''); // Remove non-printable ASCII characters
};