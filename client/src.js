// Backend example data
//Db query
const sipulated = [
  [106.706576, 10.782429],
  [106.707703, 10.780663],
  [106.706104, 10.78197],
  [106.707295, 10.780953],
  [106.707059, 10.781227],
  [106.706962, 10.781037],
  [106.705986, 10.782329],
  [106.706142, 10.782682],
  [106.706952, 10.782176],
];

const nonSipulate = [
  [106.706142, 10.782682],
  [106.707499, 10.780879],
  [106.708175, 10.781412],
  [106.707332, 10.781659],
  [106.707123, 10.781849],
];

const reported = [
  [106.70656, 10.780827],
  [106.706345, 10.779868],
  [106.706018, 10.780832],
];

//Backend execution
let sipulatedGeoJSON = {
  type: "FeatureCollection",
  features: [],
};
sipulated.forEach((data) => {
  const feature = {
    type: "Feature",
    properties: {
      id: data[0],
      type: "Trụ, cụm pano",
      location:
        "Đồng Khởi - Nguyễn Du (Sở Văn hoá và Thể thao), Phường Bến Nghé, Quận 1",
      size: "2.5m x 10m",
      qty: "1 trụ/bảng",
      type: "Cổ động chính trị",
      categorized: "Công viên",
    },
    geometry: {
      coordinates: data,
      type: "Point",
    },
  };
  sipulatedGeoJSON.features.push(feature);
});

let nonSipulatedGeoJSON = {
  type: "FeatureCollection",
  features: [],
};
nonSipulate.forEach((data) => {
  const feature = {
    type: "Feature",
    properties: {
      id: data[0],
      type: "Trụ, cụm pano",
      location:
        "Đồng Khởi - Nguyễn Du (Sở Văn hoá và Thể thao), Phường Bến Nghé, Quận 1",
      size: "2.5m x 10m",
      qty: "1 trụ/bảng",
      type: "Cổ động chính trị",
      categorized: "Công viên",
    },
    geometry: {
      coordinates: data,
      type: "Point",
    },
  };
  nonSipulatedGeoJSON.features.push(feature);
});

let reportedGeoJSON = {
  type: "FeatureCollection",
  features: [],
};
reported.forEach((data) => {
  const feature = {
    type: "Feature",
    properties: {
      id: data[0],
      type: "Trụ, cụm pano",
      location:
        "Đồng Khởi - Nguyễn Du (Sở Văn hoá và Thể thao), Phường Bến Nghé, Quận 1",
      size: "2.5m x 10m",
      qty: "1 trụ/bảng",
      type: "Cổ động chính trị",
      categorized: "Công viên",
    },
    geometry: {
      coordinates: data,
      type: "Point",
    },
  };
  reportedGeoJSON.features.push(feature);
});
//Variable definition
const sipulatedColor = "#40eb34";
const nonSipulatedColor = "#d3eb34";
const reportedColor = "#eb3434";
const unclusteredRadius = 12;
// Mapbox generation
mapboxgl.accessToken =
  "pk.eyJ1IjoicGpsZW9uYXJkMzciLCJhIjoic2YyV2luUSJ9.lPoix24JhyR8sljAwjHg9A";

const map = new mapboxgl.Map({
  container: "mapbox", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [106.707748, 10.780571], // starting position [lng, lat]
  zoom: 17, // starting zoom
});

// Map navigation control
map.addControl(new mapboxgl.NavigationControl());
//Locate user control
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
  })
);

//Layer generation
map.on("load", () => {
  // Sipulated source data
  map.addSource("sipulated", {
    type: "geojson",
    data: sipulatedGeoJSON,
    cluster: true,
    clusterMaxZoom: 15,
    clusterRadius: 20,
  });
  //Sipulated cluster
  map.addLayer({
    id: "sipulated-cluster",
    type: "circle",
    source: "sipulated",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": sipulatedColor,
      "circle-radius": ["step", ["get", "point_count"], 30, 4, 60, 8, 90],
    },
    layout: { visibility: "visible" },
  });
  //Sipulated count
  map.addLayer({
    id: "sipulated-count",
    type: "symbol",
    source: "sipulated",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
      visibility: "visible",
    },
  });
  //Sipulated uncluster
  map.addLayer({
    id: "sipulated-unclustered",
    type: "circle",
    source: "sipulated",
    filter: ["!", ["has", "point_count"]],
    layout: { visibility: "visible" },
    paint: {
      "circle-color": sipulatedColor,
      "circle-radius": unclusteredRadius,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });
  //Sipulated label
  map.addLayer({
    id: "sipulated-label",
    type: "symbol",
    source: "sipulated",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "text-field": "QC",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
      visibility: "visible",
    },
    paint: {
      "text-color": "#f2f7f4",
    },
  });
  //Inspect a cluster on click
  map.on("click", "sipulated-cluster", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["sipulated-cluster"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("sipulated")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  //Non sipulated section
  map.addSource("non-sipulated", {
    type: "geojson",
    data: nonSipulatedGeoJSON,
    cluster: true,
    clusterMaxZoom: 15,
    clusterRadius: 15,
  });
  //Non sipulated cluster
  map.addLayer({
    id: "nonSipulated-cluster",
    type: "circle",
    source: "non-sipulated",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": nonSipulatedColor,
      "circle-radius": ["step", ["get", "point_count"], 25, 4, 50, 8, 75],
    },
    layout: { visibility: "visible" },
  });
  //Non sipulated count
  map.addLayer({
    id: "nonSipulated-count",
    type: "symbol",
    source: "non-sipulated",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
      visibility: "visible",
    },
  });
  //Non sipulated uncluster
  map.addLayer({
    id: "nonSipulated-unclustered",
    type: "circle",
    source: "non-sipulated",
    filter: ["!", ["has", "point_count"]],
    layout: { visibility: "visible" },
    paint: {
      "circle-color": nonSipulatedColor,
      "circle-radius": unclusteredRadius,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });
  //Non sipulated label
  map.addLayer({
    id: "nonSipulated-label",
    type: "symbol",
    source: "non-sipulated",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "text-field": "QC",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
      visibility: "visible",
    },
    paint: {
      "text-color": "#f2f7f4",
    },
  });
  //Inspect a cluster on click
  map.on("click", "nonSipulated-cluster", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["nonSipulated-cluster"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("non-sipulated")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  //Reported section
  map.addSource("reported", {
    type: "geojson",
    data: reportedGeoJSON,
    cluster: true,
    clusterMaxZoom: 15,
    clusterRadius: 15,
  });
  //Reported cluster
  map.addLayer({
    id: "reported-cluster",
    type: "circle",
    source: "reported",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": reportedColor,
      "circle-radius": ["step", ["get", "point_count"], 15, 4, 30, 8, 45],
    },
    layout: { visibility: "visible" },
  });
  //Reported count
  map.addLayer({
    id: "reported-count",
    type: "symbol",
    source: "reported",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
      visibility: "visible",
    },
  });
  //Reported uncluster
  map.addLayer({
    id: "reported-unclustered",
    type: "circle",
    source: "reported",
    filter: ["!", ["has", "point_count"]],
    layout: { visibility: "visible" },
    paint: {
      "circle-color": reportedColor,
      "circle-radius": unclusteredRadius,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });
  //Reported label
  map.addLayer({
    id: "reported-label",
    type: "symbol",
    source: "reported",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "text-field": "QC",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
      visibility: "visible",
    },
    paint: {
      "text-color": "#f2f7f4",
    },
  });
   //Inspect a cluster on click
   map.on("click", "reported-cluster", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["reported-cluster"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("reported")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

});
