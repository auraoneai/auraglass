import * as THREE from "three";

export const ARGlassMaterialFactory = {
  createSpatialUI: (options: any) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        userPosition: { value: new THREE.Vector3() },
        interactionRadius: { value: options.interactionRadius || 3.0 },
        glowIntensity: { value: options.glowIntensity || 1.0 },
        color: { value: options.color || new THREE.Color(0.3, 0.7, 1.0) },
        opacity: { value: options.opacity || 0.8 },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vUserPosition;

        void main() {
          vPosition = position;
          vNormal = normal;
          vUserPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 userPosition;
        uniform float interactionRadius;
        uniform float glowIntensity;
        uniform vec3 color;
        uniform float opacity;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vUserPosition;

        void main() {
          float distance = length(vUserPosition - userPosition);
          float interaction = 1.0 - smoothstep(0.0, interactionRadius, distance);

          vec3 finalColor = color + (glowIntensity * interaction * vec3(0.5, 0.8, 1.0));
          float finalOpacity = opacity * (0.8 + 0.2 * interaction);

          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  },

  createHolographicGlass: (options: any) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: options.color || new THREE.Color(0.6, 0.8, 1.0) },
        opacity: { value: options.opacity || 0.9 },
        fresnelPower: { value: options.fresnelPower || 1.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDirection = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        uniform float fresnelPower;

        varying vec3 vNormal;
        varying vec3 vViewDirection;

        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vViewDirection), fresnelPower);
          vec3 finalColor = color * (0.5 + 0.5 * fresnel);
          float finalOpacity = opacity * (0.7 + 0.3 * fresnel);

          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  },

  createDataVisualization: (options: any) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        lowColor: { value: options.lowColor || new THREE.Color(0.2, 0.4, 1.0) },
        highColor: {
          value: options.highColor || new THREE.Color(1.0, 0.4, 0.2),
        },
        dataValue: { value: options.dataValue || 0.5 },
      },
      vertexShader: `
        varying vec3 vPosition;

        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 lowColor;
        uniform vec3 highColor;
        uniform float dataValue;

        varying vec3 vPosition;

        void main() {
          float height = vPosition.y;
          vec3 finalColor = mix(lowColor, highColor, dataValue);

          // Add some animation
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          finalColor *= pulse;

          gl_FragColor = vec4(finalColor, 0.8);
        }
      `,
      transparent: true,
    });
  },
};

export const ARGlassGeometryFactory = {
  createCurvedPanel: (width: number, height: number, depth: number) => {
    const geometry = new THREE.PlaneGeometry(width, height, 32, 32);

    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x * 0.5) * Math.cos(y * 0.5) * depth;
    }

    geometry.computeVertexNormals();
    return geometry;
  },

  createPortalGeometry: (innerRadius: number, outerRadius: number) => {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);

    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const angle = Math.atan2(positions[i + 1], positions[i]);
      positions[i + 2] = Math.sin(angle * 4) * 0.1;
    }

    geometry.computeVertexNormals();
    return geometry;
  },

  createParticleField: (count: number) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return geometry;
  },
};

export const ARGlassAnimations = {
  createFloatingAnimation: (
    object: THREE.Object3D,
    amplitude: number = 0.05,
    frequency: number = 0.5
  ) => {
    return (time: number) => {
      object.position.y += Math.sin(time * frequency) * amplitude;
    };
  },

  createRotationAnimation: (
    object: THREE.Object3D,
    axis: THREE.Vector3,
    speed: number = 1
  ) => {
    return (time: number) => {
      object.rotateOnAxis(axis, speed * 0.01);
    };
  },

  createScaleAnimation: (
    object: THREE.Object3D,
    minScale: number,
    maxScale: number,
    frequency: number = 2
  ) => {
    return (time: number) => {
      const scale =
        minScale +
        (maxScale - minScale) * (Math.sin(time * frequency) * 0.5 + 0.5);
      object.scale.setScalar(scale);
    };
  },
};

export const ARGlassInteractions = {
  createHapticFeedback: (intensity = 0.5, duration = 100) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(duration * intensity);
    }
  },

  setupHandTracking: (
    objects: THREE.Object3D[],
    callback: (
      object: THREE.Object3D,
      hand: {
        isActive: boolean;
        position: THREE.Vector3;
        rotation: THREE.Quaternion;
      }
    ) => void
  ) => {
    const handleHandMove = (handData: {
      left: {
        isActive: boolean;
        position: THREE.Vector3;
        rotation: THREE.Quaternion;
      };
      right: {
        isActive: boolean;
        position: THREE.Vector3;
        rotation: THREE.Quaternion;
      };
    }) => {
      objects.forEach((obj: THREE.Object3D) => {
        if (obj && handData.left.isActive) {
          const distance = obj.position.distanceTo(handData.left.position);
          if (distance < 0.5) {
            callback(obj, handData.left);
          }
        }
      });
    };

    return handleHandMove;
  },
};

export const ARGlassUtils = {
  createAdaptiveScaling: (minScale: number, maxScale: number) => {
    return (distance: number) => {
      const normalizedDistance = Math.min(Math.max(distance, 1), 10);
      const scale =
        maxScale - ((normalizedDistance - 1) / 9) * (maxScale - minScale);
      return Math.max(scale, minScale);
    };
  },

  createDistanceBasedOpacity: (maxDistance: number = 5) => {
    return (distance: number) => {
      return Math.max(0, 1 - distance / maxDistance);
    };
  },
};
