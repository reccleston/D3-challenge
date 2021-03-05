var raw_data= d3.csv('assets/data/data.csv').then(row => {
    // transposes data --> an array per col
    var tranposed_data = Object.assign(...Object.keys(row[0]).map(key =>
        ({[key]: row.map( o => o[key])})
    ));
    
    var trace = {
        x: tranposed_data.age,
        y: tranposed_data.income,
        mode: 'markers',
        type: 'scatter'
      };
    
      // Create the data array for our plot
      var data = [trace];
    
      // Define the plot layout
      var layout = {
        title: "Age v. Income",
        xaxis: { title: "Age" },
        yaxis: { title: "Income"}
      };
    
      // Plot the chart to a div tag with id "bar-plot"
      Plotly.newPlot("scatter", data, layout);
});

