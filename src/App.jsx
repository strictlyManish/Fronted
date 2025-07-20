import Nav from "./components/Nav";
import WebcamMoodDetector from "./components/WebcamMoodDetector";
import Track from "./components/Track";
import { useState } from "react";
function App() {
  const [songs, setsongs] = useState([]);

  return (
    <div className="min-h-screen bg-gray-800 text-white px-4 sm:px-6 md:px-10 py-6">
      <Nav />

      <div className="mt-6">
        <WebcamMoodDetector setsongs={setsongs} />
      </div>

      <div className="mt-10">
        <Track song={songs} setsongs={setsongs} />
      </div>
    </div>
  );
}

export default App;
