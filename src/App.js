// 1. Install dependencies
// 2. Import dependencies
// 3. Setup webcam and canvas
// 4. Define references to those
// 5. Load handpose
// 6. Detect function
// 7. Draw using drawMask

import React, { useRef, useState, useEffect } from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let net;

  const start = async () => {
    console.log(webcamRef.current);
    net = await bodyPix.load();
    console.log("BodyPix model loaded.");     //  Loop and detect hands

    // let timer = requestAnimationFrame(detect);



    // setInterval(async () => {
    //   maskAndDraw()
    // }, 100);

    requestAnimationFrame(maskAndDraw);

  }


  const maskAndDraw = async() => {
    const mask = await getMask();
    if(mask) {
      draw(mask)
    }
    requestAnimationFrame(maskAndDraw);

  }

  const getMask = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // COLORED MASK
      const person = await net.segmentPersonParts(video);
      return bodyPix.toColoredPartMask(person);

      // DARK MASK
      // const segmentation = await net.segmentPerson(video, {
      //   flipHorizontal: false,
      //   internalResolution: 'medium',
      //   segmentationThreshold: 0.7
      // });
      // return bodyPix.toMask(segmentation);
    }
    else return null;
  }

  const draw = async (mask) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      console.log("[DETECT]");

      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // * One of (see documentation below):
      // *   - net.segmentPerson
      // *   - net.segmentPersonParts
      // *   - net.segmentMultiPerson
      // *   - net.segmentMultiPersonParts
      // const person = await net.segmentPerson(video);

      //TO DO BEFORE

      // const person = await net.segmentPersonParts(video);
      // const coloredPartImage1 = bodyPix.toColoredPartMask(person);

      // const segmentation = await net.segmentPerson(video, {
      //   flipHorizontal: false,
      //     internalResolution: 'medium',
      //     segmentationThreshold: 0.7
      //   });
      // const coloredPartImage2 = bodyPix.toMask(segmentation);

      //TO DO BEFORE


      const opacity = 0.7;
      const flipHorizontal = false;
      const maskBlurAmount = 0;
      const canvas = canvasRef.current;

      console.log("[MASK]");
      bodyPix.drawMask(
        canvas,
        video,
        mask,
        opacity,
        maskBlurAmount,
        flipHorizontal
      );




      // BLUR EXAMPLE

      // const backgroundBlurAmount = 3;
      // const edgeBlurAmount = 3;



      // bodyPix.drawBokehEffect(
      //   canvas,
      //   video,
      //   segmentation,
      //   backgroundBlurAmount,
      //   edgeBlurAmount,
      //   flipHorizontal
      // );

    }

    // requestAnimationFrame(detect)

  };
  start()
  // useEffect(() => { start() });

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
