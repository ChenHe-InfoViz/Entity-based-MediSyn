var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 600 - margin.left - margin.right,
    height = 526 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var trailArray = [];

function drawParallelCor(callback = null, parameter = null){

	var svg = d3.select("#parallelCor")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	//.append("g")
	    .attr("transform", "translate(" + (margin.left + 500) + "," + (margin.top + 10) + ")");

  d3.dsv(";")("javascripts/allnote.csv", function(error, cars) {
    trailArray = cars//.map(function(p) { return p.time; });
    if(callback)
      callback(parameter)
		cars.forEach(function(d){
		  d.direct = d.direct.replace(",", ".")
		  d.correct = d.correct.replace(",", ".")
		  d["domain"] = d["domain"].replace(",", ".")
		  d.breath = d.breath.replace(",", ".")
		})
//console.log(cars[0])

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    if(d == "category") return (y[d] = d3.scale.ordinal()
        .domain(cars.map(function(p) { return p.category; }))
        .rangePoints([0, height], 0))
    if(d == "time") return (y[d] = d3.scale.ordinal()
        .domain(cars.map(function(p) { return p.time; }))
        .rangePoints([0, height], 0))
    return d != "time" && d != "category" && (y[d] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));


  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .on("click", function(d){
        if(d == "participant" || d == "category") return;
        //console.log(d)
        cars.sort((function(a,b){
          //console.log(a[d])
          var ap = cars.indexOf(a), bp = cars.indexOf(b);
          //console.log(ap + " " + bp)
          if(a[d] > b[d]) return -1;
          if(a[d] < b[d]) return 1;
          return ap - bp;
        }).bind(cars));
        //console.log(cars.map(function(e) { return e.time; }))
        y.time.domain(cars.map(function(e) { return e.time; }))
        transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);

        updateTrailRows();
        //d3.select(".dimension").select(".axis").selectAll(".tick")
        //.attr("transform", function(p) {console.log(y.time(p)); return "translate(0," + y.time(p) + ")"; })
      });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        //console.log(d)
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

    d3.select(".dimension").select(".axis").selectAll(".tick").selectAll("text").style("display", "none")
    d3.select(".dimension").select(".axis").selectAll(".tick").select("line").attr("x2", "-600")

});
}

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
      //console.log(extents)
  foreground.style("display", function(d) {
    //console.log(d)
    return actives.every(function(p, i) {
      if(p == "category" || p == "time"){
        return extents[i][0] <= y[p](d[p]) && y[p](d[p]) <= extents[i][1];
      }
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}