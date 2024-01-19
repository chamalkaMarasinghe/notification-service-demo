import { io } from "socket.io-client"
import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();
  //const [notifications, setNotifications] = useState([]);
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
      //setNotifications(prevNotifications => [...prevNotifications, obj]);
      const notifications = JSON.parse(localStorage.getItem('notifications'))
      if(notifications){
        notifications.push(obj);
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
    })
  }, [socket])

  useEffect(() => {
    const notifications = JSON.parse(localStorage.getItem('notifications'));
    if(notifications && notifications.length > 0){
      loadNotifications(notifications[notifications.length - 1].dateCreated).then((res) => {
        localStorage.setItem('notifications', JSON.stringify([...notifications, ...res.data]));
      })
    }else{
      loadNotifications(new Date(0)).then((res) => {
        localStorage.setItem('notifications', JSON.stringify(res.data));
      })
    }
  }, [])

  console.log(JSON.parse(localStorage.getItem('notifications')));

  return (
    <div className="App">
      <button className="btn btn-primary" onClick={() => {navigate("/not")}}>Notification page</button>
      <hr/>
      <input type="text" placeholder="input" value={val} onChange={(e) => {setVal(e.target.value)}}/>
      <button onClick={() => {socket.emit("send", {msg : val})}}>send</button>
    </div>
  );
}

export default App;

//setNotifications(prevNotifications => [...prevNotifications, obj]);