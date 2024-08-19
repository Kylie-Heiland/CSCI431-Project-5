var canvas;
var gl;

var numPositions = 12;

var positionsArray = [];
var colorsArray = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var flag = false;

var thetaLoc;

var vertices = [
    vec4(0.5, -0.2722, 0.2886, 1.0),
	vec4(0.0, -0.2772, -0.5773, 1.0),
	vec4(-0.5, -0.2722, 0.2886, 1.0),
	vec4(0.0, 0.5443, 0.0, 1.0)
];

var vertexColors = [
    vec4(0.0, 0.0, 1.0, 1.0), // blue
	vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(1.0, 0.0, 0.0, 1.0),  // red
	vec4(0.0, 0.0, 0.0, 1.0),  // black
];


var near = 0.3;
var far = 3.0;
var radius = 4.0;
var thetaEye = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);



function triple(a, b, c) {
    var indices = [a, b, c];

    for ( var i = 0; i < indices.length; ++i ) {
        positionsArray.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colorsArray.push(vertexColors[a]);
    }
}

function colorPyramid()
{
    triple(0, 1, 3); 
	triple(1, 2, 0); 
    triple(2, 0, 3);  
    triple(3, 1, 2); 
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect =  canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorPyramid();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
	thetaLoc = gl.getUniformLocation(program, "uTheta");
	
// sliders for viewing parameters

    document.getElementById("zFarSlider").onchange = function(event) {
        far = event.target.value;
    };
    document.getElementById("zNearSlider").onchange = function(event) {
        near = event.target.value;
    };
    document.getElementById("radiusSlider").onchange = function(event) {
       radius = event.target.value;
    };
    document.getElementById("thetaSlider").onchange = function(event) {
        thetaEye = event.target.value* Math.PI/180.0;
    };
    document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
    };
    document.getElementById("aspectSlider").onchange = function(event) {
        aspect = event.target.value;
    };
    document.getElementById("fovSlider").onchange = function(event) {
        fovy = event.target.value;
    };
	
	
	
	//event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
	document.getElementById( "toggleRotation" ).onclick = function () {
        flag = !flag;
    };

    render();
}


var render = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(thetaEye)*Math.cos(phi),
        radius*Math.sin(thetaEye)*Math.sin(phi), radius*Math.cos(thetaEye));
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);


	if(flag)
	{
		theta[axis] += 2.0;
	}
	console.log(theta);
	gl.uniform3fv(thetaLoc, theta);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
	console.log("HELLO");
    requestAnimationFrame(render);
}

