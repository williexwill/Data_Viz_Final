/* CONSTANTS AND GLOBALS */
const width3 = window.innerWidth * 0.7,
  height3 = window.innerHeight * 0.7,
  margin3 = { top: 20, bottom: 60, left: 60, right: 40 }
 
let svg1;

/*CREATE MAP*/
let dataMap = L.map("container1", {center: [37.8, -96.9], zoom: 4});

L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank"> &copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
    accessToken: 'NgxrQbMpVcw37S4Ne0nAnbgA4GmMqiLRnNjr9XbhXcvrNvsvVySPkt7LOuPmXtN4'
}).addTo(dataMap);

console.log(state_data.features);

//L.geoJson(state_data).addTo(dataMap);

const colorScale = d3.scaleLinear()
    .domain([0, .35])
    .range(["white", "green"]);

function style(feature) {
        return {
            fillColor: colorScale(feature.data.PEPW),
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 1
        };
    }
    
L.geoJson(state_data, {style: style}).addTo(dataMap);

let geojson;

function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();

    info.update(layer.feature);//
    
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    dataMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(state_data, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(dataMap);

let info = L.control();

info.onAdd = function (dataMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (feature) {
    this._div.innerHTML = '<h4>US Puplic Employment Density</h4>' +  (feature ?
        '<b>' + feature.properties.name + '</b><br />' + (feature.data.PEPW * 100).toFixed(2) + '%'
        : 'Hover over a state');

};



info.addTo(dataMap);

/* APPLICATION STATE */
// let merged_data = {
//     census: [],
//     geo: []
// };
 
// /* LOAD DATA */
// d3.csv("data/Merged_Data_CALC.csv", d3.autoType).then(census_data => {
//     // + SET YOUR DATA PATH
//     console.log("census_data", census_data);
//     merged_data.census = census_data;
//     console.log("state2:merged_data", merged_data);
//   }).then(d3.json("data/us-states.json").then(geo_data => {
//         console.log("geo_data", geo_data);
//         merged_data.geo = geo_data;
//         console.log("state3:merged_data", merged_data);
//         console.log("merged_data.geo.features", merged_data.geo.features);
//         console.log("merged_data.census", merged_data.census);
//         merged_data.geo.features.forEach(function (feature) {
//                             feature.forEach(function (array) {
//                                 array.forEach(function (property) {
//                                     merged_data.census.forEach(function (object) {
//                                         if (object['Selected Geographies'] === property.name) {
//                                             property.PEPW = object.PEPW        
//                                         }
//                                     })
//                                 })
//                         })
//                     });
//                     console.log("state4:merged_data", merged_data)
//     }));        
    
//     merged_data.geo.features.forEach(function (feature) {
//             feature.forEach(function (array) {
//                 array.forEach(function (property) {
//                     merged_data.census.forEach(function (object) {
//                         if (object['Selected Geographies'] === property.name) {
//                             property.PEPW = object.PEPW        
//                         }
//                     })
//                 })
//         })
//     })
//     })).finally(console.log("state4:merged_data", merged_data));

// })).then(merged_data.geo.map(function(features){
//    if (features.properties.name === merged_data.census['Selected Geographies']){
//         return features.properties.TWFdata = { "TPWF" : census_data.TPWF}
//     }
//     }).then(
//     console.log("state4:merged_data", merged_data)    
 

// d3.json("data/us-states_data.json", function(geoShape) {
		
//     // check for errors
//     if (error) {
//         return console.warn(error);
//     }
//     console.log("geoShape", geoShape);
// });

//     //  create a d3.geo.path to convert GeoJSON to SVG
//     let transform = d3.geo.transform({point: projectPoint}),
//         path = d3.geo.path().projection(transform);

//     // create path elements for each of the features
//     d3_features = g.selectAll("path")
//         .data(geoShape.features)
//         .enter().append("path");

//     dataMap.on("viewreset", reset);

//     reset();

//     // fit the SVG element to leaflet's map layer
//     function reset() {
    
//         bounds = path.bounds(geoShape);

//         const topLeft = bounds[0],
//             bottomRight = bounds[1];

//         svg1 
//             .attr("width", bottomRight[0] - topLeft[0])
//             .attr("height", bottomRight[1] - topLeft[1])
//             .style("left", topLeft[0] + "px")
//             .style("top", topLeft[1] + "px");

//         g 
//             .attr("transform", "translate(" + -topLeft[0] + "," 
//                                           + -topLeft[1] + ")");

//         // initialize the path data	
//         d3_features
//             .attr("d", path)
//             .style("fill-opacity", 0.7)
//             .attr('fill','blue');
//     } 

//         // Use Leaflet to implement a D3 geometric transformation.
//     function projectPoint(x, y) {
//         var point = dataMap.latLngToLayerPoint(new L.LatLng(y, x));
//         this.stream.point(point.x, point.y);
//     }

// });

// $.get('./incomplete_housing_data2.csv', function(csvString) {

//     var myIcon = L.divIcon({className: 'my-div-icon'});

//     var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

//     for (var i in data) {
//       var row = data[i];

//       var marker = L.marker([row.Latitude, row.Longitude] , 
//         // {icon: myIcon}
//        {opacity: 1}).bindPopup(row.AddressNum + " " + row.AddressSt);
      
//       marker.addTo(myMap);
//     }

//   });