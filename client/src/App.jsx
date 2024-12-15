
import {Routes,Route,Navigate} from "react-router-dom";

import Chat from "./components/chat/chat";


import "bootstrap/dist/css/bootstrap.min.css";


import NavBar from "./components/navbar/navbar";
import React,{useContext} from "react";
import {AuthContext} from "./context/authContext";

import {ChatContextProvider} from "./context/chatContext";

import IntroPage from "./pages/introPage/introPage";

  import { ToastContainer} from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
 
function App() {
 const {user} = useContext(AuthContext);


 
  return (
    <ChatContextProvider user ={user}>
    <NavBar/>
    <ToastContainer/>

    
  <div className="text-secondary" style={{width: '100%'}}>
  <Routes>
    {/* <Route path="/" element={user ? <Chat /> : <Login/>} /> */}
    <Route path="/login" element={user ? <Chat/>: <IntroPage />} />
    <Route path="/register" element={user ? <Chat/> : <IntroPage isRegister={true}/>} />
    <Route path="/" element = {user ? <Chat/> : <IntroPage />} />
    <Route path="*" element={<Navigate to ="/" />} />  
    <Route path="/:userId" element={user ? <Chat /> : <Navigate to="/login" />}></Route>
   
    {/* Here this navigate is the default path that we are passing if url is any random then 
    it will redirected to this / path */}
    </Routes>
  </div>
  </ChatContextProvider>
  )
}

export default App
