import React from 'react';
import { useRef, useEffect } from 'react';
import { SpringConfig } from '../hooks/useMultiSpringBasic';

export interface PhysicsBody {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  mass: number;
  radius: number;
  friction: number;
  restitution: number; // Bounciness
  fixed: boolean;
  forces: Array<{ x: number; y: number; duration?: number }>;
}

export interface PhysicsWorld {
  bodies: Map<string, PhysicsBody>;
  gravity: { x: number; y: number };
  bounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  timeStep: number;
  substeps: number;
}

export interface CollisionInfo {
  bodyA: PhysicsBody;
  bodyB: PhysicsBody;
  normal: { x: number; y: number };
  penetration: number;
  contactPoint: { x: number; y: number };
}

export class GalileoPhysicsSystem {
  private world: PhysicsWorld;
  private animationFrame: number | null = null;
  private lastTime = 0;
  private paused = false;

  constructor(config: Partial<PhysicsWorld> = {}) {
    this.world = {
      bodies: new Map(),
      gravity: { x: 0, y: 0 },
      bounds: {
        left: -Infinity,
        right: Infinity,
        top: -Infinity,
        bottom: Infinity,
      },
      timeStep: 1 / 60, // 60 FPS
      substeps: 1,
      ...config,
    };
  }

  // Body management
  addBody(body: PhysicsBody): void {
    this.world.bodies.set(body.id, body);
  }

  removeBody(id: string): void {
    this.world.bodies.delete(id);
  }

  getBody(id: string): PhysicsBody | undefined {
    return this.world.bodies.get(id);
  }

  updateBody(id: string, updates: Partial<PhysicsBody>): void {
    const body = this.world.bodies.get(id);
    if (body) {
      Object.assign(body, updates);
    }
  }

  // Force management
  applyForce(id: string, force: { x: number; y: number }, duration?: number): void {
    const body = this.world.bodies.get(id);
    if (body) {
      body.forces.push({ ...force, duration });
    }
  }

  applyImpulse(id: string, impulse: { x: number; y: number }): void {
    const body = this.world.bodies.get(id);
    if (body && !body.fixed) {
      body.velocity.x += impulse.x / body.mass;
      body.velocity.y += impulse.y / body.mass;
    }
  }

  // Physics simulation
  start(): void {
    if (this.animationFrame) return;
    this.lastTime = performance.now();
        if (this.animate) this.animate();
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
    this.lastTime = performance.now();
  }

  private animate = (): void => {
    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 1 / 30); // Cap at 30 FPS minimum

    if (!this.paused) {
      for (let i = 0; i < this.world.substeps; i++) {
        this.step(deltaTime / this.world.substeps);
      }
    }

    this.lastTime = currentTime;
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private step(deltaTime: number): void {
    // Update forces
    this.updateForces(deltaTime);

    // Integrate motion
    this.integrateMotion(deltaTime);

    // Handle collisions
    this.handleCollisions();

    // Apply constraints
    this.applyConstraints();
  }

  private updateForces(deltaTime: number): void {
    this.world.bodies.forEach((body: any) => {
      if (body.fixed) return;

      // Reset acceleration
      body.acceleration.x = 0;
      body.acceleration.y = 0;

      // Apply gravity
      body.acceleration.x += this.world.gravity.x;
      body.acceleration.y += this.world.gravity.y;

      // Apply custom forces
      body.forces = body.forces.filter((force: any) => {
        body.acceleration.x += force.x / body.mass;
        body.acceleration.y += force.y / body.mass;

        if (force.duration !== undefined) {
          force.duration -= deltaTime;
          return force.duration > 0;
        }
        return true; // Permanent forces
      });

      // Apply friction
      const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
      if (speed > 0.001) {
        const frictionForce = body.friction * body.mass * Math.abs(this.world.gravity.y || 1);
        const frictionX = -body.velocity.x / speed * frictionForce / body.mass;
        const frictionY = -body.velocity.y / speed * frictionForce / body.mass;

        body.acceleration.x += frictionX;
        body.acceleration.y += frictionY;
      }
    });
  }

  private integrateMotion(deltaTime: number): void {
    this.world.bodies.forEach((body: any) => {
      if (body.fixed) return;

      // Verlet integration for better stability
      const newVelocityX = body.velocity.x + body.acceleration.x * deltaTime;
      const newVelocityY = body.velocity.y + body.acceleration.y * deltaTime;

      body.position.x += (body.velocity.x + newVelocityX) * 0.5 * deltaTime;
      body.position.y += (body.velocity.y + newVelocityY) * 0.5 * deltaTime;

      body.velocity.x = newVelocityX;
      body.velocity.y = newVelocityY;
    });
  }

  private handleCollisions(): void {
    const bodies = Array.from(this.world.bodies.values());
    const collisions: CollisionInfo[] = [];

    // Check all pairs for collisions
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const collision = this.checkCollision(bodies[i], bodies[j]);
        if (collision) {
          collisions.push(collision);
        }
      }
    }

    // Resolve collisions
    collisions.forEach((collision: any) => {
      this.resolveCollision(collision);
    });
  }

  private checkCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): CollisionInfo | null {
    const dx = bodyB.position.x - bodyA.position.x;
    const dy = bodyB.position.y - bodyA.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = bodyA.radius + bodyB.radius;

    if (distance < minDistance) {
      const penetration = minDistance - distance;
      const normal = {
        x: dx / distance,
        y: dy / distance,
      };

      return {
        bodyA,
        bodyB,
        normal,
        penetration,
        contactPoint: {
          x: bodyA.position.x + normal.x * bodyA.radius,
          y: bodyA.position.y + normal.y * bodyA.radius,
        },
      };
    }

    return null;
  }

  private resolveCollision(collision: CollisionInfo): void {
    const { bodyA, bodyB, normal, penetration } = collision;

    // Separate bodies
    const separationX = normal.x * penetration * 0.5;
    const separationY = normal.y * penetration * 0.5;

    if (!bodyA.fixed) {
      bodyA.position.x -= separationX;
      bodyA.position.y -= separationY;
    }

    if (!bodyB.fixed) {
      bodyB.position.x += separationX;
      bodyB.position.y += separationY;
    }

    // Calculate relative velocity
    const relativeVelocityX = bodyB.velocity.x - bodyA.velocity.x;
    const relativeVelocityY = bodyB.velocity.y - bodyA.velocity.y;
    const velocityAlongNormal = relativeVelocityX * normal.x + relativeVelocityY * normal.y;

    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return;

    // Calculate restitution
    const restitution = Math.min(bodyA.restitution, bodyB.restitution);

    // Calculate impulse scalar
    const impulseScalar = -(1 + restitution) * velocityAlongNormal;
    const totalMass = bodyA.mass + bodyB.mass;

    let impulseX = impulseScalar * normal.x;
    let impulseY = impulseScalar * normal.y;

    // Apply mass weighting
    if (!bodyA.fixed && !bodyB.fixed) {
      impulseX /= totalMass / bodyA.mass;
      impulseY /= totalMass / bodyA.mass;
    }

    // Apply impulses
    if (!bodyA.fixed) {
      bodyA.velocity.x -= impulseX / bodyA.mass;
      bodyA.velocity.y -= impulseY / bodyA.mass;
    }

    if (!bodyB.fixed) {
      bodyB.velocity.x += impulseX / bodyB.mass;
      bodyB.velocity.y += impulseY / bodyB.mass;
    }
  }

  private applyConstraints(): void {
    this.world.bodies.forEach((body: any) => {
      if (body.fixed) return;

      // Boundary constraints
      const { bounds } = this.world;

      if (body.position.x - body.radius < bounds.left) {
        body.position.x = bounds.left + body.radius;
        body.velocity.x *= -body.restitution;
      }

      if (body.position.x + body.radius > bounds.right) {
        body.position.x = bounds.right - body.radius;
        body.velocity.x *= -body.restitution;
      }

      if (body.position.y - body.radius < bounds.top) {
        body.position.y = bounds.top + body.radius;
        body.velocity.y *= -body.restitution;
      }

      if (body.position.y + body.radius > bounds.bottom) {
        body.position.y = bounds.bottom - body.radius;
        body.velocity.y *= -body.restitution;
      }
    });
  }

  // Utility methods
  setGravity(gravity: { x: number; y: number }): void {
    this.world.gravity = gravity;
  }

  setBounds(bounds: Partial<PhysicsWorld['bounds']>): void {
    this.world.bounds = { ...this.world.bounds, ...bounds };
  }

  getAllBodies(): PhysicsBody[] {
    return Array.from(this.world.bodies.values());
  }

  clear(): void {
    this.world.bodies.clear();
  }

  // Factory methods for common body types
  static createCircleBody(
    id: string,
    x: number,
    y: number,
    radius: number,
    mass: number = 1,
    options: Partial<PhysicsBody> = {}
  ): PhysicsBody {
    return {
      id,
      position: { x, y },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      mass,
      radius,
      friction: 0.1,
      restitution: 0.8,
      fixed: false,
      forces: [],
      ...options,
    };
  }

  static createFixedBody(
    id: string,
    x: number,
    y: number,
    radius: number
  ): PhysicsBody {
    return {
      id,
      position: { x, y },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      mass: Infinity,
      radius,
      friction: 0,
      restitution: 1,
      fixed: true,
      forces: [],
    };
  }
}

// Hook for using physics system
export function usePhysicsSystem(config?: Partial<PhysicsWorld>) {
  const systemRef = useRef<GalileoPhysicsSystem>();

  useEffect(() => {
    systemRef.current = new GalileoPhysicsSystem(config);
    return () => {
      systemRef.current?.stop();
    };
  }, []);

  return systemRef.current;
}

// Spring physics utilities
export class SpringPhysics {
  static calculateSpringForce(
    current: number,
    target: number,
    velocity: number,
    config: SpringConfig
  ): { force: number; newVelocity: number } {
    const displacement = target - current;
    const springForce = displacement * (config.stiffness ?? 100);
    const dampingForce = -velocity * (config.damping ?? 10);
    const totalForce = springForce + dampingForce;

    const acceleration = totalForce / (config.mass ?? 1);
    const newVelocity = velocity + acceleration * 0.016; // Assuming 60fps

    return { force: totalForce, newVelocity };
  }

  static interpolateSpring(
    from: number,
    to: number,
    progress: number,
    config: SpringConfig
  ): number {
    // Simplified spring interpolation
    const t = progress;
    const stiffness = config.stiffness || 100;
    const damping = config.damping || 10;

    // Critically damped spring
    const omega = Math.sqrt(stiffness);
    const zeta = damping / (2 * Math.sqrt(stiffness));

    if (zeta >= 1) {
      // Over-damped
      const r1 = -omega * (zeta - Math.sqrt(zeta * zeta - 1));
      const r2 = -omega * (zeta + Math.sqrt(zeta * zeta - 1));
      return to + (from - to) * (r1 * Math.exp(r1 * t) - r2 * Math.exp(r2 * t)) / (r1 - r2);
    } else {
      // Under-damped
      const alpha = omega * Math.sqrt(1 - zeta * zeta);
      const beta = omega * zeta;
      return to + (from - to) * Math.exp(-beta * t) * Math.cos(alpha * t);
    }
  }
}

// Advanced physics utilities
export const physicsUtils = {
  // Calculate trajectory
  calculateTrajectory: (
    initialPosition: { x: number; y: number },
    initialVelocity: { x: number; y: number },
    gravity: { x: number; y: number },
    time: number
  ) => {
    return {
      x: initialPosition.x + initialVelocity.x * time + 0.5 * gravity.x * time * time,
      y: initialPosition.y + initialVelocity.y * time + 0.5 * gravity.y * time * time,
    };
  },

  // Calculate collision point
  calculateCollisionPoint: (
    bodyA: PhysicsBody,
    bodyB: PhysicsBody
  ): { x: number; y: number } | null => {
    const dx = bodyB.position.x - bodyA.position.x;
    const dy = bodyB.position.y - bodyA.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < bodyA.radius + bodyB.radius) {
      const overlap = bodyA.radius + bodyB.radius - distance;
      return {
        x: bodyA.position.x + (dx / distance) * (bodyA.radius - overlap / 2),
        y: bodyA.position.y + (dy / distance) * (bodyA.radius - overlap / 2),
      };
    }

    return null;
  },

  // Apply explosion force
  applyExplosion: (
    bodies: PhysicsBody[],
    center: { x: number; y: number },
    force: number,
    radius: number
  ): void => {
    bodies.forEach((body: any) => {
      const dx = body.position.x - center.x;
      const dy = body.position.y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && distance > 0) {
        const strength = (1 - distance / radius) * force;
        const impulse = {
          x: (dx / distance) * strength / body.mass,
          y: (dy / distance) * strength / body.mass,
        };

        body.velocity.x += impulse.x;
        body.velocity.y += impulse.y;
      }
    });
  },
};
