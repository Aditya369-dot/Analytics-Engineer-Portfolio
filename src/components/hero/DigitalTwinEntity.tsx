import {
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  Quaternion,
  SRGBColorSpace,
  ShaderMaterial,
  TextureLoader,
  type Group,
  type Object3D,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type DigitalTwinRenderMode = "portrait" | "model";
export type DigitalTwinEntityHandle = {
  getRoot: () => Group | null;
  getModel: () => Object3D | null;
  getHead: () => Object3D | null;
  getMorphTargets: () => readonly Object3D[];
};

export type DigitalTwinEntityProps = {
  mode?: DigitalTwinRenderMode;
  portraitUrl?: string;
  modelUrl?: string;
  scale?: number;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  opacity?: number;
  radius?: number;
  glowEnabled?: boolean;
  ringEnabled?: boolean;
};

type TwinRendererProps = {
  opacity: number;
  radius: number;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D portrait;
  uniform float entityOpacity;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float distanceFromCenter = length(centered / vec2(0.9, 1.0));
    float mask = 1.0 - smoothstep(0.43, 0.5, distanceFromCenter);
    vec4 color = texture2D(portrait, vUv);
    gl_FragColor = vec4(color.rgb, color.a * mask * entityOpacity);
  }
`;

function PortraitTwinRenderer({
  portraitUrl,
  opacity,
  radius,
}: TwinRendererProps & { portraitUrl: string }) {
  const billboardRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const parentQuaternion = useMemo(() => new Quaternion(), []);
  const localQuaternion = useMemo(() => new Quaternion(), []);
  const loadedPortrait = useLoader(TextureLoader, portraitUrl);
  const portrait = useMemo(() => {
    const texture = loadedPortrait.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [loadedPortrait]);

  useEffect(() => () => portrait.dispose(), [portrait]);

  useFrame(({ camera }) => {
    const billboard = billboardRef.current;
    if (billboard) {
      billboard.parent?.getWorldQuaternion(parentQuaternion);
      localQuaternion.copy(parentQuaternion).invert().multiply(camera.quaternion);
      billboard.quaternion.copy(localQuaternion);
    }
    if (materialRef.current) materialRef.current.uniforms.entityOpacity.value = opacity;
  });

  const portraitSize = radius * 3.55;
  return (
    <group ref={billboardRef} name="portrait-twin-renderer">
      <mesh position={[0, 0, radius * 0.02]} scale={[portraitSize, portraitSize, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={{ portrait: { value: portrait }, entityOpacity: { value: opacity } }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ModelTwinRenderer({ modelUrl }: { modelUrl: string }) {
  const gltf = useLoader(GLTFLoader, modelUrl);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  return <primitive object={model} name="model-twin-renderer" />;
}

function TwinHologram({ opacity, radius, glowEnabled, ringEnabled }: TwinRendererProps & {
  glowEnabled: boolean;
  ringEnabled: boolean;
}) {
  return (
    <group name="digital-twin-hologram">
      {glowEnabled && (
        <mesh position={[0, 0, -radius * 0.14]} scale={2.05}>
          <circleGeometry args={[radius, 64]} />
          <meshBasicMaterial
            color={new Color("#6d28d9").multiplyScalar(1.35)}
            opacity={opacity * 0.09}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
      {ringEnabled && (
        <mesh position={[0, 0, -radius * 0.04]} scale={1.82}>
          <ringGeometry args={[radius * 0.965, radius, 64]} />
          <meshBasicMaterial
            color={new Color("#67e8f9").multiplyScalar(1.7)}
            opacity={opacity * 0.42}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

export const DigitalTwinEntity = forwardRef<DigitalTwinEntityHandle, DigitalTwinEntityProps>(
  function DigitalTwinEntity({
    mode = "model",
    portraitUrl = "/assets/digital-twin/aditya-avatar.png",
    modelUrl = "/assets/digital-twin/aditya-avatar.glb",
    scale = 1,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    opacity = 1,
    radius = 0.18,
    glowEnabled = true,
    ringEnabled = true,
  }, forwardedRef) {
    const rootRef = useRef<Group>(null);
    const [modelAvailable, setModelAvailable] = useState(false);

    useEffect(() => {
      if (mode !== "model") return;
      const controller = new AbortController();
      fetch(modelUrl, { method: "HEAD", signal: controller.signal })
        .then((response) => setModelAvailable(response.ok))
        .catch(() => setModelAvailable(false));
      return () => controller.abort();
    }, [mode, modelUrl]);

    useImperativeHandle(forwardedRef, () => ({
      getRoot: () => rootRef.current,
      getModel: () => rootRef.current?.getObjectByName("model-twin-renderer") ?? null,
      getHead: () => rootRef.current?.getObjectByName("Head") ?? rootRef.current?.getObjectByName("head") ?? null,
      getMorphTargets: () => {
        const targets: Object3D[] = [];
        rootRef.current?.traverse((object) => {
          if ("morphTargetInfluences" in object) targets.push(object);
        });
        return targets;
      },
    }), []);

    const renderModel = mode === "model" && modelAvailable;
    return (
      <group
        ref={rootRef}
        name="aditya-digital-twin-entity"
        position={position}
        rotation={rotation}
        scale={scale}
        userData={{ assetContract: "digital-twin-entity", renderMode: renderModel ? "model" : "portrait" }}
      >
        <TwinHologram opacity={opacity} radius={radius} glowEnabled={glowEnabled} ringEnabled={ringEnabled} />
        {renderModel ? (
          <Suspense fallback={<PortraitTwinRenderer portraitUrl={portraitUrl} opacity={opacity} radius={radius} />}>
            <ModelTwinRenderer modelUrl={modelUrl} />
          </Suspense>
        ) : (
          <PortraitTwinRenderer portraitUrl={portraitUrl} opacity={opacity} radius={radius} />
        )}
      </group>
    );
  },
);
