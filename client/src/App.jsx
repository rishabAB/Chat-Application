
import {Routes,Route,Navigate} from "react-router-dom";

import Chat from "./pages/chat";
import Login from "./pages/login";
import Register from "./pages/register";

import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";

import NavBar from "./components/navbar";
import {useContext} from "react";
import {AuthContext} from "./context/authContext";

import {ChatContextProvider} from "./context/chatContext";

function App() {
 const {user} = useContext(AuthContext);
  return (
    <ChatContextProvider user ={user}>
    <NavBar/>
     
  <div className="text-secondary" style={{width: '100%',
    padding: '0 4%'}}>
  <Routes>
    <Route path="/" element={user ? <Chat /> : <Login/>} />
    <Route path="/login" element={user ? <Chat/> : <Login />} />
    <Route path="/register" element={user ? <Chat/> : <Register />} />
    <Route path="*" element={<Navigate to ="/" />} />  
    {/* Here this navigate is the default path that we are passing if url is any random then 
    it will redirected to this / path */}
    </Routes>
  </div>
  </ChatContextProvider>
  )
}

export default App
