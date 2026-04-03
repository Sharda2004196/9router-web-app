export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': 'token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: 'Logged out successfully' })
  }
}
