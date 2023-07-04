import "./App.css";
import React, { useState } from "react";
import NavBar from "./components/NavBar";
import VideoList from "./components/VideoList";

function App() {
  const [query, setQuery] = useState("");
  const handleSubmit = (value) => {
    console.log(value);
    setQuery(value)
  };

  return (
    <div className="app">
      <NavBar onSubmit={handleSubmit} />
      <VideoList query={query} />
    </div>
  );
}

export default App;

