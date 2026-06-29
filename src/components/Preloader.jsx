import { useState, useEffect, useRef } from 'react'
import ASSETS from '../assets'

function loadImageWithProgress(src, onProgress) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', src, true)
    xhr.responseType = 'blob'

    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(e.loaded, e.total)
      }
    }

    xhr.onload = () => {
      onProgress(1, 1)
      resolve()
    }

    xhr.onerror = () => {
      onProgress(1, 1)
      resolve()
    }

    xhr.send()
  })
}

function loadModelWithProgress(src, onProgress) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', src, true)
    xhr.responseType = 'arraybuffer'

    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(e.loaded, e.total)
      }
    }

    xhr.onload = () => {
      onProgress(1, 1)
      resolve()
    }

    xhr.onerror = () => {
      onProgress(1, 1)
      resolve()
    }

    xhr.send()
  })
}

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)
  const progressRef = useRef({})

  useEffect(() => {
    const total = ASSETS.length
    if (total === 0) {
      setProgress(100)
      return
    }

    const itemProgress = {}

    const recalc = () => {
      let loaded = 0
      for (const key in itemProgress) {
        const p = itemProgress[key]
        if (p.total > 0) {
          loaded += p.loaded / p.total
        } else {
          loaded += 1
        }
      }
      const pct = Math.min(100, Math.round((loaded / total) * 100))
      setProgress(pct)
    }

    const promises = ASSETS.map((asset, i) => {
      const key = String(i)
      itemProgress[key] = { loaded: 0, total: 1 }

      const onProgress = (loaded, total) => {
        itemProgress[key] = { loaded, total }
        recalc()
      }

      if (asset.type === 'model') {
        return loadModelWithProgress(asset.src, onProgress)
      }
      return loadImageWithProgress(asset.src, onProgress)
    })

    Promise.all(promises).then(() => {
      setProgress(100)
      setTimeout(() => {
        setFadingOut(true)
        setTimeout(() => {
          onComplete()
        }, 800)
      }, 300)
    })
  }, [onComplete])

  return (
    <div className={`preloader${fadingOut ? ' preloader--fading' : ''}`}>
      <div className="preloader__content">
        <div className="preloader__text">加载中</div>
        <div className="preloader__bar-wrap">
          <div
            className="preloader__bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="preloader__percent">{progress}%</div>
      </div>
    </div>
  )
}
