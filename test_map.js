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

svg1 = d3.select(dataMap.getPanes().overlayPane).append("svg1"),
			g = svg1.append("g").attr("class", "leaflet-zoom-hide");

/* APPLICATION STATE */
let merged_data = {
    census: [],
    geo: []
};
console.log("state1:merged_data", merged_data);
 
/* LOAD DATA */
d3.csv("data/Merged_Data_CALC.csv", d3.autoType).then(census_data => {
    // + SET YOUR DATA PATH
    console.log("census_data", census_data);
    merged_data.census = census_data;
    console.log("state2:merged_data", merged_data);
  }).then(
    d3.json("data/us-states.json").then(geo_data => {
    console.log("geo_data", geo_data);
    merged_data.geo = geo_data;
    console.log("state3:merged_data", merged_data)
    })).then(
        merged_data.geo.features.forEach(function (feature) {
            feature.forEach(function (array) {
                array.forEach(function (property) {
                    merged_data.census.forEach(function (object) {
                        if (object['Selected Geographies'] === property.name) {
                            property.PEPW = object.PEPW        
                        }
                    })
                })
        })
    })
    ).then(console.log("state4:merged_data", merged_data));
// })).then(merged_data.geo.map(function(features){
//    if (features.properties.name === merged_data.census['Selected Geographies']){
//         return features.properties.TWFdata = { "TPWF" : census_data.TPWF}
//     }
//     }).then(
//     console.log("state4:merged_data", merged_data)    
 

d3.json("data/us-states.json", function(geoShape) {
		
    // check for errors
    if (error) {
        return console.warn(error);
    }

    //  create a d3.geo.path to convert GeoJSON to SVG
    const transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

    // create path elements for each of the features
    d3_features = g.selectAll("path")
        .data(geoShape.features)
        .enter().append("path");

    dataMap.on("viewreset", reset);

    reset();

    // fit the SVG element to leaflet's map layer
    function reset() {
    
        bounds = path.bounds(geoShape);

        const topLeft = bounds[0],
            bottomRight = bounds[1];

        svg1 
            .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g 
            .attr("transform", "translate(" + -topLeft[0] + "," 
                                          + -topLeft[1] + ")");

        // initialize the path data	
        d3_features
            .attr("d", path)
            .style("fill-opacity", 0.7)
            .attr('fill','blue');
    } 

        // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = dataMap.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

});

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