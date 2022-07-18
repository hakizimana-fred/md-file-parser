import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import  argon2 from 'argon2'
import { v4 } from 'uuid'

const users = require('../../db/users.json')

interface IUSER  {
  username: string
  password: string
  hash: string
}

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
        const {password, ...user} = req.body
        // find if user already exists
        if (users.find((u: IUSER) => u.username === user.username)) return res.status(400).json({error: "User already exists"})
        user.id = v4()
        // hash user's password 
        user.hash = await argon2.hash(password)
        user.createdAt = new Date().toISOString().slice(0, 10)
        users.push(user)
        // Save user to users DB
        fs.writeFileSync('db/users.json', JSON.stringify(users, null, 4))
        return res.json({message: "successfully created user"})

    }catch(err) {
        return res.status(400).json({error: (err as Error).message})
    }
}


