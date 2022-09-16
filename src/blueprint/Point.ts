export class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  // @ Get the midpoint of two points
  middileWith(p: Point): Point {
    const mx = (this.x + p.x) / 2
    const my = (this.y + p.y) / 2
    return new Point(mx, my)
  }

  // @ Get the distance from another point to this point
  distanceWith(p: Point): number {
    return Math.pow(
      (p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y),
      0.5,
    )
  }
}
