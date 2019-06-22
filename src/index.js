import _ from 'lodash';
import * as webmidi from "webmidi";

import Synth from './synth';

const audioCtx = new AudioContext();

const handleControlChange = synth => (e) => {
    switch(e.controller.number) {
        case 22:
            synth.onFilterChange(e.value);
    }
}

function onMidiEnabled() {
    const synth = new Synth(audioCtx);
    const input = webmidi.inputs[0];

    input.addListener('noteon', "all", e => {
        synth.onNoteDown(e.note.number);
    });

    input.addListener('noteoff', "all", e => {
        synth.onNoteUp(e.note.number);
    });

      // Listen to control change message on all channels
    input.addListener('controlchange', "all", handleControlChange(synth));

    console.log('probably ready to play lol');
}

function setupSynth() {
    audioCtx.resume(); // has to receive input from user to start
    webmidi.enable(err => {
        if(err) {
            throw err;
        }

        onMidiEnabled();
    });
}

document.getElementById('button').onclick = setupSynth;