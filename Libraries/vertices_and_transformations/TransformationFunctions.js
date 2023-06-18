'use strict';

function translate_mat(trans_x, trans_y, trans_z)
{
	return [[1, 0, 0, 0]
		   ,[0, 1, 0, 0]
		   ,[0, 0, 1, 0]
		   ,[trans_x, trans_y, trans_z, 1]];
}

function rotate_mat(rotat_x, rotat_y, rotat_z)
{
	var x = rotat_x * (Math.PI/180);
	var y = rotat_y * (Math.PI/180);
	var z = rotat_z * (Math.PI/180);

	var mat_x = [[1, 0, 0, 0]
				,[0, Math.cos(x), Math.sin(x)*-1, 0]
				,[0, Math.sin(x), Math.cos(x), 0]
				,[0, 0, 0, 1]];

	var mat_y = [[Math.cos(y), 0, Math.sin(y), 0]
				,[0, 1, 0, 0]
				,[Math.sin(y)*-1, 0, Math.cos(y), 0]
				,[0, 0, 0, 1]];

	var mat_z = [[Math.cos(z), Math.sin(z)*-1, 0, 0]
				,[Math.sin(z), Math.cos(z), 0, 0]
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

function copy_mat(matrix)
{
	var new_mat = [[matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3]]
				  ,[matrix[1][0], matrix[1][1], matrix[1][2], matrix[1][3]]
				  ,[matrix[2][0], matrix[2][1], matrix[2][2], matrix[2][3]]
				  ,[matrix[3][0], matrix[3][1], matrix[3][2], matrix[3][3]]];

	return new_mat;
}

function compare_mat(mat_1, mat_2)
{
	for (var i=0; i<4; i++)
	{
		for (var j=0; j<4; j++)
		{
			if (mat_2[i][j].toFixed(4) == 0)
			{
				if (Math.abs(mat_1[i][j].toFixed(4)) != mat_2[i][j].toFixed(4))
					return false;
			}
			else if (mat_1[i][j].toFixed(4) != mat_2[i][j].toFixed(4))
				return false;
		}
	}

	return true;
}