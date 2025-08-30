import React, { useState } from 'react';

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid PDF file.');
      event.target.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (uploadMethod === 'file' && !selectedFile) {
      alert('Please select a PDF file to upload.');
      return;
    }
    
    if (uploadMethod === 'text' && !textInput.trim()) {
      alert('Please enter some text to process.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate backend processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Document submitted successfully! Processing initiated.');
      // Reset form
      setSelectedFile(null);
      setTextInput('');
      document.getElementById('file-input').value = '';
    }, 2000);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="upload-header">
          <h1>Document Upload</h1>
          <p>Submit your document for blockchain certification and verification</p>
        </div>

        <div className="upload-container">
          <div className="upload-method-selector">
            <button 
              className={`method-btn ${uploadMethod === 'file' ? 'active' : ''}`}
              onClick={() => setUploadMethod('file')}
            >
              PDF Upload
            </button>
            <button 
              className={`method-btn ${uploadMethod === 'text' ? 'active' : ''}`}
              onClick={() => setUploadMethod('text')}
            >
              Text Input
            </button>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            {uploadMethod === 'file' ? (
              <div className="upload-section">
                <label htmlFor="file-input" className="upload-label">
                  Select PDF Document
                </label>
                <div className="file-input-wrapper">
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="file-input-display">
                    {selectedFile ? (
                      <div className="file-selected">
                        <span>📄</span>
                        <span>{selectedFile.name}</span>
                        <span className="file-size">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <div className="file-placeholder">
                        <span>📤</span>
                        <span>Click to select PDF file</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="upload-section">
                <label htmlFor="text-input" className="upload-label">
                  Enter Document Text
                </label>
                <textarea
                  id="text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste or type your document content here..."
                  className="text-input"
                  rows="12"
                />
              </div>
            )}

            <button 
              type="submit" 
              className={`submit-btn ${isProcessing ? 'processing' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner">⟳</span>
                  Processing...
                </>
              ) : (
                'Submit for Certification'
              )}
            </button>
          </form>

          <div className="upload-info">
            <h3>Processing Information</h3>
            <ul>
              <li>Documents are automatically analyzed for risk assessment</li>
              <li>Low-risk documents receive expedited processing</li>
              <li>All submissions are encrypted and securely stored</li>
              <li>You'll receive a confirmation once processing begins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;