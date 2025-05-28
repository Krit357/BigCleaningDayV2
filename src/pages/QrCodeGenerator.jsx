import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import "./QrCodeGenerator.css";
import { useOutletContext } from "react-router-dom";
import html2canvas from "html2canvas";

const QrCodeGenerator = () => {
  const [input, setInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [display, setDisplay] = useState("");
  const [phoneType, setPhoneType] = useState("");
  const qrRef = useRef(null);
  const { isOpen } = useOutletContext();

  const DEFAULT_URL =
    "https://static.wikia.nocookie.net/elderscrolls/images/4/4f/Dovahkiin_%28dragonborn%29.jpg/revision/latest?cb=20170710123307&path-prefix=th";

  const generate = async (text) => {
    try {
      const url = await QRCode.toDataURL(text || DEFAULT_URL, {
        width: 200,
        margin: 2,
      });
      setQrUrl(url);
      setDisplay(text === DEFAULT_URL ? "" : text);
    } catch (err) {
      console.log(err);
    }
  };

  const handleQr = () => {
    // use the user’s input if non-empty; otherwise Google
    const text = input.trim() || DEFAULT_URL;
    generate(text);
  };

  const handleTypePhone = () => {
    // use the user’s input if non-empty; otherwise Google
    const text = phoneType.trim() || DEFAULT_URL;
    generate(text);
  };

  const handleSave = async () => {
    if (!qrRef.current) return;
    try {
      const canvas = await html2canvas(qrRef.current, {
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.download = "qr-code.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      });
    } catch (err) {
      console.log("Screenshot failed", err);
    }
  };

  // OPTIONAL: generate a Google QR on first render
  useEffect(() => {
    generate(DEFAULT_URL);
  }, []);

  return (
    <div className={`test-qr ${isOpen ? "sidebar-open" : "sidebar-close"}`}>
      <h2>Qr Code Generator</h2>
      {display && (
        <p>
          Generate for: <code>{display}</code>
        </p>
      )}
      <div className="qr-bg" ref={qrRef}>
        <p>{phoneType}</p>
        <img
          src={qrUrl || DEFAULT_URL}
          alt={qrUrl ? "QR Code" : "Google Logo"}
        />
      </div>

      <div className="qr-input">
        <div className="qr-input box">
          <input
            className="qr-input-typing"
            placeholder="Link here"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="qr-btn" onClick={handleQr}>
            generate
          </button>
        </div>

        <div className="qr-input box">
          <select
            className="qr-input-option"
            placeholder="Phone type here"
            type="option"
            value={phoneType}
            onChange={(e) => setPhoneType(e.target.value)}
          >
            <option value="" disabled>
              -- Choose one--
            </option>
            <option value="iOS">iOS</option>
            <option value="Android">Android</option>
          </select>

          <button className="qr-btn" onClick={handleTypePhone}>
            Phone Type
          </button>
        </div>
      </div>

      <button className="qr-btn" onClick={handleSave}>
        save QR div as image
      </button>
    </div>
  );
};

export default QrCodeGenerator;
