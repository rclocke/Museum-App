import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import {useAtom} from "jotai";
import { searchHistoryAtom } from '../store';
import { addToHistory } from "../lib/userData";  
import { readToken, removeToken } from '../lib/authenticate';  

const  NavScrollExample = () =>{

    const router = useRouter();
    const [isExpanded, setExpanded] = useState(false);

    let [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    const [message, setMessage] = useState('');

    async function submitForm(event){
      setSearchHistory(await addToHistory(`title=true&q=${message}`)) 
                setExpanded(false)
                event.preventDefault()
                let searchbtn = document.getElementById("searchbtn");
                searchbtn.click();
    }

    let token = readToken();

    const logout = () =>{
      setExpanded(false);
      removeToken();
      router.push('/');
    }

  async function handleKeyDown(event){
    if (event.key === 'Enter') {
      event.preventDefault();
      setExpanded(false)
      setSearchHistory(await addToHistory(`title=true&q=${message}`)) 
      router.push(`/artwork?title=true&q=${message}`);
      setMessage("");
      event.target.value ="";
    }
  }

  const setFalse = () =>{
    setExpanded(false);
  }
   
  return (
    <>
    <Navbar bg="primary" variant="dark" expand="lg" className="fixed-top" expanded={isExpanded}>
      <Container>
        <Navbar.Brand>Ryan Locke</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" onClick={(e) =>{
          isExpanded == true ? setExpanded(false) : setExpanded(true);
        }}/>
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px'}}
            navbarScroll
          >
            <Nav.Link as={Link} href="/" active={router.pathname === "/"} onClick={setFalse}>Home</Nav.Link>
            {token && <Nav.Link as={Link} href="/search" active={router.pathname === "/search"}onClick={setFalse}>Advanced Search</Nav.Link>}
          </Nav>
          {!token && <Nav>
            <Nav.Link as={Link} href="/register" onClick={setFalse} active={router.pathname === "/register"}>Register</Nav.Link>
            <Nav.Link as={Link} href="/login" onClick={setFalse} active={router.pathname === "/login"}>Login</Nav.Link>
            </Nav>}
          &nbsp;
          {token && <Form className="d-flex"      
               onSubmit={async (e) =>{
                setSearchHistory(await addToHistory(`title=true&q=${message}`)) 
                setExpanded(false)
                e.preventDefault()
                let searchbtn = document.getElementById("searchbtn");
                searchbtn.click();
              }}
              >
            <Form.Control id='input'
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={event => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}

            />
            <Button id="searchbtn" onClick={async (e) => {
              setExpanded(false)
              let input = document.getElementById("input"); 
              setSearchHistory(await addToHistory(`title=true&q=${input.value}`)) 
              router.push(`/artwork?title=true&q=${input.value}`);
              input.value = "";  
              }} variant="success">Search</Button>
          </Form>}
          &nbsp;
          <Nav>
          {token && <NavDropdown title={token.userName} id="basic-nav-dropdown">
            <Link href="/favourites" style={{textDecoration: 'none'}}> 
              <NavDropdown.Item eventKey="4.1" as="div" onClick={(n) =>{setExpanded(false)}} href="/favourites" >Favourites</NavDropdown.Item>
              </Link>
              <Link href="/history" style={{textDecoration: 'none'}}> 
               <NavDropdown.Item eventKey="4.2" as="div" onClick={(n) =>{setExpanded(false)}} href="/history" >Search History</NavDropdown.Item>
               </Link>
               <NavDropdown.Item eventKey="4.3" onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <br />
    <br />
    <br />
    </>
  );
}


export default NavScrollExample;