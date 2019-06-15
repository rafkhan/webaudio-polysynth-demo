import _ from 'lodash';


const audioCtx = new AudioContext();

function playSound() {
    console.log('play');
    audioCtx.resume(); // has to receive input from user to start

    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
}

document.getElementById('button').onclick = playSound;