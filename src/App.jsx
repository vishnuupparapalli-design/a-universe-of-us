import React from 'react'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0c0f17',
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <p style={{
        fontSize: '0.85rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: '#94a3b8',
        marginBottom: '1rem'
      }}>
        Elsewhere
      </p>
      
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '300',
        color: '#f8fafc',
        margin: '0 0 1rem 0',
        letterSpacing: '-0.02em'
      }}>
        Pipeline Verified
      </h1>

      <p style={{
        maxWidth: '480px',
        lineHeight: '1.6',
        color: '#94a3b8',
        fontSize: '1rem',
        margin: '0 0 2rem 0'
      }}>
        One meeting became a memory. Memories became stars. Stars became a little universe.
      </p>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.5rem 1.2rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '0.85rem',
        color: '#38bdf8'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#38bdf8',
          display: 'inline-block'
        }}></span>
        Stage 0: Live pipeline active
      </div>
    </div>
  )
}