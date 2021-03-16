var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


function castVals(tranposed_data) {
  Object.keys(tranposed_data).forEach(key => {
    // Checks if value is a string 
    if (tranposed_data[key][0] % 10 > 0){
      tranposed_data[key] = tranposed_data[key].map(p => parseFloat(p));
    }
    tranposed_data.income = tranposed_data.income.map(p => parseInt(p));
  });
  return tranposed_data;
};

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var raw_data = d3.csv('assets/data/data.csv').then(data => {
  console.log(data);
  data.forEach(d => {
    d.poverty = +d.poverty,
    d.healthcareLow = +d.healthcareLow;
  });

var xLinearScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.poverty))
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.healthcareLow)])
  .range([height, 0]);

var xAxis = d3.axisBottom(xLinearScale);
var yAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);

chartGroup.append("g").call(yAxis);

// points 
var circles  = chartGroup.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("r", d => 2.5 * (d.income / 11500))
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcareLow))
.attr('value', d => d.abbr)
.classed('pt', true);

// point labels
chartGroup.selectAll('text')
.data(data).enter()
.append("text")
.attr("dx", d => xLinearScale(d.poverty) - 11)
.attr('dy', d => yLinearScale(d.healthcareLow) + 6)
.attr('value', d => d.abbr)
.text(d => d.abbr)
.classed('pt-label', true)

// Axes
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text('healthcare low');

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("poverty");

}).catch(function(error) {
  console.log(error);
});
