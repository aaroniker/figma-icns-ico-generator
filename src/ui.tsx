import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./ui.css";

const API_URL = "https://figma-icns-file-generator-api.vercel.app";

function generateRandom(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

type PluginMessage = {
  type: string;
  buffer: ArrayBuffer;
  size: number;
  name: string;
};

const messageQueue: PluginMessage[] = [];
let messageCallback: ((msg: PluginMessage) => void) | null = null;

window.onmessage = (event: MessageEvent) => {
  const msg = event.data?.pluginMessage;
  if (!msg || msg.type !== "compile") return;

  if (messageCallback) {
    messageCallback(msg);
  } else {
    messageQueue.push(msg);
  }
};

export const App: React.FC = () => {
  const [icns, setIcns] = useState("");
  const [ico, setIco] = useState("");
  const [imgSource, setImgSource] = useState("");
  const [hidePreview, setHidePreview] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [tooSmall, setTooSmall] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleMessage = async (msg: PluginMessage) => {
      const name = msg.name;
      const base64 = btoa(
        new Uint8Array(msg.buffer).reduce(
          (data: string, byte: number) => data + String.fromCharCode(byte),
          ""
        )
      );

      try {
        const response = await fetch(`${API_URL}/api/icns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, random: generateRandom(16) }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          throw new Error(err?.error || `Server error: ${response.status}`);
        }

        const res = await response.json();

        setIcns(`${API_URL}${res.url}/${name}.icns`);
        setIco(`${API_URL}${res.urlIco}/${name}.ico`);
        setImgSource("data:image/png;base64," + base64);

        setTimeout(() => {
          setHidePreview(true);
          setTimeout(() => setShowImg(true), 100);
        }, 50);

        if (msg.size < 512) {
          setTooSmall(true);
        }
      } catch (e: any) {
        console.error("Failed to generate icons:", e);
        setError(e.message || "Failed to generate icons");
      }
    };

    messageCallback = handleMessage;

    while (messageQueue.length > 0) {
      handleMessage(messageQueue.shift()!);
    }

    return () => {
      messageCallback = null;
    };
  }, []);

  return (
    <div id="download">
      <div className="preview">
        <img src={imgSource} className={showImg ? "show" : ""} alt="Icon preview" />
        <span className={hidePreview ? "hide" : ""}></span>
        {error ? (
          <p className="show" style={{ color: "var(--figma-color-text-danger)" }}>
            {error}
          </p>
        ) : (
          <p className={tooSmall ? "show" : ""}>
            Frame should be at least 512x512 to cover all use cases
          </p>
        )}
      </div>
      <div className="action">
        <a href={icns || undefined} target="_blank" rel="noopener noreferrer">
          icns
        </a>
        <a href={ico || undefined} target="_blank" rel="noopener noreferrer">
          ico
        </a>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("react-page")!);
root.render(<App />);
