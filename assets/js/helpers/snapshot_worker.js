﻿
var getNewCoordinates = function(imgData, hexColor, formerCoords, cell){ // hexColor #999999
    
  var startX = 0, startY = 0, endX = null;
  
  for (var y=startY; y < imgData.height; y++){
    
    for (var x=startX; x < imgData.width; x++){
      
      var offset = (y * imgData.width + x) * 4;
      var offsetLastPosX = x > 0 ? (y * imgData.width + (x-1)) * 4 : 0;
      
      // is pixel on the left upper corner of cell
      if( !hasArrayGotCoord(formerCoords, { startX: x, startY: y}) && 
          getHexColor(imgData.data[offset], imgData.data[offset+1], imgData.data[offset+2]) === hexColor &&
          getHexColor(imgData.data[offset-4], imgData.data[offset-3], imgData.data[offset-2]) !== hexColor && 
          getHexColor(imgData.data[offset-(imgData.width*4)], imgData.data[offset-(imgData.width*4)+1], imgData.data[offset-(imgData.width*4)+2]) !== hexColor ){
        
        startX = x;
        startY = y;
        
        if(cell.width){
          return { startX: startX, startY: startY };
        }
      }
      // is pixel on the right side of cell
      else if( !cell.width && 
               getHexColor(imgData.data[offset], imgData.data[offset+1], imgData.data[offset+2]) !== hexColor &&
               getHexColor(imgData.data[offsetLastPosX], imgData.data[offsetLastPosX+1], imgData.data[offsetLastPosX+2]) === hexColor )
      {
        
        endX = x;
        
        // is pixel on the right lower corner of cell
        if( getHexColor(imgData.data[offsetLastPosX+(imgData.width*4)-4], imgData.data[offsetLastPosX+(imgData.width*4)-3], imgData.data[offsetLastPosX+(imgData.width*4)-2]) !== hexColor ){
          
          if(!cell.width){
            cell.width = endX - startX;
            cell.height = y - startY;
          }
          
        }
      }
      
    }
    
  }
  
  return { startX: startX, startY: startY };
};


onmessage = function(event){
  
  var data = event.data;
  var videoCoords = [];
  
  var cell = {};
  cell.width = null;
  cell.height = null;
  
  for(var v=0; v < data.videoNum; v++){
    
    var alteredImageData = getNewCoordinates(data.image_data, data.color, videoCoords, cell);
    
    videoCoords.push(alteredImageData);
    
    postMessage({ progress: videoCoords.length/data.videoNum });
  }
  
  postMessage({ coords: videoCoords, cellWidth: cell.width, cellHeight: cell.height });
  
};

  
var getHexColor = function(red,green,blue){
  if(red && green && blue)
    return '#' + red.toString(16) + green.toString(16) + blue.toString(16);
};

var hasArrayGotCoord = function(array,_coord){
  
  var hasGot = false;
  
  array.forEach(function(coord,index){
  
    if(coord.startX === _coord.startX && coord.startY === _coord.startY)
      hasGot = true;
      
  });
  
  if(hasGot)
    return true;
  else
    return false;
};