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
    // const file = e.target.files[0];

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
      const responsePromise = trackPromise(
        postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo))
      );

      setTimeout(() => {
        if (responsePromise.isPending()) {
          toasts.warning(
            "Please wait due to inactivity server may take some time to fetch response"
          );
        }
      }, 5000);
     
      const response = await responsePromise;
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
      }
    },
    [registerInfo]
  );

  const getImageUrl = (user) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        if (user) {
          console.log("User is ", user);
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
    // console.log("user",user);
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
  function trackPromise(promise) {
    let isPending = true;

    // Wrap the original promise with another promise that tracks its state
    const wrappedPromise = promise.then(
      (value) => {
        isPending = false;
        return value;
      },
      (error) => {
        isPending = false;
        throw error;
      }
    );
    // Add a method to check if the promise is still pending
    wrappedPromise.isPending = () => isPending;

    return wrappedPromise;
  }
  

  const loginUser = useCallback(
    async (e) => {
      console.time("LOGIN USER");
      e.preventDefault();
      setIsLoginLoading(true);
      const responsePromise = trackPromise(
        postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo))
      );

      setTimeout(() => {
        if (responsePromise.isPending()) {
          toasts.warning(
            "Please wait due to inactivity server may take some time to fetch response"
          );
        }
      }, 5000);

      const response = await responsePromise;
    
      setIsLoginLoading(false);

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

      if (response.error) {
        return setLoginError(response);
      } else {
        toasts.success("Login Successfull");
        console.timeEnd("LOGIN USER");
        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);
      }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.object,
};
