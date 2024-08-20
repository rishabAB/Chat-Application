import "./toaster.scss";

import {  toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const toastOptions = {
  position: "top-right",
  autoClose: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: false,
  hideProgressBar: true,
  theme: "colored",
};

class Toaster{
success = (message) =>
{
  toast.success(message,{
    ...toastOptions
  })
};
error = (message) =>
  {
    toast.error(message,{
      ...toastOptions
    })
  };

warning = (message) =>
{
  toast.warning(message,{
    ...toastOptions
  })
}

}
const toasts = new Toaster();
export default toasts;
