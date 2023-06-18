class Planet
{
	#thing_about_me;
	#ctm;
	#positions_offset;
	#orbit_status;
	#orbit_radius;
	#orbit_speed;
	#rotation_speed;
	#radius;
	#land_found_color;
	#sea_found_color;
	#ice_found_color;
	#heights;
	#ice_heights;
	#heights_avg;
	#ice_heights_avg;
	#found;
	#number_spots;
	#coords_of_spots;
	#found_spots;
	#examined_spots;
	#total_indexes_found;
	#total_spots_found;
	#total_spots_examined;
	#atten_const_lights;

	constructor(the_thing_about_me
			   ,the_ctm
			   ,the_positions_offset
			   ,the_orbit_status
			   ,the_orbit_radius
			   ,the_orbit_speed
			   ,the_rotation_speed
			   ,the_radius
			   ,the_land_found_color
			   ,the_sea_found_color
			   ,the_ice_found_color
			   ,the_heights
			   ,the_ice_heights
			   ,the_heights_avg
			   ,the_ice_heights_avg
			   ,the_found
			   ,the_number_spots
			   ,the_coords_of_spots
			   ,the_found_spots
			   ,the_examined_spots
			   ,the_total_indexes_found
			   ,the_total_spots_found
			   ,the_total_spots_examined
			   ,the_atten_const_lights)
	{
		this.#thing_about_me = the_thing_about_me;
		this.#ctm = translate_mat(the_orbit_radius, 0, 0);
		this.#positions_offset = the_positions_offset;
		this.#orbit_status = the_orbit_status;
		this.#orbit_radius = the_orbit_radius;
		this.#orbit_speed = the_orbit_speed;
		this.#rotation_speed = the_rotation_speed;
		this.#radius = the_radius;
		this.#land_found_color = the_land_found_color;
		this.#sea_found_color = the_sea_found_color;
		this.#ice_found_color = the_ice_found_color;
		this.#heights = the_heights;
		this.#ice_heights = the_ice_heights;
		this.#heights_avg = the_heights_avg;
		this.#ice_heights_avg = the_ice_heights_avg;
		this.#found = the_found;
		this.#number_spots = the_number_spots;
		this.#coords_of_spots = the_coords_of_spots;
		this.#found_spots = the_found_spots;
		this.#examined_spots = the_examined_spots;
		this.#total_indexes_found = the_total_indexes_found;
		this.#total_spots_found = the_total_spots_found;
		this.#total_spots_examined = the_total_spots_examined;
		this.#atten_const_lights = the_atten_const_lights;
	}

	updateOrbit(planet_index)
	{
		// START update status of orbits, rotations
		this.#orbit_status.rotation_deg += this.#rotation_speed;
		this.#orbit_status.orbit_deg += this.#orbit_speed;
		// END

		var degree_orbit = this.#orbit_status.orbit_deg;

		var negTrans = translate_mat((-1)*this.#ctm[3][0], (-1)*this.#ctm[3][1], (-1)*this.#ctm[3][2]);

		var posYTrans = this.#ctm[3][1];

		// START apply rotation to planet

		//   Send to origin
		this.#ctm = matMatMult(negTrans, this.#ctm);

		var rotation_mat = rotate_mat(0, this.#rotation_speed, 0);
		//   Apply rotation_speed to current rotation
		this.#ctm = matMatMult(this.#ctm, rotation_mat);
		// END

		// START translate planet away from origin according to orbit status
		var transX = Math.cos(degree_orbit * (Math.PI/180)) * this.#orbit_radius;
		var transZ = Math.sin(degree_orbit * (Math.PI/180)) * this.#orbit_radius;

		var posTrans = translate_mat(transX + getStarLocationX(), getStarLocationY(), transZ + getStarLocationZ());

		this.#ctm = matMatMult(posTrans, this.#ctm);
		// END
	}

	moveSpaceshipView(the_cur_x_canvas, the_cur_y_canvas, the_long_rotation)
	{
		if (!planet_view)
			this.#orbit_status.orbit_deg += the_long_rotation;

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

	animateSpaceshipMovementPlanetView(the_cur_z_rotation, the_planet_view_rotation_speed)
	{
		var planet_loc = [this.#ctm[3][0], this.#ctm[3][1], this.#ctm[3][2], 1];

		// START Move planet to 0,0,0 and star to correct location in relation to planet being at 0,0,0
		this.#ctm = matMatMult(translate_mat((-1)*planet_loc[0], (-1)*planet_loc[1], (-1)*planet_loc[2]), this.#ctm);
		// END Move planet to 0,0,0 and star to correct location in relation to planet being at 0,0,0
		

		// START Rotate according to rotation of spaceship
		this.#ctm = matMatMult(rotate_mat(Math.cos(the_cur_z_rotation * (Math.PI/180)) * (-1) * the_planet_view_rotation_speed
										 ,Math.sin(the_cur_z_rotation * (Math.PI/180)) * the_planet_view_rotation_speed
										 ,0)
							  ,this.#ctm);
		// END Rotate according to rotation of spaceship


		// START Send planet back to current location
		this.#ctm = matMatMult(translate_mat(planet_loc[0], planet_loc[1], planet_loc[2]), this.#ctm);
		// END Send planet and star back to current location
	}

	applyTranslation(x, y, z)
	{
		this.#ctm = matMatMult(translate_mat(x, y, z), this.#ctm);
	}

	resetCTMAndStuff()
	{
		this.#ctm = translate_mat(this.#orbit_radius, 0, 0);
		this.#orbit_status.rotation_deg = 0;
		this.#orbit_status.orbit_deg = 0;
	}

	getThingAboutMe() { return this.#thing_about_me }
	getCTM() { return this.#ctm; }
	getPositionsOffset() { return this.#positions_offset; }
	getOrbitStatus() { return this.#orbit_status; }
	getOrbitRadius() { return this.#orbit_radius; }
	getOrbitSpeed() { return this.#orbit_speed; }
	getRotationSpeed() { return this.#rotation_speed ; }
	getRadius() { return this.#radius; }
	getLandFoundColor() { return this.#land_found_color; }
	getSeaFoundColor() { return this.#sea_found_color; }
	getIceFoundColor() { return this.#ice_found_color; }
	getHeights() { return this.#heights; }
	getIceHeights() { return this.#ice_heights; }
	getHeightsAvg() { return this.#heights_avg; }
	getIceHeightsAvg() { return this.#ice_heights_avg; }
	getFound() { return this.#found; }
	getNumberSpots() { return this.#number_spots; }
	getCoordsOfSpots() { return this.#coords_of_spots; }
	getFoundSpots() { return this.#found_spots; }
	getFoundSpotsIndex(index) { return this.#found_spots[index]; }
	getExaminedSpots() { return this.#examined_spots; }
	getTotalIndexesFound() { return this.#total_indexes_found; }
	getTotalSpotsFound() { return this.#total_spots_found; }
	getTotalSpotsExamined() { return this.#total_spots_examined; }
	getAttenConstLights() { return this.#atten_const_lights; }

	setCTM(the_ctm) { this.#ctm = the_ctm; }
	setPositionsOffset(amt) { this.#positions_offset = amt; }
	setHeights(arr) { this.#heights = arr; }
	setIceHeights(arr) { this.#ice_heights = arr; }
	setHeightsAvg(avg) { this.#heights_avg = avg; }
	setIceHeightsAvg(avg) { this.#ice_heights_avg = avg; }
	setFound(arr) { this.#found = arr; }
	setCoordsOfSpots(arr) { this.#coords_of_spots = arr; }
	setFoundSpots(arr) { this.#found_spots = arr; }
	setFoundSpotsIndex(index, value) { this.#found_spots[index] = value; }
	setExaminedSpots(arr) { this.#examined_spots = arr; }
	setExaminedSpotsIndex(index, value) { this.#examined_spots[index] = value; }
	incTotalIndexesFound(value) { this.#total_indexes_found += value; }
	incTotalSpotsFound() { this.#total_spots_found++; }
	setTotalSpotsExamined(amt) { this.#total_spots_examined = amt; }
	incTotalSpotsExamined() { this.#total_spots_examined++; }
}

function getPlanetLocationX(index)
{
	return solar_system_details.getPlanet(index).getCTM()[3][0];
}

function getPlanetLocationY(index)
{
	return solar_system_details.getPlanet(index).getCTM()[3][1];
}

function getPlanetLocationZ(index)
{
	return solar_system_details.getPlanet(index).getCTM()[3][2];
}

function getPlanetLocation(index)
{
	return [getPlanetLocationX(index), getPlanetLocationY(index), getPlanetLocationZ(index), 1];
}