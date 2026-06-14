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

const otpSchema = z.object({
  otp: z.string().length(6, "OTP კოდი უნდა იყოს 6 ციფრი"),
});

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })
    const {
        register: registerOtp,
        handleSubmit: handleSubmitOtp,
        formState: { errors: otpErrors }
    } = useForm({
        resolver: zodResolver(otpSchema)
    })

    const [error, setError] = useState('')
    const [step, setStep] = useState('signup') // 'signup' | 'otp'
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try{
            setError('')
            const resp = await api.post('/auth/sign-up', data)
            if(resp.status === 201){
                setEmail(data.email)
                setStep('otp')
            }
        }catch(e){
            setError(e.response.data.message)
        }
    }

    const onVerify = async ({ otp }) => {
        try{
            setError('')
            const resp = await api.post('/auth/verify-user', { email, otp })
            if(resp.status === 200){
                navigate('/sign-in')
            }
        }catch(e){
            setError(e.response.data.message)
        }
    }

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            {step === 'signup' ? (
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
            ) : (
                <form onSubmit={handleSubmitOtp(onVerify)} className='border-2 p-3 rounded-md w-2/5 flex flex-col gap-3'>
                    <p className='text-center'>OTP კოდი გაიგზავნა {email}-ზე. შეიყვანე 3 წუთში.</p>
                    <input
                        type="text"
                        placeholder='OTP code'
                        maxLength={6}
                        className='border-2 w-full rounded-md py-2 text-center tracking-widest'
                        {...registerOtp('otp')}
                    />
                    {otpErrors.otp && <p className='text-red-500'>{otpErrors.otp.message}</p>}
                    {error && <p className='text-red-500'>{error}</p>}

                    <button className='bg-blue-500 text-white font-bold p-2'>Verify</button>
                </form>
            )}
        </div>
    )
}
