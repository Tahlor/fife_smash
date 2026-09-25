import { describe, it, expect } from 'vitest';
import {
  checkAABBIntersection,
  checkCircleBoxIntersection,
  checkPlatformLanding,
} from '../Collisions';

describe('Collisions Physics Math', () => {
  it('should detect overlapping AABB boxes', () => {
    const boxA = { x: 0, y: 0, width: 50, height: 50 };
    const boxB = { x: 25, y: 25, width: 50, height: 50 };
    const boxC = { x: 100, y: 100, width: 50, height: 50 };

    expect(checkAABBIntersection(boxA, boxB)).toBe(true);
    expect(checkAABBIntersection(boxA, boxC)).toBe(false);
  });

  it('should detect circle and box intersections', () => {
    const box = { x: 0, y: 0, width: 100, height: 100 };
    const circleInside = { x: 50, y: 50, radius: 10 };
    const circleEdge = { x: 105, y: 50, radius: 10 };
    const circleFar = { x: 150, y: 50, radius: 10 };

    expect(checkCircleBoxIntersection(circleInside, box)).toBe(true);
    expect(checkCircleBoxIntersection(circleEdge, box)).toBe(true);
    expect(checkCircleBoxIntersection(circleFar, box)).toBe(false);
  });

  it('should correctly resolve one-way platform landing', () => {
    const platX = -100;
    const platY = -120;
    const platWidth = 200;

    // Entity falling downward crossing the surface threshold
    const landing = checkPlatformLanding(0, -120, -125, 5, platX, platY, platWidth);
    expect(landing).toBe(true);

    // Entity moving upward (jumping through platform from below)
    const upwardPass = checkPlatformLanding(0, -120, -115, -5, platX, platY, platWidth);
    expect(upwardPass).toBe(false);

    // Entity outside horizontal bounds
    const outOfBounds = checkPlatformLanding(250, -120, -125, 5, platX, platY, platWidth);
    expect(outOfBounds).toBe(false);
  });
});
