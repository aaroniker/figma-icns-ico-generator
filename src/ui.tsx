import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./ui.scss";

export const App: React.FC = () => {
  const [icns, setIcns] = useState<string>("");
  const [ico, setIco] = useState<string>("");
  const [imgSource, setImgSource] = useState<string>("");
  const [hidePreview, setHidePreview] = useState<boolean>(false);
  const [showImg, setShowImg] = useState<boolean>(false);
  const [tooSmall, setTooSmall] = useState<boolean>(false);

  useEffect(() => {
    window.onmessage = async (event) => {
      if (event.data.pluginMessage.type == "compile") {
        function random(length) {
          let result = "",
            characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            charactersLength = characters.length;
          for (let i = 0; i < length; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }
          return result;
        }

        let data = new FormData(),
          name = event.data.pluginMessage.name,
          base64 = btoa(
            new Uint8Array(event.data.pluginMessage.buffer).reduce(
              (data, byte) => {
                return data + String.fromCharCode(byte);
              },
              ""
            )
          );

        data.append("base64", base64);
        data.append("random", random(16));

        fetch("https://aaroniker.me/api/icns", {
          method: "POST",
          body: data,
        }).then((response) => {
          response.json().then((res) => {
            setIcns(res.url + "/" + name + ".icns");
            setIco(res.urlIco + "/" + name + ".ico");
            setImgSource("data:image/png;base64," + base64);

            setTimeout(() => {
              setHidePreview(true);
              setTimeout(() => {
                setShowImg(true);
              }, 100);
            }, 50);
            if (event.data.pluginMessage.size < 512) {
              setTooSmall(true);
            }
          });
        });
      }
    };
  }, []);

  return (
    <div id="download">
      <div className="preview">
        <img src={imgSource} className={showImg && "show"} />
        <span className={hidePreview && "hide"}></span>
        <p className={tooSmall && "show"}>
          Frame should be at least 512x512 to cover all use cases
        </p>
      </div>
      <div className="action">
        <a href={icns}>icns</a>
        <a href={ico}>ico</a>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("react-page"));
