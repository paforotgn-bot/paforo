'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * WebGL intro: a fullscreen violet/cyan tunnel (raw GLSL fragment shader, no
 * libraries) that plays once per session for ~3.5s and then fades out to reveal
 * the site. Skippable, and disabled under prefers-reduced-motion.
 */
const DURATION = 3500; // ms of tunnel before fade
const FADE = 700; // ms fade-out
const SESSION_KEY = 'paforo:intro-seen';

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_progress; // 0 -> 1 over the intro

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  // accelerate as we approach the end
  float speed = 0.6 + u_progress * 1.6;
  float depth = 0.32 / max(r, 0.04) + u_time * speed;
  float ang = a / 3.14159265;

  // tunnel grooves (rings) + subtle angular twist
  float rings = sin(depth * 16.0) * 0.5 + 0.5;
  float groove = smoothstep(0.15, 0.85, rings);

  // brand palette
  vec3 violet = vec3(0.486, 0.227, 0.929);
  vec3 cyan = vec3(0.05, 0.62, 0.78);
  vec3 col = mix(violet, cyan, 0.5 + 0.5 * sin(depth * 1.6 + ang * 3.0));
  col *= mix(0.18, 1.0, groove);

  // light at the end of the tunnel
  float glow = smoothstep(0.7, 0.0, r);
  col += glow * vec3(0.85, 0.85, 1.0) * (0.5 + 0.5 * u_progress);

  // vignette
  col *= smoothstep(1.5, 0.15, r) + 0.08;

  // whiten / zoom to light at the very end
  float flash = smoothstep(0.78, 1.0, u_progress);
  col = mix(col, vec3(1.0), flash * (0.6 + glow * 0.6));

  gl_FragColor = vec4(col, 1.0);
}
`;

export function IntroTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);

  // Decide whether to show (client-only, once per session, motion-safe).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl');
    if (!canvas || !gl) {
      setShow(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uProg = gl.getUniformLocation(prog, 'u_progress');

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let start = 0;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setFading(true);
      window.setTimeout(() => {
        setShow(false);
        document.body.style.overflow = '';
      }, FADE);
    };

    const loop = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      const progress = Math.min(elapsed / DURATION, 1);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed / 1000);
      gl.uniform1f(uProg, progress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (progress >= 1) {
        finish();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // expose a skip handler
    skipRef.current = finish;

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100000] bg-black transition-opacity duration-700"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto' }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <button
        onClick={() => skipRef.current()}
        className="absolute bottom-6 right-6 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        Saltar
      </button>
    </div>
  );
}
