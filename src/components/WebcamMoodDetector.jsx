import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const WebcamMoodDetector = ({ setsongs }) => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const [mood, setMood] = useState("Not started");
  const [detecting, setDetecting] = useState(false);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Webcam access error:", err);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startDetection = async () => {
    if (!detecting) {
      await loadModels();
      await startWebcam();

      setDetecting(true);
      setMood("Detecting...");

      intervalRef.current = setInterval(async () => {
        if (!videoRef.current) return;

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (detections.length > 0) {
          const expressions = detections[0].expressions;
          const topMood = Object.entries(expressions).reduce((a, b) =>
            a[1] > b[1] ? a : b
          );
          const detectedMood = topMood[0];

          setMood(detectedMood);

          try {
            const res = await axios.get(
              `http://localhost:3000/songs?mood=${detectedMood}`
            );
            setsongs(res.data.data || [])
          } catch (err) {
            console.error("API Error:", err);
          }
        }
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
      stopWebcam();
      setMood("Detection Stopped");
      setDetecting(false);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearInterval(intervalRef.current);
      stopWebcam();
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 mt-10 px-4">
      <h2 className="text-2xl font-bold text-center md:text-left">
        Live Mood Detection
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <video
          ref={videoRef}
          autoPlay
          muted
          width="370"
          height="260"
          className="object-cover rounded-md max-w-full"
          poster="/images/poset.jpeg"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <h2 className="text-xl font-semibold">Live Mood Detection</h2>
          <p className="text-sm text-gray-300">
            Your current mood is being analyzed in real-time. Enjoy music
            tailored to your feelings.
          </p>
          <span className="text-green-500 uppercase font-semibold">
            {mood === "Not started" ? "" : mood}
          </span>
          <button
            onClick={startDetection}
            className="bg-orange-600 px-5 py-2 rounded-full self-start active:bg-white text-white transition-all duration-300 hover:bg-orange-700"
          >
            {detecting ? "Stop Listening" : "Start Listening"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamMoodDetector;
