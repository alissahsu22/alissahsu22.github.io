import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { domain_expansion_infinite_void } from '../effects/domain_expansion_infinite_void';
import { secret_technique_blue } from '../effects/secret_technique_blue';
import { secret_technique_red } from '../effects/secret_technique_red';
import { secret_technique_purple } from '../effects/secret_technique_purple';
import SignCameraPip from '../components/SignCameraPip';
import HelpHandsPanel from '../components/HelpHandsPanel';

const TECHNIQUE_LABELS = {
  blue: { jp: '術式順転「蒼あお」', en: 'Cursed Technique Reversal: Blue' },
  red: { jp: '術式順転「赤あか」', en: 'Cursed Technique Reversal: Red ' },
  purple: { jp: '虚式「茈」', en: 'Hollow Technique: Purple' },
  infinite_void: { jp: '領域展開「無量空処」', en: 'Domain Expansion: Infinite Void' },
};

export default function SceneCanvas() {
  const canvasRef = useRef(null);
  const gestureActivateRef = useRef(() => {});
  const gestureClearRef = useRef(() => {});
  const [techniqueTitle, setTechniqueTitle] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let titleHideTimer = null;
    const showTechniqueTitle = (variant) => {
      const labels = TECHNIQUE_LABELS[variant];
      if (!labels) return;
      if (titleHideTimer) clearTimeout(titleHideTimer);
      setTechniqueTitle({ variant, ...labels });
      titleHideTimer = setTimeout(() => {
        setTechniqueTitle(null);
        titleHideTimer = null;
      }, 3800);
    };

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const sceneFillAmbient = new THREE.AmbientLight(0x352848, 0.07);
    const sceneFillHemi = new THREE.HemisphereLight(0x241830, 0x050308, 0.11);
    scene.add(sceneFillAmbient, sceneFillHemi);

    let infiniteVoidFx = null;
    let blueFx = null;
    let redFx = null;
    let purpleFx = null;

    let brComboStage = 'idle';
    /** 'blue' | 'red' | 'purple' | null — last technique started by webcam (for clear-on-hand-away). */
    let gestureDrivenTechnique = null;

    const disposeAllEffects = () => {
      brComboStage = 'idle';
      if (infiniteVoidFx) {
        infiniteVoidFx.dispose();
        infiniteVoidFx = null;
      }
      if (blueFx) {
        blueFx.dispose();
        blueFx = null;
      }
      if (redFx) {
        redFx.dispose();
        redFx = null;
      }
      if (purpleFx) {
        purpleFx.dispose();
        purpleFx = null;
      }
    };

    const spawnBlue = () => {
      disposeAllEffects();
      brComboStage = 'after_blue';
      showTechniqueTitle('blue');
      blueFx = secret_technique_blue(scene, {
        count: 140000,
        maxRadius: 6,
        pointSize: 0.012,
        speed: 7,
        insideColor: 0x9fe6ff,
        outsideColor: 0x1a46ff,
        shakePosAmp: 0.06,
        shakeRotAmp: 0.015,
        shakeBurstSeconds: 0.3,
        shakeAlways: true,
      });
    };

    const spawnRed = () => {
      disposeAllEffects();
      redFx = secret_technique_red(scene);
      showTechniqueTitle('red');
    };

    const spawnPurple = () => {
      disposeAllEffects();
      purpleFx = secret_technique_purple(scene, { orbRadius: 1.0, z: -3 });
      showTechniqueTitle('purple');
    };

    const ensureBlueFromGesture = () => {
      if (gestureDrivenTechnique === 'blue' && blueFx) return;
      gestureDrivenTechnique = 'blue';
      spawnBlue();
    };

    const ensureRedFromGesture = () => {
      if (gestureDrivenTechnique === 'red' && redFx) return;
      gestureDrivenTechnique = 'red';
      spawnRed();
    };

    const ensurePurpleFromGesture = () => {
      if (gestureDrivenTechnique === 'purple' && purpleFx) return;
      gestureDrivenTechnique = 'purple';
      spawnPurple();
    };

    const ensureInfiniteVoidFromGesture = () => {
      if (gestureDrivenTechnique === 'infinite_void' && infiniteVoidFx) return;
      gestureDrivenTechnique = 'infinite_void';
      disposeAllEffects();
      showTechniqueTitle('infinite_void');
      infiniteVoidFx = domain_expansion_infinite_void(scene, {
        raysDuration: 0.8,
        beamCount: 2000,
        beamSpeed: 600,
        beamMaxLength: 26,
        beamTravelDistance: 420,
        tunnelRadius: 20,
        tunnelRadiusPower: 1,
        tunnelTwist: 2.4,
        beamColorMode: 'gradient',
        beamInsideColor: 0xff6030,
        beamOutsideColor: 0x1b3984,

        portalColor: 0xbfe8ff,
        portalCoreEdgeColor: 0x86d4ff,
        portalParticleColor: 0xe6f6ff,
      });
    };

    const clearGestureEffects = () => {
      if (gestureDrivenTechnique === null) return;
      if (titleHideTimer) {
        clearTimeout(titleHideTimer);
        titleHideTimer = null;
      }
      setTechniqueTitle(null);
      const g = gestureDrivenTechnique;
      gestureDrivenTechnique = null;
      if (g === 'blue') {
        if (blueFx) {
          blueFx.dispose();
          blueFx = null;
        }
        if (brComboStage === 'after_blue') brComboStage = 'idle';
      } else if (g === 'red') {
        if (redFx) {
          redFx.dispose();
          redFx = null;
        }
        brComboStage = 'idle';
      } else if (g === 'purple') {
        if (purpleFx) {
          purpleFx.dispose();
          purpleFx = null;
        }
        brComboStage = 'idle';
      } else if (g === 'infinite_void') {
        if (infiniteVoidFx) {
          infiniteVoidFx.dispose();
          infiniteVoidFx = null;
        }
        brComboStage = 'idle';
      }
    };

    const activateGestureTechnique = (id) => {
      if (id === 'blue') ensureBlueFromGesture();
      else if (id === 'red') ensureRedFromGesture();
      else if (id === 'purple') ensurePurpleFromGesture();
      else if (id === 'infinite_void') ensureInfiniteVoidFromGesture();
    };

    gestureActivateRef.current = activateGestureTechnique;
    gestureClearRef.current = clearGestureEffects;

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 5;
    const baseCamPos = camera.position.clone();
    const baseCamQuat = camera.quaternion.clone();

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let animationId;
    const clock = new THREE.Clock();
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      if (infiniteVoidFx) infiniteVoidFx.update(dt);
      if (blueFx) blueFx.update(dt);
      if (redFx) redFx.update(dt);
      if (purpleFx) purpleFx.update(dt);

      // Resets camera position + rotation every frame
      camera.position.copy(baseCamPos);
      camera.quaternion.copy(baseCamQuat);

      const t = clock.elapsedTime;
      const shakeA = infiniteVoidFx?.getShake?.(t);
      const shakeB = blueFx?.getShake?.(t);
      const shakeR = redFx?.getShake?.(t);
      const shakeP = purpleFx?.getShake?.(t);

      // looks redundant but only one of them will be non-zero (bc only one effect at a time)
      const shakeX = (shakeA?.x ?? 0) + (shakeB?.x ?? 0) + (shakeR?.x ?? 0);
      const shakeY = (shakeA?.y ?? 0) + (shakeB?.y ?? 0) + (shakeR?.y ?? 0);
      const shakeRotZ =
        (shakeA?.rotZ ?? 0) + (shakeB?.rotZ ?? 0) + (shakeR?.rotZ ?? 0);
      const shakeX2 = shakeX + (shakeP?.x ?? 0);
      const shakeY2 = shakeY + (shakeP?.y ?? 0);
      const shakeRotZ2 = shakeRotZ + (shakeP?.rotZ ?? 0);

      // position shake
      if (shakeX2 || shakeY2 || shakeRotZ2) {
        camera.position.x += shakeX2;
        camera.position.y += shakeY2;

        // rotation shake 
        const q = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 0, 1),
          shakeRotZ2
        );
        camera.quaternion.multiply(q);
      } 
      //  tunnel shake
      else if (infiniteVoidFx) {
        const t = clock.elapsedTime;
        const ampPos = 0.012;
        const ampRot = 0.004;
        camera.position.x += (Math.sin(t * 24.0) + Math.sin(t * 37.0) * 0.55 + Math.sin(t * 113.0) * 0.22) * ampPos;
        camera.position.y += (Math.cos(t * 28.0) + Math.cos(t * 41.0) * 0.55 + Math.sin(t * 127.0) * 0.22) * ampPos;

        const roll = Math.sin(t * 18.0) * ampRot;
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll);
        camera.quaternion.multiply(q);
      }

      renderer.render(scene, camera);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    canvas.focus({ preventScroll: true });

    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      gestureActivateRef.current = () => {};
      gestureClearRef.current = () => {};
      if (titleHideTimer) clearTimeout(titleHideTimer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      disposeAllEffects();
      scene.remove(sceneFillAmbient);
      scene.remove(sceneFillHemi);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="scene-canvas-wrap">
      <SignCameraPip
        onActivateTechnique={(id) => gestureActivateRef.current(id)}
        onClearGestureEffects={() => gestureClearRef.current()}
      />
      <HelpHandsPanel />
      {techniqueTitle && (
        <div
          className={`technique-title-overlay technique-title-overlay--${techniqueTitle.variant}`}
          aria-live="polite"
        >
          <div className="technique-title-overlay__jp">{techniqueTitle.jp}</div>
          <div className="technique-title-overlay__en">{techniqueTitle.en}</div>
        </div>
      )}
      <canvas ref={canvasRef} id="canvas" className="fullscreen-canvas" tabIndex={0} />
    </div>
  );
}