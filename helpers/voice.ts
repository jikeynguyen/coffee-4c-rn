let VoiceMod: any = null;
try {
  VoiceMod = require("@react-native-voice/voice").default;
} catch {}
export const Voice = VoiceMod;
export const hasVoice = !!(VoiceMod && VoiceMod.start);
