class Tests
{
	constructor() {}
	

	beforeTests(planet_index_if_planet_view)
	{
		/* Global Variables in IndexController.js referenced by this function 
		 *  closest_i_start_planet_anim
		 *  colors_indexes_planet_view
		 *  positions_colors_normals
		 */

		// Resets for solar system view
		//	Puts star at 0,0,0
		solar_system_details.getStar().resetCTM();

		for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
		{
			//	Puts each planet along the positive x axis according to orbit radii
			solar_system_details.getPlanet(i).resetCTMAndStuff();
		}

		// 	Puts spaceship at inputted x,y,z
		solar_system_details.getSpaceship().setLocation(0, 0, 34.5);

		// Resets for planet view
		if (planet_index_if_planet_view)
		{
			solar_system_details.getPlanet(planet_index_if_planet_view).setCTM(translate_mat(0, 0, 34.5));

			solar_system_details.getStar().setCTM(translate_mat(solar_system_details.getPlanet(planet_index_if_planet_view).getOrbitRadius(), 0, 34.5));

			var star_pos = getStarLocation();
			var closest_distance = 1000000;
			closest_i_start_planet_anim = -1;
			for (var i=0; i<360; i++)
			{
				var index = colors_indexes_planet_view[89][i][0]+2;
				var position_adjusted = matVecMult(solar_system_details.getPlanet(planet_index_if_planet_view).getCTM(), positions_colors_normals.positionsArr[index + amount_positions_for_star]);

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
		}
	}


	testUpdateOrbitPlanet(the_index, num_iters)
	{
		for (var i=0; i<num_iters; i++)
		{
			solar_system_details.getPlanet(the_index).updateOrbit(the_index);
		}

		return translate_mat(getPlanetLocationX(the_index), getPlanetLocationY(the_index), getPlanetLocationZ(the_index));
	}

	testMoveSpaceshipViewStar(the_long)
	{
		/* Global Variables in IndexController.js referenced by this function 
		 *  amount_rotation_long_deg_of_spaceship_view
		 *  cur_x_trans_of_canvas
		 *  cur_y_trans_of_canvas
		 */

		amount_rotation_long_deg_of_spaceship_view = the_long;

		solar_system_details.getStar().moveSpaceshipView(cur_x_trans_of_canvas, cur_y_trans_of_canvas, amount_rotation_long_deg_of_spaceship_view);

		return translate_mat(getStarLocationX(), getStarLocationY(), getStarLocationZ());
	}

	testMoveSpaceshipViewPlanet(the_index, the_long)
	{
		/* Global Variables in IndexController.js referenced by this function 
		 *  amount_rotation_long_deg_of_spaceship_view
		 *  cur_x_trans_of_canvas
		 *  cur_y_trans_of_canvas
		 */

		amount_rotation_long_deg_of_spaceship_view = the_long;

		solar_system_details.getPlanet(the_index).moveSpaceshipView(cur_x_trans_of_canvas, cur_y_trans_of_canvas, amount_rotation_long_deg_of_spaceship_view);

		return translate_mat(getPlanetLocationX(the_index), getPlanetLocationY(the_index), getPlanetLocationZ(the_index));
	}

	testMoveSpaceshipPhysicalLocation(the_x, the_y, the_z, planet_index)
	{
		/* Global Variables in IndexController.js referenced by this function 
		 *  amount_physically_move_spaceship.x .y .z
		 */

		amount_physically_move_spaceship.x = the_x;
		amount_physically_move_spaceship.y = the_y;
		amount_physically_move_spaceship.z = the_z;

		solar_system_details.getStar().applyTranslation(amount_physically_move_spaceship.x, amount_physically_move_spaceship.y, amount_physically_move_spaceship.z);

		for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
		{
			solar_system_details.getPlanet(i).applyTranslation(amount_physically_move_spaceship.x, amount_physically_move_spaceship.y, amount_physically_move_spaceship.z);
		}

		return translate_mat(getPlanetLocationX(planet_index), getPlanetLocationY(planet_index), getPlanetLocationZ(planet_index));
	}

	testEntryToPlanetOrbitSpaceship(planet_loc, planet_index, x_dif, z_dif, long_deg_view)
	{
		/* Global Variables in IndexController.js referenced by this function 
		 *  index_planet_spaceship_is_close_to
		 *  long_deg_of_spaceship_view
		 */

		index_planet_spaceship_is_close_to = planet_index;

		solar_system_details.getPlanet(planet_index).applyTranslation((-1)*getPlanetLocationX(planet_index), (-1)*getPlanetLocationY(planet_index), (-1)*getPlanetLocationZ(planet_index));
		solar_system_details.getPlanet(planet_index).applyTranslation(planet_loc[0], planet_loc[1], planet_loc[2]);

		solar_system_details.getSpaceship().setLocation(x_dif, 0, z_dif);
		long_deg_of_spaceship_view = long_deg_view;

		prepareAnimationOfOrbitOfSpaceship();

		for (var i=0; i<iters_for_entry_to_orbit-1; i++)
			moveSpaceshipView();

		var spaceship_loc = getSpaceshipLocation();
		var planet_loc = getPlanetLocation(planet_index);

		return translate_mat(planet_loc[0]-spaceship_loc[0], 0, planet_loc[2]-spaceship_loc[2]);
	}

	testAnimateOrbitOfSpaceshipOnPlanet(planet_index, num_iters)
	{
		/* Global Variables in IndexController.js referenced by this function 
		 *  index_planet_spaceship_is_close_to
		 */

		index_planet_spaceship_is_close_to = planet_index;

		solar_system_details.getPlanet(planet_index).setCTM(translate_mat(solar_system_details.getPlanet(planet_index).getRadius()*1.5, 0, 34.5));
		solar_system_details.getStar().setCTM(translate_mat((solar_system_details.getPlanet(planet_index).getRadius()*1.5)-solar_system_details.getPlanet(planet_index).getOrbitRadius(), 0, 34.5));
		solar_system_details.getSpaceship().setCTM(0, 0, 34.5);

		for (var i=0; i<num_iters; i++)
			animateOrbitOfSpaceshipOnPlanet();

		return translate_mat(getPlanetLocationX(planet_index), getPlanetLocationY(planet_index), getPlanetLocationZ(planet_index));
	}


	testAnimateStarOrbitPlanetView(num_iters)
	{
		/* Global Variables in IndexController.js referenced by this function 
		 *  index_planet_spaceship_is_close_to
		 *  closest_i_start_planet_anim
		 *  planet_view_rotation_speed
		 *  colors_indexes_planet_view
		 *  positions_colors_normals
		 */

		for (var i=0; i<num_iters; i++)
		{
			closest_i_start_planet_anim = solar_system_details.getStar().animateStarOrbitPlanetView(index_planet_spaceship_is_close_to
		                                                                                           ,closest_i_start_planet_anim
		                                                                                           ,planet_view_rotation_speed
		                                                                                           ,colors_indexes_planet_view
		                                                                                           ,positions_colors_normals);
		}

		if (num_iters == 0)
		{
			// Just get the updated position if called testAnimateSpaceshipMovementPlanetView()
			planet_view_rotation_speed = 0;
			closest_i_start_planet_anim = solar_system_details.getStar().animateStarOrbitPlanetView(index_planet_spaceship_is_close_to
		                                                                                           ,closest_i_start_planet_anim
		                                                                                           ,planet_view_rotation_speed
		                                                                                           ,colors_indexes_planet_view
		                                                                                           ,positions_colors_normals);
			planet_view_rotation_speed = 0.2;
		}

		return translate_mat(getStarLocationX(), getStarLocationY(), getStarLocationZ());
	}

	testAnimateSpaceshipMovementPlanetView(num_iters, the_z_rot)
	{
		/* Global Variables in IndexController.js referenced by this function 
		 *  cur_z_rotation_planet_view
		 *  planet_view_rotation_speed
		 */

		// Only used in combo with testAnimateStarOrbitPlanetView() because planet never moves
		cur_z_rotation_planet_view = the_z_rot;

		for (var i=0; i<num_iters; i++)
			solar_system_details.getPlanet(index_planet_spaceship_is_close_to).animateSpaceshipMovementPlanetView(cur_z_rotation_planet_view, planet_view_rotation_speed);
	}


	testMain()
	{
		var total_count = 0;
		var failed_count = 0;

		// START Solar System View Tests
			// START Test single call to testUpdateOrbitPlanet
				for (var i=0; i<solar_system_details.getNumberPlanets(); i++)
				{
					this.beforeTests();

					var planet_index = i;
					var num_iters = 180/solar_system_details.getPlanet(planet_index).getOrbitSpeed();

					//  Calling functions for the test
					var what_it_is = this.testUpdateOrbitPlanet(planet_index, num_iters);

					var what_it_should_be = translate_mat((-1)*solar_system_details.getPlanet(planet_index).getOrbitRadius(), 0, 0);

					console.assert(compare_mat(what_it_is, what_it_should_be), "testUpdateOrbitPlanet FAILED  "+
																			   "\nwhat_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																			   "\nwhat_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
					if (!compare_mat(what_it_is, what_it_should_be))
						failed_count++;
					total_count++;
				}
			// END Test single call to testUpdateOrbitPlanet


			// START Test single call to testMoveSpaceshipViewStar
				this.beforeTests();

				var the_long = 180;

				//  Calling functions for the test
				var what_it_is = this.testMoveSpaceshipViewStar(the_long);

				var what_it_should_be = translate_mat(0, 0, getSpaceshipLocationZ()*2);

				console.assert(compare_mat(what_it_is, what_it_should_be), "testMoveSpaceshipViewStar FAILED  "+
																		   "\nwhat_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																		   "\nwhat_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
				if (!compare_mat(what_it_is, what_it_should_be))
					failed_count++;
				total_count++;
			// END Test single call to testMoveSpaceshipViewStar


			// START Test combo call to testMoveSpaceshipViewStar with testMoveSpaceshipPhysicalLocation
				this.beforeTests();

				var the_long = 90;

				//  Calling functions for the test
				this.testMoveSpaceshipViewStar(the_long);
				this.testMoveSpaceshipPhysicalLocation(0, 0, getSpaceshipLocationZ(), 0);
				var what_it_is = this.testMoveSpaceshipViewStar(the_long);

				var what_it_should_be = translate_mat((-1)*getSpaceshipLocationZ(), 0, 2*getSpaceshipLocationZ());

				console.assert(compare_mat(what_it_is, what_it_should_be), "combo testMoveSpaceshipViewStar and testMoveSpaceshipPhysicalLocation FAILED  "+
																		   "\nwhat_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																		   "\nwhat_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
				if (!compare_mat(what_it_is, what_it_should_be))
					failed_count++;
				total_count++;
			// END Test combo call to testMoveSpaceshipViewStar with testMoveSpaceshipPhysicalLocation


			// START Test single call to testMoveSpaceshipViewPlanet
				this.beforeTests();

				var planet_index = 0;
				var the_long = 90;

				//  Calling functions for the test
				var what_it_is = this.testMoveSpaceshipViewPlanet(planet_index, the_long);

				var what_it_should_be = translate_mat(getSpaceshipLocationZ(), 0, getSpaceshipLocationZ()+solar_system_details.getPlanet(planet_index).getOrbitRadius());

				console.assert(compare_mat(what_it_is, what_it_should_be), "testMoveSpaceshipViewPlanet FAILED  "+
																		   "\nwhat_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																		   "\nwhat_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
				if (!compare_mat(what_it_is, what_it_should_be))
					failed_count++;
				total_count++;
			// END Test single call to testMoveSpaceshipViewPlanet


			// START Test combo call to testMoveSpaceshipViewPlanet with testMoveSpaceshipPhysicalLocation 
				this.beforeTests();

				var planet_index = 4;
				var the_long = -90;

				//  Calling functions for the test
				this.testMoveSpaceshipViewPlanet(planet_index, the_long);
				var what_it_is = this.testMoveSpaceshipPhysicalLocation(0, 0, getSpaceshipLocationZ(), planet_index);

				var what_it_should_be = translate_mat((-1)*getSpaceshipLocationZ(), 0, getSpaceshipLocationZ()+(getSpaceshipLocationZ()-solar_system_details.getPlanet(planet_index).getOrbitRadius()));

				console.assert(compare_mat(what_it_is, what_it_should_be), "combo testMoveSpaceshipViewPlanet and testMoveSpaceshipPhysicalLocation FAILED  "+
																		   "\nwhat_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																		   "\nwhat_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
				if (!compare_mat(what_it_is, what_it_should_be))
					failed_count++;
				total_count++;
			// END Test combo call to testMoveSpaceshipViewPlanet with testMoveSpaceshipPhysicalLocation


			// START Test 100 random calls to testEntryToPlanetOrbitSpaceship
				for (var i=0; i<100; i++)
				{
					this.beforeTests();

					var planet_index = 0;
					var spaceship_orbit_radius = solar_system_details.getPlanet(planet_index).getRadius()*1.5;

					var random_angle = Math.random() * 360;
					var x_dif = Math.sin(330 * (Math.PI/180)) * spaceship_orbit_radius;
					var z_dif = Math.cos(330 * (Math.PI/180)) * spaceship_orbit_radius;
					var random_long_deg_view = (Math.random() * 720)-360;

					var what_it_is = this.testEntryToPlanetOrbitSpaceship([0, 0, 0], planet_index, x_dif, z_dif, random_long_deg_view);

					var what_it_should_be = translate_mat(solar_system_details.getPlanet(planet_index).getRadius()*1.5, 0, 0);

					console.assert(compare_mat(what_it_is, what_it_should_be), "testEntryToPlanetOrbitSpaceship FAILED  "+
																			   "what_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																			   "what_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
					if (!compare_mat(what_it_is, what_it_should_be))
						failed_count++;
					total_count++;
				}
			// END Test 100 random calls to testEntryToPlanetOrbitSpaceship

			// START Test single call to testAnimateOrbitOfSpaceshipOnPlanet
				this.beforeTests();

				var planet_index = 4;
				var num_iters = 37;

				//  Calling functions for the test
				var what_it_is = this.testAnimateOrbitOfSpaceshipOnPlanet(planet_index, num_iters);

				var what_it_should_be = translate_mat(solar_system_details.getPlanet(planet_index).getRadius()*1.5, 0, 34.5);

				console.assert(compare_mat(what_it_is, what_it_should_be), "testAnimateOrbitOfSpaceshipOnPlanet FAILED  "+
																		   "\nwhat_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																		   "\nwhat_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
				if (!compare_mat(what_it_is, what_it_should_be))
					failed_count++;
				total_count++;
			// END Test single call to testAnimateOrbitOfSpaceshipOnPlanet
		// END Solar System View Tests



		/* Global Variables in IndexController.js referenced in the following tests
		 *  index_planet_spaceship_is_close_to
		 *  planet_view
		 *  info_about_me_popup_planet_view
		 *  planet_view_rotation_speed
		 */

		index_planet_spaceship_is_close_to = 3;

		// Code from initPlanetView()
		positions_colors_normals = createLandOnPlanetView(solar_system_details, index_planet_spaceship_is_close_to);
		colors_indexes_planet_view = positions_colors_normals.colorsIndexesArr;

		planet_view = true;
		info_about_me_popup_planet_view = true;

		// START Planet View Tests
			// START Test single call to testAnimateStarOrbitPlanetView
				this.beforeTests(index_planet_spaceship_is_close_to);

				var num_iters = 180/planet_view_rotation_speed;

				//  Calling functions for the test
				var what_it_is = this.testAnimateStarOrbitPlanetView(num_iters);

				var what_it_should_be = translate_mat((-1)*solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getOrbitRadius(), 0, 34.5);

				console.assert(compare_mat(what_it_is, what_it_should_be), "testAnimateStarOrbitPlanetView FAILED  "+
																		   "\nwhat_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																		   "\nwhat_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
				if (!compare_mat(what_it_is, what_it_should_be))
					failed_count++;
				total_count++;
			// END Test single call to testAnimateStarOrbitPlanetView


			// START Test combo call to testAnimateStarOrbitPlanetView and testAnimateSpaceshipMovementPlanetView
				this.beforeTests(index_planet_spaceship_is_close_to);

				var num_iters = 90/planet_view_rotation_speed;
				// Looking up is 0
				// Looking right is 90
				// Looking down is 180
				// Looking left is 270
				// Anywhere between left and up is -90 (left) to 0 (up)
				var the_z_rot = 0;

				//  Calling functions for the test
				this.testAnimateStarOrbitPlanetView(num_iters);
				this.testAnimateSpaceshipMovementPlanetView(num_iters, the_z_rot);
				num_iters = 180/planet_view_rotation_speed;
				var what_it_is = this.testAnimateStarOrbitPlanetView(num_iters);

				var what_it_should_be = translate_mat(0, (-1)*solar_system_details.getPlanet(index_planet_spaceship_is_close_to).getOrbitRadius(), 34.5);

				console.assert(compare_mat(what_it_is, what_it_should_be), "combo testAnimateStarOrbitPlanetView and testAnimateSpaceshipMovementPlanetView FAILED  "+
																		   "\nwhat_it_is: ["+what_it_is[3][0].toFixed(4)+", "+what_it_is[3][1].toFixed(4)+", "+what_it_is[3][2].toFixed(4)+"] "+
																		   "\nwhat_it_should_be: ["+what_it_should_be[3][0].toFixed(4)+", "+what_it_should_be[3][1].toFixed(4)+", "+what_it_should_be[3][2].toFixed(4)+"]");
				if (!compare_mat(what_it_is, what_it_should_be))
					failed_count++;
				total_count++;
			// END Test single call to testAnimateStarOrbitPlanetView
		// END Planet View Tests


		console.log(failed_count+" tests failed out of "+total_count);
	}
}