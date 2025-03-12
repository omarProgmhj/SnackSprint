import React, { useState } from 'react'
import Login from '../shared/Login'
import Signup from '../shared/Signup';
import Verification from '../shared/Auth/Verification';

function AuthScreen({ setOpen }: { setOpen: (e: boolean) => void }) {

    const [activeState, setActiveState] = useState("Login"); 

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target instanceof HTMLDivElement && e.target.id === "screen") {
        setOpen(false);
      }
    }; 
    
  return (
    <div className="w-full fixed top-0 left-0 h-screen z-50 flex items-center justify-center bg-[#00000027]"
        id='auth-screen'
        onClick={handleClose}
    >
        <div className="w-[500px] bg-slate-900 rounded shadow-sm p-3"
            id="screen"
            onClick={handleClose}
        >
            {activeState === "Login" && <Login setActiveState={setActiveState} setOpen={setOpen} />}
            {activeState === "Signup" && <Signup setActiveState={setActiveState} />}
            {activeState === "Verification" && <Verification setActiveState={setActiveState} />}
        </div>
    </div>
  )
}

export default AuthScreen
