import { Executor } from './Executor';
import { PlaySocket } from '../../Pages/Challenge/PlaySocket';

export interface PlayExecutor extends Executor {
  playButton: JQuery;
  socket?: PlaySocket;
}