/**
 * AuraGlass Physics Engine
 * A comprehensive 2D physics simulation system with collision detection,
 * spring dynamics, and gesture-based interactions
 */

import { Vector2D, createVector2D, addVectors, multiplyVector, subtractVectors } from '../types/common';

/**
 * Physics body state representing position, velocity, and acceleration
 */
export interface PhysicsBodyState {
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  rotation: number;
  angularVelocity: number;
  mass: number;
  timestamp: number;
}

/**
 * Options for configuring a physics body
 */
export interface PhysicsBodyOptions {
  mass?: number;
  friction?: number;
  restitution?: number; // Bounciness (0-1)
  fixedRotation?: boolean;
  gravityScale?: number;
  damping?: number;
  angularDamping?: number;
  initialPosition?: Vector2D;
  initialVelocity?: Vector2D;
  bounds?: {
    min: Vector2D;
    max: Vector2D;
  };
}

/**
 * Collision event data
 */
export interface CollisionEvent {
  bodyA: string; // Body ID
  bodyB: string; // Body ID
  point: Vector2D;
  normal: Vector2D;
  penetration: number;
  timestamp: number;
}

/**
 * Physics body internal representation
 */
interface PhysicsBody {
  id: string;
  state: PhysicsBodyState;
  options: Required<PhysicsBodyOptions>;
  forces: Vector2D[];
  collisionListeners: Array<(event: CollisionEvent) => void>;
}

/**
 * AuraGlass Physics Engine API
 */
export class AuraPhysicsEngineAPI {
  private bodies: Map<string, PhysicsBody> = new Map();
  private running: boolean = false;
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private gravity: Vector2D = createVector2D(0, 9.8);
  private timeScale: number = 1.0;

  constructor() {
    this.update = this.update.bind(this);
  }

  /**
   * Create a new physics body
   */
  createBody(id: string, options: PhysicsBodyOptions = {}): string {
    const defaultOptions: Required<PhysicsBodyOptions> = {
      mass: options.mass ?? 1,
      friction: options.friction ?? 0.3,
      restitution: options.restitution ?? 0.5,
      fixedRotation: options.fixedRotation ?? false,
      gravityScale: options.gravityScale ?? 1,
      damping: options.damping ?? 0.01,
      angularDamping: options.angularDamping ?? 0.01,
      initialPosition: options.initialPosition ?? createVector2D(0, 0),
      initialVelocity: options.initialVelocity ?? createVector2D(0, 0),
      bounds: options.bounds ?? {
        min: createVector2D(-Infinity, -Infinity),
        max: createVector2D(Infinity, Infinity),
      },
    };

    const body: PhysicsBody = {
      id,
      state: {
        position: { ...defaultOptions.initialPosition },
        velocity: { ...defaultOptions.initialVelocity },
        acceleration: createVector2D(0, 0),
        rotation: 0,
        angularVelocity: 0,
        mass: defaultOptions.mass,
        timestamp: Date.now(),
      },
      options: defaultOptions,
      forces: [],
      collisionListeners: [],
    };

    this.bodies.set(id, body);
    return id;
  }

  /**
   * Remove a physics body
   */
  removeBody(id: string): void {
    this.bodies.delete(id);
  }

  /**
   * Apply force to a body
   */
  applyForce(id: string, force: Vector2D): void {
    const body = this.bodies.get(id);
    if (body) {
      body.forces.push(force);
    }
  }

  /**
   * Apply impulse (instant velocity change) to a body
   */
  applyImpulse(id: string, impulse: Vector2D): void {
    const body = this.bodies.get(id);
    if (body) {
      body.state.velocity = addVectors(
        body.state.velocity,
        multiplyVector(impulse, 1 / body.state.mass)
      );
    }
  }

  /**
   * Set velocity of a body
   */
  setVelocity(id: string, velocity: Vector2D): void {
    const body = this.bodies.get(id);
    if (body) {
      body.state.velocity = { ...velocity };
    }
  }

  /**
   * Set position of a body
   */
  setPosition(id: string, position: Vector2D): void {
    const body = this.bodies.get(id);
    if (body) {
      body.state.position = { ...position };
    }
  }

  /**
   * Get the current state of a body
   */
  getBodyState(id: string): PhysicsBodyState | null {
    const body = this.bodies.get(id);
    return body ? { ...body.state } : null;
  }

  /**
   * Add collision listener to a body
   */
  onCollision(id: string, listener: (event: CollisionEvent) => void): () => void {
    const body = this.bodies.get(id);
    if (body) {
      body.collisionListeners.push(listener);
      return () => {
        const index = body.collisionListeners.indexOf(listener);
        if (index !== -1) {
          body.collisionListeners.splice(index, 1);
        }
      };
    }
    return () => {};
  }

  /**
   * Set gravity
   */
  setGravity(gravity: Vector2D): void {
    this.gravity = gravity;
  }

  /**
   * Set time scale (slow motion / speed up)
   */
  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
  }

  /**
   * Start the physics simulation
   */
  start(): void {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.update();
    }
  }

  /**
   * Stop the physics simulation
   */
  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Force an update of the physics simulation
   */
  forceUpdate(): void {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    this.step(deltaTime * this.timeScale);
  }

  /**
   * Main update loop
   */
  private update(): void {
    if (!this.running) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.step(deltaTime * this.timeScale);

    this.animationFrameId = requestAnimationFrame(this.update);
  }

  /**
   * Physics simulation step
   */
  private step(deltaTime: number): void {
    // Cap delta time to prevent instability
    const dt = Math.min(deltaTime, 0.016); // Max 60 FPS equivalent

    this.bodies.forEach((body) => {
      // Apply gravity
      const gravityForce = multiplyVector(
        this.gravity,
        body.state.mass * body.options.gravityScale
      );
      body.forces.push(gravityForce);

      // Calculate net force
      const netForce = body.forces.reduce(
        (acc, force) => addVectors(acc, force),
        createVector2D(0, 0)
      );

      // Calculate acceleration (F = ma)
      body.state.acceleration = multiplyVector(netForce, 1 / body.state.mass);

      // Update velocity
      body.state.velocity = addVectors(
        body.state.velocity,
        multiplyVector(body.state.acceleration, dt)
      );

      // Apply damping
      body.state.velocity = multiplyVector(
        body.state.velocity,
        Math.pow(1 - body.options.damping, dt)
      );

      // Update position
      body.state.position = addVectors(
        body.state.position,
        multiplyVector(body.state.velocity, dt)
      );

      // Apply bounds
      if (body.options.bounds) {
        const { min, max } = body.options.bounds;

        if (body.state.position.x < min.x) {
          body.state.position.x = min.x;
          body.state.velocity.x *= -body.options.restitution;
        }
        if (body.state.position.x > max.x) {
          body.state.position.x = max.x;
          body.state.velocity.x *= -body.options.restitution;
        }
        if (body.state.position.y < min.y) {
          body.state.position.y = min.y;
          body.state.velocity.y *= -body.options.restitution;
        }
        if (body.state.position.y > max.y) {
          body.state.position.y = max.y;
          body.state.velocity.y *= -body.options.restitution;
        }
      }

      // Update rotation
      if (!body.options.fixedRotation) {
        body.state.rotation += body.state.angularVelocity * dt;
        body.state.angularVelocity *= Math.pow(1 - body.options.angularDamping, dt);
      }

      // Update timestamp
      body.state.timestamp = Date.now();

      // Clear forces for next frame
      body.forces = [];
    });

    // Detect collisions (simple AABB for now)
    this.detectCollisions();
  }

  /**
   * Simple collision detection
   */
  private detectCollisions(): void {
    const bodyArray = Array.from(this.bodies.values());

    for (let i = 0; i < bodyArray.length; i++) {
      for (let j = i + 1; j < bodyArray.length; j++) {
        const bodyA = bodyArray[i];
        const bodyB = bodyArray[j];

        // Simple distance-based collision
        const distance = Math.sqrt(
          Math.pow(bodyA.state.position.x - bodyB.state.position.x, 2) +
          Math.pow(bodyA.state.position.y - bodyB.state.position.y, 2)
        );

        // Assume radius of 20 for simplicity
        const collisionThreshold = 40;

        if (distance < collisionThreshold) {
          const collisionPoint = createVector2D(
            (bodyA.state.position.x + bodyB.state.position.x) / 2,
            (bodyA.state.position.y + bodyB.state.position.y) / 2
          );

          const normal = subtractVectors(bodyB.state.position, bodyA.state.position);
          const normalMagnitude = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
          const normalizedNormal: Vector2D = normalMagnitude > 0
            ? multiplyVector(normal, 1 / normalMagnitude)
            : createVector2D(0, 0);

          const event: CollisionEvent = {
            bodyA: bodyA.id,
            bodyB: bodyB.id,
            point: collisionPoint,
            normal: normalizedNormal,
            penetration: collisionThreshold - distance,
            timestamp: Date.now(),
          };

          // Notify listeners
          bodyA.collisionListeners.forEach((listener) => listener(event));
          bodyB.collisionListeners.forEach((listener) => listener(event));
        }
      }
    }
  }

  /**
   * Get all body IDs
   */
  getBodies(): string[] {
    return Array.from(this.bodies.keys());
  }

  /**
   * Clear all bodies
   */
  clear(): void {
    this.bodies.clear();
  }
}

// Global instance
let globalPhysicsEngine: AuraPhysicsEngineAPI | null = null;

/**
 * Get the global physics engine instance
 */
export const getGlobalPhysicsEngine = (): AuraPhysicsEngineAPI => {
  if (!globalPhysicsEngine) {
    globalPhysicsEngine = new AuraPhysicsEngineAPI();
  }
  return globalPhysicsEngine;
};

/**
 * Force update the global physics engine
 */
export const forcePhysicsEngineUpdate = (): void => {
  const engine = getGlobalPhysicsEngine();
  engine.forceUpdate();
};

/**
 * Get physics body state from the global engine
 */
export const getPhysicsBodyState = (bodyId: string): PhysicsBodyState | null => {
  const engine = getGlobalPhysicsEngine();
  return engine.getBodyState(bodyId);
};
