/* CONSTANTS AND GLOBALS */
const width3 = window.innerWidth * 0.7,
  height3 = window.innerHeight * 0.7,
  margin3 = { top: 20, bottom: 60, left: 60, right: 40 }
  radius = 5
  size = 10;

let svg;
let xScale3_TWF;
let xScale3_GDP;
let xScale3_WFUE;
let xScale3_wages;
let yScale3;
let legend_graph;
let colorScale_map;
let colorScale_graph; 
let geojson;

/*CREATE MAP*/
const mapwidth = d3.select("container1")
    .style("width", `${width3}px`)

let dataMap = L.map("container1", {center: [37.8, -96.9], zoom: 4});

L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank"> &copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
    accessToken: 'NgxrQbMpVcw37S4Ne0nAnbgA4GmMqiLRnNjr9XbhXcvrNvsvVySPkt7LOuPmXtN4'
}).addTo(dataMap);

console.log(state_data.features);

/*Map Color*/
colorScale_map = d3.scaleLinear()
    .domain([0, .35])
    .range(["white", "green"]);

function style(feature) {
        return {
            fillColor: colorScale_map(feature.data.PEPW),
            weight: 1,
            opacity: 1,
            color: '#333333',
            fillOpacity: 1
        };
    }
    
L.geoJson(state_data, {style: style}).addTo(dataMap);

//Map Events/

function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 2,
        color: 'white',
        fillOpacity: 0.7
    });

    layer.bringToFront();

    info.update(layer.feature);
    
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

/*Map Info Box*/
let info = L.control();

info.onAdd = function (dataMap) {
    this._div = L.DomUtil.create('div', 'info'); 
    this.update();
    return this._div;
};

info.update = function (feature) {
    this._div.innerHTML = '<h4>US Public Employment Density</h4>' +  (feature ?
        'In ' + feature.properties.name +' '+ (feature.data.PEPW * 100).toFixed(2) + '% of the workforce </br>is employed in the public sector'
        : 'Hover over a state');

};

info.addTo(dataMap);

/* GRAPH */

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
  colorScale_graph = d3.scaleOrdinal()
      .domain(["republican", "democrat", null])
      .range(["red", "blue", "gray"])
  
  
  // + AXES
    const yAxis = d3.axisLeft(yScale3)
      .tickFormat(d => (d * 100) + '%');
  
// + CREATE SVG ELEMENT
    svg = d3.select("#container3")
      .append("svg")
      .attr("width", width3)
      .attr("height", height3)
      .style("display", "block")
      .style("margin", "auto")
      .style("position", "relative")
      .style("z-index", 0)
      .style("background", "none");
  
      // + CALL Y AXIS
  const yAxisGroup = svg.append("g")
      .attr("class", 'yAxis')
      .attr("transform", `translate(${margin3.left}, ${0})`) // align with left margin
      .style("position", "absolute")
      .style("z-index", 1)
      .call(yAxis);
  
  // add labels - yAxis
  yAxisGroup.append("text")
      .attr("class", 'y-axis-title')
      .attr("x", -40)
      .attr("y", height3 / 2)
      .attr("writing-mode", "vertical-lr")
      .attr("text-anchor", "middle")
      .attr("fill", "#333333")
      .attr("font-family", "Amiri")
      .attr("font-size", "1.5em")
      .text("Percent of Workfoce Employed in the Public Sector");
  
    // legend
    const legColors = d3.scaleOrdinal()
      .domain(["Democrat","Republican","No Governor"])
      .range(["blue","red","gray"]);

    const legend_graph_group = svg.append("rect")
        .attr("class", "legend")
        .attr("x", (width3 - (width3/4) - margin3.right))
        .attr("y", (height3 - (height3/4) - margin3.bottom) -20)
        .style("display", "inline")
        .style("position", "relative")
        .style("z-index", 2)
        .attr("width", width3/4)
        .attr("height", height3/4)
        .attr("rx", 15)
        .style("fill", "white")
        .style("opacity", 0.7);

    svg.selectAll("legend")
      .data(["Democrat","Republican","No Governor"])
      .enter()
      .append("rect")
        .attr("x",(width3 - (width3/4) - margin3.right)+20)
        .attr("y", function(d,i){ return (height3 - (height3/4) - margin3.bottom) + i*(size+5)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", d => legColors(d))
        .style("display", "inline")
        .style("position", "relative")
        .style("z-index", 3)
        .style("opacity", 0.75)
        .style("z-index", 2);
        
    svg.selectAll("mylabels")
        .data(["Democrat","Republican","No Governor"])
        .enter()
        .append("text")
            .attr("x", ((width3 - (width3/4) - margin3.right)+40))
            .attr("y", function(d,i){ return (height3 - (height3/4) - margin3.bottom) + i*(size+5)})
            .style("fill", d => legColors(d))
            .text(d=> d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "mathematical")
            .style("position", "absolute")
            .style("z-index", 4)
            .style("opacity", 0.75)
            .style("font-family", "Amiri")
            .style("font-size", "14px");

    const dropdown_container = d3.select("#container3")
        .append("div")
        .attr("class", "dd_container")
        .style("position","relative")
        .style("z-index", 9)
        // .style("left", `${(width3 - (width3/4) - margin3.right)+10}px`)
        // .style("bottom", `${(margin3.bottom + height3/5)-5}px`)
        //.style("width", width3/5)
        //.style("height", height3/5);

    
    dropdown_container
        .append("select")
        .attr("class", "dropdown")
        .style("left", `${(width3 - (width3/4) - margin3.right)+10}px`)
        .style("bottom", `${(margin3.bottom + height3/5)-5}px`)
        .style("position", "relative")
        .style("z-index", 8);

    const selectElement = d3.select("select")

    selectElement  
      .selectAll("option")
      .data(["Total Workforce", "Unemployment", "Wages", "GDP"])
      .join("option")
      .attr("value", d => d)
      .text(d => d)
      ;
  
    selectElement
      .on("change", (event) => {
          console.log(event)
          console.log("prev", state)
          state.selectedGraph = event.target.value;
          console.log("post", state)
          d3.selectAll('.tooltip')
            .remove()
          d3.selectAll('.xAxis')
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove()
          d3.selectAll('.x-axis-title')
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove()
  
          draw();
      })
  
    console.log(selectElement)

    draw(); 
  }
  
  // /* DRAW FUNCTION */
  function draw() {
  
  
  // first create the tooltips 
  const tooltip = d3.select("#container3")
    .append("div")
    .attr("class", "tooltip")
  
  const mouseover = function(event, d) {
    tooltip
      .style("opacity", 0.75)
    };
  
  const mousemove = function(event, d) {
    tooltip
      .html(
        `<b>${d['Selected Geographies']}</b>
        <br>Total Workforce: ${(d.TWF/1000000).toFixed(1)} M
        <br>Unemployment: ${(d.WFUE*100).toFixed(2)}%
        <br>Average Yearly Wage: $${d.wages}
        <br>Gross Domestic Product (2019) $${(d.GDP_2019_In_Mil/1000).toFixed(1)} B`
        )
      .style("position", "fixed")
      .style("z-index", 7)
      .style("left", (event.x)/2 + 'px') 
      .style("top", (event.y)/2 + 'px')
  };
  
  const mouseleave = function(event,d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  };
  
  //Then create the if/else function based on the dropdown selection
  if (state.selectedGraph === "Total Workforce"){
    let xAxis = d3.axisBottom(xScale3_TWF)
      .tickFormat(d => (d / 1000000) + 'M');

    const xAxisGroup = svg.append("g")
      .attr("class", 'xAxis')
      .attr("transform", `translate(${0}, ${height3 - margin3.bottom})`)
      .style("position", "absolute")
      .style("z-index", 5)

    xAxisGroup.append("text")
      .attr("class", 'x-axis-title')
      .attr("x", width3 / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#333333")
      .attr("font-family", "Amiri")
      .attr("font-size", "1.5em")
      .text("Total Workforce")
    
    d3.selectAll('.xAxis')
      .style("opacity", 0)
      .call(xAxis)
        .transition()
        .duration(1000)        
        .style("opacity", 1)
    
    
    //add circles  
    const circles = svg.selectAll("circle")
      .data(state.data, d => d["Selected Geographies"])
      .join(
        enter => enter.append("circle")
          .attr("cx", d => xScale3_TWF(d.TWF))
          .attr("cy", height3 - margin3.bottom)
          .attr("r", radius)
          .attr("fill", d => colorScale_graph(d.party))
          .style("position", "absolute")
          .style("z-index", 6)
          .style("opacity", 0)
          .call(sel => sel
            .transition()
            .duration(1000)
            .attr("cy", d => yScale3(d.PEPW))
            .style("opacity", 0.75)
          ),
    
        update => update
          .call(sel => sel.transition()
            .duration(1000)
            .attr("cx", d => xScale3_TWF(d.TWF)) 
            .attr("cy", d => yScale3(d.PEPW))             
          ),
    
        exit => exit
          .call(sel => sel
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .attr("cy", height3 - margin3.bottom) 
            .remove()
            )
      )
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  }
  
  else if (state.selectedGraph === "Unemployment"){
    const xAxis = d3.axisBottom(xScale3_WFUE)
      .tickFormat(d => (d*100).toFixed(2) + '%'); //to convert to percent from decimal ranking
  
    const xAxisGroup = svg.append("g")
      .attr("class", 'xAxis')
      .attr("transform", `translate(${0}, ${height3 - margin3.bottom})`) // move to the bottom
      .style("position", "absolute")
      .style("z-index", 5)
      .attr("fill", "none")

    xAxisGroup.append("text")
      .attr("class", 'x-axis-title')
      .attr("x", width3 / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#333333")
      .attr("font-family", "Amiri")
      .attr("font-size", "1.5em")
      .text("Unemployment")
    
      d3.selectAll('.xAxis')
      .style("opacity", 0)
      .call(xAxis) 
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .style("opacity", 1)
  
  //add circles  
  const circles = svg.selectAll("circle")
    .data(state.data, d => d["Selected Geographies"])
    .join(
      enter => enter.append("circle")
        .attr("cx", d => xScale3_WFUE(d.WFUE))
        .attr("cy", height3 - margin3.bottom)
        .attr("r", radius)
        .attr("fill", d => colorScale_graph(d.party))
        .style("position", "absolute")
        .style("z-index", 6)
        .style("opacity", 0)
        .call(sel => sel
          .transition()
          .duration(1000)
          .attr("cy", d => yScale3(d.PEPW))
          .style("opacity", 0.75)
        ),
  
      update => update
        .call(sel => sel.transition()
          .duration(1000)
          .attr("cx", d => xScale3_WFUE(d.WFUE)) 
          .attr("cy", d => yScale3(d.PEPW))              
        ),
  
      exit => exit
        .call(sel => sel
          .transition()
          .duration(500)
          .attr("opacity", 0)
          .attr("cy", height3 - margin3.bottom) 
          .remove()
          )
    )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)  
  }
  
  else if (state.selectedGraph === "Wages"){
    const xAxis = d3.axisBottom(xScale3_wages)
      .tickFormat(d => '$'+(d));
  
    const xAxisGroup = svg.append("g")
      .attr("class", 'xAxis')
      .attr("transform", `translate(${0}, ${height3 - margin3.bottom})`) // move to the bottom
      .style("position", "absolute")
      .style("z-index", 5)
      .attr("fill", "none")

    xAxisGroup.append("text")
      .attr("class", 'x-axis-title')
      .attr("x", width3 / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#333333")
      .attr("font-family", "Amiri")
      .attr("font-size", "1.5em")
      .text("Average Yearly Wage")
  
    d3.selectAll('.xAxis')
    .style("opacity", 0)
    .call(xAxis) 
      .transition()
      .duration(1000)
      .attr("fill", "none")
      .style("opacity", 1)
  
  //add circles  
    const circles = svg.selectAll("circle")
      .data(state.data, d => d["Selected Geographies"])
      .join(
        enter => enter.append("circle")
          .attr("cx", d => xScale3_wages(d.wages))
          .attr("cy", height3 - margin3.bottom)
          .attr("r", radius)
          .attr("fill", d => colorScale_graph(d.party))
          .style("position", "absolute")
          .style("z-index", 6)
          .style("opacity", 0)
          .call(sel => sel
            .transition()
            .duration(1000)
            .attr("cy", d => yScale3(d.PEPW))
            .style("opacity", 0.75)
          ),
  
        update => update
          .call(sel => sel.transition()
            .duration(1000)
            .attr("cx", d => xScale3_wages(d.wages)) 
            .attr("cy", d => yScale3(d.PEPW))             
          ),
  
        exit => exit
          .call(sel => sel
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .attr("cy", height3 - margin3.bottom) 
            .remove()
            )
      )
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  }
  
  else if (state.selectedGraph === "GDP"){
    const xAxis = d3.axisBottom(xScale3_GDP)
    .tickFormat(d => '$' + (d/1000) + 'B');
  
    const xAxisGroup = svg.append("g")
      .attr("class", 'xAxis')
      .attr("transform", `translate(${0}, ${height3 - margin3.bottom})`) // move to the bottom
      .style("position", "absolute")
      .style("z-index", 5)
      .attr("fill", "none")

   xAxisGroup.append("text")
      .attr("class", 'x-axis-title')
      .attr("x", width3 / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#333333")
      .attr("font-family", "Amiri")
      .attr("font-size", "1.5em")
      .text("GDP 2019")
    
    d3.selectAll('.xAxis')
      .style("opacity", 0)
      .call(xAxis) 
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .style("opacity", 1)
  
      // Add/move circles
    const circles = svg.selectAll("circle")
      .data(state.data, d => d["Selected Geographies"])
      .join(
        enter => enter.append("circle")
          .attr("cx", d => xScale3_GDP(d.GDP_2019_In_Mil))
          .attr("cy", height3 - margin3.bottom)
          .attr("r", radius)
          .attr("fill", d => colorScale_graph(d.party))
          .style("position", "absolute")
          .style("z-index", 6)
          .style("opacity", 0)
          .call(sel => sel
            .transition()
            .duration(1000)
            .attr("cy", d => yScale3(d.PEPW))
            .style("opacity", 0.75)
          ),
  
        update => update
          .call(sel => sel.transition()
            .duration(1000)
            .attr("cx", d => xScale3_GDP(d.GDP_2019_In_Mil)) 
            .attr("cy", d => yScale3(d.PEPW))             
        ),
  
        exit => exit
        .call(sel => sel
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .attr("cy", height3 - margin3.bottom) 
            .remove()
            )
      )
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    };
  }