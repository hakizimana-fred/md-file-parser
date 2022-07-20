import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

type User = {
    username: string
    password: string
}

const Register= () => {
    const router = useRouter()
    const [user, setUser] = useState<User>({username: '', password: ''})

      useEffect(() => {
        if (localStorage.getItem('user-token')) router.push('/articles/dynamic-routing')
    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => 
        setUser({...user, [e.target.name]: e.target.value})

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            if (await axios.post(`${process.env.baseURL}/api/register`, user)) {

                router.push('/login')
            }
        }catch(err: any) {
            alert(err.response.data.error)
            return
        }
    }
    
    return (
        <form className='user-form' onSubmit={onSubmit}>
            <h1>Register</h1>
            <input type="text" name='username' value={user.username} onChange={onChange} placeholder='username' />
                <input type="password" name='password' value={user.password} onChange={onChange} placeholder='password' />
            <input type="submit" value="Sign up" />
             <h3>Already have account? <Link href="/login">Login</Link> </h3>
        </form>
    )
}


export default Register