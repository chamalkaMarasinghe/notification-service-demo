import { io } from "socket.io-client"
import {useEffect, useState} from 'react';

import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "./state/actions";

function App() {

  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.notificationReducer);

  //const[notifications, setNotifications] = useState([])
  const[socket, setSocket] = useState(); 
  const[val, setVal] = useState('')
  
  const loadNotifications = async(lastUpdatedDate) => {
    const req = await fetch(`http://localhost:3001/notifications/${lastUpdatedDate}`, {
      method : "GET",
      headers : {"Content-Type" : "Application/json"}
    })
    const res = req.json();
    return res;
  }

  useEffect(() => {
    setSocket(io("http://localhost:3001"));
  }, [])

  useEffect(() => {
    socket?.on("get", (obj) => {
      console.log(obj.msg);
      dispatch(setNotifications({notifications : [...notifications, obj]}))
    })
  }, [socket])

  useEffect(() => {
    // loadNotifications().then((res) => {setNotifications(res.data);})

    if(notifications.length > 0){
      loadNotifications(notifications[notifications.length - 1].dateCreated).then((res) => {
        if(res.data.length > 0)
          dispatch(setNotifications({notifications : [...notifications, ...res.data]}))
      })
    }
    else{
      loadNotifications(new Date(0)).then((res) => {
        if(res.data.length > 0)
          dispatch(setNotifications({notifications : res.data}));
      })
    }
  }, [])

  console.log(notifications);
  return (
    <div className="App">
      <p>hello fuckers!</p>

      <input type="text" placeholder="input" value={val} onChange={(e) => {setVal(e.target.value)}}/>
      <button onClick={() => {socket.emit("send", {msg : val})}}>send</button>
    </div>
  );
}

export default App;

//setNotifications(prevNotifications => [...prevNotifications, obj]);