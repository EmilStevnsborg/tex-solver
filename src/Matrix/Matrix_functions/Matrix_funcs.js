import React, { useState, useEffect } from 'react';
import * as _ from 'lodash'; 

// Return values for all functions #Functional programming
// NOTES
// Create fractional arithmetic

var Fraction = require('fractional').Fraction

class MatrixFunctions {
    constructor() {}

        tolerance = 0.00001

        //prints matrix
        print_matrix(matrix) {
            for (let r = 0; r < matrix.length; r++) {
                console.log(matrix[r])
            }
        }

        //converts values to fracs
        fractionize_matrix(matrix) {
            var newMatrix = _.cloneDeep(matrix)
            // console.log(typeof (new Fraction(0.4)))
            for (let r = 0; r < newMatrix.length; r++) {
                for (let c = 0; c < newMatrix[0].length; c++) {
                    if (typeof newMatrix[r][c] != "object") {
                        newMatrix[r][c] = new Fraction(newMatrix[r][c])
                    }
                }
            }
            return newMatrix
        }

        //returns scaled row of matrix
        row_scale(matrix, i, m) {
            var row = _.cloneDeep(matrix[i])
            for (let c = 0; c < row.length; c++) {
                row[c] = row[c].multiply(m)
            }
            return row
        }
        
        //adds sclaed row to another row
        row_addition(matrix, i, j, m, count) {
            var newMatrix = _.cloneDeep(matrix)
            var row = _.cloneDeep(this.row_scale(matrix,i,m))
            for (let c = 0; c < row.length; c++) {
                newMatrix[j][c] = newMatrix[j][c].add(row[c])
            }
            var instr = {type: "ra", M_prev : _.cloneDeep(matrix), M_after: _.cloneDeep(newMatrix), i:i+count, j:j+count, m:m}
            return [newMatrix, instr]
        }
        
        //swaps two rows
        row_interchange(matrix, i, j) {
            var newMatrix = _.cloneDeep(matrix)
            newMatrix[i] = matrix[j]
            newMatrix[j] = matrix[i]
            
            var instr = {type: "ri", M_prev : _.cloneDeep(matrix), M_after: _.cloneDeep(newMatrix), i:i, j:j}
            return [newMatrix, instr]
        }

        //creates a submatrix from i, j and down
        sub_matrix(matrix, i, j) {
            return matrix.slice(i).map(column => column.slice(j))
        }

        //adds submatrix from down or upwards
        add_submatrix(matrix, submatrix, up) {
            var newMatrix = _.cloneDeep(matrix)
            var cloneSubMatrix = _.cloneDeep(submatrix)
            //forward reduct
            if (!up) {
                var r = newMatrix.length - cloneSubMatrix.length
                var c = newMatrix[0].length - cloneSubMatrix[0].length
                for (let i = r; i < newMatrix.length; i++) {
                    for (let j = c; j < newMatrix[0].length; j++) {
                        newMatrix[i][j] = cloneSubMatrix[i-r][j-c]
                    }
                }
            }
            else {
                for (let i = 0; i < cloneSubMatrix.length; i++) {
                    for (let j = 0; j < cloneSubMatrix[0].length; j++) {
                        newMatrix[i][j] = cloneSubMatrix[i][j]
                    }
                }
            }

            return newMatrix
        } 

        //correct
        find_pivot_row(array) {
            var found = false
            var row = 0
            while (!found && (row <= array.length-1)) {
                var val = array[row]
                if (val.numerator/val.denominator > this.tolerance || val.numerator/val.denominator < - this.tolerance) {
                    found = true
                } 
                else {
                    row += 1
                }
            }
            if (found) {
                return row
            }
            else {
                return -1
            }
        }

        // Might already be in fw in second if statement: Pretty certain already
        normalise_matrix(matrix, pivot) {
            var exit = false
            var r = pivot[0]+1
            var curr_temp = pivot[0]+1
            while (!exit && r < matrix.length) {
                if (matrix[r][pivot[1]] < - this.tolerance || matrix[r][pivot[1]] > this.tolerance) {
                    exit = true
                }
                else {
                    r+=1
                }
            }
            if (r != curr_temp) {
                var newMatrix = _.cloneDeep(this.row_interchange(matrix, r, curr_temp))
                return newMatrix
            }
            else {
                return _.cloneDeep(matrix)
            }

        }

        //correct
        find_pivot_element(matrix) {
            var column = 0
            var row = -1
            var found = false
            while (!found && column <= matrix[0].length-1) {
                var row_idx = this.find_pivot_row(matrix.map(i => i[column]))
                if (row_idx > -1) {
                    found = true
                    row = row_idx
                }
                else {
                    column += 1
                }
            }
            if (found) {
                return [row,column]
            }
            else {
                return -1
            }
        }

        //correct
        remove_below_pivot(matrix, count) { //matrix has pivot at [0,0]
            var pivot = matrix[0][0]
            var newMatrix = _.cloneDeep(matrix)
            var instructions = []
            for (let r = 1; r < matrix.length; r++) {
                var m = (matrix[r][0].divide(pivot)).multiply(new Fraction (-1,1))
                if (m.numerator/m.denominator < -this.tolerance || m.numerator/m.denominator > this.tolerance) {
                    var info = this.row_addition(newMatrix,0,r,m,count)
                    newMatrix = info[0]
                    instructions = instructions.concat(info[1])
                }
            }
            return [newMatrix, instructions]
        }

        remove_above_pivot(matrix, pivot) { //pivot is now index of pivot element
            var newMatrix = _.cloneDeep(matrix)
            var instructions = []
            var k = (new Fraction(1)).divide(newMatrix[pivot[0]][pivot[1]])
            if (!(k.numerator == 1 && k.denominator == 1)) {                
                for (let c = pivot[1]; c < newMatrix[0].length-1; c++) {
                    newMatrix[pivot[0]][c] = newMatrix[pivot[0]][c].multiply(k)
                }
                instructions = instructions.concat({type: "rs", M_prev : _.cloneDeep(matrix), M_after: _.cloneDeep(newMatrix), i:pivot[0], m:k})            
            }

            for (let r = pivot[0]-1; r >= 0; r--) {
                var m = (newMatrix[r][pivot[1]].divide(newMatrix[pivot[0]][pivot[1]])).multiply(new Fraction (-1,1))
                if (m.numerator/m.denominator < -this.tolerance || m.numerator/m.denominator > this.tolerance) {
                    var info = this.row_addition(newMatrix, pivot[0],r, m, 0)
                    newMatrix = info[0]
                    instructions = instructions.concat(info[1])
                }
            }
            return [newMatrix, instructions]
        }

        //correct
        forward_reduction(matrix, count) {
            var newMatrix = _.cloneDeep(matrix)
            var instructions = []
            var n_rows = matrix.length
            var m_cols = matrix[0].length
            var dims = this.find_pivot_element(matrix)
            var pivot_elements = []
            if (!(dims == -1) && (n_rows >= 1 || m_cols >= 1)) {
                var [i,j] = dims
                if (i != 0) {
                    var info = this.row_interchange(matrix,0,i)
                    newMatrix = info[0]
                    instructions = instructions.concat(info[1])
                    i = 0
                }
                if (i < n_rows-1 && j < m_cols-1) {
                    var info = this.remove_below_pivot(newMatrix, count)
                    newMatrix = info[0]
                    instructions = instructions.concat(info[1])

                    if (m_cols > 2) {
                        var sub_matrix = this.sub_matrix(newMatrix,i+1,j+1)
    
                        var [temp, instr, piv] = this.forward_reduction(sub_matrix, count + 1)
                        pivot_elements = piv
                        instructions = instructions.concat(instr)
                        newMatrix = this.add_submatrix(newMatrix,temp, false)   
                    }
                }
                pivot_elements.push([i+count,j+count])
            }
            if (instructions.length != 0) {
                instructions[0].M_prev = this.add_submatrix(_.clone(matrix), instructions[0].M_prev, false)
                instructions[0].M_after = this.add_submatrix(instructions[0].M_prev, instructions[0].M_after, false)
                for (let instr_i = 1; instr_i < instructions.length; instr_i++) {
                    instructions[instr_i].M_prev = this.add_submatrix(instructions[instr_i-1].M_after, instructions[instr_i].M_prev, false)
                    instructions[instr_i].M_after = this.add_submatrix(instructions[instr_i].M_prev, instructions[instr_i].M_after, false)
                }
            }
            return [newMatrix, instructions, pivot_elements]
        }

        //correct
        backward_reduction(matrix, pivot_elements) {
            var newMatrix = _.cloneDeep(matrix)
            var instructions = []
            for (let p_idx = 0; p_idx < pivot_elements.length; p_idx++) {
                var info = this.remove_above_pivot(newMatrix, pivot_elements[p_idx])
                newMatrix = info[0]
                instructions = instructions.concat(info[1])
            }
            return [newMatrix, instructions]
        }

        //correct
        gauss_jordan(matrix) {
            var temp = this.fractionize_matrix(_.cloneDeep(matrix))
            var [newMatrix, instructions, pivots] = this.forward_reduction(temp,0)
            var info = this.backward_reduction(newMatrix, pivots)
            newMatrix = info[0]
            instructions = instructions.concat(info[1])
            return [newMatrix, instructions]
        }
    
}

const MatrixFuncs = new MatrixFunctions()

export default MatrixFuncs