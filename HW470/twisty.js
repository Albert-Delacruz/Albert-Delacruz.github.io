//
//CSE 470 HW 1 TWISTY!  
//
/*
Written by: HW470: Albert De La Cruz
Date: Jan 2021

Description: 
This program defines the shape of the graphics object using 2D vertices,
colors all of the vertices, configures WebGL, calculates the rotaion for the object,
then sends everything to the vertex shader in twisty.html
*/

var canvas;
var gl;

//store the vertices
//Each triplet represents one triangle
var vertices = [];

//store a color for each vertex
var colors = [];

//HW470: control the rotation
//(Your variable here)
var theta = 0.0;
var thetaLoc;
var direction = true;

//HW470: control the redraw rate
var delay = 30;

// =============== function init ======================
 
// When the page is loaded into the browser, start webgl stuff
window.onload = function init()
{
	// notice that gl-canvas is specified in the html code
    canvas = document.getElementById( "gl-canvas" );
    
	// gl is a canvas object
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Track progress of the program with print statement
    console.log("Opened canvas");
        
    //HW470:
    // Define  data for object 
	// See HW specs for number of vertices  required
	// Recommendation: each set of three points corresponds to a triangle.
	// Here is one triangle. You can use parametric equations, for example of a circle to generate (x,y) values
	
    vertices = [
		//eyes
        vec2( 0.1, 0.5 ), 
        vec2( 0.25, 0.5 ),
        vec2( 0.175, 0.6 ),
		vec2( -0.1, 0.5 ), 
        vec2( -0.25, 0.5 ),
        vec2( -0.175, 0.6 ),
		//mouth
		vec2( 0.0, 0.15 ), 
        vec2( 0.05, 0.2 ),
        vec2( -0.05, 0.2 ),
		vec2( 0.0, 0.25 ), 
        vec2( 0.05, 0.2 ),
        vec2( -0.05, 0.2 ),
		//head
		vec2( 0.0, 0.85 ), 
        vec2( 0.175, 0.8 ),
        vec2( -0.175, 0.8 ),//top of head
		vec2( -0.175, 0.8 ),
		vec2( 0.0, 0.5 ),
		vec2( -0.4, 0.5 ),
		vec2( 0.175, 0.8 ),
		vec2( 0.0, 0.5 ),
		vec2( 0.4, 0.5 ),
		vec2( -0.175, 0.8 ),
		vec2( 0.0, 0.5 ),
		vec2( 0.175, 0.8 ),
		
		vec2( -0.4, 0.2 ),//mid head
		vec2( 0.0, 0.2 ),
		vec2( -0.4, 0.5 ),
		vec2( 0.4, 0.2 ),
		vec2( 0.0, 0.2 ),
		vec2( 0.4, 0.5 ),
		vec2( 0.4, 0.5 ),
		vec2( 0.0, 0.2 ),
		vec2( -0.4, 0.5 ),
		
		vec2( -0.4, 0.2 ),//bot head
		vec2( 0.0, 0.2 ),
		vec2( -0.2, 0.0 ),
		vec2( 0.4, 0.2 ),
		vec2( 0.0, 0.2 ),
		vec2( 0.2, 0.0 ),
		vec2( -0.2, 0.0 ),
		vec2( 0.0, 0.2 ),
		vec2( 0.2, 0.0 ),
		vec2( -0.15, -0.2 ),
		vec2( 0.0, 0.0 ),
		vec2( -0.2, 0.0 ),
		vec2( 0.15, -0.2 ),
		vec2( 0.0, 0.0 ),
		vec2( 0.2, 0.0 ),
		vec2( -0.15, -0.2 ),
		vec2( 0.0, 0.0 ),
		vec2( 0.15, -0.2 ),
		
		//tentacle 1
		vec2( -0.1, -0.15 ),
		vec2( 0.0, -0.15 ),
		vec2( -0.025, -0.25 ),
		vec2( -0.1, -0.15 ),
		vec2( -0.1, -0.25 ),
		vec2( -0.025, -0.25 ),
		vec2( -0.025, -0.35 ),
		vec2( -0.1, -0.25 ),
		vec2( -0.025, -0.25 ),
		vec2( -0.025, -0.35 ),
		vec2( -0.1, -0.25 ),
		vec2( -0.1, -0.35 ),
		vec2( -0.025, -0.35 ),
		vec2( -0.1, -0.35 ),
		vec2( -0.05, -0.45 ),
		vec2( -0.15, -0.45 ),
		vec2( -0.1, -0.35 ),
		vec2( -0.05, -0.45 ),
		vec2( -0.15, -0.45 ),
		vec2( -0.05, -0.55 ),
		vec2( -0.05, -0.45 ),
		vec2( -0.15, -0.45 ),
		vec2( -0.05, -0.55 ),
		vec2( -0.1, -0.55 ),
		vec2( -0.075, -0.65 ),
		vec2( -0.05, -0.55 ),
		vec2( -0.1, -0.55 ),
		vec2( -0.075, -0.65 ),
		vec2( -0.15, -0.65 ),
		vec2( -0.1, -0.55 ),
		vec2( -0.075, -0.65 ),//tentacle
		vec2( -0.15, -0.65 ),
		vec2( -0.1, -0.85 ),
		
		//tentacle 2
		vec2( 0.1, -0.15 ),
		vec2( 0.0, -0.15 ),
		vec2( 0.025, -0.25 ),
		vec2( 0.1, -0.15 ),
		vec2( 0.1, -0.25 ),
		vec2( 0.025, -0.25 ),
		vec2( 0.025, -0.35 ),
		vec2( 0.1, -0.25 ),
		vec2( 0.025, -0.25 ),
		vec2( 0.025, -0.35 ),
		vec2( 0.1, -0.25 ),
		vec2( 0.1, -0.35 ),
		vec2( 0.025, -0.35 ),
		vec2( 0.1, -0.35 ),
		vec2( 0.05, -0.45 ),
		vec2( 0.15, -0.45 ),
		vec2( 0.1, -0.35 ),
		vec2( 0.05, -0.45 ),
		vec2( 0.15, -0.45 ),
		vec2( 0.05, -0.55 ),
		vec2( 0.05, -0.45 ),
		vec2( 0.15, -0.45 ),
		vec2( 0.05, -0.55 ),
		vec2( 0.1, -0.55 ),
		vec2( 0.075, -0.65 ),
		vec2( 0.05, -0.55 ),
		vec2( 0.1, -0.55 ),
		vec2( 0.075, -0.65 ),
		vec2( 0.15, -0.65 ),
		vec2( 0.1, -0.55 ),
		vec2( 0.075, -0.65 ),//tentacle
		vec2( 0.15, -0.65 ),
		vec2( 0.1, -0.85 ),
		
		//tentacle 3
		vec2(-0.15,-0.15),
		vec2(-0.1,-0.15),
		vec2(-0.1,-0.25),
		vec2(-0.15,-0.15),
		vec2(-0.2,-0.3),
		vec2(-0.1,-0.25),
		vec2(-0.2,-0.4),
		vec2(-0.2,-0.3),
		vec2(-0.1,-0.25),
		vec2(-0.2,-0.4),
		vec2(-0.2,-0.3),
		vec2(-0.35,-0.45),
		vec2(-0.2,-0.4),
		vec2(-0.2,-0.5),
		vec2(-0.35,-0.45),
		vec2(-0.2,-0.6),
		vec2(-0.2,-0.5),
		vec2(-0.35,-0.45),
		
				//tentacle 4
		vec2(0.15,-0.15),
		vec2(0.1,-0.15),
		vec2(0.1,-0.25),
		vec2(0.15,-0.15),
		vec2(0.2,-0.3),
		vec2(0.1,-0.25),
		vec2(0.2,-0.4),
		vec2(0.2,-0.3),
		vec2(0.1,-0.25),
		vec2(0.2,-0.4),
		vec2(0.2,-0.3),
		vec2(0.35,-0.45),
		vec2(0.2,-0.4),
		vec2(0.2,-0.5),
		vec2(0.35,-0.45),
		vec2(0.2,-0.6),
		vec2(0.2,-0.5),
		vec2(0.35,-0.45),
		
    ];
	 
	
	//HW470: Create colors for the core and outer parts
	// See HW specs for the number of colors needed
	console.log("vertices=",vertices.length);
	for(var i=0; i < 24; i++) {
		colors.push(vec3(1.0, 0.0, 0.0));
		//console.log("color!");
	};
	for(var i=24; i < 33; i++) {
		colors.push(vec3(0.0, 1.0, 0.0));
		//console.log("color!");
	};
	for(var i=33; i < 48; i++) {
		colors.push(vec3(0.0, 0.0, 1.0));
		console.log("color!");
	};
	for(var i=48; i < 117; i++) {
		colors.push(vec3(1.0, 0.0, 1.0));
		console.log("color!");
	};
	for(var i=117; i < vertices.length; i++) {
		colors.push(vec3(0.0, 1.0, 1.0));
		console.log("color!");
	};
	 
	 
	
	
	// HW470: Print the input vertices and colors to the console
	console.log("Input vertices and colors:");
	for(var i = 0; i < vertices.length; i++) {
		console.log("Vertice[" + i+"]: "+ vertices[i]);
	}
	for(var i = 0; i<colors.length; i++) {
		console.log("Color[" + i+"]: "+ colors[i]);
	}
	 
	 

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	// Background color to white
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Define shaders to use  
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
	//
	// color buffer: create, bind, and load
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
	// Associate shader variable for  r,g,b color
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    // vertex buffer: create, bind, load
    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate shader variables for x,y vertices	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	//HW470: associate shader explode variable ("Loc" variables defined here) 
    
    thetaLoc = gl.getUniformLocation( program, "theta" );

    console.log("Data loaded to GPU -- Now call render");

    render();
};


// =============== function render ======================

function render()
{
    // clear the screen 
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	//HW470: send uniform(s) to vertex shader

	 if(theta < 0)//subtract theta if its more than 0
	 {	
		direction = true;
	 }
	 else if(theta > 1.75)//add to theta if its bigger -3, about 180 degrees
	 {
		direction = false;
	 }
	 theta += ((direction) ? .02: -.02);
	 //console.log("theta ", theta);
    gl.uniform1f(thetaLoc, theta);
	
	//HW470: draw the object
	// You will need to change this to create the twisting outer parts effect
	// Hint: you will need more than one draw function call
    //gl.drawArrays( gl.TRIANGLES, 0, vertices.length );
	
	 gl.drawArrays( gl.TRIANGLES, 0, 24);//top of head
	 gl.drawArrays( gl.TRIANGLES, 117, 153);//outer tentacle
	 
	 gl.drawArrays( gl.TRIANGLES, 24, 9);//middle of head
	 
	 gl.uniform1f(thetaLoc, 0.0);
	 gl.drawArrays( gl.TRIANGLES, 33, 17);// bot of head
	 
	 gl.uniform1f(thetaLoc, theta);
	 gl.drawArrays( gl.TRIANGLES, 48, 70);//mid tentacle
	 

	
	 
	
	//re-render after delay
	setTimeout(function (){requestAnimFrame(render);}, delay);
}

