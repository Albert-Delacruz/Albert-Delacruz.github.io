
//by Albert De La Cruz
var canvas;
var gl;

var numVertices  = 36;

var pointsArray = [];
var colorsArray = [];
var cubeVertices =[];
var cubeColor =[];

var vertices1 = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
    ];

var vertexColors1 = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    ];

var near = 1;
// if near set to positive, then shrink/grow orth will clip geometry
//var near = 1; 
var far = 5;
var radius = 2.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;




var mvMatrix, pMatrix;
var mvMatrix2;
var modelView, projection;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var testm;
var axis = vec3(1,0,0); 
var spintheta = 0.0;

var scale = 0.2;//for scale slider
var offset = -0.5;//to place center of cube on origin
var speed = 0.2//for rotation speed
var pickCube = 0;//for center cube

// quad uses first index to set color for face

function quad1(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[b]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);    
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[d]); 
     colorsArray.push(vertexColors[a]);   
	 
	 
}

// Each face determines two triangles

function colorCube1()
{
    quad1( 1, 0, 3, 2 );
    quad1( 2, 3, 7, 6 );
    quad1( 3, 0, 4, 7 );
    quad1( 6, 5, 1, 2 );
    quad1( 4, 5, 6, 7 );
    quad1( 5, 4, 0, 1 );
}


window.onload = function init() {
	//pointsArray = window.cubeVertices;
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    //colorCube();
	createCube();//center cube
	createCube();//North cube
	createCube();//NE cube
	createCube();//east cube
	createCube();//SE cube
	createCube();//south cube
	createCube();//SW cube
	createCube();//west cube
	createCube();//NW cube
	
	// push the origin and make it black
	var origin = vec4(0.0, 0.0, 0.0, 1.0);
	pointsArray.push(origin); 
	 cubeVertices.push(origin);
	colorsArray.push(vertexColors[0]);
	 cubeColor.push(vertexColors[0]);
	console.log("Black point is origin");
	console.log("Canvas is [-1,1] x [-1, 1]");
	

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeColor), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
 
    modelView = gl.getUniformLocation( program, "modelView" );
	mvMatrix = mat4();
	
	// Event Listeners
	
	
	document.getElementById("ResetButton").onclick = function() {
		console.log("pressed reset");
		theta = [0,0,0];
		axis =0;
	};
	//scaler
	document.getElementById("scale").oninput = function(){
		scale = parseFloat(document.getElementById("scale").value);
		console.log("current scale value= ", typeof(scale), scale/2);
	};
	//rotation speed
	document.getElementById("rotation").oninput = function() {
		speed = parseFloat(document.getElementById("rotation").value);
		//spintheta = speed;
		console.log("current rotation speed= ",typeof(speed)," spin= ",typeof(spintheta));
	};
	//reset cubes
	document.getElementById("ResetButton").onclick = function() {
		pickCube = 0;
	};
	//getting the mouse event
    canvas.addEventListener("mousedown", function() {
		console.log("mousedown x,y = ",event.clientX,"  ", event.clientY);
		
		var screenx = event.clientX - canvas.offsetLeft;
		  var screeny = event.clientY - canvas.offsetTop;
		  
		  var posX = 2*screenx/canvas.width-1;
		  var posY = 2*(canvas.height-screeny)/canvas.height-1;
		  
          t = vec2(posX,posY);
		  
		  console.log("click returns x=",event.clientX,"  y=",event.clientY);
	      console.log("  offsetLeft=",canvas.offsetLeft);
	      console.log("  offsetTop=",canvas.offsetTop);
	      console.log("  window click x=",screenx,"  y=",screeny);
	      console.log("  clip coord x=",posX,"  y=",posY);
		  console.log("convert to clip coords",t);
		  
		  console.log("x",((.75-scale)*Math.cos(radians(180))),((scale+.75)*Math.cos(radians(180))) );
		  console.log("y",  (0.75-scale)*Math.sin(radians(180))-scale,(0.75+scale)*Math.sin(radians(180))+scale);
		  //for testing
		  if((posX > ((.75-scale)*Math.cos(radians(0))) && posX < ((scale+.75)*Math.cos(radians(0)))))
		  {
			  console.log("inbetween x");
			  //console.log("y",  (0.75-scale)*Math.sin(45)-scale,(0.75+scale)*Math.sin(45)+scale);
		  }
		  
		  if((posY > (0.75-scale)*Math.sin(radians(135)) && posY < (0.75+scale)*Math.sin(radians(135))))
		  {
			  console.log("inbetween y");
		  }
		  //find if the click is in the radius of one of the cubes
		  //parameteric eq for a circle
		  //x = x1 + r*cos(t)
		  //y = y1 + r*sin(t)
		  //checking the East cube
		  if((posX > ((.75-scale)*Math.cos(radians(0))) && posX < ((scale+.75)*Math.cos(radians(0))))
					&& (posY > (0.75-scale)*Math.sin(radians(0))-scale && posY < (0.75+scale)*Math.sin(radians(0))+scale))
		  {
			  console.log("east");
			  pickCube = 1;
		  }// NE
		  else if((posX > ((.75-scale)*Math.cos(radians(45))) && posX < ((scale+.75)*Math.cos(radians(45))))
					&& (posY > (0.75-scale)*Math.sin(radians(45)) && posY < (0.75+scale)*Math.sin(radians(45)))){
			  console.log("NE");
			  pickCube = 2;
		  }//N
		  else if((posX > ((.75-scale)*Math.cos(radians(90))-scale) && posX < ((scale+.75)*Math.cos(radians(90))+scale))
					&& (posY > (0.75-scale)*Math.sin(radians(90)) && posY < (0.75+scale)*Math.sin(radians(90)))){
			  console.log("N");
			  pickCube = 3;
		  }//NW
		  else if((posX < ((.75-scale)*Math.cos(radians(135))) && posX > ((scale+.75)*Math.cos(radians(135))))
					&& (posY > (0.75-scale)*Math.sin(radians(135)) && posY < (0.75+scale)*Math.sin(radians(135)))){
			  console.log("NW");
			  pickCube = 4;
		  }//W
		  else if((posX < ((.75-scale)*Math.cos(radians(180))) && posX > ((scale+.75)*Math.cos(radians(180))))
					&& (posY > (0.75-scale)*Math.sin(radians(180))-scale && posY < (0.75+scale)*Math.sin(radians(180))+scale)){
			  console.log("W");
			  pickCube = 5;
		  }//SW
		  else if((posX < ((.75-scale)*Math.cos(radians(225))) && posX > ((scale+.75)*Math.cos(radians(225))))
					&& (posY < (0.75-scale)*Math.sin(radians(225)) && posY >(0.75+scale)*Math.sin(radians(225)))){
			  console.log("SW");
			  pickCube = 6;
		  }//S
		  else if((posX > ((.75-scale)*Math.cos(radians(270))-scale) && posX < ((scale+.75)*Math.cos(radians(270))+scale))
					&& (posY < (0.75-scale)*Math.sin(radians(270)) && posY > (0.75+scale)*Math.sin(radians(270)))){
			  console.log("S");
			  pickCube = 7;
		  }//SE
		  else if((posX > ((.75-scale)*Math.cos(radians(315))) && posX < ((scale+.75)*Math.cos(radians(315))))
					&& (posY < (0.75-scale)*Math.sin(radians(315)) && posY > (0.75+scale)*Math.sin(radians(315)))){
			  console.log("SE");
			  pickCube = 8;
		  }
	});
       
    render();
}


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
		spintheta += speed;
		//console.log("currentSpin = " , spintheta);
			
        //cube center
		//mvMatrix2 = mat4();
		//mvMatrix2 = mult(scalem(scale, scale, scale), translate(0, 0, 0));
		mvMatrix2 = mat4();
		
		//mvMatrix2 = mult(mvMatrix2, rotateZ(45));//place in proper position on the circle
		mvMatrix2 = mult(mvMatrix2, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		//mvMatrix2 = mult(mvMatrix2, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix2 = mult(mvMatrix2, translate(scale/2,scale/2,-scale/2));//move box center to origin
		switch(pickCube){//changes which cube the center cube copies
			case 1://E
				mvMatrix2 = mult(mvMatrix2, rotate(spintheta,1.0,0.0,0.0));//rotate box
				break;
			case 2://NE
				mvMatrix2 = mult(mvMatrix2, rotateZ(45));//place in proper position on the circle
				mvMatrix2 = mult(mvMatrix2, rotate(spintheta,1.0,0.0,1.0));//rotate box
				break;
			case 3://N
				mvMatrix2 = mult(mvMatrix2, rotateZ(90));//place in proper position on the circle
				mvMatrix2 = mult(mvMatrix2, rotate(spintheta,1.0,0.0,0.0));//rotate box
				break;
			case 4://NW
				mvMatrix2 = mult(mvMatrix2, rotateZ(135));//place in proper position on the circle
				mvMatrix2 = mult(mvMatrix2, rotate(spintheta,1.0,0.0,1.0));//rotate box
				break;
			case 5://W
				mvMatrix2 = mult(mvMatrix2, rotateZ(180));//place in proper position on the circle
				mvMatrix2 = mult(mvMatrix2, rotate(spintheta,1.0,0.0,0.0));//rotate box
				break;
			case 6://SW
				mvMatrix2 = mult(mvMatrix2, rotateZ(225));//place in proper position on the circle
				mvMatrix2 = mult(mvMatrix2, rotate(spintheta,1.0,0.0,1.0));//rotate box
				break;
			case 7://S
				mvMatrix2 = mult(mvMatrix2, rotateZ(270));//place in proper position on the circle
				mvMatrix2 = mult(mvMatrix2, rotate(spintheta,1.0,0.0,0.0));//rotate box
				break;
			case 8://SE
				mvMatrix2 = mult(mvMatrix2, rotateZ(315));//place in proper position on the circle
				mvMatrix2 = mult(mvMatrix2, rotate(spintheta,1.0,0.0,1.0));//rotate box
				break;
				
		}
		mvMatrix2 = mult(mvMatrix2, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix2 = mult(mvMatrix2, scalem(scale, scale, scale));//scale box last
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix2) );        
        gl.drawArrays( gl.TRIANGLES, 0, numVertices );
		
		//cube N
		//N = SRzRyRxTn
		//N = I
		
		//N = NRz
		//N = NRy
		//N = NRx
		//N = NT
		//N = NS
		mvMatrix3 = mat4();
		mvMatrix3 = mult(mvMatrix3, rotateZ(90));//place in proper position on the circle
		mvMatrix3 = mult(mvMatrix3, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		mvMatrix3 = mult(mvMatrix3, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix3 = mult(mvMatrix3, translate(scale/2,scale/2,-scale/2));//move box center to origin
		mvMatrix3 = mult(mvMatrix3, rotate(spintheta,1.0,0.0,0.0));//rotate box
		mvMatrix3 = mult(mvMatrix3, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix3 = mult(mvMatrix3, scalem(scale, scale, scale));//scale box last
		// = mult(mvMatrix3, rotateZ(-90));//get everything back straight
		//C=I
		//C=CT-1
		//C=CR
		//C=CT/
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix3) );        
        gl.drawArrays( gl.TRIANGLES, numVertices, numVertices );
		
		
		//cube NE
		mvMatrix4 = mat4();
		mvMatrix4 = mult(mvMatrix4, rotateZ(45));//place in proper position on the circle
		mvMatrix4 = mult(mvMatrix4, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		mvMatrix4 = mult(mvMatrix4, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix4 = mult(mvMatrix4, translate(scale/2,scale/2,-scale/2));//move box center to origin
		mvMatrix4 = mult(mvMatrix4, rotate(spintheta,1.0,0.0,1.0));//rotate box
		mvMatrix4 = mult(mvMatrix4, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix4 = mult(mvMatrix4, scalem(scale, scale, scale));//scale box last
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix4) );        
        gl.drawArrays( gl.TRIANGLES, numVertices*2, numVertices );
		
		//cube E
		mvMatrix5 = mat4();
		mvMatrix5 = mult(mvMatrix5, rotateZ(0));//place in proper position on the circle
		mvMatrix5 = mult(mvMatrix5, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		mvMatrix5 = mult(mvMatrix5, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix5 = mult(mvMatrix5, translate(scale/2,scale/2,-scale/2));//move box center to origin
		mvMatrix5 = mult(mvMatrix5, rotate(spintheta,1.0,0.0,0.0));//rotate box
		mvMatrix5 = mult(mvMatrix5, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix5 = mult(mvMatrix5, scalem(scale, scale, scale));//scale box last
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix5) );        
        gl.drawArrays( gl.TRIANGLES, numVertices*3, numVertices );
		
		//cube SE 315
		mvMatrix6 = mat4();
		mvMatrix6 = mult(mvMatrix6, rotateZ(315));//place in proper position on the circle
		mvMatrix6 = mult(mvMatrix6, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		mvMatrix6 = mult(mvMatrix6, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix6 = mult(mvMatrix6, translate(scale/2,scale/2,-scale/2));//move box center to origin
		mvMatrix6 = mult(mvMatrix6, rotate(spintheta,1.0,0.0,1.0));//rotate box
		mvMatrix6 = mult(mvMatrix6, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix6 = mult(mvMatrix6, scalem(scale, scale, scale));//scale box last
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix6) );        
        gl.drawArrays( gl.TRIANGLES, numVertices*4, numVertices );
		
		//cube S 270
		mvMatrix7 = mat4();
		mvMatrix7 = mult(mvMatrix7, rotateZ(270));//place in proper position on the circle
		mvMatrix7 = mult(mvMatrix7, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		mvMatrix7 = mult(mvMatrix7, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix7 = mult(mvMatrix7, translate(scale/2,scale/2,-scale/2));//move box center to origin
		mvMatrix7 = mult(mvMatrix7, rotate(spintheta,1.0,0.0,0.0));//rotate box
		mvMatrix7 = mult(mvMatrix7, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix7 = mult(mvMatrix7, scalem(scale, scale, scale));//scale box last
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix7) );        
        gl.drawArrays( gl.TRIANGLES, numVertices*5, numVertices );
		
		//cube SW 225
		mvMatrix8 = mat4();
		mvMatrix8 = mult(mvMatrix8, rotateZ(225));//place in proper position on the circle
		mvMatrix8 = mult(mvMatrix8, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		mvMatrix8 = mult(mvMatrix8, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix8 = mult(mvMatrix8, translate(scale/2,scale/2,-scale/2));//move box center to origin
		mvMatrix8 = mult(mvMatrix8, rotate(spintheta,1.0,0.0,1.0));//rotate box
		mvMatrix8 = mult(mvMatrix8, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix8 = mult(mvMatrix8, scalem(scale, scale, scale));//scale box last
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix8) );        
        gl.drawArrays( gl.TRIANGLES, numVertices*6, numVertices );
		
		//cube W 180
		mvMatrix9 = mat4();
		mvMatrix9 = mult(mvMatrix9, rotateZ(180));//place in proper position on the circle
		mvMatrix9 = mult(mvMatrix9, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		mvMatrix9 = mult(mvMatrix9, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix9 = mult(mvMatrix9, translate(scale/2,scale/2,-scale/2));//move box center to origin
		mvMatrix9 = mult(mvMatrix9, rotate(spintheta,1.0,0.0,0.0));//rotate box
		mvMatrix9 = mult(mvMatrix9, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix9 = mult(mvMatrix9, scalem(scale, scale, scale));//scale box last
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix9) );        
        gl.drawArrays( gl.TRIANGLES, numVertices*7, numVertices );
		
		//cube NW 135
		mvMatrix10 = mat4();
		mvMatrix10 = mult(mvMatrix10, rotateZ(135));//place in proper position on the circle
		mvMatrix10 = mult(mvMatrix10, translate(-scale/2,(-scale/2),(scale/2)));//place box on origin
		mvMatrix10 = mult(mvMatrix10, translate(0.75,(0),0));//move box away from the center
		//rotate around the center
		mvMatrix10 = mult(mvMatrix10, translate(scale/2,scale/2,-scale/2));//move box center to origin
		mvMatrix10 = mult(mvMatrix10, rotate(spintheta,1.0,0.0,1.0));//rotate box
		mvMatrix10 = mult(mvMatrix10, translate(-scale/2,-scale/2,scale/2));//move box center to original position
		mvMatrix10 = mult(mvMatrix10, scalem(scale, scale, scale));//scale box last
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix10) );        
        gl.drawArrays( gl.TRIANGLES, numVertices*8, numVertices );
		
		
		// draw the origin
		mvMatrix2 = mat4();
		gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix2) );
		gl.drawArrays( gl.POINTS, numVertices*9, 1 );
		
		 
		
        requestAnimFrame(render);
    }
