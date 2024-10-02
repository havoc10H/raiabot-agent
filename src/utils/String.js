// Function to encode special characters with try-catch
export const encodeData = (data) => {
  try {
    return btoa(unescape(encodeURIComponent(encodeString(data))));
  } catch (error) {
    return encodeString(data); // Return null or fallback value if encoding fails
  }
};

// Function to decode special characters with try-catch
export const decodeData = (data) => {
  try {
    return decodeString(decodeURIComponent(escape(atob(data))));
  } catch (error) {
    return decodeString(data);
  }
};

export const encodeString = (str) => {
  return str
    .replace(/"/g, '&quot;') // Replace double quotes
    .replace(/'/g, '&apos;') // Replace single quotes
    .replace(/:/g, '&colon;') // Replace colons
    .replace(/【.*?】/g, '');   // RegEx to find and remove content between 【 and 】
};

// Function to decode special characters
export const decodeString = (str) => {
  return str
    .replace(/&quot;/g, '"') // Decode double quotes
    .replace(/&apos;/g, "'") // Decode single quotes
    .replace(/&colon;/g, ':') // Decode colons
    .replace(/【.*?】/g, '');   // RegEx to find and remove content between 【 and 】
};

export const cleanJsonString = (str) => {
  return str.replace(/[^\x20-\x7E#\*\-\_\.\/]/g, ''); // Keep printable ASCII and common Markdown characters
};