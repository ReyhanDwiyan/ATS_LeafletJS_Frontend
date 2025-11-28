import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import LocationForm from './components/LocationForm';
import LocationList from './components/LocationList';
import axios from 'axios';
import './App.css';

// Tambahkan base URL untuk API
const API_BASE_URL = 'https://backend-eight-kappa-66.vercel.app/api/locations';

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [tempMarker, setTempMarker] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      if (Array.isArray(response.data)) {
        setLocations(response.data);
      } else {
        console.error('Response is not an array:', response.data);
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
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
      await axios.post(API_BASE_URL, locationData);
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
      await axios.put(`${API_BASE_URL}/${id}`, locationData);
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
        await axios.delete(`${API_BASE_URL}/${id}`);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? '✕' : '☰'}
      </button>
      <div className="container">
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
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