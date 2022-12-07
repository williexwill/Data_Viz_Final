/* CONSTANTS AND GLOBALS */
const width3 = window.innerWidth * 0.7,
  height3 = window.innerHeight * 0.7,
  margin3 = { top: 20, bottom: 60, left: 60, right: 40 }
 
let census_data = [];
let map_data = [];
let merged_data = [];
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

 
/* LOAD DATA */
census_data = d3.csv("data/Merged_Data_CALC.csv", d3.autoType);
console.log("census_data", census_data);
map_data = d3.json("data/us-states.json");
console.log("map_data", map_data);

merged_data = map_data.map(function(features){
   if (features.properties.name === census_data['Selected Geographies']){
        return features.properties.UEdata = { "unemployment" : census_data.UEWF}
    }
    });

console.log("merged_data", merged_data);    

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