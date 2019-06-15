export default class Oscillator {
    constructor(audioCtx, destinationNode) {
        this.audioCtx = audioCtx;
        this.oscNode = audioCtx.createOscillator();
        this.gainNode = audioCtx.createGain();

        this.oscNode.connect(this.gainNode);
        this.gainNode.connect(destinationNode);

        this.gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        this.oscNode.start();
    }

    playFrequency(hertz) {
        this.oscNode.frequency.setValueAtTime(hertz, this.audioCtx.currentTime); // value in hertz
        this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime);
    }

    stop() {
        this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    }
}