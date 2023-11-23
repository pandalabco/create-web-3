"use client";
import * as THREE from "three";
import React, { MutableRefObject, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Center,
  AccumulativeShadows,
  RandomizedLight,
  useTexture,
  Decal
} from "@react-three/drei";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import state from "@cw3/lib/store";

function Shirt(props: any) {
  const snap = useSnapshot(state);
  const { nodes, materials }: any = useGLTF(
    "https://6r7zpz.csb.app/shirt_baked_collapsed.glb"
  );
  const texture = useTexture("/logo.png");
  useFrame((_, delta) => {
    easing.dampC(materials.lambert1.color, snap.selectedColor, 0.25, delta);
  });
  return (
    <group dispose={null}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={0.5}
        dispose={null}
        receiveShadow
      >
        <Decal
          position={[0, 0.08, 0.1]}
          rotation={[0, 0, 0]}
          scale={0.15}
          map={texture}
          //map-anisotropy={16}
        />
      </mesh>
    </group>
  );
}

function Backdrop() {
  const snap = useSnapshot(state);
  const shadows = useRef<any>();
  useFrame((_, delta) => {
    easing.dampC(
      shadows.current.getMesh().material.color,
      snap.selectedColor,
      0.25,
      delta
    );
  });
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
}

function CameraRig({ children }: any) {
  const snap = useSnapshot(state);
  const group = useRef<any>();
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [snap.intro ? -state.viewport.width / 15 : 0, 0, 2],
      0.25,
      delta
    );
    easing.dampE(
      // @ts-ignore
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    );
  });
  return <group ref={group}>{children}</group>;
}

function ThreeJs() {
  return (
    <Canvas
      shadows
      gl={{ preserveDrawingBuffer: true }}
      eventPrefix="client"
      camera={{ position: [0, 0, 5], fov: 25 }}
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      {/* 
        <Environment preset="sunset" />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
       */}
      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
}

export default ThreeJs;
