import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  RectAreaLight,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

/** Colours mirror the tokens in globals.css (WebGL cannot read CSS variables). */
const OBJECT = 0x0e0e0e;
const ACCENT = 0xff3d2e;

/** One full quarter-and-a-bit turn of twist from the base of the column to its top. */
const TWIST = Math.PI * 0.85;
const HEIGHT = 3.4;

/** A tall square column with a twist along its height: hard faces that catch a raking light. */
function twistedColumn() {
  const geometry = new BoxGeometry(1.15, HEIGHT, 1.15, 1, 240, 1);
  const position = geometry.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    const angle = (v.y / HEIGHT + 0.5) * TWIST;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    position.setXYZ(i, v.x * cos - v.z * sin, v.y, v.x * sin + v.z * cos);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export type HeroScene = { dispose: () => void };

/**
 * The hero object: a single dark twisted column, lit by a tall softbox key light that
 * follows the pointer (damped) and leaves long streaks on the twisted faces, a faint
 * studio reflection for form, a cool rim light and a faint red kicker. Renders only while the
 * hero is on screen and the tab is visible. `still` renders one frame and stops
 * (reduced motion): no idle turn, no pointer light, no scroll response.
 */
export function createHeroScene(
  container: HTMLElement,
  { still, onFirstFrame }: { still: boolean; onFirstFrame: () => void },
): HeroScene {
  // Refuses software rendering where the browser reports it (see gpuAvailable too).
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  RectAreaLightUniformsLib.init();
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const geometry = twistedColumn();
  const material = new MeshPhysicalMaterial({
    color: new Color(OBJECT),
    metalness: 1,
    roughness: 0.32,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.18,
  });
  const column = new Mesh(geometry, material);
  const group = new Group();
  group.add(column);
  group.rotation.set(0.08, 0.6, -0.14);
  scene.add(group);

  scene.add(new AmbientLight(0xffffff, 0.02));
  // Tall softbox in front of the column; it slides with the pointer.
  const key = new RectAreaLight(0xffffff, 9, 0.9, 7);
  key.position.set(2, 0.5, 4);
  key.lookAt(0, 0, 0);
  scene.add(key);
  const rim = new DirectionalLight(0xdfe6ff, 1.4);
  rim.position.set(-4, 3, -5);
  scene.add(rim);
  const kicker = new PointLight(ACCENT, 14, 0, 2);
  kicker.position.set(2.8, -2.6, -1.5);
  scene.add(kicker);

  // Place the column left of centre (the intro column sits on the right).
  let baseY = 0;
  const layout = () => {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const viewHeight = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const viewWidth = viewHeight * camera.aspect;
    baseY = viewHeight * 0.06;
    group.position.set(-viewWidth * 0.07, baseY, 0);
    group.scale.setScalar((viewHeight * 0.5) / HEIGHT);
  };
  layout();

  const pointer = { x: 0.4, y: 0.3 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };

  let frame = 0;
  let visible = true;
  let first = true;
  let compiled = false;
  let disposed = false;
  let last = performance.now();

  const render = () => {
    renderer.render(scene, camera);
    if (first) {
      first = false;
      onFirstFrame();
    }
  };

  const tick = (now: number) => {
    frame = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const scroll = Math.min(1, window.scrollY / Math.max(1, container.clientHeight));

    // Damped key light (about 0.15s time constant), raking across the faces.
    const k = 1 - Math.exp(-dt / 0.15);
    key.position.x += (pointer.x * 5 - key.position.x) * k;
    key.position.y += (pointer.y * 2 - key.position.y) * k;
    key.lookAt(group.position);

    column.rotation.y += dt * 0.18;
    group.rotation.x += (0.08 + pointer.y * 0.12 + scroll * 0.3 - group.rotation.x) * k;
    group.position.y += (baseY + scroll * 1.2 - group.position.y) * k;

    render();
    if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (still || frame || !compiled) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const resize = new ResizeObserver(() => {
    layout();
    if (compiled && (still || !frame)) render();
  });
  resize.observe(container);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(container);

  const onVisibility = () => (document.hidden ? stop() : visible && start());
  document.addEventListener("visibilitychange", onVisibility);

  // Compile shaders off the main thread where the browser allows, then draw.
  renderer.compileAsync(scene, camera).then(() => {
    if (disposed) return;
    compiled = true;
    if (still) render();
    else {
      window.addEventListener("pointermove", onPointer);
      start();
    }
  });

  return {
    dispose() {
      disposed = true;
      stop();
      resize.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
