import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

interface QRScannerProps {
  setQrCode: React.Dispatch<React.SetStateAction<string | null>>;
}

const QRScanner: React.FC<QRScannerProps> = ({ setQrCode }) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [qrCode, setLocalQrCode] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length === 0) {
          setCameraError("No camera devices found.");
          return;
        }

        const videoDeviceId = videoDevices[0].deviceId;

        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: videoDeviceId,
            },
          })
          .then((stream) => {
            mediaStreamRef.current = stream;
            videoRef.current!.srcObject = stream;

            codeReader.decodeFromVideoDevice(
              videoDeviceId,
              videoRef.current!,
              (result, err) => {
                if (result) {
                  const scannedCode = result.getText();
                  if (scannedCode && scannedCode !== qrCode) {
                    setLocalQrCode(scannedCode);
                    setQrCode(scannedCode);
                    stopCamera();
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
      stopCamera();
    };
  }, [setQrCode, qrCode]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
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
      {qrCode && <p className="mt-3 font-medium">Scanned QR Code success</p>}
      {!qrCode && !cameraError && <p>Scan QR code to proceed...</p>}
    </div>
  );
};

export default QRScanner;
