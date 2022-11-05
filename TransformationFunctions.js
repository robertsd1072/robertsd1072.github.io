'use strict';

function translate(trans_x, trans_y, trans_z)
{
    curXtrans += trans_x;
    curYtrans += trans_y;
    curZtrans += trans_z;

    //console.log("Location now: "+curXtrans+", "+curYtrans+", "+curZtrans);

    return [[1, 0, 0, 0]
           ,[0, 1, 0, 0]
           ,[0, 0, 1, 0]
           ,[curXtrans, curYtrans, curZtrans, 1]];
}

function scale(scale)
{
    curScale += scale;

    if (curScale < 0)
        curScale = 0;

    //console.log("Scale now: "+curScale);

    return [[curScale, 0, 0, 0]
           ,[0, curScale, 0, 0]
           ,[0, 0, curScale, 0]
           ,[0, 0, 0, 1]];
}

function rotate(rotat_x, rotat_y, rotat_z)
{
    // Input in radians
    if (isPrevRotate)
    {
        curXrotat = prevXrota + rotat_x;
        curYrotat = prevYrota + rotat_y;
        curZrotat = prevZrota + rotat_z;
    }
    else
    {
        curXrotat = rotat_x;
        curYrotat = rotat_y;
        curZrotat = rotat_z;
    }

    if (curXrotat > (30*(Math.PI/180)))
        curXrotat = 30*(Math.PI/180);
    if (curXrotat < (-30*(Math.PI/180)))
        curXrotat = -30*(Math.PI/180);

    //console.log("X rotate = "+(curXrotat/(Math.PI/180))+" Y rotate = "+(curYrotat/(Math.PI/180)));
    //console.log("X input = "+(rotat_x/(Math.PI/180))+" Y input = "+(rotat_y/(Math.PI/180)));

    var mat_x = [[1, 0, 0, 0]
                ,[0, Math.cos(curXrotat), Math.sin(curXrotat)*-1, 0]
                ,[0, Math.sin(curXrotat), Math.cos(curXrotat), 0]
                ,[0, 0, 0, 1]];

    var mat_y = [[Math.cos(curYrotat), 0, Math.sin(curYrotat), 0]
                ,[0, 1, 0, 0]
                ,[Math.sin(curYrotat)*-1, 0, Math.cos(curYrotat), 0]
                ,[0, 0, 0, 1]];

    var mat_z = [[Math.cos(curZrotat), Math.sin(curZrotat)*-1, 0, 0]
                ,[Math.sin(curZrotat), Math.cos(curZrotat), 0, 0]
                ,[0, 0, 1, 0]
                ,[0, 0, 0, 1]];

    return matMatMult(matMatMult(mat_x, mat_y), mat_z);
}

function rotate_V2(rotat_x, rotat_y, rotat_z)
{ // Input in radians
    
    var new_rotat_x = rotat_x;

    if (curXrotat > (30*(Math.PI/180)))
    {
        curXrotat = (30*(Math.PI/180));
        new_rotat_x = 0;
    }
    if (curXrotat < (-30*(Math.PI/180)))
    {
        curXrotat = (-30*(Math.PI/180));
        new_rotat_x = 0;
    }

    curXrotat = rotat_x + curXrotat;
    curYrotat = rotat_y + curYrotat;

    var mat_x = [[1, 0, 0, 0]
                ,[0, Math.cos(new_rotat_x), Math.sin(new_rotat_x)*-1, 0]
                ,[0, Math.sin(new_rotat_x), Math.cos(new_rotat_x), 0]
                ,[0, 0, 0, 1]];

    var mat_y = [[Math.cos(rotat_y), 0, Math.sin(rotat_y), 0]
                ,[0, 1, 0, 0]
                ,[Math.sin(rotat_y)*-1, 0, Math.cos(rotat_y), 0]
                ,[0, 0, 0, 1]];

    var mat_z = [[Math.cos(0), Math.sin(0)*-1, 0, 0]
                ,[Math.sin(0), Math.cos(0), 0, 0]
                ,[0, 0, 1, 0]
                ,[0, 0, 0, 1]];

    return matMatMult(matMatMult(mat_x, mat_y), mat_z);
}

function translate_mat(trans_x, trans_y, trans_z)
{
	return [[1, 0, 0, 0]
           ,[0, 1, 0, 0]
           ,[0, 0, 1, 0]
           ,[trans_x, trans_y, trans_z, 1]];
}

function rotate_mat(rotat_x, rotat_y, rotat_z)
{
    // Input in radians
    var mat_x = [[1, 0, 0, 0]
                ,[0, Math.cos(rotat_x), Math.sin(rotat_x)*-1, 0]
                ,[0, Math.sin(rotat_x), Math.cos(rotat_x), 0]
                ,[0, 0, 0, 1]];

    var mat_y = [[Math.cos(rotat_y), 0, Math.sin(rotat_y), 0]
                ,[0, 1, 0, 0]
                ,[Math.sin(rotat_y)*-1, 0, Math.cos(rotat_y), 0]
                ,[0, 0, 0, 1]];

    var mat_z = [[Math.cos(rotat_z), Math.sin(rotat_z)*-1, 0, 0]
                ,[Math.sin(rotat_z), Math.cos(rotat_z), 0, 0]
                ,[0, 0, 1, 0]
                ,[0, 0, 0, 1]];

    return matMatMult(matMatMult(mat_x, mat_y), mat_z);
}

function scale_mat(scale)
{
    return [[scale, 0, 0, 0]
           ,[0, scale, 0, 0]
           ,[0, 0, scale, 0]
           ,[0, 0, 0, 1]];
}