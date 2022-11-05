'use strict';

var colorsIndexes = [];
var heights = [];
var iceHeights = [];
var spots = [];
var spotsMaxMins = [];
var spotsShapes = [];

var foundLand = [0.125, 0.5976, 0.2422, 1];
var foundSea = [0, 0.3672, 0.7187, 1];
var foundSpot = [1, 0, 0, 1];
var foundIce = [1, 1, 1, 1];
var foundSpotClicked = [1, 0.588, 0, 1];
var highlightedSpot = [1, 0, 1, 1];

var notFoundLand = [1, 0.9490, 0.7490, 1];
var notFoundSea = [1, 0.9922, 0.9569, 1];
var notfoundSpot = [1, 0.9490, 0.7490, 1];
var notfoundIce = [1, 0.9725, 0.8667, 1];

var foundSeaArr = new Float32Array([foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3]]);
                                   //,foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3]
                                   //,foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3]
                                   //,foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3], foundSea[0], foundSea[1], foundSea[2], foundSea[3]]);
var foundLandArr = new Float32Array([foundLand[0], foundLand[1], foundLand[2], foundLand[3], foundLand[0], foundLand[1], foundLand[2], foundLand[3], foundLand[0], foundLand[1], foundLand[2], foundLand[3]]);
                                    //,foundLand[0], foundLand[1], foundLand[2], foundLand[3], foundLand[0], foundLand[1], foundLand[2], foundLand[3], foundLand[0], foundLand[1], foundLand[2], foundLand[3]
                                    //,foundLand[0], foundLand[1], foundLand[2], foundLand[3], foundLand[0], foundLand[1], foundLand[2], foundLand[3], foundLand[0], foundLand[1], foundLand[2], foundLand[3]
                                    //,foundLand[0], foundLand[1], foundLand[2], foundLand[3], foundLand[0], foundLand[1], foundLand[2], foundLand[3], foundLand[0], foundLand[1], foundLand[2], foundLand[3]]);
var foundIceArr = new Float32Array([foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3]]);
                                   //,foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3]
                                   //,foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3]
                                   //,foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3], foundIce[0], foundIce[1], foundIce[2], foundIce[3]]);
var foundSpotArr = new Float32Array([foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3], foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3], foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3]]);
                                    //,foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3], foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3], foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3]
                                    //,foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3], foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3], foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3]
                                    //,foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3], foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3], foundSpot[0], foundSpot[1], foundSpot[2], foundSpot[3]]);

var foundSpotClickedArr = new Float32Array([foundSpotClicked[0], foundSpotClicked[1], foundSpotClicked[2], foundSpotClicked[3], foundSpotClicked[0], foundSpotClicked[1], foundSpotClicked[2], foundSpotClicked[3], foundSpotClicked[0], foundSpotClicked[1], foundSpotClicked[2], foundSpotClicked[3]]);

var highlightedSpotArr = new Float32Array([highlightedSpot[0], highlightedSpot[1], highlightedSpot[2], highlightedSpot[3], highlightedSpot[0], highlightedSpot[1], highlightedSpot[2], highlightedSpot[3], highlightedSpot[0], highlightedSpot[1], highlightedSpot[2], highlightedSpot[3]]);

var totalIndexesFound = 0;

function sumColorsIndex(colors, index)
{
    return colors[index][0]+colors[index][1]+colors[index][2];
}

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

    }

    return colors;
}

function avgCornersSquare(arr, i, j, xLength, yLength)
{
    var avg = 0;

    if (i == 74.5)
    {
        //console.log("i, j = "+i+", "+j);
        //console.log("Accessing: "+(Math.floor(i-xLength/2))+", "+(Math.floor(j-yLength/2)));
        //console.log("Accessing: "+(Math.floor(i-xLength/2))+", "+(Math.floor(j+yLength/2)));
        //console.log("Accessing: "+(Math.floor(i+xLength/2))+", "+(Math.floor(j-yLength/2)));
        //console.log("Accessing: "+(Math.floor(i+xLength/2))+", "+(Math.floor(j+yLength/2)));
    }
    avg += arr[Math.floor(i-xLength/2)][Math.floor(j-yLength/2)];
    avg += arr[Math.floor(i-xLength/2)][Math.floor(j+yLength/2)];
    avg += arr[Math.floor(i+xLength/2)][Math.floor(j-yLength/2)];
    avg += arr[Math.floor(i+xLength/2)][Math.floor(j+yLength/2)];

    if (avg < 0)
        console.log("AVG SQUARE IS BAD FUCK");

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
            avg = avg*1.25;
        }
        
        if (Math.floor(j-yLength/2) > -1)
            avg += arr[Math.floor(i)][Math.floor(j-yLength/2)];
        else
        {
            //console.log(Math.floor(j+yLength/2)+" was not > -1 so instead trying "+(numLongs-Math.floor(j-yLength/2)));
            //avg += heights[Math.floor(i)][numLongs-Math.floor(j-yLength/2)];
            avg = avg*1.25;
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
        console.log("AVG DIAMOND IS BAD FUCK");
    
    return avg/(4-outOfBoundsCnt);
}

function makeSpot(colors, i, j, whichSpot)
{
    var maxY = Math.ceil(Math.abs(i-75)/35)+1;
    //console.log("i = "+i+" and maxY = "+maxY);

    var coords = [];
    var coordsMaxMins = [];
    coordsMaxMins.push([i-1, j-1]);        // Top right
    coordsMaxMins.push([i+1, j-1]);        // Bottom right
    coordsMaxMins.push([i+1, j+maxY-1]);   // Bottom left
    coordsMaxMins.push([i-1, j+maxY-1]);   // Top Left

    for (var m=i-1; m<i+2; m++)
    {
        for (var n=j-1; n<j+maxY; n++)
        {
            makeTriColor(colors, notfoundSpot[0], notfoundSpot[1], notfoundSpot[2], colorsIndexes[m][n][0]);
            makeTriColor(colors, notfoundSpot[0], notfoundSpot[1], notfoundSpot[2], colorsIndexes[m][n][1]);
            makeTriColor(colors, notfoundSpot[0], notfoundSpot[1], notfoundSpot[2], colorsIndexes[m][n][2]);
            makeTriColor(colors, notfoundSpot[0], notfoundSpot[1], notfoundSpot[2], colorsIndexes[m][n][3]);

            coords.push([m, n]);
            //spots.push([whichSpot, m, n]);
        }
    }

    spots.push(coords);
    spotsMaxMins.push(coordsMaxMins);
}

function quickUpdateColor(offset, color1, color2, color3)
{
    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (offset)), new Float32Array([color1, color2, color3, 1, color1, color2, color3, 1, color1, color2, color3, 1]));
}

function pointInView(i, j, origX, origY)
{
    if (1 > Math.pow(j-origX, 2)/Math.pow(60, 2) + Math.pow(i-origY, 2)/Math.pow(60, 2))
    {//Standard cirle which looks best when i is at the equator
        return true;
    }

    if ( (origX < 60 && 1 > Math.pow(j-(origX+359), 2)/Math.pow(60, 2) + Math.pow(i-(origY), 2)/Math.pow(60, 2)) 
      || (origX > 299 && 1 > Math.pow(j-(origX-359), 2)/Math.pow(60, 2) + Math.pow(i-(origY), 2)/Math.pow(60, 2)) )
    {// Also consider other ends of array if need to for standard circle
        return true;
    }

    if (origY != 89 && origY != 60 && origY != 119)
    {
        if ( origY < 88 && origY > 60 )
          //|| (origY > 89 && i > origY+30) )
        {
            var amount;
            if (origY < 88 && origY > 82) // 87 to 83
            {
                // Below is good for origY = 84
                amount = Math.pow(((i-25)*300000), 1/4)-1;
            }
            else if (origY < 83 && origY > 77) // 82 to 78
            {
                // Below is good for origY = 80
                amount = Math.pow(((i-20)*550000), 1/4)-(3);
                if (i < origY-15 && i > origY-45)
                    amount-=((i-(origY-40))/4)+3;
            }
            else if (origY < 78 && origY > 72) // 77 to 73
            {
                // Below is good for origY = 75
                amount = Math.pow(((i-16)*550000), 1/4)-(3);
                if (i < origY+10 && i > origY-35)
                    amount-=((i-(origY-35))/2.5);
            }
            else if (origY < 73 && origY > 67) // 72 to 68
            {
                // Below is good for origY = 70
                amount = Math.pow(((i)*1200000000), 1/6);
                if (i > origY-60 && i < origY-50)
                    amount-=((i-10)*-3)+28;
                if (i < origY && i > origY-16)
                    amount-=((i-(origY-35))/2.5)-8;
            }
            else if (origY < 68 && origY > 63) // 67 to 64
            {
                // Below is good for origY = 65
                amount = Math.pow(((i+25)*1200000000), 1/6);
                if (i > origY-60 && i < origY-52)
                    amount-=((i-10)*-5)+13;
                if (i < origY+((-1)*(origY-73)) && i > origY-16)
                    amount-=((i-(origY-35))/2.5)-8;
            }
            else if (origY > 60) // 63 to 61
            {
                // Below is good for origY = 61
                amount = Math.pow(((i+25)*1200000000), 1/6);
                if (i > origY-60 && i < origY-52)
                    amount-=((i-10)*-5)-14;
                if (i < origY+((-1)*(origY-73)) && i > origY-16)
                    amount-=((i-(origY-35))/2.5)-8;
            }

            if (origY < 71)
            {
                if (i < origY+((-1)*(origY-73)) && i > origY-16 && j > (origX-amount) && j < (origX+amount))
                    return true;
            }
            

            if (i < origY-15 && i > origY-59 && j > (origX-amount) && j < (origX+amount))
                return true;
        }
    }

    if (origY == 60 || origY == 119)
    {
        if ( (origY == 60 && i < origY+30 && j > (origX-(60+(i/-2+38))) && j < (origX+(60+(i/-2+38))))
          || (origY == 119 && i > origY-30 && j > (origX-(60+(i/2-52))) && j < (origX+(60+(i/2-52)))) )
        {// Do special circle when at top or bottom
            return true;
        }

        if ( (origX < 60 && origY == 60 && i < origY+30 && j > (359-(60-origX))-(i/-2+38))
          || (origX < 60 && origY == 119 && i > origY-30 && j > (359-(60-origX))+(i/-2+52)) )
        {// Also consider other ends of array if need to for special circle where origX is close to 0
            return true;
        }

        if ( (origX > 299 && origY == 60 && i < origY+30 && j < (0+(60-(359-origX)))+(i/-2+38))
          || (origX > 299 && origY == 119 && i > origY-30 && j < (0+(60-(359-origX)))-(i/-2+52)) )
        {// Also consider other ends of array if need to for special circle where origX is close to 359
            return true;
        }
    } 

    return false;
}

function revealSphere(origX, origY, which)
{
    for (var i=0; i<colorsIndexes.length; i++)
    {
        for (var j=0; j<colorsIndexes[i].length; j++)
        {
            if (pointInView(i, j, origX, origY))
            {
                var indexInColor;
                var only1Tri = false;
                try
                {
                    indexInColor = colors[colorsIndexes[i][j][0]][0];
                    // if the above works then assign the below value
                    indexInColor = colorsIndexes[i][j][0];
                }
                catch (e)
                {
                    //console.log("Catching the error");
                    indexInColor = colorsIndexes[i][j];
                    only1Tri = true;
                }

                for (var k=0; k<4; k++)
                {
                    if (!only1Tri)
                        indexInColor = colorsIndexes[i][j][k];
                    else
                        indexInColor = colorsIndexes[i][j];

                    if (colors[indexInColor][0] == notFoundSea[0] && colors[indexInColor][1] == notFoundSea[1] && colors[indexInColor][2] == notFoundSea[2])
                    { // Is notFoundSea, needs changing to foundSea
                        totalIndexesFound += (1/4);

                        makeTriColor(colors, foundSea[0], foundSea[1], foundSea[2], indexInColor);
                        if (which != "init")
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (indexInColor)), foundSeaArr);

                        /*makeTriColor(colors, foundSea[0], foundSea[1], foundSea[2], colorsIndexes[i][j][0]);
                        makeTriColor(colors, foundSea[0], foundSea[1], foundSea[2], colorsIndexes[i][j][1]);
                        makeTriColor(colors, foundSea[0], foundSea[1], foundSea[2], colorsIndexes[i][j][2]);
                        makeTriColor(colors, foundSea[0], foundSea[1], foundSea[2], colorsIndexes[i][j][3]);

                        if (which != "init")
                        {
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][0])), foundSeaArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][1])), foundSeaArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][2])), foundSeaArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][3])), foundSeaArr);
                        }*/
                    }
                    else if (colors[indexInColor][0] == notFoundLand[0] && colors[indexInColor][1] == notFoundLand[1] && colors[indexInColor][2] == notFoundLand[2])
                    { // Is notFoundLand, needs changing to foundLand
                        totalIndexesFound += (1/4);

                        makeTriColor(colors, foundLand[0], foundLand[1], foundLand[2], indexInColor);
                        if (which != "init")
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (indexInColor)), foundLandArr);

                        /*makeTriColor(colors, foundLand[0], foundLand[1], foundLand[2], colorsIndexes[i][j][0]);
                        makeTriColor(colors, foundLand[0], foundLand[1], foundLand[2], colorsIndexes[i][j][1]);
                        makeTriColor(colors, foundLand[0], foundLand[1], foundLand[2], colorsIndexes[i][j][2]);
                        makeTriColor(colors, foundLand[0], foundLand[1], foundLand[2], colorsIndexes[i][j][3]);

                        if (which != "init")
                        {
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][0])), foundLandArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][1])), foundLandArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][2])), foundLandArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][3])), foundLandArr);
                        }*/
                    }
                    else if (colors[indexInColor][0] == notfoundIce[0] && colors[indexInColor][1] == notfoundIce[1] && colors[indexInColor][2] == notfoundIce[2])
                    { // Is notFoundLand, needs changing to foundLand
                        totalIndexesFound += (1/4);

                        makeTriColor(colors, foundIce[0], foundIce[1], foundIce[2], indexInColor);
                        if (which != "init")
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (indexInColor)), foundIceArr);

                        /*makeTriColor(colors, foundIce[0], foundIce[1], foundIce[2], indexInColor);
                        if (!only1Tri)
                        {
                            makeTriColor(colors, foundIce[0], foundIce[1], foundIce[2], colorsIndexes[i][j][1]);
                            makeTriColor(colors, foundIce[0], foundIce[1], foundIce[2], colorsIndexes[i][j][2]);
                            makeTriColor(colors, foundIce[0], foundIce[1], foundIce[2], colorsIndexes[i][j][3]);
                        }

                        if (which != "init")
                        {
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (indexInColor)), foundIceArr);
                            if (!only1Tri)
                            {
                                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][1])), foundIceArr);
                                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][2])), foundIceArr);
                                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[i][j][3])), foundIceArr);
                            }
                        }*/
                    }
                }

                var spotToReveal = -1;

                for (var k=0; k<spots.length; k++)
                {
                    for (var l=0; l<spots[k].length; l++)
                    {
                        if (spots[k][l][0] == i && spots[k][l][1] == j)
                        {
                            spotToReveal = k;
                        }
                    }
                }

                if (spotToReveal > -1 && !foundSpotBools[spotToReveal])
                {
                    foundSpotBools[spotToReveal] = true;

                    for (var l=0; l<spots[spotToReveal].length; l++)
                    {
                        totalIndexesFound++;
                        //console.log("Revealing spot "+spotToReveal+" w/ coords = "+spots[spotToReveal][l][0]+", "+spots[spotToReveal][l][0]);
                        makeTriColor(colors, foundSpot[0], foundSpot[1], foundSpot[2], colorsIndexes[spots[spotToReveal][l][0]][spots[spotToReveal][l][1]][0]);
                        makeTriColor(colors, foundSpot[0], foundSpot[1], foundSpot[2], colorsIndexes[spots[spotToReveal][l][0]][spots[spotToReveal][l][1]][1]);
                        makeTriColor(colors, foundSpot[0], foundSpot[1], foundSpot[2], colorsIndexes[spots[spotToReveal][l][0]][spots[spotToReveal][l][1]][2]);
                        makeTriColor(colors, foundSpot[0], foundSpot[1], foundSpot[2], colorsIndexes[spots[spotToReveal][l][0]][spots[spotToReveal][l][1]][3]);

                        if (which != "init")
                        {
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[spotToReveal][l][0]][spots[spotToReveal][l][1]][0])), foundSpotArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[spotToReveal][l][0]][spots[spotToReveal][l][1]][1])), foundSpotArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[spotToReveal][l][0]][spots[spotToReveal][l][1]][2])), foundSpotArr);
                            gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[spotToReveal][l][0]][spots[spotToReveal][l][1]][3])), foundSpotArr);
                        }
                    }
                }
            }
        }
    }

    //console.log("Revealed "+total);
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

    return theEntireAvg;
}

function makePositionsAndColors(radius)
{
	var numLongs = 360/sphereDegsPerLong;
    var numLats = (180/sphereDegsPerLat)-2;
    var numTrisIn1x1Deg = 4;

    /* ******************************************************************************************
     * START Initialize heights of each 1x1 square
     *       Used for telling whether something is land or sea
     * ******************************************************************************************/
    for (var i=0; i<numLats; i++)
    {
        var heightsRowArr = [];
        var iceHeightsRowArr = [];

        for (var j=0; j<numLongs; j++)
        {
            heightsRowArr.push(-1);
            iceHeightsRowArr.push(-1);
        }

        heights.push(heightsRowArr);
        iceHeights.push(iceHeightsRowArr);
    }

    console.log("Heights Array");
    console.log("X length = "+heights.length);
    console.log("Y length = "+heights[0].length);

    heights[0][0] = 0;
    heights[numLats-1][0] = 0;
    heights[0][numLongs-1] = 0;
    heights[numLats-1][numLongs-1] = 0;

    for (var j=0; j<numLongs; j++)
    {
        iceHeights[0][j] = 0;
        iceHeights[numLats-1][j] = 0;
    }

    for (var i=0; i<numLats; i++)
    {
        if (i < 30)
        {
            //iceHeights[i][0] = i/60;
            //iceHeights[i][numLongs-1] = i/60;
        }
        else if (i > 147)
        {
            //iceHeights[i][0] = (numLats-1-i)/60;
            //iceHeights[i][numLongs-1] = (numLats-1-i)/60;
        }
        else
        {
            iceHeights[i][0] = 5;
            iceHeights[i][numLongs-1] = 5;
        }
    }

    var xLength = numLats-1;
    var yLength = numLongs-1;
    var cur_range = 1;

    var theEntireAvg = initHeightsArray(heights, xLength, yLength, cur_range, numLats, numLongs);
    var theEntireAvgIce = initHeightsArray(iceHeights, xLength, yLength, cur_range, numLats, numLongs);

    theEntireAvg = theEntireAvg/(numLats*numLongs);
    theEntireAvgIce = theEntireAvgIce/(numLats*numLongs);
    /* ******************************************************************************************
     * END Initialize heights of each 1x1 square
     *     Used for telling whether something is land or sea
     * ******************************************************************************************/


    var numLevels = 180/sphereDegsPerLat;

	/* ******************************************************************************************
     * START Makes the top part that is basically a cone
     * ******************************************************************************************/
    for (var j=0; j<1; j++)
	{
		var degsPerIter = sphereDegsPerLong;
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

			positions.push([0, radius, 0, 1.0]);
			positions.push([firstLvlRadius*Math.cos(radians2), radius*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians2), 1.0]);
			positions.push([firstLvlRadius*Math.cos(radians1), radius*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians1), 1.0]);
		}
	}
    /* ******************************************************************************************
     * END Makes the top part that is basically a cone
     * ******************************************************************************************/


	/* ******************************************************************************************
     * START Makes each ring of rectangles
     * ******************************************************************************************/
	for (var i=90-sphereDegsPerLat; i>(-90+sphereDegsPerLat); i-=sphereDegsPerLat)
	{
		var angle1 = i;
		var angle2 = i-sphereDegsPerLat;
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

		for (var j=0; j<360; j+=sphereDegsPerLong)
		{
			var angleA = j;
	        var angleB = j+sphereDegsPerLong;
	        if (angleB > 360) angleB = 360;
	        //console.log("AngleA: "+angleA);
	        //console.log("AngleB: "+angleB);
	        var radiansA = angleA * (Math.PI/180);
            var radiansC = (angleA+((angleB-angleA)/2)) * (Math.PI/180);
	        var radiansB = angleB * (Math.PI/180);
            //Left side square: top left, bottom left, middle
            positions.push([top_radius*Math.cos(radiansB), top_y, top_radius*Math.sin(radiansB), 1.0]);
            positions.push([bottom_radius*Math.cos(radiansB), bottom_y, bottom_radius*Math.sin(radiansB), 1.0]);
            positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
            //Top side square: top right, top left, middle
            positions.push([top_radius*Math.cos(radiansA), top_y, top_radius*Math.sin(radiansA), 1.0]);
            positions.push([top_radius*Math.cos(radiansB), top_y, top_radius*Math.sin(radiansB), 1.0]);
            positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
            //Right side square: top right, middle, bottom right
            positions.push([top_radius*Math.cos(radiansA), top_y, top_radius*Math.sin(radiansA), 1.0]);
            positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
            positions.push([bottom_radius*Math.cos(radiansA), bottom_y, bottom_radius*Math.sin(radiansA), 1.0]);
            //Bottom side square: bottom right, middle, bottom left
            positions.push([bottom_radius*Math.cos(radiansA), bottom_y, bottom_radius*Math.sin(radiansA), 1.0]);
            positions.push([mid_radius*Math.cos(radiansC), mid_y, mid_radius*Math.sin(radiansC), 1.0]);
            positions.push([bottom_radius*Math.cos(radiansB), bottom_y, bottom_radius*Math.sin(radiansB), 1.0]);
		}
	}
    /* ******************************************************************************************
     * END Makes each ring of rectangles
     * ******************************************************************************************/


    /* ******************************************************************************************
     * START Makes the bottom part that is basically a cone
     * ******************************************************************************************/
    for (var j=0; j<1; j++)
    {
        var degsPerIter = sphereDegsPerLong;
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
        }
    }
    /* ******************************************************************************************
     * END Makes the bottom part that is basically a cone
     * ******************************************************************************************/


    /* ******************************************************************************************
     * START Colors top 1 deg of triangles ice 
     * ******************************************************************************************/
    var rowArr = [];

    for (var i=0; i<(360/sphereDegsPerLong); i++)
    {
        colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);
        colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);
        colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);

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
                if (iceHeights[i][j] < theEntireAvgIce*0.5 && (i < 50 || i > 127))
                {
                    colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);
                    colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);
                    colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);
                }
                else if (heights[i][j] > theEntireAvg*1.15)
                {
                    colors.push([notFoundLand[0], notFoundLand[1], notFoundLand[2], notFoundLand[3]]);
                    colors.push([notFoundLand[0], notFoundLand[1], notFoundLand[2], notFoundLand[3]]);
                    colors.push([notFoundLand[0], notFoundLand[1], notFoundLand[2], notFoundLand[3]]);

                    if (k == 0)
                        listGreenCoords.push([i+1, j]);
                }
                else
                {
                    colors.push([notFoundSea[0], notFoundSea[1], notFoundSea[2], notFoundSea[3]]);
                    colors.push([notFoundSea[0], notFoundSea[1], notFoundSea[2], notFoundSea[3]]);
                    colors.push([notFoundSea[0], notFoundSea[1], notFoundSea[2], notFoundSea[3]]);
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

    for (var i=0; i<(360/sphereDegsPerLong); i++)
    {
        colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);
        colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);
        colors.push([notfoundIce[0], notfoundIce[1], notfoundIce[2], notfoundIce[3]]);

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
    console.log("colorsIndexes Array");
    console.log("X length = "+colorsIndexes.length);
    console.log("Y length = "+colorsIndexes[0].length);
    console.log("Z length = "+colorsIndexes[1][0].length);


    /* ******************************************************************************************
     * START Initialize heights of each 1x1 square
     *       Used for telling whether something is land or sea
     * ******************************************************************************************/
    /*console.log("Heights Array");
    console.log("X length = "+heights.length);
    console.log("Y length = "+heights[0].length);

    heights[0][0] = 0;
    heights[numLats-1][0] = 0;
    heights[0][numLongs-1] = 0;
    heights[numLats-1][numLongs-1] = 0;

    for (var j=0; j<numLongs; j++)
    {
        iceHeights[0][j] = 0;
        iceHeights[numLats-1][j] = 0;
    }

    for (var i=0; i<numLats; i++)
    {
        if (i < 30)
        {
            //iceHeights[i][0] = i/60;
            //iceHeights[i][numLongs-1] = i/60;
        }
        else if (i > 147)
        {
            //iceHeights[i][0] = (numLats-1-i)/60;
            //iceHeights[i][numLongs-1] = (numLats-1-i)/60;
        }
        else
        {
            iceHeights[i][0] = 5;
            iceHeights[i][numLongs-1] = 5;
        }
    }

    var xLength = numLats-1;
    var yLength = numLongs-1;
    var cur_range = 1;

    var theEntireAvg = initHeightsArray(heights, xLength, yLength, cur_range, numLats, numLongs);
    var theEntireAvgIce = initHeightsArray(iceHeights, xLength, yLength, cur_range, numLats, numLongs);

    theEntireAvg = theEntireAvg/(numLats*numLongs);
    theEntireAvgIce = theEntireAvgIce/(numLats*numLongs);*/
    /* ******************************************************************************************
     * END Initialize heights of each 1x1 square
     *     Used for telling whether something is land or sea
     * ******************************************************************************************/


    /*var listGreenCoords = [];

    // Makes square green if height is above a certain value
    for (var i=0; i<numLats; i++)
    {
        for (var j=0; j<numLongs; j++)
        {
            if (iceHeights[i][j] < theEntireAvgIce*0.5 && (i < 50 || i > 127))
            {
                makeTriColor(colors, notfoundIce[0], notfoundIce[1], notfoundIce[2], colorsIndexes[i+1][j][0]);
                makeTriColor(colors, notfoundIce[0], notfoundIce[1], notfoundIce[2], colorsIndexes[i+1][j][1]);
                makeTriColor(colors, notfoundIce[0], notfoundIce[1], notfoundIce[2], colorsIndexes[i+1][j][2]);
                makeTriColor(colors, notfoundIce[0], notfoundIce[1], notfoundIce[2], colorsIndexes[i+1][j][3]);
            }

            if (heights[i][j] > theEntireAvg*1.15 && (colors[colorsIndexes[i+1][j][0]][0] != notfoundIce[0] || colors[colorsIndexes[i+1][j][0]][1] != notfoundIce[1] || colors[colorsIndexes[i+1][j][0]][2] != notfoundIce[2]))
            {
                makeTriColor(colors, notFoundLand[0], notFoundLand[1], notFoundLand[2], colorsIndexes[i+1][j][0]);
                makeTriColor(colors, notFoundLand[0], notFoundLand[1], notFoundLand[2], colorsIndexes[i+1][j][1]);
                makeTriColor(colors, notFoundLand[0], notFoundLand[1], notFoundLand[2], colorsIndexes[i+1][j][2]);
                makeTriColor(colors, notFoundLand[0], notFoundLand[1], notFoundLand[2], colorsIndexes[i+1][j][3]);

                listGreenCoords.push([i+1, j]);
            }
        }
    }*/

    for (var i=0; i<6; i++)
    {
        var ranIndex = Math.floor(Math.random()*listGreenCoords.length);

        var indexI = listGreenCoords[ranIndex][0];
        var indexJ = listGreenCoords[ranIndex][1];

        makeSpot(colors, indexI, indexJ, i);
    }

    var coastTiles = [];

    for (var i=1; i<numLats-1; i++)
    {
        for (var j=1; j<numLongs-1; j++)
        {
            if ((colors[colorsIndexes[i+1][j][0]][0] == notFoundSea[0] && colors[colorsIndexes[i+1][j][0]][1] == notFoundSea[1] && colors[colorsIndexes[i+1][j][0]][2] == notFoundSea[2]) &&
               //((colors[colorsIndexes[i+1][j-1][0]][0] == notFoundSea[0] && colors[colorsIndexes[i+1][j-1][0]][1] == notFoundSea[1] && colors[colorsIndexes[i+1][j-1][0]][2] == notFoundSea[2]) ||
               // (colors[colorsIndexes[i+1][j+1][0]][0] == notFoundSea[0] && colors[colorsIndexes[i+1][j+1][0]][1] == notFoundSea[1] && colors[colorsIndexes[i+1][j+1][0]][2] == notFoundSea[2]) ||
               // (colors[colorsIndexes[i][j][0]][0] == notFoundSea[0] && colors[colorsIndexes[i][j][0]][1] == notFoundSea[1] && colors[colorsIndexes[i][j][0]][2] == notFoundSea[2]) ||
               // (colors[colorsIndexes[i+2][j][0]][0] == notFoundSea[0] && colors[colorsIndexes[i+2][j][0]][1] == notFoundSea[1] && colors[colorsIndexes[i+2][j][0]][2] == notFoundSea[2])) &&
               ((colors[colorsIndexes[i+1][j-1][0]][0] == notFoundLand[0] && colors[colorsIndexes[i+1][j-1][0]][1] == notFoundLand[1] && colors[colorsIndexes[i+1][j-1][0]][2] == notFoundLand[2]) ||
                (colors[colorsIndexes[i+1][j+1][0]][0] == notFoundLand[0] && colors[colorsIndexes[i+1][j+1][0]][1] == notFoundLand[1] && colors[colorsIndexes[i+1][j+1][0]][2] == notFoundLand[2]) ||
                (colors[colorsIndexes[i][j][0]][0] == notFoundLand[0] && colors[colorsIndexes[i][j][0]][1] == notFoundLand[1] && colors[colorsIndexes[i][j][0]][2] == notFoundLand[2]) ||
                (colors[colorsIndexes[i+2][j][0]][0] == notFoundLand[0] && colors[colorsIndexes[i+2][j][0]][1] == notFoundLand[1] && colors[colorsIndexes[i+2][j][0]][2] == notFoundLand[2])) )
            {
                coastTiles.push([i+1, j]);
                //makeTriColor(colors, 1, 0, 0, colorsIndexes[i+1][j][0]);
                //makeTriColor(colors, 1, 0, 0, colorsIndexes[i+1][j][1]);
                //makeTriColor(colors, 1, 0, 0, colorsIndexes[i+1][j][2]);
                //makeTriColor(colors, 1, 0, 0, colorsIndexes[i+1][j][3]);
            }
        }
    }

    makeSmooth(coastTiles, "sea");

    var coastTilesIce = [];

    for (var i=1; i<numLats-1; i++)
    {
        if (i < 50 || i > 127)
        {
            for (var j=1; j<numLongs-1; j++)
            {
                if (((colors[colorsIndexes[i+1][j][0]][0] == notFoundSea[0] && colors[colorsIndexes[i+1][j][0]][1] == notFoundSea[1] && colors[colorsIndexes[i+1][j][0]][2] == notFoundSea[2]) ||
                     (colors[colorsIndexes[i+1][j][0]][0] == notFoundLand[0] && colors[colorsIndexes[i+1][j][0]][1] == notFoundLand[1] && colors[colorsIndexes[i+1][j][0]][2] == notFoundLand[2])) &&
                   //((colors[colorsIndexes[i+1][j-1][0]][0] == notFoundSea[0] && colors[colorsIndexes[i+1][j-1][0]][1] == notFoundSea[1] && colors[colorsIndexes[i+1][j-1][0]][2] == notFoundSea[2]) ||
                   // (colors[colorsIndexes[i+1][j+1][0]][0] == notFoundSea[0] && colors[colorsIndexes[i+1][j+1][0]][1] == notFoundSea[1] && colors[colorsIndexes[i+1][j+1][0]][2] == notFoundSea[2]) ||
                   // (colors[colorsIndexes[i][j][0]][0] == notFoundSea[0] && colors[colorsIndexes[i][j][0]][1] == notFoundSea[1] && colors[colorsIndexes[i][j][0]][2] == notFoundSea[2]) ||
                   // (colors[colorsIndexes[i+2][j][0]][0] == notFoundSea[0] && colors[colorsIndexes[i+2][j][0]][1] == notFoundSea[1] && colors[colorsIndexes[i+2][j][0]][2] == notFoundSea[2])) &&
                   ((colors[colorsIndexes[i+1][j-1][0]][0] == notfoundIce[0] && colors[colorsIndexes[i+1][j-1][0]][1] == notfoundIce[1] && colors[colorsIndexes[i+1][j-1][0]][2] == notfoundIce[2]) ||
                    (colors[colorsIndexes[i+1][j+1][0]][0] == notfoundIce[0] && colors[colorsIndexes[i+1][j+1][0]][1] == notfoundIce[1] && colors[colorsIndexes[i+1][j+1][0]][2] == notfoundIce[2]) ||
                    (colors[colorsIndexes[i][j][0]][0] == notfoundIce[0] && colors[colorsIndexes[i][j][0]][1] == notfoundIce[1] && colors[colorsIndexes[i][j][0]][2] == notfoundIce[2]) ||
                    (colors[colorsIndexes[i+2][j][0]][0] == notfoundIce[0] && colors[colorsIndexes[i+2][j][0]][1] == notfoundIce[1] && colors[colorsIndexes[i+2][j][0]][2] == notfoundIce[2])) )
                {
                    coastTilesIce.push([i+1, j]);
                    //makeTriColor(colors, 1, 0, 0, colorsIndexes[i+1][j][0]);
                    //makeTriColor(colors, 1, 0, 0, colorsIndexes[i+1][j][1]);
                    //makeTriColor(colors, 1, 0, 0, colorsIndexes[i+1][j][2]);
                    //makeTriColor(colors, 1, 0, 0, colorsIndexes[i+1][j][3]);
                }
            }
        }
    }

    //makeSmooth(coastTilesIce, "ice", "land");
    //makeSmooth(coastTilesIce, "ice", "ice");

    // This one should be used
    revealSphere(88, 89, "init");
    
    // This one is for testing
    //revealSphere(88, 70, "init");
}

function makeSmooth(arr, which, checkWhich)
{
    var makeToThis = [notFoundLand[0], notFoundLand[1], notFoundLand[2]];//[1, 1, 0];//
    if (which == "ice")
        makeToThis = [notfoundIce[0], notfoundIce[1], notfoundIce[2]];

    var resetToThis = [notFoundSea[0], notFoundSea[1], notFoundSea[2]];
    if (which == "ice")
        resetToThis = [notfoundIce[0], notfoundIce[1], notfoundIce[2]];

    var checkThis = [notFoundLand[0], notFoundLand[1], notFoundLand[2]];
    if (checkWhich == "ice")
        checkThis = [notfoundIce[0], notfoundIce[1], notfoundIce[2]];


    for (var i=0; i<arr.length; i++)
    {
        var countNeighbors = 0;

        var row = arr[i][0];
        var col = arr[i][1];

        if (colors[colorsIndexes[row][col+1][0]][0] == checkThis[0] && colors[colorsIndexes[row][col+1][0]][1] == checkThis[1] && colors[colorsIndexes[row][col+1][0]][2] == checkThis[2])
        {
            countNeighbors++;
            makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][0]);
        }

        if (colors[colorsIndexes[row-1][col][0]][0] == checkThis[0] && colors[colorsIndexes[row-1][col][0]][1] == checkThis[1] && colors[colorsIndexes[row-1][col][0]][2] == checkThis[2])
        {
            countNeighbors++;
            makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][1]);
        }

        if (colors[colorsIndexes[row][col-1][0]][0] == checkThis[0] && colors[colorsIndexes[row][col-1][0]][1] == checkThis[1] && colors[colorsIndexes[row][col-1][0]][2] == checkThis[2])
        {
            countNeighbors++;
            makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][2]);
        }
        
        if (colors[colorsIndexes[row+1][col][0]][0] == checkThis[0] && colors[colorsIndexes[row+1][col][0]][1] == checkThis[1] && colors[colorsIndexes[row+1][col][0]][2] == checkThis[2])
        {
            countNeighbors++;
            makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][3]);
        }

        if (countNeighbors < 2 ||
           (countNeighbors == 2 &&
            (colors[colorsIndexes[row-1][col][0]][0] == checkThis[0] && colors[colorsIndexes[row-1][col][0]][1] == checkThis[1] && colors[colorsIndexes[row-1][col][0]][2] == checkThis[2]) && 
            (colors[colorsIndexes[row+1][col][0]][0] == checkThis[0] && colors[colorsIndexes[row+1][col][0]][1] == checkThis[1] && colors[colorsIndexes[row+1][col][0]][2] == checkThis[2]) ) ||
           (countNeighbors == 2 &&
            (colors[colorsIndexes[row][col+1][0]][0] == checkThis[0] && colors[colorsIndexes[row][col+1][0]][1] == checkThis[1] && colors[colorsIndexes[row][col+1][0]][2] == checkThis[2]) &&
            (colors[colorsIndexes[row][col-1][0]][0] == checkThis[0] && colors[colorsIndexes[row][col-1][0]][1] == checkThis[1] && colors[colorsIndexes[row][col-1][0]][2] == checkThis[2]) ) )
        {
            makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][0]);
            makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][1]);
            makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][2]);
            makeTriColor(colors, resetToThis[0], resetToThis[1], resetToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][3]);
        }

        if (countNeighbors > 2)
        {
            makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][0]);
            makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][1]);
            makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][2]);
            makeTriColor(colors, makeToThis[0], makeToThis[1], makeToThis[2], colorsIndexes[arr[i][0]][arr[i][1]][3]);
        }
    }
}