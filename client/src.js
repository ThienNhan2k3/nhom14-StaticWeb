// Mapbox generation
mapboxgl.accessToken = "pk.eyJ1IjoicGpsZW9uYXJkMzciLCJhIjoic2YyV2luUSJ9.lPoix24JhyR8sljAwjHg9A";

const map = new mapboxgl.Map({
    container: 'mapbox', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [106.723769, 10.797738], // starting position [lng, lat]
    zoom: 15, // starting zoom
});

// Map navigation control
map.addControl(new mapboxgl.NavigationControl())
//Locate user control
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    })
);