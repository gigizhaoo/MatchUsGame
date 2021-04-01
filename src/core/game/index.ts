import GameSinglePlayer from './game_single_player';

export enum EGameMode {
  SinglePlayer = 1,
}

export default class GameFactory {
  static select(mode: EGameMode) {
    switch(mode) {
      case EGameMode.SinglePlayer: return new GameSinglePlayer(null);
      default: return new GameSinglePlayer(null) ;
    }
  }
}
