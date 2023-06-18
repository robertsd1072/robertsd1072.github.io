class Spaceship
{
	#ctm;
	#position_offset;
	#position_length;
	#scale;

	constructor()
	{
		this.#ctm = [[1.0, 0.0, 0.0, 0.0],
                     [0.0, 1.0, 0.0, 0.0],
                     [0.0, 0.0, 1.0, 0.0],
                     [0.0, 0.0, 0.0, 1.0]];
		this.#position_offset = 0;
		this.#position_length = 0;
		this.#scale = null;
	}

	initCTMSolarSystemView(the_scale, max_orbit_of_planet)
	{
		this.#scale = the_scale;

		this.#ctm = scale_mat(the_scale);

		this.#ctm = matMatMult(this.#ctm, matMatMult(translate_mat(0, 0, max_orbit_of_planet*(1/the_scale)), rotate_mat(90, 0, 0)));
	}

	initCTMPlanetView(the_scale, the_spaceship_location, the_planet_radius)
	{
		this.#scale = the_scale;

		this.#ctm = matMatMult(ctm_reset, scale_mat(the_scale));

		this.#ctm[3][0] = 0;
		this.#ctm[3][1] = 0;
		this.#ctm[3][2] = the_spaceship_location[2]+the_planet_radius+0.5;
	}

	rotateAroundZPlanetView(cur_z_rotation, angle)
	{
		var location_spaceship = [this.#ctm[3][0], this.#ctm[3][1], this.#ctm[3][2]];

		this.#ctm[3][0] = 0;
		this.#ctm[3][1] = 0;
		this.#ctm[3][2] = 0;

		this.#ctm = matMatMult(this.#ctm, rotate_mat(0, 0, (-1) * cur_z_rotation));

		this.#ctm = matMatMult(this.#ctm, rotate_mat(0, 0, angle));

		this.#ctm[3][0] = location_spaceship[0];
		this.#ctm[3][1] = location_spaceship[1];
		this.#ctm[3][2] = location_spaceship[2];
	}

	canSafelyExitOrbit(planet_index)
	{
		var next_spaceship_location = getSpaceshipLocation();
		// Add this amount because that is the next location of the spaceship, so function returns bool given NEXT location
		next_spaceship_location[2] += 0.02;

		var next_location_planet = copy_mat(solar_system_details.getPlanet(planet_index).getCTM());


		// START find next location of planet
		var degree_orbit = solar_system_details.getPlanet(planet_index).getOrbitStatus().orbit_deg
						 + solar_system_details.getPlanet(planet_index).getOrbitSpeed();

		var negTrans = translate_mat((-1)*next_location_planet[3][0]
									,(-1)*next_location_planet[3][1]
									,(-1)*next_location_planet[3][2]);

		var posYTrans = next_location_planet[3][1];

		//   Send to origin
		next_location_planet = matMatMult(negTrans, next_location_planet);

		//   Translate planet away from origin according to orbit status
		var transX = Math.cos(degree_orbit * (Math.PI/180)) * solar_system_details.getPlanet(planet_index).getOrbitRadius();
		var transZ = Math.sin(degree_orbit * (Math.PI/180)) * solar_system_details.getPlanet(planet_index).getOrbitRadius();

		var posTrans = translate_mat(transX + getStarLocationX(), posYTrans, transZ + getStarLocationZ());

		next_location_planet = matMatMult(posTrans, next_location_planet);
		// END find next location of planet


		var next_location_striaght_distance_between = Math.sqrt(Math.pow(next_spaceship_location[0] - next_location_planet[3][0], 2) + Math.pow(next_spaceship_location[2] - next_location_planet[3][2], 2));

		return next_location_striaght_distance_between > solar_system_details.getPlanet(planet_index).getRadius() * 1.5;
	}

	setLocation(x, y, z)
	{
		this.#ctm = translate_mat(x, y, z);
	}

	getCTM() { return this.#ctm; }
	getPositionOffset() { return this.#position_offset; }
	getPositionLength() { return this.#position_length; }
	getScale() { return this.#scale; }

	setCTM(the_ctm) { this.#ctm = the_ctm; }
	setPositionOffset(amt) { this.#position_offset = amt; }
	setPositionLength(amt) { this.#position_length = amt; }
	setScale(the_scale) { this.#scale = the_scale; }
}

function getSpaceshipLocationX()
{
	return solar_system_details.getSpaceship().getCTM()[3][0];
}

function getSpaceshipLocationY()
{
	return solar_system_details.getSpaceship().getCTM()[3][1];
}

function getSpaceshipLocationZ()
{
	return solar_system_details.getSpaceship().getCTM()[3][2];
}

function getSpaceshipLocation()
{
	return [getSpaceshipLocationX(), getSpaceshipLocationY(), getSpaceshipLocationZ(), 1];
}