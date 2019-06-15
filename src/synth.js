import { range, findIndex } from 'lodash';
import MIDIUtils from 'midiutils';
import Oscillator from './oscillator';

const VOICES_COUNT = 16;

export default class Synth {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        this.oscillators = range(VOICES_COUNT).map(() => new Oscillator(audioCtx, audioCtx.destination));

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
        if(typeof note === 'string') {
            note = MIDIUtils.noteNameToNoteNumber(note);
        } else if(typeof note !== 'number') {
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

        if(firstAvailableVoiceIndex === -1) {
            // none left :(
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
    }
}
