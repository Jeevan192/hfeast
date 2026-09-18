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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
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
    scene.add(redLight, blueLight, yellowLight);

    const prismGroup = new THREE.Group();
    scene.add(prismGroup);
    const prismGeometry = new THREE.OctahedronGeometry(2.2, 0);
    const prismMaterial = new THREE.MeshPhysicalMaterial({
      color: colors.white,
      metalness: 0.08,
      roughness: 0.12,
      transmission: 0.78,
      thickness: 1.4,
      ior: 1.45,
      transparent: true,
      opacity: 0.9,
    });
    const prismData = [];
    const prismColors = [colors.blue, colors.tealLight, colors.yellow, colors.red];

    for (let index = 0; index < 18; index += 1) {
      const prism = new THREE.Mesh(prismGeometry, prismMaterial.clone());
      const scale = 0.45 + Math.random() * 1.25;
      prism.scale.setScalar(scale);
      prism.position.set(
        (Math.random() - 0.5) * 56,
        (Math.random() - 0.5) * 86,
        -8 - Math.random() * 30,
      );
      prism.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      prism.material.color.setHex(prismColors[index % prismColors.length]);
      prism.material.emissive.setHex(prismColors[index % prismColors.length]);
      prism.material.emissiveIntensity = 0.08;
      prismGroup.add(prism);
      prismData.push({
        mesh: prism,
        initialY: prism.position.y,
        speed: 0.08 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
        rotationX: (Math.random() - 0.5) * 0.004,
        rotationY: (Math.random() - 0.5) * 0.006,
      });
    }

    const rayGeometry = new THREE.PlaneGeometry(10, 100);
    const rayData = [];
    [colors.blue, colors.yellow, colors.red].forEach((color, index) => {
      const rayMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: index === 0 ? 0.13 : 0.08,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      ray.position.set(-22 + index * 22, 0, -35);
      ray.rotation.z = Math.PI / 4 + index * 0.08;
      scene.add(ray);
      rayData.push({ mesh: ray, speed: 0.018 + index * 0.006 });
    });

    let animationFrame;
    let scrollPosition = window.scrollY;
    let targetScroll = window.scrollY;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    const clock = new THREE.Clock();

    const handleScroll = () => { targetScroll = window.scrollY; };
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
      scrollPosition += (targetScroll - scrollPosition) * 0.045;
      pointerX += (targetPointerX - pointerX) * 0.035;
      pointerY += (targetPointerY - pointerY) * 0.035;
      camera.position.x = pointerX * 1.8;
      camera.position.y = -(scrollPosition * 0.018) + pointerY * 0.8;
      camera.lookAt(pointerX * 0.8, camera.position.y, -8);

      prismData.forEach(({ mesh, initialY, speed, phase, rotationX, rotationY }) => {
        mesh.position.y = initialY + Math.sin(time * speed + phase) * 1.4;
        mesh.rotation.x += rotationX;
        mesh.rotation.y += rotationY;
      });
      rayData.forEach(({ mesh, speed }, index) => {
        mesh.position.x = -25 + ((time * speed * 12 + index * 22) % 66);
      });
      redLight.position.set(Math.sin(time * 0.45) * 24, 10, -12);
      blueLight.position.set(Math.cos(time * 0.32) * 25, -8, -10);
      yellowLight.position.set(Math.sin(time * 0.25) * 14, Math.cos(time * 0.35) * 18, -14);

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrame);
      prismGeometry.dispose();
      prismData.forEach(({ mesh }) => mesh.material.dispose());
      prismMaterial.dispose();
      rayGeometry.dispose();
      rayData.forEach(({ mesh }) => mesh.material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={backgroundRef} className="app-background" aria-hidden="true" />;
}
