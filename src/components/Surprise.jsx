import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Heart, ShieldCheck, X } from 'lucide-react'
import './Surprise.css'

/* Ek natural rose petal ka shape (SVG) */
function Petal({ variant }) {
  return (
    <svg viewBox="0 0 60 80" className="petal-svg" aria-hidden="true">
      <path
        d="M30 2 C 48 8, 62 30, 54 52 C 49 68, 38 78, 30 78 C 22 78, 11 68, 6 52 C -2 30, 12 8, 30 2 Z"
        fill={`url(#pg${variant})`}
      />
      <path
        d="M30 8 C 29 30, 31 52, 30 74"
        stroke="rgba(60,0,15,0.28)"
        strokeWidth="0.9"
        fill="none"
      />
      <path
        d="M30 2 C 48 8, 62 30, 54 52 C 49 68, 38 78, 30 78 C 22 78, 11 68, 6 52 C -2 30, 12 8, 30 2 Z"
        fill="url(#pshine)"
      />
    </svg>
  )
}

/* Sab petals ke liye gradients (ek hi baar) */
function PetalDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="pg0" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0405f" />
          <stop offset="0.55" stopColor="#a8112f" />
          <stop offset="1" stopColor="#5e0618" />
        </linearGradient>
        <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ef5b78" />
          <stop offset="0.6" stopColor="#c01c3f" />
          <stop offset="1" stopColor="#750a21" />
        </linearGradient>
        <linearGradient id="pg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f58a9e" />
          <stop offset="0.6" stopColor="#d4415f" />
          <stop offset="1" stopColor="#8d1530" />
        </linearGradient>
        <linearGradient id="pshine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Surprise() {
  const [modal, setModal] = useState(false)
  const [opened, setOpened] = useState(false)
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const [shaking, setShaking] = useState(false)

  const petals = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const size = 16 + Math.random() * 22
        return {
          id: i,
          left: Math.random() * 100,
          size,
          fall: 7 + Math.random() * 7,
          delay: Math.random() * 7,
          sway: 2.2 + Math.random() * 2.6,
          swayAmt: 30 + Math.random() * 70,
          spin: 3 + Math.random() * 4,
          blur: size < 22 ? 1.2 : 0,
          v: i % 3,
        }
      }),
    []
  )

  const openModal = () => {
    if (!opened) setModal(true)
  }

  const verify = (e) => {
    e.preventDefault()
    if (name.trim().toLowerCase() === 'shahzaib') {
      setErr('')
      setModal(false)
      setTimeout(() => setOpened(true), 300)
    } else {
      setErr("Sorry, this surprise isn't meant for you.")
      setShaking(true)
      setTimeout(() => setShaking(false), 450)
    }
  }

  const replay = () => {
    setOpened(false)
    setName('')
    setErr('')
  }

  return (
    <div className={`sp ${opened ? 'is-open' : ''}`}>
      <PetalDefs />

      <div className="sp-brand">
        SHAHZAIB <span>SOFTWARE</span>
      </div>

      {/* rose petals: screen ke upar se bahar se girti hain */}
      {opened && (
        <div className="petals" aria-hidden="true">
          {petals.map((p) => (
            <div
              key={p.id}
              className="petal-fall"
              style={{
                left: `${p.left}%`,
                '--fall': `${p.fall}s`,
                '--delay': `${p.delay}s`,
              }}
            >
              <div
                className="petal-sway"
                style={{
                  '--sway': `${p.sway}s`,
                  '--amt': `${p.swayAmt}px`,
                  '--delay': `${p.delay}s`,
                }}
              >
                <div
                  className="petal-spin"
                  style={{
                    width: p.size,
                    height: p.size * 1.33,
                    '--spin': `${p.spin}s`,
                    filter: p.blur ? `blur(${p.blur}px)` : 'none',
                  }}
                >
                  <Petal variant={p.v} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="intro"
            className="sp-text"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <p className="sp-eyebrow">A SMALL SURPRISE</p>
            <h1 className="sp-title">
              Something is waiting
              <br />
              <em>just for you.</em>
            </h1>
          </motion.div>
        ) : (
          <motion.div
            key="love"
            className="love"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="love-top">I Love You</h2>
            <div className="love-name">Esha</div>
            <Heart className="love-heart" size={34} fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* GIFT BOX (natural look) */}
      <button
        type="button"
        className={`gift ${opened ? 'open' : ''}`}
        onClick={openModal}
        aria-label="Open the gift"
      >
        <svg viewBox="0 0 240 250" className="gift-svg">
          <defs>
            {/* velvet box */}
            <linearGradient id="boxBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4a0716" />
              <stop offset="0.18" stopColor="#8a0f2c" />
              <stop offset="0.5" stopColor="#a8173a" />
              <stop offset="0.82" stopColor="#8a0f2c" />
              <stop offset="1" stopColor="#3f0513" />
            </linearGradient>
            <linearGradient id="boxFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#000" stopOpacity="0.35" />
              <stop offset="0.25" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="lidBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#560819" />
              <stop offset="0.2" stopColor="#9c1233" />
              <stop offset="0.5" stopColor="#bb1d42" />
              <stop offset="0.8" stopColor="#9c1233" />
              <stop offset="1" stopColor="#4a0716" />
            </linearGradient>
            <linearGradient id="lidFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.35" />
            </linearGradient>
            {/* satin ribbon */}
            <linearGradient id="satin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#a8792f" />
              <stop offset="0.25" stopColor="#e9c878" />
              <stop offset="0.5" stopColor="#fff0bd" />
              <stop offset="0.75" stopColor="#d9b25e" />
              <stop offset="1" stopColor="#8f6420" />
            </linearGradient>
            <linearGradient id="satinV" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f6dc98" />
              <stop offset="0.5" stopColor="#c99a46" />
              <stop offset="1" stopColor="#8f6420" />
            </linearGradient>
            <radialGradient id="knot" cx="0.4" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#fff0bd" />
              <stop offset="0.6" stopColor="#d2a550" />
              <stop offset="1" stopColor="#8a5f1d" />
            </radialGradient>
            <linearGradient id="slot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#12020a" />
              <stop offset="1" stopColor="#3a0a1a" />
            </linearGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff2cf" stopOpacity="0.95" />
              <stop offset="0.4" stopColor="#ffb7c5" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ff4d79" stopOpacity="0" />
            </radialGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* floor shadow */}
          <ellipse cx="120" cy="232" rx="88" ry="9" fill="#000" opacity="0.55" filter="url(#soft)" />

          {/* light jo box khulne par bahar aati hai */}
          <ellipse className="inner-glow" cx="120" cy="100" rx="96" ry="64" fill="url(#glow)" />

          {/* BOX BODY */}
          <g>
            <rect x="38" y="104" width="164" height="124" rx="4" fill="url(#boxBody)" />
            <rect x="38" y="104" width="164" height="124" rx="4" fill="url(#boxFade)" />
            {/* andar ka andhera (jab lid khule) */}
            <ellipse className="slot" cx="120" cy="106" rx="80" ry="8" fill="url(#slot)" />
            {/* vertical ribbon */}
            <rect x="106" y="104" width="28" height="124" fill="url(#satin)" />
            <rect x="106" y="104" width="28" height="124" fill="url(#boxFade)" opacity="0.5" />
            <line x1="112" y1="104" x2="112" y2="228" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.8" />
            {/* neeche ka kinara */}
            <rect x="38" y="222" width="164" height="6" rx="2" fill="#000" opacity="0.25" />
          </g>

          {/* LID */}
          <g className="lid">
            <rect x="28" y="78" width="184" height="40" rx="5" fill="url(#lidBody)" />
            <rect x="28" y="78" width="184" height="40" rx="5" fill="url(#lidFade)" />
            <rect x="28" y="78" width="184" height="3" rx="1.5" fill="#fff" opacity="0.18" />
            {/* lid ke neeche ka saaya body par */}
            <rect x="106" y="78" width="28" height="40" fill="url(#satin)" />
            <line x1="112" y1="78" x2="112" y2="118" stroke="#fff" strokeOpacity="0.3" strokeWidth="0.8" />

            {/* BOW */}
            <g transform="translate(120 76)">
              {/* tails */}
              <path d="M -4 2 C -18 14, -34 26, -46 44 L -32 46 C -24 34, -12 24, 2 12 Z" fill="url(#satinV)" />
              <path d="M 4 2 C 18 14, 34 26, 46 44 L 32 46 C 24 34, 12 24, -2 12 Z" fill="url(#satinV)" />
              {/* left loops */}
              <path d="M -2 0 C -26 -34, -62 -34, -64 -12 C -64 6, -30 8, -2 0 Z" fill="url(#satin)" />
              <path d="M -6 -1 C -26 -22, -48 -22, -52 -12 C -52 -4, -30 -2, -6 -1 Z" fill="#7a5016" opacity="0.35" />
              {/* right loops */}
              <path d="M 2 0 C 26 -34, 62 -34, 64 -12 C 64 6, 30 8, 2 0 Z" fill="url(#satin)" />
              <path d="M 6 -1 C 26 -22, 48 -22, 52 -12 C 52 -4, 30 -2, 6 -1 Z" fill="#7a5016" opacity="0.35" />
              {/* top loops */}
              <path d="M -2 -2 C -14 -40, 10 -52, 2 -2 Z" fill="url(#satinV)" opacity="0.9" />
              {/* highlights */}
              <path d="M -56 -16 C -44 -26, -28 -26, -14 -14" stroke="#fff6d2" strokeOpacity="0.55" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              <path d="M 56 -16 C 44 -26, 28 -26, 14 -14" stroke="#fff6d2" strokeOpacity="0.55" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              {/* knot */}
              <ellipse cx="0" cy="0" rx="10" ry="9" fill="url(#knot)" />
              <path d="M -6 -3 C -2 -6, 3 -6, 6 -3" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </button>

      {!opened ? (
        <button type="button" className="sp-btn" onClick={openModal}>
          <Gift size={18} /> Tap to open
        </button>
      ) : (
        <button type="button" className="sp-replay" onClick={replay}>
          ↻ Replay
        </button>
      )}

      {/* POPUP */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="md-back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(false)}
          >
            <motion.form
              className={`md ${shaking ? 'shake' : ''}`}
              onSubmit={verify}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <button
                type="button"
                className="md-close"
                onClick={() => setModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="md-icon">
                <ShieldCheck size={26} />
              </div>
              <h2>Who are you?</h2>
              <p>
                This surprise is protected. Only one person in the world can
                open it. Please verify yourself.
              </p>

              <input
                className="md-input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
              />

              {err && <div className="md-err">{err}</div>}

              <button type="submit" className="md-btn">
                Verify &amp; Open
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}