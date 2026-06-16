import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function ModelViewer({ modelPath }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // 创建场景
    const scene = new THREE.Scene()
    scene.background = null  // 透明背景

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // 加载模型
    const loader = new GLTFLoader()
    console.log('开始加载模型:', modelPath)

    loader.load(
      modelPath,
      (gltf) => {
        console.log('GLTF模型解析成功:', gltf)
        const model = gltf.scene

        // 计算模型尺寸并缩放
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const containerSize = Math.min(width, height)
        const scale = (containerSize * 0.7) / maxDim

        model.scale.set(scale, scale, scale)

        // 居中模型
        const center = box.getCenter(new THREE.Vector3())
        model.position.x = -center.x * scale
        model.position.y = -center.y * scale
        model.position.z = -center.z * scale

        scene.add(model)
        console.log('模型加载成功，缩放比例:', scale)
      },
      (progress) => {
        if (progress.total > 0) {
          console.log('加载进度:', (progress.loaded / progress.total * 100).toFixed(1) + '%')
        }
      },
      (error) => {
        console.error('模型加载失败:', error)
      }
    )

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // 处理窗口大小变化
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [modelPath])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'rgba(0,0,0,0.3)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        3D模型加载中...
      </div>
    </div>
  )
}