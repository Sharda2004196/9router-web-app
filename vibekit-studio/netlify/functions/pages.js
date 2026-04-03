import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from './utils/auth.js'

const prisma = new PrismaClient()

export const handler = async (event) => {
  try {
    const auth = getUserFromRequest(event)
    if (!auth) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      }
    }

    // GET /api/pages - List all pages for current user
    if (event.httpMethod === 'GET' && !event.path.includes('/pages/')) {
      const pages = await prisma.page.findMany({
        where: { userId: auth.userId },
        orderBy: { updatedAt: 'desc' }
      })
      return {
        statusCode: 200,
        body: JSON.stringify({ pages })
      }
    }

    // POST /api/pages - Create new page
    if (event.httpMethod === 'POST') {
      const { title, slug, theme, content } = JSON.parse(event.body)

      if (!title || !slug) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Title and slug required' })
        }
      }

      const existingPage = await prisma.page.findUnique({ where: { slug } })
      if (existingPage) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Slug already exists' })
        }
      }

      const page = await prisma.page.create({
        data: {
          userId: auth.userId,
          title,
          slug,
          theme: theme || 'minimal',
          content: content || {}
        }
      })

      return {
        statusCode: 201,
        body: JSON.stringify({ page })
      }
    }

    // GET /api/pages/:slug - Get single page by slug
    if (event.httpMethod === 'GET') {
      const slug = event.path.split('/').pop()
      const page = await prisma.page.findUnique({ where: { slug } })

      if (!page) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Page not found' })
        }
      }

      // Increment view count
      await prisma.page.update({
        where: { id: page.id },
        data: { viewCount: { increment: 1 } }
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ page: { ...page, viewCount: page.viewCount + 1 } })
      }
    }

    // PUT /api/pages/:id - Update page
    if (event.httpMethod === 'PUT') {
      const id = event.path.split('/').pop()
      const { title, slug, theme, content, status } = JSON.parse(event.body)

      const existingPage = await prisma.page.findUnique({ where: { id } })
      if (!existingPage) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Page not found' })
        }
      }

      if (existingPage.userId !== auth.userId) {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Forbidden' })
        }
      }

      const page = await prisma.page.update({
        where: { id },
        data: { title, slug, theme, content, status }
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ page })
      }
    }

    // DELETE /api/pages/:id - Delete page
    if (event.httpMethod === 'DELETE') {
      const id = event.path.split('/').pop()

      const existingPage = await prisma.page.findUnique({ where: { id } })
      if (!existingPage) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Page not found' })
        }
      }

      if (existingPage.userId !== auth.userId) {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Forbidden' })
        }
      }

      await prisma.page.delete({ where: { id } })

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Page deleted' })
      }
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Pages error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  } finally {
    await prisma.$disconnect()
  }
}
