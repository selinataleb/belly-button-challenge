// Build the metadata panel
    function buildMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {


    // get the metadata field

    let metadata = data.metada;

    // Filter the metadata for the object with the desired sample number

    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`

    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    Object.entries(result).forEach(([key,value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
      });
    }

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
let samples = data.samples;

    // Filter the samples for the object with the desired sample number

  let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  let result = resultArray[0];


    // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart

    let bubbleChartData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
      
    }];

    // Render the Bubble Chart

    let bubbleChartLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: { title: 'Otu Id'},
      hovermode: 'closest'
    };
    Plotly.newPlot('bubble', bubbleChartData,bubbleChartLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately


  let barChartData = [{
    x: sample_values.slice(0,10).reverse(),
    y: yticks,
    text: otu_labels.slice(0,10).reverse(),
    type:"bar",
    orientation: "h"
  }];

    // Render the Bar Chart

    let barLayout = { 
      title : "Top 10 Bacteria Cultures Found",
      margin : {t:30, l:150}
    };

    Plotly.newPlot("bar", barChartData, barLayout);
  });
}
  
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field

    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`

  let select = d3.select("#selDataset"); 

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    names.forEach((name) => {
      select.append("option").text(name).property("value", name);
  });
  select.on("change", function () {
  let newSample = d3.select(this).property("value");
    optionChanged(newSample);
  });

    // Get the first sample from the list


    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  console.log("New Sample selected:", newSample);
  // Build charts and metadata panel each time a new sample is selected

  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();