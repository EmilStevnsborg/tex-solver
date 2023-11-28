import React, { Component } from 'react'
import Navbar from '../Navbar.js';
import "./Home.css"
import Footer from '../Footer.js';
import { init } from 'ityped'


export default class Home extends Component {
    componentDidMount() {
      const myElement = document.querySelector("#Intro");
      init(myElement, {
        typeSpeed: 100,
        loop: false,
        showCursor: false,
        strings: ["Welcome to \\url{https://tex-solver.com}"]
      });
    }
    render () {
      return (
      <div id = "Main">
        <Navbar id = "SpecialNav"/>
        <p id = "Intro"></p>
        <Footer/>
      </div>
      )
    };
  }
  
