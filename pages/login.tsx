import React, { useEffect, useState } from 'react'
import axios, { AxiosResponse} from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'


type User = {
    username: string
    password: string
}

const Login = () => {
    const router = useRouter()
    useEffect(() => {
        if (localStorage.getItem('user-token')) router.push('/articles/dynamic-routing')
    }, [])

    const [user, setUser] = useState<User>({username: '', password: ''})

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => 
        setUser({...user, [e.target.name]: e.target.value})

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try{
            const { data: {token} } = await axios.post(`${process.env.baseURL}/api/login`, user)

            if (token) {
                localStorage.setItem('user-token', token)
                router.push('/')
            }

        }catch(err: any) {
            alert(err.response.data.error)
            return
        }
    }

    return (
        <form className='user-form' onSubmit={onSubmit}>
            <h1>Login</h1>
            <input type="text" name='username' value={user.username} onChange={onChange} placeholder='username' />
            <input type="password" name='password' value={user.password} onChange={onChange} placeholder='password' />
            <input type="submit" value="Sign in" />
            <h3>Dont have account? <Link href="/register">Register</Link> </h3>
        </form>
    )
}


export default Login