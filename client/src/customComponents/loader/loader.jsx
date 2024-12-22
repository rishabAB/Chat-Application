import React, { useEffect, useState } from "react";
import "./loader.scss";
const Loader = (props) => {
  const { showLoader, responsizeFrame1, customStyle } = props;

  const [dotsArr, setDotsArr] = useState([]);

  function loader() {
    return customStyle ? (
      <div style={customStyle} className="holder-chatbox">
        <div className="holder_panel">
          {dotsArr.length > 0 && dotsArr.map((dot) => dot.val)}
        </div>
      </div>
    ) : (
      <div
        className={`${responsizeFrame1 == false ? "holder holder-chatbox" : "holder"}`}
      >
        <div className="panel">
          {dotsArr.length > 0 && dotsArr.map((dot) => dot.val)}
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (showLoader) {
      let dots = [];
      for (let num = 1; num <= 252; num++) {
        dots.push({ val: <div className={`dot d${num}`} key={num}></div> });
      }
      setDotsArr(dots);
    }
  }, [showLoader]);

  return showLoader ? loader() : "";
};
export default Loader;
