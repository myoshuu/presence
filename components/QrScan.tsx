import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

interface QRScannerProps {
  setQrCode: React.Dispatch<React.SetStateAction<string | null>>;
}

const QRScanner: React.FC<QRScannerProps> = ({ setQrCode }) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [qrCode, setLocalQrCode] = useState<string | null>(null); // Track qrCode locally in the component
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null); // To store the media stream reference

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Log available video devices
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        console.log(devices); // Log devices to check if a camera is available
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length === 0) {
          setCameraError("No camera devices found.");
          return;
        }

        // Choose the first video device
        const videoDeviceId = videoDevices[0].deviceId;
        console.log(`Using camera device: ${videoDeviceId}`);

        // Start the camera stream
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: videoDeviceId,
            },
          })
          .then((stream) => {
            // Store the stream to stop later
            mediaStreamRef.current = stream;
            videoRef.current!.srcObject = stream;

            // Start decoding QR code from video stream
            codeReader.decodeFromVideoDevice(
              videoDeviceId,
              videoRef.current!,
              (result, err) => {
                if (result) {
                  const scannedCode = result.getText();
                  if (scannedCode && scannedCode !== qrCode) {
                    setLocalQrCode(scannedCode); // Store the scanned QR code locally
                    setQrCode(scannedCode); // Update the parent component state
                    stopCamera(); // Stop the camera after successful scan
                  }
                }
                if (err) {
                  setCameraError("Camera access error: " + err);
                }
              }
            );
          })
          .catch((err) => {
            setCameraError("Error accessing media devices: " + err);
          });
      })
      .catch((err) => {
        setCameraError("Error accessing media devices: " + err);
      });

    return () => {
      // Ensure to stop the camera when component is unmounted
      stopCamera();
    };
  }, [setQrCode, qrCode]); // Only run effect when qrCode changes or setQrCode is updated

  // Function to stop the camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop()); // Stop each track (camera stream)
      mediaStreamRef.current = null;
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "300px", backgroundColor: "#000" }}
        autoPlay
        muted
      />
      {cameraError && <p style={{ color: "red" }}>{cameraError}</p>}
      {qrCode && <p>Scanned QR Code: {qrCode}</p>} {/* Display scanned code */}
      {!qrCode && !cameraError && <p>Scan QR code to proceed...</p>}{" "}
      {/* When QR code hasn't been scanned yet */}
    </div>
  );
};

export default QRScanner;
