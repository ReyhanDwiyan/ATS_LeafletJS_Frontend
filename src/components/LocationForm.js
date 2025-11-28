import React, { useState, useEffect } from 'react';
import './LocationForm.css';

function LocationForm({ onAddLocation, onUpdateLocation, editingLocation, onCancelEdit, tempMarker }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (editingLocation) {
      setFormData({
        name: editingLocation.name,
        description: editingLocation.description,
        latitude: editingLocation.latitude.toString(),
        longitude: editingLocation.longitude.toString(),
      });
    }
  }, [editingLocation]);

  useEffect(() => {
    if (tempMarker) {
      setFormData(prev => ({
        ...prev,
        latitude: tempMarker.latitude.toFixed(6),
        longitude: tempMarker.longitude.toFixed(6),
      }));
    }
  }, [tempMarker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const locationData = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    if (editingLocation) {
      onUpdateLocation(editingLocation._id, locationData);
    } else {
      onAddLocation(locationData);
    }

    resetForm();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      latitude: '',
      longitude: '',
    });
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <div className="location-form">
      <h2>{editingLocation ? '✏️ Edit Location' : 'Add New Location'}</h2>
      <p className="form-hint">Click on the map to set coordinates</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter location name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description (optional)"
            rows="3"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Latitude:</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Click map"
              required
            />
          </div>
          <div className="form-group">
            <label>Longitude:</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Click map"
              required
            />
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            {editingLocation ? '💾 Update Location' : 'Add Location'}
          </button>
          {editingLocation && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              ❌ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default LocationForm;