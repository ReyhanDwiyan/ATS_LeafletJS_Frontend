import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import LocationForm from './components/LocationForm';
import LocationList from './components/LocationList';
import axios from 'axios';
import './App.css';

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [tempMarker, setTempMarker] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleMapClick = (latlng) => {
    setTempMarker({
      latitude: latlng.lat,
      longitude: latlng.lng,
    });
  };

  const handleAddLocation = async (locationData) => {
    try {
      await axios.post('/api/locations', locationData);
      fetchLocations();
      setTempMarker(null);
      alert('Location added successfully!');
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location');
    }
  };

  const handleUpdateLocation = async (id, locationData) => {
    try {
      await axios.put(`/api/locations/${id}`, locationData);
      fetchLocations();
      setEditingLocation(null);
      setTempMarker(null);
      alert('Location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location');
    }
  };

  const handleDeleteLocation = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await axios.delete(`/api/locations/${id}`);
        fetchLocations();
        alert('Location deleted successfully!');
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('Failed to delete location');
      }
    }
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setTempMarker(null);
  };

  const handleCancelEdit = () => {
    setEditingLocation(null);
    setTempMarker(null);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="sidebar">
          <LocationForm 
            onAddLocation={handleAddLocation}
            onUpdateLocation={handleUpdateLocation}
            editingLocation={editingLocation}
            onCancelEdit={handleCancelEdit}
            tempMarker={tempMarker}
          />
          <LocationList 
            locations={locations} 
            onDeleteLocation={handleDeleteLocation}
            onSelectLocation={setSelectedLocation}
            onEditLocation={handleEditLocation}
          />
        </div>
        <div className="map-container">
          <MapComponent 
            locations={locations} 
            selectedLocation={selectedLocation}
            onMapClick={handleMapClick}
            tempMarker={tempMarker}
          />
        </div>
      </div>
    </div>
  );
}

export default App;