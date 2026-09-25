export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Checks Axis-Aligned Bounding Box (AABB) intersection between two rectangles.
 */
export function checkAABBIntersection(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Checks intersection between a circle and an AABB rectangle.
 */
export function checkCircleBoxIntersection(circle: Circle, box: AABB): boolean {
  // Find closest point on box to circle center
  const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
  const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));

  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;

  const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
  return distanceSquared <= (circle.radius * circle.radius);
}

/**
 * Checks intersection between two circles.
 */
export function checkCircleIntersection(c1: Circle, c2: Circle): boolean {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distanceSquared = dx * dx + dy * dy;
  const radiusSum = c1.radius + c2.radius;
  return distanceSquared <= radiusSum * radiusSum;
}

/**
 * Performs a 2D line segment raycast intersection check.
 * Returns intersection point and distance scalar if intersecting, or null.
 */
export function checkRaySegmentIntersection(
  rayOrigin: Point,
  rayDir: Point,
  segA: Point,
  segB: Point
): { point: Point; t: number } | null {
  const v1 = rayOrigin.x - segA.x;
  const v2 = rayOrigin.y - segA.y;
  const v3 = segB.x - segA.x;
  const v4 = segB.y - segA.y;

  const dot = v3 * rayDir.y - v4 * rayDir.x;
  if (Math.abs(dot) < 0.00001) return null;

  const t1 = (v4 * v1 - v3 * v2) / dot;
  const t2 = (rayDir.x * v2 - rayDir.y * v1) / dot;

  if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
    return {
      point: {
        x: rayOrigin.x + t1 * rayDir.x,
        y: rayOrigin.y + t1 * rayDir.y,
      },
      t: t1,
    };
  }

  return null;
}

/**
 * Checks if a falling entity landed on a one-way horizontal platform surface.
 * @param entityX Entity current X position
 * @param entityY Entity current Y position (feet position)
 * @param prevY Entity previous Y position
 * @param vy Entity vertical velocity
 * @param platX Platform left coordinate
 * @param platY Platform top surface coordinate
 * @param platWidth Platform width
 * @param tolerance Margin of landing penetration
 */
export function checkPlatformLanding(
  entityX: number,
  entityY: number,
  prevY: number,
  vy: number,
  platX: number,
  platY: number,
  platWidth: number,
  tolerance: number = 14
): boolean {
  // Must be moving downward or stationary
  if (vy < 0) return false;

  // Must be within horizontal bounds
  if (entityX < platX || entityX > platX + platWidth) return false;

  // Must cross or touch the platform top edge from above
  return entityY >= platY && prevY <= platY + tolerance;
}
