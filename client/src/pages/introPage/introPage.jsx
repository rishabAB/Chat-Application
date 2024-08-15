import {useEffect, useState} from "react";
import Login from "../login";
const IntroPage = (user) => {
    console.log("user is ", user);
    const [isUserNull, setIsUserNull] = useState(false);


    useEffect(() => {
        if (!user == false) {
            setIsUserNull(true);
        }

    }, [user])


    return(isUserNull  (
        <div><img src="../../../public/chat_application_2.png" alt=""
                style={
                    {
                        height: "400px",
                        width: "50%"
                    }
                }/></div>
    )   && <Login/>)

}
export default IntroPage;
