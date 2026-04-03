import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from './utils/auth.js'

const prisma = new PrismaClient()

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const auth = getUserFromRequest(event)
    if (!auth) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, email: true, createdAt: true }
    })

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user })
    }
  } catch (error) {
    console.error('Me error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  } finally {
    await prisma.$disconnect()
  }
}
