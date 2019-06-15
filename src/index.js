import _ from 'lodash';
import Synth from './synth';


const audioCtx = new AudioContext();

function playTwoSounds() {
    console.log('play');
    audioCtx.resume(); // has to receive input from user to start

    const synth = new Synth(audioCtx);
    synth.onNoteDown('C-4');
    synth.onNoteDown('F-4');
    synth.onNoteDown(70);
}

document.getElementById('button').onclick = playTwoSounds;