"use client";

import { useEffect, useRef } from "react";

/**
 * Red neuronal del hero, dibujada en Canvas 2D.
 *
 * Una nube de nodos en 3D que gira despacio, con pulsos que viajan por las
 * conexiones y una "senda" resaltada que cruza la red de un extremo al otro.
 * Reacciona al cursor, se pausa fuera de pantalla o con la pestaña oculta, y
 * con movimiento reducido dibuja un único cuadro estático.
 */

type Point = { x: number; y: number; z: number; hub: boolean; phase: number };
type Projected = { sx: number; sy: number; depth: number; scale: number };
type Pulse = { edge: number; forward: boolean; t: number; speed: number; hops: number; signal: boolean };
type Rgb = [number, number, number];

const PALETTE: Record<"dark" | "light", { edge: Rgb; node: Rgb; core: Rgb; signal: Rgb; additive: boolean }> = {
  dark: { edge: [183, 103, 255], node: [199, 146, 255], core: [244, 236, 255], signal: [84, 234, 234], additive: true },
  light: { edge: [126, 28, 216], node: [126, 28, 216], core: [100, 23, 196], signal: [0, 123, 136], additive: false },
};

const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r},${g},${b},${a})`;

/** Generador pseudoaleatorio con semilla: la red es idéntica en cada visita. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork(count: number) {
  const random = mulberry32(20260217);
  const points: Point[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    // Esfera de Fibonacci con radio variable: nodos en la superficie y en el interior.
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const radius = 0.5 + 0.5 * Math.sqrt(random());
    points.push({
      x: Math.cos(theta) * ring * radius,
      y: y * radius * 0.86,
      z: Math.sin(theta) * ring * radius,
      hub: i % 9 === 4,
      phase: random() * Math.PI * 2,
    });
  }

  // Cada nodo se conecta con sus tres vecinos más cercanos.
  const keys = new Set<string>();
  const edges: [number, number][] = [];
  const neighbors: number[][] = points.map(() => []);
  for (let i = 0; i < count; i++) {
    const nearest = points
      .map((p, j) => ({ j, d: (p.x - points[i].x) ** 2 + (p.y - points[i].y) ** 2 + (p.z - points[i].z) ** 2 }))
      .filter((entry) => entry.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (keys.has(key)) continue;
      keys.add(key);
      neighbors[i].push(edges.length);
      neighbors[j].push(edges.length);
      edges.push(i < j ? [i, j] : [j, i]);
    }
  }

  // La senda: el camino más corto (en saltos) desde el nodo más a la izquierda
  // hasta el nodo alcanzable más a la derecha.
  const start = points.reduce((best, p, i) => (p.x < points[best].x ? i : best), 0);
  const parent = new Array<number>(count).fill(-1);
  const viaEdge = new Array<number>(count).fill(-1);
  const seen = new Array<boolean>(count).fill(false);
  const queue = [start];
  seen[start] = true;
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    for (const edgeIndex of neighbors[node]) {
      const [a, b] = edges[edgeIndex];
      const next = a === node ? b : a;
      if (seen[next]) continue;
      seen[next] = true;
      parent[next] = node;
      viaEdge[next] = edgeIndex;
      queue.push(next);
    }
  }
  const end = queue.reduce((best, i) => (points[i].x > points[best].x ? i : best), start);
  const route: number[] = [];
  const routeEdges = new Set<number>();
  for (let node = end; node !== -1; node = parent[node]) {
    route.unshift(node);
    if (viaEdge[node] !== -1) routeEdges.add(viaEdge[node]);
  }

  return { points, edges, neighbors, route, routeEdges };
}

function makeGlow(color: Rgb, strength: number) {
  const size = 64;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const context = sprite.getContext("2d");
  if (!context) return sprite;
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, rgba(color, strength));
  gradient.addColorStop(0.25, rgba(color, strength * 0.45));
  gradient.addColorStop(1, rgba(color, 0));
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return sprite;
}

export function NeuralField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let compact = false;
    let network = buildNetwork(110);
    let projected: Projected[] = [];
    let pulses: Pulse[] = [];
    let palette = PALETTE.dark;
    let nodeGlow: HTMLCanvasElement | null = null;
    let signalGlow: HTMLCanvasElement | null = null;

    let frame = 0;
    let running = false;
    let onScreen = true;
    let last = 0;
    let clock = 0;
    let intro = 0;
    let spawnTimer = 0;
    let routeProgress = 0;

    const pointer = { x: -9999, y: -9999, active: false };
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
    const random = mulberry32(77);

    const applyTheme = () => {
      palette = root.dataset.theme === "light" ? PALETTE.light : PALETTE.dark;
      nodeGlow = makeGlow(palette.node, palette.additive ? 0.9 : 0.28);
      signalGlow = makeGlow(palette.signal, palette.additive ? 1 : 0.4);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Al volver a mostrarse una ruta oculta puede llegar un tamaño 0×0: se ignora.
      if (rect.width < 2 || rect.height < 2) return false;
      width = rect.width;
      height = rect.height;
      const nextCompact = width < 900;
      const target = Math.max(48, Math.min(120, Math.round((width * height) / 11000)));
      if (nextCompact !== compact || Math.abs(target - network.points.length) > 14) {
        compact = nextCompact;
        network = buildNetwork(target);
        pulses = [];
      }
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3_400_000 / (width * height))));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    const spawnPulse = () => {
      const edge = Math.floor(random() * network.edges.length);
      pulses.push({
        edge,
        forward: random() > 0.5,
        t: 0,
        speed: 0.0009 + random() * 0.0008,
        hops: 2 + Math.floor(random() * 5),
        signal: random() > 0.72,
      });
    };

    const project = () => {
      const centerX = compact ? width * 0.68 : width * 0.735;
      const centerY = compact ? height * 0.25 : height * 0.47;
      const radius = compact ? Math.min(width * 0.56, height * 0.3) : Math.min(width * 0.3, height * 0.5);
      const angleY = clock * 0.00009 + parallax.x * 0.5;
      const angleX = -0.22 + parallax.y * 0.3;
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      projected = network.points.map((point) => {
        const breathe = 1 + Math.sin(clock * 0.0006 + point.phase) * 0.025;
        const x = point.x * breathe;
        const y = point.y * breathe;
        const z = point.z * breathe;
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const scale = 2.7 / (2.7 + z2);
        return {
          sx: centerX + x1 * radius * scale,
          sy: centerY + y1 * radius * scale,
          depth: Math.min(1, Math.max(0, (1 - z2) / 2)),
          scale,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (!projected.length) return;

      const fade = compact ? 0.5 : 1;
      const grow = Math.min(1, intro);
      ctx.globalCompositeOperation = palette.additive ? "lighter" : "source-over";
      ctx.lineCap = "round";

      // Conexiones: aparecen progresivamente durante la entrada.
      const edgeLimit = Math.ceil(network.edges.length * grow);
      for (let i = 0; i < edgeLimit; i++) {
        if (network.routeEdges.has(i)) continue;
        const [a, b] = network.edges[i];
        const pa = projected[a];
        const pb = projected[b];
        const depth = (pa.depth + pb.depth) / 2;
        ctx.strokeStyle = rgba(palette.edge, (0.05 + depth * 0.24) * fade);
        ctx.lineWidth = 0.6 + depth * 0.7;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }

      // La senda resaltada.
      const route = network.route;
      if (route.length > 1) {
        const reach = routeProgress * (route.length - 1);
        ctx.strokeStyle = rgba(palette.signal, 0.6 * fade);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i < route.length - 1; i++) {
          if (i >= reach) break;
          const from = projected[route[i]];
          const to = projected[route[i + 1]];
          const part = Math.min(1, reach - i);
          ctx.moveTo(from.sx, from.sy);
          ctx.lineTo(from.sx + (to.sx - from.sx) * part, from.sy + (to.sy - from.sy) * part);
        }
        ctx.stroke();

        for (let i = 0; i < route.length; i++) {
          if (i > reach) break;
          const p = projected[route[i]];
          ctx.strokeStyle = rgba(palette.signal, 0.85 * fade);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 4.5 + p.depth * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Viajero que recorre la senda en bucle.
        if (routeProgress >= 1) {
          const travel = ((clock * 0.00012) % 1) * (route.length - 1);
          const index = Math.min(route.length - 2, Math.floor(travel));
          const from = projected[route[index]];
          const to = projected[route[index + 1]];
          const part = travel - index;
          const x = from.sx + (to.sx - from.sx) * part;
          const y = from.sy + (to.sy - from.sy) * part;
          if (signalGlow) ctx.drawImage(signalGlow, x - 22, y - 22, 44, 44);
          ctx.fillStyle = rgba(palette.signal, 1);
          ctx.beginPath();
          ctx.arc(x, y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Nodos.
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const point = network.points[i];
        const distance = pointer.active ? Math.hypot(p.sx - pointer.x, p.sy - pointer.y) : Infinity;
        const boost = distance < 170 ? 1 - distance / 170 : 0;
        const size = (point.hub ? 30 : 15) * (0.45 + p.depth * 0.9) * (1 + boost * 0.9) * grow;
        if (nodeGlow) {
          ctx.globalAlpha = (0.35 + p.depth * 0.65) * fade;
          ctx.drawImage(nodeGlow, p.sx - size / 2, p.sy - size / 2, size, size);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = rgba(palette.core, (0.45 + p.depth * 0.55 + boost * 0.3) * fade);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, (point.hub ? 2.3 : 1.25) * (0.6 + p.depth * 0.8) * (1 + boost * 0.6), 0, Math.PI * 2);
        ctx.fill();

        if (boost > 0.08) {
          ctx.strokeStyle = rgba(palette.signal, boost * 0.5);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.sx, p.sy);
          ctx.stroke();
        }
      }

      // Pulsos que viajan por las conexiones.
      for (const pulse of pulses) {
        const [a, b] = network.edges[pulse.edge];
        const from = projected[pulse.forward ? a : b];
        const to = projected[pulse.forward ? b : a];
        const color = pulse.signal ? palette.signal : palette.node;
        const headX = from.sx + (to.sx - from.sx) * pulse.t;
        const headY = from.sy + (to.sy - from.sy) * pulse.t;
        const tail = Math.max(0, pulse.t - 0.4);
        const tailX = from.sx + (to.sx - from.sx) * tail;
        const tailY = from.sy + (to.sy - from.sy) * tail;
        const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
        gradient.addColorStop(0, rgba(color, 0));
        gradient.addColorStop(1, rgba(color, 0.95 * fade));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();
        const sprite = pulse.signal ? signalGlow : nodeGlow;
        if (sprite) ctx.drawImage(sprite, headX - 9, headY - 9, 18, 18);
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const step = (dt: number) => {
      clock += dt;
      intro = Math.min(1, intro + dt / 1500);
      if (intro >= 0.6) routeProgress = Math.min(1, routeProgress + dt / 2200);

      parallax.x += (parallax.tx - parallax.x) * Math.min(1, dt * 0.004);
      parallax.y += (parallax.ty - parallax.y) * Math.min(1, dt * 0.004);

      spawnTimer += dt;
      const maxPulses = compact ? 5 : 11;
      if (spawnTimer > 240 && pulses.length < maxPulses && intro >= 1) {
        spawnTimer = 0;
        spawnPulse();
      }

      for (const pulse of pulses) pulse.t += pulse.speed * dt;
      pulses = pulses.flatMap((pulse) => {
        if (pulse.t < 1) return [pulse];
        if (pulse.hops <= 0) return [];
        // Al llegar a un nodo, el pulso salta a otra conexión de ese nodo.
        const [a, b] = network.edges[pulse.edge];
        const arrival = pulse.forward ? b : a;
        const options = network.neighbors[arrival].filter((edge) => edge !== pulse.edge);
        if (!options.length) return [];
        const edge = options[Math.floor(random() * options.length)];
        return [{ ...pulse, edge, forward: network.edges[edge][0] === arrival, t: 0, hops: pulse.hops - 1 }];
      });
    };

    const tick = (now: number) => {
      frame = 0;
      if (!running) return;
      const dt = Math.min(50, last ? now - last : 16);
      last = now;
      step(dt);
      project();
      draw();
      frame = window.requestAnimationFrame(tick);
    };

    const renderStatic = () => {
      intro = 1;
      routeProgress = 1;
      clock = 42000;
      project();
      draw();
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reducedMotion.matches && width > 0;
      if (shouldRun && !running) {
        running = true;
        last = 0;
        frame = window.requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      }
      if (reducedMotion.matches && width > 0) renderStatic();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height && event.pointerType !== "touch";
      parallax.tx = (event.clientX / window.innerWidth - 0.5) * 0.6;
      parallax.ty = (event.clientY / window.innerHeight - 0.5) * 0.6;
    };

    applyTheme();
    if (resize()) sync();

    const resizeObserver = new ResizeObserver(() => {
      if (resize()) sync();
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    intersection.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      applyTheme();
      if (!running && width > 0) {
        project();
        draw();
      }
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
