"use client"

import React from 'react'
import { Avatar } from '@heroui/react'
import NavItems from '../NavItems'
import ProfileDropDown from '../ProfileDropDown'

const Header = () => {
  
  return (
    <header className='w-full bg-[#0A0713]'>
        <div className='w-[90%] m-auto h-[80px] flex items-center justify-between'>
          <h1> Becodemy </h1>
          <NavItems />
          <ProfileDropDown />
        </div>
    </header>
  )
}

export default Header
 