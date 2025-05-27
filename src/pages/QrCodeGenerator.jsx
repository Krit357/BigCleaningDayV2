import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import "./QrCodeGenerator.css";
import { useOutletContext } from "react-router-dom";

const QrCodeGenerator = () => {
  const [input, setInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [display, setDisplay] = useState("");
  const { isOpen, toggle } = useOutletContext();

  const DEFAULT_URL =
    "https://static.wikia.nocookie.net/elderscrolls/images/4/4f/Dovahkiin_%28dragonborn%29.jpg/revision/latest?cb=20170710123307&path-prefix=th";

  const generate = async () => {
    try {
      const url = await QRCode.toDataURL(input || DEFAULT_URL, {
        width: 200,
        margin: 2,
      });
      setQrUrl(url);
      setDisplay(input);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = () => {
    // use the user’s input if non-empty; otherwise Google
    const text = input.trim() || DEFAULT_URL;
    generate(text);
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

      <img src={qrUrl || DEFAULT_URL} alt={qrUrl ? "QR Code" : "Google Logo"} />

      <div>
        <input
          placeholder="put link here"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <button onClick={handleClick}>test-btn</button>
    </div>
  );
};

export default QrCodeGenerator;
