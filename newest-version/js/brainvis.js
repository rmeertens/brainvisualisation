function processEdgesContent(httpRequest) {
    console.log("proecessing edges");
    var edges = new Array();
    if (httpRequest.readyState === 4){
        // everything is good, the response is received
        if ((httpRequest.status == 200) || (httpRequest.status == 0)){
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
            initialisedEdges=true;
			init();
        }
        else {
            alert(' => There was a problem with the request. ' + httpRequest.status + httpRequest.responseText);
        }
    }
}

function processNodesContent(httpRequest) {
    console.log("proecessing nodes?");
    
    if (httpRequest.readyState === 4){
        // everything is good, the response is received
        if ((httpRequest.status == 200) || (httpRequest.status == 0)){
            console.log("Really processing nodes");
            // Add each node to a list of lists
            CSVContents = httpRequest.responseText;
            var data = $.csv.toArrays(CSVContents);
            for(var row=1; row < data.length; row++) {
			   	nodes[row-1] = new Array();
			    nodes[row-1][0] = data[row][1] //x
			    nodes[row-1][1] = data[row][2] //y
			    nodes[row-1][2] = data[row][3] //z	
			}
			inputs.innerHTML = "Done loading nodes!";
			knownBrainNodes = nodes;
            initialisedNodes=true;
			init();
        }
        else {
            alert(' => There was a problem with the request. ' + httpRequest.status + httpRequest.responseText);
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
    camera.position.x = -52;
    camera.position.z = 200;
    camera.position.y = 16;
    return camera;
}

function processParticles(geometryPerCluster, groupColors, particles)
{
    for (var i = 0; i < knownBrainEdges.length; i++) {
                edge = knownBrainEdges[i];
                var material; //= pMaterial;
                particle = new THREE.Sprite(material);
                particle.position.x = edge[0];
                particle.position.y = edge[1];
                particle.position.z = edge[2];
                geometryPerCluster[edge[6]].vertices.push(particle.position);

                particle = new THREE.Sprite(material);
                particle.position.x = edge[3];
                particle.position.y = edge[4];
                particle.position.z = edge[5];
    geometryPerCluster[edge[6]].vertices.push(particle.position);

                var color = new THREE.Color(0xffffff);
                color.setHSL(edge[6] / totalClusters, 2.0, 0.5);
                groupColors[edge[6]].push(color);
                groupColors[edge[6]].push(color);

                particle = new THREE.Vector3(edge[3], edge[4], edge[5]);

                particles.vertices.push(particle);

            }
}

function addVertexes(geometryPerCluster,groupColors)
{
    // Add a color to each group of vertexes and add them to the scene
            for (var i = 0; i < totalClusters; i++) {
                geometryPerCluster[i].colors = groupColors[i];
                var lineMaterial = new THREE.LineBasicMaterial({
                    vertexColors: geometryPerCluster[i].colors,
                    linewidth: 1,
                    opacity: 0.4, 
                    blending: THREE.AdditiveBlending, 
                    transparent: true
                });
                allLines[i] = new THREE.Line(geometryPerCluster[i], lineMaterial, THREE.LinePieces);
                allLines[i].visible = true;
                scene.add(allLines[i]);
            }   
}

// This function initialises all the lines. 
// It creates the line objects, adds the color, and retuns a list with all lines. 
function initialiseAllLines(totalClusters,groupColors,geometryPerCluster)
{   
    for (var i = 0; i < totalClusters; i++) {
            geometryPerCluster[i].colors = groupColors[i];
            var lineMaterial = new THREE.LineBasicMaterial({
                vertexColors: geometryPerCluster[i].colors,
                linewidth: 1,
                opacity: 0.4, 
                blending: THREE.AdditiveBlending, 
                transparent: true
            });
            allLines[i] = new THREE.Line(geometryPerCluster[i], lineMaterial, THREE.LinePieces);
            allLines[i].visible = true;
        }  
    return allLines;
}