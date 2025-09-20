import React, { useState } from 'react';
import './PostItemPage.css';

const PostItemPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: 'excellent',
    availability: 'available-now',
    location: '',
    category: ''
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      setUploadedImage("Uploaded: " + e.dataTransfer.files[0].name);
    }
  };

  // AI-generated preview data (mock)
  const aiPreview = {
    suggestedTitle: formData.description ? "Arduino Development Kit" : "",
    suggestedTags: formData.description ? ["Electronics", "Arduino", "Microcontroller", "Beginner-Friendly"] : [],
    suggestedLoanTerms: formData.description ? "2-week loan period, perfect for short projects" : "",
    compatibilityNote: formData.description ? "Great for beginners learning embedded systems and electronics fundamentals" : ""
  };

  return (
    <div className="post-item-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <button className="back-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to Home
            </button>
            <h1 className="logo">SpareSwap</h1>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="post-layout">
            <div className="form-section">
              <h2>List Your Item</h2>
              
              <form className="post-form">
                <div className="form-group">
                  <label htmlFor="image-upload">Photos</label>
                  <div 
                    className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="upload-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      <p>Drag photos here or <span className="upload-link">choose files</span></p>
                      <p className="upload-hint">PNG, JPG up to 10MB</p>
                      {uploadedImage && <p className="uploaded-file">{uploadedImage}</p>}
                    </div>
                    <input 
                      type="file" 
                      id="image-upload" 
                      accept="image/*" 
                      multiple 
                      className="file-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="title">Item Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="What are you sharing?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your item, its condition, and any special notes..."
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="condition">Condition</label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                    >
                      <option value="new">New</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                    >
                      <option value="available-now">Available Now</option>
                      <option value="available-soon">Available Soon</option>
                      <option value="by-appointment">By Appointment</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Pickup Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Electrical Engineering Building, Room 101"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="mechanical">Mechanical Parts</option>
                    <option value="tools">Tools</option>
                    <option value="materials">Raw Materials</option>
                    <option value="components">Components</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary submit-btn">
                  Post Item
                </button>
              </form>
            </div>

            <div className="preview-section">
              <h3>AI Preview</h3>
              
              <div className="preview-card">
                <div className="preview-image">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                
                <div className="preview-content">
                  <h4>{aiPreview.suggestedTitle || formData.title || "Your Item Title"}</h4>
                  
                  {aiPreview.suggestedTags.length > 0 && (
                    <div className="preview-tags">
                      {aiPreview.suggestedTags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <p className="preview-description">
                    {formData.description || "Your item description will appear here..."}
                  </p>
                  
                  {aiPreview.compatibilityNote && (
                    <div className="ai-suggestion">
                      <div className="ai-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <p>{aiPreview.compatibilityNote}</p>
                    </div>
                  )}
                  
                  {aiPreview.suggestedLoanTerms && (
                    <div className="loan-terms">
                      <strong>Suggested Loan Terms:</strong>
                      <p>{aiPreview.suggestedLoanTerms}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostItemPage;