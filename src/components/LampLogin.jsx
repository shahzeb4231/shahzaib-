import { useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import './LampLogin.css'

const ANCHOR = { x: 186, y: 130 } // jahan se rope shuru hoti hai
const REST = { x: 186, y: 219 } // rope ka neeche wala ball (rest position)

// chhoti si "click" awaaz (WebAudio)
function playClick() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'square'
    o.frequency.setValueAtTime(900, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.06)
    g.gain.setValueAtTime(0.1, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09)
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.1)
    setTimeout(() => ctx.close(), 300)
  } catch {
    /* audio na chale to koi masla nahi */
  }
}

export default function LampLogin({ onSuccess }) {
  const [on, setOn] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)

  const svgRef = useRef(null)
  const cardRef = useRef(null)
  const drag = useRef(null)

  // ---- rope physics ----
  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const ballX = useTransform(dx, (v) => REST.x + v)
  const ballY = useTransform(dy, (v) => REST.y + v)
  const cordPath = useTransform([dx, dy], ([x, y]) => {
    const ex = REST.x + x
    const ey = REST.y + y
    const cx = ANCHOR.x + x * 0.35
    const cy = (ANCHOR.y + ey) / 2
    return `M ${ANCHOR.x} ${ANCHOR.y} Q ${cx} ${cy} ${ex} ${ey}`
  })

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        top: 25 + Math.random() * 65,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
        dur: 4 + Math.random() * 5,
      })),
    []
  )

  const release = (doToggle) => {
    if (doToggle) {
      playClick()
      setOn((v) => !v)
    }
    const kick = (Math.random() > 0.5 ? 1 : -1) * 110
    animate(dy, 0, { type: 'spring', stiffness: 240, damping: 7, mass: 0.8 })
    animate(dx, 0, {
      type: 'spring',
      stiffness: 90,
      damping: 3.2,
      mass: 0.7,
      velocity: kick,
    })
  }

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = svgRef.current.getBoundingClientRect()
    dx.stop()
    dy.stop()
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      scale: rect.width / 240,
      moved: 0,
    }
  }

  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    const rx = (e.clientX - d.sx) / d.scale
    const ry = (e.clientY - d.sy) / d.scale
    d.moved = Math.max(d.moved, Math.hypot(rx, ry))
    // rubber-band: jitna kheencho utna resistance
    const pull = ry > 0 ? 56 * (1 - Math.exp(-ry / 45)) : 0
    dy.set(pull)
    dx.set(Math.max(-26, Math.min(rx, 26)) * 0.6)
  }

  const onUp = async () => {
    const d = drag.current
    drag.current = null
    if (!d) return
    if (d.moved < 4) {
      // sirf tap kiya: khud halka sa kheench do
      await animate(dy, 26, { duration: 0.09, ease: 'easeOut' })
      release(true)
    } else {
      release(dy.get() > 22)
    }
  }

  // mobile par card ko screen mein le aao
  useEffect(() => {
    if (on && window.innerWidth <= 880) {
      const t = setTimeout(
        () =>
          cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        750
      )
      return () => clearTimeout(t)
    }
  }, [on])

  const submit = (e) => {
    e.preventDefault()
    const okUser = username.trim().toLowerCase() === 'esha'
    const okPass = password.trim().toLowerCase() === 'fatima'
    if (okUser && okPass) {
      setError('')
      onSuccess()
    } else {
      setError('Wrong username or password. Please try again.')
      setShaking(true)
      setTimeout(() => setShaking(false), 450)
    }
  }

  return (
    <div className={`stage ${on ? 'is-on' : ''}`}>
      <div className="ambient" />
      <div className="brand">
        SHAHZAIB <span>SOFTWARE</span>
      </div>

      {/* LEFT: LAMP */}
      <div className="lamp-side">
        <div className="lamp">
          <div className="cone" />
          <div className="halo" />

          <svg ref={svgRef} viewBox="0 0 240 560" className="lamp-svg" aria-label="Lamp">
            <defs>
              <linearGradient id="shadeLit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffd9a0" />
                <stop offset="1" stopColor="#e9a35a" />
              </linearGradient>
              <linearGradient id="shadeOff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#34302c" />
                <stop offset="1" stopColor="#1b1917" />
              </linearGradient>
              <linearGradient id="pole" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0f0f10" />
                <stop offset="0.5" stopColor="#3b3b3f" />
                <stop offset="1" stopColor="#0f0f10" />
              </linearGradient>
            </defs>

            <ellipse cx="120" cy="528" rx="58" ry="12" fill="#121213" />
            <ellipse cx="120" cy="522" rx="46" ry="8" fill="#26262a" />
            <rect x="115" y="150" width="10" height="372" fill="url(#pole)" />
            <rect x="112" y="335" width="16" height="6" rx="2" fill="#b08a4e" />

            <circle className="bulb" cx="120" cy="142" r="13" />

            <polygon points="72,40 168,40 202,130 38,130" fill="url(#shadeOff)" />
            <polygon
              className="shade-lit"
              points="72,40 168,40 202,130 38,130"
              fill="url(#shadeLit)"
            />
            <ellipse cx="120" cy="130" rx="82" ry="5" className="shade-rim" />

            {/* ROPE */}
            <motion.path d={cordPath} className="cord" fill="none" />
            <motion.circle cx={ballX} cy={ballY} r="6" className="cord-ball" />
            <motion.circle
              cx={ballX}
              cy={ballY}
              r="24"
              fill="transparent"
              className="cord-hit"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
          </svg>

          <span className="hint">{on ? 'PULL AGAIN FOR DARK' : 'PULL THE CORD'}</span>
        </div>

        {on &&
          particles.map((p) => (
            <motion.span
              key={p.id}
              className="dust"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
              }}
              animate={{ y: [0, -28, 0], opacity: [0, 0.8, 0] }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
      </div>

      {/* RIGHT: LOGIN CARD */}
      <div className="card-side" ref={cardRef}>
        <AnimatePresence>
          {on && (
            <motion.form
              key="card"
              className={`card ${shaking ? 'shake' : ''}`}
              onSubmit={submit}
              initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow">PRIVATE ACCESS</p>
              <h1>
                Welcome back.
                <br />
                <em>Pull up a chair.</em>
              </h1>

              <label className="label">USERNAME</label>
              <div className="field">
                <User size={16} />
                <input
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  required
                />
              </div>

              <label className="label">PASSWORD</label>
              <div className="field">
                <Lock size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoCapitalize="none"
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="show"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  {showPass ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              <div className="row">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="box" />
                  Keep me signed in
                </label>
              </div>

              <button type="submit" className="signin">
                Sign in
              </button>

              {error && <p className="err">{error}</p>}

              <p className="foot">Crafted by Shahzaib Software</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}