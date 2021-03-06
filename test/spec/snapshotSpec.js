﻿describe("make Snapshot", function() {
  
  var snapshotWorker;
  var testImage;
  var canvas;
  
  var done = false;
  

  beforeEach(function(done) {
    snapshotWorker = new Worker('../assets/js/helpers/snapshot_worker.js');
    testImage = new Image();
    canvas = document.createElement('canvas');
  });
  
  it("should be calculate coordinates of color-cells of snapshot", function() {
    
    runs(function () {
      
      var videoNum = 6; // testImage has got six color-cells of color '#999999'
      var cellColor = '#999999';
      var coordArray = [];
      
      testImage.onload = function(e){
    
        canvas.width = e.target.naturalWidth;
        canvas.height = e.target.naturalHeight;
        
        canvas.getContext('2d').drawImage(testImage,0,0);
        
        snapshotWorker.postMessage({ image_data: (canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height)), 
                                     color: cellColor, 
                                     videoNum: videoNum 
                                  });
        
        snapshotWorker.onmessage = function(e){
          
          if(e.data.progress) // there is no need to show a progress-bar in an integration test
            return;
            
          e.data.coords.forEach(function(coord,index){
            if(!hasArrayGotCoord(coordArray,coord)){
              coordArray.push(coord);
            }
          });
          console.log('e.data: ',e.data);
          expect(videoNum).toEqual(coordArray.length); // there must be as many video-coords as there are video-tags
          
          done = true;
        };
          
      };
      
      testImage.src = '../assets/img/testImage.jpg';
      
    });
    
  });
  
  waitsFor(function(){
    return done;
  });
  
});

/* help-method for this integration test */
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