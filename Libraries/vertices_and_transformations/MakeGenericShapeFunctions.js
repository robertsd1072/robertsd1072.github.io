'use strict';

function makePositionsCone(radius, height, degsPerSide)
{
    var positions = [];

    // Make the bottom
    for (var i=0; i<360; i+=degsPerSide)
    {
        var angle1 = i;
        var angle2 = i+degsPerSide;
        if (angle2 > 360) angle2 = 360;
        //console.log("Angle1: "+angle1);
        //console.log("Angle2: "+angle2);
        var radians1 = angle1 * (Math.PI/180);
        var radians2 = angle2 * (Math.PI/180);
        positions.push([radius*Math.cos(radians1), -height, radius*Math.sin(radians1), 1.0]);
        positions.push([radius*Math.cos(radians2), -height, radius*Math.sin(radians2), 1.0]);
        positions.push([0, -height, 0, 1.0]);
        //console.log("Pushing bottom i = "+i);
        //console.log((radius*Math.cos(radians1)+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(radius*Math.sin(radians1)+bottomCenterZCoord)+", "+1.0);
        //console.log((radius*Math.cos(radians2)+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(radius*Math.sin(radians2)+bottomCenterZCoord)+", "+1.0);
        //console.log((0+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(0+bottomCenterZCoord)+", "+1.0);
    }

    // Make the vertical sides
    for (var i=0; i<360; i+=degsPerSide)
    {
        var angle1 = i;
        var angle2 = i+degsPerSide;
        if (angle2 > 360) angle2 = 360;
        //console.log("Angle1: "+angle1);
        //console.log("Angle2: "+angle2);
        var radians1 = angle1 * (Math.PI/180);
        var radians2 = angle2 * (Math.PI/180);
        positions.push([0, height, 0, 1.0]);
        positions.push([radius*Math.cos(radians2), -height, radius*Math.sin(radians2), 1.0]);
        positions.push([radius*Math.cos(radians1), -height, radius*Math.sin(radians1), 1.0]);
        //console.log("Pushing side i = "+i);
        //console.log((0+topXCoord)+", "+(0+topYCoord)+", "+(0+topZCoord)+", "+1.0);
        //console.log((radius*Math.cos(radians2)+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(radius*Math.sin(radians2)+bottomCenterZCoord)+", "+1.0);
        //console.log((radius*Math.cos(radians1)+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(radius*Math.sin(radians1)+bottomCenterZCoord)+", "+1.0);
    }

    return positions;
}

function makePositionsCylinder(radius, height, degsPerSide)
{
    var positions = [];

    var bottom_y = (-1) * height;
    var top_y = height;Math.sqrt(0.5)/2;

    // Make the top
    for (var i=0; i<360; i+=degsPerSide)
    {
        var angle1 = i;
        var angle2 = i+degsPerSide;
        if (angle2 > 360) angle2 = 360;
        //console.log("Angle1: "+angle1);
        //console.log("Angle2: "+angle2);
        var radians1 = angle1 * (Math.PI/180);
        var radians2 = angle2 * (Math.PI/180);
        //console.log("Pushing top");
        positions.push([radius*Math.cos(radians2), top_y, radius*Math.sin(radians2), 1.0]);
        positions.push([radius*Math.cos(radians1), top_y, radius*Math.sin(radians1), 1.0]);
        positions.push([0, top_y, 0, 1.0]);
    }

    // Make the bottom
    for (var i=0; i<360; i+=degsPerSide)
    {
        var angle1 = i;
        var angle2 = i+degsPerSide;
        if (angle2 > 360) angle2 = 360;
        //console.log("Angle1: "+angle1);
        //console.log("Angle2: "+angle2);
        var radians1 = angle1 * (Math.PI/180);
        var radians2 = angle2 * (Math.PI/180);
        positions.push([radius*Math.cos(radians1), bottom_y, radius*Math.sin(radians1), 1.0]);
        positions.push([radius*Math.cos(radians2), bottom_y, radius*Math.sin(radians2), 1.0]);
        positions.push([0, bottom_y, 0, 1.0]);
        //console.log("Pushing bottom");
        //console.log((radius*Math.cos(radians1)+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(radius*Math.sin(radians1)+bottomCenterZCoord)+", "+1.0);
        //console.log((radius*Math.cos(radians2)+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(radius*Math.sin(radians2)+bottomCenterZCoord)+", "+1.0);
        //console.log((0+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(0+bottomCenterZCoord)+", "+1.0);
    }

    // Make the vertical sides with two vertices on the bottom
    for (var i=0; i<360; i+=degsPerSide)
    {
        var angle1 = i;
        var angle2 = i+degsPerSide;
        if (angle2 > 360) angle2 = 360;
        //console.log("Angle1: "+angle1);
        //console.log("Angle2: "+angle2);
        var radians1 = angle1 * (Math.PI/180);
        var radians2 = angle2 * (Math.PI/180);
        //Side with two vertices on the bottom
        positions.push([radius*Math.cos(radians2), top_y, radius*Math.sin(radians2), 1.0]);
        positions.push([radius*Math.cos(radians2), bottom_y, radius*Math.sin(radians2), 1.0]);
        positions.push([radius*Math.cos(radians1), bottom_y, radius*Math.sin(radians1), 1.0]);
        //Side with two vertices on the top
        positions.push([radius*Math.cos(radians1), top_y, radius*Math.sin(radians1), 1.0]);
        positions.push([radius*Math.cos(radians2), top_y, radius*Math.sin(radians2), 1.0]);
        positions.push([radius*Math.cos(radians1), bottom_y, radius*Math.sin(radians1), 1.0]);
        //console.log("Pushing two sides");
        //console.log((0+topXCoord)+", "+(0+topYCoord)+", "+(0+topZCoord)+", "+1.0);
        //console.log((radius*Math.cos(radians2)+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(radius*Math.sin(radians2)+bottomCenterZCoord)+", "+1.0);
        //console.log((radius*Math.cos(radians1)+bottomCenterXCoord)+", "+(0+bottomCenterYCoord)+", "+(radius*Math.sin(radians1)+bottomCenterZCoord)+", "+1.0);
    }

    return positions;
}

function makePositionsSphere(radius, sphereDegsPerLong, sphereDegsPerLat)
{
    var positions = [];

    var numLevels = 180/sphereDegsPerLat;

    // Make the top and bottom part that are basically cones
    for (var j=0; j<2; j++)
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

            if (j == 0)
            {
                positions.push([0, radius, 0, 1.0]);
                positions.push([firstLvlRadius*Math.cos(radians2), radius*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians2), 1.0]);
                positions.push([firstLvlRadius*Math.cos(radians1), radius*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians1), 1.0]);
                //console.log((0)+", "+(0.5)+", "+(0)+", "+1.0);
                //console.log((firstLvlRadius*Math.cos(radians2)).toFixed(4)+", "+(0.5*Math.sin(radiansDown)).toFixed(4)+", "+(firstLvlRadius*Math.sin(radians2)).toFixed(4)+", "+1.0);
                //console.log((firstLvlRadius*Math.cos(radians1)).toFixed(4)+", "+(0.5*Math.sin(radiansDown)).toFixed(4)+", "+(firstLvlRadius*Math.sin(radians1)).toFixed(4)+", "+1.0);
            }
            else
            {
                positions.push([firstLvlRadius*Math.cos(radians2), radius*(-1)*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians2), 1.0]);
                positions.push([0, radius*(-1), 0, 1.0]);
                positions.push([firstLvlRadius*Math.cos(radians1), radius*(-1)*Math.sin(radiansDown), firstLvlRadius*Math.sin(radians1), 1.0]);
                //console.log((firstLvlRadius*Math.cos(radians2)).toFixed(4)+", "+(-0.5*Math.sin(radiansDown)).toFixed(4)+", "+(firstLvlRadius*Math.sin(radians2)).toFixed(4)+", "+1.0);
                //console.log((0)+", "+(-0.5)+", "+(0)+", "+1.0);
                //console.log((firstLvlRadius*Math.cos(radians1)).toFixed(4)+", "+(-0.5*Math.sin(radiansDown)).toFixed(4)+", "+(firstLvlRadius*Math.sin(radians1)).toFixed(4)+", "+1.0);
            }
        }
    }

    // Make each ring of rectangles
    for (var i=90-sphereDegsPerLat; i>(-90+sphereDegsPerLat); i-=sphereDegsPerLat)
    {
        var angle1 = i;
        var angle2 = i-sphereDegsPerLat;
        //console.log("Angle1 in outer loop: "+angle1);
        //console.log("Angle2 in outer loop: "+angle2);
        var radians1 = angle1 * (Math.PI/180);
        var radians2 = angle2 * (Math.PI/180);
        var top_y = radius*Math.sin(radians1);
        var bottom_y = radius*Math.sin(radians2);
        //console.log("top_y in outer loop: "+top_y);
        //console.log("bottom_y in outer loop: "+bottom_y);
        var top_radius = radius*Math.cos(angle1 * (Math.PI/180));
        var bottom_radius = radius*Math.cos(angle2 * (Math.PI/180));
        //console.log("top_radius in outer loop: "+top_radius);
        //console.log("bottom_radius in outer loop: "+bottom_radius);

        for (var j=0; j<360; j+=sphereDegsPerLong)
        {
            var angleA = j;
            var angleB = j+sphereDegsPerLong;
            if (angleB > 360) angleB = 360;
            //console.log("AngleA: "+angleA);
            //console.log("AngleB: "+angleB);
            var radiansA = angleA * (Math.PI/180);
            var radiansB = angleB * (Math.PI/180);
            //Side with two vertices on the bottom
            positions.push([top_radius*Math.cos(radiansB), top_y, top_radius*Math.sin(radiansB), 1.0]);
            positions.push([bottom_radius*Math.cos(radiansB), bottom_y, bottom_radius*Math.sin(radiansB), 1.0]);
            positions.push([bottom_radius*Math.cos(radiansA), bottom_y, bottom_radius*Math.sin(radiansA), 1.0]);
            //Side with two vertices on the top
            positions.push([top_radius*Math.cos(radiansA), top_y, top_radius*Math.sin(radiansA), 1.0]);
            positions.push([top_radius*Math.cos(radiansB), top_y, top_radius*Math.sin(radiansB), 1.0]);
            positions.push([bottom_radius*Math.cos(radiansA), bottom_y, bottom_radius*Math.sin(radiansA), 1.0]);

            /*if (j == 0)
            {
                console.log("Pushing first part");
                console.log((top_radius*Math.cos(radiansB)).toFixed(4)+", "+top_y.toFixed(4)+", "+(top_radius*Math.sin(radiansB)).toFixed(4)+", "+1.0);
                console.log((bottom_radius*Math.cos(radiansB)).toFixed(4)+", "+bottom_y.toFixed(4)+", "+(bottom_radius*Math.sin(radiansB)).toFixed(4)+", "+1.0);
                console.log((bottom_radius*Math.cos(radiansA)).toFixed(4)+", "+bottom_y.toFixed(4)+", "+(bottom_radius*Math.sin(radiansA)).toFixed(4)+", "+1.0);
                console.log("Pushing second part");
                console.log((top_radius*Math.cos(radiansA)).toFixed(4)+", "+top_y.toFixed(4)+", "+(top_radius*Math.sin(radiansA)).toFixed(4)+", "+1.0);
                console.log((top_radius*Math.cos(radiansB)).toFixed(4)+", "+top_y.toFixed(4)+", "+(top_radius*Math.sin(radiansB)).toFixed(4)+", "+1.0);
                console.log((bottom_radius*Math.cos(radiansA)).toFixed(4)+", "+bottom_y.toFixed(4)+", "+(bottom_radius*Math.sin(radiansA)).toFixed(4)+", "+1.0);
            }*/
        }
    }

    return positions;
}