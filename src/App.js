import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows, Environment, useGLTF, OrbitControls } from "@react-three/drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const state = proxy({
  current: null,
  items: {
    switches_material: "#ffffff",
    mainKeys_material: "#121212",
    secondKeys_material: "#666666",
    cable_material: "#292929",
    case_material: "#292929",
    letters_material: "#ffffff",
  },
})

function Shoe() {
  const ref = useRef()
  const snap = useSnapshot(state)
  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTFLoader, url)
  // { nodes, materials } are extras that come from useLoader, these do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes, materials a named collection of materials
  const { nodes, materials } = useGLTF("KBD_small.glb")
  console.log(ref)
  // Animate model
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20
    ref.current.rotation.x = 1 + Math.cos(t / 4) / 16
    ref.current.rotation.y = Math.sin(t / 4) / 16
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  // Cursor showing current color
  const [hovered, set] = useState(null)
  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
      return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
    }
  }, [hovered])


  return (
    <group
      ref={ref}
      dispose={null}
      onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
      onPointerOut={(e) => e.intersections.length === 0 && set(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}>
      <mesh
        geometry={nodes.switches.geometry}
        material={materials.switches_material}
        material-color={snap.items.switches_material}
        material-emissive={snap.items.switches_material}
        position={[-1.89, 0.24, -0.59]}
        rotation={[0.05, 0, 0]}
      />

      <mesh
        geometry={nodes.mainKeys.geometry}
        material={materials.mainKeys_material}
        material-color={snap.items.mainKeys_material}
        position={[-0.64, 0.2, 0.6]}
        rotation={[0.05, 0, 0]}
        scale={[1.13, 1.03, 1.13]}
      />
      <mesh
        geometry={nodes.secondKeys.geometry}
        material={materials.secondKeys_material}
        material-color={snap.items.secondKeys_material}
        position={[1.15, 0.2, 0.6]}
        rotation={[0.05, 0, 0]}
        scale={[1.45, 1.03, 1.13]}
      />
      <mesh
        geometry={nodes.cable.geometry}
        material={materials.cable_material}
        material-color={snap.items.cable_material}
        position={[0, 0.06, 0.11]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.02}
      />
      <mesh
        geometry={nodes["case"].geometry}
        material={materials.case_material}
        material-color={snap.items.case_material}
        position={[0, 0.16, 0]}
        rotation={[0.05, 0, 0]}
        scale={[1, 0.26, 1]}
      />
      <mesh
        geometry={nodes.letters.geometry}
        material={materials.letters_materials}
        material-color={snap.items.letters_materials}
        material-emissive={snap.items.letters_materials}
        position={[1.92, 0.33, 0.54]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  )
}

function Picker() {
  const snap = useSnapshot(state)
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <h1>{snap.current}</h1>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <Suspense fallback={null}>
          <Shoe />
          <Environment preset="city" />
          <ContactShadows rotation-x={Math.PI / 2} position={[0, -1.4, 0]} opacity={0.25} width={10} height={10} blur={1.5} far={2} />
        </Suspense>
        <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
      </Canvas>
      <Picker />
    </>
  )
}
