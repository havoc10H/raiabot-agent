// Function to encode special characters
export const encodeString = (str) => {
  return str
      .replace(/"/g, '&quot;') // Replace double quotes
      .replace(/'/g, '&apos;') // Replace single quotes
      .replace(/:/g, '&colon;'); // Replace colons
};

// Function to decode special characters
export const decodeString = (str) => {
  return str
      .replace(/&quot;/g, '"') // Decode double quotes
      .replace(/&apos;/g, "'") // Decode single quotes
      .replace(/&colon;/g, ':'); // Decode colons
};

export const cleanJsonString = (str) => {
  return str.replace(/[^\x20-\x7E]/g, ''); // Remove non-printable ASCII characters
};

export const convertToHtml = (inputText) => {
  let replacedText = inputText;

  // Rule 1: Replace newlines with <br>
  replacedText = replacedText.replace(/\n/g, '<br />');

  // Rule 2: Insert <br> before numbers like 1., 2., 3. and "- "
  replacedText = replacedText.replace(/(?<=\D)(\d+\.\s|\-\s)/g, '<br /><strong>$1</strong>');

  // Rule 3: Make substring from ### to line end has <h1>
  replacedText = replacedText.replace(/###(.*?)(<br\s*\/?>|$)/g, '<h1 class="text-xl my-2"><strong>$1</strong></h1>');

  // Rule 4: Make substring from ## to line end has <h2>
  replacedText = replacedText.replace(/##(.*?)(<br\s*\/?>|$)/g, '<h2 class="text-lg my-2"><strong>$1</strong></h2>');

   // Rule 4: Make substring from ## to line end has <h2>
   replacedText = replacedText.replace(/#(.*?)(<br\s*\/?>|$)/g, '<h3 class="text-md my-2"><strong>$1</strong></h3>');

  // Rule 5: Make substring from ** to ** has <strong>
  replacedText = replacedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Rule 6: Make (https: ...) to (<a>https...</a>)
  replacedText = replacedText.replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" class="text-blue-500 text-lg my-2"> $1 </a>');

  // Rule 7: Check if the last character is a question mark and insert <br> after the last period
  if (replacedText.trim().endsWith('?')) {
    replacedText = replacedText.replace(/[.!](?=[^.!]*$)/, '$&<br /><br />');
  }

  return replacedText;
};
