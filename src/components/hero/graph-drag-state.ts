const maxPitch = Math.PI / 4;

export class GraphDragController {
  private activeValue = false;
  private didDragValue = false;
  private pointerIdValue: number | null = null;
  private lastX = 0;
  private lastY = 0;
  private lastTime = 0;
  private pitchValue = 0;
  private yawValue = 0;
  private velocityPitch = 0;
  private velocityYaw = 0;

  get active() { return this.activeValue; }
  get didDrag() { return this.didDragValue; }
  get pointerId() { return this.pointerIdValue; }
  get pitch() { return this.pitchValue; }
  get yaw() { return this.yawValue; }

  start(pointerId: number, x: number, y: number, time: number) {
    this.activeValue = true;
    this.didDragValue = false;
    this.pointerIdValue = pointerId;
    this.lastX = x;
    this.lastY = y;
    this.lastTime = time;
    this.velocityPitch = 0;
    this.velocityYaw = 0;
  }

  move(pointerId: number, x: number, y: number, time: number) {
    if (!this.activeValue || this.pointerIdValue !== pointerId) return;
    const deltaX = x - this.lastX;
    const deltaY = y - this.lastY;
    const elapsed = Math.max(8, time - this.lastTime);
    if (this.didDragValue || Math.hypot(deltaX, deltaY) >= 4) this.didDragValue = true;
    if (this.didDragValue) {
      const sensitivity = 0.006;
      this.yawValue += deltaX * sensitivity;
      this.pitchValue = Math.max(-maxPitch, Math.min(maxPitch, this.pitchValue + deltaY * sensitivity));
      this.velocityYaw = (deltaX * sensitivity * 1000) / elapsed;
      this.velocityPitch = (deltaY * sensitivity * 1000) / elapsed;
    }
    this.lastX = x;
    this.lastY = y;
    this.lastTime = time;
  }

  end(pointerId: number) {
    if (this.pointerIdValue !== pointerId) return false;
    this.activeValue = false;
    this.pointerIdValue = null;
    return true;
  }

  cancel() {
    this.activeValue = false;
    this.pointerIdValue = null;
    this.velocityPitch = 0;
    this.velocityYaw = 0;
  }

  advance(delta: number, reducedMotion: boolean, idleSpeed: number) {
    if (this.activeValue) return;
    if (reducedMotion) {
      this.velocityPitch = 0;
      this.velocityYaw = 0;
      return;
    }
    this.yawValue += this.velocityYaw * delta;
    this.pitchValue = Math.max(-maxPitch, Math.min(maxPitch, this.pitchValue + this.velocityPitch * delta));
    const friction = Math.exp(-5.5 * delta);
    this.velocityYaw *= friction;
    this.velocityPitch *= friction;
    if (Math.abs(this.velocityYaw) < 0.003 && Math.abs(this.velocityPitch) < 0.003) {
      this.velocityYaw = 0;
      this.velocityPitch = 0;
      this.yawValue += delta * idleSpeed;
    }
  }
}
