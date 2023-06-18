class Star
{
	#ctm;
	#radius;
	#color;

	constructor(the_ctm, the_radius, the_color)
	{
		this.#ctm = the_ctm;
		this.#radius = the_radius;
		this.#color = the_color;
	}

	moveSpaceshipView(the_cur_x_canvas, the_cur_y_canvas, the_long_rotation)
	{
		var xDistanceFromSpaceship = getSpaceshipLocationX()-the_cur_x_canvas;
		var zDistanceFromSpaceship = getSpaceshipLocationZ();

		var transToOrigin = translate_mat((-1)*the_cur_x_canvas, (-1)*the_cur_y_canvas, 0);

		this.#ctm = matMatMult(transToOrigin, this.#ctm);

		var transToDistanceFromSpaceship = translate_mat((-1) * xDistanceFromSpaceship, 0, (-1) * zDistanceFromSpaceship);

		this.#ctm = matMatMult(transToDistanceFromSpaceship, this.#ctm);

		this.#ctm = matMatMult(rotate_mat(0, the_long_rotation, 0), this.#ctm);

		var transReverseOfDistanceFromSpaceship = translate_mat(xDistanceFromSpaceship, 0, zDistanceFromSpaceship);

		this.#ctm = matMatMult(transReverseOfDistanceFromSpaceship, this.#ctm);

		var transBackToCanvasCenter = translate_mat(the_cur_x_canvas, the_cur_y_canvas, 0);

		this.#ctm = matMatMult(transBackToCanvasCenter, this.#ctm);
	}

	animateStarOrbitPlanetView(planet_index, the_closest_i, the_planet_view_rotation_speed, the_colors_indexes_planet_view, the_positions_colors_normals)
	{
		/* START Translate star to animate rotation of planet, orbit of star, day/night
		 *  How this works:
		 *  the_closest_i is calculated in animateRevelationPlanetView when that function calls this function for this first time
		 *  It is the column index representing the longitude of the star around the planet
		 *  Every iteration, the_closest_i is incremented according to the_planet_view_rotation_speed
		 *  Since the planet has already been transformed to match the movement of the spaceship, find the coordinates of the planet on its equator according to that longitude 
		 *  Then project those coords onto an imaginary sphere that represents the orbit of the star (the planet's orbit radius)
		 *  Finally make the star's ctm those coordinates (star rotation does not matter)
		 */
		var orbit_radius = solar_system_details.getPlanet(planet_index).getOrbitRadius();
		var planet_loc = getPlanetLocation(planet_index);

		//   Increment this value
		the_closest_i -= the_planet_view_rotation_speed;
		if (the_closest_i < 0)
			the_closest_i = 359.5;

		//console.log("the_closest_i = "+the_closest_i);

		//   Get coordinates according to longitude (the_closest_i) on equator of planet
		var index = the_colors_indexes_planet_view[90][Math.floor(the_closest_i)][0];
		var position_adjusted = matVecMult(solar_system_details.getPlanet(planet_index).getCTM(), the_positions_colors_normals.positionsArr[index + amount_positions_for_star]);

		//   Find different between center of planet and that position
		var x_dif = position_adjusted[0] - planet_loc[0];
		var y_dif = position_adjusted[1] - planet_loc[1];
		var z_dif = position_adjusted[2] - planet_loc[2];

		//console.log("position_adjusted = "+position_adjusted);
		//console.log("planet_loc = "+planet_loc);
		//console.log("x_dif = "+x_dif);
		//console.log("y_dif = "+y_dif);
		//console.log("z_dif = "+z_dif);

		//   Get magnitude of vector
		var mag_of_vec = magOfFVec([x_dif, y_dif, z_dif, 0]);
		//console.log("mag_of_vec = "+mag_of_vec);

		//   Apply magnitude to vector to get its scale to match the orbit distance of the star
		var q = scaVecMult((orbit_radius/mag_of_vec), [x_dif, y_dif, z_dif, 0]);
		//console.log("q = "+q);

		//   Add the result to the location vector of the center of the planet
		var new_star_loc = vecVecAdd(planet_loc, q);

		//console.log("new_star_loc = "+new_star_loc);

		//   Assign that location to the star's ctm
		this.#ctm = translate_mat(new_star_loc[0], new_star_loc[1], new_star_loc[2]);
		// END Translate star to animate rotation of planet, orbit of star, day/night

		return the_closest_i;
	}

	applyTranslation(x, y, z)
	{
		this.#ctm = matMatMult(translate_mat(x, y, z), this.#ctm);
	}

	resetCTM()
	{
		this.#ctm = translate_mat(0, 0, 0);
	}

	getCTM() { return this.#ctm; }
	getRadius() { return this.#radius; }
	getColor() { return this.#color; }

	setCTM(the_ctm) { this.#ctm = the_ctm; }
}

function getStarLocationX()
{
	return solar_system_details.getStar().getCTM()[3][0];
}

function getStarLocationY()
{
	return solar_system_details.getStar().getCTM()[3][1];
}

function getStarLocationZ()
{
	return solar_system_details.getStar().getCTM()[3][2];
}

function getStarLocation()
{
	return [getStarLocationX(), getStarLocationY(), getStarLocationZ(), 1];
}