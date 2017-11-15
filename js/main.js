// Global Variables
var families, marriages, business;  // imported data
var data;    // wrangled data
var svg;
var cellHeight = 20, cellWidth = 20, cellPadding = 10;
var width = 600, height = 800;

// Load the 3 data sets
queue()
    .defer(d3.csv,"data/florentine-family-attributes.csv")
    .defer(d3.csv,"data/marriages.csv")
    .defer(d3.csv,"data/business.csv")
    .await(initVis);

// Initialize
function initVis(error, metaData, marriageData, businessData){
    families = metaData;
    marriages = marriageData;
    business = businessData;


  // SVG drawing area
    svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    wrangleData();
}


function wrangleData() {

    data = families;

    data.forEach(function(d,i){
        d["name"] = d["Family"];
        d["index"] = i;
        d["allRelations"] = 0;
        // UPDATE "business" to business[i]
        d["businessTies"] = business.reduce(function(sum,value) { return sum + value; }, 0);
        d["businessValues"] = business[i];
        // UPDATE "marriages" to marriages[i]
        d["marriages"] = marriages.reduce(function(sum,value) { return sum + value; }, 0);
        d["marriageValues"] = marriages[i];
        d["numberPriorates"] = isNaN(d["Priorates"]) ? +d["Priorates"] : "N/A";
        d["wealth"] = +d["Wealth"];
    });

    console.log(data);

    // Update the visualization
    updateVis();
}



function updateVis() {

    var chart = svg.selectAll(".square")
        .data(families, function(d) { return d.Family; });

    chart.exit().remove();

    var row = chart.enter()
        .append("g")
        .attr("transform", "translate(0," + (cellHeight + cellPadding) + ")");

    row.append("rect")
        .attr("class", "square")
        .merge(row)
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", function(d, i) { 
            return (cellWidth + cellPadding) * i; })
        .attr("y", 0)
        .attr("fill", function(d, i) {
            // console.log(i);
            // console.log(d);
            return (d[0] == 0) ? "#ccc" : "#9370DB";
        });


    /***** DRAW TRIANGLE *****/
    // D3's enter, update, exit pattern
    var trianglePath = row.selectAll(".triangle-path")
        .data(data);

    trianglePath.enter().append("path")
        .attr("class", "triangle-path");

    trianglePath.attr("d", function(d, i) {
        // Shift the triangles on the x-axis (columns)
        var x = (cellWidth + cellPadding) * i;
        
        // All triangles of the same row have the same y-coordinates
        // Vertical shifting is already done by transforming the group elements
        var y = 0;
        
        return 'M ' + x +' '+ y + ' l ' + cellWidth + ' 0 l 0 ' + cellHeight + ' z';
    });

}