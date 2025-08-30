import React, { useState, useEffect } from 'react';

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [result, setResult] = useState(null);
  const [producerInfo, setProducerInfo] = useState(null);
  const [documentType, setDocumentType] = useState('production_report');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Get producer info from localStorage
    const producerData = localStorage.getItem('producerData');
    if (producerData) {
      setProducerInfo(JSON.parse(producerData));
    }
  }, []);

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

    if (!producerInfo) {
      alert('Please register as a producer first before uploading documents. You will be redirected to the registration page.');
      // Redirect to registration page
      window.location.href = '/introduction';
      return;
    }

    if (uploadMethod === 'file' && !selectedFile) {
      alert('Please select a PDF file to upload.');
      return;
    }

    if (uploadMethod === 'text' && !textInput.trim()) {
      alert('Please enter some text to process.');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      
      // Add document file or text
      if (uploadMethod === 'file') {
        formData.append('document', selectedFile);
      } else {
        // Create a text file from input
        const textBlob = new Blob([textInput], { type: 'text/plain' });
        const textFile = new File([textBlob], 'document.txt', { type: 'text/plain' });
        formData.append('document', textFile);
      }

      // Add metadata
      formData.append('producerName', producerInfo.fullName);
      formData.append('producerWallet', producerInfo.walletAddress);
      formData.append('documentType', documentType);
      formData.append('description', description);

      // Send to our backend API
      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Document uploaded successfully! ID: ${data.id}`);
        setResult({ success: true, message: data.message, fileName: data.fileName });
        
        // Reset form
        setSelectedFile(null);
        setTextInput('');
        setDescription('');
        document.getElementById('file-input').value = '';
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="upload-header">
          <h1>Document Upload</h1>
          <p>Submit your document for blockchain certification and verification</p>
          
          {producerInfo && (
            <div className="producer-info">
              <h3>Producer Information</h3>
              <div className="producer-details">
                <p><strong>Name:</strong> {producerInfo.fullName}</p>
                <p><strong>Wallet:</strong> <span className="wallet-address">{producerInfo.walletAddress}</span></p>
                <p><strong>Plant Capacity:</strong> {producerInfo.plantCapacity} kg/day</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('producerData');
                  setProducerInfo(null);
                }}
                className="clear-producer-btn"
              >
                Clear Producer Data
              </button>
            </div>
          )}
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

          {/* Document Type and Description */}
          <div className="form-group">
            <label htmlFor="documentType">Document Type</label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="form-select"
              required
            >
              <option value="production_report">Production Report</option>
              <option value="compliance_document">Compliance Document</option>
              <option value="financial_statement">Financial Statement</option>
              <option value="technical_specification">Technical Specification</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the document"
              className="form-textarea"
              rows="3"
            />
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

          {result && (
            <div className="result-display">
              <h3>Result:</h3>
              <p>{result}</p>
            </div>
          )}

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
