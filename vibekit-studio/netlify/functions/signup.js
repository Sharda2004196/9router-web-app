import { PrismaClient } from '@prisma/client'
import { hashPassword, generateToken } from './utils/auth.js'

let prisma

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const prisma = getPrismaClient()

  try {
    const { email, password } = JSON.parse(event.body)

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password required' })
      }
    }

    if (password.length < 8) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Password must be at least 8 characters' })
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email already registered' })
      }
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    })

    const token = generateToken(user.id)

    return {
      statusCode: 201,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: { id: user.id, email: user.email, createdAt: user.createdAt }
      })
    }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    }
  }
}
