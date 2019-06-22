import { range, findIndex } from 'lodash';
import MIDIUtils from 'midiutils';
import Oscillator from './oscillator';

const VOICES_COUNT = 16;

function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for (; i < n_samples; ++i) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
};

export default class Synth {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;


        // const distortion = audioCtx.createWaveShaper();
        // distortion.curve = makeDistortionCurve(10);
        // // distortion.oversample = '2x';
        // distortion.connect(biquadFilter);

        const compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
        compressor.knee.setValueAtTime(40, audioCtx.currentTime);
        compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
        compressor.attack.setValueAtTime(0, audioCtx.currentTime);
        compressor.release.setValueAtTime(0.5, audioCtx.currentTime);
        compressor.connect(audioCtx.destination);
        this.compressor = compressor;

        const biquadFilter = audioCtx.createBiquadFilter();
        biquadFilter.type = "lowpass";
        biquadFilter.frequency.setValueAtTime(20000, audioCtx.currentTime);
        biquadFilter.Q.setValueAtTime(10, audioCtx.currentTime);
        biquadFilter.connect(audioCtx.destination);
        this.biquadFilter = biquadFilter;

        // const destination = audioCtx.destination;
        const destination = biquadFilter;

        this.oscillators = range(VOICES_COUNT).map(() => new Oscillator(audioCtx, biquadFilter));

        // Set of flags determining whether the oscillator at the index is being played
        this.activeVoices = range(VOICES_COUNT).map(() => false);

        // LIFO queue of voice indexes played. Used to determine which voice to remove.
        this.lastPlayedVoices = [];

        // Map between the notes and the index of the oscillator they're playing
        // This is so when a note goes up, we can tell which oscillator to stop and remove from the queue
        this.oscillatorIndexByNoteNumber = {};

    }

    // TODO: FUCKIN GUT THIS
    getNoteData(note) {
        if (typeof note === 'string') {
            note = MIDIUtils.noteNameToNoteNumber(note);
        } else if (typeof note !== 'number') {
            throw new Error('Note must be number or string')
        }

        return {
            freq: MIDIUtils.noteNumberToFrequency(note),
            noteNumber: note
        };
    }

    onNoteDown(note) { // should be midi note #
        const {
            freq,
            noteNumber
        } = this.getNoteData(note);

        const firstAvailableVoiceIndex = findIndex(this.activeVoices, isActive => isActive === false);

        // see if there is a voice available
        if (firstAvailableVoiceIndex === -1) {
            // none left :(
            // TODO handle case where voice needs to be eliminated from LIFO
            return;
        }

        if (this.oscillatorIndexByNoteNumber[noteNumber]) {
            return;
        }

        console.log(freq);

        this.activeVoices[firstAvailableVoiceIndex] = true;
        this.lastPlayedVoices.push(firstAvailableVoiceIndex);
        this.oscillatorIndexByNoteNumber[noteNumber] = firstAvailableVoiceIndex;
        this.oscillators[firstAvailableVoiceIndex].playFrequency(freq);
    }

    onNoteUp(note) {
        const {
            noteNumber
        } = this.getNoteData(note);

        const oscIndex = this.oscillatorIndexByNoteNumber[noteNumber];
        this.oscillatorIndexByNoteNumber[noteNumber] = null;

        const lastPlayedIndex = this.lastPlayedVoices.indexOf(oscIndex);
        if (lastPlayedIndex > -1) {
            this.lastPlayedVoices.splice(lastPlayedIndex, 1);
        }

        this.activeVoices[oscIndex] = false;
        this.oscillators[oscIndex].stop();
    }

    onFilterChange(value) {
        const filterMin = 20;
        const filterMax = 20000;
        const valMax = 127;

        const freq = value / valMax * (filterMax - filterMin) + filterMin;
        this.biquadFilter.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    }
}
