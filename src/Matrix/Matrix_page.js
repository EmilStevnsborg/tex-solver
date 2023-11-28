import React, { useState, useEffect } from 'react';
import Navbar from './../Navbar.js';
import DimSelector from "./dimensionSelection.js"
import GenerateMatrix from './GenMatrix.js';
import AlgoSection from './Algorithm_section.js';
import * as _ from 'lodash'; 
import MatrixFuncs from '././Matrix_functions/Matrix_funcs.js'
import './Matrix_page.css'
import Footer from '../Footer.js';


var Fraction = require('fractional').Fraction

//  NOTES //
//  


function get_original(matrices, name) {
  let matrix = matrices.filter(value => value.Name == name)[0].Array
  return matrix
}

function modify_dims_matrix(matrix, new_dims) {
  let new_matrix = new Array(new_dims[0]).fill(0).map(() => new Array(new_dims[1]).fill(0));
  for (let i = 0; i < new_matrix.length; i++) {
    for (let j = 0; j < new_matrix[i].length; j ++) {
      
      if (i < matrix.length && j < matrix[0].length) {
        new_matrix[i][j] = matrix[i][j]
      }
      else {
        new_matrix[i][j] = 0
      }
    }
  }

  return new_matrix
}

function update_matrices(matrices, matrix_dict) {
  let new_matrices = _.cloneDeep(matrices)
  let idx = matrices.findIndex(value => value.Name == matrix_dict.Name)
  new_matrices[idx] = matrix_dict
  return new_matrices
}


function Matrix_page(props) {

  const [currentMat, setCurrentMat] = useState(props.matrices[0].Name)

  const [tempMatrix, setTempMatrix] = useState(get_original(props.matrices, currentMat)) //Use this for display

  const [rows, setRows] = useState(tempMatrix.length)
  const [columns, setColumns] = useState(tempMatrix[0].length)
  
  const [currentAlgoMat, setCurrentAlgoMat] = useState(currentMat)

  const [computation, setComputation] = useState(() => x => MatrixFuncs.gauss_jordan(x))
  const [algoInfo, setAlgoInfo] = useState([[],[]])

  useEffect(() => {
    setTempMatrix(get_original(props.matrices, currentMat))
  }, [get_original(props.matrices, currentMat)])

  useEffect (() => {
    setRows(get_original(props.matrices, currentMat).length)
    setColumns(get_original(props.matrices, currentMat)[0].length)
  }, [get_original(props.matrices, currentMat)])

  useEffect(() => {
    setTempMatrix(modify_dims_matrix(tempMatrix, [rows, columns]))
  }, [rows, columns])


  return (
    <div className="Matrix_page">
        <Navbar/>
        <div id = "MetaTop" className = "Meta">
          <div className = "Selection">
              <button id = {currentMat == "A" ? "SelectedMat" : "Default"} onClick = {() => {setCurrentMat("A"); setTempMatrix(get_original(props.matrices, currentMat));}}>
                A
              </button>
              <button id = {currentMat == "B" ? "SelectedMat" : "Default"} onClick = {() => {setCurrentMat("B"); setTempMatrix(get_original(props.matrices, currentMat))}}>
                B
              </button>
              <button className = "C" id = {currentMat == "C" ? "SelectedMat" : "Default"} onClick = {() => {setCurrentMat("C"); setTempMatrix(get_original(props.matrices, currentMat))}}>
                C
              </button>
          </div>
          <DimSelector name = {"ROWS"} x = {rows} setX = {setRows}/>
          <DimSelector name = {"COLUMNS"} x = {columns} setX = {setColumns}/>
        </div>
        <GenerateMatrix tempMatrix = {tempMatrix} setTempMatrix = {setTempMatrix}/>
        <div className = "Meta">
          <button className='MetaItem' id = "Cancel"
            onClick={() => 
              {setTempMatrix(get_original(props.matrices, currentMat));
              setRows(get_original(props.matrices, currentMat).length);
              setColumns(get_original(props.matrices, currentMat)[0].length)
              }
          }>
            Cancel</button>
          <button className='MetaItem' id = "Save"
            onClick = {() => 
              {props.setMatrices(update_matrices(props.matrices, {Array : tempMatrix, Name : currentMat}))}
          }>
            Save</button>
          </div>
          <div id = "Computation">
            <p>Computation</p>
            <select id = "computationSelection" onChange = {(e) => 
              {e.target.value == "gj" ? 
               setComputation(() => x => MatrixFuncs.gauss_jordan(x)):
               e.target.value == "fw" ? 
               setComputation(() => x => MatrixFuncs.forward_reduction(MatrixFuncs.fractionize_matrix(x),0).slice(0,2)):
               setComputation(2)}} >
              <option value = "gj">Gauss-Jordan</option>
              <option value = "fw">Forward-Reduction</option>
            </select>
          </div>
          <div id = "CalculationMeta">
            <div className='Selection'>
              <button id = {currentAlgoMat == "A" ? "SelectedMat" : "Default"} onClick = {() => {setCurrentAlgoMat("A")}}>
                A
              </button>
              <button id = {currentAlgoMat == "B" ? "SelectedMat" : "Default"} onClick = {() => {setCurrentAlgoMat("B")}}>
                B
              </button>
              <button className = "C" id = {currentAlgoMat == "C" ? "SelectedMat" : "Default"} onClick = {() => {setCurrentAlgoMat("C")}}>
                C
              </button>
            </div>
            <button id = "CalculateBtn"
              onClick={() => {var m = computation(get_original(props.matrices, currentAlgoMat)); setAlgoInfo(m)}
              }>
                Calculate
            </button>
          </div>
          <div>{algoInfo[0].length != 0 ? <AlgoSection algoInfo = {algoInfo}/> : <div/>}</div>
          <Footer/>
    </div>
  );
  }
  
  export default Matrix_page;