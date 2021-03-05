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
      console.log(tranposed_data);
});

