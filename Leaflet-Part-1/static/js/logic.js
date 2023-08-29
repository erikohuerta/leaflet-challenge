// Creating the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 3
  });
  
  // Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Define a markerSize() function that will give each earthquake a different radius based on its magnitude.
function markerSize(magnitude) {
    return (magnitude) * 3;
  }

function colorDepth(depth) {
    let maxDepthvalue = 100; // Adjust as needed
    let scale = d3.scaleLinear()
        .domain([0, maxDepthvalue])
        .range(["#82CD47", "#e78b28", "#b10026"]);
    
    return scale(depth);
}

function createLegend() {
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'legend');
        let depthLabels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"]; // Adjust these as needed

        for (let i = 0; i < depthLabels.length; i++) {
            div.innerHTML +=
            `<div><i style="background:${colorDepth(i * 40)}"></i>${depthLabels[i]}</div>`;
        }
        return div;
    };

    legend.addTo(myMap);
}

d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data

    let feature = data.features
    let earthquake = [];
    let maxDepth = 0;

      // Loop through each feature and access its coordinates and magnitude
    feature.forEach(feature => {
        let magnitude = feature.properties.mag;
        let coordinates = feature.geometry.coordinates;
        let depth = feature.geometry.coordinates[2];
        earthquake.push({magnitude, coordinates});
        if (depth > maxDepth) {
            maxDepth = depth;
        }
        L.circleMarker([coordinates[1], coordinates[0]], {
            color: colorDepth(depth),
            fillColor: colorDepth(depth),
            fillOpacity: 0.5,
            radius: markerSize(magnitude)
        })
        .bindPopup(`Magnitude: ${magnitude}, Depth: ${depth} km`)
        .addTo(myMap); 
    });  
       console.log(earthquake);
       console.log("Maximum Depth:", maxDepth);
       createLegend();
  });