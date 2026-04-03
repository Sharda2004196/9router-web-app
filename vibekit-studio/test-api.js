import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:8888/api'
let authToken = ''
let testPageId = ''
let testPageSlug = ''

async function test(name, fn) {
  try {
    await fn()
    console.log(`✅ ${name}`)
  } catch (error) {
    console.error(`❌ ${name}`)
    console.error(`   Error: ${error.message}`)
  }
}

async function signup() {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    })
  })

  if (!res.ok) throw new Error(`Signup failed: ${await res.text()}`)

  const cookies = res.headers.get('set-cookie')
  authToken = cookies.match(/token=([^;]+)/)?.[1]

  if (!authToken) throw new Error('No token received')

  const data = await res.json()
  if (!data.user) throw new Error('No user data')
}

async function login() {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  if (res.status === 401) return // Expected for non-existent user
  if (!res.ok) throw new Error(`Login failed: ${await res.text()}`)
}

async function me() {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Cookie: `token=${authToken}` }
  })

  if (!res.ok) throw new Error(`Me failed: ${await res.text()}`)

  const data = await res.json()
  if (!data.user) throw new Error('No user data')
}

async function createPage() {
  testPageSlug = `test-page-${Date.now()}`

  const res = await fetch(`${BASE_URL}/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${authToken}`
    },
    body: JSON.stringify({
      title: 'Test Page',
      slug: testPageSlug,
      theme: 'minimal',
      content: { sections: [] }
    })
  })

  if (!res.ok) throw new Error(`Create page failed: ${await res.text()}`)

  const data = await res.json()
  testPageId = data.page.id
  if (!testPageId) throw new Error('No page ID')
}

async function listPages() {
  const res = await fetch(`${BASE_URL}/pages`, {
    headers: { Cookie: `token=${authToken}` }
  })

  if (!res.ok) throw new Error(`List pages failed: ${await res.text()}`)

  const data = await res.json()
  if (!Array.isArray(data.pages)) throw new Error('Pages not an array')
}

async function getPage() {
  const res = await fetch(`${BASE_URL}/pages/${testPageSlug}`, {
    headers: { Cookie: `token=${authToken}` }
  })

  if (!res.ok) throw new Error(`Get page failed: ${await res.text()}`)

  const data = await res.json()
  if (!data.page) throw new Error('No page data')
}

async function updatePage() {
  const res = await fetch(`${BASE_URL}/pages/${testPageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${authToken}`
    },
    body: JSON.stringify({
      title: 'Updated Test Page',
      slug: testPageSlug,
      theme: 'minimal',
      content: { sections: [{ type: 'hero' }] },
      status: 'published'
    })
  })

  if (!res.ok) throw new Error(`Update page failed: ${await res.text()}`)
}

async function submitContact() {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageId: testPageId,
      name: 'Test User',
      email: 'contact@example.com',
      message: 'Test message'
    })
  })

  if (!res.ok) throw new Error(`Contact submission failed: ${await res.text()}`)
}

async function deletePage() {
  const res = await fetch(`${BASE_URL}/pages/${testPageId}`, {
    method: 'DELETE',
    headers: { Cookie: `token=${authToken}` }
  })

  if (!res.ok) throw new Error(`Delete page failed: ${await res.text()}`)
}

async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: { Cookie: `token=${authToken}` }
  })

  if (!res.ok) throw new Error(`Logout failed: ${await res.text()}`)
}

async function runTests() {
  console.log('\n🧪 Testing VibeKit Studio API Endpoints\n')
  console.log('Make sure Netlify Dev is running: npm run dev\n')

  await test('1. Signup', signup)
  await test('2. Login (with wrong credentials)', login)
  await test('3. Get current user', me)
  await test('4. Create page', createPage)
  await test('5. List pages', listPages)
  await test('6. Get page by slug', getPage)
  await test('7. Update page', updatePage)
  await test('8. Submit contact form', submitContact)
  await test('9. Delete page', deletePage)
  await test('10. Logout', logout)

  console.log('\n🎉 Phase 2 API testing complete!\n')
}

runTests()
