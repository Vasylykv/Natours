/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZnlnZXRvaWQiLCJhIjoiY2tudmx3dTZxMG83YjJ2cHNrNTQ0YmtpMCJ9.82XoNyInjEJ5wO6_BClVnA';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/fygetoid/cknvmi22z0ams17t2818dzi1f',
    scrollZoom: false,
    doubleClickZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
      closeOnClick: false,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });

  map.doubleClickZoom.disable();
};
