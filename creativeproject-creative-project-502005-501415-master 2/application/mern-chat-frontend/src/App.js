import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navigation from './components/navigation';
import Chat from './pages/chat';
import Signup from './pages/signup';
import Login from './pages/login';
import Home from './pages/home';
import {useSelector} from "react-redux";
import { useState } from 'react';
import {AppContext, socket} from './context/appContext';
function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const [gameRoom, setgameRoom] = useState([]);

  const user = useSelector((state) => state.user);

  return (
    <AppContext.Provider value ={{ 
      socket, 
      currentRoom, setCurrentRoom, 
      members, setMembers, 
      messages, setMessages, 
      privateMemberMsg, setPrivateMemberMsg, 
      rooms, setRooms, 
      newMessages, setNewMessages,
      gameRoom, setgameRoom}}>

    
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path = "/" element = {<Home/>} />
          {!user && (
            <>
              <Route path = "/login" element = {<Login/>} />
              <Route path = "/signup" element = {<Signup/>} />
            </>
          )}
          
          <Route path = "/chat" element = {<Chat/>} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
