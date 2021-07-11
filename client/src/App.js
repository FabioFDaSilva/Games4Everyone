import React, { useContext, useState, useEffect } from 'react';
import { Homepage } from './features/homepage/homepage';
import { StorePage } from './features/storePage/storepage';
import { LoginPage } from './features/loginPage/login';
import { Signup } from './features/signup/signup';
import { Cart } from './features/cart/cart';
import { ProfilePage } from './features/profile/profile';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, login, logout } from "./features/currentUser/currentUserSlice";
import { ItemPage } from './features/itemPage/itemPage';
import logo from "./resources/images/logo.png";
import { myContext } from './Context';
import axios from 'axios';
import { updateGameList } from "./features/storePage/storepageSlice";
import { updateCart } from "./features/cart/cartSlice";


function App() {

  const url = "http://localhost:3000/"
  const dispatch = useDispatch();

  const tryLogout = async (e) => {
    e.preventDefault();
    axios.get("http://localhost:5000/auth/logout", {
      withCredentials: true
    }).then(res => {
      if (res.data === "Done") {
        window.location.href = "/"
      }
    })
  }


  const userObject = useContext(myContext);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (localStorage.getItem("storeState")) {
      const parsedStoreStateGames = JSON.parse(localStorage.storeState);
      dispatch(updateGameList(parsedStoreStateGames));
    }

    if (userObject) {
      if (localStorage.getItem("cartState")) {
        const parsedStoreStateCart = JSON.parse(localStorage.cartState);
        dispatch(updateCart(parsedStoreStateCart));
      } else {
        dispatch(updateCart([]));
      }
    } else {
      dispatch(updateCart([]));
    }

  }, [userObject]);

  const isLoggedIn = (currentUser, userObject) => {
    if (!userObject) {
      if(window.location.href === "http://localhost:3000/cart"){
        window.location = "http://localhost:3000"
      }
      return (<NavLink exact to='/loginPage'><button>Login</button></NavLink>);
    }
    else {
      if (window.location.href === "http://localhost:3000/loginPage") {
        window.location = "http://localhost:3000";
      }
      return (
        <div>
          <NavLink exact to='/cart'><button>Cart</button></NavLink>
          <NavLink exact to="/profile"><button>Profile</button></NavLink>
          <NavLink exact to='/logout'><button onClick={tryLogout}>Logout</button></NavLink>
        </div>
      )
    }
  }

  async function handleChange(e) {
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
  return (

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

            {isLoggedIn(currentUser, userObject)}
          </div>

        </nav>
      </header>
      <Switch>
        <Route path='/store'>
          <StorePage />
        </Route>
        <Route path='/loginPage'>
          <LoginPage />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/cart'>
          <Cart />
        </Route>
        <Route path="/items/:itemId" component={ItemPage} />
        <Route path='/profile'>
          <ProfilePage />
        </Route>
        {/* 
          <Route path = '/checkout'>
            <Checkout />
          </Route>
          */}

        <Route path=''>
          <Homepage />
        </Route>

      </Switch>
    </BrowserRouter>
  )

}

export default App;
