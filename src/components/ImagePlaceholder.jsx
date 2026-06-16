import { forwardRef } from 'react'

const ImagePlaceholder = forwardRef(function ImagePlaceholder(
  { label, aspectRatio = '3/4', className = '', style = {} },
  ref
) {
  return (
    <div
      ref={ref}
      className={`image-placeholder ${className}`}
      style={{
        aspectRatio,
        background: 'rgba(201,169,110,0.12)',
        border: '1px solid rgba(201,169,110,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        overflow: 'hidden',
        width: '100%',
        ...style,
      }}
    >
      <span
        style={{
          color: 'rgba(201,169,110,0.6)',
          fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
          textAlign: 'center',
          padding: '1rem',
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </span>
    </div>
  )
})

export default ImagePlaceholder
