
function startLoadingDataUsingFirebase(){
    startLoadingData('edgesCoordinates.csv','nodes1sup.csv');
    document.getElementById("info").innerHTML="";
    var username = getQueryVariable("username");//github%3A5749627
    var brainid = getQueryVariable("brainid");//-K2TobPHJzU_8AqK9r3U
    var urlthing="https://connectivityme.firebaseio.com/users/"+username+"/brains";
    var myFirebaseRef = new Firebase(urlthing);
    
    myFirebaseRef.child(brainid).on("value",      
       function(snapshot) {
            //startLoadingData(snapshot.val().edgesurl,snapshot.val().nodesurl);
    }   );
}
                                                  
function startLoadingData(nameEdges, nameNodes)
{
    console.log(nameEdges+" nodes: "+nameNodes);

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
            processEdgesContent(httpRequest);
        }
        // Send the request
    httpRequest.open("GET", 'edgesCoordinates.csv', true);
    httpRequest.send(null);



    var httpRequest2 = new XMLHttpRequest();
    console.log("httpRequest2");
    console.log(httpRequest2);
    
    httpRequest2.onreadystatechange = function() {
            processNodesContent(httpRequest2);
        
     
        }
    httpRequest2.onprogress = function(pe){
        console.log("progress");   
        console.log(pe.lengthComputable);
        console.log(pe.loaded);
        console.log(pe.total);
    };
        // Send the request
    httpRequest2.open("GET", 'node1sup.csv', true);
    httpRequest2.send(null);
}


function generateControllerUpperRight()
{
    gui = new dat.GUI();
    var f2 = gui.addFolder('Min and max clusters');
    var minController = f2.add(text, 'minimumCluster', 0, totalClusters).step(1).listen();
    var maxController = f2.add(text, 'maximumCluster', 0, totalClusters).step(1).listen();
    var isBrainOn = f2.add(text,"displayCompleteBrain");
    f2.open();

    isBrainOn.onChange(function(value)
    {
        completeBrainParticleSystem.visible = text.displayCompleteBrain;

    });
    maxController.onChange(function(value) {
        if (text.minimumCluster > value) {
            text.minimumCluster = value;
        }
    });

    minController.onChange(function(value) {
        
        if (text.maximumCluster < value) {
            text.maximumCluster = value;
        }
    });
    text.maximumCluster = totalClusters;
}
    
    

function addFloorAndLight(){
      var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.5);
      scene.add(light);

      var texture = THREE.ImageUtils.loadTexture(
        'textures/patterns/checker.png'
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat = new THREE.Vector2(50, 50);
      texture.anisotropy = renderer.getMaxAnisotropy();

      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
      });

      var geometry = new THREE.PlaneGeometry(1000, 1000);

      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = -80;
      scene.add(mesh);
   
}

  
    function normalCameraInit() {
      renderer = new THREE.WebGLRenderer();
      element = renderer.domElement;
      container = document.getElementById('example');
      container.appendChild(element);


      scene = new THREE.Scene();

       camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.set(0, 10, 0);
      scene.add(camera);

      controls = new THREE.OrbitControls(camera, element);
      controls.target.set(
        locationMiddleX,
        locationMiddleY,
        locationMiddleZ
      );
      controls.noZoom = false;
      controls.noPan = false;

        addFloorAndLight();

      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);
    }
      

  function startLoadingTimer()
    {
      count=count-10;
      if (count <= 0)
      {
         clearInterval(counter);
         //counter ended, do something here
          document.getElementById("info").innerHTML="";
          startLoadingDataUsingFirebase();
        
         return;
      }

      //Do code for showing the number of seconds here
        if(document.getElementById("timer")){
         document.getElementById("timer").innerHTML=count + " miliseconds"; 
        }
    }
      

function processEdgesContent(httpRequest) {
    //console.log("proecessing edges");
    var edges = new Array();
    if (httpRequest.readyState === 4){
        // everything is good, the response is received
        if ((httpRequest.status == 200) || (httpRequest.status == 0)){
            CSVContents = httpRequest.responseText;
            //console.log(CSVContents);
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
			//inputs.innerHTML = "Done loading edges!";
			knownBrainEdges = edges;
            initialisedEdges=true;
			//init();
              addAllNodes();
        }
        else {
            alert(' => There was a problem with the request. ' + httpRequest.status + httpRequest.responseText);
        }
    }
}

function processNodesContent(httpRequest) {
    
    if (httpRequest.readyState === 4){
        // everything is good, the response is received
        if ((httpRequest.status == 200) || (httpRequest.status == 0)){
 
            // Add each node to a list of lists
            CSVContents = httpRequest.responseText;
            var data = $.csv.toArrays(CSVContents);
            for(var row=1; row < data.length; row++) {
			   	nodes[row-1] = new Array();
			    nodes[row-1][0] = data[row][1] //x
			    nodes[row-1][1] = data[row][2] //y
			    nodes[row-1][2] = data[row][3] //z	
			}
			
			knownBrainNodes = nodes;
            initialisedNodes=true;
			addAllNodes();
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
    this.displayCompleteBrain=true;
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