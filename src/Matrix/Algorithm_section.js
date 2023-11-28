import * as React from 'react';
import * as _ from 'lodash';
import { string, to } from 'mathjs';
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'
import "./Algorithm_section.css"
import 'tippy.js/dist/tippy.css';
import copy_logo from "./copy_logo.png"

var Fraction = require('fractional').Fraction

function matrix_string(matrix) {
    var main_str = "\\left[\n\\begin{array}{" + "c".repeat(matrix[0].length-1) + "|c}\n"
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[0].length; c++) {
            var result = matrix[r][c]
            if (typeof result == "number") {
                result = new Fraction(result)
            }
            if (result.denominator == 1 || result.numerator == 0) {
                main_str += string(result.numerator)
            }
            else {
                main_str += "\\frac{" + string(result.numerator) + "}{" + string(result.denominator) + "}"
            }
            if (c != matrix[0].length-1) {
                main_str += " & "
            }
        }
        if (r != matrix.length-1) {
            main_str += " \\\\"
        }
        main_str += " \n"
    }
    main_str += "\\end{array}\n\\right]\n"
    return main_str
}

function row_operation_string(operation) {
    var main_str = matrix_string(operation.M_prev) + "\\xrightarrow[]{"
    if (operation.type == "ra") {
        main_str += "\\textbf{r}_" + string(operation.j+1)  + " \\to " 
        main_str += "\\textbf{r}_" + string(operation.j+1) + " " 
        var m = operation.m
        if (m.numerator < 0) {
            if (m.denominator == 1) {
                main_str += string(m.numerator) + " \\cdot \\textbf{r}_" + string(operation.i+1)
            }
            else {
                main_str += "\\frac{" + string(m.numerator) + "}{" + string(m.denominator) + " } \\cdot \\textbf{r}_" + string(operation.i+1)
            }
        } 
        else {
            if (m.denominator == 1) {
                main_str += "+" + string(operation.m) + " \\cdot \\textbf{r}_" + string(operation.i+1)
            }
            else {
                main_str += "+ \\frac{" + string(m.numerator) + "}{" + string(m.denominator) + " } \\cdot \\textbf{r}_" + string(operation.i+1)
            }
        }
    }
    if (operation.type == "ri") {
        main_str += "\\textbf{r}_" + string(operation.i+1) + " \\leftrightarrow " + "\\textbf{r}_" + string(operation.j+1)
    }
    if (operation.type == "rs") {
        main_str += "\\textbf{r}_" + string(operation.i+1)  + " \\to " 
        var m = operation.m
        if (m.numerator < 0) {
            if (m.denominator == 1) {
                main_str += string(m.numerator) + " \\cdot \\textbf{r}_" + string(operation.i+1)
            }
            else {
                main_str += "\\frac{" + string(m.numerator) + "}{" + string(m.denominator) + " } \\cdot \\textbf{r}_" + string(operation.i+1)
            }
        } 
        else {
            if (m.denominator == 1) {
                main_str += string(operation.m) + " \\cdot \\textbf{r}_" + string(operation.i+1)
            }
            else {
                main_str += "\\frac{" + string(m.numerator) + "}{" + string(m.denominator) + " } \\cdot \\textbf{r}_" + string(operation.i+1)
            }
        }
    }
    main_str += "}" + matrix_string(operation.M_after)
    return main_str
}

function GenerateLatexCode(operations) {
    var latex_code = "$\n"
    for (let o = 0; o < operations.length; o++) {
        latex_code += row_operation_string(operations[o])
        if (o != operations.length-1) {
            latex_code += "\\\\ \n"
        }
    }
    latex_code += "$"
    return latex_code
}

//Not to be confused with the "./GenerateMatrix.js"
function GenerateMatrix(props){

    return (
        <table>
        <tbody>
            {props.algoMatrix.map((array,i) => <tr key = {`row${i}`}>
                {array.map((e,j) => <td className = {j == array.length-1 ? "r_vec" : "std_vec"}key = {`e${i}${j}`}>
                    <input                   
                    value = 
                    {
                        Math.abs(props.algoMatrix[i][j].numerator) > props.algoMatrix[i][j].denominator && 
                        props.algoMatrix[i][j].numerator % props.algoMatrix[i][j].denominator != 0 ?
                        string(props.algoMatrix[i][j].numerator) + "/" + string(props.algoMatrix[i][j].denominator) :
                        string(props.algoMatrix[i][j])
                    } readOnly
                    />
                </td>)}
            </tr>)}
        </tbody>
        </table>

    )
}


function AlgoSection(props) {

    var latexCode = GenerateLatexCode(props.algoInfo[1])
    
    return (
        <div id = "Calculation">
            <GenerateMatrix algoMatrix = {props.algoInfo[0]}/>
            <div id = "TexCode" title = "Copy LaTex code to clipboard by click" onClick={() => {navigator.clipboard.writeText("%\\usepackage{amsmath}%\n" + latexCode)}}>
                <Latex>{latexCode}</Latex>
            </div>
            <img src = {copy_logo} title = "Copy LaTex code to clipboard by click" onClick={() => {navigator.clipboard.writeText("%\\usepackage{amsmath}%\n" + latexCode)}}></img>
        </div>
    )
}

export default AlgoSection