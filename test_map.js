/* CONSTANTS AND GLOBALS */
const width3 = window.innerWidth * 0.7,
  height3 = window.innerHeight * 0.7,
  margin3 = { top: 20, bottom: 60, left: 60, right: 40 }

let dataMap = L.map("container1", {center: [37.8, -96.9], zoom: 4}); 

L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank"> &copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
    accessToken: 'NgxrQbMpVcw37S4Ne0nAnbgA4GmMqiLRnNjr9XbhXcvrNvsvVySPkt7LOuPmXtN4'
}).addTo(dataMap);

let svg;

/* APPLICATION STATE */
let state = {
    data: [],
    selectedGraph: "Total Workforce" 
  };
  console.log("state1", state);
  
  /* LOAD DATA */
  d3.csv("data/Merged_Data_CALC.csv", d3.autoType).then(raw_data => {
    // + SET YOUR DATA PATH
    console.log("data", raw_data);
    state.data = raw_data;
    console.log("state2", state);
  });