var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 40,
  text: 15
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
  .attr("width", 1200) // altering the variable produced strange behavior 
  .attr("height", svgHeight)
  .attr('transform', `translate(-60, 0)`)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left + 40}, ${margin.top})`)
  .classed('chart-axes-pts', true);

var textLayer = svg.append("g")
  .attr("transform", `translate(${margin.left + 40}, ${margin.top})`)
  .classed('text-layer', true);

var axesRelationsX = svg.append('g')
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (width / 2))
  .attr("transform", 'translate(0, 20)')
  .classed('x-relations', true);

var axesRelationsY = svg.append('g')
  .attr("transform", `translate(${margin.left / 2}, ${margin.top})`)
  .classed('y-relations', true)


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

  console.log(xLinearScale(data.poverty));

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

  // equaly space relation options alongside axes 
  var x_realtions = ['In Poverty (%)'];
  var y_relations = ['Lacks Healthcare (%)'];

  // Axes
  // Y
  y_relations.forEach((rel, i) => {
    axesRelationsY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40 - (margin.text * i))
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text(rel)
    .classed('axis-relation', true);
  });


  // X
  x_realtions.forEach((rel, i) => {
    axesRelationsX.append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin.top + 30 + (margin.text * i)})`)
    .text(rel)
    .classed('axis-relation', true);
  });
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}<strong>
      <hr>
      <h4>Obese</h4>
      <h3>${d.obesity}%</h3>
      <hr>
      <h4>Smokes</h4>
      <h3>${d.smokes}%</h3>`);
  });

  chartGroup.call(toolTip);

  circles
  .on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  .on("mouseout", function(d) {
    toolTip.hide(d);
  });

}).catch(function(error) {
  console.log(error);
});

// x_realtions.forEach((rel, i) => {
//   axesRelationsX.append('text')
//   .attr('transform', `translate(${width / 2}, ${height + margin.top + 30 + i})`)
//   .text(rel)
//   .classed('axis-relation', true);
// });
