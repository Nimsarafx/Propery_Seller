import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { property } = location.state || {};

  if (!property) {
    return (
      <div>
        <p>Property not found</p>
      </div>
    );
  }

  // Ensure images are set to fallback if not available
  const [selectedImage, setSelectedImage] = useState(property.images?.[0] || '/path/to/default-image.jpg');

  return (
    <div className="property-container">
      <div>
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to Search Results 
        </button>
      </div>
     
        {/* Property Details Section */}
        <div>
          <h1>{property.type}</h1>
          <p>£{property.price.toLocaleString()}</p><br />

          <div>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Tenure: {property.tenure}</p>
          </div>

          <div>
            <p>Location: {property.location}</p><br />
          </div>

          <div>
            <h2>Description</h2>
            <p>{property.description}</p><br />
          </div>
          <div className='property-pictures'>
          {property.images && property.images[0] && (
              <div className="property-main-image">
                <img src={property.images[0]} alt={`${property.type} in ${property.location}`} />
              </div>
              )}

            <div className='property-pictures-thumbnails'>
              
            </div>
          </div>

          <div>
            <p>Added: {property.added.day} {property.added.month} {property.added.year}</p>
          </div>
        </div>
      </div>
  
  );
};

export default PropertyDetails;