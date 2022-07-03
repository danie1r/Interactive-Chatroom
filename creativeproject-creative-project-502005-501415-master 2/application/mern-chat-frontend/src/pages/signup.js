import React,{useMemo, useState} from "react";
import {Container, Form, Button} from "react-bootstrap";
import {useSignupUserMutation} from '../services/appApi'
import {Link, useNavigate} from "react-router-dom";

function Signup() {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [signupUser, {isLoading, error}] = useSignupUserMutation();
    const navigate = useNavigate();

    async function handleSignup(e){
        e.preventDefault();
        signupUser({name,password}).then(({data}) => {
            if(data){
                console.log(data);
                alert("Signup Successful");
                navigate("/");
            }
        })
    }
    return (
        <Container>
            <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Username" onChange={(e) => setName(e.target.value)} value ={name} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value = {password} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Signup
                </Button>
            </Form>
        </Container>
    )
}

export default Signup;