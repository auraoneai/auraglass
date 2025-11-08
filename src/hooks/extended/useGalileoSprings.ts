'use client';
import React from 'react';
import { useRef, useCallback, useEffect, useState } from 'react';
import { GalileoPhysicsSystem, PhysicsBody } from '../../animations/physics/galileoPhysicsSystem';

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
  position: { x: number; y: number };
  target?: { x: number; y: number };
  velocity?: { x: number; y: number };
  mass?: number;
  radius?: number;
  fixed?: boolean;
}

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
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
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
    targets.forEach((target: any) => {
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
      const newPositions: Record<string, { x: number; y: number }> = {};

      bodies.forEach((body: any) => {
        newPositions[body.id] = { ...body.position };
      });

      setPositions(newPositions);

      // Check if any bodies are still moving
      const hasMovingBodies = bodies.some(body =>
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
  const springTo = useCallback((
    id: string,
    target: { x: number; y: number },
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
        x: dx * springConfig.stiffness - body.velocity.x * springConfig.damping,
        y: dy * springConfig.stiffness - body.velocity.y * springConfig.damping,
      };

      physicsSystemRef.current.applyForce(id, force, 1/60); // Apply for one frame
    }
  }, [finalConfig]);

  // Apply impulse to body
  const impulse = useCallback((
    id: string,
    impulse: { x: number; y: number }
  ) => {
    if (!physicsSystemRef.current) return;
    physicsSystemRef.current.applyImpulse(id, impulse);
  }, []);

  // Set body position directly
  const setPosition = useCallback((
    id: string,
    position: { x: number; y: number }
  ) => {
    if (!physicsSystemRef.current) return;

    const body = physicsSystemRef.current.getBody(id);
    if (body) {
      body.position = { ...position };
      body.velocity = { x: 0, y: 0 };
      body.acceleration = { x: 0, y: 0 };
    }
  }, []);

  // Add new body to physics system
  const addBody = useCallback((body: GalileoSpringTarget) => {
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
  }, [finalConfig.mass]);

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
  const updateConfig = useCallback((newConfig: Partial<GalileoSpringConfig>) => {
    Object.assign(finalConfig, newConfig);

    if (physicsSystemRef.current) {
      physicsSystemRef.current.setGravity(
        finalConfig.gravity
          ? { x: 0, y: finalConfig.gravityStrength }
          : { x: 0, y: 0 }
      );

      physicsSystemRef.current.setBounds(finalConfig.bounds);
    }
  }, [finalConfig]);

  // Batch operations
  const batchUpdate = useCallback((
    updates: Array<{
      type: 'springTo' | 'impulse' | 'setPosition' | 'addBody' | 'removeBody';
      id: string;
      data?: any;
    }>
  ) => {
    updates.forEach((update: any) => {
      switch (update.type) {
        case 'springTo':
          if (update.data) springTo(update.id, update.data);
          break;
        case 'impulse':
          if (update.data) impulse(update.id, update.data);
          break;
        case 'setPosition':
          if (update.data) setPosition(update.id, update.data);
          break;
        case 'addBody':
          if (update.data) addBody(update.data);
          break;
        case 'removeBody':
          removeBody(update.id);
          break;
      }
    });
  }, [springTo, impulse, setPosition, addBody, removeBody]);

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
  connections: Array<{ from: string; to: string; strength: number }>,
  config: GalileoSpringConfig = {}
) {
  const galileoSprings = useGalileoSprings(bodies, config);

  const triggerChainReaction = useCallback((
    startId: string,
    initialImpulse: { x: number; y: number }
  ) => {
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
      const currentConnections = connections.filter((conn: any) => conn.from === currentId);

      currentConnections.forEach((connection: any) => {
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
  }, [galileoSprings, connections]);

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
    orbitingBodies.forEach((body: any) => {
      const orbitingBody = galileoSprings.getBody(body.id);
      const central = galileoSprings.getBody(centralBody.id);

      if (!orbitingBody || !central) return;

      // Calculate gravitational force
      const dx = central.position.x - orbitingBody.position.x;
      const dy = central.position.y - orbitingBody.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const force = (gravitationalConstant * centralBody.mass! * body.mass!) / (distance * distance);
        const forceX = (force * dx) / distance;
        const forceY = (force * dy) / distance;

        // Apply gravitational force
        galileoSprings.physicsSystem?.applyForce(body.id, {
          x: forceX * timeScale,
          y: forceY * timeScale,
        }, 1/60);
      }
    });
  }, [galileoSprings, centralBody, orbitingBodies, gravitationalConstant, timeScale]);

  useEffect(() => {
    const interval = setInterval(updateOrbits, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [updateOrbits]);

  return {
    ...galileoSprings,
    centralBody: centralBody.id,
    orbitingBodies: orbitingBodies.map((b: any) => b.id),
    updateOrbits,
  };
}

// Hook for particle systems
export function useParticleSystem(
  emitterPosition: { x: number; y: number },
  config: {
    particleCount?: number;
    emissionRate?: number;
    particleLife?: number;
    initialVelocity?: { x: number; y: number };
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
    const angle = (Math.random() - 0.5) * spread * Math.PI / 180;
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

  const emit = useCallback(() => {
    // Reset all particles to emitter position
    particleIds.forEach((id, index) => {
      const angle = (Math.random() - 0.5) * spread * Math.PI / 180;
      const speed = Math.random() * 50 + 25;

      galileoSprings.setPosition(id, { ...emitterPosition });
      galileoSprings.impulse(id, {
        x: initialVelocity.x + Math.cos(angle) * speed,
        y: initialVelocity.y + Math.sin(angle) * speed,
      });
    });
  }, [galileoSprings, emitterPosition, spread, initialVelocity, particleIds]);

  const updateEmitter = useCallback((newPosition: { x: number; y: number }) => {
    // This would update the emitter position for continuous emission
    // For now, just update the reference
    Object.assign(emitterPosition, newPosition);
  }, [emitterPosition]);

  return {
    ...galileoSprings,
    particleIds,
    emit,
    updateEmitter,
  };
}

// Hook for soft body physics
export function useSoftBodyPhysics(
  bodyDefinition: {
    nodes: Array<{ id: string; x: number; y: number; mass: number }>;
    springs: Array<{ from: string; to: string; stiffness: number; restLength: number }>;
  },
  config: GalileoSpringConfig = {}
) {
  const nodes = bodyDefinition.nodes.map((node: any) => ({
    id: node.id,
    position: { x: node.x, y: node.y },
    mass: node.mass,
    radius: 5,
  }));

  const galileoSprings = useGalileoSprings(nodes, config);

  const updateSprings = useCallback(() => {
    bodyDefinition.springs.forEach((spring: any) => {
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