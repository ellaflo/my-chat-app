import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"

const Home = ({socket}) => {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")

     
    // function that gets executed when the user submits the form
    const handleSubmit = async (e) => {
        e.preventDefault()
        localStorage.setItem("userName", userName)
        socket.emit("newUser", {userName, socketID: socket.id})
        navigate("/chat")
  

     // Send a POST request to the server with the username
     // eslint-disable-next-line
      const response = await fetch("http://localhost:4000/api/username", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ username: userName })
      })
      // If the response is successful, emit a "newUser" event and navigate to the ChatPage
      .then(response => {
        if (response.ok) {
          socket.emit("newUser", { userName, socketID: socket.id })
          navigate("/chat")
        } else {
          throw new Error("Failed to add username.")
        }
      })
      .catch(error => {
        console.error(error)
      })
    }
    
  return (
    <form className='home__container' onSubmit={handleSubmit}>
        <h2 className='home__header'>Sign in to Open Chat</h2>
        <label htmlFor="username">Username</label>
        <input type="text" 
        minLength={6} 
        name="username" 
        id='username'
        className='username__input' 
        value={userName} 
        onChange={e => setUserName(e.target.value)}
        />
        <button className='home__cta'>SIGN IN</button>
    </form>
  )
}

export default Home