import { PrismaClient } from '@prisma/client'
import { verifyPassword, generateToken } from './utils/auth.js'

let prisma

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
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

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      }
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      }
    }

    const token = generateToken(user.id)

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: { id: user.id, email: user.email, createdAt: user.createdAt }
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  } finally {
    await prisma.$disconnect()
  }
}
