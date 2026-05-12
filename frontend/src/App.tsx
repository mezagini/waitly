import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error';

function App() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return;

    setStatus('loading')
    setErrorMessage('')

    try {
      // Llamada al backend
      const response = await fetch('http://localhost:8787/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error inesperado')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Error de conexión')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div className="logo">Waitly</div>
          <span className="badge">Cloudflare Workers Course</span>
        </div>
        
        <div className="content">
          <h1>Únete a la nueva era del <span className="highlight">Edge Computing</span></h1>
          <p className="subtitle">
            Aprende a construir aplicaciones ultrarrápidas y distribuidas globalmente con Platzi y Cloudflare Workers.
          </p>

          {status === 'success' ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>¡Estás en la lista!</h3>
              <p>Te notificaremos tan pronto abramos las inscripciones.</p>
              <button className="reset-button" onClick={() => { setStatus('idle'); setEmail(''); }}>
                Registrar otro email
              </button>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Tu mejor correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  required
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading' || !email}
                  className={status === 'loading' ? 'loading' : ''}
                >
                  {status === 'loading' ? 'Enviando...' : 'Unirme ahora'}
                </button>
              </div>
              
              {status === 'error' && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      
      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </div>
  )
}

export default App
