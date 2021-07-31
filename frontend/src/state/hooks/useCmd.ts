import { RefObject, useRef } from 'react';
import $ from 'jquery';
import { CMD } from '../../Components/PlayComponents/Cmd/cmdTypes';

const useCmd = (): [ref: RefObject<HTMLDivElement>, cmd: CMD | null] => {
  const cmd = useRef<HTMLDivElement>(null);

  if (!cmd || !cmd.current) return [cmd, null];

  const print = (msg: string) => {
    if (!cmd.current) return;
    const $cmd = $(cmd.current);
    let today = new Date()
    let heures = today.getHours() >= 10 ? today.getHours() : '0' + today.getHours()
    let minutes = today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes()
    let secondes = today.getSeconds() >= 10 ? today.getSeconds() : '0' + today.getSeconds()
    msg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    $cmd.append(`<span><u><i>${heures}:${minutes}:${secondes}:</i></u> ${msg}</span><br>`)
    $cmd.scrollTop(cmd.current.scrollHeight);
  }

  const error = (msg: string, line: number) => {
    if (!cmd.current) return;
    const $cmd = $(cmd.current);
    let today = new Date()
    let heures = today.getHours() >= 10 ? today.getHours() : '0' + today.getHours()
    let minutes = today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes()
    let secondes = today.getSeconds() >= 10 ? today.getSeconds() : '0' + today.getSeconds()
    msg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    $cmd.append(`<span style="color: red"><u><i>${heures}:${minutes}:${secondes}:</i></u> Erreur à la ligne <strong>#${line} :<br></strong><i>"${msg}"</i></span><br>`)
    $cmd.scrollTop(cmd.current.scrollHeight);
  }

  const clear = () => {
    if (!cmd.current) return;
    cmd.current.innerHTML = '';
  }

  return [
    cmd,
    {
      print,
      error,
      clear
    }
  ]

}

export default useCmd;