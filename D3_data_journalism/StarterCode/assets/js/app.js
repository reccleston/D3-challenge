var width = 700;
var height = 500;

// var x = d3.scale.linear().range([0, width]);
// var y = d3.scale.linear().range([height, 0]);

var raw_data= d3.csv('assets/data/data.csv').then(row => {

    // transposes data --> an array per col
    var tranposed_data = Object.assign(...Object.keys(row[0]).map(key =>
        ({[key]: row.map( o => o[key])})
    ));
    
    var trace = {
        x: tranposed_data.poverty,
        y: tranposed_data.healthcareLow,
        mode: 'markers',
        type: 'scatter'
      };
    
      // Create the data array for our plot
      var data = [trace];
    
      // Define the plot layout
      var layout = {
        xaxis: { title: "poverty" },
        yaxis: { title: "low healthcare"}
      };
    
      // Plot the chart to a div tag with id 'scatter'
      Plotly.newPlot("scatter", data, layout);

      // create g tag to be layer of for markers with state names 
      // grabbng correct svg? created group?
    
      
      var svg = d3.select('.main-svg').attr('height', height).attr('width', width);

      var dots =  svg.select('g').data(tranposed_data).enter().append('g').attr('class', 'marker-labels');
      
      dots.append("circle")
      .attr("class", "dot")
      .attr("r", '1')
      .attr("cx", function (d) {
          console.log(d);
          return d.poverty;
      })
      .attr("cy", function (d) {
          return d.healthcareLow;
      })
      .style("fill", 'blue');

      console.log(dots);

      console.log(tranposed_data);
});


