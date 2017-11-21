// Global Variables
var data, svg;
var cellHeight = 20, cellWidth = 20, cellPadding = 10;
var margin = {top: 90, right: 0, bottom: 0, left: 90};
var width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Load the 3 data sets
// queue()
    // .defer(d3.csv,"data/florentine-family-attributes.csv")
    // .defer(d3.csv,"data/marriages.csv")
    // .defer(d3.csv,"data/business.csv")
    // .await(initVis);

var marriages = [
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
[0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
[0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
[0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
[0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0],
[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
[1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
[0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
[0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
[0,0,0,1,1,0,0,0,0,0,1,0,1,0,0,0],
[0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0]
];

var business = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,1,1,0,0,1,0,1,0,0,0,0,0],
[0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0],
[0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0],
[0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
[0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
[0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,0],
[0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1],
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
[0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]
];

initVis();

// Initialize
// function initVis(error, metaData, marriageData, businessData){
function initVis() {
  // SVG drawing area
    svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/florentine-family-attributes.csv", function(csvData) {
        data = csvData;

        wrangleData();
    })
}


function wrangleData() {

    data.forEach(function(d,i){
        d["index"] = i;
        d["name"] = "" + d["Family"];
        d["Priorates"] = isNaN(d["Priorates"]) ? "N/A" : +d["Priorates"];
        d["Wealth"] = +d["Wealth"];
        d["businessTies"] = business[i].reduce(function(sum,value) { return sum + value; }, 0);
        d["businessValues"] = business[i];
        d["marriages"] = marriages[i].reduce(function(sum,value) { return sum + value; }, 0);
        d["marriageValues"] = marriages[i];
        d["allRelations"] = d["businessTies"] + d["marriages"];
    });

    // Update the visualization
    updateVis();
}



function updateVis() {
    var sortOrder = d3.select("#sortOrder").property("value");
    // console.log(sortOrder);
    // console.log(data);

    data.sort(function(a,b) { 
        if(sortOrder == "name") {
            if(a["name"] < b["name"]) return -1;
            if(a["name"] > b["name"]) return 1;
            return 0;
        }
        // console.log(a[sortOrder]);
        // console.log(b[sortOrder]);
        // console.log(a[sortOrder] - b[sortOrder]);

        return a[sortOrder] - b[sortOrder];
    });

    // console.log("sorted data");
    // console.log(data);
    
    // horizontal labels
    var column = svg.selectAll(".xlabel")
        .data(data, function(d) { return d.name; });

    column.enter().append("text")
        .attr("class", "xlabel")
        // .attr("x", function(d, i) {
        //     console.log(cellWidth * i);
        //     return cellWidth * i; })
        // .attr("y", 0)
        .attr("text-anchor", "start")
        .attr("dy", "0.35em")
        .attr("transform", function(d,i) { 
            return "translate(" + ((cellWidth+cellPadding)*i) + ",-10) rotate(270)";
        })
        .text(function(d) {
            return d.name;
        });



    var dataJoin = svg.selectAll(".row")
        .data(data, function(d) { return d.name; });
    
    var row = dataJoin.enter()
        .append("g")
        .attr("class", "row");

    row.merge(dataJoin)
        .attr("height", cellHeight)
        .style("opacity",0.3)
        .transition()
        .duration(500)
        .style("opacity",1)
        .attr("transform", function(d, i) {
            return "translate(0," + (cellHeight + cellPadding) * i + ")";
        });

    row.on("mouseover", function() {
            d3.selectAll(".row").style("opacity",0.3);
            d3.select(this).style("opacity",1);
        })
        .on("mouseout", function() {
            d3.selectAll(".row").style("opacity",1);
        });

    var cellBusiness = row.selectAll(".cellBusiness")
        .data(function(d) { return d.businessValues; })
        .enter().append("rect")
        // .merge(cellBusiness)
        .attr("class", function(d, i) {
            return "column" + i;
        })
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", function(d, i) { 
            return (cellWidth + cellPadding) * i;
        })
        .attr("y", 0)
        .attr("fill", function(d, i) {
            return (d == 0) ? "#ccc" : "#FFA500";
        });

    // COLUMN HIGHLIGHT: on mouseover of cell, highlight entire column+i
    // cellBusiness.on("mouseover", function(d, i) {
    //         var selectedColumn = d3.select(this).class(); 
    //         console.log(selectedColumn);

    //         d3.select(this).style("opacity",1);
    //     })
    //     .on("mouseout", function() {
    //         d3.selectAll(".row").style("opacity",1);
    //     });

    var cellMarriage = row.selectAll(".cellMarriage")
        .data(function(d) { return d.marriageValues; })
        .enter().append("path")
        .attr("class", "cellMarriage")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("d", function(d, i) {
            // Shift the triangles on the x-axis (columns)
            var x = (cellWidth + cellPadding) * i;
            
            // All triangles of the same row have the same y-coordinates
            // Vertical shifting is already done by transforming the group elements
            var y = 0;
            
            return 'M ' + x +' '+ y + ' l ' + cellWidth + ' 0 l 0 ' + cellHeight + ' z';
        })
        .attr("fill", function(d, i) {
            // console.log(d);
            return (d == 0) ? "#ccc" : "#9370DB";
        });



    // vertical labels
    row.append("text")
        .attr("class", "ylabel")
        .attr("x", -20)
        .attr("y", function(d, i) { return cellPadding + ((cellHeight/2) - cellPadding) * i; })
        .attr("text-anchor", "end")
        .attr("dy", "0.35em")
        .text(function(d) {
            return d.name;
        });

}