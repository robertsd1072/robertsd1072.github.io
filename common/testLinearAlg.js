'use strict';

function main()
{
    var vec1 = [10.05, 72.63, -82.17, -81.15];
    var vec2 = [-78.40, -22.40, 89.17, -71.11];
    var mat1 = [
    	[-47.28, -15.54, 50.58, -75.31],
    	[-24.87, -71.42, -70.05, 66.31],
    	[19.07, -17.87, 4.77, 79.18],
    	[90.39, -44.49, 13.44, 7.29]
    ];;
    var mat2 = [
    	[-28.44, 72.09, 47.66, -82.19],
    	[94.60, -66.39, 11.38, 67.11],
    	[64.76, 97.18, -34.10, 59.25],
    	[17.61, 81.95, 91.14, 92.48]
    ];
    var scal = -85.64;

    console.log("Vector v1:");
    printVec(vec1);
    console.log("Vector v2:");
    printVec(vec2);
    console.log("Scalar s: "+scal);
    console.log("s * v1:");
    printVec(scaVecMult(scal, vec1));
    console.log("v1 + v2:");
    printVec(vecVecAdd(vec1, vec2));
    console.log("v1 - v2:");
	printVec(vecVecSub(vec1, vec2));
    console.log("|v1| (magnitude): "+magOfFVec(vec1));
    console.log("Normalized v1:");
    printVec(normVec(vec1));
    console.log("v1 . v2 (dot product):");
    console.log(dotPro(vec1, vec2));
    console.log("v1 x v2 (cross product):");
    printVec(croPro(vec1, vec2));
    console.log("");
    console.log("Matrix m1:");
    printMat(mat1);
    console.log("Matrix m2:");
    printMat(mat2);
    console.log("s * m1:");
    printMat(scaMatMult(scal, mat1));
    console.log("m1 + m2:");
    printMat(matMatAdd(mat1, mat2));
    console.log("m1 - m2:");
	printMat(matMatSub(mat1, mat2));
    console.log("m1 * m2:");
    printMat(matMatMult(mat1, mat2));
    console.log("m1^T (transpose):");
    printMat(transMat(mat1));
    console.log("m1^{-1} (inverse):");
    printMat(inverMat(mat1));
    console.log("m1 * m1^{-1}:");
    printMat(matMatMult(mat1, inverMat(mat1)));
    console.log("m1^{-1} * m1:");
    printMat(matMatMult(inverMat(mat1), mat1));
}