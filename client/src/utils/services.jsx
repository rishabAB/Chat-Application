export const baseUrl = "https://chat-application-server-roop.onrender.com/api";
// https://chat-application-server-roop.onrender.com/api
// http://localhost:5000/api
// https://www.talkapp.life/api not working
 import toasts from "../customComponents/toaster/toaster";

function trackPromise(promise)
{
    let isPending =true;

   const wrappedPromise= promise.then(
    (value) =>
    {
        isPending=false;
        return value;
    },
    (error) =>{
        isPending = false;
        return error;
    });

    wrappedPromise.isPending = () => isPending;
    return wrappedPromise;
}
export const postRequest = async(url,body) =>
{
    const promiseResponse=trackPromise(fetch(url,
        {
            method:"POST",
            headers : {
                "Content-Type":"application/json"
            },
            body
        }
        ));

        setTimeout(() => {
            if (promiseResponse.isPending()) {
              toasts.warning(
                "Please wait due to inactivity server may take some time to fetch response"
              );
            }
          }, 10000);

          const response = await promiseResponse;

        const data = await response.json();

        if(!response.ok)
        {
            let message;
            if(data?.message)
            {
                message=data.message;
            }
            else{
                message=data;
            }
            return {error:true,message};
        }
        return data;

}

export const getRequest = async(url) =>
{
    const promiseResponse = trackPromise(
        fetch(url,
        {
            method:"GET",
            headers : {
                "Content-Type":"application/json",
                'ngrok-skip-browser-warning':  '69420',
            },
           
        }));
        setTimeout(() => {
            if (promiseResponse.isPending()) {
              toasts.warning(
                "Please wait due to inactivity server may take some time to fetch response"
              );
            }
          }, 10000);

    const response = await promiseResponse;

    const data = await response.json();

    if(!response.ok)
    {
       let message="An error occurred";

       if(data?.message)
       {
        message = data.message;
       }
       return {error:true,message};
    }
    return data;
}