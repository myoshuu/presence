import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QRScanner: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    if (videoRef.current) {
      codeReader.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result) {
            setQrCode(result.getText());
          }
          if (err) {
            setCameraError("Camera access error: " + err);
          }
        }
      );
    }

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <h1>QR Code Scanner using ZXing</h1>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "300px", backgroundColor: "#000" }}
      />
      {cameraError && <p style={{ color: "red" }}>{cameraError}</p>}
      {qrCode && <p>Scanned Code: {qrCode}</p>}
      {!qrCode && <p>No QR code scanned yet.</p>}
    </div>
  );
};

export default QRScanner;
