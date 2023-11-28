import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css"


const Navbar = () => {
    return (
        <header>
          <div id = "heading">
            <h1>TeX-Solver</h1> 
          </div>
          <div id = "navlinks">
            <Link to ="/">HOME</Link>
            <Link to ="/Matrix_page">MATRICES</Link>
            <Link to ="/Graphs_page">GRAPHS</Link>
          </div>
        </header>
    );
}

export default Navbar;