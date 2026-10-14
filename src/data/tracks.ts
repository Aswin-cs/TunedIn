export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface TelemetrySpecs {
  sampleRate: string;
  bitDepth: string;
  dynamicRange: string;
  codec: string;
  channels: string;
  recordingStudio: string;
  tapeMachine: string;
  microphones: string;
  masterEngineer: string;
  linerNotes: string;
}

export interface TrackTheme {
  name: string;
  accent: string;
  accentHover: string;
  accentGlow: string;
  accentSubtle: string;
  ambientTop: string;
  ambientBottom: string;
  canvas: string;
  surfaceGlass: string;
  cardBg: string;
  vinylLabel: string;
  vinylBorder: string;
  highlightText: string;
  textHigh: string;
  textMedium: string;
  textMuted: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  dateAdded: string;
  format: string;
  rate: string;
  genre: string;
  releaseYear: string;
  coverAccent: string;
  coverSecondary: string;
  vibe: string;
  lyrics: LyricLine[];
  telemetry: TelemetrySpecs;
  theme?: TrackTheme;
}

export const TRACKS_DATA: Track[] = [
  {
    id: 1,
    title: "Round Midnight (Live Master Session)",
    artist: "The Modern Acoustic Ensemble",
    album: "Verve & Velvet: Analog Sessions",
    duration: "05:42",
    durationSeconds: 342,
    dateAdded: "2 days ago",
    format: "FLAC",
    rate: "192kHz / 24-bit",
    genre: "Vinyl Classics",
    releaseYear: "2026",
    coverAccent: "#D97706",
    coverSecondary: "#FAF8F5",
    vibe: "Warm Analog & Smoke",
    theme: {
      name: "Warm Amber & Honey Ivory",
      accent: "#D97706",
      accentHover: "#B45309",
      accentGlow: "rgba(217, 119, 6, 0.28)",
      accentSubtle: "rgba(217, 119, 6, 0.10)",
      ambientTop: "rgba(245, 158, 11, 0.18)",
      ambientBottom: "rgba(232, 140, 43, 0.10)",
      canvas: "#FAF8F5",
      surfaceGlass: "rgba(255, 255, 255, 0.90)",
      cardBg: "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 244, 237, 0.88) 100%)",
      vinylLabel: "radial-gradient(circle, #F59E0B 0%, #D97706 60%, #92400E 100%)",
      vinylBorder: "#FFFFFF",
      highlightText: "#B45309",
      textHigh: "#1C120C",
      textMedium: "#5C4A42",
      textMuted: "#8C776D",
    },
    lyrics: [
      { time: 0, text: "♪ [Instrumental opening: Warm double bass and brushed snare] ♪" },
      { time: 14, text: "It begins to tell, 'round midnight, 'round midnight" },
      { time: 32, text: "I do pretty well, till after sundown" },
      { time: 48, text: "Suppertime I'm feelin' sad; but it really gets bad" },
      { time: 64, text: "'Round midnight in the amber glow of the parlor" },
      { time: 82, text: "♪ [Tenor saxophone solo - uncompressed dynamic bloom] ♪" },
      { time: 110, text: "Memories always start 'round midnight, haven't got the heart to stand those memories" },
      { time: 132, text: "When my heart is still with you, and old midnight knows it too" },
      { time: 160, text: "♪ [Upright bass walking groove & vintage Rhodes piano] ♪" },
      { time: 195, text: "Dear, our love would be safe and sound once more" },
      { time: 220, text: "If you would only turn that latch upon the door" },
      { time: 250, text: "And let the midnight blues drift away into dawn..." },
      { time: 285, text: "♪ [Subtle brush swell, ribbon mic room resonance decay] ♪" },
    ],
    telemetry: {
      sampleRate: "192,000 Hz",
      bitDepth: "24-bit Linear PCM",
      dynamicRange: "DR15 (Audiophile Reference)",
      codec: "Free Lossless Audio Codec (FLAC)",
      channels: "2.0 True Stereo Uncompressed",
      recordingStudio: "Sunset Sound Studio 2, Hollywood",
      tapeMachine: "Studer A800 24-Track 2-inch Analog Tape @ 30 ips",
      microphones: "Neumann U47 & Coles 4038 Ribbon Pairs",
      masterEngineer: "Bernie Grundman (Direct Lacquer Cut)",
      linerNotes: "Recorded live-to-two-track without brickwall limiters or DSP noise reduction. Room acoustic reflections preserved naturally across a 32-foot mahogany hall.",
    },
  },
  {
    id: 2,
    title: "Symphony No. 5 in C Minor - Allegro con brio",
    artist: "Vienna Philharmonic Orchestra",
    album: "Beethoven: The Master Tapes",
    duration: "07:18",
    durationSeconds: 438,
    dateAdded: "1 week ago",
    format: "DSD",
    rate: "DSD128 Master",
    genre: "Acoustic Masters",
    releaseYear: "2025",
    coverAccent: "#DC2626",
    coverSecondary: "#FDF8F7",
    vibe: "Orchestral Thunder",
    theme: {
      name: "Rose Alabaster & Crimson",
      accent: "#DC2626",
      accentHover: "#991B1B",
      accentGlow: "rgba(220, 38, 38, 0.25)",
      accentSubtle: "rgba(220, 38, 38, 0.08)",
      ambientTop: "rgba(239, 68, 68, 0.15)",
      ambientBottom: "rgba(254, 202, 202, 0.35)",
      canvas: "#FDF8F7",
      surfaceGlass: "rgba(255, 255, 255, 0.90)",
      cardBg: "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(253, 242, 242, 0.88) 100%)",
      vinylLabel: "radial-gradient(circle, #EF4444 0%, #DC2626 60%, #991B1B 100%)",
      vinylBorder: "#FFFFFF",
      highlightText: "#991B1B",
      textHigh: "#1E0C0C",
      textMedium: "#5E4040",
      textMuted: "#8F6E6E",
    },
    lyrics: [
      { time: 0, text: "♪ [Fate motif: Da-da-da-DUM in monumental fortissimo] ♪" },
      { time: 22, text: "♪ [Echoing horn passages across Golden Hall acoustic canopy] ♪" },
      { time: 54, text: "♪ [First subject development: surging strings in counterpoint] ♪" },
      { time: 92, text: "♪ [Oboe cadenza: singular, fragile acoustic breath] ♪" },
      { time: 135, text: "♪ [Crescendo building through timpani resonance and brass fanfares] ♪" },
      { time: 180, text: "♪ [Recapitulation: explosive dynamic peak DR16] ♪" },
      { time: 240, text: "♪ [Coda entry: relentless kinetic pulse driving into the cadence] ♪" },
    ],
    telemetry: {
      sampleRate: "5,644,800 Hz (1-bit DSD128)",
      bitDepth: "1-bit Direct Stream Digital",
      dynamicRange: "DR16 (Massive Symphonic Range)",
      codec: "Direct Stream Digital (DFF)",
      channels: "2.0 Pure DSD Direct Stream",
      recordingStudio: "Musikverein Golden Hall, Vienna",
      tapeMachine: "Pyramix MassCore Merging Technologies Station",
      microphones: "Schoeps Colette Stereo Array + DPA 4006 Omnis",
      masterEngineer: "Christoph Stickel",
      linerNotes: "Direct conversion from pure acoustic microphones to DSD128 5.6MHz delta-sigma modulation. No intermediate PCM downsampling.",
    },
  },
  {
    id: 3,
    title: "Celestial Architecture (Spatial Mix)",
    artist: "Julianna Barwick & Eluvium",
    album: "Acoustic Chambers Vol. II",
    duration: "04:35",
    durationSeconds: 275,
    dateAdded: "3 weeks ago",
    format: "ATMOS",
    rate: "96kHz / 24-bit",
    genre: "Ambient & Spatial",
    releaseYear: "2026",
    coverAccent: "#0891B2",
    coverSecondary: "#F4F9FA",
    vibe: "Ethereal Sanctuary",
    theme: {
      name: "Crystal Cloud & Aurora Teal",
      accent: "#0891B2",
      accentHover: "#0E7490",
      accentGlow: "rgba(8, 145, 178, 0.25)",
      accentSubtle: "rgba(8, 145, 178, 0.08)",
      ambientTop: "rgba(6, 182, 212, 0.16)",
      ambientBottom: "rgba(207, 250, 254, 0.40)",
      canvas: "#F4F9FA",
      surfaceGlass: "rgba(255, 255, 255, 0.90)",
      cardBg: "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(236, 254, 255, 0.88) 100%)",
      vinylLabel: "radial-gradient(circle, #06B6D4 0%, #0891B2 60%, #164E63 100%)",
      vinylBorder: "#FFFFFF",
      highlightText: "#0E7490",
      textHigh: "#08171E",
      textMedium: "#3E535E",
      textMuted: "#6C8592",
    },
    lyrics: [
      { time: 0, text: "♪ [Lush looped vocal harmonies ascending in harmonic intervals] ♪" },
      { time: 30, text: "Floating through the cathedral arches..." },
      { time: 65, text: "Where sound has weight, and breath is light" },
      { time: 105, text: "Echoes of stained glass, shimmering in golden dusk" },
      { time: 145, text: "♪ [Sub-bass synth pulse beneath 14-voice layered choir] ♪" },
      { time: 190, text: "A temple made of resonance and silent time" },
      { time: 230, text: "♪ [Gentle acoustic decay into room silence] ♪" },
    ],
    telemetry: {
      sampleRate: "96,000 Hz",
      bitDepth: "24-bit TrueHD Binaural",
      dynamicRange: "DR14 (Spatial Immersion)",
      codec: "Dolby Atmos Lossless Spatial Audio",
      channels: "7.1.4 Immersive Object Canvas",
      recordingStudio: "Church of St. Ann, Brooklyn & Sundlaugin",
      tapeMachine: "Pro Tools Ultimate HDX / Merging Anubis",
      microphones: "Royer R-121 Ribbons & Neumann M149 Tubes",
      masterEngineer: "Morten Lindberg (2L Spatial)",
      linerNotes: "Multi-point spatialized binaural capture calibrated for planar magnetic and electro-static headphone rendering.",
    },
  },
  {
    id: 4,
    title: "Autumn in New York (Uncompressed Vinyl Rip)",
    artist: "Chet Baker Quartet",
    album: "Midnight Trumpet",
    duration: "03:59",
    durationSeconds: 239,
    dateAdded: "Aug 14, 2026",
    format: "FLAC",
    rate: "192kHz / 24-bit",
    genre: "Vinyl Classics",
    releaseYear: "2024",
    coverAccent: "#EA580C",
    coverSecondary: "#FAF6F2",
    vibe: "Cool Jazz Melancholy",
    theme: {
      name: "Sunlit Ochre & Peach Linen",
      accent: "#EA580C",
      accentHover: "#C2410C",
      accentGlow: "rgba(234, 88, 12, 0.25)",
      accentSubtle: "rgba(234, 88, 12, 0.08)",
      ambientTop: "rgba(251, 146, 60, 0.16)",
      ambientBottom: "rgba(255, 237, 213, 0.40)",
      canvas: "#FAF6F2",
      surfaceGlass: "rgba(255, 255, 255, 0.90)",
      cardBg: "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 247, 237, 0.88) 100%)",
      vinylLabel: "radial-gradient(circle, #FB923C 0%, #EA580C 60%, #9A3412 100%)",
      vinylBorder: "#FFFFFF",
      highlightText: "#C2410C",
      textHigh: "#1E100A",
      textMedium: "#5E453B",
      textMuted: "#8E7469",
    },
    lyrics: [
      { time: 0, text: "♪ [Subtle vinyl needle drop and soft brushed cymbals] ♪" },
      { time: 15, text: "Autumn in New York, why does it seem so inviting?" },
      { time: 38, text: "Autumn in New York, it spells the thrill of first-nighting" },
      { time: 62, text: "Glittering crowds and shimmering clouds in canyons of steel" },
      { time: 90, text: "They're making me feel: I'm home..." },
      { time: 115, text: "♪ [Lyrical muted trumpet solo with intimate breath detail] ♪" },
      { time: 160, text: "No city holds a candle to autumn leaves upon Central Park" },
      { time: 195, text: "When dusk turns deep maroon against the harbor lights..." },
    ],
    telemetry: {
      sampleRate: "192,000 Hz",
      bitDepth: "24-bit Lossless",
      dynamicRange: "DR14 (Original Vinyl Cut)",
      codec: "FLAC Audiophile",
      channels: "2.0 Stereo",
      recordingStudio: "Capitol Studios Studio B",
      tapeMachine: "Ampex ATR-102 1/2-inch Master",
      microphones: "RCA 44-BX Ribbon Microphone",
      masterEngineer: "Kevin Gray (Cohearent Audio)",
      linerNotes: "Ripped from pristine virgin vinyl test pressing on a Clearaudio Master Reference turntable with Koetsu Rosewood Signature cartridge.",
    },
  },
  {
    id: 5,
    title: "Kind of Blue (Master Cut Take 2)",
    artist: "Miles Davis Quintet",
    album: "Columbia Master Archives",
    duration: "09:22",
    durationSeconds: 562,
    dateAdded: "Jul 28, 2026",
    format: "FLAC",
    rate: "192kHz / 24-bit",
    genre: "Audiophile FLAC",
    releaseYear: "2026",
    coverAccent: "#0284C7",
    coverSecondary: "#F3F7FA",
    vibe: "Modal Jazz Icon",
    theme: {
      name: "Crisp Sky & Cobalt Note",
      accent: "#0284C7",
      accentHover: "#0369A1",
      accentGlow: "rgba(2, 132, 199, 0.25)",
      accentSubtle: "rgba(2, 132, 199, 0.08)",
      ambientTop: "rgba(56, 189, 248, 0.16)",
      ambientBottom: "rgba(224, 242, 254, 0.40)",
      canvas: "#F3F7FA",
      surfaceGlass: "rgba(255, 255, 255, 0.90)",
      cardBg: "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 249, 255, 0.88) 100%)",
      vinylLabel: "radial-gradient(circle, #38BDF8 0%, #0284C7 60%, #075985 100%)",
      vinylBorder: "#FFFFFF",
      highlightText: "#0369A1",
      textHigh: "#08141E",
      textMedium: "#3E4E5E",
      textMuted: "#6C8092",
    },
    lyrics: [
      { time: 0, text: "♪ [Bill Evans subtle piano chords & Paul Chambers bass motif] ♪" },
      { time: 35, text: "♪ [Miles Davis harmon-muted trumpet enters - iconic modal opening] ♪" },
      { time: 90, text: "♪ [The acoustic air and room echo of 30th Street Studio] ♪" },
      { time: 150, text: "♪ [John Coltrane tenor sax solo - fiery modal sheets of sound] ♪" },
      { time: 240, text: "♪ [Cannonball Adderley alto sax solo - soulful blues inflection] ♪" },
      { time: 360, text: "♪ [Bill Evans delicate, impressionistic piano chords] ♪" },
      { time: 450, text: "♪ [Miles re-enters for the whispered final modal cadence] ♪" },
    ],
    telemetry: {
      sampleRate: "192,000 Hz",
      bitDepth: "24-bit Master Cut",
      dynamicRange: "DR15 (Uncompressed Master)",
      codec: "FLAC Lossless Studio Vault",
      channels: "2.0 Stereo 3-Track Master Reduction",
      recordingStudio: "Columbia 30th Street Studio ('The Church')",
      tapeMachine: "Ampex 300 3-Track Recorder @ 30 ips",
      microphones: "Telefunken U47 & Neumann M49",
      masterEngineer: "Mark Wilder (Sony Battery Studios)",
      linerNotes: "Transferred directly from the original 1959 3-track session master tapes with corrected pitch playback on customized tube preamplifiers.",
    },
  },
  {
    id: 6,
    title: "Subterranean Harmonic Resonance",
    artist: "Nils Frahm",
    album: "Solo Piano in Solitude",
    duration: "06:14",
    durationSeconds: 374,
    dateAdded: "Jun 12, 2026",
    format: "FLAC",
    rate: "96kHz / 24-bit",
    genre: "Acoustic Masters",
    releaseYear: "2025",
    coverAccent: "#059669",
    coverSecondary: "#F3F9F6",
    vibe: "Intimate Piano Felt",
    theme: {
      name: "Sage Mist & Nordic Pine",
      accent: "#059669",
      accentHover: "#047857",
      accentGlow: "rgba(5, 150, 105, 0.25)",
      accentSubtle: "rgba(5, 150, 105, 0.08)",
      ambientTop: "rgba(16, 185, 129, 0.16)",
      ambientBottom: "rgba(209, 250, 229, 0.40)",
      canvas: "#F3F9F6",
      surfaceGlass: "rgba(255, 255, 255, 0.90)",
      cardBg: "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(236, 253, 245, 0.88) 100%)",
      vinylLabel: "radial-gradient(circle, #10B981 0%, #059669 60%, #064E3B 100%)",
      vinylBorder: "#FFFFFF",
      highlightText: "#047857",
      textHigh: "#081A12",
      textMedium: "#3D5449",
      textMuted: "#6C867B",
    },
    lyrics: [
      { time: 0, text: "♪ [Upright felt piano hammer thumps & foot pedal creaks] ♪" },
      { time: 30, text: "♪ [Gentle repeating arpeggios reverberating through Saal 3] ♪" },
      { time: 75, text: "♪ [Analog delay feedback loops warming the lower registers] ♪" },
      { time: 140, text: "♪ [Harmonics vibrating from un-damped piano strings] ♪" },
      { time: 210, text: "♪ [Subtle analog tape wow-and-flutter warmth] ♪" },
      { time: 290, text: "♪ [Sustained final chord decaying over 40 seconds into studio breath] ♪" },
    ],
    telemetry: {
      sampleRate: "96,000 Hz",
      bitDepth: "24-bit Studio Master",
      dynamicRange: "DR15 (Pure Dynamic Intimacy)",
      codec: "FLAC Studio Lossless",
      channels: "2.0 Stereo",
      recordingStudio: "Funkhaus Berlin Saal 3",
      tapeMachine: "Nagras Stereo Reel-to-Reel",
      microphones: "Custom Baffled AKG C12 & Neumann KM54",
      masterEngineer: "Nils Frahm (Durton Studio)",
      linerNotes: "Close-mic'd felt piano with internal microphones placed directly between dampers. Every breath, hammer release, and mechanical creak is audible.",
    },
  },
];

