// src/components/ThreeBackground.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader, TextGeometry, EffectComposer,RenderPass, UnrealBloomPass, } from 'three-stdlib';

/**
 * Pads every attribute (position, normal, uv, …) so the two
 * geometries end up with identical vertex counts.
 */
function equaliseVertexCounts(
  g1: THREE.BufferGeometry,
  g2: THREE.BufferGeometry
): [THREE.BufferGeometry, THREE.BufferGeometry] {
  const a = g1.toNonIndexed();
  const b = g2.toNonIndexed();

  const maxCount = Math.max(
    a.attributes.position.count,
    b.attributes.position.count
  );

  // helper: returns a *new* BufferAttribute padded to targetCount
  const padAttr = (
    attr: THREE.BufferAttribute,
    targetCount: number
  ): THREE.BufferAttribute => {
    if (attr.count === targetCount) return attr;

    const itemSize = attr.itemSize;
    const src      = attr.array as Float32Array;
    const padded   = new Float32Array(targetCount * itemSize);
    padded.set(src);

    for (let i = attr.count; i < targetCount; i++) {
      const k = (i % attr.count) * itemSize;         // repeat originals
      for (let j = 0; j < itemSize; j++) {
        padded[i * itemSize + j] = src[k + j];
      }
    }
    return new THREE.BufferAttribute(padded, itemSize);
  };

  // pad every attribute on each geometry
  [a, b].forEach((geo) => {
    Object.entries(geo.attributes).forEach(([name, attr]) => {
      geo.setAttribute(name, padAttr(attr as THREE.BufferAttribute, maxCount));
    });
  });

  // after tampering with vertices, rebuild normals
  a.computeVertexNormals();
  b.computeVertexNormals();

  return [a, b];
}


const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // ---------- basic setup ----------
    const canvas   = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const onPhone = window.matchMedia('(max-width: 767px)').matches;

    renderer.shadowMap.enabled  = true;
    renderer.shadowMap.type     = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ---------- scene & camera FIRST ----------
    const scene  = new THREE.Scene();           // create them early
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(10, 0, 30);   // 30 units away from the origin

    // ---------- env-map now safe to apply ----------
    // scene & camera already created
    scene.background = new THREE.Color(0xffffff);   // white right away

    const envLoader = new THREE.CubeTextureLoader().setPath('/env/');

    envLoader.load(
      ['px.jpg','nx.jpg','py.jpg','ny.jpg','pz.jpg','nz.jpg'],
      (tex) => {
        (tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
        scene.environment = tex;
      }
    );

    renderer.toneMapping          = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure  = 1.1;

    // ---------- post-processing AFTER camera exists ----------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        onPhone ? 1.1 : 0.25,   // strength
        0.1,   // radius
        0.1  // threshold
      )
    );


    // ---------- lights ----------
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.set(1024, 1024);         // quality
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far  = 120;
    pointLight.shadow.bias = -0.0005;    pointLight.position.set(0, 0, 30);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);

    scene.add(pointLight, ambientLight);

    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const floor     = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      shadowMat
    );
    floor.rotation.x = -Math.PI / 2;   // lie flat
    floor.position.y = -8;             // slightly below the letter
    floor.receiveShadow = true;
    scene.add(floor);

    // ---------- dynamic targets ----------
    const targetRotation     = new THREE.Vector3();
    const targetLightPos     = new THREE.Vector3(5, 5, 5);
    let   textMesh: THREE.Mesh | null = null;
    let targetMorph = 0;   // 0 = J, 1 = O
    let lastBoundsDispatch = 0;
    const raycaster = new THREE.Raycaster();

    const dispatchTextBounds = () => {
      if (!textMesh) return;
      const now = performance.now();
      if (now - lastBoundsDispatch < 60) return;
      lastBoundsDispatch = now;

      const box = new THREE.Box3().setFromObject(textMesh);
      const { min, max } = box;
      const points = [
        new THREE.Vector3(min.x, min.y, min.z),
        new THREE.Vector3(min.x, min.y, max.z),
        new THREE.Vector3(min.x, max.y, min.z),
        new THREE.Vector3(min.x, max.y, max.z),
        new THREE.Vector3(max.x, min.y, min.z),
        new THREE.Vector3(max.x, min.y, max.z),
        new THREE.Vector3(max.x, max.y, min.z),
        new THREE.Vector3(max.x, max.y, max.z),
      ];

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      points.forEach((point) => {
        point.project(camera);
        const x = (point.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-point.y * 0.5 + 0.5) * window.innerHeight;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });

      window.dispatchEvent(
        new CustomEvent('letter-bounds', {
          detail: { left: minX, top: minY, right: maxX, bottom: maxY },
        })
      );
    };

    const isLetterHit = (x: number, y: number) => {
      if (!textMesh) return false;
      const ndc = new THREE.Vector2(
        (x / window.innerWidth) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(textMesh, true).length > 0;
    };

    (window as Window & { __isLetterHit?: (x: number, y: number) => boolean }).__isLetterHit = isLetterHit;

    // ---------- animation loop ----------
    function animate() {
      requestAnimationFrame(animate);

      if (textMesh) {
        textMesh.rotation.x += (targetRotation.x - textMesh.rotation.x) * 0.1;
        textMesh.rotation.y += (targetRotation.y - textMesh.rotation.y) * 0.1;
        textMesh.rotation.z += (targetRotation.z - textMesh.rotation.z) * 0.1;

        const influence = textMesh.morphTargetInfluences![0] || 0;
        textMesh.morphTargetInfluences![0] =
          THREE.MathUtils.lerp(influence, targetMorph, 0.08);
      }

      pointLight.position.lerp(targetLightPos, 0.06);
      dispatchTextBounds();
      composer.render();
    }

    // ---------- build the morphable letter ----------
    new FontLoader().load('/fonts/helvetiker.typeface.json', (font) => {
      const opts = {
        font,
        size: 10,
        height: 2,
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.3,
        bevelSegments: 5,
      };

      // create both letters
      const geoJ = new TextGeometry('J', opts);
      const geoO = new TextGeometry('O', opts);
      geoJ.center();
      geoO.center();

      // equalise vertex counts so they can morph
      const [geoJPadded, geoOPadded] = equaliseVertexCounts(geoJ, geoO);

      // **rebuild normals so the mesh isn’t black**
      geoJPadded.morphAttributes.position = [geoOPadded.attributes.position];
      geoJPadded.computeVertexNormals();
      geoOPadded.computeVertexNormals();

      // attach O as morph-target of J
      geoJ.morphAttributes.position = [geoO.attributes.position];

      const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.0,
        roughness: 0.5,
        envMapIntensity: 1000.2,
      });

      textMesh = new THREE.Mesh(geoJ, material);
      // textMesh.castShadow    = true;
      textMesh.receiveShadow = true;
      textMesh.scale.set(2.5, 2, 0.75);
      textMesh.position.set(onPhone ? 20 : 30, 0, 0);   // 0 on mobile, 10 on desktop
      scene.add(textMesh);

      animate();
    });

    // ---------- scroll handling ----------
    const getScrollContainer = () => document.querySelector('main');
    const updateFromScroll = () => {
      const scrollY     = scrollContainer?.scrollTop ?? 0;
      const snapHeight  = scrollContainer?.clientHeight || window.innerHeight;
      const phase = ((scrollY / snapHeight) % 2);      // 0 … <2, repeats
      targetMorph = phase < 1 ? phase                  // 0→1  (J→O)
                              : 2 - phase;             // 1→0  (O→J)
      targetRotation.set(
        scrollY * 0.002,
        scrollY * 0.002,
        scrollY * 0.002
      );

      targetLightPos.set(
        Math.sin(scrollY * 0.02) * 40,
        Math.cos(scrollY * 0.02) * 40,
        30
      );
      dispatchTextBounds();
    };

    const scrollContainer = getScrollContainer();
    scrollContainer?.addEventListener('scroll', updateFromScroll);
    updateFromScroll();

    // ---------- resize ----------
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      dispatchTextBounds();
    };
    window.addEventListener('resize', handleResize);

    // ---------- cleanup ----------
    return () => {
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', handleResize);
      (window as Window & { __isLetterHit?: (x: number, y: number) => boolean }).__isLetterHit = undefined;
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg"
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default Background;
