

import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../providers/UserContext'
import Cookies from 'js-cookie'

export default function Header() {
    const {user, setUser} = useContext(UserContext)
    const navItems = [
        {
            label: "Home",
            to: "/"
        },
        {
            label: "Sign Up",
            to: "/sign-up"
        },
        {
            label: "Sign In",
            to: "/sign-in"
        },
    ]
    if(user){
        navItems.pop()
        navItems.pop()
        navItems.push({
            label: 'Add Product',
            to: '/add-product'
        })
    }

    const handleLogOut = () => {
        setUser(null)
        Cookies.remove('accessToken')
    }
  return (
    <header className='py-4 bg-blue-300 flex items-center justify-center'>
        <ul className='flex justify-center items-center gap-4'>
            {navItems.map(item => (
                <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                </li>
            ))}
            {user ? <button className='cursor-pointer' onClick={handleLogOut}>Log Out</button> : null}
        </ul>
    </header>
  )
}
