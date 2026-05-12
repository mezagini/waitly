import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { saveWaitlistEmail } from './services/db'

const app = new Hono()

// Configurar CORS para permitir solicitudes desde el frontend local y producción
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Actualizar con URL de prod cuando se despliegue
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
}))

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/waitlist', async (c) => {
  try {
    const body = await c.req.json()
    const email = body.email

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return c.json({ error: 'Email inválido' }, 400)
    }

    const success = await saveWaitlistEmail(email)
    
    if (success) {
      return c.json({ message: 'Email registrado exitosamente' }, 201)
    } else {
      return c.json({ error: 'No se pudo registrar el email' }, 500)
    }
  } catch (error) {
    console.error('Error en /waitlist:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

export default app
