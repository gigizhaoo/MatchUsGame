export enum EObstacleType {
  Null,
  Stake,   // 阻碍前进
  Freeze, 
  // Bomb,
}

export default class Obstacle {
  constructor(
    public type: EObstacleType
  ) {}

  static randomType(percentage: number = 0.3) {
    percentage = percentage > 1 ? 1 : (percentage < 0 ? 0 : percentage);

    const random = Math.random();

    if (random < percentage / 2) {
      return EObstacleType.Stake;
    } else if (random < percentage) {
      return EObstacleType.Stake;
    }
    return EObstacleType.Null;
  }
}
