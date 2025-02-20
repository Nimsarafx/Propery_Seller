import React, { useState, useEffect } from "react"

// Form component for filtering properties
const Form = ({ setFilteredProperties, setHasSearched }) => {
  // State variables to store the input values for the form fields
  const [propertyData, setPropertyData] = useState([]) 
  const [propertyType, setPropertyType] = useState("Any") 
  const [minPrice, setMinPrice] = useState("") 
  const [maxPrice, setMaxPrice] = useState("") 
  const [minBedrooms, setMinBedrooms] = useState("") 
  const [maxBedrooms, setMaxBedrooms] = useState("") 
  const [dateAdded, setDateAdded] = useState("") 
  const [postcode, setPostcode] = useState("") 

  // Fetch property data from the local JSON file on component mount
  useEffect(() => {
    fetch(" ./properties.json")
      .then((response ) => response.json()) 
      .then((data ) => setPropertyData(data.properties)) 
      .catch((error)  => console.error ("Error fetching property data: ", error)) // Handle any fetch errors
  }, []) // Empty dependency array ensures this effect runs only once

  // Handle form submission and filter properties based on the form inputs
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent the default form submission behavior

    // Filter the properties based on the criteria
    const filtered = propertyData.filter((property) => {
     
      const priceMatch =
        (!minPrice || property.price >= Number(minPrice)) && 
        (!maxPrice || property.price <= Number(maxPrice)) 
     
      const bedroomsMatch =
        (!minBedrooms || property.bedrooms >= Number(minBedrooms)) && 
        (!maxBedrooms || property.bedrooms <= Number(maxBedrooms)) 

      // Property type filtering logic
      const typeMatch =
        propertyType === "Any" || property.type === propertyType 

      // Postcode filtering logic
      const postcodeMatch =
        !postcode ||property.location.startsWith(postcode.toUpperCase()) 

      // Date added filtering logic
      const dateAddedMatch =
        !dateAdded || new Date(
          property.added.year, 
          new Date( `${property .added.month} 1`).getMonth(), // Month of property added (parse to month number)
          property.added.day // Day of property added
        ) >= new Date(dateAdded) // Compare the property added date with the selected date

      // Return true if all conditions are met, else false
      return (
        priceMatch &&
        bedroomsMatch &&
        typeMatch &&
        postcodeMatch &&
        dateAddedMatch
      )
    })

    // Set the filtered properties to the parent component's state
    setFilteredProperties(filtered)
    setHasSearched(true) // Mark that a search has been performed
  }

  return (
    <div className ="formdetails">
      <div className="form-header">
        <h1>Find Your Dream Property </h1> {/* Form header */}
      </div>
      <form onSubmit={handleSubmit}> {/* Form submission handler */}
        <div>
          <label>Property Type:</label>
          <select
            value={propertyType} // Current selected property type
            onChange={(e) => setPropertyType(e.target.value)} // Update the property type on change
          >
            <option value="Any">Any</option>
            <option value="House">House</option>
            <option value="Flat">Flat</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>
        <div>
          <label>Min Price : </label>
          <input
            type="number" // Number input for min price
            value={minPrice} // Current value of min price
            onChange={(e) => setMinPrice(e.target.value)} // Update the min price on change
            placeholder="Min Price"
          />
        </div>
        <div>
          <label>Max Price : </label>
          <input
            type="number" // Number input for max price
            value={maxPrice} // Current value of max price
            onChange={(e) => setMaxPrice(e.target.value)} // Update the max price on change
            placeholder="Max Price"
          />
        </div>
        <div>
          <label>Min Bedrooms : </label>
          <input
            type="number" // Number input for min bedrooms
            value={minBedrooms} 
            onChange={(e) => setMinBedrooms(e.target.value)} // Update the min bedrooms on change
            placeholder="Min Bedrooms"
          />
        </div>
        <div>
          <label>Max Bedrooms : </label>
          <input
            type="number" // Number input for max bedrooms
            value={maxBedrooms} 
            onChange={(e) => setMaxBedrooms(e.target.value)} // Update the max bedrooms on change
            placeholder="Max Bedrooms"
          />
        </div>
        <div>
          <label>Date Added:</label>
          <input
            type="date" // Date input for selecting the date
            value={dateAdded} 
            onChange={(e) => setDateAdded(e.target.value)} // Update the date added on change
          />
        </div>
        <div>
          <label>Postcode Area : </label>
          <input
            type="text" // Text input for postcode area
            value={postcode} 
            onChange={(e) => setPostcode(e.target.value)} // Update the postcode on change
            placeholder="Postcode Area (e.g., BR1)"
          />
        </div>
        <div>
          <button type="submit">Search</button> {/* Submit button for the form */}
        </div>
      </form>
    </div>
  )
}

export default Form