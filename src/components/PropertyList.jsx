import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from 'prop-types';

const PropertyList = ({
  favourites,
  handleAddToFavourites,
  handleRemoveFromFavourites,
  setProperties,
  filteredProperties,
}) => {
  const navigate = useNavigate();

  // Update properties whenever filteredProperties changes
  useEffect(() => {
    setProperties (filteredProperties);
  }, [ filteredProperties,setProperties]);

  // Check if the property is already in favourites
  const isPropertyFavorited = (property) => {
    return favourites.some((fav) => fav.id === property.id);
  };

  // Handle click on heart icon to add/remove from favourites
  const handleHeartClick  = (e, property) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if ( isPropertyFavorited(property)) {
      handleRemoveFromFavourites([property.id]);
    } else {
      handleAddToFavourites (property);
    }
  };

  // Navigate to the property details page when a property is clicked
  const handlePropertyClick = (property) => {
    navigate(`/property/${property.id}`, { state: { property } });
  };

  // Handle the "Remove All Favorites" button click
  const handleRemoveAllFavourites = (e) => {
    e.preventDefault();
    if (favourites.length > 0) {
      const allFavouriteIds = favourites.map(fav => fav.id);
      handleRemoveFromFavourites(allFavouriteIds);
    }
  };

  return (
    <div className=" property-container ">
      <div className="property-list">
        {/* Display number of available properties */}
        <h3> Available Properties: {filteredProperties.length}</h3>
        
        {/* Droppable area for the property list */}
        <Droppable droppableId="propertyList">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="property-list-ul"
            >
              {/* Iterate over each property and make it draggable */}
              {filteredProperties.map((property, index) => (
                <Draggable
                  key={property.id}
                  draggableId={property.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`property-item ${snapshot.isDragging ? "dragging" : ""}`}
                      style={provided.draggableProps.style}
                    >
                      {/* Property content with image and details */}
                      <div className="property-content cursor-pointer">
                        {property.images && property.images[0] && (
                          <div className="property-image">
                            <img
                              src={property.images[0]}
                              alt={`${property.type} in ${property.location}`}
                            />
                          </div>
                        )}

                        <div className="property-details">
                          <h4>
                            { property.type } - £{ property.price.toLocaleString() }
                          </h4>
                          <p>Bedrooms: { property.bedrooms }</p>
                          <p>Location: { property.location }</p>
                          <p>
                            Added on: { property.added.day } {property.added.month} {property.added.year}
                          </p>
                          {/* Button to view property details */}
                          <button
                            className="view-details-button"
                            onClick={(e) => {e.stopPropagation(); handlePropertyClick(property);
                            }}
                          >
                            View Details
                          </button>
                        </div>

                        {/* Heart button for adding/removing from favourites */}
                        <button
                          onClick={(e) => handleHeartClick(e, property)}
                          className="favorite-button"
                          title={
                            isPropertyFavorited(property)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <Heart size={24}fill={isPropertyFavorited(property) ? "#ff4444" : "none"}color={isPropertyFavorited(property) ? "#ff4444" : "#666"}
                          />
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>

      {/* Favourites panel */}
      <div className="favorites-panel">
        <h3>Favorites</h3>
        
        {/* Button to remove all favorites */}
        <button
          onClick={handleRemoveAllFavourites}
          className="remove-all-button"
          disabled={favourites.length === 0}
        >
          Remove All Favorites
        </button>
        
        {/* Droppable area for favourites */}
        <Droppable droppableId="favouritesList">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`favorites-container ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
            >
              {/* If there are favourites, display them */}
              {favourites.length > 0 ? (
                favourites.map((property, index) => (
                  <Draggable key={property.id}draggableId={`fav-${property.id}`}index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided. draggableProps}
                        {...provided. dragHandleProps}
                        className={`favorite-item ${snapshot.isDragging ? "dragging" : ""}`}
                        style={provided. draggableProps.style}
                        onClick={() => handlePropertyClick(property)}
                      >
                        <div className="favorite-content">
                          {property .images && property.images[0] && (
                            <div className="favorite-image">
                              <img
                                src={ property.images[0]}
                                alt={`${property.type} in ${property.location}`}
                              />
                            </div>
                          )}
                          <div className="favorite-details">
                            <h4>{property.type}</h4>
                            <p>£{property.price.toLocaleString()}</p>
                            <p>{property.location}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p className="empty-favorites">
                  Drag properties here to add to favorites
                </p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

PropertyList.propTypes = {
  favourites: PropTypes.array.isRequired, // Array of favourite properties
  handleAddToFavourites: PropTypes.func.isRequired, // Function to add a property to favourites
  handleRemoveFromFavourites: PropTypes.func.isRequired, // Function to remove a property from favourites
  setProperties: PropTypes.func.isRequired, // Function to set properties
  filteredProperties: PropTypes.array.isRequired, // Array of filtered properties to display
};

export default PropertyList;