import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from '!mapbox-gl';
import mapcss from './map.module.css';
import LiveLocation from './LiveLocation';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVlcGltaGVyZSIsImEiOiJjbGtpaXBlcjIwYnU4M2RtanhwM3FyOWlrIn0.fOtppmYa8OXrwOPjIDXz7Q';

export default function DMap({ mapData }) {
  const kmlData = mapData["kmlData"];
  const [Map, setMap] = useState();
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const stores = mapData.mapData;
  const [isAnimating, setIsAnimating] = useState(false); // Animation disabled on load
  const animationTimeoutIds = useRef([]);

  const [listingsReady, setListingsReady] = useState(false);

  stores.features.forEach((store, i) => {
    store.properties.id = i;
  });

  useEffect(() => {
    setPageIsMounted(true);
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [77.47647425159812, 27.956807148389082],
      zoom: 16,
      scrollZoom: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    setMap(map);
  }, []);

  useEffect(() => {
    if (pageIsMounted && stores && Map) {
      Map.on('load', () => {
        Map.addSource('places', {
          type: 'geojson',
          data: stores,
        });

        buildLocationList(stores);
        addMarkers();

        Map.addSource('kml-data', {
          type: 'geojson',
          data: kmlData,
        });

        Map.addLayer({
          id: 'kml-layer-fill',
          type: 'fill',
          source: 'kml-data',
          paint: {
            'fill-color': '#00FF20',
            'fill-opacity': 0.3,
          },
        });

        Map.addLayer({
          id: 'kml-layer-outline',
          type: 'line',
          source: 'kml-data',
          paint: {
            'line-color': '#006400',
            'line-width': 1.5,
          },
        });

        setListingsReady(true);
      });
    }
  }, [pageIsMounted, stores, Map]);

  useEffect(() => {
    if (!Map || !listingsReady) return;

    if (isAnimating) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isAnimating, Map, listingsReady]);

  const startAnimation = () => {
    stopAnimation(); // Clear any existing timeouts
    stores.features.forEach((feature, index) => {
      const timeoutId = setTimeout(() => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
          const rect = mapContainer.getBoundingClientRect();
          const mapIsInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
          flyToStore(feature, mapIsInViewport);
        } else {
          flyToStore(feature, false);
        }

        createPopUp(feature);
        highlightListing(feature.properties.id);
      }, index * 3000); // 3-second delay
      animationTimeoutIds.current.push(timeoutId);
    });
  };

  const highlightListing = (id) => {
    const activeItem = document.getElementsByClassName(mapcss.active);
    if (activeItem[0]) {
      activeItem[0].classList.remove(mapcss.active);
    }
    const listing = document.getElementById(`listing-${id}`);
    if (listing) {
      listing.classList.add(mapcss.active);

      const listingsContainer = document.getElementById('listings');
      if (listingsContainer) {
        const rect = listingsContainer.getBoundingClientRect();
        const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (isInViewport) {
          listing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  };

  const stopAnimation = () => {
    animationTimeoutIds.current.forEach(clearTimeout);
    animationTimeoutIds.current = [];
  };

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  function addMarkers() {
    for (const marker of stores.features) {
      const el = document.createElement('div');
      el.id = `marker-${marker.properties.id}`;
      el.style.cssText = `
        border: none;
        cursor: pointer;
        height: 36px;
        width: 36px;
        background-image: url('tractor.gif');
        background-repeat: no-repeat;
        background-size: 28px 28px;
        top: -16px;`;
      el.className = mapcss.marker;

      new mapboxgl.Marker(el, { offset: [8, 18] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(Map);

      el.addEventListener('click', (e) => {
        flyToStore(marker, true); // Always fly on click
        createPopUp(marker);
        const activeItem = document.getElementsByClassName(mapcss.active);
        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove(mapcss.active);
        }
        const listing = document.getElementById(`listing-${marker.properties.id}`);
        listing.classList.add(mapcss.active);
      });
    }
  }

  function buildLocationList(stores) {
    for (const store of stores.features) {
      const listings = document.getElementById('listings');
      const listing = listings.appendChild(document.createElement('div'));
      listing.id = `listing-${store.properties.id}`;
      listing.className = mapcss.item;

      const link = listing.appendChild(document.createElement('a'));
      link.href = '#map';
      link.className = mapcss.title;
      link.id = `link-${store.properties.id}`;
      link.innerHTML = `${store.properties.name} (view on map)`;

      const details = listing.appendChild(document.createElement('div'));
      details.innerHTML = `Village : ${store.properties.address}`;
      details.innerHTML += ` <br>AADHAAR : ${store.properties.aadhaar}`;
      details.innerHTML += ` <br>${store.properties.UDPAcreage} acre(s) UDP done on ${store.properties.date}`;

      link.addEventListener('click', function () {
        for (const feature of stores.features) {
          if (this.id === `link-${feature.properties.id}`) {
            document.getElementById('map').scrollIntoView(true);
            flyToStore(feature, true); // Always fly on click
            createPopUp(feature);
          }
        }
        const activeItem = document.getElementsByClassName(mapcss.active);
        if (activeItem[0]) {
          activeItem[0].classList.remove(mapcss.active);
        }
        this.parentNode.classList.add(mapcss.active);
      });
    }
  }

  function flyToStore(currentFeature, animate) {
    if (animate) {
      Map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 16,
      });
    } else {
      Map.setCenter(currentFeature.geometry.coordinates);
    }
  }

  function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<style>
          .mapboxgl-popup-content { font: 400 15px/22px 'Source Sans Pro', 'Helvetica Neue', sans-serif; padding: 0; width: 180px; }
          .mapboxgl-popup-content h3 { background: #91c949; color: #fff; margin: 0; padding: 10px; border-radius: 3px 3px 0 0; font-weight: 700; }
          .mapboxgl-popup-content h4 { margin: 0; padding: 10px; font-weight: 400; }
          .mapboxgl-popup-anchor-top > .mapboxgl-popup-tip { border-bottom-color: #91c949; }
        </style>
        <h3>${currentFeature.properties.name}</h3>
        <h4>
          Aadhaar: ${currentFeature.properties.aadhaar}<br>
          Village: ${currentFeature.properties.address}<br>
          Paddy Variety: ${currentFeature.properties.paddyVariety}<br>
          UDP Acreage: ${currentFeature.properties.UDPAcreage} acre(s)<br>
          Date: ${currentFeature.properties.date}
        </h4>`
      )
      .addTo(Map);
  }

  return (
    <>
      <div id="wrapper" className="wrapper" style={{ position: 'relative' }}>
        <Button
          variant="contained"
          onClick={toggleAnimation}
          style={{
            position: 'absolute',
            top: '5px',
            left: '5%',
            // transform: 'translateX(100%)',
            zIndex: 1,
          }}
          startIcon={isAnimating ? <StopIcon /> : <PlayArrowIcon />}
        >
          {isAnimating ? 'Stop Tour' : 'Start Tour'}
        </Button>
        <div id="map" className={mapcss.map}></div>
        <div id="listings" className={mapcss.listings}></div>
        {Map && <LiveLocation map={Map} />}
      </div>
    </>
  );
}
