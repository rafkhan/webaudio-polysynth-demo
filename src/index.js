import _ from 'lodash';
import Oscillator from './oscillator';

const audioCtx = new AudioContext();

function playTwoSounds() {
    console.log('play');
    audioCtx.resume(); // has to receive input from user to start

    const osc = new Oscillator(audioCtx, audioCtx.destination);
    const osc2 = new Oscillator(audioCtx, audioCtx.destination);

    // lmao callback hell
    osc.playFrequency(1000);
    osc2.playFrequency(200);
    setTimeout(() => {
        osc.playFrequency(1300);
        osc2.playFrequency(250);
        setTimeout(() => {
            osc.stop();
            osc2.stop();
        }, 2000);
    }, 2000);
}

document.getElementById('button').onclick = playTwoSounds;