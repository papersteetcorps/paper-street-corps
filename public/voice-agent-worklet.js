class P extends AudioWorkletProcessor {
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      const buf = new Int16Array(ch.length);
      for (let i = 0; i < ch.length; i++) {
        const s = Math.max(-1, Math.min(1, ch[i]));
        buf[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      this.port.postMessage(buf.buffer, [buf.buffer]);
    }
    return true;
  }
}
registerProcessor("pcm", P);
