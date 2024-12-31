"use client";
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const videoConstraints = {
  width: 540,
  facingMode: "environment",
};

const Camera = ({url, setUrl}) => {
  const webcamRef = useRef(null);

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUrl(imageSrc);
  }, [webcamRef]);

  const onUserMedia = (e) => {
    console.log(e);
  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
      />
      <div className="flex justify-center space-x-4 mt-4">
      <button className="rounded bg-green-500 text-white p-2" onClick={capturePhoto}>Capture</button>
      <button className="rounded bg-red-500 text-white p-2" onClick={() => setUrl(null)}>Refresh</button>
    
      </div>
        {url && (
        <div>
          <img src={url} alt="Screenshot" />
        </div>
      )}
    </>
  );
};

export default Camera;
