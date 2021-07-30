import { Executor } from './Executor';
import { PlaySocket } from '../../Pages/Level/PlaySocket';

export interface PlayExecutor extends Executor {
  playButton: JQuery;
  socket?: PlaySocket;
}