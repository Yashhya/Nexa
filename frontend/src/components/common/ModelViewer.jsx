import React, { Suspense, useRef, useState, useEffect, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import { Maximize, Minimize, RefreshCw, Loader2, Play, Pause, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   360° Interactive Image Viewer – Parallax 3D Tilt Fallback
───────────────────────────────────────────────────────────── */
export function SpinViewer({ image, name, autoRotate, onAutoRotateChange, onToggleFullscreen, isFullscreen }) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: 0, y: 0 });
  const timerRef = useRef(null);

  // Auto-spin logic (oscillating tilt)
  useEffect(() => {
    if (autoRotate && !dragging) {
      let angle = 0;
      timerRef.current = setInterval(() => {
        angle += 0.02;
        setRotX(Math.sin(angle) * 5); // subtle up/down
        setRotY(Math.cos(angle) * 15); // subtle left/right
      }, 30);
    }
    return () => clearInterval(timerRef.current);
  }, [autoRotate, dragging]);

  const getPos = (e) => ({
    x: e.touches ? e.touches[0].clientX : e.clientX,
    y: e.touches ? e.touches[0].clientY : e.clientY,
  });

  const onDown = (e) => {
    setDragging(true);
    if (autoRotate) onAutoRotateChange(false); // Stop auto-spin on drag
    const pos = getPos(e);
    startPos.current = pos;
    startRot.current = { x: rotX, y: rotY };
  };

  const onMove = (e) => {
    if (!dragging) return;
    const pos = getPos(e);
    const dx = pos.x - startPos.current.x;
    const dy = pos.y - startPos.current.y;
    // Constrain rotation to realistic angles (e.g. max 35 degrees)
    const newY = Math.max(-35, Math.min(35, startRot.current.y + dx * 0.4));
    const newX = Math.max(-35, Math.min(35, startRot.current.x - dy * 0.4));
    setRotY(newY);
    setRotX(newX);
  };

  const onUp = () => setDragging(false);

  const handleZoom = (dir) => setScale(s => Math.max(0.5, Math.min(3, dir === 'in' ? s * 1.2 : s / 1.2)));
  const handleReset = () => { setRotX(0); setRotY(0); setScale(1); };

  const btnStyle = (extra = {}) => ({
    width: 34, height: 34, borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#e2e8f0', cursor: 'pointer', transition: 'background 0.2s', ...extra,
  });

  return (
    <div
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      style={{
        position: 'relative', width: '100%', height: '100%', minHeight: 340,
        background: 'linear-gradient(135deg,#0d0d17,#1a1a2e)',
        overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none',
      }}
    >
      {/* Fixed Glow Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%, rgba(168,85,247,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Controls – top right */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', gap: 6, pointerEvents: 'auto' }}>
        {[
          { icon: ZoomIn,    title: 'Zoom In',          action: () => handleZoom('in') },
          { icon: ZoomOut,   title: 'Zoom Out',         action: () => handleZoom('out') },
          { icon: RotateCcw, title: 'Reset View',       action: handleReset },
          { icon: autoRotate ? Pause : Play, title: autoRotate ? 'Pause' : 'Auto Rotate', action: () => onAutoRotateChange(!autoRotate) },
          { icon: isFullscreen ? Minimize : Maximize, title: 'Fullscreen', action: onToggleFullscreen },
        ].map(({ icon: Icon, title, action }) => (
          <button key={title} onClick={(e) => { e.stopPropagation(); action(); }} title={title} style={btnStyle()}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(168,85,247,0.45)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Rotating Image Object */}
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1200 }}>
        <img src={image} alt={name} draggable={false}
          style={{
            width: '80%', height: '80%', objectFit: 'contain',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 0.2s ease-out',
            filter: `drop-shadow(${rotY * -0.5}px ${rotX * 0.5 + 20}px 30px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(168,85,247,0.2))`,
            transformStyle: 'preserve-3d',
            mixBlendMode: 'lighten', // Helps blend solid white backgrounds slightly on dark theme
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>

      {/* Badges and Hints */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'linear-gradient(90deg,#6366f1,#a855f7)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(168,85,247,0.45)' }}>
        <span>360° INTERACTIVE</span>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: autoRotate ? '#4ade80' : '#f59e0b', display: 'inline-block', animation: autoRotate ? 'nexaPulse 1.5s infinite' : 'none' }} />
      </div>

      <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: 11, padding: '6px 18px', borderRadius: 99 }}>
          ↔ Drag to rotate · Auto-spinning
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GLTF model component
───────────────────────────────────────────────────────────── */
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/* ─────────────────────────────────────────────────────────────
   Error boundary – shows SpinViewer fallback on model failure
───────────────────────────────────────────────────────────── */
class ModelErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.warn('[ModelViewer] 3D load failed, showing fallback.', err.message); }
  render() {
    if (this.state.hasError) {
      return (
        <SpinViewer 
          image={this.props.fallbackImage} 
          name={this.props.productName} 
          autoRotate={this.props.autoRotate}
          onAutoRotateChange={this.props.setAutoRotate}
          onToggleFullscreen={this.props.toggleFullscreen}
          isFullscreen={this.props.isFullscreen}
        />
      );
    }
    return this.props.children;
  }
}

/* ─────────────────────────────────────────────────────────────
   Main ModelViewer export
───────────────────────────────────────────────────────────── */
export default function ModelViewer({ url, fallbackImage, productName }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate]     = useState(true);
  const containerRef = useRef();
  const controlsRef  = useRef();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  };

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const handleReset = () => controlsRef.current?.reset();

  const handleZoom = (dir) => {
    if (!controlsRef.current) return;
    const factor = dir === 'in' ? 0.8 : 1.25;
    controlsRef.current.dollyIn?.(factor);
    controlsRef.current.update?.();
  };

  /* No URL → show SpinViewer directly */
  if (!url) {
    return (
      <div ref={containerRef} style={{
        position: isFullscreen ? 'fixed' : 'relative', inset: isFullscreen ? 0 : 'auto', zIndex: isFullscreen ? 9999 : 'auto',
        width: '100%', height: '100%', borderRadius: isFullscreen ? 0 : 16, overflow: 'hidden'
      }}>
        <SpinViewer image={fallbackImage} name={productName} autoRotate={autoRotate} onAutoRotateChange={setAutoRotate} onToggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} />
      </div>
    );
  }

  const btnStyle = (extra = {}) => ({
    width: 34, height: 34, borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#e2e8f0', cursor: 'pointer', transition: 'background 0.2s', ...extra,
  });

  return (
    <div ref={containerRef} style={{
      position: isFullscreen ? 'fixed' : 'relative',
      inset: isFullscreen ? 0 : 'auto',
      zIndex: isFullscreen ? 9999 : 'auto',
      width: '100%', height: '100%', minHeight: 340,
      background: '#050508',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: isFullscreen ? 0 : 16,
      overflow: 'hidden',
    }}>
      {/* Controls – top right */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', gap: 6 }}>
        {[
          { icon: ZoomIn,    title: 'Zoom In',          action: () => handleZoom('in') },
          { icon: ZoomOut,   title: 'Zoom Out',         action: () => handleZoom('out') },
          { icon: RotateCcw, title: 'Reset View',       action: handleReset },
          { icon: autoRotate ? Pause : Play, title: autoRotate ? 'Pause' : 'Auto Rotate', action: () => setAutoRotate(r => !r) },
          { icon: isFullscreen ? Minimize : Maximize, title: 'Fullscreen', action: toggleFullscreen },
        ].map(({ icon: Icon, title, action }) => (
          <button key={title} onClick={action} title={title} style={btnStyle()}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(168,85,247,0.45)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Badge – top left */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'linear-gradient(90deg,#6366f1,#a855f7)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(168,85,247,0.4)' }}>
        <span>3D VIEW</span>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: autoRotate ? '#4ade80' : '#f59e0b', display: 'inline-block' }} />
      </div>

      {/* Bottom hint */}
      <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: 11, padding: '6px 18px', borderRadius: 99 }}>
          Drag to rotate · Scroll to zoom · Pinch on mobile
        </div>
      </div>

      {/* Canvas */}
      <Suspense fallback={
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0d0d17', gap: 12 }}>
          <Loader2 size={36} style={{ color: '#a855f7', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Loading 3D model…</p>
        </div>
      }>
        <ModelErrorBoundary fallbackImage={fallbackImage} productName={productName} autoRotate={autoRotate} setAutoRotate={setAutoRotate} toggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen}>
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 150], fov: 45 }}>
            <Stage environment="city" intensity={0.5} adjustCamera={1.2}>
              <Model url={url} />
            </Stage>
            <OrbitControls
              ref={controlsRef}
              makeDefault
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              enableZoom
              enablePan={false}
            />
          </Canvas>
        </ModelErrorBoundary>
      </Suspense>
    </div>
  );
}
