import React,{useContext, useState} from "react";
import {Container, Form, Button} from "react-bootstrap";
import {useLoginUserMutation} from '../services/appApi';
import {Link,useNavigate} from "react-router-dom";
import { AppContext } from "../context/appContext";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loginUser, {isLoading,error}] = useLoginUserMutation();
    const navigate = useNavigate();
    const {socket} = useContext(AppContext);

    function handleLogin(e){
        e.preventDefault();

        loginUser({name,password}).then(({data}) =>{
            if(data){
                //socket work
                socket.emit("new-user");
                //navigate to the chat
                navigate("/");
            }
        })
    }
    return (
        <Container>
            <Form onSubmit ={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Username" onChange={(e) => setName(e.target.value)} value ={name} required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value = {password} required/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                <div className="py-4">
                    <p className ="text-center">
                        Don't have an account ? <Link to ="/signup">Sign up</Link>
                    </p>
                </div>
            </Form>
        </Container>
    )
}

export default Login;