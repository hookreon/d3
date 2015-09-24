var chopstickUrl = "https://api.myjson.com/bins/590yq";

var url = "https://data.lacity.org/resource/eta5-h8qx.json";


// Set the dimensions of the canvas  graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom - 100;


// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5).tickFormat(d3.format("d"));

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d["hour"]); })
    .y(function(d) { return y(d["count"]); }).interpolate("basis");
var flatvalueline = d3.svg.line()
    .x(function(d) { return x(d["hour"]); })
    .y(function(d) { return height; }).interpolate("basis");

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json(url, function(error, json) {
    // use TIME_OCC to enumerate crime occurrence by time of day
    var timeHist = {};
    var timeArray = [];
    for(var i=0; i<json.length; i++){
      if (timeHist[json[i]['time_occ']] === undefined){
        timeHist[json[i]['time_occ']] = 0;
      }
      timeHist[json[i]['time_occ']]++;
    }
    // Convert to an array of objects
    for(var key in timeHist) {
      timeArray.push({"hour":(+key), "count":timeHist[key]});
    }
    timeArray.push({"hour":2400, "count":0});
    timeArray.sort(function(a,b){
      return a.hour - b.hour;
    });
    // Scale the range of the data
    // x.domain(d3.extent(timeArray, function(d) { return d["hour"]; }));
    x.domain([0, d3.max(timeArray, function(d) { return d["hour"]; })]);
    y.domain([0, d3.max(timeArray, function(d) { return d["count"]; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d",flatvalueline(timeArray))
        .transition().duration(1000)
        .attr("d", valueline(timeArray));



    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});
