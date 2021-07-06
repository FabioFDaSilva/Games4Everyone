import axios from 'axios';
import {AxiosResponse} from 'axios';
import { useEffect, createContext, useState } from 'react';
import { login, logout } from './features/currentUser/currentUserSlice';
export const myContext = createContext({});

export default function Context(props){
  const [userObject, setUserObject] = useState();

  useEffect(async() =>{
    await axios.get("http://localhost:5000/getuser", {withCredentials: true}).then((res) =>{
      if(res.data){
        setUserObject(res.data);
      }
    })
  }, [])
  return(
    <myContext.Provider value={userObject}>{props.children}</myContext.Provider>
  )
}