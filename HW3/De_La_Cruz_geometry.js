var colorsArray = [];

var cylVertices = [];

var lowRez = false;

var vertices = [
    vec3(-0.5, -0.5,  0.5),
    vec3(-0.5,  0.5,  0.5),
    vec3(0.5,  0.5,  0.5),
    vec3(0.5, -0.5,  0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5,  0.5, -0.5),
    vec3(0.5,  0.5, -0.5),
    vec3( 0.5, -0.5, -.5) 
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];


function quad(a, b, c, d) {
	/*
     pointsArray.push(vertices[a]); 
     //colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[b]); 
     //colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     //colorsArray.push(vertexColors[a]);     
     pointsArray.push(vertices[a]); 
     //colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[c]); 
     //colorsArray.push(vertexColors[a]); 
     pointsArray.push(vertices[d]); 
     //colorsArray.push(vertexColors[a]);
*/
	triangle(vertices[a], vertices[c], vertices[d]);	 
	triangle(vertices[a], vertices[b], vertices[c]);
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function cylinder()
{
	cylVertices = [];
	//generate points along the cylinder surface
	//x = r cos theta; y = r sin theta; z = z;
	
	var divTheta = 40;
	
	if(lowRez)
	{
		divTheta = 10;
	}
	else
	{
		divTheta = 40;
	}
	
	currentTheta = 0;
	for(i = 0; i < divTheta+1; i++)//10 points of theta
	{
		//i = 1 ;
		console.log("i" , i);
		
		if(i == 0)
		{
			currentTheta = 0;
		}
		else
		{
			currentTheta += 2*Math.PI/divTheta;//increment theta by 1/40 the length of the cylinder
		}
		console.log("theta " , currentTheta, i);
		//cylVertices.push(vec3( 1*Math.cos(0), 1*Math.sin(0), 0.0));
		//cylVertices.push(vec3( 1*Math.cos(0), 1*Math.sin(0), 1.0));//r = .5
		cylVertices.push(vec3( 0.5*Math.cos(currentTheta), 0.5*Math.sin(currentTheta), 0.0));
		cylVertices.push(vec3( 0.5*Math.cos(currentTheta), 0.5*Math.sin(currentTheta), 1.5));
	}
	console.log("Cylinder: " , cylVertices);
	for(i = 2; i< cylVertices.length; i++)
	{
		//pointsArray.push(cylVertices[i]);
		//normalsArray.push(cylVertices[i]);
		if(i%2 == 0)
		
			triangle( cylVertices[i-2], cylVertices[i], cylVertices[i-1] );
		//triangle( cylVertices[0], cylVertices[2], cylVertices[1] );
		
		else
		
			//triangle( cylVertices[1], cylVertices[2], cylVertices[3] );
			triangle(cylVertices[i-2], cylVertices[i-1], cylVertices[i]);
		
	}
}

function customFunction()
{
	cylVertices = [];
	//generate points along the cylinder surface
	//
	//g(t) = (f(t), t, 0)
	//s(t,theta) = (cos(theta)*f(t), t, -sin(theta)*f(t));
	//f(t) = t^3 + 1
	var divTheta = 40;
	
	if(lowRez)
	{
		divTheta = 10;
	}
	else
	{
		divTheta = 40;
	}
	
	
	currentTheta = 0;
	for(i = 0; i < divTheta+1; i++)//10 points of theta
	{
		if(i == 0)
		{	
			currentTheta = 0;
		}
		else
		{
			currentTheta += 2*Math.PI/divTheta;//increment theta by 1/40 the length of the cylinder
		}
		currentT = 0
		for(t = 0; t < 6; t++)
		{
			//i = 1 ;
			console.log("i" , i);
			currentT += 1/3;
			fT = Math.log(currentT) + 1;
			currentT += 1/3;
			fT1 = Math.log(currentT) + 1;//find next t
			currentT -= 1/3;//reverse t
			//fT = 1; 
			console.log("theta " , currentTheta, i);
			
			cylVertices.push(vec3( fT*Math.cos(currentTheta), currentT, fT*-Math.sin(currentTheta)));//find current point
			cylVertices.push(vec3( fT*Math.cos(currentTheta+2*Math.PI/divTheta), currentT, fT*-Math.sin(currentTheta+2*Math.PI/divTheta)));//find next point
			//cylVertices.push(vec3( fT1*Math.cos(currentTheta), currentT+ 1/3, fT1*-Math.sin(currentTheta)));//find upper point
		}
	}
	console.log("Custom: " , cylVertices);
	for(i = 2; i< cylVertices.length; i++)
	{
		//pointsArray.push(cylVertices[i]);
		//normalsArray.push(cylVertices[i]);
		if(i%2 == 0)
		
			triangle( cylVertices[i-2], cylVertices[i], cylVertices[i-1] );
		//triangle( cylVertices[0], cylVertices[2], cylVertices[1] );
		
		else
		
			//triangle( cylVertices[1], cylVertices[2], cylVertices[3] );
			triangle(cylVertices[i-2], cylVertices[i-1], cylVertices[i]);
		
	}
}


function spikeFunction()
{
	//generate points along the cylinder surface
	//
	//g(t) = (f(t), t, 0)
	//s(t,theta) = (cos(theta)*f(t), t, -sin(theta)*f(t));
	//f(t) = t^3 + 1
	cylVertices = [];
	currentTheta = 0;
	for(i = 0; i < 21; i++)//10 points of theta
	{
		if(i == 0)
		{	
			currentTheta = 0;
		}
		else
		{
			currentTheta += 2*Math.PI/20;//increment theta by 1/40 the length of the cylinder
		}
		currentT = 0
		for(t = 0; t < 3; t++)
		{
			//i = 1 ;
			console.log("i" , i);
			currentT += 2/3
			fT = currentT*currentT + 1;
			//fT = 1; 
			console.log("theta " , currentTheta, i);
			//cylVertices.push(vec3( 1*Math.cos(0), 1*Math.sin(0), 0.0));
			//cylVertices.push(vec3( 1*Math.cos(0), 1*Math.sin(0), 1.0));//r = .5
			cylVertices.push(vec3( fT*Math.cos(currentTheta), fT*-Math.sin(currentTheta), currentT));
			cylVertices.push(vec3( fT*Math.cos(currentTheta), fT*-Math.sin(currentTheta), currentT+1));
		}
	}
	console.log("Custom: " , cylVertices);
	for(i = 2; i< cylVertices.length; i++)
	{
		//pointsArray.push(cylVertices[i]);
		//normalsArray.push(cylVertices[i]);
		if(i%2 == 0)
		
			triangle( cylVertices[i-2], cylVertices[i], cylVertices[i-1] );
		//triangle( cylVertices[0], cylVertices[2], cylVertices[1] );
		
		else
		
			//triangle( cylVertices[1], cylVertices[2], cylVertices[3] );
			triangle(cylVertices[i-2], cylVertices[i-1], cylVertices[i]);
		
	}
}