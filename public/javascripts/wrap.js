function wrap(text, width, linecount = 1) {
  text.each(function() {
    var textNode = d3.select(this);
    //console.log(width);
    var words = text.text().trim().split('').reverse(),
    //split(/[\s;]+/).reverse(),
        word,
        line = [];
        // lineNumber = 1,
        // countLine = 0,
        // lineHeight = 12, // ems
        // //y = text.attr("y"),
        // dy = 0,//parseFloat(text.attr("dy")),
        //tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y);//.attr("dy", dy + "em");
        //console.log(words);
    while (word = words.pop()) {
      line.push(word);
      textNode.text(line.join(""));
      if (textNode.node().getComputedTextLength() > width) {
        //countLine++;
        //if(countLine == linecount){
          line.pop();
          textNode.text(line.join("").trim() + "..");
          
          break;
        }
        // if(line.length > 1){
        // line.pop();
        // tspan.text(line.join(""));
        // line = [word];
        // tspan = text.append("tspan").attr("x", 0)//.attr("y", y)
        //   .attr("dy", lineNumber * lineHeight + dy + "px")
        //   .text(word);
        // }
        // else {
        //     tspan.text(line.join(" "));
        //     tspan = text.append("tspan").attr("x", 0)//.attr("y", y)
        //   .attr("dy", lineNumber * lineHeight + dy + "px")
        //   //.text(word);
        // }
      //}
    }
    //if(countLine > 0) text.selectAll("tspan").attr("transform", "translate(0, -8)" )
  });
}

function uniqArray(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}


function getTime(){
  return new Date().getTime();
}

//remove duplicates from an object array
function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

function getFormatedTime(){
  var date = new Date();
  return date.getFullYear() + "." + (date.getMonth()<10?'0':'') + date.getMonth() + "." + (date.getDate()<10?'0':'') + date.getDate()  + "_" + (date.getHours()<10?'0':'') + date.getHours()  + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()  + ":" + (date.getSeconds()<10?'0':'') + date.getSeconds() + ":" + date.getMilliseconds()
}