import { useState } from 'react'

export default function InteriorScene({ onUnlock }) {
  const [unlocked, setUnlocked] = useState(false)

  const handleUnlock = () => {
    setUnlocked(true)
    onUnlock()
  }

  return (
    <section id="interior-scene" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <img
        src="/picture/prologue/Gemini_Generated_285窟内景.png"
        alt="285窟内景"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {!unlocked && (
        <button
          onClick={handleUnlock}
          style={{
            position: 'absolute',
            top: '12%',
            right: '8%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.85)',
            background: 'transparent',
            cursor: 'pointer',
            zIndex: 10,
            animation: 'hotspotPulse 2s ease-in-out infinite',
          }}
        />
      )}
    </section>
  )
}
