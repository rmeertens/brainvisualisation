 function processEdgesContent(httpRequest){
            console.log("proecessing edges");
            var edges = new Array();
            if (httpRequest.readyState == 4){
                // everything is good, the response is received
                if ((httpRequest.status == 200) || (httpRequest.status == 0)){
                    // Analys the contents using the stats library
                    // and display the results
                    CSVContents = httpRequest.responseText;
                    console.log(CSVContents);
                     var data = $.csv.toArrays(CSVContents);
                     
				     for(var row=1; row < data.length; row++) {
				      	edges[row-1] = new Array();
					    edges[row-1][0] = data[row][0] //xstart
					    edges[row-1][1] = data[row][1] //ystart
					    edges[row-1][2] = data[row][2] //zstart
					    edges[row-1][3] = data[row][3] //xend
					    edges[row-1][4] = data[row][4] //yend
					    edges[row-1][5] = data[row][5] //zend
					    edges[row-1][6] = data[row][6] //color
					    totalClusters = Math.max(totalClusters,data[row][6]);

					    
				      }
				      inputs.innerHTML = "Done loading edges!";
				     knownBrainEdges = edges;
				     init();
					animate();
                } else {
                alert(' => There was a problem with the request. ' 
                        + httpRequest.status + httpRequest.responseText);
                }
            }
        }
 // The variables used in the overlay with options
var VariableParametersBrainVisualisation = function() {
    this.message = 'something something';
    this.speed = 0.8;
    this.minimumCluster = 0;
    this.maximumCluster = 0;
    this.displayOutline = false;
};

function getCamera()
{
    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
            camera.position.z = 250;
            camera.position.y = -50;
    return camera;
}