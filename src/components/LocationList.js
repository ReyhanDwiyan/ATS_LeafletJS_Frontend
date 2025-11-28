import React from 'react';
import './LocationList.css';

function LocationList({ locations, onDeleteLocation, onSelectLocation, onEditLocation }) {
  return (
    <div className="location-list">
      <h2>Saved Locations ({locations.length})</h2>
      {Array.isArray(locations) && locations.length > 0 ? (
        locations.map((location) => (
          <li key={location._id} className="location-item">
            <div
              className="location-info"
              onClick={() => onSelectLocation(location)}
            >
              <h3>{location.name}</h3>
              <p>{location.description || 'No description'}</p>
              <span className="coordinates">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </span>
            </div>
            <div className="action-buttons">
              <button
                className="btn-edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditLocation(location);
                }}
              >
                ✏️ Edit
              </button>
              <button
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLocation(location._id);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))
      ) : (
        <p>No locations available</p>
      )}
    </div>
  );
}

export default LocationList;