import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import Form from './Form';
import PropertyList from './PropertyList';
import PropertyDetails from './PropertyDetails';

const MainContent = () => {
  const [favourites, setFavourites] = useState(() => {
    // Get favourites from localStorage if available, or default to an empty array
    const savedFavourites = localStorage.getItem('favourites');
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAddToFavourites = (property) => {
    const isDuplicate = favourites.some((fav) => fav.id === property.id);
    if (!isDuplicate) {
      const updatedFavourites = [...favourites, property];
      setFavourites(updatedFavourites);
      localStorage.setItem('favourites', JSON.stringify(updatedFavourites)); // Save to localStorage
    }
  };

  const handleRemoveFromFavourites = (propertyIds) => {
    const updatedFavourites = favourites.filter(fav => !propertyIds.includes(fav.id));
    setFavourites(updatedFavourites);
    localStorage.setItem('favourites', JSON.stringify(updatedFavourites)); // Save to localStorage
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // Handling drag-and-drop for adding/removing favourites
    if (source.droppableId === "propertyList" && destination.droppableId === "favouritesList") {
      const draggedProperty = filteredProperties[source.index];
      handleAddToFavourites(draggedProperty);
    }

    if (source.droppableId === "favouritesList" && destination.droppableId === "propertyList") {
      const propertyToRemove = favourites[source.index];
      handleRemoveFromFavourites([propertyToRemove.id]);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="max-w-7xl mx-auto p-4">
        <main>
          <Form 
            setFilteredProperties={setFilteredProperties} 
            setHasSearched={setHasSearched}
          />
          {hasSearched && (
            <PropertyList 
              favourites={favourites}
              setProperties={setProperties}
              handleAddToFavourites={handleAddToFavourites}
              handleRemoveFromFavourites={handleRemoveFromFavourites}
              filteredProperties={filteredProperties}
            />
          )}
        </main>
      </div>
    </DragDropContext>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
    </Routes>
  );
};

export default App;