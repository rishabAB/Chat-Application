import {useEffect} from "react";

export const useKeyPress = (key, action, deps = []) => {
    useEffect(() => {
      if (action) {
        const handleKeyPress = (event) => {
          if (event.key === key) {
            action(event);
          }
        };
  
        window.addEventListener("keydown", handleKeyPress);
  
        return () => {
          window.removeEventListener("keydown", handleKeyPress);
        };
      }
    }, [key, action, ...deps]);
  };