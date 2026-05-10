import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../providers/UserContext'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../lib/axios';

const schema = z.object({
  name: z.string().min(1, "პროდუქტის სახელი აუცილებელია"),
  price: z.number('ფასი აუცილებელია'),
  desc: z.string().optional(),
});

export default function AddProduct() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(!user){
            navigate('/')
        }
    }, [])

    const token = Cookies.get('accessToken')

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema)
    })
    const [error, setError] = useState('')

    const onSubmit = async (data) => {
        try{
            console.log(data, "data")
            setError('')
            const resp = await api.post('/products', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if(resp.status === 201){
               alert('Product Created Successfully')
               reset()
            }
        }catch(e){
            setError(e.response.data.message)
        }
    }

    if (!user) return null


    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit(onSubmit)} className='border-2 p-3 rounded-md w-2/5 flex flex-col gap-3'>
                <input
                    type="text"
                    placeholder='name'
                    className='border-2 w-full rounded-md py-2'
                    {...register('name')}
                />
                {errors.name && <p className='text-red-500'>{errors.name.message}</p>}

                <input
                    type="number"
                    placeholder='price'
                    className='border-2 w-full rounded-md py-2'
                    {...register('price', { valueAsNumber: true })}
                />
                {errors.price && <p className='text-red-500'>{errors.price.message}</p>}

                <input
                    type="input"
                    placeholder='desc'
                    className='border-2 w-full rounded-md py-2'
                    {...register('desc')}
                />
                {errors.desc && <p className='text-red-500'>{errors.desc.message}</p>}
                {error && <p className='text-red-500'>{error}</p>}

                <button className='bg-blue-500 text-white font-bold p-2'>Create New Product</button>
            </form>
        </div>
    )
}
