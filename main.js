/* CONSTANTS AND GLOBALS */
const width3 = window.innerWidth * 0.7,
  height3 = window.innerHeight * 0.7,
  margin3 = { top: 20, bottom: 60, left: 60, right: 40 };

let svg;
let xScale3_TWF;
let xScale3_GDP;
let xScale3_WFUE;
let xScale3_wages;
let yScale3;
let colorScale;
let sizeScale;

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
  init();
});


/* INITIALIZING FUNCTION */
function init() {

// + SCALES
// xScale  - linear,count
xScale3_TWF = d3.scaleLinear()
 .domain([0, d3.max(state.data, d => d.TWF)])
 .range([margin3.left, width3 - margin3.right])
 
xScale3_GDP = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.GDP_2019_In_Mil)])
    .range([margin3.left, width3 - margin3.right])

xScale3_WFUE = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.WFUE)])
    .range([margin3.left, width3 - margin3.right])

xScale3_wages = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.wages)])
    .range([margin3.left, width3 - margin3.right])

// yScale - linear,count
yScale3 = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.PEPW)])
    .range([height3 - margin3.bottom, margin3.top])

// colorScale
colorScale = d3.scaleOrdinal()
    .domain(["republican", "democrat", null])
    .range(["red", "blue", "gray"])


// + AXES
// const xAxis = d3.axisBottom(xScale)
//     .tickFormat(d => (d * 100) + '%');
const yAxis = d3.axisLeft(yScale3)
    .tickFormat(d => (d * 100) + '%');

// + TOOL TIPS
const tooltip = d3.select("#container3")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")

const mouseover = function(event, d) {
    tooltip
        .style("opacity", 1)
  }

const mousemove = function(event, d) {
    tooltip
        .html(`${d['Selected Geographies']}`)
        .style("display", "inline")
        .style("position","fixed")
        .style("left", (event.x)/2 + 'px') 
        .style("top", (event.y)/2 + 'px')
}

const mouseleave = function(event,d) {
  tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}

  // + UI ELEMENT SETUP
const selectElement = d3.select("#dropdown")

selectElement  
    .selectAll("option")
    .data(["Total Workforce", "Unemployment", "Wages", "GDP"])
    .join("option")
    .attr("value", d => d)
    .attr("selected", d => (d === "Total Workforce"))
    .text(d => d)

selectElement
    .on("change", (event) => {
        console.log(event)
        console.log("prev", state)
        state.selectedGraph = event.target.value;
        console.log("post", state)

        draw();
    })

  console.log(selectElement)


  // + CREATE SVG ELEMENT
svg = d3.select("#container3")
    .append("svg")
    .attr("width", width3)
    .attr("height", height3)
    .style("background-color", "rgb(213 200 175)")

  // + CALL Y AXIS
//   const xAxisGroup = svg.append("g")
//     .attr("class", 'xAxis')
//     .attr("transform", `translate(${0}, ${height3 - margin3.bottom})`) // move to the bottom
//     .call(xAxis)

const yAxisGroup = svg.append("g")
    .attr("class", 'yAxis')
    .attr("transform", `translate(${margin3.left}, ${0})`) // align with left margin
    .call(yAxis)

  // add labels - xAxis
//   xAxisGroup.append("text")
//     .attr("class", 'axis-title')
//     .attr("x", width3 / 2)
//     .attr("y", 40)
//     .attr("text-anchor", "middle")
//     .attr("fill", "#333333")
//     .attr("font-family", "Amiri")
//     .attr("font-size", "1.5em")
//     .text("Ideology Score 2020")

// add labels - yAxis
yAxisGroup.append("text")
    .attr("class", 'axis-title')
    .attr("x", -40)
    .attr("y", height3 / 2)
    .attr("writing-mode", "vertical-lr")
    .attr("text-anchor", "middle")
    .attr("fill", "#333333")
    .attr("font-family", "Amiri")
    .attr("font-size", "1.5em")
    .text("Percent of Workfoce Employed in the Public Sector")
  draw(); 
}

// /* DRAW FUNCTION */
function draw() {

//   // + FILTER DATA BASED ON STATE
// //   const filteredData = state.data
// //     .filter(d => state.selectedParty === "All" || state.selectedParty === d.Party)

  const dot = svg
    .selectAll("circle")
    .data(state.data, d => d["Selected Geographies"])
    .join(
      // + HANDLE ENTER SELECTION
      enter => enter.append("circle")
          .attr("r", 5)
          .attr("class", "dot")
          //.attr("cx", d => xScale(d.ideology))
          .attr("cy", d => yScale(d.Score))
          .attr("fill", d => colorScale(d.Party))
          .call(sel => sel
            .transition()
            .duration(2000)
            .attr("r", d => sizeScale(d.Population))
          ),

      // + HANDLE UPDATE SELECTION
      update => update
        .call(sel => sel.transition()
          .duration(1000)
          .attr("r", 5) 
          .transition()
          .duration(1000)
          .attr("r", d => sizeScale(d.Population))      
      ),

      // + HANDLE EXIT SELECTION
      exit => exit
        .call(sel => sel
          .attr("opacity", 1)
          .transition()
          .duration(1000)
          .attr("opacity", 0)
          .attr("r", 5) 
          .remove()
          )
    );
}
