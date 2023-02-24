import React from "react";
import { createRoot } from "react-dom/client";

import Main from "./components/Main";
import "./index.css";

function App() {
  return <Main />;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
