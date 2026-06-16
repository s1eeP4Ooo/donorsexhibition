import { useState, useEffect } from 'react'
import './App.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hero, Prologue, Chapter1, Chapter2, Chapter3, Chapter4, Epilogue } from './sections'
import PageTransition from './components/PageTransition'
import InteriorScene from './components/InteriorScene'

gsap.registerPlugin(ScrollTrigger)

function Divider() {
  return <div className="section-divider" />
}

export default function App() {
  const [unlockLevel, setUnlockLevel] = useState(0)

  useEffect(() => {
    if (unlockLevel >= 1) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
        if (unlockLevel === 1) {
          document.getElementById('interior-scene')?.scrollIntoView({ behavior: 'smooth' })
        } else if (unlockLevel === 2) {
          document.getElementById('chapter-1')?.scrollIntoView({ behavior: 'smooth' })
        }
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [unlockLevel])

  return (
    <main className="exhibition">
      <Hero />
      <PageTransition />
      <Prologue onUnlock={() => setUnlockLevel(1)} />
      {unlockLevel >= 1 && <InteriorScene onUnlock={() => setUnlockLevel(2)} />}
      {unlockLevel >= 2 && (
        <>
          <Chapter1 />
          <Divider />
          <Chapter2 />
          <Divider />
          <Chapter3 />
          <Divider />
          <Chapter4 />
          <Divider />
          <Epilogue />
        </>
      )}
    </main>
  )
}
