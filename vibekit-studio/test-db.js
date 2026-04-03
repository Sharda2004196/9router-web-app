import { PrismaClient } from '@prisma/client'

async function testConnection() {
  const prisma = new PrismaClient()

  try {
    // Test connection by querying the database
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Check if tables exist by counting users
    const userCount = await prisma.user.count()
    console.log(`✅ User table exists (${userCount} users)`)

    const pageCount = await prisma.page.count()
    console.log(`✅ Page table exists (${pageCount} pages)`)

    const contactCount = await prisma.contactSubmission.count()
    console.log(`✅ ContactSubmission table exists (${contactCount} submissions)`)

    console.log('\n🎉 Phase 1 database setup complete!')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
