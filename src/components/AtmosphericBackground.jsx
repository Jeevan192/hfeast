import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AtmosphericBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 42;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    background.appendChild(renderer.domElement);

    const colors = {
      teal: 0x3C7E64,
      tealLight: 0x449776,
      blue: 0x569AE0,
      red: 0xBA3627,
      yellow: 0xF5B62A,
      white: 0xFFFFFF,
    };

    scene.add(new THREE.AmbientLight(colors.white, 0.45));
    const redLight = new THREE.PointLight(colors.red, 18, 70);
    const blueLight = new THREE.PointLight(colors.blue, 22, 75);
    const yellowLight = new THREE.PointLight(colors.yellow, 14, 65);
    const facetLight = new THREE.DirectionalLight(0xEAF6FF, 3.8);
    const rimLight = new THREE.DirectionalLight(colors.tealLight, 1.6);
    scene.add(redLight, blueLight, yellowLight, facetLight, rimLight);

    const prismGroup = new THREE.Group();
    scene.add(prismGroup);
    const prismGeometry = new THREE.OctahedronGeometry(2.2, 0);
    const shardGeometry = new THREE.TetrahedronGeometry(1.3, 0);
    const prismMaterial = new THREE.MeshPhysicalMaterial({
      color: colors.white,
      metalness: 0.08,
      roughness: 0.06,
      transmission: 0.9,
      thickness: 1.8,
      ior: 1.45,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      iridescence: 0.7,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [180, 520],
      flatShading: true,
      transparent: true,
      opacity: 0.94,
    });
    const prismData = [];

    for (let index = 0; index < 34; index += 1) {
      const isShard = index > 15;
      const prism = new THREE.Mesh(isShard ? shardGeometry : prismGeometry, prismMaterial.clone());
      const scale = isShard ? 0.25 + Math.random() * 0.8 : 0.45 + Math.random() * 1.25;
      prism.scale.setScalar(scale);
      prism.position.set(
        (Math.random() - 0.5) * 72,
        (Math.random() - 0.5) * 150,
        -8 - Math.random() * 38,
      );
      prism.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      prism.material.emissive.setHex(colors.white);
      prism.material.emissiveIntensity = 0.035;
      prismGroup.add(prism);
      prismData.push({
        mesh: prism,
        initialY: prism.position.y,
        speed: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        hueOffset: Math.random(),
        riseSpeed: 0.006 + Math.random() * 0.012,
        driftSpeed: 0.12 + Math.random() * 0.2,
        driftAmount: 0.35 + Math.random() * 0.8,
        rotationX: (Math.random() - 0.5) * (isShard ? 0.012 : 0.006),
        rotationY: (Math.random() - 0.5) * (isShard ? 0.016 : 0.008),
      });
    }

    const rayTextureCanvas = document.createElement('canvas');
    rayTextureCanvas.width = 2;
    rayTextureCanvas.height = 256;
    const rayContext = rayTextureCanvas.getContext('2d');
    const rayGradient = rayContext.createLinearGradient(0, 0, 0, 256);
    rayGradient.addColorStop(0, 'rgba(255,255,255,0)');
    rayGradient.addColorStop(0.2, 'rgba(255,255,255,0.7)');
    rayGradient.addColorStop(0.52, 'rgba(255,255,255,1)');
    rayGradient.addColorStop(0.82, 'rgba(255,255,255,0.35)');
    rayGradient.addColorStop(1, 'rgba(255,255,255,0)');
    rayContext.fillStyle = rayGradient;
    rayContext.fillRect(0, 0, 2, 256);
    const rayTexture = new THREE.CanvasTexture(rayTextureCanvas);
    const rayGeometry = new THREE.PlaneGeometry(13, 128);
    const rayData = [];
    [colors.blue, colors.tealLight, colors.yellow, colors.red, colors.blue].forEach((color, index) => {
      const rayMaterial = new THREE.MeshBasicMaterial({
        color,
        map: rayTexture,
        transparent: true,
        opacity: index === 0 ? 0.18 : 0.1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      ray.position.set(-38 + index * 19, (index % 2 ? 12 : -8), -35 - index * 2);
      ray.rotation.z = Math.PI / 4 + (index - 2) * 0.06;
      scene.add(ray);
      rayData.push({ mesh: ray, speed: 0.012 + index * 0.004, drift: 0.8 + index * 0.12 });
    });

    let animationFrame;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    const clock = new THREE.Clock();

    const handlePointerMove = (event) => {
      targetPointerX = (event.clientX / window.innerWidth) * 2 - 1;
      targetPointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      const time = clock.getElapsedTime();
      pointerX += (targetPointerX - pointerX) * 0.035;
      pointerY += (targetPointerY - pointerY) * 0.035;
      camera.position.x = pointerX * 1.8;
      camera.position.y = pointerY * 0.8;
      camera.lookAt(pointerX * 0.8, camera.position.y, -8);

      prismData.forEach(({ mesh, initialY, speed, phase, hueOffset, riseSpeed, driftSpeed, driftAmount, rotationX, rotationY }) => {
        mesh.position.y += riseSpeed;
        mesh.position.x += Math.sin(time * driftSpeed + phase) * 0.012 * driftAmount;
        mesh.position.z += Math.cos(time * driftSpeed * 0.7 + phase) * 0.003;
        if (mesh.position.y > 84) {
          mesh.position.y = -84 - Math.random() * 24;
          mesh.position.x = (Math.random() - 0.5) * 72;
          mesh.position.z = -8 - Math.random() * 38;
          mesh.scale.setScalar(mesh.geometry === shardGeometry ? 0.25 + Math.random() * 0.8 : 0.45 + Math.random() * 1.25);
        }
        mesh.position.y += Math.sin(time * speed + phase) * 0.008;
        const hue = (0.52 + Math.sin(time * 0.18 + hueOffset * Math.PI * 2) * 0.14 + hueOffset * 0.08) % 1;
        mesh.material.color.setHSL(hue, 0.16, 0.9);
        mesh.material.iridescence = 0.62 + Math.sin(time * 0.24 + hueOffset * 5) * 0.2;
        mesh.rotation.x += rotationX;
        mesh.rotation.y += rotationY;
      });
      rayData.forEach(({ mesh, speed, drift }, index) => {
        mesh.position.x = -42 + ((time * speed * 14 + index * 19) % 84);
        mesh.position.y += Math.sin(time * 0.16 + index) * 0.004 * drift;
      });
      redLight.position.set(Math.sin(time * 0.45) * 24, 10, -12);
      blueLight.position.set(Math.cos(time * 0.32) * 25, -8, -10);
      yellowLight.position.set(Math.sin(time * 0.25) * 14, Math.cos(time * 0.35) * 18, -14);
      facetLight.position.set(
        Math.sin(time * 0.42) * 28,
        Math.cos(time * 0.31) * 22,
        18 + Math.sin(time * 0.25) * 8,
      );
      facetLight.target.position.set(pointerX * 3, pointerY * 3, -10);
      rimLight.position.set(
        Math.cos(time * 0.28) * -30,
        Math.sin(time * 0.36) * 24,
        -4,
      );
      rimLight.target.position.set(0, 0, -12);

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrame);
      prismGeometry.dispose();
      shardGeometry.dispose();
      prismData.forEach(({ mesh }) => mesh.material.dispose());
      prismMaterial.dispose();
      rayGeometry.dispose();
      rayData.forEach(({ mesh }) => mesh.material.dispose());
      rayTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={backgroundRef} className="app-background" aria-hidden="true" />;
}
