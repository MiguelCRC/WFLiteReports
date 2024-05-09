import React, { Component } from "react";
import { Routes, Route, NavLink, HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Home";
import Esignature from "./Esignature";
import Scanning from "./Scanning";
import LongestTime from "./LongestTime";
import AvgTime from "./AvgTime";

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
              <NavLink to="esignature">E-Signature</NavLink>
            </li>
            <li>
              <NavLink to="scanning">Scanning</NavLink>
            </li>
            <li>
              <NavLink to="longesTime">Longest Time</NavLink>
            </li>
            <li>
              <NavLink to="avgTime">Avg Time</NavLink>
            </li>
          </ul>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/esignature" element={<Esignature />} />
              <Route path="/scanning" element={<Scanning />} />
              <Route path="/longesTime" element={<LongestTime />} />
              <Route path="/avgTime" element={<AvgTime />} />
            </Routes>
          </div>
        </div>
        <ToastContainer
          stacked
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </HashRouter>
    );
  }
}

export default Main;
