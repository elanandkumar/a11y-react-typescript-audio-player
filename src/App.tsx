import React from "react";
import AudioPlayer from "./components/audio-player";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Accessible Audio Player - React</h2>
      </header>
      <AudioPlayer
        path="https://cdn.atrera.com/audio/Marcel_Pequel_-_01_-_One.mp3"
        image="https://cdn.atrera.com/images/cover_yz2mak.jpg"
      />
    </div>
  );
};

export default App;
