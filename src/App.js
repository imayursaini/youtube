import "./App.css";
import React, { useState } from "react";
import NavBar from "./components/NavBar";
import VideoList from "./components/VideoList";
import LoadingBar from 'react-top-loading-bar'

function App() {
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = (value) => {
    if (value !== null) {
      console.log(value);
      setQuery(value);
    }
  };

  return (
    <div className="app">
      <NavBar onSubmit={handleSubmit} />
      <LoadingBar
        color='#f11946'
        progress={progress}
      />
      <VideoList query={query} progress={setProgress}/>
    </div>
  );
}

export default App;

