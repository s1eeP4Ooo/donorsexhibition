export default function ExhibitPanel({ title, subtitle, description, visible, onClose }) {
  return (
    <div
      className={`exhibit-panel ${visible ? 'exhibit-panel--visible' : ''}`}
      style={{
        position: 'absolute',
        right: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        maxWidth: '380px',
        width: '90%',
        border: '1px solid rgba(26,26,26,0.3)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        borderRadius: '6px',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.4s ease',
        zIndex: 20,
      }}
    >
      {title && (
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: '#8b5e2a',
            marginBottom: '0.5rem',
            fontWeight: 400,
          }}
        >
          {title}
        </h4>
      )}
      {subtitle && (
        <p
          style={{
            fontSize: '0.85rem',
            color: '#4a4040',
            marginBottom: '1rem',
          }}
        >
          {subtitle}
        </p>
      )}
      {description && (
        <p
          style={{
            fontSize: '0.9rem',
            color: '#1a1a1a',
            lineHeight: 1.8,
          }}
        >
          {description}
        </p>
      )}
      <button
        onClick={onClose}
        aria-label="关闭"
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'none',
          border: 'none',
          color: '#4a4040',
          fontSize: '1.25rem',
          cursor: 'pointer',
          lineHeight: 1,
          padding: '4px',
        }}
      >
        &times;
      </button>
    </div>
  )
}
