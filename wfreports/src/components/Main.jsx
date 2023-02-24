import React, { Component } from "react";
import { Routes, Route, NavLink, HashRouter } from "react-router-dom";
import Home from "./Home";
import Inbound from "./Inbound";
import Scanning from "./Scanning";

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>Wareflex Lite Reporting Services</h1>
          <ul className="header">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="inbound">Inbound</NavLink>
            </li>
            <li>
              <NavLink to="scanning">Scanning</NavLink>
            </li>
          </ul>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inbound" element={<Inbound />} />
              <Route path="/scanning" element={<Scanning />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;
