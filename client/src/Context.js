import axios from 'axios';
import {AxiosResponse} from 'axios';
import {useDispatch, useSelector} from "react-redux";
import { useEffect, createContext, useState } from 'react';
import { login, logout, selectCurrentUser } from './features/currentUser/currentUserSlice';
export const myContext = createContext({});



export default function Context(props){
  const [userObject, setUserObject] = useState();
  useEffect(() =>{
    async function fetchData(){
      await axios.get("http://localhost:5000/getuser", {withCredentials: true}).then((res) =>{
      if(res.data){
        setUserObject(res.data);
      }else{
        if(localStorage.getItem("cartState")){
          localStorage.removeItem("cartState");
        }
      }
    })
    }
    fetchData();
  }, [])
  return(
    <myContext.Provider value={userObject}>{props.children}</myContext.Provider>
  )
}