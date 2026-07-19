import { useState } from 'react'

import './App.css'
import facebook from './assets/facebook.svg'
import linkedin from './assets/linkedin.svg'
import itchio from './assets/itchio.svg'

function App() {

  return (
    <div className="flex flex-row h-screen w-screen font-sans"> 
    {/*Left Right Layout*/}
      <div className="flex w-1/2 flex-col ml-20 mt-20"> 
      {/*Left Side*/}
      <div className="flex flex-col items-left justify-center">
        {/* Full name */}
        <p class="font-inter text-2xl font-bold">Mico Tazarte</p>
      </div>
      <div className="flex flex-col mt-3 mr-120 justify-self-center">
        {/* Description */}
          <p>Hello! I am a software engineer and a web developer. I have experience in building web applications using React, 
            Node.js, and other modern web  technologies. I am passionate about creating user-friendly and efficient applications 
            that solve real-world problems.</p>
      </div>
      <div className="flex flex-col mt-3 mr-40 justify-self-center mt-120"> 
        {/* Footer Icons */}
        <div className="flex flex-row gap-4">
          <a href="https://www.facebook.com/micoangelocruz.tazarte" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="Facebook" className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/mico-angelo-tazarte-7439b1278/" target="_blank" rel="noopener noreferrer">
            <img src={linkedin} alt="LinkedIn" className="w-6 h-6" />
          </a>
          <a href="https://mactaz.itch.io/" target="_blank" rel="noopener noreferrer">
            <img src={itchio} alt="Itch.io" className="w-6 h-6" />
          </a>
        </div>
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
