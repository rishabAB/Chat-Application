
import {Routes,Route,Navigate} from "react-router-dom";

import Chat from "./pages/chat";
import Login from "./pages/login";
import Register from "./pages/register";

import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";

import NavBar from "./components/navbar";
function App() {
 
  return (
    <>
    <NavBar/>
     
  <Container className="text-secondary">
  <Routes>
    <Route path="/" element={<Chat />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<Navigate to ="/" />} />  
    {/* Here this navigate is the default path that we are passing if url is any random then 
    it will redirected to this / path */}
    </Routes>
  </Container>
  </>
  )
}

export default App
