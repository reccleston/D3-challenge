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
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .classed('chart-axes-pts', true);

var textLayer = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .classed('text-layer', true);


var raw_data = d3.csv('assets/data/data.csv').then(data => {
  console.log(data);

  // Casting Relevant values
  data.forEach(d => {
    d.poverty = +d.poverty,
    d.healthcareLow = +d.healthcareLow;
  });

  // Scaling
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.poverty))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcareLow)])
    .range([height, 0]);

  // Axes
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // points 
  var circles  = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 12)
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcareLow))
  .attr('value', d => d.abbr)
  .classed('pt', true);

  // point labels
  textLayer.selectAll('text')
  .data(data)
  .enter()
  .append("text")
  .attr("dx", d => xLinearScale(d.poverty))
  .attr('dy', d => yLinearScale(d.healthcareLow) + 4)
  .attr('text-anchor', 'middle')
  .attr('value', d => d.asbbr)
  .text(d => d.abbr)
  .classed('pt-label', true)

  // data.forEach(d => console.log(d.abbr));

  // Axes
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .text('healthcare low');

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .text("poverty");

}).catch(function(error) {
  console.log(error);
});
