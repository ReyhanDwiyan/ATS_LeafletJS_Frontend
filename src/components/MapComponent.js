import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapComponent.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapUpdater({ selectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.latitude, selectedLocation.longitude], 13);
    }
  }, [selectedLocation, map]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function MapComponent({ locations, selectedLocation, onMapClick, tempMarker }) {
  const defaultCenter = [-6.2088, 106.8456]; // Jakarta, Indonesia
  const defaultZoom = 10;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Temporary marker for clicked location */}
      {tempMarker && (
        <Marker position={[tempMarker.latitude, tempMarker.longitude]}>
          <Popup>
            <div>
              <h3>📍 New Location</h3>
              <p>Lat: {tempMarker.latitude.toFixed(6)}</p>
              <p>Lng: {tempMarker.longitude.toFixed(6)}</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Existing locations */}
      {Array.isArray(locations) && locations.map((location) => (
        <Marker
          key={location._id}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <div>
              <h3>{location.name}</h3>
              <p>{location.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapUpdater selectedLocation={selectedLocation} />
      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}

export default MapComponent;