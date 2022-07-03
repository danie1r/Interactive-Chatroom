import React, {useContext, useState, useRef, useEffect} from 'react';
import {Form,Row,Col,Button} from "react-bootstrap";
import {useSelector} from "react-redux";
import {AppContext} from "../context/appContext";
import './MessageForm.css';
function MessageForm(){
    const [message, setMessage] = useState("");
    const user = useSelector((state) => state.user);
    const {socket, currentRoom, setMessages, messages, privateMemberMsg} = useContext(AppContext);
    const messageEndRef = useRef(null);
   
    //smooth scrolll to bottom transition
    useEffect(()=>{
        scrollToBottom();
    }, [messages]);
   
    
    function getFormattedDate(){
        const date = new Date();
        const year = date.getFullYear();
        let month = (1+date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        let day = date.getDate().toString();
        day = day.length > 1 ? day : "0" + day;
        return month + "/" + day + "/" + year;
    }

    const todayDate = getFormattedDate();
    socket.off('room-messages').on('room-messages', (roomMessages) =>{
        console.log(roomMessages);
        setMessages(roomMessages);
    });

    function scrollToBottom(){
        messageEndRef.current?.scrollIntoView({ behavior:"smooth"});
    }
    function handleSubmit(e){
        e.preventDefault();
        if (!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        socket.emit('message-room', roomId, message, user, time, todayDate);
        setMessage("");
    }
    return(
        <div>
            <div className="msg-output">
                {!user && <div className="alert alert-danger">Please Login</div>}
                {user && messages.map(({_id: date, messagesByDate}, idx) => (
                    <div key = {idx}>
                        <p className = "alert alert-info text-center message-date-indicator">{date}</p>
                            {messagesByDate?.map(({content, time, from: sender}, msgIdx) => (
                                <div className= {sender?.name === user?.name ? "message" : "incoming-message"} key = {msgIdx}>
                                    <div className = "message-inner">
                                        <div className="d-flex align-items-center mb-2">
                                            <p className ="message-sender">{sender._id === user?._id ? "You": sender.name}</p>
                                        </div>
                                        <p className="message-content">{content}</p>
                                        <p className="message-timestamp-left">{time}</p>
                                    </div>
                                    
                                </div>
                            ))}
                    </div>
                ))}
                <div ref = {messageEndRef}/>
            </div>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Control type ="text" placeholder= "your message" disabled={!user} value ={message} onChange = {(e) => setMessage(e.target.value)}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit" style={{width:'100%'}} disabled = {!user}>Send</Button>
                            <i className="fas fa-paper-plane"></i>
                        </Col>
                    </Row>
                </Form>
        </div>
    )
}

export default MessageForm;