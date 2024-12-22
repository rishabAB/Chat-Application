/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./fullLoader.scss";
import img from "../../../public/icons8-chat-100.png";

import Splitting from "splitting";
import "splitting/dist/splitting.css";
export const FullLoader = (showLoader) => {
  useEffect(() => {
    Splitting();
  }, []);

  return showLoader ? (
    <div className="loading-body">
      <div className="loading" data-splitting>
        LOADING
      </div>
    </div>
  ) : (
    ""
  );
};
