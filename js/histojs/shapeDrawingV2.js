  function savePointsData(pData,currentShape){
      if(currentShape=="rect"){
       allShapes.push({id: currentShapeId.toString(), shape:currentShape,points:pData})
      }
      if(currentShape=="circle"){
       allShapes.push({id: currentShapeId.toString(), shape:currentShape,points:pData})
      }
      if(currentShape=="free"){
        var modifiedPointData=[]
        for(var i=0; i<pData.length; i++){
          modifiedPointData.push([pData[i]["x"],pData[i]["y"]])
         
         }
        allShapes.push({id: currentShapeId.toString(), shape:currentShape,points:modifiedPointData})
      }
      
  }

function calDistance(Point1, Point2){
  return Math.sqrt(  Math.pow( Point1[0] - Point2[0],2) + Math.pow( Point1[1] - Point2[1],2)  )


}


function findPointIndex(shapeIndex){      // To check whether a point on the shape  perimeter



// Number((6.688689).toFixed(4))
// 6.6887
   var approximateDigit=2;
   var thresholdValue=d3.select('[id="'+allShapes[shapeIndex].id+'"]').style('stroke-width')*5;   
   // console.log(thresholdValue)
   var shapeCent=d3.polygonCentroid(allShapes[0]["points"]) 
   var smallestDist=Infinity;
   var smallestDistIndex=-1

  for(var i=0;i< allShapes[shapeIndex]["points"].length; i++){
         // console.log("currentPoint[0] ",currentPoint[0])
         // console.log("allShapes[shapeIndex][points][i][0]", allShapes[shapeIndex]["points"][i][0])         
         // console.log(currentPoint[1])   
         // console.log(allShapes[shapeIndex]["points"][i][1])  

    // if((Number((currentPoint[0]).toFixed(approximateDigit))== Number((allShapes[shapeIndex]["points"][i][0]).toFixed(approximateDigit)) ) && (Number((currentPoint[1]).toFixed(approximateDigit))== Number((allShapes[shapeIndex]["points"][i][1]).toFixed(approximateDigit)) ) ){
    var currentDist=calDistance(currentPoint,allShapes[shapeIndex]["points"][i]);

    if(currentDist<=thresholdValue){   
      if(smallestDist>currentDist){
          smallestDist=currentDist;
          smallestDistIndex=i;

      }      
    }

  }

  return smallestDistIndex; 


}

  ///////////////// Mouse events ////////////

  function removeRegion(){
                  var classType='.shapes'
                  d3.selectAll(classType).each(function(d) {   
                  if(d3.select(this).attr("selected")=="yes"){  
                     var index = findObjectByKey(allShapes, 'id', this.attributes.id.nodeValue, 'INDEX' ); 
                      // console.log("index  ", index)
                      if(index!=null) 
                      {
                 
                             allShapes.splice(index, 1);
                             d3.select(this).remove();
                           
                      }
                  }
                  }); 
                  
}

function handleMouseClick(d, i) { // Add interactivity

          if(d3.select(this).attr("currentfill")==d3.select(this).attr("originalfill")){  
                  d3.select(this).attr('currentfill', 'red');
                  d3.select(this).attr("selected","yes");
                  $$("RemoveRegion").enable();   
           }else{
                  d3.select(this).attr('currentfill', d3.select(this).attr("originalfill"))
                  d3.select(this).attr("selected","no");
                  $$("RemoveRegion").disable(); 
           }      

}



function handleRegionMouseOver(d, i) { // Add interactivity
  // to prevent this event during drawing we use:
  var index = findObjectByKey(allShapes, 'id', this.attributes.id.nodeValue, 'INDEX' ); // to check whether the entry exists or no..
    
    if(index!=null) 
    {

      // d3.select(this).style('fill', 'red');
       // d3.select(this).style("cursor","all-scroll");
     // if(findPointIndex(index)!=-1)
       // d3.select(this).style("cursor","nwse-resize");
     // else
       // d3.select(this).style("cursor","alias");
 
   }

}


function handleRegionMouseLeave(d, i) { // Add interactivity
 
   d3.select(this).style('fill', d3.select(this).attr("currentfill"));
   $$("propChart").clearAll();

}
///////////////////////////////////////////////  
function findCursorDirection(shapeCentroid,perimeterPoint){

  if(perimeterPoint[0]<shapeCentroid[0]){
    if(perimeterPoint[1]<shapeCentroid[1]){
      return "nwse"

    }else{

      return "nesw"     
    }

  }else{

    if(perimeterPoint[1]<shapeCentroid[1]){
      return "nesw"

    }else{
      return "nwse"
    }

  }

}  




function trackRegion(event){  

  if(allShapes.length>0){
        var viewerX = event.position.x;
        var viewerY = event.position.y;
        var windowPoint = new OpenSeadragon.Point(viewerX, viewerY);
        var viewportPoint = viewer.viewport.pointFromPixel(windowPoint);
        currentPoint=[viewportPoint.x,viewportPoint.y];

        for(var i=0; i<allShapes.length; i++){
           if(d3.polygonContains(allShapes[i]["points"], currentPoint)){

                d3.select('[id="'+allShapes[i].id+'"]').style('fill', 'red'); 
                // console.log("allShapes[1]",allShapes[i])  
                
                var bbox=find_bbox(allShapes[i],"freeDrawing");    // drawing is the shape flag 
                console.log("bbox of freedrawing", bbox)
                $$("propChart").clearAll();
                PlotProp(Math.round(bbox['left']),Math.round(bbox['top']),Math.round(bbox['width']),Math.round(bbox['height'])); 

                if(findPointIndex(i)!=-1){  // means the point is on the perimeter
                  var shapeCent=d3.polygonCentroid(allShapes[i]["points"]) 
                  d3.select('[id="'+allShapes[i].id+'"]').style("cursor",findCursorDirection(shapeCent,currentPoint)+"-resize");
                }else{
                  d3.select('[id="'+allShapes[i].id+'"]').style("cursor","all-scroll");
                }
            }
        }
        
        // console.log("test point :", currentPoint, d3.polygonContains(allShapes[0]["points"], currentPoint))
        // console.log(viewportPoint.x)

        // allShapes[0]["points"][0]
    }

}

function removeOverlay() {
     d3.selectAll("rect").remove();     
     d3.selectAll("circle").remove();    
     d3.selectAll("path").remove();     
  }

    lineFunction = d3.svg.line()  
                      .x(function(d) { return d.x; })
                      .y(function(d) { return d.y; })
                      .interpolate("cardinal"); 

      // basis-closed      cardinal-closed                  

     function onMouseDrag(event) {

      if($$("SelectRegion").getValue()){
        event.preventDefaultAction=true;
        var viewerX = event.position.x;
        var viewerY = event.position.y;
        var windowPoint = new OpenSeadragon.Point(viewerX, viewerY);
        var viewportPoint = viewer.viewport.pointFromPixel(windowPoint);


        if($$("Shape").getValue()=="rect"){
            rect.attr("width", Math.max(0, viewportPoint.x - +rect.attr("x")))
                .attr("height", Math.max(0, viewportPoint.y - +rect.attr("y")));

          }      

        if($$("Shape").getValue()=="circle"){
            cir.attr('r', Math.sqrt(  Math.pow( viewportPoint.x - cir.attr("cx"),2) + Math.pow( viewportPoint.y - cir.attr("cy"),2)  )  );
          }

        if($$("Shape").getValue()=="free"){
            pointsData.push({ "x":viewportPoint.x ,   "y":viewportPoint.y })
            freeShape.attr("d", lineFunction(pointsData));  
          }          
           
       }
      }

     function onMousePress(event) {
        if($$("SelectRegion").getValue())
          if(viewer.world.getItemCount()){
            var viewerX = event.position.x;
            var viewerY = event.position.y;
       
            var windowPoint = new OpenSeadragon.Point(viewerX, viewerY);
            var viewportPoint = viewer.viewport.pointFromPixel(windowPoint);

            var currentViewPortBoundary=viewer.world.getItemAt(viewer.world.getItemCount()-1).getBounds();
            if((currentViewPortBoundary.x<viewportPoint.x)&&(currentViewPortBoundary.y<viewportPoint.y))
            {
              if((viewportPoint.x<(currentViewPortBoundary.x+currentViewPortBoundary.width))&&(viewportPoint.y<(currentViewPortBoundary.y+currentViewPortBoundary.height)))
              {
                if($$("Shape").getValue()=="rect"){
                  rect =rootNode.append('rect')
                                .attr('x', viewportPoint.x)
                                .attr('y', viewportPoint.y)
                                .attr('width', 0)
                                .attr('height', 0)
                                .attr('id',currentShapeId.toString())
                                .attr('class', 'shapes')                                
                                .style('fill', 'none')
                                .style("opacity", 0.3)                               
                                .attr("originalfill", "yellow")     
                                .attr("selected", "no")                                    
                                .attr("currentfill", "yellow")   
                                .style('stroke', 'purple')
                                .style('stroke-width', 1)
                                .on('click',  handleMouseClick)                                
                                .on('mouseleave', handleRegionMouseLeave)  
                                .on('mouseover', handleRegionMouseOver);  

                  pointsData.push({ "x":viewportPoint.x ,   "y":viewportPoint.y, "width": 0,  "height": 0 })                                              
                }
              
                if($$("Shape").getValue()=="circle"){
                  cir= rootNode.append('circle')
                               .attr('cx', viewportPoint.x)
                               .attr('cy', viewportPoint.y)
                               .attr('r', 0)
                               .attr('id',currentShapeId.toString())   
                               .attr('class', 'shapes')                                                             
                               .style('fill', 'none')
                               .style("opacity", 0.3)                               
                               .attr("originalfill", "yellow") 
                               .attr("selected", "no")                                  
                               .attr("currentfill", "yellow")                                                              
                               .style('stroke', 'green')
                               .style('stroke-width', 0.005)
                               .on('click',  handleMouseClick)                               
                               .on('mouseleave', handleRegionMouseLeave)  
                               .on('mouseover', handleRegionMouseOver);   

                  pointsData.push({ "cx":viewportPoint.x,   "cy":viewportPoint.y,   "r": 0 })                                            
                }

                if($$("Shape").getValue()=="free"){
                  freeShape =rootNode.append('path')
                            .attr("d", 0)
                            .style("stroke", "blue")   
                            .style("stroke-width", 0.002)  
                            .attr('id', currentShapeId.toString())    
                            .attr('class', 'shapes')                                                      
                            .attr("originalfill", "yellow")
                            .attr("selected", "no")                               
                            .attr("currentfill", "yellow")                             
                            .style("fill", "yellow")                            
                            .style("opacity", 0.3)
                            .on('click',  handleMouseClick)
                            // .on('contextmenu', handleMouseRightClick)                             
                            .on('mouseleave', handleRegionMouseLeave)  
                            .on('mouseover', handleRegionMouseOver);    

                 pointsData.push({ "x":viewportPoint.x ,   "y":viewportPoint.y })                       
                }

             }
           } 
            }else{
             webix.message("Please load slide first")
            }

        }
      
     function onMouseRelease(event) {

      if($$("SelectRegion").getValue()&&(pointsData.length>0)) {

            if($$("Shape").getValue()=="rect"){
                 pointsData[0]["width"]=rect.attr("width");
                 pointsData[0]["height"]=rect.attr("height");
                 if((pointsData[0]["width"]!=0)&&(pointsData[0]["height"]!=0))
                    savePointsData(pointsData,$$("Shape").getValue());                 
            }      

            if($$("Shape").getValue()=="circle")
            {
                pointsData[0]["r"]=cir.attr("r");
                if(pointsData[0]["r"]!=0)     
                    savePointsData(pointsData,$$("Shape").getValue());
              
            }

            if($$("Shape").getValue()=="free")
             {
              if(pointsData.length>2){     // at least 3 points to draw a shape              
                pointsData.push({ "x":pointsData[0].x ,   "y":pointsData[0].y })
                freeShape.attr("d", lineFunction(pointsData)); 
                savePointsData(pointsData,$$("Shape").getValue()); 
               }     
             }

             pointsData=[]; 
             currentShapeId=currentShapeId+1;
       } 
     
      }



