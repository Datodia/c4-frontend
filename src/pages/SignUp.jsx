import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const schema = z.object({
  fullName: z.string().min(2, "არავალიდური სახელი"),
  email: z.string().email("არასწორი იმეილის ფორმატი"),
  password: z.string().min(6, "პაროლი უნდა იყოს 6 სიმბოლოზე მეტი"),
});

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try{
            setError('')
            const resp = await api.post('/auth/sign-up', data)
            if(resp.status === 201){
                navigate('/sign-in')
            }
        }catch(e){
            setError(e.response.data.message)
        }
    }

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit(onSubmit)} className='border-2 p-3 rounded-md w-2/5 flex flex-col gap-3'>
                <input
                    type="text"
                    placeholder='FullName'
                    className='border-2 w-full rounded-md py-2'
                    {...register('fullName')}
                />
                {errors.fullName && <p className='text-red-500'>{errors.fullName.message}</p>}

                <input
                    type="text"
                    placeholder='email'
                    className='border-2 w-full rounded-md py-2'
                    {...register('email')}
                />
                {errors.email && <p className='text-red-500'>{errors.email.message}</p>}


                <input
                    type="password"
                    placeholder='password'
                    className='border-2 w-full rounded-md py-2'
                    {...register('password')}
                />
                {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                {error && <p className='text-red-500'>{error}</p>}

                <button className='bg-blue-500 text-white font-bold p-2'>Sign up</button>
            </form>
        </div>
    )
}
