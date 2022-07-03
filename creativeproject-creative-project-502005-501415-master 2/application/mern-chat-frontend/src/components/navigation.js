import React from 'react';
import {Navbar, Nav, Container,Button, NavDropdown} from 'react-bootstrap';
import {useLogoutUserMutation} from '../services/appApi';
import {LinkContainer} from 'react-router-bootstrap'
import {useSelector} from "react-redux";
function Navigation(){
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();

    async function handleLogout(e){
        e.preventDefault();
        await logoutUser(user);
        //redirect to 
        window.location.replace("/");
    }

    return(
        <Navbar bg="light" expand="lg">
            <Container>
                {!user && (
                    <LinkContainer to="/">
                        <Navbar.Brand>HeadHunters</Navbar.Brand>
                    </LinkContainer>
                )}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!user && (
                            <LinkContainer to = "/login">
                                <Nav.Link> Login </Nav.Link>
                            </LinkContainer>
                        )}
                        <LinkContainer to = "/chat">
                            <Nav.Link> Chat </Nav.Link>
                        </LinkContainer>
                        
                        {user &&(
                            <NavDropdown 
                            title={
                                <>
                                {user.name}
                                </>
                            } id="basic-nav-dropdown">

                            <NavDropdown.Item>
                                <LinkContainer to = "/">
                                    <Nav.Link> Return to Game </Nav.Link>
                                </LinkContainer>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item>
                                <Button variant="danger" onClick={handleLogout}>Logout</Button>
                            </NavDropdown.Item>
                            </NavDropdown>
                        )}
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation