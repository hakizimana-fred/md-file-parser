import type { NextApiRequest, NextApiResponse } from 'next'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

// sample database
const users = require('../../db/users.json')

interface IUSER  {
    username: string
    password: string
    hash: string
  }

export default async  function login(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
        const { username, password} = req.body
        // find if user exists 
        const user = users.find((u: IUSER) => u.username === username)
        if (!user) throw new Error('User not found!')
        if (!(await argon2.verify(user.hash, password))) throw new Error('Invalid credentials')

        const token = jwt.sign({id: user.id}, 'SAMPLESECRET', {expiresIn: '1d'})

        return res.status(200).json({
          ...user, 
          token
        })
    }catch(err) {
        return res.status(400).json({msg: (err as Error).message})
    }
}
