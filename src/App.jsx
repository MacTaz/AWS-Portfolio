import { useState } from 'react'

import './App.css'

function App() {

  return (
    <div className="flex flex-row h-screen w-screen"> 
    {/*Left Right Layout*/}
      <div className="flex w-1/2 flex-col ml-20 mt-20"> 
      {/*Left Side*/}
      <div className="flex flex-col items-left justify-center">
        {/* Full name */}
        <p>Mico Angelo C. Tazarte</p>
      </div>
      <div className="flex flex-col mt-3 mr-40 justify-self-center">
          <p>Hello! I am a software engineer and a web developer. I have experience in building web applications using React, Node.js, and other modern web technologies. I am passionate about creating user-friendly and efficient applications that solve real-world problems.</p>
      </div>
      <div className="flex flex-col">
      </div>
      </div>
      <div className="flex w-1/2 overflow-y-auto flex-col items-center justify-center"> 
      {/*Right Side*/}
        <p>Projects</p>
      </div>
    </div>
  )
}

export default App 
