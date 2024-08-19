import "./toaster.scss";

import { ToastContainer, toast } from 'react-toastify';
import {useState,useEffect} from "react";

const Toaster = (props) =>
{
    console.log("props",props);
    const {type,message} = props;
    // console.log("message",message);
    useEffect(()=>
    {
        showToastMessage(type,message);

    },[props])
    const showToastMessage = (type,message) => {
        if(type == "warning")
        {
            toast.warning(message, {
                position: "top-right",
                theme: "colored",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                
                });

        }
     
      };

      return(     <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />)

}
export default Toaster;