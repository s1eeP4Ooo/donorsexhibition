import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Prologue.module.css'

gsap.registerPlugin(ScrollTrigger)

const timelineData = [
  { period: '西魏', caves: '285窟' },
  { period: '初唐', caves: '431窟、432窟、96窟、321窟、322窟' },
  { period: '盛唐', caves: '129窟、148窟、166窟、199窟、208窟、217窟、225窟' },
  { period: '吐蕃时期（中唐）', caves: '231窟' },
  { period: '张氏归义军时期（五代）', caves: '156窟、138窟、139窟' },
  { period: '曹氏归义军时期（五代）', caves: '61窟、98窟、108窟、55窟' },
]

const cavesByPeriod = [
  ['285'],
  ['431', '432', '96', '321', '322'],
  ['129', '148', '166', '199', '208', '217', '225'],
  ['231'],
  ['156', '138', '139'],
  ['61', '98', '108', '55'],
]

const allCaves = cavesByPeriod.flat()

const ANGLE_STEP = 25

export default function Prologue({ onUnlock }) {
  const sectionRef = useRef(null)
  const wheelRef = useRef(null)
  const wrapperRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [outroPlayed, setOutroPlayed] = useState(false)
  const crossSectionRef = useRef(null)

  const playOutro = useCallback(() => {
    if (outroPlayed) return
    setOutroPlayed(true)
    const wheel = wheelRef.current
    const tl = gsap.timeline({
      onComplete: () => {
        onUnlock()
      },
    })
    tl.to(wheel, {
      rotation: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        const r = gsap.getProperty(wheel, 'rotation')
        wrapperRefs.current.forEach((wrapper, index) => {
          if (!wrapper) return
          wrapper.style.transform = `rotate(${-(index * ANGLE_STEP + r)}deg)`
        })
        setActiveIndex(Math.max(0, Math.round(-r / ANGLE_STEP)))
      },
    })
    .to(crossSectionRef.current, {
      scale: 5,
      transformOrigin: '90% 85%',
      duration: 1.2,
      ease: 'power2.inOut',
    }, '>-0.2')
  }, [outroPlayed, onUnlock])

  useEffect(() => {
    const section = sectionRef.current
    const wheelEl = wheelRef.current
    if (!section || !wheelEl) return

    const numItems = timelineData.length
    const maxRotation = (numItems - 1) * ANGLE_STEP

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=600%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          const rotation = self.progress * maxRotation
          wheelEl.style.transform = `rotate(${-rotation}deg)`
          wrapperRefs.current.forEach((wrapper, index) => {
            if (!wrapper) return
            const angle = index * ANGLE_STEP
            const netRotation = angle - rotation
            wrapper.style.transform = `rotate(${-netRotation}deg)`
          })
          let newActive = Math.round(rotation / ANGLE_STEP)
          newActive = Math.max(0, Math.min(numItems - 1, newActive))
          setActiveIndex(newActive)
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const activeCaves = new Set(
    cavesByPeriod.slice(0, activeIndex + 1).flat()
  )

  return (
    <section
      id="prologue"
      className={styles.prologue}
      data-section="prologue"
      ref={sectionRef}
    >
      <div className={styles.timelineContainer}>
        <div className={styles.wheel} ref={wheelRef}>
          {timelineData.map((data, i) => {
            const angle = i * ANGLE_STEP
            const isActive = i === activeIndex
            const containerClass = isActive
              ? `${styles.itemContainer} ${styles.active}`
              : styles.itemContainer

            return (
              <div key={`main-${i}`}>
                <div
                  className={containerClass}
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className={styles.dot} />
                  <div
                    className={styles.contentWrapper}
                    ref={(el) => { wrapperRefs.current[i] = el }}
                  >
                    <div className={styles.content}>
                      <div className={styles.period}>{data.period}</div>
                      <div className={styles.details}>
                        <div className={styles.cavesTitle}>代表洞窟</div>
                        <div className={styles.cavesList}>{data.caves}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {i < timelineData.length - 1 && (
                  <div
                    className={`${styles.itemContainer} ${styles.subItem}`}
                    style={{ transform: `rotate(${angle + ANGLE_STEP / 2}deg)` }}
                  >
                    <div className={styles.dot} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 洞窟横截面图层 */}
        <div className={styles.crossSection} ref={crossSectionRef}>
          <img
            src="/picture/prologue/横截面.png"
            alt="洞窟横截面"
            className={styles.crossSectionImg}
          />
          {/* 交互点：曹氏归义军时期显示，位于红框位置（右下角） */}
          {activeIndex === 5 && !outroPlayed && (
            <button
              onClick={playOutro}
              style={{
                position: 'absolute',
                right: '18%',
                bottom: '18%',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.85)',
                background: 'transparent',
                cursor: 'pointer',
                zIndex: 3,
                animation: 'hotspotPulse 2s ease-in-out infinite',
              }}
            />
          )}
        </div>

      </div>
    </section>
  )
}
