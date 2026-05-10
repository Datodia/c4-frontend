import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import api from '../lib/axios'
import { useState } from 'react'
import { UserContext } from '../providers/UserContext'

export default function Home() {
    const {user, setUser} = useContext(UserContext) 

    const token = Cookies.get('accessToken')

    const getUserByToken = async (token) => {
        try{
            const resp = await api.get('/auth/current-user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if(resp.status === 200){
                setUser(resp.data)
            }

        }catch(e){
            navigate('/sign-in')
        }
    }

    useEffect(() => {
        getUserByToken(token)
    }, [])


    const [products, setProducts] = useState([])

    const getAllProducts = async () => {
        const resp = await api.get('/products')
        if(resp.status === 200){
            setProducts(resp.data)
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])

    return (
        <div>
            <h1>Home</h1>
            {user ? <h2>Hi, {user.email}</h2> : null}
            <div className='grid grid-cols-3 gap-2'>
                {products.length > 0 ? products.map(product => (
                    <div key={product} className='border-2 rounded-md p-2'>
                        <h1>{product.name}</h1>
                        <h2>{product.price}</h2>
                        <h2>{product.review}</h2>
                        <p className='text-gray-500'>{product.seller.fullName}</p>
                    </div>
                )): <h1>Loading...</h1>}
            </div>
        </div>
    )
}
