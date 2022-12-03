const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5; 

/* LOAD DATA */
d3.csv("data/Merged_Data_CALC.csv", d3.autoType)
  .then(data => {
    console.log('data', data)
    const selection = d3.select("#selection")
    console.log(selection)

  /* SCALES */
  // xScale  - linear,count
  const xScale3_GDP = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.GDP_2019_In_Mil)])
    .range([margin.left, width - margin.right])

  // yScale - linear,count
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.PEPW)])
    .range([height - margin.bottom, margin.top])

//   // colorScale
  const colorScale = d3.scaleOrdinal()
    .domain(["republican", "democrat", null])
    .range(["red", "blue", "gray"])

//   // sizeScale - square root, count
//   const sizeScale = d3.scaleSqrt()
//     .domain(d3.extent(data, d => d.Population))
//     //.range([0, 20])
//     .range([1, 70])
    
      /* HTML ELEMENTS */

// svg
const svg = d3.select("#container3")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "rgb(213 200 175)")

// tool tips
const tooltip = d3.select("#container3")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")

// axes
const xAxis = d3.axisBottom(xScale3_GDP)
.tickFormat(d => '$' + (d/1000) + 'B'); //to convert to percent from decimal ranking

const yAxis = d3.axisLeft(yScale)
.tickFormat(d => (d * 100) + '%');

const xAxisGroup = svg.append("g")
    .attr("class", 'xAxis')
    .attr("transform", `translate(${0}, ${height - margin.bottom})`) // move to the bottom
    .call(xAxis)

const yAxisGroup = svg.append("g")
    .attr("class", 'yAxis')
    .attr("transform", `translate(${margin.left}, ${0})`) // align with left margin
    .call(yAxis)

xAxisGroup.append("text")
    .attr("class", 'axis-title')
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#333333")
    .attr("font-family", "Amiri")
    .attr("font-size", "1.5em")
    .text("GDP 2019")

yAxisGroup.append("text")
    .attr("class", 'axis-title')
    .attr("x", -40)
    .attr("y", height / 2)
    .attr("writing-mode", "vertical-lr")
    .attr("text-anchor", "middle")
    .attr("fill", "#333333")
    .attr("font-family", "Amiri")
    .attr("font-size", "1.5em")
    .text("Percent of Workfoce Employed in the Public Sector")

  
const mouseover = function(event, d) {
    tooltip
        .style("opacity", 1)
  }

const mousemove = function(event, d) {
    tooltip
        .html(`${d['Selected Geographies']}`)
        .style("left", (event.x)/2 + 'px') 
        .style("top", (event.y)/2 + 'px')
}

const mouseleave = function(event,d) {
  tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}

// circles
const circles = svg.selectAll("circle")
  .data(data, d => d["Selected Geographies"])
  .join("circle")
  .attr("cx", d => xScale3_GDP(d.GDP_2019_In_Mil))
  .attr("cy", d => yScale(d.PEPW))
  .attr("r", radius)
  .attr("fill", d => colorScale(d.party))
  .on("mouseover", mouseover )
  .on("mousemove", mousemove )
  .on("mouseleave", mouseleave )
  //.attr("r", d => sizeScale(d.Population))
  
    
  });

