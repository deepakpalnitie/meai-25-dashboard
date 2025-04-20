import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const LiveLocation = ({ map }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [userMarker, setUserMarker] = useState(null);

  useEffect(() => {
    if (!map) return;

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });

    map.addControl(geolocate);

    geolocate.on('geolocate', (e) => {
      const lon = e.coords.longitude;
      const lat = e.coords.latitude;
      setUserLocation([lon, lat]);
    });

    return () => {
      map.removeControl(geolocate);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !userLocation) return;

    // Remove the old marker if it exists
    if (userMarker) {
      userMarker.remove();
    }

    const el = document.createElement('div');
    el.className = 'user-marker';
    el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
    el.style.width = '16px';
    el.style.height = '16px';
    el.style.backgroundSize = '100%';

    const newMarker = new mapboxgl.Marker(el)
      .setLngLat(userLocation)
      .addTo(map);

    // Save the new marker to state
    setUserMarker(newMarker);

  }, [map, userLocation]);

  return null;
};

export default LiveLocation;
