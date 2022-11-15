// Always execute in strict mode bc helps reduce bugs (idk my prof said so)
'use strict';

// These variables must be global variables.
// Some callback functions may need to access them.
var gl = null;
var canvas = null;
var ctm_location;
var shaderProgram;
var buffer;
var vPosition_location;
var vColor_location;

var ctm_reset = [[1.0, 0.0, 0.0, 0.0],
                 [0.0, 1.0, 0.0, 0.0],
                 [0.0, 0.0, 1.0, 0.0],
                 [0.0, 0.0, 0, 1.0]];
var ctm = ctm_reset;

var degsPerSide = 0;

var whichObject = "sphere";
var whichTrans = "rotate";

var sphereDegsPerLat = 1;
var sphereDegsPerLong = 1;

var mouseMoveBool = false;
var origMouseX;
var origMouseY;

var curXrotat = 0;
var curYrotat = 0;

var curScale = 1.0;

var showingSpotArr = [false, false, false, false, false, false];
var showingSideBar = [false, false, false, false, false, false];
var navArr = ["nav0", "nav1", "nav2", "nav3", "nav4", "nav5"];
var foundSpotBools = [false, false, false, false, false, false];
var clickedSpotArr = [false, false, false, false, false, false];

var highlightedSpot = -1;

var curCenterX;
var curCenterY;

var positions = [];
var colors = [];

var numSteps = 25;
var curStep = 0;
var incCanvas = 0;
var incSphere = 0;

var curXtrans = 0;
var curYtrans = 0;

var widthNav = 0;

var modal;

var mouseCTM = ctm_reset;
var lengthSphereAndOffsetMouse;

function initGL(canvas)
{
    gl = canvas.getContext("webgl");
    if(!gl)
    {
	   alert("WebGL is not available...");
	   return -1;
    }

    // Set the clear screen color to light blue (R, G, B, A)
    gl.clearColor(0.5, 0.875, 1.0, 1.0);
    
    // Enable hidden surface removal
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    return 0;
}

function init()
{
    makePositionsAndColors(1);

    lengthSphereAndOffsetMouse = positions.length-3;

    // Load and compile shader programs
    shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    if(shaderProgram == -1)
	   return -1;
    gl.useProgram(shaderProgram);

    // Allocate memory in a graphics card
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * (to1DF32Array(positions).length + to1DF32Array(colors).length), gl.STATIC_DRAW);
    // Transfer positions and put it at the beginning of the buffer
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, to1DF32Array(positions));
    // Transfer colors and put it right after positions
    gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 4 * positions.length, to1DF32Array(colors));

    // Vertex Position - locate and enable "vPosition"
    vPosition_location = gl.getAttribLocation(shaderProgram, "vPosition");
    if (vPosition_location == -1)
    { 
        alert("Unable to locate vPosition");
        return -1;
    }
    gl.enableVertexAttribArray(vPosition_location);
    // vPosition starts at offset 0
    gl.vertexAttribPointer(vPosition_location, 4, gl.FLOAT, false, 0, 0);

    // Vertex Color - locate and enable vColor
    vColor_location = gl.getAttribLocation(shaderProgram, "vColor");
    if (vColor_location == -1)
    { 
        alert("Unable to locate vColor");
        return -1;
    }
    gl.enableVertexAttribArray(vColor_location);
    // vColor starts at the end of positions
    gl.vertexAttribPointer(vColor_location, 4, gl.FLOAT, false, 0, 4 * 4 * positions.length);

    //console.log("vPosition_location = "+vPosition_location);
    //console.log("positions.length = "+positions.length);
    //console.log("vColor_location = "+vColor_location);

    // Current Transformation Matrix - locate and enable "ctm"
    ctm_location = gl.getUniformLocation(shaderProgram, "ctm");
    if (ctm_location == -1)
    { 
        alert("Unable to locate ctm");
        return -1;
    }

    return 0;
}

/* **************************************************************
 * Can be used to add/remove positions from canvas and redraw the canvas
 * Not currently needed
 * **************************************************************/
function recreate(which)
{
    if (which == "addMore")
    {
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * (to1DF32Array(positions).length + to1DF32Array(colors).length), gl.STATIC_DRAW);

        // Transfer positions and put it at the beginning of the buffer
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, to1DF32Array(positions));

        gl.enableVertexAttribArray(vPosition_location);
        // vPosition starts at offset 0
        gl.vertexAttribPointer(vPosition_location, 4, gl.FLOAT, false, 0, 0);

        // Transfer colors and put it right after positions
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 4 * positions.length, to1DF32Array(colors));

        gl.enableVertexAttribArray(vColor_location);
        // vColor starts at the end of positions
        gl.vertexAttribPointer(vColor_location, 4, gl.FLOAT, false, 0, 4 * 4 * positions.length);
    }
}

function display()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the ctm
    gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(ctm));
    // Draw the object
    gl.drawArrays(gl.TRIANGLES, 0, lengthSphereAndOffsetMouse);

    // Set the ctm
    gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(mouseCTM));
    // Draw the object
    gl.drawArrays(gl.TRIANGLES, lengthSphereAndOffsetMouse, 3);

    // Set the ctm
    gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(ctm));
    // Draw the object
    gl.drawArrays(gl.TRIANGLES, lengthSphereAndOffsetMouse+3, positions.length-(lengthSphereAndOffsetMouse+3));
}

function animate()
{
    if (curStep < numSteps)
    {
        console.log("Animating canvas and sphere");

        canvas.width = canvas.width-incCanvas;
        calculateSizeOfSphereAndCanvas();
        curStep++;
        requestAnimationFrame(animate);
    }
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav(whichNav)
{
    //printMat(ctm);

    numSteps = 40;
    curStep = 0;
    incCanvas = 600/numSteps;
    animate();

    var amount = document.body.clientWidth/2;
    if (amount > 600)
        amount = 600;

    widthNav = amount;

    document.getElementById(whichNav).style.width = amount+"px";
    document.getElementById("main").style.marginLeft = amount+"px";

    //console.log("prevXrota = "+prevXrota);
    //console.log("prevYrota = "+prevYrota);
    //console.log("prevZrota = "+prevZrota);

    //console.log("curXrotat = "+curXrotat);
    //console.log("curYrotat = "+curYrotat);
    //console.log("curZrotat = "+curZrotat);
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav(whichNav)
{
    document.getElementById(whichNav).style.width = "0";
    document.getElementById("main").style.marginLeft = "0";

    numSteps = 25;
    curStep = 0;
    incCanvas = -600/numSteps;
    animate();

    //recreate("addMore");
    display();

    var index = -1;
    for (var i=0; i<navArr.length; i++)
    {
        if (navArr[i] == whichNav)
        {
            index = i;
            break;
        }

    }

    showingSideBar[index] = false;

    widthNav = 0;
}

/* Closes one nav and opens another without transforming sphere */
function closeOneAndOpenAnotherNav(whichNavClose, whichNavOpen)
{
    var amount = document.body.clientWidth/2;
    if (amount > 600)
        amount = 600;
    amount = amount+"px";

    document.getElementById(whichNavClose).style.width = "0";
    document.getElementById(whichNavOpen).style.width = amount;
}

function calculateSizeOfSphereAndCanvas()
{
    var newCenterX = canvas.width/2;
    var newCenterY = canvas.height/2+92;

    //console.log("difX = "+(newCenterX-curCenterX));
    //console.log("difY = "+(newCenterY-curCenterY));

    var new_orig_x = (newCenterX-curCenterX)/1000;
    var new_orig_y = (newCenterY-curCenterY)/1000;

    //console.log("new_orig_x = "+new_orig_x);
    //console.log("new_orig_y = "+new_orig_y);

    var new_scale;
    if (canvas.height < canvas.width)
        new_scale = (canvas.height-100)/2000;
    else
        new_scale = (canvas.width-100)/2000;

    if (new_scale < 0)
        new_scale = 0;

    curScale = new_scale;

    //ctm = matMatMult(translate_mat(new_orig_x, new_orig_y, 0), scale_mat(new_scale));
    ctm = matMatMult(translate_mat(new_orig_x, new_orig_y, 0), matMatMult(scale_mat(new_scale), rotate_mat(curXrotat, curYrotat, 0)));
    mouseCTM = ctm;

    display();

    curXtrans = ctm[3][0];
    curYtrans = ctm[3][1];
}

function inSphere(eX, eY, radius, midX, midY)
{
    var navIsOpen = false;
    for (var i=0; i<6; i++)
    {
        if (showingSideBar[i])
        {
            navIsOpen = true;
            break;
        }
    }

    if (navIsOpen)
    {
        //console.log("Nav is open");
        return Math.pow(radius, 2) > Math.pow(eX-midX-widthNav, 2) + Math.pow((eY-midY), 2);
    }
    else
        return Math.pow(radius, 2) > Math.pow(eX-midX, 2) + Math.pow((eY-midY), 2);
}

function highlightSpotIfMouse(mouseX, mouseY, canvasX, canvasY, canvasZ)
{
    var whichSpot = -1;

    /* *********************************************************
     * START
     * Mapping mouse coords to canvas coords
     * *********************************************************/
    //var scaleX = canvas.width/2000;
    //var scaleY = canvas.height/2000;

    //var canvasX = ((mouseX) / canvas.width * 2 - 1) * (1+scaleX);
    //var canvasY = ((mouseY-document.getElementById("topInfo").clientHeight) / canvas.height * -2 + 1) * (1+scaleY);

    //console.log("Canvas coords = "+canvasX+", "+canvasY);

    //console.log("------------NEW--------------");

    for (var i=0; i<6; i++)
    {
        if (foundSpotBools[i])
        {
            //console.log("Checking spot "+(i+1));

            var topRightIndex = colorsIndexes[spotsMaxMins[i][0][0]][spotsMaxMins[i][0][1]][2];
            var bottomRightIndex = colorsIndexes[spotsMaxMins[i][1][0]][spotsMaxMins[i][1][1]][3];
            var bottomLeftIndex = colorsIndexes[spotsMaxMins[i][2][0]][spotsMaxMins[i][2][1]][3]+2;

            var topRight = [positions[topRightIndex]      // top left
                           ,positions[bottomLeftIndex]    // bottom right
                           ,positions[bottomRightIndex]   // bottom left
                           ,[0, 0, 0, 1]];

            //console.log("curYrotat = "+(curYrotat/(Math.PI/180)));
            //printMat(changeCoords);

            if (canvasZ-topRight[0][2] < 1.3)
            {
                var newCanvas = [canvasX, canvasY, canvasZ, 1];

                var newTopRight = topRight;

                //positions.push([newTopRight[0][0], newTopRight[0][1], newTopRight[0][2], newTopRight[0][3]]);
                //positions.push([newTopRight[1][0], newTopRight[1][1], newTopRight[1][2], newTopRight[1][3]]);
                //positions.push([newTopRight[2][0], newTopRight[2][1], newTopRight[2][2], newTopRight[2][3]]);

                //colors.push([0.5, 0, 1, 1]);
                //colors.push([0.5, 0, 1, 1]);
                //colors.push([0.5, 0, 1, 1]);

                newTopRight = matMatMult(ctm, topRight);

                //positions.push([newCanvas[0], newCanvas[1], newCanvas[2], 1]);
                //positions.push([newCanvas[0]-0.05, newCanvas[1]-0.1, newCanvas[2], 1]);
                //positions.push([newCanvas[0]+0.05, newCanvas[1]-0.1, newCanvas[2], 1]);

                //console.log("Push 1x1 for spot "+(i+1));
                
                var biggerX = newTopRight[1][0];
                var smallerX = newTopRight[0][0]
                if (newTopRight[1][0] < newTopRight[0][0])
                {
                    biggerX = newTopRight[0][0];
                    smallerX = newTopRight[1][0];
                }

                var biggerY = newTopRight[0][1];
                var smallerY = newTopRight[1][1];
                if (newTopRight[0][1] < newTopRight[1][1])
                {
                    biggerY = newTopRight[1][1];
                    smallerY = newTopRight[0][1];
                }

                //console.log("X: "+smallerX+" < "+newCanvas[0]+" < "+biggerX+" ? ");
                //console.log("Y: "+smallerY+" < "+newCanvas[1]+" < "+biggerY+" ? ");

                if ( (newCanvas[0] >= smallerX && newCanvas[0] <= biggerX)
                  && (newCanvas[1] >= smallerY && newCanvas[1] <= biggerY) )
                {
                    //console.log("           In spot "+(i+1));
                    whichSpot = i;
                    break;
                }
            }
        }
    }

    //recreate("addMore");

    /* *********************************************************
     * END
     * Mapping mouse coords to canvas coords
     * *********************************************************/

    //console.log("whichSpot = "+whichSpot);

    var hideSpot = -1;

    for (var i=0; i<6; i++)
    {
        for (var j=0; j<spots[i].length; j++)
        {
            if (i == whichSpot && foundSpotBools[whichSpot])
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][0])), highlightedSpotArr);
                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][1])), highlightedSpotArr);
                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][2])), highlightedSpotArr);
                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][3])), highlightedSpotArr);
            }
            else
            {
                if (showingSpotArr[i])
                    hideSpot = i;
                showingSpotArr[i] = false;

                if (clickedSpotArr[i])
                {
                    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][0])), foundSpotClickedArr);
                    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][1])), foundSpotClickedArr);
                    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][2])), foundSpotClickedArr);
                    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][3])), foundSpotClickedArr);
                }
                else if (foundSpotBools[i])
                {
                    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][0])), foundSpotArr);
                    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][1])), foundSpotArr);
                    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][2])), foundSpotArr);
                    gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[i][j][0]][spots[i][j][1]][3])), foundSpotArr);
                }
                else
                {
                    makeTriColor(colors, notfoundSpot[0], notfoundSpot[1], notfoundSpot[2], colorsIndexes[spots[i][j][0]][spots[i][j][1]][0]);
                    makeTriColor(colors, notfoundSpot[0], notfoundSpot[1], notfoundSpot[2], colorsIndexes[spots[i][j][0]][spots[i][j][1]][1]);
                    makeTriColor(colors, notfoundSpot[0], notfoundSpot[1], notfoundSpot[2], colorsIndexes[spots[i][j][0]][spots[i][j][1]][2]);
                    makeTriColor(colors, notfoundSpot[0], notfoundSpot[1], notfoundSpot[2], colorsIndexes[spots[i][j][0]][spots[i][j][1]][3]);
                }
            }
        }
    }

    if (whichSpot > -1 && hideSpot == -1 && !showingSpotArr[whichSpot] && foundSpotBools[whichSpot])
    {
        console.log("Highlighting spot "+(whichSpot+1));
        showingSpotArr[whichSpot] = true;
        highlightedSpot = whichSpot;

        if (whichSpot == 0)
            document.getElementById("modtext").textContent = "Click this point of interest to learn about David's professional skills";
        else if (whichSpot == 1)
            document.getElementById("modtext").textContent = "Click this point of interest to learn about David's programming skills";
        else if (whichSpot == 2)
            document.getElementById("modtext").textContent = "Click this point of interest to learn about David's education";
        else if (whichSpot == 3)
            document.getElementById("modtext").textContent = "Click this point of interest to learn about David's professional experience";
        else if (whichSpot == 4)
            document.getElementById("modtext").textContent = "Click this point of interest to learn about David's spoken languages";
        else if (whichSpot == 5)
            document.getElementById("modtext").textContent = "Click this point of interest to learn about David's personal projects";

        modal.style.display = "flex";
        modal.style.position = "absolute";
        modal.style.left = mouseX+"px";
        modal.style.top = (mouseY-30)+"px";

        //console.log("mouse "+mouseX+", "+mouseY);
    }
    else if (whichSpot == -1 && hideSpot != -1)
    {
        console.log("Hiding spot "+(hideSpot+1));
        showingSpotArr[hideSpot] = false;
        highlightedSpot = -1;

        modal.style.display = "none";
    }

    display();
}

function resizeCallback()
{
    //console.log("Width = "+document.body.clientWidth);
    //console.log("Height = "+document.body.clientHeight);

    var navIsOpen = false;
    for (var i=0; i<6; i++)
    {
        if (showingSideBar[i])
        {
            navIsOpen = true;
            break;
        }
    }

    if (navIsOpen)
        canvas.width = Math.min(document.getElementById("topInfo").clientWidth, document.body.clientWidth) - widthNav;
    else
        canvas.width = Math.min(document.getElementById("topInfo").clientWidth, document.body.clientWidth);
    
    canvas.height = document.body.clientHeight-document.getElementById("topInfo").clientHeight;

    showRefreshModal();

    //console.log("New width = "+canvas.width);
    //console.log("New height = "+canvas.height);

    calculateSizeOfSphereAndCanvas();
}

function keyDownCallback(event)
{
    /* *******************************************
     * Shift + 1, 2, 3, 4, 5, or 6 for alternative open of navs
     * Can use but was for testing purposes
     * *******************************************/
    /*if (event.key == "!" || event.key == "@" || event.key == "#" || event.key == "$" || event.key == "%" || event.key == "^")
    {
        var whichIsShowing = -1;
        for (var i=0; i<6; i++)
        {
            if (showingSideBar[i] && event.keyCode-49 != i)
                whichIsShowing = i;
        }

        if (whichIsShowing > -1)
        {
            showingSideBar[whichIsShowing] = false;
            showingSideBar[event.keyCode-49] = true;

            //closeNav(navArr[whichIsShowing]);
            //openNav(navArr[event.keyCode-49]);
            closeOneAndOpenAnotherNav(navArr[whichIsShowing], navArr[event.keyCode-49]);
        }
        else
        {
            showingSideBar[event.keyCode-49] = false;
            closeNav(navArr[event.keyCode-49]);

            //showingSideBar[event.keyCode-49] = true;
            //openNav(navArr[event.keyCode-49]);
        }

        display();
    }*/

    if (event.keyCode == 65) // A
        alert("Screen Width = "+document.body.clientWidth+" height = "+document.body.clientHeight);
}

function mouseDownCallback(event)
{
    if (event.button == 0)
    {
        mouseMoveBool = true;

        origMouseX = event.clientX;
        origMouseY = event.clientY;

        //console.log("Coords: "+(origMouseX)+", "+(origMouseY));
        //console.log("Middle sphere: "+(canvas.width/2)+", "+((canvas.height/2)+101));
        //console.log("curScale = "+curScale);
    }
}

function mouseUpCallback(event)
{
    if (event.button == 0)
    {
        mouseMoveBool = false;

        //prevXrota = curXrotat;
        //prevYrota = curYrotat;
        //prevZrota = curZrotat;

        //console.log("Current Y rotation = "+(prevYrota/(Math.PI/180)));

        //whichTrans = "";

        //console.log("Unclicked");

        if (highlightedSpot > -1)
        {
            /* *****************************************
             * Spot (Point of interest) is highlighted and user clicks, so open nav with info
             * *****************************************/
            console.log("Revealing side nav and hiding spot "+highlightedSpot);

            var navMightBeOpen = -1;
            for (var i=0; i<6; i++)
            {
                if (showingSideBar[i])
                {
                    navMightBeOpen = i;
                    break;
                }
            }

            if (navMightBeOpen > -1)
            {
                closeOneAndOpenAnotherNav(navArr[navMightBeOpen], navArr[highlightedSpot]);
                showingSideBar[navMightBeOpen] = false;
            }
            else
                openNav(navArr[highlightedSpot]);

            showingSideBar[highlightedSpot] = true;
            showingSpotArr[highlightedSpot] = false;
            clickedSpotArr[highlightedSpot] = true;

            for (var i=0; i<spots[highlightedSpot].length; i++)
            {
                //console.log("Making coord "+spots[highlightedSpot][i][0]+", "+spots[highlightedSpot][i][2]+" red");
                //makeTriColor(colors, 1.0, 0.588, 0.0, colorsIndexes[spots[highlightedSpot][i][0]][spots[highlightedSpot][i][1]][0]);
                //makeTriColor(colors, 1.0, 0.588, 0.0, colorsIndexes[spots[highlightedSpot][i][0]][spots[highlightedSpot][i][1]][1]);
                //makeTriColor(colors, 1.0, 0.588, 0.0, colorsIndexes[spots[highlightedSpot][i][0]][spots[highlightedSpot][i][1]][2]);
                //makeTriColor(colors, 1.0, 0.588, 0.0, colorsIndexes[spots[highlightedSpot][i][0]][spots[highlightedSpot][i][1]][3]);

                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[highlightedSpot][i][0]][spots[highlightedSpot][i][1]][0])), foundSpotClickedArr);
                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[highlightedSpot][i][0]][spots[highlightedSpot][i][1]][1])), foundSpotClickedArr);
                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[highlightedSpot][i][0]][spots[highlightedSpot][i][1]][2])), foundSpotClickedArr);
                gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[spots[highlightedSpot][i][0]][spots[highlightedSpot][i][1]][3])), foundSpotClickedArr);
            }
            highlightedSpot = -1;

            var cntFound = 0;
            for (var i=0; i<6; i++)
            {
                if (clickedSpotArr[i])
                    cntFound++;
            }

            document.getElementById("pointsClicked").style.width = ((cntFound/6)*100) + "%";
            document.getElementById("pointsClicked").innerHTML = cntFound+"/6";

            modal.style.display = "none";

            display();
        }
    }
}

function glMouseMoveCallback(event)
{
    //console.log(event.clientX+", "+event.clientY);

    var midX = (canvas.width/2);
    var midY = ((canvas.height/2)+document.getElementById("topInfo").clientHeight);
    var radius = 1000*curScale;

    if (mouseMoveBool)
    {
        var negTrans = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [(-1)*ctm[3][0], (-1)*ctm[3][1], 0, 1]];

        var posTrans = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [ctm[3][0], ctm[3][1], 0, 1]];

        //console.log("curXrotat = "+curXrotat);

        var rotation_scalar = 1.5*Math.log(curScale)+3.7;
        if (rotation_scalar < 0.1)
            rotation_scalar = 0.1;

        /* *****************************************
         * Use the below to enable rotation about x
         
         * ****************************************************/
        var negXrota = rotate_mat((-1)*curXrotat, 0, 0);

        curXrotat = curXrotat + (origMouseY-event.clientY)*(Math.PI/180)/(rotation_scalar*(2000/document.body.clientHeight));
        if (curXrotat > (30*(Math.PI/180)))
        {
            curXrotat = (30*(Math.PI/180));
        }
        if (curXrotat < (-30*(Math.PI/180)))
        {
            curXrotat = (-30*(Math.PI/180));
        }

        var posXrota = rotate_mat(curXrotat, 0, 0);
        

        /* *****************************************
         * Use the below to disable rotation about x
        var negXrota = rotate_mat(0, 0, 0);
        var posXrota = rotate_mat(0, 0, 0);
        * ****************************************************/


        // Send sphere to origin and set x rotation to 0
        var mat1 = matMatMult(negXrota, matMatMult(negTrans, ctm));

        // Apply rotation about y
        var mat2 = rotate_V2(0, (origMouseX-event.clientX)*(Math.PI/180)/(rotation_scalar*(2000/document.body.clientHeight)), 0);
        // Reapply rotation about x
        var mat3 = matMatMult(posXrota, matMatMult(mat2, mat1));

        // Send back to where it was
        ctm = matMatMult(posTrans, mat3);
        

        origMouseX = event.clientX;
        origMouseY = event.clientY;

        if (totalIndexesFound < 64800)
        {
            //console.log("prevYrotationForReveal = "+prevYrotationForReveal);
            //console.log("Trying "+(88+((-1)*Math.floor(curYrotat/(Math.PI/180)) % 360))+", "+(89+(Math.ceil(curXrotat/(Math.PI/180)) % 360)));
            //console.log("origX = "+(88+((-1)*Math.floor(curYrotat/(Math.PI/180)) % 360))+" origY = "+(89+(Math.ceil(curXrotat/(Math.PI/180)) % 360)));

            //console.log("origY = "+(89+(Math.ceil(curXrotat/(Math.PI/180)) % 360)));

            //revealSphere(88+((-1)*Math.floor(curYrotat/(Math.PI/180)) % 360), 89+(Math.ceil(curXrotat/(Math.PI/180)) % 360), "na", 60);

            var radius = 1*curScale;
            revealSphereV2(ctm[3][0], ctm[3][1], (radius*6/7));

            document.getElementById("land").style.width = ((totalIndexesFound/64800)*100) + "%";
            document.getElementById("land").innerHTML = Math.round((totalIndexesFound/64800)*100) + "%";

            var cntFound = 0;
            for (var i=0; i<6; i++)
            {
                if (foundSpotBools[i])
                    cntFound++;
            }

            document.getElementById("points").style.width = ((cntFound/6)*100) + "%";
            document.getElementById("points").innerHTML = cntFound+"/6";
        }

        display();

        highlightedSpot = -1;
    }
    else
    {
        /* ******************************************************
         * Below code is used to get color of pixel at mouse coords
         * Not 100% accurate so the code must be wrong
         * As of 11/2/2022 not used but maybe will be re-introduced
         * ******************************************************/
        //console.log("mouse "+event.clientX+", "+event.clientY);

        /*var context = canvas.getContext('webgl');
        var pixels = new Uint8Array(
            4 * context.drawingBufferWidth * context.drawingBufferHeight
        );
        context.readPixels(
            0,
            0,
            context.drawingBufferWidth,
            context.drawingBufferHeight,
            context.RGBA,
            context.UNSIGNED_BYTE,
            pixels
        );

        //document.getElementById("topInfo")
        // And here's components of a pixel on (x, y):
        var pixelR = pixels[4 * ((event.clientY) * context.drawingBufferWidth + event.clientX)];
        var pixelG = pixels[4 * ((event.clientY) * context.drawingBufferWidth + event.clientX) + 1];
        var pixelB = pixels[4 * ((event.clientY) * context.drawingBufferWidth + event.clientX) + 2];
        var pixelA = pixels[4 * ((event.clientY) * context.drawingBufferWidth + event.clientX) + 3];

        if (pixelR == 255 && pixelG == 0 && pixelB == 0)
        {

            console.log(pixelR+", "+pixelG+", "+pixelB+", "+pixelA);
            console.log("mouse "+event.clientX+", "+event.clientY);
        }

        var foundSpotOutof255 = [255, 0, 0, 255];
        var foundSpotClickedOutof255 = [255, 142, 0, 255];

        var pixelColor = [pixelR, pixelG, pixelB, pixelA];

        //console.log(pixelR);
        //console.log(pixelG);
        //console.log(pixelB);
        //console.log(pixelA);

        var spotYN = true;
        for (var i=0; i<3; i++)
        {
            //console.log(pixelColor[i]+" vs "+foundSpot[i]+" and vs "+foundSpotClicked[i]);

            if (pixelColor[i] != foundSpot[i] && pixelColor[i] != foundSpotClicked[i])
            {
                spotYN = false;
                break;
            }
        }
        //if (spotYN)
            //console.log("In spot");*/
        /* ******************************************************
         * END
         * Above code is used to get color of pixel at mouse coords
         * Not 100% accurate so the code must be wrong
         * As of 11/2/2022 not used but maybe will be re-introduced
         * ******************************************************/

        if (inSphere(event.clientX, event.clientY, radius, midX, midY))
        {
            /*//console.log("In sphere");
            //console.log("Coords in circle: "+(event.clientX-midX)+", "+(event.clientY-midY));
            //console.log("radius = "+radius);
            //console.log("Arcsin = "+(Math.asin((event.clientY-midY)/radius)/(Math.PI/180)));
            var angleX = 90+(Math.asin((event.clientY-midY)/radius)/(Math.PI/180));

            var indexX = Math.floor(angleX);

            //console.log("Orig Indexes: "+indexX+", "+indexY);

            var xLimit = Math.sqrt((Math.pow(radius, 2)-Math.pow((event.clientY-midY), 2)));
            //console.log("xLimit +/-"+xLimit);

            var navIsOpen = false;
            for (var i=0; i<6; i++)
            {
                if (showingSideBar[i])
                {
                    navIsOpen = true;
                    break;
                }
            }

            var angleY;
            if (navIsOpen)
            {
                //console.log("widthNav = "+widthNav);
                angleY = 90-(Math.asin((event.clientX-midX-widthNav)/xLimit)/(Math.PI/180));
            }
            else
                angleY = 90-(Math.asin((event.clientX-midX)/xLimit)/(Math.PI/180));
            var indexY = Math.floor(angleY);

            var yOnRight = Math.floor(((-1)*curYrotat)/(Math.PI/180));
            while (yOnRight < 0)
                yOnRight+=359;

            indexY+=yOnRight;
            if (indexY > 359)
                indexY -= 359;

            if (89+(Math.floor(curXrotat/(Math.PI/180)) % 360) != 89)
            {
                indexX -= 89-(89+(Math.floor(curXrotat/(Math.PI/180)) % 360));
                if (indexX < 0)
                {
                    indexX = 0-indexX;
                    indexY = 359-indexY;
                }
                else if (indexX > 179)
                {
                    indexX = 179-(indexX-179);
                    indexY = 359-indexY;
                }
                else
                {
                    var middleYOfTheSphere = 88+((-1)*Math.floor(curYrotat/(Math.PI/180)) % 360);
                    //console.log("middleYOfTheSphere = "+middleYOfTheSphere);
                    //console.log("+ this amount "+(1/100)*Math.pow((indexY-middleYOfTheSphere), 2));

                    indexX += Math.floor((1/350)*Math.pow((indexY-middleYOfTheSphere), 2));
                }
            }

            //console.log("Trying: "+indexX+", "+indexY);

            if (indexX < 180 && indexX > -1)
            {
                highlightSpotIfMouse(indexX, indexY, event.clientX, event.clientY);

                //gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[indexX][indexY][0])), new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]));
                //gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[indexX][indexY][1])), new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]));
                //gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[indexX][indexY][2])), new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]));
                //gl.bufferSubData(gl.ARRAY_BUFFER, (4 * 4 * positions.length)+(4 * 4 * (colorsIndexes[indexX][indexY][3])), new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]));
            }*/


            /* *******************************
             * Below is 2nd method for finding coords in canvas
             * *******************************/
            var scaleX = canvas.width/2000;
            var scaleY = canvas.height/2000;

            var canvasX = ((event.clientX-widthNav) / canvas.width * 2 - 1) * scaleX;
            var canvasY = ((event.clientY-document.getElementById("topInfo").clientHeight) / canvas.height * -2 + 1) * scaleY;

            //console.log(canvasX+", "+canvasY);

            //console.log(curScale);

            //console.log("curXrotat = "+curXrotat);
            //console.log("curYrotat = "+curYrotat);

            //mouseCTM = translate_mat(canvasX, canvasY, 0);

            mouseCTM = [[curScale, 0, 0, 0]
                       ,[0, curScale, 0, 0]
                       ,[0, 0, curScale, 0]
                       ,[ctm[3][0]+canvasX, ctm[3][1]+canvasY, 0, 1]];

            highlightSpotIfMouse(event.clientX, event.clientY, mouseCTM[3][0], mouseCTM[3][1], mouseCTM[3][2]);

            // This one doesn't work
            /*if (drawingMouse)
            //{
            //    positions.pop();
            //    positions.pop();
            //    positions.pop();
            //}

            var scaleX = canvas.width/2000;
            var scaleY = canvas.height/2000;

            //console.log("scaleX = "+scaleX+" scaleY = "+scaleY+" curScale = "+curScale);

            var canvasX = ((event.clientX-widthNav) / canvas.width * 2 - 1) * scaleX/curScale;
            var canvasY = ((event.clientY-document.getElementById("topInfo").clientHeight) / canvas.height * -2 + 1) * scaleY/curScale;

            //console.log(canvasX+", "+canvasY);

            //console.log(curScale);

            //console.log("curXrotat = "+curXrotat);
            //console.log("curYrotat = "+curYrotat);

            var tri = [[0, 0, 0, 1]
                      ,[-0.05, -0.1, 0, 1]
                      ,[0.05, -0.1, 0, 1]
                      ,[0, 0, 0, 1]];

            //console.log("curXrotat = "+curXrotat);

            var calc_rotat_y = translate_mat(Math.sin(curYrotat)*1 + Math.cos(curYrotat)*canvasX, 0, Math.cos(curYrotat)*1 + (-1)*Math.sin(curYrotat)*canvasX);
            var calc_rotat_x = translate_mat(0, Math.sin(curXrotat)*(-1) + Math.cos(curXrotat)*canvasY, Math.cos(curXrotat)*1 + Math.sin(curXrotat)*canvasY);

            // This needs to be 1 when curYrotat = 0 or 180, and itself when curYrotat = 90 or 270
            var xExtra = (Math.cos(curXrotat)*1 + Math.sin(curXrotat)*canvasY);
            var whatToPutForX = (((xExtra-1)/-2)*Math.cos(2*curYrotat)+((xExtra-1)/2))+1;

            // This needs to be 1 when curYrotat = 90 or 270, and itself when curYrotat = 0 or 180
            var zExtra = (Math.cos(curXrotat)*1 + Math.sin(curXrotat)*canvasY);
            var whatToPutForZ = (((xExtra-1)/2)*Math.cos(2*curYrotat)+((xExtra-1)/2))+1;

            var everything = translate_mat((Math.sin(curYrotat)*1 + Math.cos(curYrotat)*canvasX) * whatToPutForX
                                           ,Math.sin(curXrotat)*(-1) + Math.cos(curXrotat)*canvasY
                                          ,(Math.cos(curYrotat)*1 + (-1)*Math.sin(curYrotat)*canvasX) * whatToPutForZ);

            var newTri = matMatMult(everything, tri);
            // ^ this is decent works at 0, 90, 180, and 270, but not in between

            //positions.push([newTri[0][0], newTri[0][1], newTri[0][2], 1]);
            //positions.push([newTri[1][0], newTri[1][1], newTri[1][2], 1]);
            //positions.push([newTri[2][0], newTri[2][1], newTri[2][2], 1]);

            //if (!drawingMouse)
            //{
            //    colors.push([0, 0, 0, 1]);
            //    colors.push([0, 0, 0, 1]);
            //    colors.push([0, 0, 0, 1]);
            //}

            drawingMouse = true;
            //recreate("addMore");

            highlightSpotIfMouse(event.clientX, event.clientY, newTri[0][0], newTri[0][1], newTri[0][2]);*/
        }

        display();
    }
}

var drawingMouse = false;

function main()
{
    canvas = document.getElementById("gl-canvas");
    
    if(initGL(canvas) == -1)
	   return -1;
    if(init() == -1)
	   return -1;

    curCenterX = canvas.width/2;
    curCenterY = canvas.height/2+92;

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight-document.getElementById("topInfo").clientHeight;

    calculateSizeOfSphereAndCanvas();

    canvas.onmousedown = mouseDownCallback;

    canvas.onmouseup = mouseUpCallback;

    document.onkeydown = keyDownCallback;

    window.onresize = resizeCallback;

    canvas.onmousemove = glMouseMoveCallback;

    document.getElementById("land").style.width = ((totalIndexesFound/64800)*100) + "%";
    document.getElementById("land").innerHTML = Math.round((totalIndexesFound/64800)*100) + "%";

    var cntFound = 0;
    for (var i=0; i<6; i++)
    {
        if (foundSpotBools[i])
            cntFound++;
    }

    document.getElementById("points").style.width = ((cntFound/6)*100) + "%";
    document.getElementById("points").innerHTML = cntFound+"/6";

    modal = document.getElementById("myModal");
    modal.style.display = "none";

    document.getElementById("website_ready").style.display = "none";
    document.getElementById("im_ready").style.display = "inline";

    /*var mat2 = transMat([[Math.cos(30*(Math.PI/180))*1, 0, Math.sin(30*(Math.PI/180))*1, 0],
                                                         [0, 1, 0, 0],
                                                         [Math.sin(30*(Math.PI/180))*1, 0, Math.cos(30*(Math.PI/180))*1, 0],
                                                         [0, 0, 0, 1]]);*/

    //console.log("mat2");
    //printMat(mat2);

    //var mat1 = inverMat(mat2);
    //console.log("mat1");
    //printMat(mat1);

    //console.log("Them multd");
    //printMat(matMatMult(mat1, mat2));
}

function userIsReady()
{
    document.getElementById("modalAtBeginning").style.display = "none";

    showRefreshModal();

    curStep = 1;
    numSteps = 60;

    animateReady();
}

function animateReady()
{
    if (curStep < numSteps)
    {
        console.log("Animating when user is ready");

        var radius = 1*curScale;
        revealSphereV2(curXtrans, curYtrans, (curStep/numSteps)*(radius*6/7));
        
        display();

        document.getElementById("land").style.width = ((totalIndexesFound/64800)*100) + "%";
        document.getElementById("land").innerHTML = Math.round((totalIndexesFound/64800)*100) + "%";

        var cntFound = 0;
        for (var i=0; i<6; i++)
        {
            if (foundSpotBools[i])
                cntFound++;
        }

        document.getElementById("points").style.width = ((cntFound/6)*100) + "%";
        document.getElementById("points").innerHTML = cntFound+"/6";

        curStep++;

        requestAnimationFrame(animateReady);
    }
}

function showRefreshModal()
{
    document.getElementById("refreshModal").style.display = "flex";
    document.getElementById("refreshModal").style.position = "absolute";
    document.getElementById("refreshModal").style.left = (document.body.clientWidth-225)+"px";
    document.getElementById("refreshModal").style.top = (document.getElementById("topInfo").clientHeight-30)+"px";
}
