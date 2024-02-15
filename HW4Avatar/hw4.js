
var canvas;
var gl;
var program;

var projectionMatrix; 
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;
var colorLoc;

var radius = 1.5;
var theta  = 0.0;
var phi    = Math.PI / 2.0;
var dr = 10.0 * Math.PI/180.0;

var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var eye;
var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;
var near = -10;
var far = 10;
var modelViewMatrixLoc, projectionMatrixLoc;

//animation variables
var tval = -1;
var jumps = 0;
var doAnime = true;


//texture variables
var texCoordsArray = [];
var colorsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var texSize = 256;
var numChecks = 8;
var c;

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var image1 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255;
            else c = 0;
            //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
            image1[4*i*texSize+4*j] = c;
            image1[4*i*texSize+4*j+1] = c;
            image1[4*i*texSize+4*j+2] = c;
            image1[4*i*texSize+4*j+3] = 255;
        }
    }
    
var image2 = new Uint8Array(4*texSize*texSize);

    // Create a checkerboard pattern
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            image2[4*i*texSize+4*j] = 127+127*Math.sin(0.1*i*j);
            image2[4*i*texSize+4*j+1] = 127+127*Math.sin(0.1*i*j);
            image2[4*i*texSize+4*j+2] = 127+127*Math.sin(0.1*i*j);
            image2[4*i*texSize+4*j+3] = 255;
           }
    }

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];


var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftEar = 3;
var rightUpperArmId = 4;
var rightEar = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var groundId = 11;


var torsoHeight = 1.5;
var torsoWidth = 2.5;
var xtorsoWidth = 5.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 2.5;
var headWidth = 1.8;

var torsoColor = vec4(1.0, 0.0, 0.0, 1.0);
var headColor = vec4(1.0, 1.0, 0.0, 1.0);
var upperArmColor = vec4(1.0, 0.0, 1.0, 1.0);
var lowerArmColor = vec4(0.0, 0.0, 1.0, 1.0);
var upperLegColor = vec4(1.0, 0.0, 1.0, 1.0);
var lowerLegColor = vec4(0.0, 0.0, 1.0, 1.0); 

var numNodes = 10;
var numAngles = 11;
var angle = 0;

var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {
    
    case torsoId:
    
    m = rotate(theta[torsoId], .5, 1, 0 );
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId: 
    case head1Id: 
    case head2Id:
    

	//DCH Comment: I think there is an error in the head
	// I have commented out the code that is not needed. We want the head to rotate about a point in base, not center
	
    //m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = translate(torsoWidth, torsoHeight, 0.0);
	m = mult(m, rotate(theta[head1Id], 1, 0, 0))
	m = mult(m, rotate(theta[head2Id], 0, 0, 1));
    //m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperArmId, leftEar);
    break;
    
    
    case leftUpperArmId:
    
    m = translate((torsoWidth+upperArmWidth)*.9, -torsoHeight*.01, -torsoWidth/2);
	m = mult(m, rotate(theta[leftUpperArmId]-180, 0, 0, 1));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, null );
    break;

    case rightUpperArmId:
    
    m = translate((torsoWidth+upperArmWidth)*.9, -torsoHeight*.01, torsoWidth/2);
	m = mult(m, rotate(theta[rightUpperArmId]-180, 0, 0, 1));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, null );
    break;
    
    case leftUpperLegId:
    
    m = translate(-(torsoWidth+upperLegWidth)*.9, -torsoHeight*.01, -torsoWidth/2);
	m = mult(m , rotate(theta[leftUpperLegId], 0, 0, 1));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
    
    m = translate(-(torsoWidth+upperLegWidth)*.9, -torsoHeight*.01, torsoWidth/2);
	m = mult(m, rotate(theta[rightUpperLegId], 0, 0, 1));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;
    
    case leftEar:

    m = translate(0.0, headHeight, -headWidth*.4);
    m = mult(m, rotate(theta[leftEar], 1, 0, 0));
    figure[leftEar] = createNode( m, leftear, rightEar, null );
    break;
    
    case rightEar:

    m = translate(0.0, headHeight, headWidth*.4);
    m = mult(m, rotate(theta[rightEar], 1, 0, 0));
    figure[rightEar] = createNode( m, rightear, null, null );
    break;
    
    case leftLowerLegId:

    m = translate(-1.0, upperLegHeight-2, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 0, 0, 1));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;
    
    case rightLowerLegId:

    m = translate(-1.0, upperLegHeight-2, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 0, 0, 1));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;
	
	case groundId:
	m = translate(0.0, 0.0, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 0, 0, 1));
    figure[rightLowerLegId] = createNode( m, ground, null, null );
    break;
    
    }

}

function traverse(Id) {
   
   if(Id == null) return; 
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0+tval, 0.5*torsoHeight+jumps, 0.0) );
	//instanceMatrix = mult(instanceMatrix, rotate(jumps*10, 0, 0, 1));
    instanceMatrix = mult(instanceMatrix, scale4( xtorsoWidth, torsoHeight, torsoWidth));
	//instanceMatrix = mult(instanceMatrix, rotate(jumps*10, 0, 0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(torsoColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0+tval, 0.5 * headHeight+jumps, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(headColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {
	
	//instanceMatrix = mult(modelViewMatrix, rotate(jumps*10, 0, 0, 1));
    instanceMatrix = mult(modelViewMatrix, translate(0.0-tval, 0.5 * upperArmHeight-jumps-1, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotate(jumps*10, 0, 0, 1));
	//instanceMatrix = mult(instanceMatrix, translate(1*(0.0-tval), 0.5 * upperArmHeight-jumps, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(upperArmColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftear() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0+tval, 0.5 * lowerArmHeight+jumps-.3, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotate(-jumps*10, 1, 0, 0));
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerArmColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0-tval, 0.5 * upperArmHeight-jumps-1, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotate(jumps*10, 0, 0, 1));
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(upperArmColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightear() {
	//instanceMatrix = mult(modelViewMatrix, rotate(jumps*10, 1, 0, 0));
    instanceMatrix = mult(modelViewMatrix, translate(0.0+tval, 0.5 * lowerArmHeight+jumps-.3, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotate(jumps*10, 1, 0, 0));
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
	//instanceMatrix = mult(instanceMatrix, rotate(jumps*10,0, 0, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerArmColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0-tval-1, 0.5 * upperLegHeight-jumps-1, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotate(jumps*10, 0, 0, 1));
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
	//instanceMatrix = mult(instanceMatrix, rotate(1, jumps*10 , 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(upperLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {
    //instanceMatrix = mult(modelViewMatrix, rotate(jumps*10, 0, 0, 1));
    instanceMatrix = mult(modelViewMatrix, translate( 0.0-tval-1, 0.5 * lowerLegHeight-jumps, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotate(jumps*10+90, 0, 0, 1));
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
	
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0-tval-1, 0.5 * upperLegHeight-jumps-1, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotate(jumps*10, 0, 0, 1));
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(upperLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0-tval-1, 0.5 * lowerLegHeight-jumps, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotate(jumps*10+90, 0, 0, 1));
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function ground() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, -3.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(10, .1, 10) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
	 colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]); 
	 colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);    
	colorsArray.push(vertexColors[a]);	 
     pointsArray.push(vertices[d]);
	colorsArray.push(vertexColors[a]);	 
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function configureTexture() {
    texture1 = gl.createTexture();       
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}



window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
	gl.enable(gl.DEPTH_TEST);
    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    
    gl.useProgram( program);

    instanceMatrix = mat4();
    
    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();

        
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
		
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix) );
    
    	
	colorLoc = gl.getUniformLocation(program, "color");
	gl.uniform4fv(colorLoc, flatten(torsoColor) );
    
    cube();
        
    vBuffer = gl.createBuffer();
	
	var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
        
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );	
		
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
	
	var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
	
	configureTexture();
    
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
            
    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
	
    
        document.getElementById("slider0").onchange = function() {
        theta[torsoId ] = event.srcElement.value;
        initNodes(torsoId);
    };
       
	document.getElementById("Button0").onclick = function() {
		tval = 0;
		jumps = 0;
		doAnime = !doAnime;
	};
	

    for(i=0; i<numNodes; i++) initNodes(i);
    
    render();
}


var render = function() {

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		 eye = vec3(radius*Math.sin(0)*Math.cos(phi), 
        radius*Math.sin(0)*Math.sin(phi), radius*Math.cos(0));
		
		if(doAnime)
		{
		 //create animation function
		 tval += 0.05;//increment by point 1
		jumps = -tval*tval +5;
            
			if(tval > 2.5)
			{
				tval = -2.5;//reset tval
			}
    
		//console.log("tval" ,tval);
		}
        traverse(torsoId);
		ground();//ground rendered seperatly
		
		//console.log("Eye", eye);
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
        requestAnimFrame(render);
}
