'use strict';

function printVec(vector)
{
	console.log("["+vector[0].toFixed(4)+", "+vector[1].toFixed(4)+", "+vector[2].toFixed(4)+", "+vector[3].toFixed(4)+"]");
}

function scaVecMult(scalar, vector)
{
	return [vector[0]*scalar, vector[1]*scalar, vector[2]*scalar, vector[3]*scalar];
}

function vecVecAdd(vectorA, vectorB)
{
	return [vectorA[0]+vectorB[0], vectorA[1]+vectorB[1], vectorA[2]+vectorB[2], vectorA[3]+vectorB[3]];
}

function vecVecSub(vectorA, vectorB)
{
	return [vectorA[0]-vectorB[0], vectorA[1]-vectorB[1], vectorA[2]-vectorB[2], vectorA[3]-vectorB[3]];
}

function magOfFVec(vector)
{
	return Math.sqrt((vector[0]*vector[0])+(vector[1]*vector[1])+(vector[2]*vector[2])+(vector[3]*vector[3]));
}

function normVec(vector)
{
	return scaVecMult(1/magOfFVec(vector), vector);
}

function dotPro(vectorA, vectorB)
{
	return (vectorA[0]*vectorB[0])+(vectorA[1]*vectorB[1])+(vectorA[2]*vectorB[2])+(vectorA[3]*vectorB[3]);
}

function croPro(vectorA, vectorB)
{
	return [(vectorA[1]*vectorB[2])-(vectorA[2]*vectorB[1]), (vectorA[2]*vectorB[0])-(vectorA[0]*vectorB[2]), (vectorA[0]*vectorB[1])-(vectorA[1]*vectorB[0]), 0.0];
}

function printMat(matrix)
{
	console.log(matrix[0][0].toFixed(4)+" "+matrix[1][0].toFixed(4)+" "+matrix[2][0].toFixed(4)+" "+matrix[3][0].toFixed(4));
	console.log(matrix[0][1].toFixed(4)+" "+matrix[1][1].toFixed(4)+" "+matrix[2][1].toFixed(4)+" "+matrix[3][1].toFixed(4));
	console.log(matrix[0][2].toFixed(4)+" "+matrix[1][2].toFixed(4)+" "+matrix[2][2].toFixed(4)+" "+matrix[3][2].toFixed(4));
	console.log(matrix[0][3].toFixed(4)+" "+matrix[1][3].toFixed(4)+" "+matrix[2][3].toFixed(4)+" "+matrix[3][3].toFixed(4));
}

function scaMatMult(scalar, matrix)
{
	return [scaVecMult(scalar, matrix[0]),
		    scaVecMult(scalar, matrix[1]),
		    scaVecMult(scalar, matrix[2]),
		    scaVecMult(scalar, matrix[3])];
}

function matMatAdd(matrixA, matrixB)
{
	return [vecVecAdd(matrixA[0], matrixB[0]),
		    vecVecAdd(matrixA[1], matrixB[1]),
		    vecVecAdd(matrixA[2], matrixB[2]),
		    vecVecAdd(matrixA[3], matrixB[3])];
}

function matMatSub(matrixA, matrixB)
{
	return [vecVecSub(matrixA[0], matrixB[0]),
		    vecVecSub(matrixA[1], matrixB[1]),
		    vecVecSub(matrixA[2], matrixB[2]),
		    vecVecSub(matrixA[3], matrixB[3])];
}

function matVecMult(matrix, vector)
{
	
	return vecVecAdd(vecVecAdd(scaVecMult(vector[0], matrix[0]), scaVecMult(vector[1], matrix[1])), vecVecAdd(scaVecMult(vector[2], matrix[2]), scaVecMult(vector[3], matrix[3])));
}

function matMatMult(matrixA, matrixB)
{
	return [matVecMult(matrixA, matrixB[0]),
		    matVecMult(matrixA, matrixB[1]),
		    matVecMult(matrixA, matrixB[2]),
		    matVecMult(matrixA, matrixB[3])];
}

function transMat(matrix)
{
	return [[matrix[0][0], matrix[1][0], matrix[2][0], matrix[3][0]],
			[matrix[0][1], matrix[1][1], matrix[2][1], matrix[3][1]],
			[matrix[0][2], matrix[1][2], matrix[2][2], matrix[3][2]],
			[matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]]];
}

function inverMat(matrix)
{
	//Steps:
	// calc matrix of minor of A
	var mat_minor = [[0, 0, 0, 0],
					 [0, 0, 0, 0],
					 [0, 0, 0, 0],
					 [0, 0, 0, 0]];

	//m 0,0
	mat_minor[0][0] = deterOf3x3([[matrix[1][1], matrix[1][2], matrix[1][3]],
					              [matrix[2][1], matrix[2][2], matrix[2][3]],
					              [matrix[3][1], matrix[3][2], matrix[3][3]]]);
	//m 1,0
	mat_minor[0][1] = deterOf3x3([[matrix[1][0], matrix[1][2], matrix[1][3]],
					              [matrix[2][0], matrix[2][2], matrix[2][3]],
					              [matrix[3][0], matrix[3][2], matrix[3][3]]]);
	//m 2,0
	mat_minor[0][2] = deterOf3x3([[matrix[1][0], matrix[1][1], matrix[1][3]],
					              [matrix[2][0], matrix[2][1], matrix[2][3]],
					              [matrix[3][0], matrix[3][1], matrix[3][3]]]);
	//m 3,0
	mat_minor[0][3] = deterOf3x3([[matrix[1][0], matrix[1][1], matrix[1][2]],
					              [matrix[2][0], matrix[2][1], matrix[2][2]],
					              [matrix[3][0], matrix[3][1], matrix[3][2]]]);
	//m 0,1
	mat_minor[1][0] = deterOf3x3([[matrix[0][1], matrix[0][2], matrix[0][3]],
					              [matrix[2][1], matrix[2][2], matrix[2][3]],
					              [matrix[3][1], matrix[3][2], matrix[3][3]]]);
	//m 1,1
	mat_minor[1][1] = deterOf3x3([[matrix[0][0], matrix[0][2], matrix[0][3]],
					              [matrix[2][0], matrix[2][2], matrix[2][3]],
					              [matrix[3][0], matrix[3][2], matrix[3][3]]]);
	//m 2,1
	mat_minor[1][2] = deterOf3x3([[matrix[0][0], matrix[0][1], matrix[0][3]],
					              [matrix[2][0], matrix[2][1], matrix[2][3]],
					              [matrix[3][0], matrix[3][1], matrix[3][3]]]);
	//m 3,1
	mat_minor[1][3] = deterOf3x3([[matrix[0][0], matrix[0][1], matrix[0][2]],
					              [matrix[2][0], matrix[2][1], matrix[2][2]],
					              [matrix[3][0], matrix[3][1], matrix[3][2]]]);
	//m 0,2
	mat_minor[2][0] = deterOf3x3([[matrix[0][1], matrix[0][2], matrix[0][3]],
					              [matrix[1][1], matrix[1][2], matrix[1][3]],
					              [matrix[3][1], matrix[3][2], matrix[3][3]]]);
	//m 1,2
	mat_minor[2][1] = deterOf3x3([[matrix[0][0], matrix[0][2], matrix[0][3]],
					              [matrix[1][0], matrix[1][2], matrix[1][3]],
					              [matrix[3][0], matrix[3][2], matrix[3][3]]]);
	//m 2,2
	mat_minor[2][2] = deterOf3x3([[matrix[0][0], matrix[0][1], matrix[0][3]],
					              [matrix[1][0], matrix[1][1], matrix[1][3]],
					              [matrix[3][0], matrix[3][1], matrix[3][3]]]);
	//m 3,2
	mat_minor[2][3] = deterOf3x3([[matrix[0][0], matrix[0][1], matrix[0][2]],
					              [matrix[1][0], matrix[1][1], matrix[1][2]],
					              [matrix[3][0], matrix[3][1], matrix[3][2]]]);
	//m 0,3
	mat_minor[3][0] = deterOf3x3([[matrix[0][1], matrix[0][2], matrix[0][3]],
					              [matrix[1][1], matrix[1][2], matrix[1][3]],
					              [matrix[2][1], matrix[2][2], matrix[2][3]]]);
	//m 1,3
	mat_minor[3][1] = deterOf3x3([[matrix[0][0], matrix[0][2], matrix[0][3]],
					              [matrix[1][0], matrix[1][2], matrix[1][3]],
					              [matrix[2][0], matrix[2][2], matrix[2][3]]]);
	//m 2,3
	mat_minor[3][2] = deterOf3x3([[matrix[0][0], matrix[0][1], matrix[0][3]],
					              [matrix[1][0], matrix[1][1], matrix[1][3]],
					              [matrix[2][0], matrix[2][1], matrix[2][3]]]);
	//m 3,3
	mat_minor[3][3] = deterOf3x3([[matrix[0][0], matrix[0][1], matrix[0][2]],
					              [matrix[1][0], matrix[1][1], matrix[1][2]],
					              [matrix[2][0], matrix[2][1], matrix[2][2]]]);

	//console.log("mat_minor");
	//printMat(mat_minor);

	// turn matrix of minor of A into matrix of cofactor
	var mat_cofac = [[mat_minor[0][0]*1, mat_minor[0][1]*-1, mat_minor[0][2]*1, mat_minor[0][3]*-1],
					 [mat_minor[1][0]*-1, mat_minor[1][1]*1, mat_minor[1][2]*-1, mat_minor[1][3]*1],
					 [mat_minor[2][0]*1, mat_minor[2][1]*-1, mat_minor[2][2]*1, mat_minor[2][3]*-1],
					 [mat_minor[3][0]*-1, mat_minor[3][1]*1, mat_minor[3][2]*-1, mat_minor[3][3]*1]]

	// transpose result of previous step
	var mat_trans = transMat(mat_cofac);

	//console.log("mat_trans");
	//printMat(mat_trans);

	// multiple result of previous step by 1/determinant of A
	// found with https://semath.info/src/inverse-cofactor-ex4.html
	var deter =   matrix[0][0]*(matrix[1][1]*matrix[2][2]*matrix[3][3]
							  + matrix[1][2]*matrix[2][3]*matrix[3][1]
							  + matrix[1][3]*matrix[2][1]*matrix[3][2]
							  - matrix[1][3]*matrix[2][2]*matrix[3][1]
							  - matrix[1][2]*matrix[2][1]*matrix[3][3]
							  - matrix[1][1]*matrix[2][3]*matrix[3][2])
				- matrix[1][0]*(matrix[0][1]*matrix[2][2]*matrix[3][3]
							  + matrix[0][2]*matrix[2][3]*matrix[3][1]
							  + matrix[0][3]*matrix[2][1]*matrix[3][2]
							  - matrix[0][3]*matrix[2][2]*matrix[3][1]
							  - matrix[0][2]*matrix[2][1]*matrix[3][3]
							  - matrix[0][1]*matrix[2][3]*matrix[3][2])
				+ matrix[2][0]*(matrix[0][1]*matrix[1][2]*matrix[3][3]
							  + matrix[0][2]*matrix[1][3]*matrix[3][1]
							  + matrix[0][3]*matrix[1][1]*matrix[3][2]
							  - matrix[0][3]*matrix[1][2]*matrix[3][1]
							  - matrix[0][2]*matrix[1][1]*matrix[3][3]
							  - matrix[0][1]*matrix[1][3]*matrix[3][2])
				- matrix[3][0]*(matrix[0][1]*matrix[1][2]*matrix[2][3]
							  + matrix[0][2]*matrix[1][3]*matrix[2][1]
							  + matrix[0][3]*matrix[1][1]*matrix[2][2]
							  - matrix[0][3]*matrix[1][2]*matrix[2][1]
							  - matrix[0][2]*matrix[1][1]*matrix[2][3]
							  - matrix[0][1]*matrix[1][3]*matrix[2][2]);

	//console.log("deter = "+deter);

	//console.log("Inverse:");
	if (deter == 0)
		return scaMatMult(1, mat_trans);
	else
		return scaMatMult(1/deter, mat_trans);
}

function deterOf3x3(matrixD)
{
	//console.log("    ");
	for (var i=0; i<3; i++)
	{
		//console.log(matrixD[i][0]+", "+matrixD[i][1]+", "+matrixD[i][2]);
	}

	var division1 = matrixD[1][0]/matrixD[0][0];
	if (matrixD[0][0] == 0)
		division1 = matrixD[1][0];

	var division2 = matrixD[2][0]/matrixD[0][0];
	if (matrixD[0][0] == 0)
		division2 = matrixD[2][0];

	var result = [[matrixD[0][0], matrixD[0][1], matrixD[0][2]],
				  [matrixD[1][0]-(division1*matrixD[0][0]), matrixD[1][1]-(division1*matrixD[0][1]), matrixD[1][2]-(division1*matrixD[0][2])],
				  [matrixD[2][0]-(division2*matrixD[0][0]), matrixD[2][1]-(division2*matrixD[0][1]), matrixD[2][2]-(division2*matrixD[0][2])]];

	if (isNaN(matrixD[0][0] * ((result[1][1]*result[2][2])-(result[2][1]*result[1][2]))))
	{
		//console.log("Returning = "+(matrix[0][0] * ((result[1][1]*result[2][2])-(result[2][1]*result[1][2]))));
		//console.log("Was NaN");
		//console.log("Below is input matrix");
		//for (var i=0; i<3; i++)
		//{
			//console.log(matrixD[i][0]+", "+matrixD[i][1]+", "+matrixD[i][2]);
		//}
		//console.log("matrixD[0][0] = "+matrixD[0][0]);
		//console.log("Below is result");
		//console.log(result[0][0]+", "+result[0][1]+", "+result[0][2]);
		//console.log(result[1][0]+", "+result[1][1]+", "+result[1][2]);
		//console.log(result[2][0]+", "+result[2][1]+", "+result[2][2]);
	}
	//console.log("returning = "+(matrixD[0][0] * ((result[1][1]*result[2][2])-(result[2][1]*result[1][2]))));
	
	var a_2x2 = [[matrixD[1][1], matrixD[1][2]]
			    ,[matrixD[2][1], matrixD[2][2]]];

	var b_2x2 = [[matrixD[1][0], matrixD[1][2]]
			    ,[matrixD[2][0], matrixD[2][2]]];

	var c_2x2 = [[matrixD[1][0], matrixD[1][1]]
			    ,[matrixD[2][0], matrixD[2][1]]];    

	var hmm = (matrixD[0][0]*deterOf2x2(a_2x2)) - (matrixD[0][1]*deterOf2x2(b_2x2)) + (matrixD[0][2]*deterOf2x2(c_2x2));

	//console.log("OR return = "+hmm);
	
	return hmm;



}

function deterOf2x2(matrixD2)
{
	return (matrixD2[0][0]*matrixD2[1][1]) - (matrixD2[0][1]*matrixD2[1][0]);
}

/* to1DF32Array(a2DArray)
 *
 * This function turns an array of 4-element arrays a2DArray into a packed
 * 1-dimensional array of 32-bit floating-point numbers.
 */
function to1DF32Array(a2DArray)
{
    var size = a2DArray.length;

    if(size == 0)
    {
        console.log("[alib/to1DF32Array - DEBUG]: size is 0");
        return new Float32Array([]);
    }

    // Turn 2D array into 1D array
    
    var result = [];
    var index = 0;

    for(var i = 0; i < size; i++)
    {
        var anElement = a2DArray[i];
        
        if(anElement.length != 4)
            console.log("[laib/to1DF32Array - ERROR]: Not a 4-element vector");
        
        result[index] = anElement[0];
        result[index + 1] = anElement[1];
        result[index + 2] = anElement[2];
        result[index + 3] = anElement[3];
        index += 4;
    }

    var arr = new Float32Array(result);
    //console.log("arr.length = "+arr.length);
    //console.log("a2DArray total length = "+(a2DArray.length*a2DArray[0].length));

    return arr;
}
