import _ from 'lodash';
import Oscillator from './oscillator';

const audioCtx = new AudioContext();

function playTwoSounds() {
    console.log('play');
    audioCtx.resume(); // has to receive input from user to start

    const osc = new Oscillator(audioCtx, audioCtx.destination);

    // lmao callback hell
    osc.playFrequency(400);
    setTimeout(() => {
        osc.playFrequency(500);
        setTimeout(() => {
            osc.stop();
        }, 2000);
    }, 2000);
}

document.getElementById('button').onclick = playTwoSounds;