import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './PageTransition.css'

gsap.registerPlugin(ScrollTrigger)

export default function PageTransition() {
  const sectionRef = useRef(null)
  const curtainRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const curtain = curtainRef.current
    const label = labelRef.current
    if (!section || !curtain || !label) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=80%',
          pin: true,
          scrub: 1,
        },
      })

      // 遮罩从底部滑上覆盖整个屏幕
      tl.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, ease: 'none' }, 0)
      // 标签文字在遮罩到位后淡入
      tl.fromTo(label, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'none' }, 0.5)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="page-transition" ref={sectionRef}>
      <div className="page-transition__curtain" ref={curtainRef}>
        <div className="page-transition__label" ref={labelRef}>
          <span className="page-transition__rule" />
          <span className="page-transition__word">序　章</span>
          <span className="page-transition__rule" />
        </div>
      </div>
    </section>
  )
}
