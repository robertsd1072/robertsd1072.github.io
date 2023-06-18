'use strict';

function makeTriColor(colors, color0, color1, color2, index)
{
	try
	{
		colors[index][0] = color0;
		colors[index][1] = color1;
		colors[index][2] = color2;
		colors[index+1][0] = color0;
		colors[index+1][1] = color1;
		colors[index+1][2] = color2;
		colors[index+2][0] = color0;
		colors[index+2][1] = color1;
		colors[index+2][2] = color2;
	}
	catch (e)
	{
		console.log("Problems converting color");
	}

	return colors;
}

function avgCornersSquare(arr, i, j, xLength, yLength)
{
	var avg = 0;
	
	avg += arr[Math.floor(i-xLength/2)][Math.floor(j-yLength/2)];
	avg += arr[Math.floor(i-xLength/2)][Math.floor(j+yLength/2)];
	avg += arr[Math.floor(i+xLength/2)][Math.floor(j-yLength/2)];
	avg += arr[Math.floor(i+xLength/2)][Math.floor(j+yLength/2)];

	if (avg < 0)
		console.log("AVG SQUARE IS BAD");

	return avg/4;
}

function avgCornersDiamond(arr, i, j, xLength, yLength, numLats, numLongs)
{
	var avg = 0;
	var outOfBoundsCnt = 0;

	try
	{
		if (Math.floor(i-xLength/2) > -1)
			avg += arr[Math.floor(i-xLength/2)][Math.floor(j)];
		else 
			outOfBoundsCnt++;

		if (Math.floor(i+xLength/2) < numLats)
			avg += arr[Math.floor(i+xLength/2)][Math.floor(j)];
		else 
			outOfBoundsCnt++;

		if (Math.floor(j+yLength/2) < numLongs)
			avg += arr[Math.floor(i)][Math.floor(j+yLength/2)];
		else
		{
			//console.log(Math.floor(j+yLength/2)+" was not < "+numLongs+" so instead trying "+Math.floor(i)+", "+(Math.floor(j+yLength/2)-numLongs));
			//console.log("That value is "+heights[Math.floor(i)][Math.floor(j+yLength/2)-numLongs]);
			//avg += heights[Math.floor(i)][Math.floor(j+yLength/2)-numLongs];
			//avg = avg*1.25;
		}
		
		if (Math.floor(j-yLength/2) > -1)
			avg += arr[Math.floor(i)][Math.floor(j-yLength/2)];
		else
		{
			//console.log(Math.floor(j+yLength/2)+" was not > -1 so instead trying "+(numLongs-Math.floor(j-yLength/2)));
			//avg += heights[Math.floor(i)][numLongs-Math.floor(j-yLength/2)];
			//avg = avg*1.25;
		}
	}
	catch (e)
	{
		console.log("numLats = "+numLats+" and numLongs = "+numLongs);
		console.log("xLength = "+xLength+" and yLength = "+yLength);
		console.log("i, j = "+i+", "+j);
		console.log("Accessing: "+(Math.floor(i-xLength/2))+", "+Math.floor(j));
		console.log("Accessing: "+(Math.floor(i+xLength/2))+", "+Math.floor(j));
		console.log("Accessing: "+Math.floor(i)+", "+(Math.floor(j+yLength/2)));
		console.log("Accessing: "+Math.floor(i)+", "+(Math.floor(j-yLength/2)));
	}

	if (avg < 0)
		console.log("AVG DIAMOND IS BAD");
	
	return avg/(4-outOfBoundsCnt);
}

function initHeightsArray(arr, xL, yL, cR, nLat, nLong)
{
	var xLength = xL;
	var yLength = yL;
	var cur_range = cR;

	var numLats = nLat;
	var numLongs = nLong;

	var theEntireAvg = 0;

	while (Math.floor(xLength) > 0)
	{
		// Diamond step for each square present
		for (var i=0; i<numLats-1; i+=xLength)
		{
			for (var j=0; j<numLongs-1; j+=yLength)
			{
				var x_index = Math.floor(xLength/2 + i);
				var y_index = Math.floor(yLength/2 + j);

				var avgSquare = avgCornersSquare(arr, xLength/2 + i, yLength/2 + j, xLength, yLength);

				if (arr[x_index][y_index] == -1)
				{
					arr[x_index][y_index] = avgSquare+(Math.random()*cur_range);
					theEntireAvg+=arr[x_index][y_index];
					//console.log("Doing center of square at index: "+x_index+", "+y_index+" = "+heights[x_index][y_index]);
				}

				if (Math.floor(xLength/2 + i) != xLength/2 + i)
				{
					if (arr[x_index+1][y_index] == -1)
					{
						arr[x_index+1][y_index] = avgSquare+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index+1][y_index];
						//console.log("Doing center of square at index: "+x_index+", "+y_index+" = "+heights[x_index+1][y_index]);
					}
				}
				if (Math.floor(yLength/2 + j) != yLength/2 + j)
				{
					if (arr[x_index][y_index+1] == -1)
					{
						arr[x_index][y_index+1] = avgSquare+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index][y_index+1];
						//console.log("Doing center of square at index: "+x_index+", "+y_index+" = "+heights[x_index][y_index+1]);
					}
				}
				if (Math.floor(xLength/2 + i) != xLength/2 + i && Math.floor(yLength/2 + j) != yLength/2 + j)
				{
					if (arr[x_index+1][y_index+1] == -1)
					{
						arr[x_index+1][y_index+1] = avgSquare+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index+1][y_index+1];
						//console.log("Doing center of square at index: "+x_index+", "+y_index+" = "+heights[x_index+1][y_index+1]);
					}
				}
			}
		}

		// Square Step for each diamond present
		
		// This loop does top and bottom of each diamond
		for (var i=0; i<numLats; i+=xLength)
		{
			for (var j=(yLength/2); j<numLongs-1; j+=yLength)
			{
				var x_index = Math.floor(i);
				var y_index = Math.floor(j);

				var avgDiamond = avgCornersDiamond(arr, i, j, xLength, yLength, numLats, numLongs);

				if (arr[x_index][y_index] == -1)
				{
					//console.log("1 Doing center of diamond at index: "+x_index+", "+y_index);
					arr[x_index][y_index] = avgDiamond+(Math.random()*cur_range);
					theEntireAvg+=arr[x_index][y_index];
				}

				if (Math.floor(i) != i)
				{
					if (x_index+1 < numLats && arr[x_index+1][y_index] == -1)
					{
						//console.log("1 Doing center of diamond at index: "+(x_index+1)+", "+(y_index));
						arr[x_index+1][y_index] = avgDiamond+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index+1][y_index];
					}
				}
				if (Math.floor(j) != j)
				{
					if (y_index+1 < numLongs && arr[x_index][y_index+1] == -1)
					{
						//console.log("1 Doing center of diamond at index: "+(x_index)+", "+(y_index+1));
						arr[x_index][y_index+1] = avgDiamond+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index][y_index+1];
					}
				}
				if (Math.floor(i) != i && Math.floor(j) != j)
				{
					if (x_index+1 < numLats && y_index+1 < numLongs && arr[x_index+1][y_index+1] == -1)
					{
						//console.log("1 Doing center of diamond at index: "+(x_index+1)+", "+(y_index+1));
						arr[x_index+1][y_index+1] = avgDiamond+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index+1][y_index+1];
					}
				}
			}
		}

		//This loop does left and right of each diamond
		for (var i=(xLength/2); i<numLats; i+=xLength)
		{
			for (var j=0; j<numLongs; j+=yLength)
			{
				var x_index = Math.floor(i);
				var y_index = Math.floor(j);

				var avgDiamond = avgCornersDiamond(arr, i, j, xLength, yLength, numLats, numLongs);

				if (arr[x_index][y_index] == -1)
				{
					//console.log("1 Doing center of diamond at index: "+x_index+", "+y_index);
					arr[x_index][y_index] = avgDiamond+(Math.random()*cur_range);
					theEntireAvg+=arr[x_index][y_index];
				}

				if (Math.floor(i) != i)
				{
					if (x_index+1 < numLats && arr[x_index+1][y_index] == -1)
					{
						//console.log("1 Doing center of diamond at index: "+(x_index+1)+", "+(y_index));
						arr[x_index+1][y_index] = avgDiamond+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index+1][y_index];
					}
				}
				if (Math.floor(j) != j)
				{
					if (y_index+1 < numLongs && arr[x_index][y_index+1] == -1)
					{
						//console.log("1 Doing center of diamond at index: "+(x_index)+", "+(y_index+1));
						arr[x_index][y_index+1] = avgDiamond+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index][y_index+1];
					}
				}
				if (Math.floor(i) != i && Math.floor(j) != j)
				{
					if (x_index+1 < numLats && y_index+1 < numLongs && arr[x_index+1][y_index+1] == -1)
					{
						//console.log("1 Doing center of diamond at index: "+(x_index+1)+", "+(y_index+1));
						arr[x_index+1][y_index+1] = avgDiamond+(Math.random()*cur_range);
						theEntireAvg+=arr[x_index+1][y_index+1];
					}
				}
			}
		}

		xLength = xLength/2;
		yLength = yLength/2;
		cur_range = cur_range/2;

		//console.log("Next iteration: xLength = "+xLength+" and yLength = "+yLength+" and cur_range = "+cur_range);
	}

	var toReturn = 
	{
		avg: theEntireAvg
	   ,arrHeights: arr
	};

	return toReturn;
}

function calcNormal(point1, point2, point0)
{
	var u = vecVecSub(point1, point0);
	var v = vecVecSub(point2, point0);

	return normVec(croPro(u, v));
}

function pushColors(colors, colorR, colorG, colorB, colorLast)
{
	colors.push([colorR, colorG, colorB, colorLast]);
	colors.push([colorR, colorG, colorB, colorLast]);
	colors.push([colorR, colorG, colorB, colorLast]);

	return colors;
}

function makePositionsNormalsStarOrPlanet_SolarSystemView(radius, total_amt_longs, total_amt_lats, star_so_invert_normals_yn)
{
	var positions = [];
	var normals = [];

	var numLongs = total_amt_longs;
	var totalLats = total_amt_lats;
	var numLats = totalLats-2; // - 2 because the top and bottom of the sphere will be cones and not rings
	var numTrisIn1x1Deg = 4;

	var numLevels = total_amt_lats;

	/* ******************************************************************************************
	 * START Makes the top part that is basically a cone
	 * ******************************************************************************************/
	var degsPerIter = 360/numLongs;
	var firstLvlRadius = radius*Math.cos((90-(90/(numLevels/2))) * (Math.PI/180));

	for (var i=0; i<360; i+=degsPerIter)
	{
		var angle1 = i;
		var angle2 = i+degsPerIter;
		if (angle2 > 360) angle2 = 360;
		//console.log("Angle1: "+angle1);
		//console.log("Angle2: "+angle2);
		var radians1 = angle1 * (Math.PI/180);
		var radians2 = angle2 * (Math.PI/180);

		var angleDown = 90-90/(numLevels/2);
		//console.log("AngleDown: "+angleDown);
		var radiansDown = angleDown * (Math.PI/180);

		//console.log("Pushing top");

		positions.push([0, radius, 0, 1.0]);
		positions.push([firstLvlRadius*Math.cos(radians2), radius*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians2), 1.0]);
		positions.push([firstLvlRadius*Math.cos(radians1), radius*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians1), 1.0]);

		var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
		if (star_so_invert_normals_yn)
			temp_normal = scaVecMult(-1, temp_normal);

		normals.push(temp_normal);
		normals.push(temp_normal);
		normals.push(temp_normal);
	}
	/* ******************************************************************************************
	 * END Makes the top part that is basically a cone
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Makes each ring of rectangles
	 * ******************************************************************************************/
	var rowIndex = 0;
	var degLatsPerIter = 180/totalLats;

	for (var i=90-degLatsPerIter; i>(-90+degLatsPerIter); i-=degLatsPerIter)
	{
		var angle1 = i;
		var angle2 = i-degLatsPerIter;
		//console.log("Angle1 in outer loop: "+angle1);
		//console.log("Angle2 in outer loop: "+angle2);
		var radians1 = angle1 * (Math.PI/180);
		var radians2 = angle2 * (Math.PI/180);
		var top_y = radius*Math.sin(radians1);
		var mid_y = radius*Math.sin(radians1+((radians2-radians1)/2));
		var bottom_y = radius*Math.sin(radians2);
		//console.log("top_y in outer loop: "+top_y);
		//console.log("mid_y in outer loop: "+mid_y);
		//console.log("bottom_y in outer loop: "+bottom_y);
		var top_radius = radius*Math.cos(radians1);
		var mid_radius = radius*Math.cos(radians1+((radians2-radians1)/2));
		var bottom_radius = radius*Math.cos(radians2);
		//console.log("top_radius in outer loop: "+top_radius);
		//console.log("mid_radius in outer loop: "+mid_radius);
		//console.log("bottom_radius in outer loop: "+bottom_radius);

		for (var j=0; j<360; j+=degsPerIter)
		{
			var angleA = j;
			var angleB = j+degsPerIter;
			if (angleB > 360) angleB = 360;
			//console.log("AngleA: "+angleA);
			//console.log("AngleB: "+angleB);
			var radiansA = angleA * (Math.PI/180);
			var radiansC = (angleA+((angleB-angleA)/2)) * (Math.PI/180);
			var radiansB = angleB * (Math.PI/180);

			var top_y = radius*Math.sin(radians1);
			var mid_y = radius*Math.sin(radians1+((radians2-radians1)/2));
			var bottom_y = radius*Math.sin(radians2);

			var top_radius = radius*Math.cos(radians1);
			var mid_radius = radius*Math.cos(radians1+((radians2-radians1)/2));
			var bottom_radius = radius*Math.cos(radians2);

			//Left side square: top left, bottom left, middle
			positions.push([top_radius*Math.cos(radiansB), top_y, top_radius*Math.sin(radiansB), 1.0]);
			positions.push([bottom_radius*Math.cos(radiansB), bottom_y, bottom_radius*Math.sin(radiansB), 1.0]);
			positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);

			var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
			if (star_so_invert_normals_yn)
				temp_normal = scaVecMult(-1, temp_normal);

			normals.push(temp_normal);
			normals.push(temp_normal);
			normals.push(temp_normal);

			//Top side square: top right, top left, middle
			positions.push([top_radius*Math.cos(radiansA), top_y, top_radius*Math.sin(radiansA), 1.0]);
			positions.push([top_radius*Math.cos(radiansB), top_y, top_radius*Math.sin(radiansB), 1.0]);
			positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);

			var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
			if (star_so_invert_normals_yn)
				temp_normal = scaVecMult(-1, temp_normal);

			normals.push(temp_normal);
			normals.push(temp_normal);
			normals.push(temp_normal);
		
			//Right side square: top right, middle, bottom right
			positions.push([top_radius*Math.cos(radiansA), top_y, top_radius*Math.sin(radiansA), 1.0]);
			positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
			positions.push([bottom_radius*Math.cos(radiansA), bottom_y, bottom_radius*Math.sin(radiansA), 1.0]);

			var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
			if (star_so_invert_normals_yn)
				temp_normal = scaVecMult(-1, temp_normal);

			normals.push(temp_normal);
			normals.push(temp_normal);
			normals.push(temp_normal);
		
			//Bottom side square: bottom right, middle, bottom left
			positions.push([bottom_radius*Math.cos(radiansA), bottom_y, bottom_radius*Math.sin(radiansA), 1.0]);
			positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
			positions.push([bottom_radius*Math.cos(radiansB), bottom_y, bottom_radius*Math.sin(radiansB), 1.0]);

			var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
			if (star_so_invert_normals_yn)
				temp_normal = scaVecMult(-1, temp_normal);

			normals.push(temp_normal);
			normals.push(temp_normal);
			normals.push(temp_normal);
		
		}
	}
	/* ******************************************************************************************
	 * END Makes each ring of rectangles
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Makes the bottom part that is basically a cone
	 * ******************************************************************************************/
	var degsPerIter = 360/numLongs;
	var firstLvlRadius = radius*Math.cos((90-(90/(numLevels/2))) * (Math.PI/180));

	for (var i=0; i<360; i+=degsPerIter)
	{
		var angle1 = i;
		var angle2 = i+degsPerIter;
		if (angle2 > 360) angle2 = 360;
		//console.log("Angle1: "+angle1);
		//console.log("Angle2: "+angle2);
		var radians1 = angle1 * (Math.PI/180);
		var radians2 = angle2 * (Math.PI/180);

		var angleDown = 90-90/(numLevels/2);
		//console.log("AngleDown: "+angleDown);
		var radiansDown = angleDown * (Math.PI/180);

		//console.log("Pushing top or bottom");

		positions.push([firstLvlRadius*Math.cos(radians2), radius*(-1)*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians2), 1.0]);
		positions.push([0, radius*(-1), 0, 1.0]);
		positions.push([firstLvlRadius*Math.cos(radians1), radius*(-1)*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians1), 1.0]);

		var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
		if (star_so_invert_normals_yn)
				temp_normal = scaVecMult(-1, temp_normal);

		normals.push(temp_normal);
		normals.push(temp_normal);
		normals.push(temp_normal);
	}
	/* ******************************************************************************************
	 * END Makes the bottom part that is basically a cone
	 * ******************************************************************************************/

	var toReturn = 
	{
		positionsArr: positions
	   ,normalsArr: normals
	}

	return toReturn;
}

function makeStar(star, total_amt_longs, total_amt_lats)
{
	var positionsAndNormals = makePositionsNormalsStarOrPlanet_SolarSystemView(star.getRadius(), total_amt_longs, total_amt_lats, true);

	var positions = positionsAndNormals.positionsArr;
	var colors = [];
	var normals = positionsAndNormals.normalsArr;

	var numLongs = total_amt_longs;
	var totalLats = total_amt_lats;
	var numLats = totalLats-2; // - 2 because the top and bottom of the sphere will be cones and not rings
	var numTrisIn1x1Deg = 4;

	var numLevels = total_amt_lats;

	var degsPerIter = 360/numLongs;


	/* ******************************************************************************************
	 * START Colors top 1 deg of triangles
	 * ******************************************************************************************/
	for (var i=0; i<(360/degsPerIter); i++)
	{
		colors = pushColors(colors, star.getColor()[0], star.getColor()[1], star.getColor()[2], star.getColor()[3]);
	}
	/* ******************************************************************************************
	 * END Colors top 1 deg of triangles 
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Colors the other parts of the sphere
	 * ******************************************************************************************/
	for (var i=0; i<numLats; i++)
	{
		for (var j=0; j<numLongs; j++)
		{
			for (var k=0; k<numTrisIn1x1Deg; k++)
			{
				colors = pushColors(colors, star.getColor()[0], star.getColor()[1], star.getColor()[2], star.getColor()[3]);
			}
		}
	}
	/* ******************************************************************************************
	 * END Colors the other parts of the sphere in sea
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Colors bottom 1 deg of triangles
	 * ******************************************************************************************/
	for (var i=0; i<(360/degsPerIter); i++)
	{
		colors = pushColors(colors, star.getColor()[0], star.getColor()[1], star.getColor()[2], star.getColor()[3]);
	}
	/* ******************************************************************************************
	 * END Colors bottom 1 deg of triangles
	 * ******************************************************************************************/

	var toReturn = 
	{
		positionsArr: positions
	   ,colorsArr: colors
	   ,normalsArr: normals
	}

	return toReturn;
}

function makePlanet_SolarSystemView(planetDetails, total_amt_longs, total_amt_lats)
{
	var positionsAndNormals = makePositionsNormalsStarOrPlanet_SolarSystemView(planetDetails.getRadius(), total_amt_longs, total_amt_lats, false);

	var positions = positionsAndNormals.positionsArr;
	var colors = [];
	var normals = positionsAndNormals.normalsArr;

	var heights = [];
	var iceHeights = [];
	var found = [];
	var coordsSpots = [];
	var foundSpots = [];
	var examinedSpots = [];

	var theEntireAvg;
	var theEntireAvgIce;

	var numLongs = total_amt_longs;
	var totalLats = total_amt_lats;
	var numLats = totalLats-2; // - 2 because the top and bottom of the sphere will be cones and not rings
	var numTrisIn1x1Deg = 4;

	var numLevels = total_amt_lats;

	var degsPerIter = 360/numLongs;

	if (planetDetails.getHeights().length < 180)
	{
		/* ******************************************************************************************
		 * START Initialize heights of each 1x1 square
		 *	   Used for telling whether something is land or sea
		 * ******************************************************************************************/
		var numLongsForHeights = 360;
		var numLatsForHeights = 180;

		for (var i=0; i<numLatsForHeights; i++)
		{
			var heightsRowArr = [];
			var iceHeightsRowArr = [];
			var foundRowArr = [];

			for (var j=0; j<numLongsForHeights; j++)
			{
				heightsRowArr.push(-1);
				iceHeightsRowArr.push(-1);
				foundRowArr.push(false);
			}

			heights.push(heightsRowArr);
			iceHeights.push(iceHeightsRowArr);
			found.push(foundRowArr);
		}

		heights[0][0] = 0;
		heights[numLatsForHeights-1][0] = 0;
		heights[0][numLongsForHeights-1] = 0;
		heights[numLatsForHeights-1][numLongsForHeights-1] = 0;


		for (var j=0; j<numLongsForHeights; j++)
		{
			iceHeights[0][j] = 0;
			iceHeights[numLatsForHeights-1][j] = 0;
		}

		for (var i=0; i<numLatsForHeights; i++)
		{
			if (i < 30)
			{
				//iceHeights[i][0] = i/60;
				//iceHeights[i][numLongsForHeights-1] = i/60;
			}
			else if (i > 147)
			{
				//iceHeights[i][0] = (numLatsForHeights-1-i)/60;
				//iceHeights[i][numLongsForHeights-1] = (numLatsForHeights-1-i)/60;
			}
			else
			{
				iceHeights[i][0] = 5;
				iceHeights[i][numLongsForHeights-1] = 5;
			}
		}

		var xLength = numLatsForHeights-1;
		var yLength = numLongsForHeights-1;
		var cur_range = 1;

		var landHeightsDetails = initHeightsArray(heights, xLength, yLength, cur_range, numLatsForHeights, numLongsForHeights);
		var iceHeightsDetails = initHeightsArray(iceHeights, xLength, yLength, cur_range, numLatsForHeights, numLongsForHeights);

		theEntireAvg = landHeightsDetails.avg/(numLatsForHeights*numLongsForHeights);
		heights = cleanUpHeights(landHeightsDetails.arrHeights, numLatsForHeights, numLongsForHeights, theEntireAvg);

		theEntireAvgIce = iceHeightsDetails.avg/(numLatsForHeights*numLongsForHeights);
		iceHeights = iceHeightsDetails.arrHeights;

		//console.log("Heights Array");
		//console.log("X length = "+heights.length);
		//console.log("Y length = "+heights[0].length);

		//console.log("theEntireAvg = "+theEntireAvg);
		//console.log("theEntireAvgIce = "+theEntireAvgIce);

		/* ******************************************************************************************
		 * END Initialize heights of each 1x1 square
		 *	 Used for telling whether something is land or sea
		 * ******************************************************************************************/

		for (var k=0; k<planetDetails.getNumberSpots(); k++)
		{
			foundSpots.push(false);
			examinedSpots.push(false);
		}
	}
	else
	{
		theEntireAvg = planetDetails.getHeightsAvg();
		heights = planetDetails.getHeights();

		theEntireAvgIce = planetDetails.getIceHeightsAvg();
		iceHeights = planetDetails.getIceHeights();

		found = planetDetails.getFound();

		coordsSpots = planetDetails.getCoordsOfSpots();

		foundSpots = planetDetails.getFoundSpots();

		examinedSpots = planetDetails.getExaminedSpots();
	}

	var colorsIndexes = [];

	/* ******************************************************************************************
	 * START Colors top 1 deg of triangles ice 
	 * ******************************************************************************************/
	var rowArr = [];

	for (var i=0; i<360; i+=degsPerIter)
	{
		colors = pushColors(colors, planetDetails.getIceFoundColor()[0], planetDetails.getIceFoundColor()[1], planetDetails.getIceFoundColor()[2], planetDetails.getIceFoundColor()[3]);

		rowArr.push(colors.length-3);
	}

	colorsIndexes.push(rowArr);
	/* ******************************************************************************************
	 * END Colors top 1 deg of triangles ice 
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Colors the other parts of the sphere 1 choice of:
				notFoundIce
			   ,notFoundLand
			   ,notFoundSea
	 * ******************************************************************************************/
	var listGreenCoords = [];

	for (var i=0; i<numLats; i++)
	{
		var rowArr = [];

		for (var j=0; j<numLongs; j++)
		{
			var rectArr = [];

			for (var k=0; k<numTrisIn1x1Deg; k++)
			{
				var i_Index = i * (180/totalLats);
				var j_Index = j * (360/numLongs);

				if (iceHeights[i_Index][j_Index] < theEntireAvgIce*0.5 && (i_Index < 50 || i_Index > 127))
				{
					colors = pushColors(colors, planetDetails.getIceFoundColor()[0], planetDetails.getIceFoundColor()[1], planetDetails.getIceFoundColor()[2], planetDetails.getIceFoundColor()[3]);
				}
				else if (heights[i_Index][j_Index] > theEntireAvg*1.15)
				{
					var height = ((heights[i_Index][j_Index]-theEntireAvg*1.15)/1.5);
					if (heights[i_Index][j_Index] > theEntireAvg*1.3)// && (i_Index > 29 && i_Index < 148))
						height = ((heights[i_Index][j_Index]-theEntireAvg*1.15)/1.2);
					if (heights[i_Index][j_Index] > theEntireAvg*1.45)// && (i_Index > 29 && i_Index < 148))
						height = ((heights[i_Index][j_Index]-theEntireAvg*1.15)/1.05);

					if (height > 1-planetDetails.getLandFoundColor()[1])
						height = 1-planetDetails.getLandFoundColor()[1];

					colors = pushColors(colors, planetDetails.getLandFoundColor()[0], planetDetails.getLandFoundColor()[1]+height, planetDetails.getLandFoundColor()[2], planetDetails.getLandFoundColor()[3]);

					if (k == 0 && i_Index > 40 && i_Index < 140)
						listGreenCoords.push([i_Index+1, j_Index]);
				}
				else
				{
					colors = pushColors(colors, planetDetails.getSeaFoundColor()[0], planetDetails.getSeaFoundColor()[1], planetDetails.getSeaFoundColor()[2], planetDetails.getSeaFoundColor()[3]);
				}

				rectArr.push(colors.length-3);
			}

			rowArr.push(rectArr);
		}

		colorsIndexes.push(rowArr);
	}
	/* ******************************************************************************************
	 * END Colors the other parts of the sphere in sea
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Colors bottom 1 deg of triangles ice 
	 * ******************************************************************************************/
	var rowArr2 = [];

	for (var i=0; i<360; i+=degsPerIter)
	{
		colors = pushColors(colors, planetDetails.getIceFoundColor()[0], planetDetails.getIceFoundColor()[1], planetDetails.getIceFoundColor()[2], planetDetails.getIceFoundColor()[3]);

		rowArr2.push(colors.length-3);
	}

	colorsIndexes.push(rowArr2);
	/* ******************************************************************************************
	 * END Colors bottom 1 deg of triangles ice 
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * colorsIndexes is a 3D array
	 * Each index the location of a trianlge in the colors array
	 * Row 0 and 179 will store a 1D array because there are only trianlges at this point in the sphere
	 * All other rows will store a 2D array, where each i, j hold a 1D array with the four triangles that make up a square
	 * ******************************************************************************************/
	//console.log("colorsIndexes Array");
	//console.log("X length = "+colorsIndexes.length);
	//console.log("Y length = "+colorsIndexes[0].length);
	//console.log("Z length = "+colorsIndexes[1][0].length);
	
	// MAKES THE SPOTS
	if (coordsSpots.length == 0)
	{
		for (var i=0; i<planetDetails.getNumberSpots(); i++)
		{
			var randomIndex = Math.floor(Math.random()*listGreenCoords.length);

			var indexI = listGreenCoords[randomIndex][0];
			var indexJ = listGreenCoords[randomIndex][1];

			if (spotCoordsNotNearAnother(coordsSpots, indexI, indexJ))
			{
				coordsSpots.push([indexI, indexJ]);

				//makeSpot(colors, indexI, indexJ, i);
			}
			else
				i--;
		}
	}


	// Smooths out coastlines
	var coastTiles = [];

	//console.log("planetDetails.sea_found_color = "+planetDetails.sea_found_color);
	//console.log("planetDetails.land_found_color = "+planetDetails.land_found_color);

	for (var i=1; i<numLats-1; i++)
	{
		for (var j=1; j<numLongs-1; j++)
		{
			if (compareColors(colors[colorsIndexes[i+1][j][0]], planetDetails.getSeaFoundColor(), false) && 
				(compareColors(colors[colorsIndexes[i+1][j-1][0]], planetDetails.getLandFoundColor(), true) ||
				 compareColors(colors[colorsIndexes[i+1][j+1][0]], planetDetails.getLandFoundColor(), true) ||
				 compareColors(colors[colorsIndexes[i][j][0]], planetDetails.getLandFoundColor(), true) ||
				 compareColors(colors[colorsIndexes[i+2][j][0]], planetDetails.getLandFoundColor(), true) ) )
			{
				coastTiles.push([i+1, j]);
			}
		}
	}

	//console.log("coastTiles.length = "+coastTiles.length);

	colors = makeSmooth(planetDetails, colors, colorsIndexes, coastTiles, "sea", "sea");

	var coastTilesIce = [];

	for (var i=1; i<numLats-1; i++)
	{
		if (i < 50 || i > 127)
		{
			for (var j=1; j<numLongs-1; j++)
			{
				if ((compareColors(colors[colorsIndexes[i+1][j][0]], planetDetails.getSeaFoundColor(), false) || compareColors(colors[colorsIndexes[i+1][j][0]], planetDetails.getLandFoundColor(), true) ) &&
					(compareColors(colors[colorsIndexes[i+1][j-1][0]], planetDetails.getIceFoundColor(), false) ||
					 compareColors(colors[colorsIndexes[i+1][j+1][0]], planetDetails.getIceFoundColor(), false) ||
					 compareColors(colors[colorsIndexes[i][j][0]], planetDetails.getIceFoundColor(), false) ||
					 compareColors(colors[colorsIndexes[i+2][j][0]], planetDetails.getIceFoundColor(), false) ) )
				{
					coastTilesIce.push([i+1, j]);
				}
			}
		}
	}

	//console.log("coastTilesIce.length = "+coastTilesIce.length);

	colors = makeSmooth(planetDetails, colors, colorsIndexes, coastTilesIce, "ice", "ice");


	var toReturn = 
	{
		positionsArr: positions
	   ,colorsArr: colors
	   ,normalsArr: normals
	   ,heightsArr: heights
	   ,iceHeightsArr: iceHeights
	   ,theEntireAvgNum: theEntireAvg
	   ,theEntireAvgIceNum: theEntireAvgIce
	   ,foundArr: found
	   ,coordsSpotsArr: coordsSpots
	   ,foundSpotsArr: foundSpots
	   ,examinedSpotsArr: examinedSpots
	}

	return toReturn;
}

function makePlanet_PlanetView(solarSystemDetails, planetDetails)
{
	//console.log("Planet radius = "+planetDetails.getRadius());

	var positions = [];
	var colors = [];
	var normals = [];

	var heights_at_coords_spots = [];
	for (var i=0; i<planetDetails.getCoordsOfSpots().length; i++)
	{
		heights_at_coords_spots.push(-1.1);
	}

	var heights = planetDetails.getHeights();
	var iceHeights = planetDetails.getIceHeights();

	var theEntireAvg = planetDetails.getHeightsAvg();
	var theEntireAvgIce = planetDetails.getIceHeightsAvg();

	var numLongs = 360;
	var totalLats = 180;
	var numLats = totalLats-2; // 180 - 2 because the top and bottom of the sphere will be cones and not rings
	var numTrisIn1x1Deg = 4;

	var pushIce = 0;//0.01;
	var newIceRadius = planetDetails.getRadius() + pushIce;

	//console.log("newIceRadius = "+newIceRadius);

	var numLevels = totalLats;

	/* ******************************************************************************************
	 * START Makes the top part that is basically a cone
	 * ******************************************************************************************/
	var degsPerIter = 360/numLongs;

	var firstLvlRadius = newIceRadius*Math.cos((90-(90/(numLevels/2))) * (Math.PI/180));

	//console.log("firstLvlRadius = "+firstLvlRadius.toFixed(3));

	for (var i=0; i<360; i+=degsPerIter)
	{
		var angle1 = i;
		var angle2 = i+degsPerIter;
		if (angle2 > 360) angle2 = 360;
		//console.log("Angle1: "+angle1);
		//console.log("Angle2: "+angle2);
		var radians1 = angle1 * (Math.PI/180);
		var radians2 = angle2 * (Math.PI/180);

		var angleDown = 90-90/(numLevels/2);
		//console.log("AngleDown: "+angleDown);
		var radiansDown = angleDown * (Math.PI/180);

		//console.log("Pushing top");

		positions.push([0, newIceRadius, 0, 1.0]);
		positions.push([firstLvlRadius*Math.cos(radians2), newIceRadius*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians2), 1.0]);
		positions.push([firstLvlRadius*Math.cos(radians1), newIceRadius*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians1), 1.0]);

		//console.log("Pushed positions");
		//printVec(positions[positions.length-3]);
		//printVec(positions[positions.length-2]);
		//printVec(positions[positions.length-1]);

		var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

		normals.push(temp_normal);
		normals.push(temp_normal);
		normals.push(temp_normal);
	}
	/* ******************************************************************************************
	 * END Makes the top part that is basically a cone
	 * ******************************************************************************************/

	
	/* ******************************************************************************************
	 * START Makes each ring of rectangles
	 * ******************************************************************************************/
	var rowIndex = 0;

	var degLatsPerIter = 180/totalLats;

	for (var i=90-degLatsPerIter; i>(-90+degLatsPerIter); i-=degLatsPerIter)
	{
		var angle1 = i;
		var angle2 = i-degLatsPerIter;
		//console.log("Angle1 in outer loop: "+angle1);
		//console.log("Angle2 in outer loop: "+angle2);
		var radians1 = angle1 * (Math.PI/180);
		var radians2 = angle2 * (Math.PI/180);
		var top_y = planetDetails.getRadius()*Math.sin(radians1);
		var mid_y = planetDetails.getRadius()*Math.sin(radians1+((radians2-radians1)/2));
		var bottom_y = planetDetails.getRadius()*Math.sin(radians2);
		//console.log("top_y in outer loop: "+top_y);
		//console.log("mid_y in outer loop: "+mid_y);
		//console.log("bottom_y in outer loop: "+bottom_y);
		var top_radius = planetDetails.getRadius()*Math.cos(radians1);
		var mid_radius = planetDetails.getRadius()*Math.cos(radians1+((radians2-radians1)/2));
		var bottom_radius = planetDetails.getRadius()*Math.cos(radians2);
		//console.log("top_radius in outer loop: "+top_radius);
		//console.log("mid_radius in outer loop: "+mid_radius);
		//console.log("bottom_radius in outer loop: "+bottom_radius);

		for (var j=0; j<360; j+=degsPerIter)
		{
			var angleA = j;
			var angleB = j+1;
			if (angleB > 360) angleB = 360;
			//console.log("AngleA: "+angleA);
			//console.log("AngleB: "+angleB);
			var radiansA = angleA * (Math.PI/180);
			var radiansC = (angleA+((angleB-angleA)/2)) * (Math.PI/180);
			var radiansB = angleB * (Math.PI/180);

			var pushIceX = 0;//pushIce * Math.cos(radians2);
			var pushIceY = 0;//pushIce * Math.cos(radiansDown);
			var pushIceZ = 0;//pushIce * Math.sin(radians2);

			
			if ( (heights[rowIndex][j] > theEntireAvg*1.15) || (iceHeights[rowIndex][j] < theEntireAvgIce*0.5 && (rowIndex < 50 || rowIndex > 127)) )
			{
				var newLandRadiusMid;
				var newLandRadiusTopLeft;
				var newLandRadiusTopRight;
				var newLandRadiusBottomRight;
				var newLandRadiusBottomLeft;

				var topLeft_y;
				var topRight_y;
				var bottomRight_y;
				var bottomLeft_y;

				var topLeft_radius;
				var topRight_radius;
				var bottomRight_radius;
				var bottomLeft_radius;

				if (heights[rowIndex][j] > theEntireAvg*1.15)
				{
					var sca = 4;
					if (heights[rowIndex][j] > theEntireAvg*1.3)// && (rowIndex > 29 && rowIndex < 148))
						sca = 3;
					if (heights[rowIndex][j] > theEntireAvg*1.45)// && (rowIndex > 29 && rowIndex < 148))
						sca = 2.5;


					for (var a=0; a<planetDetails.getCoordsOfSpots().length; a++)
					{
						if (planetDetails.getCoordsOfSpots()[a][0] == rowIndex && planetDetails.getCoordsOfSpots()[a][1] == j)
						{
							heights_at_coords_spots[a] = planetDetails.getRadius()+((heights[rowIndex][j]-theEntireAvg*1.15)/3) * planetDetails.getRadius();
						}
					}


					//Push land locations, add height (distance from 0,0,0) from heights array, adjust variables
					newLandRadiusMid = planetDetails.getRadius()+((heights[rowIndex][j]-theEntireAvg*1.15)/3) * planetDetails.getRadius();
					newLandRadiusTopLeft = planetDetails.getRadius()+getAvgCorner(heights, rowIndex, j, theEntireAvg, "topLeft", sca) * planetDetails.getRadius();;//((getAvgCorner(rowIndex, j, "topLeft")-theEntireAvg*1.15)/sca);
					newLandRadiusTopRight = planetDetails.getRadius()+getAvgCorner(heights, rowIndex, j, theEntireAvg, "topRight", sca) * planetDetails.getRadius();;//((getAvgCorner(rowIndex, j, "topRight")-theEntireAvg*1.15)/sca);
					newLandRadiusBottomRight = planetDetails.getRadius()+getAvgCorner(heights, rowIndex, j, theEntireAvg, "bottomRight", sca) * planetDetails.getRadius();;//((getAvgCorner(rowIndex, j, "bottomRight")-theEntireAvg*1.15)/sca);
					newLandRadiusBottomLeft = planetDetails.getRadius()+getAvgCorner(heights, rowIndex, j, theEntireAvg, "bottomLeft", sca) * planetDetails.getRadius();;//((getAvgCorner(rowIndex, j, "bottomLeft")-theEntireAvg*1.15)/sca);

					if (iceHeights[rowIndex][j] < theEntireAvgIce*0.5 && (rowIndex < 50 || rowIndex > 127))
					{
						if ((rowIndex == 0 || rowIndex == 178) || 
							((iceHeights[rowIndex][j] < theEntireAvgIce*0.5 && (rowIndex < 50 || rowIndex > 127)) && 
							 (rowIndex > 0 && rowIndex < 177 && j > 1 && j < 358) &&
							 (iceHeights[rowIndex-1][j] < theEntireAvgIce*0.5 && iceHeights[rowIndex+1][j] < theEntireAvgIce*0.5 && iceHeights[rowIndex][j+1] < theEntireAvgIce*0.5 && iceHeights[rowIndex][j-1] < theEntireAvgIce*0.5) ))
						{
							if (newLandRadiusMid < planetDetails.getRadius()+pushIce)
								newLandRadiusMid = planetDetails.getRadius()+pushIce;
							if (newLandRadiusTopLeft < planetDetails.getRadius()+pushIce)
								newLandRadiusTopLeft = planetDetails.getRadius()+pushIce;
							if (newLandRadiusTopRight < planetDetails.getRadius()+pushIce)
								newLandRadiusTopRight = planetDetails.getRadius()+pushIce;
							if (newLandRadiusBottomRight < planetDetails.getRadius()+pushIce)
								newLandRadiusBottomRight = planetDetails.getRadius()+pushIce;
							if (newLandRadiusBottomLeft < planetDetails.getRadius()+pushIce)
								newLandRadiusBottomLeft = planetDetails.getRadius()+pushIce;
						}
					}
				}
				else
				{
					//Push ice locations, add height (distance from 0,0,0) of 0.01, adjust variables
					newLandRadiusMid = planetDetails.getRadius()+pushIce;//getAvgCornerIce(rowIndex, j, "middle");
					newLandRadiusTopLeft = planetDetails.getRadius()+getAvgCornerIce(iceHeights, rowIndex, j, theEntireAvgIce, "topLeft") * planetDetails.getRadius();		  //getAvgCornerIce is defined in TransformationFunctions.js at the bottom
					newLandRadiusTopRight = planetDetails.getRadius()+getAvgCornerIce(iceHeights, rowIndex, j, theEntireAvgIce, "topRight") * planetDetails.getRadius();
					newLandRadiusBottomRight = planetDetails.getRadius()+getAvgCornerIce(iceHeights, rowIndex, j, theEntireAvgIce, "bottomRight") * planetDetails.getRadius();
					newLandRadiusBottomLeft = planetDetails.getRadius()+getAvgCornerIce(iceHeights, rowIndex, j, theEntireAvgIce, "bottomLeft") * planetDetails.getRadius();
				}

				mid_y = newLandRadiusMid*Math.sin(radians1+((radians2-radians1)/2));
				topLeft_y = newLandRadiusTopLeft*Math.sin(radians1);
				topRight_y = newLandRadiusTopRight*Math.sin(radians1);
				bottomRight_y = newLandRadiusBottomRight*Math.sin(radians2);
				bottomLeft_y = newLandRadiusBottomLeft*Math.sin(radians2);
				
				mid_radius = newLandRadiusMid*Math.cos(radians1+((radians2-radians1)/2));
				topLeft_radius = newLandRadiusTopLeft*Math.cos(radians1);
				topRight_radius = newLandRadiusTopRight*Math.cos(radians1);
				bottomRight_radius = newLandRadiusBottomRight*Math.cos(radians2);
				bottomLeft_radius = newLandRadiusBottomLeft*Math.cos(radians2);

				//Left side square: top left, bottom left, middle
				positions.push([topLeft_radius*Math.cos(radiansB), topLeft_y, topLeft_radius*Math.sin(radiansB), 1.0]);
				positions.push([bottomLeft_radius*Math.cos(radiansB), bottomLeft_y, bottomLeft_radius*Math.sin(radiansB), 1.0]);
				positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);

				var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
				//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

				normals.push(temp_normal);
				normals.push(temp_normal);
				normals.push(temp_normal);

				//Top side square: top right, top left, middle
				positions.push([topRight_radius*Math.cos(radiansA), topRight_y, topRight_radius*Math.sin(radiansA), 1.0]);
				positions.push([topLeft_radius*Math.cos(radiansB), topLeft_y, topLeft_radius*Math.sin(radiansB), 1.0]);
				positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);

				var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
				//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

				normals.push(temp_normal);
				normals.push(temp_normal);
				normals.push(temp_normal);
		
				//Right side square: top right, middle, bottom right
				positions.push([topRight_radius*Math.cos(radiansA), topRight_y, topRight_radius*Math.sin(radiansA), 1.0]);
				positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
				positions.push([bottomRight_radius*Math.cos(radiansA), bottomRight_y, bottomRight_radius*Math.sin(radiansA), 1.0]);

				var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
				//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

				normals.push(temp_normal);
				normals.push(temp_normal);
				normals.push(temp_normal);
		
				//Bottom side square: bottom right, middle, bottom left
				positions.push([bottomRight_radius*Math.cos(radiansA), bottomRight_y, bottomRight_radius*Math.sin(radiansA), 1.0]);
				positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
				positions.push([bottomLeft_radius*Math.cos(radiansB), bottomLeft_y, bottomLeft_radius*Math.sin(radiansB), 1.0]);

				var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
				//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

				normals.push(temp_normal);
				normals.push(temp_normal);
				normals.push(temp_normal);
			}
			else 
			{
				/*if (iceHeights[rowIndex][j] < theEntireAvgIce*0.5 && (rowIndex < 50 || rowIndex > 127))
				{
					//Push ice locations, add height (distance from 0,0,0) of 0.01, adjust variables
					top_y = newIceRadius*Math.sin(radians1);
					mid_y = newIceRadius*Math.sin(radians1+((radians2-radians1)/2));
					bottom_y = newIceRadius*Math.sin(radians2);

					top_radius = newIceRadius*Math.cos(radians1);
					mid_radius = newIceRadius*Math.cos(radians1+((radians2-radians1)/2));
					bottom_radius = newIceRadius*Math.cos(radians2);
				}
				else
				{
					//Push sea locations, no change in location, reset variables
					top_y = planetDetails.getRadius()*Math.sin(radians1);
					mid_y = planetDetails.getRadius()*Math.sin(radians1+((radians2-radians1)/2));
					bottom_y = planetDetails.getRadius()*Math.sin(radians2);

					top_radius = planetDetails.getRadius()*Math.cos(radians1);
					mid_radius = planetDetails.getRadius()*Math.cos(radians1+((radians2-radians1)/2));
					bottom_radius = planetDetails.getRadius()*Math.cos(radians2);
				}*/

				top_y = planetDetails.getRadius()*Math.sin(radians1);
				mid_y = planetDetails.getRadius()*Math.sin(radians1+((radians2-radians1)/2));
				bottom_y = planetDetails.getRadius()*Math.sin(radians2);

				top_radius = planetDetails.getRadius()*Math.cos(radians1);
				mid_radius = planetDetails.getRadius()*Math.cos(radians1+((radians2-radians1)/2));
				bottom_radius = planetDetails.getRadius()*Math.cos(radians2);

				//Left side square: top left, bottom left, middle
				positions.push([top_radius*Math.cos(radiansB), top_y, top_radius*Math.sin(radiansB), 1.0]);
				positions.push([bottom_radius*Math.cos(radiansB), bottom_y, bottom_radius*Math.sin(radiansB), 1.0]);
				positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);

				var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
				//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

				normals.push(temp_normal);
				normals.push(temp_normal);
				normals.push(temp_normal);

				//Top side square: top right, top left, middle
				positions.push([top_radius*Math.cos(radiansA), top_y, top_radius*Math.sin(radiansA), 1.0]);
				positions.push([top_radius*Math.cos(radiansB), top_y, top_radius*Math.sin(radiansB), 1.0]);
				positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);

				var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
				//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

				normals.push(temp_normal);
				normals.push(temp_normal);
				normals.push(temp_normal);
				
				//Right side square: top right, middle, bottom right
				positions.push([top_radius*Math.cos(radiansA), top_y, top_radius*Math.sin(radiansA), 1.0]);
				positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
				positions.push([bottom_radius*Math.cos(radiansA), bottom_y, bottom_radius*Math.sin(radiansA), 1.0]);

				var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
				//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

				normals.push(temp_normal);
				normals.push(temp_normal);
				normals.push(temp_normal);
				
				//Bottom side square: bottom right, middle, bottom left
				positions.push([bottom_radius*Math.cos(radiansA), bottom_y, bottom_radius*Math.sin(radiansA), 1.0]);
				positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
				positions.push([bottom_radius*Math.cos(radiansB), bottom_y, bottom_radius*Math.sin(radiansB), 1.0]);

				var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
				//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

				normals.push(temp_normal);
				normals.push(temp_normal);
				normals.push(temp_normal);
			}
		}
		rowIndex++;
	}
	/* ******************************************************************************************
	 * END Makes each ring of rectangles
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Makes the bottom part that is basically a cone
	 * ******************************************************************************************/
	var firstLvlRadius = newIceRadius*Math.cos((90-(90/(numLevels/2))) * (Math.PI/180));

	for (var i=0; i<360; i+=degsPerIter)
	{
		var angle1 = i;
		var angle2 = i+degsPerIter;
		if (angle2 > 360) angle2 = 360;
		//console.log("Angle1: "+angle1);
		//console.log("Angle2: "+angle2);
		var radians1 = angle1 * (Math.PI/180);
		var radians2 = angle2 * (Math.PI/180);

		var angleDown = 90-90/(numLevels/2);
		//console.log("AngleDown: "+angleDown);
		var radiansDown = angleDown * (Math.PI/180);

		//console.log("Pushing top or bottom");

		positions.push([firstLvlRadius*Math.cos(radians2), newIceRadius*(-1)*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians2), 1.0]);
		positions.push([0, newIceRadius*(-1), 0, 1.0]);
		positions.push([firstLvlRadius*Math.cos(radians1), newIceRadius*(-1)*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians1), 1.0]);

		var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);
		//temp_normal = matVecMult(temp_normal, translate_mat(planetDetails.getOrbitRadius(), 0, 0));

		normals.push(temp_normal);
		normals.push(temp_normal);
		normals.push(temp_normal);
	}
	/* ******************************************************************************************
	 * END Makes the bottom part that is basically a cone
	 * ******************************************************************************************/

	var colorsIndexes = [];

	/* ******************************************************************************************
	 * START Colors top 1 deg of triangles ice 
	 * ******************************************************************************************/
	var rowArr = [];

	for (var i=0; i<360; i+=degsPerIter)
	{
		colors = pushColors(colors, solarSystemDetails.getIceNotFoundColor()[0], solarSystemDetails.getIceNotFoundColor()[1], solarSystemDetails.getIceNotFoundColor()[2], solarSystemDetails.getIceNotFoundColor()[3]);

		rowArr.push(colors.length-3);
	}

	colorsIndexes.push(rowArr);
	/* ******************************************************************************************
	 * END Colors top 1 deg of triangles ice 
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Colors the other parts of the sphere 1 choice of:
				notFoundIce
			   ,notFoundLand
			   ,notFoundSea
	 * ******************************************************************************************/
	for (var i=0; i<numLats; i++)
	{
		var rowArr = [];

		for (var j=0; j<numLongs; j++)
		{
			var rectArr = [];

			for (var k=0; k<numTrisIn1x1Deg; k++)
			{
				if (iceHeights[i][j] < theEntireAvgIce*0.5 && (i < 50 || i > 127))
				{
					colors = pushColors(colors, solarSystemDetails.getIceNotFoundColor()[0], solarSystemDetails.getIceNotFoundColor()[1], solarSystemDetails.getIceNotFoundColor()[2], solarSystemDetails.getIceNotFoundColor()[3]);
				}
				else if (heights[i][j] > theEntireAvg*1.15)
				{
					colors = pushColors(colors, solarSystemDetails.getLandNotFoundColor()[0], solarSystemDetails.getLandNotFoundColor()[1]/*+height*/, solarSystemDetails.getLandNotFoundColor()[2], solarSystemDetails.getLandNotFoundColor()[3]);
				}
				else
				{
					colors = pushColors(colors, solarSystemDetails.getSeaNotFoundColor()[0], solarSystemDetails.getSeaNotFoundColor()[1], solarSystemDetails.getSeaNotFoundColor()[2], solarSystemDetails.getSeaNotFoundColor()[3]);
				}

				rectArr.push(colors.length-3);
			}

			rowArr.push(rectArr);
		}

		colorsIndexes.push(rowArr);
	}
	/* ******************************************************************************************
	 * END Colors the other parts of the sphere in sea
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Colors bottom 1 deg of triangles ice 
	 * ******************************************************************************************/
	var rowArr2 = [];

	for (var i=0; i<360; i+=degsPerIter)
	{
		colors = pushColors(colors, solarSystemDetails.getIceNotFoundColor()[0], solarSystemDetails.getIceNotFoundColor()[1], solarSystemDetails.getIceNotFoundColor()[2], solarSystemDetails.getIceNotFoundColor()[3]);

		rowArr2.push(colors.length-3);
	}

	colorsIndexes.push(rowArr2);
	/* ******************************************************************************************
	 * END Colors bottom 1 deg of triangles ice 
	 * ******************************************************************************************/


	/* ******************************************************************************************
	 * START Make the spots
	 * ******************************************************************************************/
	for (var i=0; i<planetDetails.getNumberSpots(); i++)
	{
		var indexI = planetDetails.getCoordsOfSpots()[i][0];
		var indexJ = planetDetails.getCoordsOfSpots()[i][1];

		var madeSpot = makeSpot(indexI, indexJ, positions, colors, normals, colorsIndexes, planetDetails, heights_at_coords_spots[i]);

		positions = madeSpot.positionsArr;
		colors = madeSpot.colorsArr;
	}
	/* ******************************************************************************************
	 * END Make the spots
	 * ******************************************************************************************/


	// Smooths out coastlines
	var coastTiles = [];

	//console.log("planetDetails.getSeaFoundColor() = "+planetDetails.getSeaFoundColor());
	//console.log("planetDetails.getLandFoundColor() = "+planetDetails.getLandFoundColor());

	for (var i=1; i<numLats-1; i++)
	{
		for (var j=1; j<numLongs-1; j++)
		{
			if (compareColors(colors[colorsIndexes[i+1][j][0]], solarSystemDetails.getSeaNotFoundColor(), false) && 
				(compareColors(colors[colorsIndexes[i+1][j-1][0]], solarSystemDetails.getLandNotFoundColor(), true) ||
				 compareColors(colors[colorsIndexes[i+1][j+1][0]], solarSystemDetails.getLandNotFoundColor(), true) ||
				 compareColors(colors[colorsIndexes[i][j][0]], solarSystemDetails.getLandNotFoundColor(), true) ||
				 compareColors(colors[colorsIndexes[i+2][j][0]], solarSystemDetails.getLandNotFoundColor(), true) ) )
			{
				coastTiles.push([i+1, j]);
			}
		}
	}

	//console.log("coastTiles.length = "+coastTiles.length);

	colors = makeSmooth(planetDetails, colors, colorsIndexes, coastTiles, "sea", "sea", solarSystemDetails);

	var coastTilesIce = [];

	for (var i=1; i<numLats-1; i++)
	{
		if (i < 50 || i > 127)
		{
			for (var j=1; j<numLongs-1; j++)
			{
				if ((compareColors(colors[colorsIndexes[i+1][j][0]], solarSystemDetails.getSeaNotFoundColor(), false) || compareColors(colors[colorsIndexes[i+1][j][0]], solarSystemDetails.getLandNotFoundColor(), true) ) &&
					(compareColors(colors[colorsIndexes[i+1][j-1][0]], solarSystemDetails.getIceNotFoundColor(), false) ||
					 compareColors(colors[colorsIndexes[i+1][j+1][0]], solarSystemDetails.getIceNotFoundColor(), false) ||
					 compareColors(colors[colorsIndexes[i][j][0]], solarSystemDetails.getIceNotFoundColor(), false) ||
					 compareColors(colors[colorsIndexes[i+2][j][0]], solarSystemDetails.getIceNotFoundColor(), false) ) )
				{
					coastTilesIce.push([i+1, j]);
				}
			}
		}
	}

	//console.log("coastTilesIce.length = "+coastTilesIce.length);

	colors = makeSmooth(planetDetails, colors, colorsIndexes, coastTilesIce, "ice", "ice", solarSystemDetails);

	
	/* ******************************************************************************************
	 * START Change color of already found indexes to the found color
	 * ******************************************************************************************/
	for (var i=0; i<planetDetails.getFound().length; i++)
	{
		for (var j=0; j<planetDetails.getFound()[i].length; j++)
		{
			if (planetDetails.getFound()[i][j])
			{
				for (var k=0; k<numTrisIn1x1Deg; k++)
				{
					var indexInColor = colorsIndexes[i][j][k];

					if (i == 0 || i == colorsIndexes.length-1)
						indexInColor = colorsIndexes[i][j];

					if (compareColors(colors[indexInColor], solarSystemDetails.getLandNotFoundColor(), true))
					{
						var height = ((heights[i][j]-theEntireAvg*1.15)/1.5);
						if (heights[i][j] > theEntireAvg*1.3)// && (i > 29 && i < 148))
							height = ((heights[i][j]-theEntireAvg*1.15)/1.2);
						if (heights[i][j] > theEntireAvg*1.45)// && (i > 29 && i < 148))
							height = ((heights[i][j]-theEntireAvg*1.15)/1.05);

						if (height > 1-planetDetails.getLandFoundColor()[1])
							height = 1-planetDetails.getLandFoundColor()[1];
						
						colors = makeTriColor(colors, planetDetails.getLandFoundColor()[0]
													, planetDetails.getLandFoundColor()[1]+height
													, planetDetails.getLandFoundColor()[2], indexInColor);
					}
					else if (compareColors(colors[indexInColor], solarSystemDetails.getSeaNotFoundColor(), false))
					{
						colors = makeTriColor(colors, planetDetails.getSeaFoundColor()[0]
													, planetDetails.getSeaFoundColor()[1]
													, planetDetails.getSeaFoundColor()[2], indexInColor);
					}
					else if (compareColors(colors[indexInColor], solarSystemDetails.getIceNotFoundColor(), false))
					{
						colors = makeTriColor(colors, planetDetails.getIceFoundColor()[0]
													, planetDetails.getIceFoundColor()[1]
													, planetDetails.getIceFoundColor()[2], indexInColor);
					}
				}
			}
		}
	}
	/* ******************************************************************************************
	 * END Change color of already found indexes to the found color
	 * ******************************************************************************************/


	var toReturn = 
	{
		positionsArr: positions
	   ,colorsArr: colors
	   ,colorsIndexesArr: colorsIndexes
	   ,normalsArr: normals
	}

	return toReturn;
}

function spotCoordsNotNearAnother(coordsSpots, indexI, indexJ)
{
	for (var i=0; i<coordsSpots.length; i++)
	{
		//console.log("Dif u = "+Math.abs(indexI-coordsSpots[i][0])+" and dif j = "+Math.abs(indexJ-coordsSpots[i][1]));
		if (Math.abs(indexI-coordsSpots[i][0]) < 6 && Math.abs(indexJ-coordsSpots[i][1]) < 6)
			return false;
	}

	return true;
}

function makeSpot(i_index, j_index, positions, colors, normals, colorsIndexes, planetDetails, heights_at_coords_spots)
{
	var height = heights_at_coords_spots*0.9975;
	if (height < 0)
		height = planetDetails.getRadius()*0.9975;

	//console.log("planet radius = "+planetDetails.getRadius());
	//console.log("height = "+height);
	//console.log("amount of interest = "+(height+(0.01*planetDetails.getRadius())));
	//console.log("how about this = "+heights_at_coords_spots);
	//console.log("--------------------");

	var start_positions = positions.length;

	var spot_scale = planetDetails.getRadius()/15;

	var spot_rotation = Math.random() * 60;

	// START top
	positions.push([0, spot_scale, 0, 1]);
	positions.push([-spot_scale, 0, 0, 1]);
	positions.push([spot_scale, 0, 0, 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);


	positions.push([-spot_scale, 0, 0, 1]);
	positions.push([0, -spot_scale, 0, 1]);
	positions.push([spot_scale, 0, 0, 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);
	// END top


	// START side NE
	positions.push([0, spot_scale, 0, 1]);
	positions.push([spot_scale, 0, 0, 1]);
	positions.push([spot_scale, 0, (-1) * planetDetails.getRadius(), 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);


	positions.push([0, spot_scale, 0, 1]);
	positions.push([spot_scale, 0, (-1) * planetDetails.getRadius(), 1]);
	positions.push([0, spot_scale, (-1) * planetDetails.getRadius(), 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);
	// END side NE


	// START side SE
	positions.push([spot_scale, 0, 0, 1]);
	positions.push([0, -spot_scale, 0, 1]);
	positions.push([0, -spot_scale, (-1) * planetDetails.getRadius(), 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);


	positions.push([spot_scale, 0, 0, 1]);
	positions.push([0, -spot_scale, (-1) * planetDetails.getRadius(), 1]);
	positions.push([spot_scale, 0, (-1) * planetDetails.getRadius(), 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);
	// END side SE


	// START side SW
	positions.push([0, -spot_scale, 0, 1]);
	positions.push([-spot_scale, 0, 0, 1]);
	positions.push([-spot_scale, 0, (-1) * planetDetails.getRadius(), 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);


	positions.push([0, -spot_scale, 0, 1]);
	positions.push([-spot_scale, 0, (-1) * planetDetails.getRadius(), 1]);
	positions.push([0, -spot_scale, (-1) * planetDetails.getRadius(), 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);
	// END side SW


	// START side NW
	positions.push([-spot_scale, 0, 0, 1]);
	positions.push([0, spot_scale, 0, 1]);
	positions.push([0, spot_scale, (-1) * planetDetails.getRadius(), 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);


	positions.push([-spot_scale, 0, 0, 1]);
	positions.push([0, spot_scale, (-1) * planetDetails.getRadius(), 1]);
	positions.push([-spot_scale, 0, (-1) * planetDetails.getRadius(), 1]);

	var temp_normal = calcNormal(positions[positions.length-2], positions[positions.length-1], positions[positions.length-3]);

	normals.push(temp_normal);
	normals.push(temp_normal);
	normals.push(temp_normal);

	for (var i=0; i<3; i++)
		colors.push([0.2, 0.2, 0.2, 1.0]);
	// END side NW


	for (var k=0; k<30; k++)
	{
		var new_loc = matVecMult(translate_mat(0, 0, height/*+(0.01*planetDetails.getRadius())*/), positions[positions.length-(k+1)]);
		var new_norm = matVecMult(translate_mat(0, 0, height/*+(0.01*planetDetails.getRadius())*/), normals[normals.length-(k+1)]);

		new_loc = matVecMult(rotate_mat(0, 0, 45+spot_rotation), new_loc);
		new_norm = matVecMult(rotate_mat(0, 0, 45+spot_rotation), new_norm);

		/*if (k == 0)
		{
			printVec(new_loc);
			console.log("i = "+i_index+" and converted = "+((-1)*(i_index-90)));
			console.log("j = "+j_index+" and converted = "+(j_index-90));
		}*/

		new_loc = matVecMult(rotate_mat(((-1)*(i_index-90)), 0, 0), new_loc);
		new_norm = matVecMult(rotate_mat(((-1)*(i_index-90)), 0, 0), new_norm);

		new_loc = matVecMult(rotate_mat(0, (j_index-90), 0), new_loc);
		new_norm = matVecMult(rotate_mat(0, (j_index-90), 0), new_norm);

		positions[positions.length-(k+1)][0] = new_loc[0];
		positions[positions.length-(k+1)][1] = new_loc[1];
		positions[positions.length-(k+1)][2] = new_loc[2];

		normals[normals.length-(k+1)][0] = new_norm[0];
		normals[normals.length-(k+1)][1] = new_norm[1];
		normals[normals.length-(k+1)][2] = new_norm[2];

		//colors.push([0.2, 0.2, 0.2, 1.0]);
	}


	for (var i=0; i<4; i++)
	{
		for (var j=0; j<4; j++)
		{
			var positions_lengths_here = positions.length;

			var building_height = Math.max(Math.random() * 0.5, 0.1);

			var temp = makePositionsBuilding(0.2, building_height, 90);

			for (var k=0; k<temp.positions.length; k++)
			{
				var buildings_scale = planetDetails.getRadius()/22;

				var new_pos = matVecMult(scale_mat(buildings_scale), temp.positions[k]);

				new_pos = matVecMult(rotate_mat(90, 0, 0), new_pos);

				new_pos = matVecMult(translate_mat(0, 0, building_height*buildings_scale), new_pos);

				new_pos = matVecMult(translate_mat((-0.75*buildings_scale)+(i*0.5*buildings_scale), (-0.75*buildings_scale)+(j*0.5*buildings_scale), 0), new_pos);

				new_pos = matVecMult(translate_mat(0, 0, height/*+(0.01*planetDetails.getRadius())*/), new_pos);


				new_pos = matVecMult(rotate_mat(0, 0, spot_rotation), new_pos);


				new_pos = matVecMult(rotate_mat(((-1)*(i_index-90)), 0, 0), new_pos);
				new_pos = matVecMult(rotate_mat(0, (j_index-90), 0), new_pos);


				positions.push(new_pos);
				colors.push(temp.colors[k]);
			}

			for (var k=positions_lengths_here; k<positions_lengths_here + temp.positions.length; k++)
			{
				if (k % 3 == 0)
				{
					var temp_normal = calcNormal(positions[k+1], positions[k+2], positions[k]);

					normals.push(temp_normal);
					normals.push(temp_normal);
					normals.push(temp_normal);
				}
			}
		}
	}

	//console.log("total spot indexes = "+(positions.length-start_positions));

	positions_length_for_all_spots_planet_view += (positions.length-start_positions);

	/*console.log("Positions after:");
	printVec(positions[positions.length-6]);
	printVec(positions[positions.length-5]);
	printVec(positions[positions.length-4]);
	console.log("----");
	printVec(positions[positions.length-3]);
	printVec(positions[positions.length-2]);
	printVec(positions[positions.length-1]);*/

	//console.log("positions.length = "+positions.length);
	//console.log("colors.length = "+colors.length);
	//console.log("normals.length = "+normals.length);

	var toReturn = 
	{
		positionsArr: positions
	   ,colorsArr: colors
	   ,normalsArr: normals
	}

	return toReturn;
}

function makePositionsBuilding(radius, height, degsPerSide)
{
	var positions = [];
	var colors = [];

	var temp_pos = makePositionsCylinder(radius, height, degsPerSide);

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(rotate_mat(0, 45, 0), temp_pos[i]);

		positions.push(new_pos);
		colors.push([0.2, 0.2, 0.2, 1]);
	}


	var side_width = Math.sqrt(Math.pow(radius, 2)+Math.pow(radius, 2));


	for (var i=0; i<4; i++)
	{
		for (var j=-height+0.075; j<height-0.04; j+=0.08)
		{
			if (Math.random() >= 0.55)
			{
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [-side_width/6+side_width/4, 0.025+j, side_width/2+0.01, 1]));
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [-side_width/6+side_width/4, -0.025+j, side_width/2+0.01, 1]));
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [side_width/6+side_width/4, -0.025+j, side_width/2+0.01, 1]));

				positions.push(matVecMult(rotate_mat(0, i*90, 0), [-side_width/6+side_width/4, 0.025+j, side_width/2+0.01, 1]));
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [side_width/6+side_width/4, -0.025+j, side_width/2+0.01, 1]));
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [side_width/6+side_width/4, 0.025+j, side_width/2+0.01, 1]));

				for (var k=0; k<6; k++)
					colors.push([1, 0.96, 0.388, 1.0]);
			}
				
			if (Math.random() >= 0.55)
			{
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [-side_width/6-side_width/4, 0.025+j, side_width/2+0.01, 1]));
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [-side_width/6-side_width/4, -0.025+j, side_width/2+0.01, 1]));
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [side_width/6-side_width/4, -0.025+j, side_width/2+0.01, 1]));

				positions.push(matVecMult(rotate_mat(0, i*90, 0), [-side_width/6-side_width/4, 0.025+j, side_width/2+0.01, 1]));
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [side_width/6-side_width/4, -0.025+j, side_width/2+0.01, 1]));
				positions.push(matVecMult(rotate_mat(0, i*90, 0), [side_width/6-side_width/4, 0.025+j, side_width/2+0.01, 1]));

				for (var k=0; k<6; k++)
					colors.push([1, 0.96, 0.388, 1.0]);
			}
		}
	}

	var to_return = 
	{
		positions: positions
	   ,colors: colors
	}

	return to_return;
}

function cleanUpHeights(arrHeights, rowLength, colLength, theEntireAvg)
{
	// Attempts: "Clean up grid of land holes"
	var avgOfTheAvg = 0;
	var num = 0;
	for (var i=1; i<rowLength-1; i++)
	{
		for (var j=1; j<colLength-1; j++)
		{
			if (arrHeights[i][j] > theEntireAvg*1.15)
			{
				avgOfTheAvg+=isOutlier(arrHeights, i, j);
				num++;
			}
		}
	}
	avgOfTheAvg = avgOfTheAvg/num;
	//console.log("avgOfTheAvg = "+avgOfTheAvg);

	for (var i=1; i<rowLength-1; i++)
	{
		for (var j=1; j<colLength-1; j++)
		{
			if (arrHeights[i][j] > theEntireAvg*1.15)
			{
				if (Math.abs(isOutlier(arrHeights, i, j)-avgOfTheAvg) > 0.005)
				{
					//console.log("arrHeights["+i+"]["+j+"] was = "+arrHeights[i][j]);
					arrHeights[i][j] = isOutlier(arrHeights, i, j);
					//console.log("arrHeights["+i+"]["+j+"] now = "+arrHeights[i][j]);
				}
				if (Math.abs(isOutlier2(arrHeights, i, j)-avgOfTheAvg) > 0.005)
				{
					//console.log("arrHeights["+i+"]["+j+"] was = "+arrHeights[i][j]);
					arrHeights[i][j] = isOutlier2(arrHeights, i, j);
					//console.log("arrHeights["+i+"]["+j+"] now = "+arrHeights[i][j]);
				}
			}
		}
	}

	for (var i=2; i<rowLength-2; i++)
	{
		for (var j=2; j<colLength-2; j++)
		{
			if (arrHeights[i][j] <= theEntireAvg*1.15)
			{
				var countSeaNeighbors = 0;
				if (arrHeights[i-1][j] <= theEntireAvg*1.15)
					countSeaNeighbors++;
				if (arrHeights[i+1][j] <= theEntireAvg*1.15)
					countSeaNeighbors++;
				if (arrHeights[i][j+1] <= theEntireAvg*1.15)
					countSeaNeighbors++;
				if (arrHeights[i][j-1] <= theEntireAvg*1.15)
					countSeaNeighbors++;

				if (countSeaNeighbors < 2)
				{
					var crossAvg = (arrHeights[i][j]+arrHeights[i-1][j]+arrHeights[i+1][j]+arrHeights[i][j-1]+arrHeights[i][j+1])/5;
					var surroundingAvg = (arrHeights[i-1][j-1]+arrHeights[i+1][j+1]+arrHeights[i+1][j-1]+arrHeights[i-1][j+1]
										 +arrHeights[i-2][j]+arrHeights[i-2][j+1]+arrHeights[i-2][j-1]
										 +arrHeights[i+2][j]+arrHeights[i+2][j+1]+arrHeights[i+2][j-1]
										 +arrHeights[i][j-2]+arrHeights[i+1][j-2]+arrHeights[i-1][j-2]
										 +arrHeights[i][j+2]+arrHeights[i+1][j+2]+arrHeights[i-1][j+2])/16;

					arrHeights[i][j] = surroundingAvg+(Math.random()-0.5)*0.005;
					arrHeights[i+1][j+1] = surroundingAvg+(Math.random()-0.5)*0.005;
					arrHeights[i-1][j-1] = surroundingAvg+(Math.random()-0.5)*0.005;
					arrHeights[i+1][j-1] = surroundingAvg+(Math.random()-0.5)*0.005;
					arrHeights[i-1][j+1] = surroundingAvg+(Math.random()-0.5)*0.005;
				}
			}
		}
	}

	// Attempts: "Decrease heights of islands (ice and land)"
	for (var i=1; i<rowLength-1; i++)
	{
		for (var j=1; j<colLength-1; j++)
		{
			if (arrHeights[i][j] > theEntireAvg*1.15)
			{
				if (arrHeights[i+1][j] <= theEntireAvg*1.15 || arrHeights[i-1][j] <= theEntireAvg*1.15 || arrHeights[i][j+1] <= theEntireAvg*1.15 || arrHeights[i][j-1] <= theEntireAvg*1.15)
				{
					//console.log("Height at "+i+", "+j+" (coast) = "+(arrHeights[i][j]-theEntireAvg*1.15));
					arrHeights[i][j] = (theEntireAvg*1.15)+0.005;
				}
			}
		}
	}

	return arrHeights;
}

function isOutlier(arrHeights, row, col)
{
	return (arrHeights[row-1][col]+arrHeights[row+1][col]+arrHeights[row][col-1]+arrHeights[row][col+1])/4;
}

function isOutlier2(arrHeights, row, col)
{
	return (arrHeights[row-1][col-1]+arrHeights[row+1][col+1]+arrHeights[row-1][col+1]+arrHeights[row+1][col-1])/4;
}

function getAvgCorner(heights, i, j, theEntireAvg, which, sca)
{
	try
	{
		if (which == "topLeft")
		{
			if (heights[i-1][j] <= theEntireAvg*1.15 || heights[i-1][j+1] <= theEntireAvg*1.15 || heights[i][j+1] <= theEntireAvg*1.15)
				return 0;//theEntireAvg*1.15;
			//else if ((heights[i][j] > theEntireAvg*1.3) && (heights[i-1][j] <= theEntireAvg*1.3 || heights[i-1][j+1] <= theEntireAvg*1.3 || heights[i][j+1] <= theEntireAvg*1.3))
			//	return (((heights[i][j]+heights[i-1][j]+heights[i-1][j+1]+heights[i][j+1])/4)-theEntireAvg*1.15)/4;
			//else if ((heights[i][j] > theEntireAvg*1.45) && (heights[i-1][j] <= theEntireAvg*1.45 || heights[i-1][j+1] <= theEntireAvg*1.45 || heights[i][j+1] <= theEntireAvg*1.45))
			//	return (((heights[i][j]+heights[i-1][j]+heights[i-1][j+1]+heights[i][j+1])/4)-theEntireAvg*1.15)/3;
			else
				return (((heights[i][j]+heights[i-1][j]+heights[i-1][j+1]+heights[i][j+1])/4)-theEntireAvg*1.15)/3;
		}
		else if (which == "topRight")
		{
			if (heights[i-1][j] <= theEntireAvg*1.15 || heights[i-1][j-1] <= theEntireAvg*1.15 || heights[i][j-1] <= theEntireAvg*1.15)
				return 0;//theEntireAvg*1.15;
			//else if ((heights[i][j] > theEntireAvg*1.3) && (heights[i-1][j] <= theEntireAvg*1.3 || heights[i-1][j-1] <= theEntireAvg*1.3 || heights[i][j-1] <= theEntireAvg*1.3))
			//	return (((heights[i][j]+heights[i-1][j]+heights[i-1][j-1]+heights[i][j-1])/4)-theEntireAvg*1.15)/4;
			//else if ((heights[i][j] > theEntireAvg*1.45) && (heights[i-1][j] <= theEntireAvg*1.45 || heights[i-1][j-1] <= theEntireAvg*1.45 || heights[i][j-1] <= theEntireAvg*1.45))
			//	return (((heights[i][j]+heights[i-1][j]+heights[i-1][j-1]+heights[i][j-1])/4)-theEntireAvg*1.15)/3;
			else
				return (((heights[i][j]+heights[i-1][j]+heights[i-1][j-1]+heights[i][j-1])/4)-theEntireAvg*1.15)/3;
		}
		else if (which == "bottomRight")
		{
			if (heights[i+1][j] <= theEntireAvg*1.15 || heights[i+1][j-1] <= theEntireAvg*1.15 || heights[i][j-1] <= theEntireAvg*1.15)
				return 0;//theEntireAvg*1.15;
			//else if ((heights[i][j] > theEntireAvg*1.3) && (heights[i+1][j] <= theEntireAvg*1.3 || heights[i+1][j-1] <= theEntireAvg*1.3 || heights[i][j-1] <= theEntireAvg*1.3))
			//	return (((heights[i][j]+heights[i+1][j]+heights[i+1][j-1]+heights[i][j-1])/4)-theEntireAvg*1.15)/4;
			//else if ((heights[i][j] > theEntireAvg*1.45) && (heights[i+1][j] <= theEntireAvg*1.45 || heights[i+1][j-1] <= theEntireAvg*1.45 || heights[i][j-1] <= theEntireAvg*1.45))
			//	return (((heights[i][j]+heights[i+1][j]+heights[i+1][j-1]+heights[i][j-1])/4)-theEntireAvg*1.15)/3;
			else
				return (((heights[i][j]+heights[i+1][j]+heights[i+1][j-1]+heights[i][j-1])/4)-theEntireAvg*1.15)/3;
		}
		else //if (which == "bottomLeft")
		{
			if (heights[i+1][j] <= theEntireAvg*1.15 || heights[i+1][j+1] <= theEntireAvg*1.15 || heights[i][j+1] <= theEntireAvg*1.15)
				return 0;//theEntireAvg*1.15;
			//else if ((heights[i][j] > theEntireAvg*1.3) && (heights[i+1][j] <= theEntireAvg*1.3 || heights[i+1][j+1] <= theEntireAvg*1.3 || heights[i][j+1] <= theEntireAvg*1.3))
			//	return (((heights[i][j]+heights[i+1][j]+heights[i+1][j+1]+heights[i][j+1])/4)-theEntireAvg*1.15)/4;
			//else if ((heights[i][j] > theEntireAvg*1.45) && (heights[i+1][j] <= theEntireAvg*1.45 || heights[i+1][j+1] <= theEntireAvg*1.45 || heights[i][j+1] <= theEntireAvg*1.45))
			//	return (((heights[i][j]+heights[i+1][j]+heights[i+1][j+1]+heights[i][j+1])/4)-theEntireAvg*1.15)/3;
			else
				return (((heights[i][j]+heights[i+1][j]+heights[i+1][j+1]+heights[i][j+1])/4)-theEntireAvg*1.15)/3;
		}
	}
	catch (e)
	{
		return 0;//theEntireAvg*1.15;
	}
}

function getAvgCornerIce(iceHeights, i, j, theEntireAvgIce, which)
{
	try
	{
		if (which == "topLeft")
		{
			if (iceHeights[i-1][j] >= theEntireAvgIce*0.5 || iceHeights[i-1][j+1] >= theEntireAvgIce*0.5 || iceHeights[i][j+1] >= theEntireAvgIce*0.5)
				return 0;
			//else if (heights[i-1][j] <= theEntireAvg*1.15 || heights[i-1][j+1] <= theEntireAvg*1.15 || heights[i][j+1] <= theEntireAvg*1.15)
			//	return 0;
			else
				return 0;//pushIce;
		}
		else if (which == "topRight")
		{
			if (iceHeights[i-1][j] >= theEntireAvgIce*0.5 || iceHeights[i-1][j-1] >= theEntireAvgIce*0.5 || iceHeights[i][j-1] >= theEntireAvgIce*0.5)
				return 0;
			//else if (heights[i-1][j] <= theEntireAvg*1.15 || heights[i-1][j-1] <= theEntireAvg*1.15 || heights[i][j-1] <= theEntireAvg*1.15)
			//	return 0;
			else
				return pushIce;
		}
		else if (which == "bottomRight")
		{
			if (iceHeights[i+1][j] >= theEntireAvgIce*0.5 || iceHeights[i+1][j-1] >= theEntireAvgIce*0.5 || iceHeights[i][j-1] >= theEntireAvgIce*0.5)
				return 0;
			//else if (heights[i+1][j] <= theEntireAvg*1.15 || heights[i+1][j-1] <= theEntireAvg*1.15 || heights[i][j-1] <= theEntireAvg*1.15)
			//	return 0;
			else
				return 0;//pushIce;
		}
		else //if (which == "bottomLeft")
		{
			if (iceHeights[i+1][j] >= theEntireAvgIce*0.5 || iceHeights[i+1][j+1] >= theEntireAvgIce*0.5 || iceHeights[i][j+1] >= theEntireAvgIce*0.5)
				return 0;
			//else if (heights[i+1][j] <= theEntireAvg*1.15 || heights[i+1][j+1] <= theEntireAvg*1.15 || heights[i][j+1] <= theEntireAvg*1.15)
			//	return 0;
			else
				return 0;//pushIce;//(iceHeights[i][j]+iceHeights[i+1][j]+iceHeights[i+1][j+1]+iceHeights[i][j+1])/4;
		}
	}
	catch (e)
	{
		return 0;//pushIce;//theEntireAvg*1.15;
	}
}

function compareColors(current_color_arr, color_arr_of_interest, land_yn)
{
	if (land_yn)
		return current_color_arr[0] == color_arr_of_interest[0] && current_color_arr[1] >= color_arr_of_interest[1] && current_color_arr[2] == color_arr_of_interest[2];
	else
		return current_color_arr[0] == color_arr_of_interest[0] && current_color_arr[1] == color_arr_of_interest[1] && current_color_arr[2] == color_arr_of_interest[2];
}

function makeSmooth(planetDetails, colors, colorsIndexes, arr, which, checkWhich, solarSystemDetails)
{
	var makeToThis = [planetDetails.getLandFoundColor()[0], planetDetails.getLandFoundColor()[1], planetDetails.getLandFoundColor()[2]];
	if (which == "ice")
		makeToThis = [planetDetails.getIceFoundColor()[0], planetDetails.getIceFoundColor()[1], planetDetails.getIceFoundColor()[2]];

	if (solarSystemDetails)
	{
		makeToThis = [solarSystemDetails.getLandNotFoundColor()[0], solarSystemDetails.getLandNotFoundColor()[1], solarSystemDetails.getLandNotFoundColor()[2]];
		if (which == "ice")
			makeToThis = [solarSystemDetails.getIceNotFoundColor()[0], solarSystemDetails.getIceNotFoundColor()[1], solarSystemDetails.getIceNotFoundColor()[2]];
	}

	var resetToThis = [planetDetails.getSeaFoundColor()[0], planetDetails.getSeaFoundColor()[1], planetDetails.getSeaFoundColor()[2]];
	if (which == "ice")
		resetToThis = [planetDetails.getIceFoundColor()[0], planetDetails.getIceFoundColor()[1], planetDetails.getIceFoundColor()[2]];

	if (solarSystemDetails)
	{
		resetToThis = [solarSystemDetails.getSeaNotFoundColor()[0], solarSystemDetails.getSeaNotFoundColor()[1], solarSystemDetails.getSeaNotFoundColor()[2]];
		if (which == "ice")
			resetToThis = [solarSystemDetails.getIceNotFoundColor()[0], solarSystemDetails.getIceNotFoundColor()[1], solarSystemDetails.getIceNotFoundColor()[2]];
	}

	var checkThis = [planetDetails.getLandFoundColor()[0], planetDetails.getLandFoundColor()[1], planetDetails.getLandFoundColor()[2]];
	if (checkWhich == "ice")
		checkThis = [planetDetails.getIceFoundColor()[0], planetDetails.getIceFoundColor()[1], planetDetails.getIceFoundColor()[2]];

	if (solarSystemDetails)
	{
		checkThis = [solarSystemDetails.getLandNotFoundColor()[0], solarSystemDetails.getLandNotFoundColor()[1], solarSystemDetails.getLandNotFoundColor()[2]];
		if (checkWhich == "ice")
			checkThis = [solarSystemDetails.getIceNotFoundColor()[0], solarSystemDetails.getIceNotFoundColor()[1], solarSystemDetails.getIceNotFoundColor()[2]];
	}

	//console.log("makeToThis = "+makeToThis);
	//console.log("resetToThis = "+resetToThis);
	//console.log("checkThis = "+checkThis);

	for (var i=0; i<arr.length; i++)
	{
		var countNeighbors = 0;

		var row = arr[i][0];
		var col = arr[i][1];

		if (compareColors(colors[colorsIndexes[row][col+1][0]], checkThis, checkWhich == "ice" ? false : true) && 
			compareColors(colors[colorsIndexes[row][col+1][1]], checkThis, checkWhich == "ice" ? false : true) && 
			compareColors(colors[colorsIndexes[row][col+1][2]], checkThis, checkWhich == "ice" ? false : true) && 
			compareColors(colors[colorsIndexes[row][col+1][3]], checkThis, checkWhich == "ice" ? false : true) )
		{
			countNeighbors++;
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][0]);
		}
		/*if (colors[colorsIndexes[row][col+1][0]][0] == checkThis[0] && colors[colorsIndexes[row][col+1][0]][1] == checkThis[1] && colors[colorsIndexes[row][col+1][0]][2] == checkThis[2] &&
			colors[colorsIndexes[row][col+1][1]][0] == checkThis[0] && colors[colorsIndexes[row][col+1][1]][1] == checkThis[1] && colors[colorsIndexes[row][col+1][1]][2] == checkThis[2] &&
			colors[colorsIndexes[row][col+1][2]][0] == checkThis[0] && colors[colorsIndexes[row][col+1][2]][1] == checkThis[1] && colors[colorsIndexes[row][col+1][2]][2] == checkThis[2] &&
			colors[colorsIndexes[row][col+1][3]][0] == checkThis[0] && colors[colorsIndexes[row][col+1][3]][1] == checkThis[1] && colors[colorsIndexes[row][col+1][3]][2] == checkThis[2] )
		{
			countNeighbors++;
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][0]);
		}*/

		if (compareColors(colors[colorsIndexes[row-1][col][0]], checkThis, checkWhich == "ice" ? false : true) && 
			compareColors(colors[colorsIndexes[row-1][col][1]], checkThis, checkWhich == "ice" ? false : true) && 
			compareColors(colors[colorsIndexes[row-1][col][2]], checkThis, checkWhich == "ice" ? false : true) && 
			compareColors(colors[colorsIndexes[row-1][col][3]], checkThis, checkWhich == "ice" ? false : true) )
		{
			countNeighbors++;
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][1]);
		}
		/*if (colors[colorsIndexes[row-1][col][0]][0] == checkThis[0] && colors[colorsIndexes[row-1][col][0]][1] == checkThis[1] && colors[colorsIndexes[row-1][col][0]][2] == checkThis[2] &&
			colors[colorsIndexes[row-1][col][1]][0] == checkThis[0] && colors[colorsIndexes[row-1][col][1]][1] == checkThis[1] && colors[colorsIndexes[row-1][col][1]][2] == checkThis[2] &&
			colors[colorsIndexes[row-1][col][2]][0] == checkThis[0] && colors[colorsIndexes[row-1][col][2]][1] == checkThis[1] && colors[colorsIndexes[row-1][col][2]][2] == checkThis[2] &&
			colors[colorsIndexes[row-1][col][3]][0] == checkThis[0] && colors[colorsIndexes[row-1][col][3]][1] == checkThis[1] && colors[colorsIndexes[row-1][col][3]][2] == checkThis[2] )
		{
			countNeighbors++;
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][1]);
		}*/

		if (compareColors(colors[colorsIndexes[row][col-1][0]], checkThis, checkWhich == "ice" ? false : true))
		{
			countNeighbors++;
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][2]);
		}
		/*if (colors[colorsIndexes[row][col-1][0]][0] == checkThis[0] && colors[colorsIndexes[row][col-1][0]][1] == checkThis[1] && colors[colorsIndexes[row][col-1][0]][2] == checkThis[2])
		{
			countNeighbors++;
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][2]);
		}*/
		
		if (compareColors(colors[colorsIndexes[row+1][col][0]], checkThis, checkWhich == "ice" ? false : true))
		{
			countNeighbors++;
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][3]);
		}
		/*if (colors[colorsIndexes[row+1][col][0]][0] == checkThis[0] && colors[colorsIndexes[row+1][col][0]][1] == checkThis[1] && colors[colorsIndexes[row+1][col][0]][2] == checkThis[2])
		{
			countNeighbors++;
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][3]);
		}*/

		if (countNeighbors < 2 ||
		   (countNeighbors == 2 &&
			compareColors(colors[colorsIndexes[row-1][col][0]], checkThis, checkWhich == "ice" ? false : true) && 
			compareColors(colors[colorsIndexes[row+1][col][0]], checkThis, checkWhich == "ice" ? false : true) ) ||
		   (countNeighbors == 2 &&
			compareColors(colors[colorsIndexes[row][col+1][0]], checkThis, checkWhich == "ice" ? false : true) && 
			compareColors(colors[colorsIndexes[row][col-1][0]], checkThis, checkWhich == "ice" ? false : true) ) )
		{
			colors = makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][0]);
			colors = makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][1]);
			colors = makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][2]);
			colors = makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][3]);
		}
		/*if (countNeighbors < 2 ||
		   (countNeighbors == 2 &&
			(colors[colorsIndexes[row-1][col][0]][0] == checkThis[0] && colors[colorsIndexes[row-1][col][0]][1] == checkThis[1] && colors[colorsIndexes[row-1][col][0]][2] == checkThis[2]) && 
			(colors[colorsIndexes[row+1][col][0]][0] == checkThis[0] && colors[colorsIndexes[row+1][col][0]][1] == checkThis[1] && colors[colorsIndexes[row+1][col][0]][2] == checkThis[2]) ) ||
		   (countNeighbors == 2 &&
			(colors[colorsIndexes[row][col+1][0]][0] == checkThis[0] && colors[colorsIndexes[row][col+1][0]][1] == checkThis[1] && colors[colorsIndexes[row][col+1][0]][2] == checkThis[2]) &&
			(colors[colorsIndexes[row][col-1][0]][0] == checkThis[0] && colors[colorsIndexes[row][col-1][0]][1] == checkThis[1] && colors[colorsIndexes[row][col-1][0]][2] == checkThis[2]) ) )
		{
			colors = makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][0]);
			colors = makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][1]);
			colors = makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][2]);
			colors = makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][3]);
		}*/

		if (countNeighbors > 2)
		{
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][0]);
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][1]);
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][2]);
			colors = makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][3]);
		}
	}

	return colors;
}

function makeSpaceship()
{
	var positions = [];
	var colors = [];
	var normals = [];

	// START Make flames from engine
	var temp_pos = makePositionsCone(0.025, 0.1, 5);

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(rotate_mat(180, 0, 0), temp_pos[i]);

		new_pos = matVecMult(translate_mat(0.1, -0.25, 0), new_pos);

		positions.push(new_pos);
	}

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(rotate_mat(180, 0, 0), temp_pos[i]);

		new_pos = matVecMult(translate_mat(-0.1, -0.25, 0), new_pos);

		positions.push(new_pos);
	}
	// END Make flames from engine


	// START Make engines
	temp_pos = makePositionsCylinder(0.04, 0.15, 5);

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(translate_mat(0.1, 0, 0), temp_pos[i]);

		positions.push(new_pos);
	}

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(translate_mat(-0.1, 0, 0), temp_pos[i]);

		positions.push(new_pos);
	}
	// END Make engines


	// START Make center body and cockpit
	temp_pos = makePositionsCylinder(0.085, 0.15, 90);

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(rotate_mat(0, 45, 0), temp_pos[i]);

		positions.push(new_pos);
	}

	// Front triangle
	positions.push([0, 0.45, 0, 1]);
	positions.push([-0.06, 0.15, 0.06, 1]);
	positions.push([0.06, 0.15, 0.06, 1]);

	// Back triangle
	positions.push([0, 0.45, 0, 1]);
	positions.push([0.06, 0.15, -0.06, 1]);
	positions.push([-0.06, 0.15, -0.06, 1]);

	// Right side of triangle
	positions.push([0, 0.45, 0, 1]);
	positions.push([0.06, 0.15, 0.06, 1]);
	positions.push([0.06, 0.15, -0.06, 1]);

	// Left side of triangle
	positions.push([0, 0.45, 0, 1]);
	positions.push([-0.06, 0.15, -0.06, 1]);
	positions.push([-0.06, 0.15, 0.06, 1]);
	// END Make center body and cockpit


	// START Make the right wing
	positions.push([0.13, 0.8, 0, 1]);
	positions.push([0.13, 0, 0.02, 1]);
	positions.push([0.4, 0, 0, 1]);

	positions.push([0.13, 0, 0.02, 1]);
	positions.push([0.13, -0.4, 0, 1]);
	positions.push([0.4, 0, 0, 1]);

	positions.push([0.13, 0.8, 0, 1]);
	positions.push([0.4, 0, 0, 1]);
	positions.push([0.13, 0, -0.02, 1]);

	positions.push([0.13, -0.4, 0, 1]);
	positions.push([0.13, 0, -0.02, 1]);
	positions.push([0.4, 0, 0, 1]);

	positions.push([0.13, 0.8, 0, 1]);
	positions.push([0.13, 0, -0.02, 1]);
	positions.push([0.13, 0, 0.02, 1]);

	positions.push([0.13, 0, -0.02, 1]);
	positions.push([0.13, -0.4, 0, 1]);
	positions.push([0.13, 0, 0.02, 1]);
	// END Make the right wing


	// START Make the left wing
	positions.push([-0.13, 0.8, 0, 1]);
	positions.push([-0.4, 0, 0, 1]);
	positions.push([-0.13, 0, 0.02, 1]);

	positions.push([-0.13, 0, 0.02, 1]);
	positions.push([-0.4, 0, 0, 1]);
	positions.push([-0.13, -0.4, 0, 1]);

	positions.push([-0.13, 0.8, 0, 1]);
	positions.push([-0.13, 0, -0.02, 1]);
	positions.push([-0.4, 0, 0, 1]);

	positions.push([-0.13, -0.4, 0, 1]);
	positions.push([-0.4, 0, 0, 1]);
	positions.push([-0.13, 0, -0.02, 1]);

	positions.push([-0.13, 0.8, 0, 1]);
	positions.push([-0.13, 0, 0.02, 1]);
	positions.push([-0.13, 0, -0.02, 1]);

	positions.push([-0.13, 0, -0.02, 1]);
	positions.push([-0.13, 0, 0.02, 1]);
	positions.push([-0.13, -0.4, 0, 1]);
	// END Make the left wing

	for (var i=0; i<positions.length; i++)
	{
		if (i % 3 == 0)
		{
			var temp_normal = calcNormal(positions[i+1], positions[i+2], positions[i]);
			if (i < 864)
			{
				temp_normal = scaVecMult(-1, temp_normal);
			}

			normals.push(temp_normal);
			normals.push(temp_normal);
			normals.push(temp_normal);
		}
	}


	for (var i=0; i<864; i++)
	{
		colors.push([0.533, 0.94, 1, 1.0]);
	}

	for (var i=0; i<2688-864; i++)
	{
		colors.push([0.7, 0.7, 0.7, 1]);
	}

	// Should be 2688
	//console.log("Spaceship positions length = "+positions.length);

	var toReturn = 
	{
		positionsArr: positions
	   ,colorsArr: colors
	   ,normalsArr: normals
	};

	return toReturn;
}

function makeSpaceshipBoom()
{
	var positions = [];
	var colors = [];
	var normals = [];

	// START Outer boom
	var temp_pos = makePositionsCylinder(0.25, 0, 5);

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(rotate_mat(90, 0, 0), temp_pos[i]);

		positions.push(new_pos);
	}

	for (var j=0; j<360; j+=30)
	{
		var random_radius = Math.random();
		if (random_radius < 0.4)
			random_radius = 0.4;
		var random_height = Math.random();
		if (random_height < 0.4)
			random_height = 0.4;

		temp_pos = makePositionsCone(0.15*random_radius, 0.2*random_height, 180);

		for (var i=0; i<temp_pos.length; i++)
		{
			var new_pos = matVecMult(translate_mat(0, 0.3, 0), temp_pos[i]);

			new_pos = matVecMult(rotate_mat(0, 0, j+10), new_pos);

			positions.push(new_pos);
		}
	} 
	// END Outer boom

	
	// START next inward boom
	temp_pos = makePositionsCylinder(0.2, 0, 5);

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(rotate_mat(90, 0, 0), temp_pos[i]);

		new_pos = matVecMult(translate_mat(0, 0, 0.01), new_pos);

		positions.push(new_pos);
	}

	for (var j=0; j<360; j+=30)
	{
		var random_radius = Math.random();
		if (random_radius < 0.4)
			random_radius = 0.4;
		var random_height = Math.random();
		if (random_height < 0.4)
			random_height = 0.4;

		temp_pos = makePositionsCone(0.15*random_radius, 0.125*random_height, 180);

		for (var i=0; i<temp_pos.length; i++)
		{
			var new_pos = matVecMult(translate_mat(0, 0.225, 0.01), temp_pos[i]);

			new_pos = matVecMult(rotate_mat(0, 0, j+30), new_pos);

			positions.push(new_pos);
		}
	} 
	// END next inward boom

	
	// START inner boom
	temp_pos = makePositionsCylinder(0.09, 0, 5);

	for (var i=0; i<temp_pos.length; i++)
	{
		var new_pos = matVecMult(rotate_mat(90, 0, 0), temp_pos[i]);

		new_pos = matVecMult(translate_mat(0, 0, 0.02), new_pos);

		positions.push(new_pos);
	}

	for (var j=0; j<360; j+=30)
	{
		var random_radius = Math.random();
		if (random_radius < 0.4)
			random_radius = 0.4;
		var random_height = Math.random();
		if (random_height < 0.4)
			random_height = 0.4;

		temp_pos = makePositionsCone(0.15*random_radius, 0.125*random_height, 180);

		for (var i=0; i<temp_pos.length; i++)
		{
			var new_pos = matVecMult(translate_mat(0, 0.12, 0.02), temp_pos[i]);

			new_pos = matVecMult(rotate_mat(0, 0, j), new_pos);

			positions.push(new_pos);
		}
	} 
	// END inner boom


	for (var i=0; i<positions.length; i++)
	{
		if (i % 3 == 0)
		{
			var temp_normal = calcNormal(positions[i+1], positions[i+2], positions[i]);

			temp_normal = scaVecMult(-1, temp_normal);

			normals.push(temp_normal);
			normals.push(temp_normal);
			normals.push(temp_normal);
		}
	}


	for (var i=0; i<positions.length/3/3; i++)
	{
		colors.push([1, 0.575, 0, 1.0]);
		colors.push([1, 0.575, 0, 1.0]);
		colors.push([1, 0.575, 0, 1.0]);
	}

	for (var i=0; i<positions.length/3/3; i++)
	{
		colors.push([1, 1, 0, 1.0]);
		colors.push([1, 1, 0, 1.0]);
		colors.push([1, 1, 0, 1.0]);
	}

	for (var i=0; i<positions.length/3/3; i++)
	{
		colors.push([1, 1, 1, 1.0]);
		colors.push([1, 1, 1, 1.0]);
		colors.push([1, 1, 1, 1.0]);
	}

	// Should be 3024
	//console.log("Spaceship Boom positions length = "+positions.length);

	var toReturn = 
	{
		positionsArr: positions
	   ,colorsArr: colors
	   ,normalsArr: normals
	};

	return toReturn;
}

function createSolarSystem(details)
{
	var positions = [];
	var colors = [];
	var normals = [];

	console.log("---- Making star");
	//var madeStar = makeStar(details.star, details.total_amount_longitudes, details.total_amount_latitudes);
	var madeStar = makeStar(details.getStar(), details.getTotalAmtLongitudes(), details.getTotalAmtLatitudes());

	for (var i=0; i<madeStar.positionsArr.length; i++)
	{
		positions.push(madeStar.positionsArr[i]);
		colors.push(madeStar.colorsArr[i]);
		normals.push(madeStar.normalsArr[i]);
	}

	//console.log("After star positions.length = "+positions.length);

	for (var i=0; i<details.getNumberPlanets(); i++)
	{
		console.log("---- Making planet");
		//var madePlanet = makePlanet_SolarSystemView(details.planets[i], details.total_amount_longitudes, details.total_amount_latitudes); //makePlanet_PlanetView(details.planets[i]); //
		var madePlanet = makePlanet_SolarSystemView(details.getPlanet(i), details.getTotalAmtLongitudes(), details.getTotalAmtLatitudes());

		for (var j=0; j<madePlanet.positionsArr.length; j++)
		{
			positions.push(madePlanet.positionsArr[j]);
			colors.push(madePlanet.colorsArr[j]);
			normals.push(madePlanet.normalsArr[j]);
		}

		details.getPlanet(i).setHeights(madePlanet.heightsArr);
		details.getPlanet(i).setIceHeights(madePlanet.iceHeightsArr);
		details.getPlanet(i).setHeightsAvg(madePlanet.theEntireAvgNum);
		details.getPlanet(i).setIceHeightsAvg(madePlanet.theEntireAvgIceNum);
		details.getPlanet(i).setFound(madePlanet.foundArr);
		details.getPlanet(i).setCoordsOfSpots(madePlanet.coordsSpotsArr);
		details.getPlanet(i).setFoundSpots(madePlanet.foundSpotsArr);
		details.getPlanet(i).setExaminedSpots(madePlanet.examinedSpotsArr);
	}

	var madeSpaceship = makeSpaceship();

	for (var i=0; i<madeSpaceship.positionsArr.length; i++)
	{
		positions.push(madeSpaceship.positionsArr[i]);
		colors.push(madeSpaceship.colorsArr[i]);
		normals.push(madeSpaceship.normalsArr[i]);
	}

	var madeSpaceshipBoom = makeSpaceshipBoom();

	for (var i=0; i<madeSpaceshipBoom.positionsArr.length; i++)
	{
		positions.push(madeSpaceshipBoom.positionsArr[i]);
		colors.push(madeSpaceshipBoom.colorsArr[i]);
		normals.push(madeSpaceshipBoom.normalsArr[i]);
	}

	// Push coords for mouse
	positions.push([0, 0, 1.3, 1]);
	positions.push([0, 0, 1.3, 1]);
	positions.push([0, 0, 1.3, 1]);
	
	// Push colors for mouse
	colors.push([0, 0, 0, 1]);
	colors.push([0, 0, 0, 1]);
	colors.push([0, 0, 0, 1]);

	// Push normals for mouse
	normals.push([0, 1, 0, 0]);
	normals.push([0, 1, 0, 0]);
	normals.push([0, 1, 0, 0]);

	var toReturn = 
	{
		positionsArr: positions
	   ,colorsArr: colors
	   ,normalsArr: normals
	}

	return toReturn;
}

function createLandOnPlanetView(details, planet_index)
{
	var positions = [];
	var colors = [];
	var normals = [];

	console.log("---- Making star");
	var madeStar = makeStar(details.getStar(), details.getTotalAmtLongitudes(), details.getTotalAmtLatitudes());

	for (var i=0; i<madeStar.positionsArr.length; i++)
	{
		positions.push(madeStar.positionsArr[i]);
		colors.push(madeStar.colorsArr[i]);
		normals.push(madeStar.normalsArr[i]);
	}

	console.log("---- Making planet");
	var madePlanet = makePlanet_PlanetView(details, details.getPlanet(planet_index));

	for (var j=0; j<madePlanet.positionsArr.length; j++)
	{
		positions.push(madePlanet.positionsArr[j]);
		colors.push(madePlanet.colorsArr[j]);
		normals.push(madePlanet.normalsArr[j]);
	}

	var madeSpaceship = makeSpaceship();

	for (var i=0; i<madeSpaceship.positionsArr.length; i++)
	{
		positions.push(madeSpaceship.positionsArr[i]);
		colors.push(madeSpaceship.colorsArr[i]);
		normals.push(madeSpaceship.normalsArr[i]);
	}

	// Push coords for mouse
	positions.push([0, 0, 1.3, 1]);
	positions.push([0, 0, 1.3, 1]);
	positions.push([0, 0, 1.3, 1]);
	
	// Push colors for mouse
	colors.push([0, 0, 0, 1]);
	colors.push([0, 0, 0, 1]);
	colors.push([0, 0, 0, 1]);

	// Push normals for mouse
	normals.push([0, 1, 0, 0]);
	normals.push([0, 1, 0, 0]);
	normals.push([0, 1, 0, 0]);

	var toReturn = 
	{
		positionsArr: positions
	   ,colorsArr: colors
	   ,colorsIndexesArr: madePlanet.colorsIndexesArr
	   ,normalsArr: normals
	}

	return toReturn;
}

function pointInViewV2(i, j, spaceshipX, spaceshipY, spaceshipZ, planetRadius, colorsIndexes, positions, ctmPlanet, positionsOffsetPlanet)
{
	var index = colorsIndexes[i][j][0]+2;
	if (i == 0 || i == colorsIndexes.length-1)
		index = colorsIndexes[i][j];

	//console.log("index = "+index+" + "+positionsOffsetPlanet+" = "+(index + positionsOffsetPlanet));

	//console.log(positions[index]);

	var position_adjusted = matVecMult(ctmPlanet, positions[index + positionsOffsetPlanet]);

	var locationX = position_adjusted[0];
	var locationY = position_adjusted[1];

	if (position_adjusted[2] > spaceshipZ-0.5-planetRadius)
	{
		if (1 > Math.pow(locationX-spaceshipX, 2)/Math.pow(planetRadius, 2) + Math.pow(locationY-spaceshipY, 2)/Math.pow(planetRadius, 2))
			return true;
	}

	return false;
}

function revealSphereV2(spaceshipX, spaceshipY, spaceshipZ, revealRadius, positionsColorsAndNormals
					   ,colorsIndexes, ctmPlanet, positionsAndColorsOffsetForPlanet, planetDetails)
{
	var foundSea = planetDetails.getSeaFoundColor();
	var foundIce = planetDetails.getIceFoundColor();
	var foundLand = planetDetails.getLandFoundColor();

	var foundSeaArr = new Float32Array([foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3]]);
	var foundIceArr = new Float32Array([foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3]]);

	for (var i=0; i<colorsIndexes.length; i++)
	{
		for (var j=0; j<colorsIndexes[i].length; j++)
		{
			if (!planetDetails.getFound()[i][j] && 
				pointInViewV2(i, j, spaceshipX, spaceshipY, spaceshipZ, revealRadius, colorsIndexes, positionsColorsAndNormals.positionsArr, ctmPlanet, positionsAndColorsOffsetForPlanet))
			{
				planetDetails.getFound()[i][j] = true;

				for (var k=0; k<4; k++)
				{
					var indexInColor = colorsIndexes[i][j][k];
					var only1Tri = false;

					if (i == 0 || i == colorsIndexes.length-1)
					{
						indexInColor = colorsIndexes[i][j];
						only1Tri = true;
					}

					indexInColor += positionsAndColorsOffsetForPlanet;

					if (compareColors(positionsColorsAndNormals.colorsArr[indexInColor], solar_system_details.getSeaNotFoundColor(), false))
					{ // Is notFoundSea, needs changing to foundSea
						planetDetails.incTotalIndexesFound(1/4);

						positionsColorsAndNormals.colorsArr = makeTriColor(positionsColorsAndNormals.colorsArr, foundSea[0], foundSea[1], foundSea[2], indexInColor);

						gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positionsColorsAndNormals.positionsArr.length)+(4 * 4 * (indexInColor)), foundSeaArr);
					}
					else if (compareColors(positionsColorsAndNormals.colorsArr[indexInColor], solar_system_details.getLandNotFoundColor(), true))
					{ // Is notFoundLand, needs changing to foundLand
						planetDetails.incTotalIndexesFound(1/4);

						var height = ((planetDetails.getHeights()[i][j]-planetDetails.getHeightsAvg()*1.15)/1.5);
						if (planetDetails.getHeights()[i][j] > planetDetails.getHeightsAvg()*1.3)// && (i > 29 && i < 148))
							height = ((planetDetails.getHeights()[i][j]-planetDetails.getHeightsAvg()*1.15)/1.2);
						if (planetDetails.getHeights()[i][j] > planetDetails.getHeightsAvg()*1.45)// && (i > 29 && i < 148))
							height = ((planetDetails.getHeights()[i][j]-planetDetails.getHeightsAvg()*1.15)/1.05);

						if (height > 1-foundLand[1])
							height = 1-foundLand[1];

						var foundLandArr = new Float32Array([foundLand[0], foundLand[1]+height, foundLand[2], foundLand[3], foundLand[0], foundLand[1]+height, foundLand[2], foundLand[3], foundLand[0], foundLand[1]+height, foundLand[2], foundLand[3]]);

						positionsColorsAndNormals.colorsArr = makeTriColor(positionsColorsAndNormals.colorsArr, foundLand[0], foundLand[1]+height, foundLand[2], indexInColor);

						gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positionsColorsAndNormals.positionsArr.length)+(4 * 4 * (indexInColor)), foundLandArr);
					}
					else if (compareColors(positionsColorsAndNormals.colorsArr[indexInColor], solar_system_details.getIceNotFoundColor(), false))
					{ // Is notFoundLand, needs changing to foundLand
						if (!only1Tri)
							planetDetails.incTotalIndexesFound(1/4);
						else
							planetDetails.incTotalIndexesFound(1);

						positionsColorsAndNormals.colorsArr = makeTriColor(positionsColorsAndNormals.colorsArr, foundIce[0], foundIce[1], foundIce[2], indexInColor);

						gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positionsColorsAndNormals.positionsArr.length)+(4 * 4 * (indexInColor)), foundIceArr);
					}
				}

				for (var k=0; k<planetDetails.getCoordsOfSpots().length; k++)
				{
					if (planetDetails.getCoordsOfSpots()[k][0] == i && 
						planetDetails.getCoordsOfSpots()[k][1] == j)
					{
						if (!planetDetails.getFoundSpotsIndex(k))
						{
							planetDetails.incTotalSpotsFound();

							planetDetails.setFoundSpotsIndex(k, true);
						}
					}
				}
			}
		}
	}

	return positionsColorsAndNormals;
}