// Always execute in strict mode bc helps reduce bugs (idk my prof said so)
'use strict';

// All the following variables must be global variables.
// Animation functions are weird because you CANNOT pass any variables to them during animation 
//  so if you need data during animation, it has to be accessed using a global variable.
// ALL GLOBAL VARIABLES ARE REFERENCED ONLY IN THIS FILE. You will not find a reference to global variable from this file in another file (except for Tests.js)
var gl = null;
var canvas = null;

// These variables are used to locate their corresponding variable in WebGL
var gl = 
{
	shader_program: null
   ,buffer: null
   ,ctm_location: null
   ,position_location: null
   ,color_location: null
   ,normal_location: null
   ,model_view_location: null
   ,projection_location: null
   ,ambient_product_location: null
   ,diffuse_product_location: null
   ,specular_product_location: null
   ,shininess_location: null
   ,attenuation_constant_location: []
   ,attenuation_linear_location: []
   ,attenuation_quadratic_location: []
   ,light_position_location: []
}

// These variables are used to input to their corresponding variable in WebGL a value
// Changing these has visual effects
var gl_input = 
{
	model_view: [[1.0, 0.0, 0.0, 0.0],
				 [0.0, 1.0, 0.0, 0.0],
				 [0.0, 0.0, 1.0, 0.0],
				 [0.0, 0.0, 0.0, 1.0]]
   ,projection: [[1.0, 0.0, 0.0, 0.0],
				 [0.0, 1.0, 0.0, 0.0],
				 [0.0, 0.0, 1.0, 0.0],
				 [0.0, 0.0, 0.0, 1.0]]
   ,ambient_product: null
   ,diffuse_product: null
   ,specular_product: null
   ,shininess: null
   ,attenuation_constant: []
   ,attenuation_linear: []
   ,attenuation_quadratic: []
   ,light_position: []
}

var ctm_reset = [[1.0, 0.0, 0.0, 0.0],
				 [0.0, 1.0, 0.0, 0.0],
				 [0.0, 0.0, 1.0, 0.0],
				 [0.0, 0.0, 0.0, 1.0]];

// This variable is used to hold the positions, colors, and normals arrays which are passed into WebGL
var positions_colors_normals;

// These variables are used to keep track of the number of positions indexes
var length_solar_system_positions_and_offset_mouse;
var amount_position_indexes_for_each_planet;
var amount_positions_for_star;

// These variables are used to keep track of if there are any animations happening
var animating = 
{
	planet_orbits: false
   ,moving_spaceship: false
   ,spaceship_entry_to_orbit: false
   ,spaceship_orbiting_planet: false
   ,planet_view: false
   ,rotation_of_spaceship_view: false
   ,revelation_of_planet_view: {bool: false, cur_step: 0, num_steps: 0}
   ,spaceship_boom: {bool: false, cur_step: 0, num_steps: 0}
}

// These variables are used for checking if the spaceship landed on the planet, and if so what planet index in solar_system_details
var spaceship_close_to_planet = false;
var index_planet_spaceship_is_close_to = -1;
var planet_view = false;

// These variables are used for the view of the spaceship in solar system view
var long_deg_of_spaceship_view = 0;
var previous_mouse_xy_of_spaceship_view = {x: -1, y: -1};
var amount_rotation_long_deg_of_spaceship_view = 0;
var amount_physically_move_spaceship = {x: 0, y: 0, z: 0};
var long_deg_entering_orbit_start_of_spaceship_view = 0;

// These variables are used to keep track of the origin of the canvas, should always be 0, 0 but keeping from the previous version
var cur_x_trans_of_canvas = 0;
var cur_y_trans_of_canvas = 0;

// These variables are used in planet view only
var position_offset_of_planet_for_planet_view;
var colors_indexes_planet_view;
var cur_z_rotation_planet_view = 0;

// These variables are used for transition to and from planet view
var first_init_solar_system_view_done = false;
var ctm_star_before_planet_view;
var ctm_planet_before_planet_view;
var ctm_spaceship_before_planet_view;

// This variable is used to track if the user wants to exit orbit of a planet, 
//  allowing animateOrbitOfSpaceshipOnPlanet() to eject the spaceship from orbit when its safe
var spaceship_wants_exit_planet_orbit = false;

// These variables are used for tracking if a modal is open with info about me
//  and the heights of the windows to dynamically adapt the height of the modal to the text
var info_about_me_popup_planet_view = false;
var heights_of_popup_windows_for_info_about_me = {};

// These variables are used in displaying the spaceship's boom when it gets too close to the star
var spaceship_boom_position_offset;
var spaceship_boom_position_length;
var spaceship_boom_ctm = [[0, 0, 0, 0]
						 ,[0, 0, 0, 0]
						 ,[0, 0, 0, 0]
						 ,[0, 0, 0, 0]];

// This variables stores the number of lights
var number_of_lights = 15;

// This variable is used for storing the amount of position indexes for all the spots on a planet.
//  After I changed the spots into cities which generated randomly I had to keep track of this.
//  The variable is assigned in the function makeSpot() in MakeAllPositionsColorsNormals.js
var positions_length_for_all_spots_planet_view;

// This variable holds all the required information about the solar system
var solar_system_details = new SolarSystemDetails();

var doing_tests = false;

// This variable stores the number of animation calls are made to moveSpaceshipView() when the spaceship is entering the orbit of a planet
var iters_for_entry_to_orbit = 50;

// This variable stores the how many degrees the planet is rotated when the spaceship moves in planet view
var planet_view_rotation_speed = 0.2;

// This variable stores the longitude at the equator which the star is closest to when the user enters planet view
// See animateStarOrbitPlanetView() in Star.js for more details
var closest_i_start_planet_anim = 0;


function initGL(canvas)
{
	gl = canvas.getContext("webgl");
	if (!gl)
	{
	   alert("WebGL is not available, please enable it in your browser and refresh.");
	   return -1;
	}

	// Set the clear screen color to light blue (R, G, B, A)
	gl.clearColor(0, 0, 0, 1.0);
	
	// Enable hidden surface removal
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	return 0;
}

function initSolarSystemView()
{
	/* Global variables that need valid values to call this function
	 *  gl
	 *  canvas
	 */
	positions_colors_normals = createSolarSystem(solar_system_details);

	console.log("---- Made solar system");

	//console.log("Positions length = "+positions_colors_normals.positionsArr.length);
	//console.log("Colors length = "+positions_colors_normals.colorsArr.length);
	//console.log("Normals length = "+positions_colors_normals.normalsArr.length);

	amount_positions_for_star = 46980;
	amount_position_indexes_for_each_planet = 46980;

	if (!first_init_solar_system_view_done)
	{
		// Done if the first time the program is run (only once), otherwise not done
		// START Initlialize light_positions and attenuation arrays
		gl.light_position_location = [];
		gl.attenuation_linear_location = [];
		gl.attenuation_constant_location = [];
		gl.attenuation_quadratic_location = [];

		for (var i=0; i<number_of_lights; i++)
		{
			gl.light_position_location.push(0);
			gl.attenuation_linear_location.push(0);
			gl.attenuation_constant_location.push(0);
			gl.attenuation_quadratic_location.push(0);

			gl_input.attenuation_linear.push(0);
			gl_input.attenuation_constant.push(0);
			gl_input.attenuation_quadratic.push(0);
			gl_input.light_position.push([0, 0, 0, 0]);
		}
		// END Initlialize light_positions and attenuation arrays

		for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
		{
			solar_system_details.getPlanet(i).setPositionsOffset(amount_positions_for_star + (amount_position_indexes_for_each_planet*i));

			//console.log("ctm for planet");
			//printMat(solar_system_details.getPlanet(i).getCTM());
		}
	}

	solar_system_details.getSpaceship().setPositionOffset(amount_positions_for_star + (amount_position_indexes_for_each_planet * solar_system_details.getNumberPlanets()));
	solar_system_details.getSpaceship().setPositionLength(2688);

	spaceship_boom_position_offset = solar_system_details.getSpaceship().getPositionOffset() + solar_system_details.getSpaceship().getPositionLength();
	spaceship_boom_position_length = 3024;

	//console.log("position_offset_spaceship = "+position_offset_spaceship);
	//console.log("position_length_spaceship = "+position_length_spaceship);

	length_solar_system_positions_and_offset_mouse = positions_colors_normals.positionsArr.length-3;

	gl_input.shininess = 400;

	gl_input.ambient_product = [0.2, 0.2, 0.2, 1.0];
	gl_input.diffuse_product = [0.9, 0.9, 0.9, 1.0];
	gl_input.specular_product = [1.0, 1.0, 1.0, 1.0];

	// Attenuation for the light in the middle of the star
	gl_input.attenuation_constant[0] = 1;
	gl_input.attenuation_linear[0] = 0.015;
	gl_input.attenuation_quadratic[0] = 0;

	// Attenuation for the light in the top of the star NOT USED
	gl_input.attenuation_constant[1] = 1;
	gl_input.attenuation_linear[1] = 0.015;
	gl_input.attenuation_quadratic[1] = 0;

	// Attenuation for the light in the bottom of the star NOT USED
	gl_input.attenuation_constant[2] = 1;
	gl_input.attenuation_linear[2] = 0.015;
	gl_input.attenuation_quadratic[2] = 0;

	// Attenuation for the light in the right spaceship engine
	gl_input.attenuation_constant[3] = 0.8;
	gl_input.attenuation_linear[3] = 2;
	gl_input.attenuation_quadratic[3] = 2;

	// Attenuation for the light in the left spaceship engine
	gl_input.attenuation_constant[4] = 0.8;
	gl_input.attenuation_linear[4] = 2;
	gl_input.attenuation_quadratic[4] = 2;

	for (var i=5; i<number_of_lights; i++)
	{
		// Nullify the effect of the lights
		gl_input.attenuation_constant[i] = 10;
		gl_input.attenuation_linear[i] = 10;
		gl_input.attenuation_quadratic[i] = 10;
	}

	// Load and compile shader programs
	gl.shader_program = initShaders(gl, "vertex-shader", "fragment-shader");
	if(gl.shader_program == -1)
	   return -1;
	gl.useProgram(gl.shader_program);

	// Allocate memory in a graphics card
	gl.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * (to1DF32Array(positions_colors_normals.positionsArr).length
										   +to1DF32Array(positions_colors_normals.colorsArr).length
										   +to1DF32Array(positions_colors_normals.normalsArr).length), gl.STATIC_DRAW);
	// Transfer positions and put it at the beginning of the gl.buffer
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, to1DF32Array(positions_colors_normals.positionsArr));
	// Transfer colors and put it right after positions
	gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 4 * positions_colors_normals.positionsArr.length, to1DF32Array(positions_colors_normals.colorsArr));
	// Transfer normals and put it right after colors
	gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions_colors_normals.positionsArr.length) + (4 * 4 * positions_colors_normals.colorsArr.length), to1DF32Array(positions_colors_normals.normalsArr));

	// Vertex Position - locate and enable "vPosition"
	gl.position_location = gl.getAttribLocation(gl.shader_program, "vPosition");
	if (gl.position_location == -1)
	{ 
		alert("Unable to locate vPosition");
		return -1;
	}
	gl.enableVertexAttribArray(gl.position_location);
	// vPosition starts at offset 0
	gl.vertexAttribPointer(gl.position_location, 4, gl.FLOAT, false, 0, 0);

	// Vertex Color - locate and enable vColor
	gl.color_location = gl.getAttribLocation(gl.shader_program, "vColor");
	if (gl.color_location == -1)
	{ 
		alert("Unable to locate vColor");
		return -1;
	}
	gl.enableVertexAttribArray(gl.color_location);
	// vColor starts at the end of positions
	gl.vertexAttribPointer(gl.color_location, 4, gl.FLOAT, false, 0, 4 * 4 * positions_colors_normals.positionsArr.length);

	// Vertex Normal - locate and enable vNormal
	gl.normal_location = gl.getAttribLocation(gl.shader_program, "vNormal");
	if (gl.normal_location == -1)
	{ 
		alert("Unable to locate vNormal");
		return -1;
	}
	gl.enableVertexAttribArray(gl.normal_location);
	// vColor starts at the end of positions
	gl.vertexAttribPointer(gl.normal_location, 4, gl.FLOAT, false, 0, (4 * 4 * positions_colors_normals.positionsArr.length) + (4 * 4 * positions_colors_normals.colorsArr.length));

	// Current Transformation Matrix - locate and enable "ctm_star"
	gl.ctm_location = gl.getUniformLocation(gl.shader_program, "ctm");
	if (gl.ctm_location == -1)
	{ 
		alert("Unable to locate ctm");
		return -1;
	}

	// Current Model View Matrix - locate and enable "model_view"
	gl.model_view_location = gl.getUniformLocation(gl.shader_program, "model_view");
	if (gl.model_view_location == null)
	{
		alert("Unable to locate model_view");
		return -1;
	}

	// Current Projection Matrix - locate and enable "projection"
	gl.projection_location = gl.getUniformLocation(gl.shader_program, "projection");
	if (gl.projection_location == null)
	{
		alert("Unable to locate projection");
		return -1;
	}

	// Current Ambient Product Vectors - locate and enable "ambient_product"
	gl.ambient_product_location = gl.getUniformLocation(gl.shader_program, "ambient_product");
	if (gl.ambient_product_location == null)
	{
		alert("Unable to locate ambient_product");
		//return -1;
	}

	// Current Diffuse Product Vectors - locate and enable "diffuse_product"
	gl.diffuse_product_location = gl.getUniformLocation(gl.shader_program, "diffuse_product");
	if (gl.diffuse_product_location == null)
	{
		alert("Unable to locate diffuse_product");
		//return -1;
	}

	// Current Specular Product Vectors - locate and enable "specular_product"
	gl.specular_product_location = gl.getUniformLocation(gl.shader_program, "specular_product");
	if (gl.specular_product_location == null)
	{
		alert("Unable to locate specular_product");
		//return -1;
	}

	// Current gl_input.shininess float - locate and enable "shininess"
	gl.shininess_location = gl.getUniformLocation(gl.shader_program, "shininess");
	if (gl.shininess_location == null)
	{
		alert("Unable to locate shininess");
		//return -1;
	}

	for (var i=0; i<number_of_lights; i++)
	{
		// Current Attenuation Constant float array - locate and enable "attenuation_constant[i]"
		gl.attenuation_constant_location[i] = gl.getUniformLocation(gl.shader_program, "attenuation_constant["+i+"]");
		if (gl.attenuation_constant_location[i] == null)
		{
			alert("Unable to locate attenuation_constant["+i+"]");
			//return -1;
		}

		// Current Attenuation Linear float array - locate and enable "attenuation_linear[i]"
		gl.attenuation_linear_location[i] = gl.getUniformLocation(gl.shader_program, "attenuation_linear["+i+"]");
		if (gl.attenuation_linear_location[i] == null)
		{
			alert("Unable to locate attenuation_linear["+i+"]");
			//return -1;
		}

		// Current Attenuation Quadratic float array - locate and enable "attenuation_quadratic[i]"
		gl.attenuation_quadratic_location[i] = gl.getUniformLocation(gl.shader_program, "attenuation_quadratic["+i+"]");
		if (gl.attenuation_quadratic_location[i] == null)
		{
			alert("Unable to locate attenuation_quadratic["+i+"]");
			//return -1;
		}

		// Current light position vector array - locate and enable "light_position[i]"
		gl.light_position_location[i] = gl.getUniformLocation(gl.shader_program, "light_position["+i+"]");
		if (gl.light_position_location[i] == null)
		{
			alert("Unable to locate light_position["+i+"]");
			//return -1;
		}
	}


	// START Setup ctms, model_view, projection
	var max_orbit_of_planet = solar_system_details.getStar().getRadius();
	if (solar_system_details.getNumberPlanets() > 0)
	{
		max_orbit_of_planet = solar_system_details.getPlanet(solar_system_details.getNumberPlanets()-1).getOrbitRadius() + 
							  solar_system_details.getPlanet(solar_system_details.getNumberPlanets()-1).getRadius()+3;
	}

	//console.log("max_orbit_of_planet = "+max_orbit_of_planet);

	if (first_init_solar_system_view_done)
	{
		// Done if the first time the program has already run, so every time after the first time
		amount_rotation_long_deg_of_spaceship_view = 90;

		moveSpaceshipView();

		solar_system_details.getStar().setCTM(ctm_star_before_planet_view);
        solar_system_details.getPlanet(index_planet_spaceship_is_close_to).setCTM(ctm_planet_before_planet_view);
		
		//console.log("Star after:");
		//printMat(solar_system_details.star_ctm);

		//console.log("Planet after:");
		//printMat(ctms_for_each_planet[index_planet_spaceship_is_close_to]);
	}

	cur_x_trans_of_canvas = getStarLocationX();
	cur_y_trans_of_canvas = getStarLocationY();

	//console.log("currrent trans = "+cur_x_trans_of_canvas+", "+cur_y_trans_of_canvas);

	if (!first_init_solar_system_view_done)
	{
		// Done if the first time the program is run (only once), otherwise not done
		solar_system_details.getSpaceship().initCTMSolarSystemView(1/2.5, max_orbit_of_planet);
	}
	else
	{
		// Done if the first time the program has already run, so every time after the first time
		solar_system_details.getSpaceship().setCTM(ctm_spaceship_before_planet_view);
		solar_system_details.getSpaceship().setScale(1/2.5);
	}

	setLightPositions();

	//console.log("gl_input.light_position = "+gl_input.light_position[0]);
	//console.log("cur trans of spaceship = "+getSpaceshipLocation());

	
	gl_input.model_view = lookAt(/*Eye Coords*/0, Math.sin(1 * (Math.PI/180)), 1,/*Look At Coords*/0, 0, max_orbit_of_planet+0.5,/*Up Coords*/0, 1, 0, "hmm");
	gl_input.projection = persp(max_orbit_of_planet, (-1)*max_orbit_of_planet
							   ,max_orbit_of_planet*(window.innerHeight/window.innerWidth), (-1)*max_orbit_of_planet*(window.innerHeight/window.innerWidth)
							   ,max_orbit_of_planet+0.5, (-1)*max_orbit_of_planet);

	displaySolarSystemView();
	// END Setup ctms, model_view, projection


	if (first_init_solar_system_view_done)
	{ // This is a call to animateOrbitOfSpaceshipOnPlanet() but because at this point the bool at the start has not been set to true, calling the function wont do anything
	  // And I don't want that bool set to true yet because I don't want it to animate, only to update and display once.
	  // So, the important part of the function has been copied and pasted here

		// START Animate orbit of planet around star
	
		//  For each planet, update the ctm to simulate orbit
		animatePlanetOrbits();
		// END Animate orbit of planet around star


		// START Move spaceship physical location
		var spaceship_location = getSpaceshipLocation();
		var planet_location = getPlanetLocation(index_planet_spaceship_is_close_to);

		amount_physically_move_spaceship.x = (spaceship_location[0] - planet_location[0]) + (solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius() * 1.5);
		amount_physically_move_spaceship.y = 0;
		amount_physically_move_spaceship.z = (spaceship_location[2] - planet_location[2]);

		moveSpaceshipPhysicalLocation();
		// END Move spaceship physical location
		

		// START Move spaceship view
		var circum = Math.PI * (solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius() * 1.5) * 2;
		
		var angle_move_for_one_iter = 360/(circum/0.02);

		amount_rotation_long_deg_of_spaceship_view = (-1) * angle_move_for_one_iter;

		moveSpaceshipView();
		// END Move spaceship view


		setLightPositions();

		if (!planet_view)
			displaySolarSystemView();
	}


	first_init_solar_system_view_done = true;


	// Hide text "Creating solar system" and show button "I'm Ready"
	if (!doing_tests)
	{
		document.getElementById("website_status_text").style.display = "none";
		document.getElementById("im_ready").style.display = "inline";
	}

	return 0;
}

function displaySolarSystemView()
{
	/* Global variables that need valid values to call this function
	 *  gl_input.*
	 *  solar_system_details.getStar().getCTM()
	 *  amount_positions_for_star
	 *  solar_system_details.getPlanet(i).getCTM() for all i
	 *  solar_system_details.getPlanet(i).getPositionsOffset() for all i
	 *  amount_position_indexes_for_each_planet
	 *  solar_system_details.getSpaceship().getCTM()
	 *  solar_system_details.getSpaceship().getPositionOffset()
	 *  solar_system_details.getSpaceship().getPositionLength()
	 *  spaceship_boom_ctm
	 *  spaceship_boom_position_offset
	 *  spaceship_boom_position_length
	 *  length_solar_system_positions_and_offset_mouse
	 */

	// Clear the buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Set the model_view
	gl.uniformMatrix4fv(gl.model_view_location, false, to1DF32Array(gl_input.model_view));

	// Set the projection
	gl.uniformMatrix4fv(gl.projection_location, false, to1DF32Array(gl_input.projection));

	// Set the ambient, diffuse, and specular products
	gl.uniform4fv(gl.ambient_product_location, new Float32Array(gl_input.ambient_product));
	gl.uniform4fv(gl.diffuse_product_location, new Float32Array(gl_input.diffuse_product));
	gl.uniform4fv(gl.specular_product_location, new Float32Array(gl_input.specular_product));

	// Set shininess
	gl.uniform1f(gl.shininess_location, gl_input.shininess);

	// Set light_position and attentuation arrays
	for (var i=0; i<number_of_lights; i++)
	{
		gl.uniform1f(gl.attenuation_constant_location[i], gl_input.attenuation_constant[i]);
		gl.uniform1f(gl.attenuation_linear_location[i], gl_input.attenuation_linear[i]);
		gl.uniform1f(gl.attenuation_quadratic_location[i], gl_input.attenuation_quadratic[i]);
		gl.uniform4fv(gl.light_position_location[i], new Float32Array(gl_input.light_position[i]));
	}

	// Set ctm of star and draw it
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(solar_system_details.getStar().getCTM()));
	gl.drawArrays(gl.TRIANGLES, 0, amount_positions_for_star);

	for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
	{
		// Set ctm of planet and draw it
		gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(solar_system_details.getPlanet(i).getCTM()));
		gl.drawArrays(gl.TRIANGLES, solar_system_details.getPlanet(i).getPositionsOffset(), amount_position_indexes_for_each_planet);
	}

	// Set ctm of spaceship and draw it
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(solar_system_details.getSpaceship().getCTM()));
	gl.drawArrays(gl.TRIANGLES, solar_system_details.getSpaceship().getPositionOffset(), solar_system_details.getSpaceship().getPositionLength());

	// Set ctm of the spaceship's boom and draw it
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(spaceship_boom_ctm));
	gl.drawArrays(gl.TRIANGLES, spaceship_boom_position_offset, spaceship_boom_position_length);

	// Set ctm of mouse and draw it
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(ctm_reset));
	gl.drawArrays(gl.TRIANGLES, length_solar_system_positions_and_offset_mouse, 3);

	// Draw all triangles after mouse offset
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(ctm_reset));
	gl.drawArrays(gl.TRIANGLES, length_solar_system_positions_and_offset_mouse+3, positions_colors_normals.positionsArr.length-(length_solar_system_positions_and_offset_mouse+3));
}

function setLightPositions()
{
	/* *********************************************************
	 * Setup of light position and attenuation arrays
	 * index |  which light
	 * -------------------------
	 * 0	 |  the star
	 * 1	 |  the star where y = the star's radius (at the top) NOT USED
	 * 2	 |  the star where y = (-1) * the star's radius (at the bottom) NOT USED
	 * 3	 |  the right spaceship engine
	 * 4	 |  the left spaceship engine
	 * 5-15  |  the lights for each spot on the planet
	 */

	/* Global variables that need valid values to call this function
	 *  gl_input.*
	 *  getStarLocation()
	 *  solar_system_details.getSpaceship().getScale()
	 *  solar_system_details.getPlanet(index_planet_spaceship_is_close_to).*
	 */

	// the star
	gl_input.light_position[0] = getStarLocation();

	// the star where y = the star's radius
	var position_star_1 = getStarLocation();
	position_star_1[1] += solar_system_details.getStar().getRadius() * 0.5;
	gl_input.light_position[1] = position_star_1;

	// the star where y = (-1) * the star's radius
	var position_star_2 = getStarLocation();
	position_star_2[1] += -solar_system_details.getStar().getRadius() * 0.5;
	gl_input.light_position[2] = position_star_2;

	var position_spaceship_3 = getSpaceshipLocation();
	var position_spaceship_4 = getSpaceshipLocation();

	if (!planet_view)
	{
		// the right spaceship engine
		position_spaceship_3[0] += 0.1 * solar_system_details.getSpaceship().getScale();
		position_spaceship_3[2] += 0.18 * solar_system_details.getSpaceship().getScale();
		gl_input.light_position[3] = position_spaceship_3;

		// the left spaceship engine
		position_spaceship_4[0] += -0.1 * solar_system_details.getSpaceship().getScale();
		position_spaceship_4[2] += 0.18 * solar_system_details.getSpaceship().getScale();
		gl_input.light_position[4] = position_spaceship_4;

		// the lights for each spot on the planet (NOT DISPLAYED IF NOT PLANET_VIEW)
		for (var i=5; i<number_of_lights; i++)
			gl_input.light_position[i] = [0, 0, 0, 0];
	}
	else
	{
		// the right spaceship engine
		position_spaceship_3[0] += 0.1 * solar_system_details.getSpaceship().getScale();
		position_spaceship_3[1] += 0.18 * solar_system_details.getSpaceship().getScale();
		gl_input.light_position[3] = matVecMult(rotate_mat(0, 0, cur_z_rotation_planet_view), position_spaceship_3);

		// the left spaceship engine
		position_spaceship_4[0] += -0.1 * solar_system_details.getSpaceship().getScale();
		position_spaceship_4[1] += 0.18 * solar_system_details.getSpaceship().getScale();
		gl_input.light_position[4] = matVecMult(rotate_mat(0, 0, cur_z_rotation_planet_view), position_spaceship_4);

		var remaining_lights = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();

		for (var i=5; i<(5+remaining_lights); i++)
		{
			// the lights for each spot on the planet, location where the spot is and translated +0.2 on the z axis
			var index = i-5;

			var i_index = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCoordsOfSpots()[index][0];
			var j_index = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCoordsOfSpots()[index][1];

			var offset = colors_indexes_planet_view[i_index][j_index][0]+2;

			var position = positions_colors_normals.positionsArr[amount_positions_for_star + offset];

			try
			{
				position = matVecMult(solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM(), position);

				gl_input.light_position[i] = matVecMult(translate_mat(0, 0, 0.2), position);
			}
			catch (ex)
			{
				gl_input.light_position[i] = [0, 0, 0, 0];
			}
		}

		// any remaining and extra lights which are not displayed
		for (var i=(5+remaining_lights); i<number_of_lights; i++)
			gl_input.light_position[i] = [0, 0, 0, 0];
	}
}

function moveSpaceshipView()
{
	/* Global variables that need valid values to call this function
	 *  amount_rotation_long_deg_of_spaceship_view (always: if 0, nothing will happen)
	 *     the above variable should be negative when looking right and positive when looking left
	 *  long_deg_entering_orbit_start_of_spaceship_view (if spaceship entering orbit)
	 */

	long_deg_of_spaceship_view += amount_rotation_long_deg_of_spaceship_view;
	
	solar_system_details.getStar().moveSpaceshipView(cur_x_trans_of_canvas, cur_y_trans_of_canvas, amount_rotation_long_deg_of_spaceship_view);

	// For each planet, update the ctm to simulate the movement of the spaceship's view
	for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
	{
		solar_system_details.getPlanet(i).moveSpaceshipView(cur_x_trans_of_canvas, cur_y_trans_of_canvas, amount_rotation_long_deg_of_spaceship_view);
	}

	setLightPositions();


	if (!planet_view && !doing_tests)
		displaySolarSystemView();


	// START Check if done animating entry to orbit
	var cur_angle = Math.abs(long_deg_of_spaceship_view).toFixed(2);
	var final_angle = Math.abs(long_deg_entering_orbit_start_of_spaceship_view+(amount_rotation_long_deg_of_spaceship_view*iters_for_entry_to_orbit)).toFixed(2);

	var in_progress_animating_entry_to_orbit = (animating.spaceship_entry_to_orbit && cur_angle != final_angle);
	// END Check if done animating entry to orbit

	if ((animating.rotation_of_spaceship_view || in_progress_animating_entry_to_orbit) && !doing_tests)
		requestAnimationFrame(moveSpaceshipView);
	else if (animating.spaceship_entry_to_orbit && cur_angle == final_angle && !doing_tests)
	{
		console.log("Starting orbit animation");

		animating.spaceship_entry_to_orbit = false;

		animating.spaceship_orbiting_planet = true;

		animateOrbitOfSpaceshipOnPlanet();
	}
}

function moveSpaceshipPhysicalLocation()
{
	/* Global variables that need valid values to call this function
	 *  amount_physically_move_spaceship.x, .y, .z
	 */

	// START Translate star and planets according to amount moved
	//  DOES NOT TRANSLATE THE SPACESHIP: it always stays in the same spot
	//  INSTEAD, translate all other objects: star and planets
	solar_system_details.getStar().applyTranslation(amount_physically_move_spaceship.x, amount_physically_move_spaceship.y, amount_physically_move_spaceship.z);

	// For each planet, update the ctm to simulate the physical movement of the spaceship
	for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
	{
		solar_system_details.getPlanet(i).applyTranslation(amount_physically_move_spaceship.x, amount_physically_move_spaceship.y, amount_physically_move_spaceship.z);
	}
	// END

	setLightPositions();
	

	if (!planet_view)
		displaySolarSystemView();


	// START check if spaceship is close to the star or a planet
	if (!animating.spaceship_orbiting_planet)
	{
		// START check if spaceship is close to the star
		var location_star = getStarLocation();
		var location_spaceship = getSpaceshipLocation();

		var straight_distance_between_star = Math.sqrt(Math.pow(location_star[0] - location_spaceship[0], 2) + Math.pow(location_star[2] - location_spaceship[2], 2));
		if (straight_distance_between_star <= solar_system_details.getStar().getRadius())
		{
			// START Begin animation of spaceship boom
			animating.moving_spaceship = false;
			animating.planet_orbits = false;

			animating.spaceship_boom.bool = true;
			animating.spaceship_boom.cur_step = 0;
			animating.spaceship_boom.num_steps = 60;

			animating.rotation_of_spaceship_view = false;

			solar_system_details.getSpaceship().setCTM(ctm_reset);
			displaySolarSystemView();

			animateSpaceshipBoom();

			return;
			// END Begin animation of spaceship boom
		}
		else if (straight_distance_between_star < solar_system_details.getStar().getRadius() * 1.5)
			showInfoModal("Warning!", "Don't get too close to the star", "");
		else if (!planet_view)
			hideInfoModal();
		// END check if spaceship is close to the star

		// START check if spaceship is close to a planet
		var new_index_planet_spaceship_is_close_to = -1;

		for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
		{
			var location_planet = getPlanetLocation(i);

			var straight_distance_between_planet = Math.sqrt(Math.pow(location_planet[0] - location_spaceship[0], 2) + Math.pow(location_planet[2] - location_spaceship[2], 2));

			if (straight_distance_between_planet < solar_system_details.getPlanet(i).getRadius() * 1.5)
			{
				if (index_planet_spaceship_is_close_to == -1)
				{
					console.log("Found valid planet to orbit, index = "+i);
					new_index_planet_spaceship_is_close_to = i;
					break;
				}
			}
			else if (straight_distance_between_planet > solar_system_details.getPlanet(i).getRadius() * 1.75 && index_planet_spaceship_is_close_to == i && !spaceship_close_to_planet)
			{
				console.log("Exiting area of planet index = "+i);
				index_planet_spaceship_is_close_to = -1;
			}
		}
		// END check if spaceship is close to a planet

		// START enter orbit of a planet if the spaceship is close
		if (new_index_planet_spaceship_is_close_to > -1 && index_planet_spaceship_is_close_to == -1 && !spaceship_close_to_planet)
		{
			// Enter orbit of planet
			index_planet_spaceship_is_close_to = new_index_planet_spaceship_is_close_to;

			spaceship_close_to_planet = true;

			animating.rotation_of_spaceship_view = false;

			console.log("Entering planet orbit, index = "+index_planet_spaceship_is_close_to);

			showInfoModal("Keyboard Actions", "[SPACE]:  Learn about David's "+solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getThingAboutMe(), "[ESC]:  Leave orbit");
			//showInfoModal("Land on this planet with [space] to learn about David's "+solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getThingAboutMe()+". Use [esc] to leave orbit.");

			prepareAnimationOfOrbitOfSpaceship();
		}
		// END enter orbit of a planet if the spaceship is close
	}
	// END

	if (animating.moving_spaceship && !spaceship_close_to_planet)
		requestAnimationFrame(moveSpaceshipPhysicalLocation);
}

function animatePlanetOrbits()
{
	// For each planet, update the ctm to simulate orbit
	for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
	{
		solar_system_details.getPlanet(i).updateOrbit(i);
	}

	if (!planet_view)
		displaySolarSystemView();

	if (animating.planet_orbits && !animating.spaceship_entry_to_orbit)
		requestAnimationFrame(animatePlanetOrbits);
}

function prepareAnimationOfOrbitOfSpaceship()
{
	/* Global variables that need valid values to call this function
	 *  index_planet_spaceship_is_close_to (this should be assigned in moveSpaceshipPhysicalLocation())
	 */

	//console.log("preping animation of orbit of spaceship");

	var location_dif_x = getPlanetLocationX(index_planet_spaceship_is_close_to) - getSpaceshipLocationX();
	var location_dif_z = getPlanetLocationZ(index_planet_spaceship_is_close_to) - getSpaceshipLocationZ();

	//console.log("location_dif_x = "+location_dif_x.toFixed(4));
	//console.log("location_dif_z = "+location_dif_z.toFixed(4));

	var angle;
	var straight_distance = Math.sqrt(Math.pow(location_dif_x, 2) + Math.pow(location_dif_z, 2));
	//console.log("straight_distance = "+straight_distance);

	if (location_dif_z.toFixed(4) == -0.000)
		location_dif_z = 0;
	if (location_dif_x.toFixed(4) == -0.000)
		location_dif_x = 0;
	
	var loc_angle;
	if (location_dif_x == 0 && location_dif_z != 0)
	{
		if (location_dif_z > 0)
			loc_angle = 90;
		else
			loc_angle = -90;
	}
	else if (location_dif_z == 0 && location_dif_x != 0)
	{
		if (location_dif_x > 0)
			loc_angle = 0;
		else
			loc_angle = -180;
	}
	else
	{
		loc_angle = Math.atan(location_dif_z/location_dif_x) * (180/Math.PI);

		if (location_dif_z > 0 && location_dif_x < 0)
			loc_angle += 180;
		else if (location_dif_z < 0 && location_dif_x < 0)
		{
			loc_angle = 90-loc_angle;
			loc_angle = -loc_angle - 90;
		}
	}

	var goal_angle = Math.atan(0/straight_distance) * (180/Math.PI);

	//console.log("loc_angle = "+loc_angle);
	//console.log("goal_angle = "+goal_angle);

	angle = goal_angle-loc_angle;

	//console.log("angles dif = "+angle);

	long_deg_entering_orbit_start_of_spaceship_view = long_deg_of_spaceship_view;

	//console.log("total angle to move = "+angle);
	//console.log("entering deg = "+long_deg_entering_orbit_start_of_spaceship_view);

	amount_rotation_long_deg_of_spaceship_view = angle/iters_for_entry_to_orbit;

	//console.log("amount_rotation_long_deg_of_spaceship_view = "+amount_rotation_long_deg_of_spaceship_view);
	//console.log("angle = "+angle);

	animating.moving_spaceship = false;

	animating.planet_orbits = false;

	animating.spaceship_entry_to_orbit = true;

	// will call animateOrbitOfSpaceshipOnPlanet() when complete
	moveSpaceshipView();
}

function animateOrbitOfSpaceshipOnPlanet()
{
	/* Global variables that need valid values to call this function
	 *  index_planet_spaceship_is_close_to (this should be assigned in moveSpaceshipPhysicalLocation())
	 *  animating.spaceship_orbiting_planet
	 */

	if (animating.spaceship_orbiting_planet)
	{
		// START Animate orbit of planet around star
	
		// For each planet, update the ctm to simulate orbit
		animatePlanetOrbits();
		// END Animate orbit of planet around star


		// START Move spaceship physical location
		var spaceship_location = getSpaceshipLocation();
		var planet_location = getPlanetLocation(index_planet_spaceship_is_close_to);

		amount_physically_move_spaceship.x = (spaceship_location[0] - planet_location[0]) + (solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius() * 1.5);
		amount_physically_move_spaceship.y = 0;
		amount_physically_move_spaceship.z = (spaceship_location[2] - planet_location[2]);

		moveSpaceshipPhysicalLocation();
		// END Move spaceship physical location
		

		// START Move spaceship view
		var circum = Math.PI * (solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius() * 1.5) * 2;
		
		var angle_move_for_one_iter = 360/(circum/0.02);

		amount_rotation_long_deg_of_spaceship_view = (-1) * angle_move_for_one_iter;

		moveSpaceshipView();
		// END Move spaceship view


		setLightPositions();


		// START Check if spaceship can safely exit planet's orbit without re-entering immediately
		if (spaceship_wants_exit_planet_orbit && solar_system_details.getSpaceship().canSafelyExitOrbit(index_planet_spaceship_is_close_to))
		{
			// Do this to exit orbit
			animating.spaceship_orbiting_planet = false;

			spaceship_close_to_planet = false;

			spaceship_wants_exit_planet_orbit = false;

			animating.planet_orbits = true;

			animatePlanetOrbits();

			userIsReady();

			return;
		}
		// END Check if spaceship can safely exit planet's orbit without re-entering immediately


		if (!planet_view)
			displaySolarSystemView();

		requestAnimationFrame(animateOrbitOfSpaceshipOnPlanet);
	}
}

function animateSpaceshipBoom()
{
	/* Global variables that need valid values to call this function
	 *  animating.spaceship_boom.bool
	 *  animating.spaceship_boom.cur_step
	 *  animating.spaceship_boom.num_steps
	 */

	animating.spaceship_boom.cur_step++;

	// Calcuate new scale of boom
	var spaceship_boom_scale = ((-1) * Math.abs((animating.spaceship_boom.cur_step/3)-10)+10)/5;

	// Apply scale to ctm of boom
	spaceship_boom_ctm = matMatMult(translate_mat(0, 0, 34.75), scale_mat(spaceship_boom_scale));
	
	displaySolarSystemView();

	if (animating.spaceship_boom.cur_step < animating.spaceship_boom.num_steps)
		requestAnimationFrame(animateSpaceshipBoom)
	else
	{
		// Finished animation, show modal so user can restart
		animating.spaceship_boom.bool = false;

		showModalDiedCuzStar();
	}
}



function initPlanetView()
{
	/* Global variables that need valid values to call this function
	 *  index_planet_spaceship_is_close_to (this should be assigned in moveSpaceshipPhysicalLocation())
	 */

	positions_length_for_all_spots_planet_view = 0;

	positions_colors_normals = createLandOnPlanetView(solar_system_details, index_planet_spaceship_is_close_to);//createSolarSystem(solar_system_details);

	colors_indexes_planet_view = positions_colors_normals.colorsIndexesArr;

	console.log("---- Made planet view");

	//console.log("Positions length = "+positions_colors_normals.positionsArr.length);
	//console.log("Colors length = "+positions_colors_normals.colorsArr.length);
	//console.log("Normals length = "+positions_colors_normals.normalsArr.length);

	//console.log("colors_indexes_planet_view.length = "+colors_indexes_planet_view.length);
	//console.log("colors_indexes_planet_view[0].length = "+colors_indexes_planet_view[0].length);

	//console.log("positions_length = "+positions_length_for_all_spots_planet_view);

	amount_positions_for_star = 46980;
	amount_position_indexes_for_each_planet = 771120 + positions_length_for_all_spots_planet_view;/*(2688*solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots());*/


	//console.log("Star before:");
	//printMat(ctm_star);

	//console.log("Planet before:");
	//printMat(ctms_for_each_planet[index_planet_spaceship_is_close_to]);


	position_offset_of_planet_for_planet_view = amount_positions_for_star;


	if (!doing_tests)
    {
        ctm_spaceship_before_planet_view = copy_mat(solar_system_details.getSpaceship().getCTM());
        ctm_star_before_planet_view = copy_mat(solar_system_details.getStar().getCTM());
        ctm_planet_before_planet_view = copy_mat(solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM());
    }


	solar_system_details.getSpaceship().setPositionOffset(amount_positions_for_star + amount_position_indexes_for_each_planet);
	solar_system_details.getSpaceship().setPositionLength((positions_colors_normals.positionsArr.length-3) - solar_system_details.getSpaceship().getPositionOffset());

	//console.log("position_offset_spaceship = "+position_offset_spaceship);
	//console.log("position_length_spaceship = "+position_length_spaceship);

	length_solar_system_positions_and_offset_mouse = positions_colors_normals.positionsArr.length-3;

	//gl_input.light_position = [0, 0, 0, 1.0];

	gl_input.shininess = 400;

	gl_input.ambient_product = [0.01, 0.01, 0.01, 1.0];
	gl_input.diffuse_product = [0.9, 0.9, 0.9, 1.0];
	gl_input.specular_product = [0.0, 0.0, 0.0, 1.0];

	gl_input.attenuation_constant[3] = 1.75;
	gl_input.attenuation_linear[3] = 2;
	gl_input.attenuation_quadratic[3] = 2;

	gl_input.attenuation_constant[4] = 1.75;
	gl_input.attenuation_linear[4] = 2;
	gl_input.attenuation_quadratic[4] = 2;

	var remaining_lights = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();

	for (var i=5; i<(5+remaining_lights); i++)
	{
		gl_input.attenuation_constant[i] = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getAttenConstLights();
		gl_input.attenuation_linear[i] = 2;
		gl_input.attenuation_quadratic[i] = 2;
	}

	for (var i=(5+remaining_lights); i<number_of_lights; i++)
	{
		gl_input.attenuation_constant[i] = 10;
		gl_input.attenuation_linear[i] = 10;
		gl_input.attenuation_quadratic[i] = 10;
	}

	// Allocate memory in a graphics card
	gl.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * (to1DF32Array(positions_colors_normals.positionsArr).length
										   +to1DF32Array(positions_colors_normals.colorsArr).length
										   +to1DF32Array(positions_colors_normals.normalsArr).length), gl.STATIC_DRAW);
	// Transfer positions and put it at the beginning of the gl.buffer
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, to1DF32Array(positions_colors_normals.positionsArr));
	// Transfer colors and put it right after positions
	gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 4 * positions_colors_normals.positionsArr.length, to1DF32Array(positions_colors_normals.colorsArr));
	// Transfer normals and put it right after colors
	gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions_colors_normals.positionsArr.length) + (4 * 4 * positions_colors_normals.colorsArr.length), to1DF32Array(positions_colors_normals.normalsArr));

	// Vertex Position - locate and enable "vPosition"
	gl.position_location = gl.getAttribLocation(gl.shader_program, "vPosition");
	if (gl.position_location == -1)
	{ 
		alert("Unable to locate vPosition");
		return -1;
	}
	gl.enableVertexAttribArray(gl.position_location);
	// vPosition starts at offset 0
	gl.vertexAttribPointer(gl.position_location, 4, gl.FLOAT, false, 0, 0);

	// Vertex Color - locate and enable vColor
	gl.color_location = gl.getAttribLocation(gl.shader_program, "vColor");
	if (gl.color_location == -1)
	{ 
		alert("Unable to locate vColor");
		return -1;
	}
	gl.enableVertexAttribArray(gl.color_location);
	// vColor starts at the end of positions
	gl.vertexAttribPointer(gl.color_location, 4, gl.FLOAT, false, 0, 4 * 4 * positions_colors_normals.positionsArr.length);

	// Vertex Normal - locate and enable vNormal
	gl.normal_location = gl.getAttribLocation(gl.shader_program, "vNormal");
	if (gl.normal_location == -1)
	{ 
		alert("Unable to locate vNormal");
		return -1;
	}
	gl.enableVertexAttribArray(gl.normal_location);
	// vColor starts at the end of positions
	gl.vertexAttribPointer(gl.normal_location, 4, gl.FLOAT, false, 0, (4 * 4 * positions_colors_normals.positionsArr.length) + (4 * 4 * positions_colors_normals.colorsArr.length));



	// START rotate planet back to match where hit space
	amount_rotation_long_deg_of_spaceship_view = -90;

	moveSpaceshipView();
	// END rotate planet back to match where hit space


	// START move planet into middle of screen
	var spaceship_location = getSpaceshipLocation();
	var planet_location = getPlanetLocation(index_planet_spaceship_is_close_to);

	solar_system_details.getStar().setCTM(matMatMult(translate_mat(spaceship_location[0]-planet_location[0], 0, spaceship_location[2]-planet_location[2]), solar_system_details.getStar().getCTM()));

    solar_system_details.getPlanet(index_planet_spaceship_is_close_to).setCTM(matMatMult(translate_mat(spaceship_location[0]-planet_location[0], 0, spaceship_location[2]-planet_location[2])
                                                                                        ,solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM()));

	setLightPositions();
	// END move planet into middle of screen

	
	// START correct gl_input.model_view and gl_input.projection
	var radius_of_planet = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius();

	var max_orbit_of_planet = solar_system_details.getStar().getRadius();
	if (solar_system_details.getNumberPlanets() > 0)
	{
		max_orbit_of_planet = solar_system_details.getPlanet(solar_system_details.getNumberPlanets()-1).getOrbitRadius() + 
							  solar_system_details.getPlanet(solar_system_details.getNumberPlanets()-1).getRadius()+3;
	}

	gl_input.model_view = lookAt(/*Eye Coords*/0, 0, 1,/*Look At Coords*/0, 0, max_orbit_of_planet+0.5+radius_of_planet,/*Up Coords*/0, 1, 0, "hmm");
	
	gl_input.projection = persp(max_orbit_of_planet, (-1)*max_orbit_of_planet
							   ,max_orbit_of_planet*(window.innerHeight/window.innerWidth), (-1)*max_orbit_of_planet*(window.innerHeight/window.innerWidth)
							   ,max_orbit_of_planet+0.5+radius_of_planet, (-1)*max_orbit_of_planet);
	// END correct gl_input.model_view and gl_input.projection


	// START place spaceship on planet surface
	var spaceship_scale = 1/10;

	solar_system_details.getSpaceship().initCTMPlanetView(spaceship_scale, spaceship_location, radius_of_planet);
	// END place spaceship on planet surface


	displayPlanetView();


	document.getElementById("website_status_text").style.display = "none";
	document.getElementById("im_ready").style.display = "inline";
}

function displayPlanetView()
{
	/* Global variables that need valid values to call this function
	 *  gl_input.*
     *  solar_system_details.getStar().getCTM()
	 *  amount_positions_for_star
	 *  position_offset_of_planet_for_planet_view
     *  solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM()
	 *  amount_position_indexes_for_each_planet
	 *  solar_system_details.getSpaceship().getCTM()
	 *  solar_system_details.getSpaceship().getPositionOffset()
	 *  solar_system_details.getSpaceship().getPositionLength()
	 *  length_solar_system_positions_and_offset_mouse
	 */

	// Clear the buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Set the model_view
	gl.uniformMatrix4fv(gl.model_view_location, false, to1DF32Array(gl_input.model_view));

	// Set the projection
	gl.uniformMatrix4fv(gl.projection_location, false, to1DF32Array(gl_input.projection));

	// Set the ambient, diffuse, and specular products
	gl.uniform4fv(gl.ambient_product_location, new Float32Array(gl_input.ambient_product));
	gl.uniform4fv(gl.diffuse_product_location, new Float32Array(gl_input.diffuse_product));
	gl.uniform4fv(gl.specular_product_location, new Float32Array(gl_input.specular_product));

	// Set shininess
	gl.uniform1f(gl.shininess_location, gl_input.shininess);

	// Set light_position and attentuation arrays
	for (var i=0; i<number_of_lights; i++)
	{
		gl.uniform1f(gl.attenuation_constant_location[i], gl_input.attenuation_constant[i]);
		gl.uniform1f(gl.attenuation_linear_location[i], gl_input.attenuation_linear[i]);
		gl.uniform1f(gl.attenuation_quadratic_location[i], gl_input.attenuation_quadratic[i]);
		gl.uniform4fv(gl.light_position_location[i], new Float32Array(gl_input.light_position[i]));
	}

	// Set ctm of star and draw it
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(solar_system_details.getStar().getCTM()));
	gl.drawArrays(gl.TRIANGLES, 0, amount_positions_for_star);


	// Set ctm of planet and draw it
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM()));
	gl.drawArrays(gl.TRIANGLES, position_offset_of_planet_for_planet_view, amount_position_indexes_for_each_planet);


	// Set ctm_star of spaceship and draw it
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(solar_system_details.getSpaceship().getCTM()));
	gl.drawArrays(gl.TRIANGLES, solar_system_details.getSpaceship().getPositionOffset(), solar_system_details.getSpaceship().getPositionLength());


	// Set ctm_star of mouse and draw it
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(ctm_reset));
	gl.drawArrays(gl.TRIANGLES, length_solar_system_positions_and_offset_mouse, 3);

	// Draw all triangles after mouse offset
	gl.uniformMatrix4fv(gl.ctm_location, false, to1DF32Array(ctm_reset));
	gl.drawArrays(gl.TRIANGLES, length_solar_system_positions_and_offset_mouse+3, positions_colors_normals.positionsArr.length-(length_solar_system_positions_and_offset_mouse+3));
}

function revealPlanetInPlanetView(planet_view_reveal_radius)
{
	/* Global variables that need valid values to call this function
	 *  positions_colors_normals.*
	 *  colors_indexes_planet_view
	 *  amount_positions_for_star
	 *  index_planet_spaceship_is_close_to
	 */

	positions_colors_normals = revealSphereV2(getSpaceshipLocationX(), getSpaceshipLocationY(), getSpaceshipLocationZ(), planet_view_reveal_radius, positions_colors_normals, colors_indexes_planet_view
											 ,solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM(), amount_positions_for_star, solar_system_details.getPlanet(index_planet_spaceship_is_close_to));

	document.getElementById("land").style.width = ((solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalIndexesFound()/64800)*100) + "%";
	document.getElementById("land").innerHTML = Math.round((solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalIndexesFound()/64800)*100) + "%";

	var points_frac = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalSpotsFound() / solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();

	document.getElementById("points").style.width = (points_frac*100) + "%";
	document.getElementById("points").innerHTML = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalSpotsFound() + "/" + solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();
}

function animatePlanetView()
{
	/* Global variables that need valid values to call this function
	 *  index_planet_spaceship_is_close_to
	 *  positions_colors_normals.*
	 *  amount_positions_for_star
	 */

	solar_system_details.getPlanet(index_planet_spaceship_is_close_to).animateSpaceshipMovementPlanetView(cur_z_rotation_planet_view, planet_view_rotation_speed);


	closest_i_start_planet_anim = solar_system_details.getStar().animateStarOrbitPlanetView(index_planet_spaceship_is_close_to
                                                                                           ,closest_i_start_planet_anim
                                                                                           ,planet_view_rotation_speed
                                                                                           ,colors_indexes_planet_view
                                                                                           ,positions_colors_normals);


	var previous_indexes_found = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalIndexesFound();


	// If indexes still to discover, call revealSphereV2 to reveal indexes in view
	if (solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalIndexesFound() < 64800 && !doing_tests)
	{
		var scalar = 2/3;
		if (index_planet_spaceship_is_close_to == 6)
			scalar = 1/2;
		revealPlanetInPlanetView(solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius() * scalar);
	}


	// START If indexes were found this call to the function, move spaceship view again, essentially doubling the movement of the spaceship on the planet
	//  This is necessary because the revealSphereV2 has performance issues (calls to the graphics card to change colors is slow) so to hide it a little, speed up movement of spaceship
	if (previous_indexes_found < solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalIndexesFound())
	{
		for (var j=0; j<2; j++)
		{
			solar_system_details.getPlanet(index_planet_spaceship_is_close_to).animateSpaceshipMovementPlanetView(cur_z_rotation_planet_view, planet_view_rotation_speed);


            closest_i_start_planet_anim = solar_system_details.getStar().animateStarOrbitPlanetView(index_planet_spaceship_is_close_to
                                                                                                   ,closest_i_start_planet_anim
                                                                                                   ,planet_view_rotation_speed
                                                                                                   ,colors_indexes_planet_view
                                                                                                   ,positions_colors_normals);
		}
	}
	// END If indexes were found this call to the function, move spaceship view again


	// START If spaceship is close to spot, stop animation and show window for info about me
	for (var i=0; i<solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots(); i++)
	{
		if (solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getFoundSpots()[i])
		{
			var i_index = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCoordsOfSpots()[i][0];
			var j_index = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCoordsOfSpots()[i][1];

			var position_spot = positions_colors_normals.positionsArr[amount_positions_for_star + colors_indexes_planet_view[i_index][j_index][0]+2];

			position_spot = matVecMult(solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM(), position_spot);

			var distance_between = Math.sqrt(Math.pow(getSpaceshipLocationX()-position_spot[0],2) + Math.pow(getSpaceshipLocationY()-position_spot[1],2));

			if (distance_between < 0.2 * solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius() 
				&& !solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getExaminedSpots()[i] 
				&& position_spot[2] > getSpaceshipLocationZ()-0.5-solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius()
				&& planet_view)
			{
				solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getExaminedSpots()[i] = true;

				animating.planet_view = false;

				info_about_me_popup_planet_view = true;

				solar_system_details.getPlanet(index_planet_spaceship_is_close_to).incTotalSpotsExamined();

				var points_examined_frac = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalSpotsExamined() / solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();

				document.getElementById("pointsExamined").style.width = (points_examined_frac*100) + "%";
				document.getElementById("pointsExamined").innerHTML = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalSpotsExamined() + "/" + solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();

				showInfoModal("Keyboard Actions", "[ESC]:  Close the popup", "");

				var x_dif = getSpaceshipLocationX()-position_spot[0];
				var y_dif = getSpaceshipLocationY()-position_spot[1];
				//console.log("x_dif = "+x_dif+" y_dif = "+y_dif);

				if (!animating.planet_view && planet_view)
					showInfoAboutMeModal(index_planet_spaceship_is_close_to, solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalSpotsExamined()-1, x_dif, y_dif);
			}
		}
	}
	// END If spaceship is close to spot, stop animation and show window for info about me


	if (!doing_tests)
	{
		setLightPositions();

		displayPlanetView();
	}


	if (animating.planet_view)
		requestAnimationFrame(animatePlanetView);
}

function animateRevelationPlanetView()
{
	/* Global variables that need valid values to call this function
	 *  animating.revelation_of_planet_view.*
	 *  index_planet_spaceship_is_close_to
	 */

	animating.revelation_of_planet_view.cur_step++;

	var scalar = 2/3;
	if (index_planet_spaceship_is_close_to == 6)
		scalar = 1/2;

	// START Call to revealSphereV2
	var planet_view_reveal_radius = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getRadius() * scalar * (animating.revelation_of_planet_view.cur_step/animating.revelation_of_planet_view.num_steps);

	revealPlanetInPlanetView(planet_view_reveal_radius);
	// END Call to revealSphereV2

	// START Update spot examined progress bar
	var points_examined_frac = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalSpotsExamined() / solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();

	document.getElementById("pointsExamined").style.width = (points_examined_frac*100) + "%";
	document.getElementById("pointsExamined").innerHTML = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalSpotsExamined() + "/" + solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();
	// END Update spot examined progress bar

	setLightPositions();

	displayPlanetView();
	

	if (animating.revelation_of_planet_view.cur_step < animating.revelation_of_planet_view.num_steps && 
		solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalIndexesFound() < 64800)
			requestAnimationFrame(animateRevelationPlanetView);
	else if (!animating.planet_view)
	{
		solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getOrbitStatus().orbit_deg -= 90;

		// START Find col index of array that most closely matches the suns current position
		var star_pos = getStarLocation();
		var closest_distance = 1000000;
		closest_i_start_planet_anim = -1;
		for (var i=0; i<360; i++)
		{
			var index = colors_indexes_planet_view[89][i][0]+2;
			var position_adjusted = matVecMult(solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM(), positions_colors_normals.positionsArr[index + amount_positions_for_star]);

			//console.log("star_pos:");
			//printVec(star_pos);
			//console.log("position_adjusted:");
			//printVec(position_adjusted);

			var hmm = vecVecSub(star_pos, position_adjusted);

			//console.log("Hmm:");
			//printVec(hmm);

			var distance = magOfFVec(hmm);

			//console.log("distance = "+distance);

			if (distance < closest_distance)
			{
				closest_distance = distance;
				closest_i_start_planet_anim = i;
			}
		}
		//console.log("closest is "+closest_i_start_planet_anim);
		// END Find col index of array that most closely matches the suns current position

		// I HAVE NO IDEA WHY I NEED THIS BUT A BUG SUDDENLY APPEARED ONE DAY AND NOW THIS IS NECESSARY
		if (getPlanetLocationX(index_planet_spaceship_is_close_to) != 0 || getPlanetLocationY(index_planet_spaceship_is_close_to) != 0 || getPlanetLocationZ(index_planet_spaceship_is_close_to) != 34.5)
		{
            solar_system_details.getPlanet(index_planet_spaceship_is_close_to).setCTM(matMatMult(translate_mat(0-getPlanetLocationX(index_planet_spaceship_is_close_to), 0-getPlanetLocationY(index_planet_spaceship_is_close_to), 34.5-getPlanetLocationZ(index_planet_spaceship_is_close_to))
                                                                                                ,solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getCTM()));
        }


		displayPlanetView();

		animating.planet_view = true;

		animatePlanetView();
	}
}


// START Functions which display or hide html elements
function showInfoModal(text_title, text_1, text_2)
{
	document.getElementById("infoModalTextTitle").textContent = text_title;
	document.getElementById("infoModalText1").textContent = text_1;
	document.getElementById("infoModalText2").textContent = text_2;

	if (text_title == "Keyboard Actions" && !planet_view)
		document.getElementById("infoModalHeight").style.height = 180+"px";
	else if (text_title == "Keyboard Actions" && planet_view)
		document.getElementById("infoModalHeight").style.height = 150+"px";
	else if (text_title == "Warning!" || text_title == "Processing")
		document.getElementById("infoModalHeight").style.height = 150+"px";

	document.getElementById("infoModal").style.display = "flex";
	document.getElementById("infoModal").style.position = "absolute";
	document.getElementById("infoModal").style.left = (window.innerWidth-310)+"px";
	document.getElementById("infoModal").style.top = 0+"px";
}

function hideInfoModal()
{
	document.getElementById("infoModal").style.display = "none";
}

function showLoadingModalPlanetView(text)
{
	document.getElementById("im_ready").style.display = "none";

	document.getElementById("website_status_text").textContent = text;
	document.getElementById("website_status_text").style.display = "inline";

    if (text == "Loading solar system view...")
        document.getElementById("modalAtBeginningText").textContent = "Explore the solar system, explore each planet, and make sure to check out the points of interest to learn more about David Roberts!";
    else
        document.getElementById("modalAtBeginningText").textContent = "Explore the planet and examine each city to learn more about David's "+solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getThingAboutMe()+"!";

	document.getElementById("modalAtBeginning").style.display = "block";
}

function showProgressModal(text)
{
	document.getElementById("progressBarsTitleText").textContent = "Discover David's "+text;

	if (text == "experience at United States Steel")
	{
		document.getElementById("landProgressModalWidth").style.width = 350+"px";
	}
	else if (text == "education at the University of Pittsburgh")
	{
		document.getElementById("landProgressModalWidth").style.width = 400+"px";
	}
	else
	{
		document.getElementById("landProgressModalWidth").style.width = 300+"px";
	}

	document.getElementById("landProgressModal").style.display = "flex";
	document.getElementById("landProgressModal").style.position = "absolute";
	document.getElementById("landProgressModal").style.left = 10+"px";
	document.getElementById("landProgressModal").style.top = (-10)+"px";
}

function hideProgressModal()
{
	document.getElementById("landProgressModal").style.display = "none";
}

function showModalDiedCuzStar()
{
	document.getElementById("modal_died_cuz_star").style.display = "block";
}

function showInfoAboutMeModal(planet_index, spot_index, x_dif, y_dif)
{
	var midX = (canvas.width/2);
	var midY = (canvas.height/2)-10;

	var height_mid = (window.innerHeight/2 - 60);
	var width_mid = (window.innerWidth/2);

	var scalar = window.innerWidth/2.739;

	height_mid += (scalar * y_dif);
	width_mid += (-scalar * x_dif);

	if (x_dif > 0)
	{
		if (planet_index == 6 && spot_index < 2)
			width_mid -= 410;
		else
			width_mid -= 325;
	}

	//console.log("window.innerHeight = "+window.innerHeight);
	//console.log("window.innerWidth = "+window.innerWidth);

	//console.log("canvas.height = "+canvas.height);
	//console.log("canvas.width = "+canvas.width);

	//console.log("y offset = "+(530 * y_dif));
	//console.log("x offset = "+(-530 * x_dif));

	//console.log("height_mid = "+height_mid);
	//console.log("width_mid = "+width_mid);

	document.getElementById("planet_view_info_about_me_height").style.height = heights_of_popup_windows_for_info_about_me[planet_index+"_"+spot_index]+"px";
	if (planet_index == 6 && spot_index < 2)
		document.getElementById("planet_view_info_about_me_height").style.width = 410+"px";
	else
		document.getElementById("planet_view_info_about_me_height").style.width = 325+"px";

	document.getElementById("planet_view_info_about_me").style.display = "flex";
	document.getElementById("planet_view_info_about_me").style.position = "absolute";
	document.getElementById("planet_view_info_about_me").style.left = width_mid+"px";
	document.getElementById("planet_view_info_about_me").style.top = height_mid+"px";

	//console.log("Height of "+planet_index+"_"+spot_index+" = "+heights_of_popup_windows_for_info_about_me[planet_index+"_"+spot_index]);
	//console.log("Current height: "+document.getElementById("planet_view_info_about_me_height").style.height);

	for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
	{
		for (var j=0; j<solar_system_details.getPlanet(i).getNumberSpots(); j++)
		{
			var id = i+"_"+j;

			try
			{
				document.getElementById(id).style.display = "none";
			}
			catch (ex) {}
		}
	}
	document.getElementById(planet_index+"_"+spot_index).style.display = "block";
}

function hideInfoAboutMeModal()
{
	document.getElementById("planet_view_info_about_me").style.display = "none";
}

function showControlsSolarSystemViewModal()
{
	document.getElementById("modal_controls_solar_system_view").style.display = "flex";
	document.getElementById("modal_controls_solar_system_view").style.position = "absolute";
	document.getElementById("modal_controls_solar_system_view").style.left = (window.innerWidth-260)+"px";
	document.getElementById("modal_controls_solar_system_view").style.top = (window.innerHeight-340)+"px";
}

function hideControlsSolarSystemViewModal()
{
	document.getElementById("modal_controls_solar_system_view").style.display = "none";
}

function showControlsPlanetViewModal()
{
	document.getElementById("modal_controls_planet_view").style.display = "flex";
	document.getElementById("modal_controls_planet_view").style.position = "absolute";
	document.getElementById("modal_controls_planet_view").style.left = (window.innerWidth-260)+"px";
	document.getElementById("modal_controls_planet_view").style.top = (window.innerHeight-390)+"px";
}

function hideControlsPlanetViewModal()
{
	document.getElementById("modal_controls_planet_view").style.display = "none";
}
// END Functions which display or hide html elements


function keyDownCallback(event)
{
	if (event.keyCode == 32)
	{// space
		if (animating.spaceship_orbiting_planet)
		{ // Land on planet
			console.log("Landing on planet "+index_planet_spaceship_is_close_to);

			cur_z_rotation_planet_view = 0;

			animating.planet_orbits = false;

			animating.spaceship_orbiting_planet = false;

			planet_view = true;

			hideControlsSolarSystemViewModal();

			hideInfoModal();

			showControlsPlanetViewModal();

			showLoadingModalPlanetView("Loading planet view...");

			requestAnimationFrame(initPlanetView);
		}
	}

	if (event.keyCode == 27)
	{// esc
		if (animating.planet_view && planet_view && !info_about_me_popup_planet_view)
		{ // Return to orbit of planet
			animating.spaceship_orbiting_planet = true;

			animating.planet_view = false;

			info_about_me_popup_planet_view = false;

			planet_view = false;

			// START Reset total_spots_examined if user examined them all
			var points_examined_frac = solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getTotalSpotsExamined() / solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots();

			if (points_examined_frac == 1)
			{
				//solar_system_details.getPlanet(index_planet_spaceship_is_close_to).total_spots_examined = 0;
				solar_system_details.getPlanet(index_planet_spaceship_is_close_to).setTotalSpotsExamined(0);

				for (var j=0; j<solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getNumberSpots(); j++)
					solar_system_details.getPlanet(index_planet_spaceship_is_close_to).setExaminedSpotsIndex(j, false);
			}
			// END Reset total_spots_examined if user examined them all

			hideControlsPlanetViewModal();

			hideInfoModal();

			hideProgressModal();

			showControlsSolarSystemViewModal();

			showLoadingModalPlanetView("Loading solar system view...");

			requestAnimationFrame(initSolarSystemView);
		}
		else if (animating.spaceship_orbiting_planet)
		{ // Exit orbit of planet
			spaceship_wants_exit_planet_orbit = true;

			hideInfoModal();

			showInfoModal("Processing", "Finding the best time to leave orbit...", "");
		}
		else if (info_about_me_popup_planet_view)
		{ // Close popup with info about me
			info_about_me_popup_planet_view = false;

			animating.planet_view = true;

			hideInfoAboutMeModal();

			showInfoModal("Keyboard Actions", "[ESC]:  Return to orbit", "");

			animatePlanetView();
		}
	}
}

function glMouseMoveCallback(event)
{
	var midX = (canvas.width/2);
	var midY = (canvas.height/2)-10;

	if (event.which == 1)
	{
		amount_physically_move_spaceship.z += 0.005;
	}

	if (event.which == 3)
	{
		amount_physically_move_spaceship.z -= 0.005;
	}

	if (!spaceship_close_to_planet && !animating.spaceship_orbiting_planet && !animating.spaceship_entry_to_orbit && !planet_view && !animating.spaceship_boom.bool)
	{
		// START moving spaceship view
		if (previous_mouse_xy_of_spaceship_view.x == -1)
			previous_mouse_xy_of_spaceship_view.x = midX;

		var xDif = previous_mouse_xy_of_spaceship_view.x - event.clientX;

		//console.log("xDif = "+xDif);

		if (xDif != 0)
		{
			//console.log("Rotating spaceship view");

			if (event.clientX > (midX + (canvas.width/3)))
			{   // Mouse on far right 1/6 of screen, animate rotation
				if (!animating.rotation_of_spaceship_view)
				{
					console.log("Start animating rotation");

					amount_rotation_long_deg_of_spaceship_view = -2;

					animating.rotation_of_spaceship_view = true;

					moveSpaceshipView();
				}
			}
			else if (event.clientX < (midX - (canvas.width/3)))
			{   // Mouse on far left 1/6 of screen, animate rotation
				if (!animating.rotation_of_spaceship_view)
				{
					console.log("Start animating rotation");

					amount_rotation_long_deg_of_spaceship_view = 2;

					animating.rotation_of_spaceship_view = true;

					moveSpaceshipView();
				}
			}
			else
			{
				if (event.clientX >= (midX - (canvas.width/3)) && event.clientX <= (midX + (canvas.width/3)) && animating.rotation_of_spaceship_view)
				{
					//console.log("End animating rotation");

					animating.rotation_of_spaceship_view = false;
				}

				if (xDif > 0)
				{
					amount_rotation_long_deg_of_spaceship_view = 1;

					moveSpaceshipView();
				}
				else if (xDif < 0)
				{
					amount_rotation_long_deg_of_spaceship_view = -1;

					moveSpaceshipView();
				}
			}
		}

		previous_mouse_xy_of_spaceship_view.x = event.clientX;
		// END moving spaceship view

		displaySolarSystemView();
	}


	if (animating.planet_view && planet_view)
	{
		var angle = Math.atan((event.clientX-midX)/(event.clientY-midY)) * (180/Math.PI) * (-1);

		if (event.clientY > midY)
			angle += 180;

		solar_system_details.getSpaceship().rotateAroundZPlanetView(cur_z_rotation_planet_view, angle);

        cur_z_rotation_planet_view = angle;

		displayPlanetView();
	}
}


// Function called on button press that says "I'm Ready" in modal "modalAtBeginning"
function userIsReady()
{
	document.getElementById("modalAtBeginning").style.display = "none";

	if (animating.spaceship_orbiting_planet)
	{ // Start animation of spaceship orbit of planet after returning from planet view
		spaceship_close_to_planet = true;

		console.log("Entering planet orbit");

		showInfoModal("Keyboard Actions", "[SPACE]:  Learn about David's "+solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getThingAboutMe(), "[ESC]:  Leave orbit");

		animating.spaceship_orbiting_planet = true;

		console.log("Starting orbit animation");

		animateOrbitOfSpaceshipOnPlanet();
	}
	else if (planet_view)
	{ // Start planet view
		showProgressModal(solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getThingAboutMe());

		showInfoModal("Keyboard Actions", "[ESC]:  Return to orbit");

		animating.revelation_of_planet_view.cur_step = 0
		animating.revelation_of_planet_view.num_steps = 30;

		animateRevelationPlanetView();
	}
	else
	{ // Start solar system view
		animating.moving_spaceship = true;

		amount_physically_move_spaceship.x = 0;
		amount_physically_move_spaceship.y = 0;
		amount_physically_move_spaceship.z = 0.02;

		moveSpaceshipPhysicalLocation();
	}
}

// Function called on button press that says "Restart" in modal "modal_died_cuz_star"
function restartAfterDied()
{
	document.getElementById("modal_died_cuz_star").style.display = "none";

	// START Reset ctm of spaceship
	var max_orbit_of_planet = solar_system_details.getStar().getRadius();
	if (solar_system_details.getNumberPlanets() > 0)
	{
		//max_orbit_of_planet = solar_system_details.getPlanet(solar_system_details.planets.length-1).orbit_radius + solar_system_details.planets[solar_system_details.planets.length-1].radius+3;
		max_orbit_of_planet = solar_system_details.getPlanet(solar_system_details.getNumberPlanets()-1).getOrbitRadius() + 
							  solar_system_details.getPlanet(solar_system_details.getNumberPlanets()-1).getRadius()+3;
	}

	solar_system_details.getSpaceship().initCTMSolarSystemView(1/2.5, max_orbit_of_planet);
	// END Reset ctm of spaceship

	// START Send camera back to where it was at the start
	var xDif = 0 - getStarLocationX();
	var zDif = 0 - getStarLocationZ();

	amount_physically_move_spaceship.x = xDif;
	amount_physically_move_spaceship.y = 0;
	amount_physically_move_spaceship.z = zDif;

	moveSpaceshipPhysicalLocation();
	// END Send camera back to where it was at the start

	animating.planet_orbits = true;

	animatePlanetOrbits();

	animating.moving_spaceship = true;

	amount_physically_move_spaceship.x = 0;
	amount_physically_move_spaceship.y = 0;
	amount_physically_move_spaceship.z = 0.02;

	moveSpaceshipPhysicalLocation();
}

function main()
{
	// I manually edited this value when I was doing testing
	doing_tests = false;

	canvas = document.getElementById("gl-canvas");

	document.getElementById("modal_quick_links").style.display = "flex";
	document.getElementById("modal_quick_links").style.position = "absolute";
	document.getElementById("modal_quick_links").style.left = 10+"px";
	document.getElementById("modal_quick_links").style.top = (window.innerHeight-310)+"px";

	showControlsSolarSystemViewModal();

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	if (initGL(canvas) == -1)
	   return -1;

	if (initSolarSystemView() == -1)
	   return -1;

	document.onkeydown = keyDownCallback;

	canvas.onmousemove = glMouseMoveCallback;

	window.addEventListener('resize', function(event) 
	{
		if (confirm("A window resize was detected, please refresh the page to see the effects."))
		{
			window.location.reload(true);
		}
	}, true);

	if (!doing_tests)
	{
		animating.planet_orbits = true;

		animatePlanetOrbits();
	}


	var spaceship_light_slider = document.getElementById("spaceship_light_slider");
	spaceship_light_slider.oninput = function()
	{
		gl_input.attenuation_constant[3] = this.value/57.14;
		gl_input.attenuation_constant[4] = this.value/57.14;
	}


	heights_of_popup_windows_for_info_about_me["0_0"] = 160;
	heights_of_popup_windows_for_info_about_me["0_1"] = 190;
	heights_of_popup_windows_for_info_about_me["0_2"] = 130;
	heights_of_popup_windows_for_info_about_me["0_3"] = 160;
	heights_of_popup_windows_for_info_about_me["0_4"] = 180;
	heights_of_popup_windows_for_info_about_me["0_5"] = 100;

	heights_of_popup_windows_for_info_about_me["1_0"] = 160;
	heights_of_popup_windows_for_info_about_me["1_1"] = 200;
	heights_of_popup_windows_for_info_about_me["1_2"] = 160;
	heights_of_popup_windows_for_info_about_me["1_3"] = 180;
	heights_of_popup_windows_for_info_about_me["1_4"] = 130;
	heights_of_popup_windows_for_info_about_me["1_5"] = 130;
	heights_of_popup_windows_for_info_about_me["1_6"] = 140;
	heights_of_popup_windows_for_info_about_me["1_7"] = 100;
	heights_of_popup_windows_for_info_about_me["1_8"] = 100;
	heights_of_popup_windows_for_info_about_me["1_9"] = 100;

	heights_of_popup_windows_for_info_about_me["2_0"] = 120;
	heights_of_popup_windows_for_info_about_me["2_1"] = 100;
	heights_of_popup_windows_for_info_about_me["2_2"] = 120;
	heights_of_popup_windows_for_info_about_me["2_3"] = 150;
	heights_of_popup_windows_for_info_about_me["2_4"] = 100;
	heights_of_popup_windows_for_info_about_me["2_5"] = 120;

	heights_of_popup_windows_for_info_about_me["3_0"] = 100;
    heights_of_popup_windows_for_info_about_me["3_1"] = 260;
    heights_of_popup_windows_for_info_about_me["3_2"] = 220;
    heights_of_popup_windows_for_info_about_me["3_3"] = 290;

	heights_of_popup_windows_for_info_about_me["4_0"] = 240;
	heights_of_popup_windows_for_info_about_me["4_1"] = 135;

	heights_of_popup_windows_for_info_about_me["5_0"] = 100;
	heights_of_popup_windows_for_info_about_me["5_1"] = 230;

	heights_of_popup_windows_for_info_about_me["6_0"] = 310;
	heights_of_popup_windows_for_info_about_me["6_1"] = 310;
	heights_of_popup_windows_for_info_about_me["6_2"] = 355;

	// For testing
	if (doing_tests)
	{
		console.log("Starting tests");

		var tests = new Tests();

		tests.testMain();
	}
}
