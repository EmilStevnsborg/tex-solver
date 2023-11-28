import React, { useState, useEffect }  from 'react';
import { Router, Routes, Route , Link } from 'react-router-dom';
import Home from "./Home/Home.js"
import Matrix_page from ".//Matrix/Matrix_page.js"
import Graphs_page from './Graphs/Gaphs_page.js';

//matrices: {array_of_arrs, Name}
function Main() {

  const [matrices, setMatrices] = useState([{Array: [[1,3,"7/2"], [0,"1/2",0], ["9/2",0,1]], Name: "A"}, {Array: [[0,0,0], [0,0,0], [0,0,0]], Name: "B"}, {Array: [[1,1,1], [1,1,1], [1,1,1]], Name: "C"}])
  const [test, setTest] = useState(1)

  return (
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/Matrix_page' element={<Matrix_page matrices = {matrices} setMatrices = {setMatrices} test = {test} setTest = {setTest}/>}/>
        <Route exact path='/Graphs_page'element = {<Graphs_page/>}/>
      </Routes>
  );
}

export default Main;