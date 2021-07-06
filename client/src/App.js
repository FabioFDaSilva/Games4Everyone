import React, { useContext, useState } from 'react';
import { Homepage } from './features/homepage/homepage';
import { StorePage } from './features/storePage/storepage';
import {LoginPage} from './features/loginPage/login';
import {Signup} from './features/signup/signup';
import {Cart} from './features/cart/cart';
import {ProfilePage} from './features/profile/profile';
import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom';
import './App.css';
import {useSelector} from "react-redux";
import {selectCurrentUser} from "./features/currentUser/currentUserSlice";
import { ItemPage } from './features/itemPage/itemPage';
import logo from "./resources/images/logo.png";
import { myContext } from './Context';
import axios from 'axios';
import { current } from '@reduxjs/toolkit';


function App() {
  
  const url = "http://localhost:3000/"

  const tryLogout = async (e) =>{
    e.preventDefault();

    axios.get("http://localhost:5000/auth/logout",{
      withCredentials: true
    }).then(res=>{
      if(res.data === "Done"){
        window.location.href = "/"
      }
    })
  }

  const userObject = useContext(myContext);
  const currentUser = useSelector(selectCurrentUser);

  const isLoggedIn= () =>{
    console.log(currentUser);
      if (!userObject && currentUser.username !== "Guest"){
          return (<NavLink exact to='/loginPage'><button>Login</button></NavLink>)
      }
      else{
          return(
              <div>
                  <NavLink exact to="/profile"><button>Profile</button></NavLink>
                  <NavLink exact to='/logout'><button onClick={tryLogout}>Logout</button></NavLink>
              </div>
              )
      }
  }

  async function handleChange(e){
    const data = e.target.value;
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const jsonValue = await response.json();
      console.log(jsonValue);
  }
  return(
    
    <BrowserRouter>
      <header>
        <img src={logo} alt="logo" />
        <nav>
          <div className="leftAlign">
            <NavLink exact to='/'><button>Home</button></NavLink>
            <NavLink exact to='/store'><button>Store</button></NavLink>
          </div>
          <div className="centerAlign">
            <input type="search" placeholder="Search" id="searchBar" onChange={handleChange}></input>
          </div>
          <div className="rightAlign">
            <NavLink exact to='/cart'><button>Cart</button></NavLink>
            {isLoggedIn()}
          </div>

          </nav>
      </header>
      <Switch>
        <Route path ='/store'>
          <StorePage />
        </Route>
        <Route path = '/loginPage'>
          <LoginPage />
        </Route>
        <Route path = '/signup'>
          <Signup />
        </Route>
        <Route path = '/cart'>
          <Cart />
        </Route>
        <Route path = "/items/:itemId" component = {ItemPage} />
        <Route path ='/profile'>
          <ProfilePage />
        </Route>
          {/* 
          <Route path = '/checkout'>
            <Checkout />
          </Route>
          */}
           
        <Route path =''>
          <Homepage />
        </Route>
        
      </Switch>
    </BrowserRouter>
  )
  
}

export default App;
