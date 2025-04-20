import React, { useState, useEffect } from 'react'

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import mapcss from './map.module.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVlcGltaGVyZSIsImEiOiJjbGtpaXBlcjIwYnU4M2RtanhwM3FyOWlrIn0.fOtppmYa8OXrwOPjIDXz7Q';

import LiveLocation from './LiveLocation';

export default function DMap({ mapData }) {
  const kmlData = mapData["kmlData"]
  console.log("mapData", mapData)
  console.log("From DMap, kmlData", kmlData)
  console.log("Inside DMap")
  const [Map, setMap] = useState();
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const stores = mapData.mapData

  /**
  * Assign a unique id to each store. You'll use this `id`
  * later to associate each point on the map with a listing
  * in the sidebar.
  */
  stores.features.forEach((store, i) => {
    store.properties.id = i;
  });



  useEffect(() => {
    setPageIsMounted(true)
    const map = new mapboxgl.Map({
      container: 'map',
      // style: 'mapbox://styles/mapbox/light-v10',
      // style: 'mapbox://styles/mapbox/outdoors-v12',
      // style: 'mapbox://styles/mapbox/satellite-v9',
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      // center: [77.3493083, 28.0700567], 
      center: [80.4163902439177,28.17324532936334],
      // center: [77.33123548328876, 28.06279635607756],
      // https://www.google.com/maps?q=28.06279635607756,77.33123548328876&z=17&t=k&hl=en
      zoom: 16,
      scrollZoom: true
    });

    //  Deepak added this

    // map.on('load', () => {
    //   /* Add the data to your map as a layer */
    //   map.addLayer({
    //     id: 'locations',
    //     type: 'circle',
    //     paint: {
    //       'circle-color': "#888",
    //       'circle-radius':7
    //     },

    //     /* Add a GeoJSON source containing place coordinates and information. */
    //     source: {
    //       type: 'geojson',
    //       data: stores
    //     },
    //     // layout: {
    //     //   // Set the label content to the
    //     //   // feature's `name` property
    //     //   'text-field': ['get', 'city']
    //     //   }
    //   });
    // });



    //  for (const marker of stores.features) {
    //    createPopUp(marker+"_new");
    //  }

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    setMap(map);


  }, []);

  useEffect(() => {
    if (pageIsMounted && stores) {
      Map.on('load', () => {
        Map.addSource('places', {
          'type': 'geojson',
          'data': stores
        });

        buildLocationList(stores);
        addMarkers();

        Map.addSource('kml-data', {
          type: 'geojson',
          data: kmlData,
        });
        // }

        // Create a layer (e.g., polygons)
        Map.addLayer({
          id: 'kml-layer',
          type: 'fill',
          source: 'kml-data',
          paint: {
            'fill-color': '#00FF20', // Customize the fill color
            'fill-opacity': 0.3, // Customize the opacity
          },
        });

      });
    }

  });

 
  /**
   * Add a marker to the map for every store listing.
   **/
  function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    for (const marker of stores.features) {
      /* Create a div element for the marker. */
      const el = document.createElement('div');
      /* Assign a unique `id` to the marker. */
      el.id = `marker-${marker.properties.id}`;
      el.style.cssText = `
      border: "none";
    cursor: pointer;
    height: 36px;
    width: 36px;
    background-image: url('tractor.gif');
    background-repeat: no-repeat;
    background-size: 28px 28px;
    top: -16px;`
      // el.style.border = 'none';
      // el.style.cursor = 'pointer';
      // el.style.height = '56px';
      // el.style.width = '56px';
      // // el.style.backgroundImage = "url('marker.png')";
      // el.style.backgroundImage = "url('tractor.gif')";
      /* Assign the `marker` class to each marker for styling. */
      el.className = 'marker';

      /**
       * Create a marker using the div element
       * defined above and add it to the map.
       **/
      new mapboxgl.Marker(el, { offset: [8, 18] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(Map);

      /**
       * Listen to the element and when it is clicked, do three things:
       * 1. Fly to the point
       * 2. Close all other popups and display popup for clicked store
       * 3. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      el.addEventListener('click', (e) => {
        /* Fly to the point */
        flyToStore(marker);
        /* Close all other popups and display popup for clicked store */
        createPopUp(marker);
        /* Highlight listing in sidebar */
        const activeItem = document.getElementsByClassName('active');
        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        const listing = document.getElementById(
          `listing-${marker.properties.id}`
        );
        listing.classList.add('active');
      });
    }
  }

  /**
   * Add a listing for each store to the sidebar.
   **/
  function buildLocationList(stores) {
    for (const store of stores.features) {
      /* Add a new listing section to the sidebar. */
      const listings = document.getElementById('listings');
      const listing = listings.appendChild(document.createElement('div'));
      /* Assign a unique `id` to the listing. */
      listing.id = `listing-${store.properties.id}`;
      /* Assign the `item` class to each listing for styling. */
      listing.className = 'item';
      listing.style.cssText = ` display: block;
      border-bottom: 1px solid #eee;
      padding: 10px;
      text-decoration: none;
      background-color: #eee;
    border: 1px solid #ccc;`;

      /* Add the link to the individual listing created above. */
      // const fName = listing.appendChild(document.createElement('div'));
      // fName.innerHTML = `${store.properties.name}`;
      // fName.style.cssText = `font-weight: bold;`;
      const link = listing.appendChild(document.createElement('a'));
      link.href = '#map';
      link.className = 'title';
      link.style.cssText = `display: block;
      color: #00853e;
      font-weight: 700;`;
      link.id = `link-${store.properties.id}`;
      link.innerHTML = `${store.properties.name} (view on map)`;

      /* Add details to the individual listing. */
      const details = listing.appendChild(document.createElement('div'));
      details.innerHTML = `
      
      ${store.properties.address}`;
      if (store.properties.phone) {
        details.innerHTML += ` &middot; ${store.properties.phoneFormatted}`;
      }
      details.innerHTML += ` <br>AADHAAR : ${store.properties.aadhaar}`;
      details.innerHTML += ` <br>${store.properties.UDPAcreage} acre(s) UDP done on ${store.properties.date}`;

      /**
       * Listen to the element and when it is clicked, do four things:
       * 1. Update the `currentFeature` to the store associated with the clicked link
       * 2. Fly to the point
       * 3. Close all other popups and display popup for clicked store
       * 4. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      link.addEventListener('click', function () {
        for (const feature of stores.features) {
          if (this.id === `link-${feature.properties.id}`) {
            var element_to_scroll_to = document.getElementById('map')
            element_to_scroll_to.scrollIntoView(true);
            console.log("Flying to Store")
            console.log(window.location.href)
            flyToStore(feature);
            createPopUp(feature);
          }
        }
        const activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');
      });
    }
  }

  /**
   * Use Mapbox GL JS's `flyTo` to move the camera smoothly
   * a given center point.
   **/
  function flyToStore(currentFeature) {
    // window.location.href = "#map";

    Map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 16
    });
  }

  /**
   * Create a Mapbox GL JS `Popup`.
   **/
  function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    // popUps.style.cssText = `transform: translate(-55%, -125%) translate(276px, 250px)`;
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        // `<h3>Sweetgreen</h3><h4>${currentFeature.properties.address}</h4>`
        `
        <style>
        .mapboxgl-popup {
          // padding-bottom: 50px;
          top: -16px;
      }
      
      // .mapboxgl-popup-close-button {
      //     display: none;
      // }
      
      .mapboxgl-popup-content {
          font: 400 15px/22px 'Source Sans Pro', 'Helvetica Neue', sans-serif;
          padding: 0;
          width: 180px;
      }
      
      .mapboxgl-popup-content h3 {
          background: #91c949;
          color: #fff;
          margin: 0;
          padding: 10px;
          border-radius: 3px 3px 0 0;
          font-weight: 700;
          // margin-top: -15px;
      }
      
      .mapboxgl-popup-content h4 {
          margin: 0;
          padding: 10px;
          font-weight: 400;
      }
      
      .mapboxgl-popup-content div {
          padding: 10px;
      }
      
      .mapboxgl-popup-anchor-top>.mapboxgl-popup-content {
          // margin-top: 15px;
      }
      
      .mapboxgl-popup-anchor-top>.mapboxgl-popup-tip {
          border-bottom-color: #91c949;
              // margin-top: -16px;
      }
        </style>
        
        <h3 >${currentFeature.properties.name}</h3 > 
        <h4>
        Aadhaar: ${currentFeature.properties.aadhaar}<br>
        Village: ${currentFeature.properties.address}<br>
        ☎: ${currentFeature.properties.phoneFormatted}<br>
        Paddy Variety: ${currentFeature.properties.paddyVariety}<br>
        UDP Acreage: ${currentFeature.properties.UDPAcreage} acre(s)<br>
        Date: ${currentFeature.properties.date}
        </h4>`
      )
      .addTo(Map);
  }

  return (
    <>
      {/* <div id="map" className="map"></div> */}
      <div id="wrapper" className='wrapper'>
        <div id="map" className={mapcss.map}></div>
        {/* <div id='listings' className='listings'></div> */}
        <div id='listings' className={mapcss.listings}></div>
        {Map && <LiveLocation map={Map} />}
      </div>
    </>

  )
}