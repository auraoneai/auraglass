"use client";
import React from "react";
import { useRef, useCallback, useEffect, useState } from "react";
import {
  GalileoPhysicsSystem,
  PhysicsBody,
} from "../../animations/physics/galileoPhysicsSystem";

export interface GalileoVector {
  x: number;
  y: number;
}

export interface GalileoSpringConfig {
  /** Spring stiffness */
  stiffness?: number;
  /** Spring damping */
  damping?: number;
  /** Spring mass */
  mass?: number;
  /** Rest precision */
  precision?: number;
  /** Initial velocity */
  velocity?: number;
  /** Enable gravity */
  gravity?: boolean;
  /** Gravity strength */
  gravityStrength?: number;
  /** Enable collisions */
  enableCollisions?: boolean;
  /** Bounds for physics world */
  bounds?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export interface GalileoSpringTarget {
  id: string;
  position: GalileoVector;
  target?: GalileoVector;
  velocity?: GalileoVector;
  mass?: number;
  radius?: number;
  fixed?: boolean;
}

export interface GalileoSpringConnection {
  from: string;
  to: string;
  strength: number;
}

export interface GalileoSoftBodyNode {
  id: string;
  x: number;
  y: number;
  mass: number;
}

export interface GalileoSoftBodySpring {
  from: string;
  to: string;
  stiffness: number;
  restLength: number;
}

export interface GalileoSoftBodyDefinition {
  nodes: GalileoSoftBodyNode[];
  springs: GalileoSoftBodySpring[];
}

export type GalileoSpringBatchUpdate =
  | {
      type: "springTo";
      id: string;
      data: GalileoVector;
      config?: Partial<GalileoSpringConfig>;
    }
  | {
      type: "impulse";
      id: string;
      data: GalileoVector;
    }
  | {
      type: "setPosition";
      id: string;
      data: GalileoVector;
    }
  | {
      type: "addBody";
      id: string;
      data: GalileoSpringTarget;
    }
  | {
      type: "removeBody";
      id: string;
      data?: never;
    };

const DEFAULT_CONFIG: Required<GalileoSpringConfig> = {
  stiffness: 100,
  damping: 10,
  mass: 1,
  precision: 0.01,
  velocity: 0,
  gravity: false,
  gravityStrength: 9.81,
  enableCollisions: false,
  bounds: {
    left: -Infinity,
    right: Infinity,
    top: -Infinity,
    bottom: Infinity,
  },
};

export function useGalileoSprings(
  targets: GalileoSpringTarget[] = [],
  config: GalileoSpringConfig = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const physicsSystemRef = useRef<GalileoPhysicsSystem>();
  const [positions, setPositions] = useState<Record<string, GalileoVector>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize physics system
  useEffect(() => {
    physicsSystemRef.current = new GalileoPhysicsSystem({
      gravity: finalConfig.gravity
        ? { x: 0, y: finalConfig.gravityStrength }
        : { x: 0, y: 0 },
      bounds: finalConfig.bounds,
    });

    // Add initial bodies
    targets.forEach((target) => {
      physicsSystemRef.current!.addBody({
        id: target.id,
        position: { ...target.position },
        velocity: target.velocity || { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        mass: target.mass || finalConfig.mass,
        radius: target.radius || 10,
        friction: 0.1,
        restitution: 0.8,
        fixed: target.fixed || false,
        forces: [],
      });
    });

    physicsSystemRef.current.start();

    return () => {
      physicsSystemRef.current?.stop();
    };
  }, [targets, finalConfig]);

  // Update positions when physics system updates
  useEffect(() => {
    if (!physicsSystemRef.current) return;

    const updatePositions = () => {
      const bodies = physicsSystemRef.current!.getAllBodies();
      const newPositions: Record<string, GalileoVector> = {};

      bodies.forEach((body) => {
        newPositions[body.id] = { ...body.position };
      });

      setPositions(newPositions);

      // Track whether bodies are still moving.
      const hasMovingBodies = bodies.some(
        (body) =>
          Math.abs(body.velocity.x) > finalConfig.precision ||
          Math.abs(body.velocity.y) > finalConfig.precision
      );

      setIsAnimating(hasMovingBodies);

      if (hasMovingBodies) {
        requestAnimationFrame(updatePositions);
      }
    };

    updatePositions();
  }, [finalConfig.precision]);

  // Apply spring force to move body to target
  const springTo = useCallback(
    (
      id: string,
      target: GalileoVector,
      customConfig?: Partial<GalileoSpringConfig>
    ) => {
      if (!physicsSystemRef.current) return;

      const body = physicsSystemRef.current.getBody(id);
      if (!body) return;

      const springConfig = { ...finalConfig, ...customConfig };

      // Calculate spring force
      const dx = target.x - body.position.x;
      const dy = target.y - body.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > springConfig.precision) {
        const force = {
          x:
            dx * springConfig.stiffness -
            body.velocity.x * springConfig.damping,
          y:
            dy * springConfig.stiffness -
            body.velocity.y * springConfig.damping,
        };

        physicsSystemRef.current.applyForce(id, force, 1 / 60); // Apply for one frame
      }
    },
    [finalConfig]
  );

  // Apply impulse to body
  const impulse = useCallback((id: string, impulse: GalileoVector) => {
    if (!physicsSystemRef.current) return;
    physicsSystemRef.current.applyImpulse(id, impulse);
  }, []);

  // Set body position directly
  const setPosition = useCallback((id: string, position: GalileoVector) => {
    if (!physicsSystemRef.current) return;

    const body = physicsSystemRef.current.getBody(id);
    if (body) {
      body.position = { ...position };
      body.velocity = { x: 0, y: 0 };
      body.acceleration = { x: 0, y: 0 };
    }
  }, []);

  // Add new body to physics system
  const addBody = useCallback(
    (body: GalileoSpringTarget) => {
      if (!physicsSystemRef.current) return;

      physicsSystemRef.current.addBody({
        id: body.id,
        position: { ...body.position },
        velocity: body.velocity || { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        mass: body.mass || finalConfig.mass,
        radius: body.radius || 10,
        friction: 0.1,
        restitution: 0.8,
        fixed: body.fixed || false,
        forces: [],
      });
    },
    [finalConfig.mass]
  );

  // Remove body from physics system
  const removeBody = useCallback((id: string) => {
    if (!physicsSystemRef.current) return;
    physicsSystemRef.current.removeBody(id);
  }, []);

  // Get body information
  const getBody = useCallback((id: string): PhysicsBody | undefined => {
    if (!physicsSystemRef.current) return;
    return physicsSystemRef.current.getBody(id);
  }, []);

  // Update physics configuration
  const updateConfig = useCallback(
    (newConfig: Partial<GalileoSpringConfig>) => {
      Object.assign(finalConfig, newConfig);

      if (physicsSystemRef.current) {
        physicsSystemRef.current.setGravity(
          finalConfig.gravity
            ? { x: 0, y: finalConfig.gravityStrength }
            : { x: 0, y: 0 }
        );

        physicsSystemRef.current.setBounds(finalConfig.bounds);
      }
    },
    [finalConfig]
  );

  // Batch operations
  const batchUpdate = useCallback(
    (updates: GalileoSpringBatchUpdate[]) => {
      updates.forEach((update) => {
        switch (update.type) {
          case "springTo":
            springTo(update.id, update.data, update.config);
            break;
          case "impulse":
            impulse(update.id, update.data);
            break;
          case "setPosition":
            setPosition(update.id, update.data);
            break;
          case "addBody":
            addBody(update.data);
            break;
          case "removeBody":
            removeBody(update.id);
            break;
        }
      });
    },
    [springTo, impulse, setPosition, addBody, removeBody]
  );

  return {
    positions,
    isAnimating,
    springTo,
    impulse,
    setPosition,
    addBody,
    removeBody,
    getBody,
    updateConfig,
    batchUpdate,
    physicsSystem: physicsSystemRef.current,
  };
}

// Hook for chain reactions (bodies affecting each other)
export function useChainReaction(
  bodies: GalileoSpringTarget[],
  connections: GalileoSpringConnection[],
  config: GalileoSpringConfig = {}
) {
  const galileoSprings = useGalileoSprings(bodies, config);

  const triggerChainReaction = useCallback(
    (startId: string, initialImpulse: GalileoVector) => {
      // Apply initial impulse
      galileoSprings.impulse(startId, initialImpulse);

      // Propagate through connections
      const visited = new Set<string>();
      const queue = [startId];

      const propagate = () => {
        if (queue.length === 0) return;

        const currentId = queue.shift()!;
        if (visited.has(currentId)) return;

        visited.add(currentId);

        // Find connections from current body
        const currentConnections = connections.filter(
          (conn) => conn.from === currentId
        );

        currentConnections.forEach((connection) => {
          if (!visited.has(connection.to)) {
            // Calculate propagated impulse
            const currentBody = galileoSprings.getBody(currentId);
            if (currentBody) {
              const propagatedImpulse = {
                x: currentBody.velocity.x * connection.strength,
                y: currentBody.velocity.y * connection.strength,
              };

              galileoSprings.impulse(connection.to, propagatedImpulse);
              queue.push(connection.to);
            }
          }
        });

        // Continue propagation
        setTimeout(propagate, 50); // Small delay for visual effect
      };

      propagate();
    },
    [galileoSprings, connections]
  );

  return {
    ...galileoSprings,
    triggerChainReaction,
  };
}

// Hook for orbital mechanics
export function useOrbitalMechanics(
  centralBody: GalileoSpringTarget,
  orbitingBodies: GalileoSpringTarget[],
  config: GalileoSpringConfig & {
    gravitationalConstant?: number;
    timeScale?: number;
  } = {}
) {
  const {
    gravitationalConstant = 100,
    timeScale = 1,
    ...springConfig
  } = config;

  const allBodies = [centralBody, ...orbitingBodies];
  const galileoSprings = useGalileoSprings(allBodies, springConfig);

  const updateOrbits = useCallback(() => {
    orbitingBodies.forEach((body) => {
      const orbitingBody = galileoSprings.getBody(body.id);
      const central = galileoSprings.getBody(centralBody.id);

      if (!orbitingBody || !central) return;

      // Calculate gravitational force
      const dx = central.position.x - orbitingBody.position.x;
      const dy = central.position.y - orbitingBody.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const centralMass =
          centralBody.mass ?? springConfig.mass ?? DEFAULT_CONFIG.mass;
        const orbitingMass =
          body.mass ?? springConfig.mass ?? DEFAULT_CONFIG.mass;
        const force =
          (gravitationalConstant * centralMass * orbitingMass) /
          (distance * distance);
        const forceX = (force * dx) / distance;
        const forceY = (force * dy) / distance;

        // Apply gravitational force
        galileoSprings.physicsSystem?.applyForce(
          body.id,
          {
            x: forceX * timeScale,
            y: forceY * timeScale,
          },
          1 / 60
        );
      }
    });
  }, [
    galileoSprings,
    centralBody,
    orbitingBodies,
    gravitationalConstant,
    timeScale,
  ]);

  useEffect(() => {
    const interval = setInterval(updateOrbits, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [updateOrbits]);

  return {
    ...galileoSprings,
    centralBody: centralBody.id,
    orbitingBodies: orbitingBodies.map((body) => body.id),
    updateOrbits,
  };
}

// Hook for particle systems
export function useParticleSystem(
  emitterPosition: GalileoVector,
  config: {
    particleCount?: number;
    emissionRate?: number;
    particleLife?: number;
    initialVelocity?: GalileoVector;
    spread?: number;
    gravity?: number;
  } = {}
) {
  const {
    particleCount = 50,
    emissionRate = 10,
    particleLife = 3000,
    initialVelocity = { x: 0, y: -100 },
    spread = 30,
    gravity = 9.81,
  } = config;

  const particles: GalileoSpringTarget[] = [];
  const particleIds: string[] = [];

  // Create particle bodies
  for (let i = 0; i < particleCount; i++) {
    const angle = ((Math.random() - 0.5) * spread * Math.PI) / 180;
    const speed = Math.random() * 50 + 25;

    particles.push({
      id: `particle-${i}`,
      position: { ...emitterPosition },
      velocity: {
        x: initialVelocity.x + Math.cos(angle) * speed,
        y: initialVelocity.y + Math.sin(angle) * speed,
      },
      mass: 0.1,
      radius: 2,
    });

    particleIds.push(`particle-${i}`);
  }

  const galileoSprings = useGalileoSprings(particles, {
    gravity: true,
    gravityStrength: gravity,
    enableCollisions: false,
  });

  // Live emitter position so continuous emission picks up updateEmitter() moves
  // without re-creating the particle bodies.
  const emitterRef = useRef<GalileoVector>({ ...emitterPosition });
  // Round-robin cursor: continuous emission recycles the oldest particle.
  const nextParticleRef = useRef(0);

  const emitOne = useCallback(
    (id: string) => {
      const angle = ((Math.random() - 0.5) * spread * Math.PI) / 180;
      const speed = Math.random() * 50 + 25;
      galileoSprings.setPosition(id, { ...emitterRef.current });
      galileoSprings.impulse(id, {
        x: initialVelocity.x + Math.cos(angle) * speed,
        y: initialVelocity.y + Math.sin(angle) * speed,
      });
    },
    [galileoSprings, spread, initialVelocity]
  );

  const emit = useCallback(() => {
    // One-shot burst: reset every particle to the emitter.
    particleIds.forEach((id) => emitOne(id));
  }, [particleIds, emitOne]);

  const updateEmitter = useCallback((newPosition: GalileoVector) => {
    // Move the live emitter so subsequent (continuous) emissions originate here.
    emitterRef.current = { ...emitterRef.current, ...newPosition };
  }, []);

  // Continuous emission: recycle `emissionRate` particles per second from the
  // current emitter position. emissionRate <= 0 disables continuous emission
  // (the one-shot emit() still works).
  useEffect(() => {
    if (!emissionRate || emissionRate <= 0 || particleIds.length === 0) {
      return;
    }
    const intervalMs = 1000 / emissionRate;
    const interval = setInterval(() => {
      const id = particleIds[nextParticleRef.current % particleIds.length];
      nextParticleRef.current += 1;
      emitOne(id);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [emissionRate, particleIds, emitOne]);

  return {
    ...galileoSprings,
    particleIds,
    emit,
    updateEmitter,
  };
}

// Hook for soft body physics
export function useSoftBodyPhysics(
  bodyDefinition: GalileoSoftBodyDefinition,
  config: GalileoSpringConfig = {}
) {
  const nodes = bodyDefinition.nodes.map((node) => ({
    id: node.id,
    position: { x: node.x, y: node.y },
    mass: node.mass,
    radius: 5,
  }));

  const galileoSprings = useGalileoSprings(nodes, config);

  const updateSprings = useCallback(() => {
    bodyDefinition.springs.forEach((spring) => {
      const fromBody = galileoSprings.getBody(spring.from);
      const toBody = galileoSprings.getBody(spring.to);

      if (!fromBody || !toBody) return;

      const dx = toBody.position.x - fromBody.position.x;
      const dy = toBody.position.y - fromBody.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const displacement = distance - spring.restLength;

      if (Math.abs(displacement) > 1) {
        const force = displacement * spring.stiffness;
        const forceX = (force * dx) / distance;
        const forceY = (force * dy) / distance;

        galileoSprings.impulse(spring.from, { x: forceX, y: forceY });
        galileoSprings.impulse(spring.to, { x: -forceX, y: -forceY });
      }
    });
  }, [galileoSprings, bodyDefinition.springs]);

  useEffect(() => {
    const interval = setInterval(updateSprings, 1000 / 60);
    return () => clearInterval(interval);
  }, [updateSprings]);

  return {
    ...galileoSprings,
    springs: bodyDefinition.springs,
    updateSprings,
  };
}
