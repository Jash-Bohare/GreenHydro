const apiUrl = 'http://127.0.0.1:5000/upload_pdf';  // Change this based on your backend URL

export const uploadDocument = async (formData) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData, // Send the form data (file or text)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    return { error: 'An error occurred while processing the document.' };
  }
};
