import _ from 'lodash';
import Synth from './synth';


const audioCtx = new AudioContext();

function playTwoSounds() {
    console.log('play');
    audioCtx.resume(); // has to receive input from user to start

    const synth = new Synth(audioCtx);

    setTimeout(() => synth.onNoteDown('C-4'), 200);
    setTimeout(() => synth.onNoteDown('F-4'), 400);
    setTimeout(() => synth.onNoteDown(70), 600);

    setTimeout(() => {
        synth.onNoteUp('C-4');
        synth.onNoteUp('F-4');
        synth.onNoteUp(70);
    }, 3000);
}

document.getElementById('button').onclick = playTwoSounds;