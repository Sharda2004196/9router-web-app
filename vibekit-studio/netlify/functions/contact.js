import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { pageId, name, email, message } = JSON.parse(event.body)

    if (!pageId || !name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields required' })
      }
    }

    // Verify page exists
    const page = await prisma.page.findUnique({ where: { id: pageId } })
    if (!page) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Page not found' })
      }
    }

    const submission = await prisma.contactSubmission.create({
      data: { pageId, name, email, message }
    })

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Contact submission received',
        submission
      })
    }
  } catch (error) {
    console.error('Contact error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  } finally {
    await prisma.$disconnect()
  }
}
