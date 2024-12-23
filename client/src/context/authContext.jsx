import React, { createContext, useState, useCallback, useEffect } from "react";

export const AuthContext = createContext();

import { postRequest, baseUrl } from "../utils/services";

import toasts from "../customComponents/toaster/toaster";

import female_user_2 from "../../public/female_user_2.svg";
import male_user_2 from "../../public/male_user_2.svg";
import PropTypes from "prop-types";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [registerError, setRegisterError] = useState(null);

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    profile: "",
    gender: "",
  });

  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });

  const [loginError, setLoginError] = useState(null);

  const [isLoginLoading, setIsLoginLoading] = useState(false);

  function readFileDataAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(file);
    });
  }

  const updateRegisterInfo = useCallback(async (info) => {
    if (info?.profile && info?.profile?.name) {
      let res = await readFileDataAsBase64(info.profile);
      info.profile = res;
    }
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      } else {
        if (response?.profile) {
          response.imageUrl = await bufferToUrl(
            response?.profile,
            response?.imageType
          );
        } else {
          response?.gender == "male"
            ? (response.imageUrl = male_user_2)
            : (response.imageUrl = female_user_2);
        }
        toasts.success("User Registered successfully");

        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);
        setRegisterError(null);
        setRegisterInfo({
          name: "",
          email: "",
          password: "",
          profile: "",
          gender: "",
        });
      }
    },
    [registerInfo]
  );

  const clearError = useCallback(() => {
    setRegisterError(null);
    setLoginError(null);
  });

  const getImageUrl = (user) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        if (user) {
          if (user?.profile) {
            user.imageUrl = await bufferToUrl(user?.profile, user?.imageType);
          } else {
            user?.gender == "male"
              ? (user.imageUrl = male_user_2)
              : (user.imageUrl = female_user_2);
          }
          delete user.profile;
          resolve(user);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    getImageUrl(JSON.parse(user)).then((userWithUrl) => {
      setUser(userWithUrl);
    });
  }, []);

  const logoutUser = useCallback((e) => {
    e.preventDefault();
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const bufferToUrl = (bufferArray, imageType) => {
    return new Promise((resolve) => {
      const byteArray = new Uint8Array(bufferArray.data);
      const blob = new Blob([byteArray], { type: `image/${imageType}` }); // or "image/jpeg"
      const imageUrl = URL.createObjectURL(blob);
      resolve(imageUrl);
    });
  };

  const loginUser = useCallback(
    async (e) => {
      console.time("LOGIN USER");
      e.preventDefault();
      setIsLoginLoading(true);
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(false);

      if (response.error) {
        return setLoginError(response);
      }

      if (response?.profile) {
        response.imageUrl = await bufferToUrl(
          response?.profile,
          response?.imageType
        );
      } else {
        response?.gender == "male"
          ? (response.imageUrl = male_user_2)
          : (response.imageUrl = female_user_2);
      }

      toasts.success("Login Successfull");
      console.timeEnd("LOGIN USER");
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
      setLoginError(null);
      updateLoginInfo({ email: "", password: "" });
    },
    [loginInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginInfo,
        loginError,
        updateLoginInfo,
        isLoginLoading,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.object,
};
