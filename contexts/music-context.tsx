"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork: string;
  colorTheme: "sage" | "warm" | "cool" | "prismatic";
  audioUrl: string;
  genre: string;
}

export interface RadioStation {
  id: string;
  name: string;
  country: string;
  region: "UK" | "Europe" | "Asia" | "Americas";
  genre: string;
  streamUrl: string;
  logo: string;
  isLive: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
  artwork?: string;
  createdAt: number;
}

export interface Room {
  id: string;
  name: string;
  host: string;
  listeners: { id: string; name: string; avatar: string; isActive: boolean }[];
  currentTrack: Track | null;
  isPublic: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  isPremium: boolean;
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  tracks: Track[];
  rooms: Room[];
  userProfile: UserProfile;
  searchQuery: string;
  searchResults: Track[];
  likedSongIds: string[];
  playlists: Playlist[];
  radioStations: RadioStation[];
  currentRadio: RadioStation | null;
  isRadioMode: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  showExpanded: boolean;
  setShowExpanded: (show: boolean) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setSearchQuery: (query: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (playlistId: string, trackId: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  renamePlaylist: (playlistId: string, newName: string) => void;
  playRadio: (station: RadioStation) => void;
  stopRadio: () => void;
}

// Extended track list with Pinterest aesthetic covers and working audio
const tracks: Track[] = [
  {
    id: "1",
    title: "Chill Abstract",
    artist: "Coma-Media",
    album: "Ambient Collection",
    duration: 118,
    artwork: "https://i.pinimg.com/control1/1200x/90/af/98/90af98563cbf3d9ea40e30e591aa8664.jpg",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    genre: "Ambient",
  },
  {
    id: "2",
    title: "Lofi Study",
    artist: "FASSounds",
    album: "Focus Beats",
    duration: 147,
    artwork: "https://i.pinimg.com/1200x/9f/38/42/9f3842383903c1039b857c7b34c85626.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
    genre: "Lo-Fi",
  },
  {
    id: "3",
    title: "Good Night",
    artist: "FASSounds",
    album: "Sleep Collection",
    duration: 146,
    artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qKHDPoMmhxKUlupGhtLUkVlvAWT2jt.png",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3eb42.mp3",
    genre: "Chill",
  },
  {
    id: "4",
    title: "Relaxing Piano",
    artist: "Lesfm",
    album: "Piano Dreams",
    duration: 163,
    artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hPvyY9cftZuKgnJgLlxFGpSMkB8RdK.png",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2024/10/25/audio_fd97551dd7.mp3",
    genre: "Classical",
  },
  {
    id: "5",
    title: "Inspiring Cinematic",
    artist: "Lexin Music",
    album: "Epic Soundtracks",
    duration: 152,
    artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Qqo7S14v6KJjbcZjBdZRCD4cKmPIUV.png",
    colorTheme: "prismatic",
    audioUrl: "/audio/The_Line_Between_Day_&_Night.mp3",
    genre: "Cinematic",
  },
  {
    id: "6",
    title: "Summer Walk",
    artist: "Olexy",
    album: "Acoustic Vibes",
    duration: 157,
    artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oyID012cD8JyYbsc18RnT6RyeStdzF.png",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/03/audio_54ca0ffa52.mp3",
    genre: "Acoustic",
  },
  {
    id: "7",
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    album: "Chill Sessions",
    duration: 169,
    artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iyQppRs82uLguH7tb7HlUmHELei51m.png",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3",
    genre: "Acoustic",
  },
  {
    id: "8",
    title: "Tokyo Cafe",
    artist: "TVARI",
    album: "Urban Beats",
    duration: 122,
    artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ViX17PSLreX10BxIAJH384gu0WILZV.png",
    colorTheme: "prismatic",
    audioUrl: "https://cdn.pixabay.com/audio/2023/05/16/audio_167a49e4ad.mp3",
    genre: "Lo-Fi",
  },
  {
    id: "9",
    title: "Perfect Beauty",
    artist: "Lesfm",
    album: "Ambient Dreams",
    duration: 179,
    artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CNPP0TfbUkUpNhSdxjk8fG5W94t4SZ.png",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
    genre: "Ambient",
  },
  {
    id: "10",
    title: "Spirit Blossom",
    artist: "RomanBelov",
    album: "Asian Dreams",
    duration: 156,
    artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PxJk1ugLt9VivkXr3QlxNOpjyQZUCM.png",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3",
    genre: "Asian",
  },
  {
    id: "11",
    title: "Jazzy Abstract Beat",
    artist: "Coma-Media",
    album: "Jazz Collection",
    duration: 122,
    artwork: "https://i.pinimg.com/control1/736x/7b/2e/02/7b2e022e32416aaacc8ca0d06c7b870f.jpg",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_4f56e1ac1c.mp3",
    genre: "Jazz",
  },
  {
    id: "12",
    title: "Tropical Summer",
    artist: "Lesfm",
    album: "Beach Vibes",
    duration: 133,
    artwork: "https://i.pinimg.com/736x/2d/4d/3d/2d4d3da66a81bf56c9d574e82e306353.jpg",
    colorTheme: "prismatic",
    audioUrl: "https://cdn.pixabay.com/audio/2023/11/24/audio_8b1576fca7.mp3",
    genre: "Electronic",
  },
  {
    id: "13",
    title: "Meditation",
    artist: "SergePavkinMusic",
    album: "Zen Collection",
    duration: 195,
    artwork: "https://i.pinimg.com/control1/1200x/30/ed/0a/30ed0aba039de3934ce0b8151047c4bf.jpg",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3",
    genre: "Meditation",
  },
  {
    id: "14",
    title: "Electronic Future",
    artist: "Prazkhanal",
    album: "Synthwave",
    duration: 142,
    artwork: "https://i.pinimg.com/736x/17/6a/b6/176ab658957d173ad219580fcace851f.jpg",
    colorTheme: "prismatic",
    audioUrl: "https://cdn.pixabay.com/audio/2022/04/27/audio_67bcca9b86.mp3",
    genre: "Electronic",
  },
  {
    id: "15",
    title: "Happy Rock",
    artist: "AShamaluevMusic",
    album: "Rock Essentials",
    duration: 105,
    artwork: "https://i.pinimg.com/736x/b6/7b/20/b67b20d34be9c6aa08403e6ec9f66cbc.jpg",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/30/audio_fb4db8c5be.mp3",
    genre: "Rock",
  },
  {
    id: "16",
    title: "Documentary",
    artist: "Lexin Music",
    album: "Film Scores",
    duration: 178,
    artwork: "https://i.pinimg.com/control1/736x/0e/6d/be/0e6dbe33fc21177e04660bdfa0c98280.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_ea75fd4fe5.mp3",
    genre: "Cinematic",
  },
  {
    id: "17",
    title: "Gentle Piano",
    artist: "Daddy_s_Music",
    album: "Piano Moods",
    duration: 189,
    artwork: "https://i.pinimg.com/736x/d1/13/55/d11355438c0174a635b1c6dd9e0cddd6.jpg",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2022/09/07/audio_2b1e98c3bd.mp3",
    genre: "Classical",
  },
  {
    id: "18",
    title: "Upbeat Funk",
    artist: "FASSounds",
    album: "Groovy Tunes",
    duration: 128,
    artwork: "https://i.pinimg.com/control1/736x/de/ca/bb/decabb5e2dd52269747cc127791e80d6.jpg",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/15/audio_942e022fd5.mp3",
    genre: "Funk",
  },
  {
    id: "19",
    title: "Dreamy Ambient",
    artist: "SoundGalleryByDmitryTaras",
    album: "Dreamscapes",
    duration: 212,
    artwork: "https://i.pinimg.com/1200x/f0/ed/ed/f0eded71002ca35dedd66c13df795f15.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/20/audio_2940dd655a.mp3",
    genre: "Ambient",
  },
  {
    id: "20",
    title: "Cyberpunk",
    artist: "AlexiAction",
    album: "Neon Nights",
    duration: 156,
    artwork: "https://i.pinimg.com/control1/736x/c7/74/09/c77409994ac290ba7e638c6e2aa3fe00.jpg",
    colorTheme: "prismatic",
    audioUrl: "https://cdn.pixabay.com/audio/2022/07/04/audio_2e39c1d9ae.mp3",
    genre: "Electronic",
  },
  {
    id: "21",
    title: "Soft Hip Hop",
    artist: "TVARI",
    album: "Chill Beats",
    duration: 134,
    artwork: "https://i.pinimg.com/1200x/cc/6c/5c/cc6c5cc3aa1e6aefdea3153d7674a640.jpg",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2023/03/19/audio_a9a31c94dc.mp3",
    genre: "Hip Hop",
  },
  {
    id: "22",
    title: "Morning Coffee",
    artist: "FASSounds",
    album: "Morning Rituals",
    duration: 165,
    artwork: "https://i.pinimg.com/control1/736x/86/a4/8a/86a48aa8ee76fd9157f84ea752f7af16.jpg",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/17/audio_69a61cd6d6.mp3",
    genre: "Acoustic",
  },
  {
    id: "23",
    title: "Night Drive",
    artist: "penguinmusic",
    album: "Synthwave Vol. 2",
    duration: 148,
    artwork: "https://i.pinimg.com/736x/e6/c6/4a/e6c64a9319672dc81853f2ac07577649.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",
    genre: "Synthwave",
  },
  {
    id: "24",
    title: "Peaceful Garden",
    artist: "Lesfm",
    album: "Nature Sounds",
    duration: 201,
    artwork: "https://i.pinimg.com/control1/1200x/86/2c/b9/862cb9d9ddd58e8e0e939ad496651589.jpg",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2022/09/25/audio_46b3d92eac.mp3",
    genre: "Ambient",
  },
  // New Popular/Hit-style tracks with aesthetic covers
  {
    id: "25",
    title: "Midnight City",
    artist: "Watr",
    album: "Urban Dreams",
    duration: 186,
    artwork: "https://i.pinimg.com/control1/1200x/4e/7a/57/4e7a57d6f8ca667b6aa13f5eca9bfdbe.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    genre: "Electronic",
  },
  {
    id: "26",
    title: "Golden Hour",
    artist: "Vlad Gluschenko",
    album: "Sunset Sessions",
    duration: 154,
    artwork: "https://i.pinimg.com/control1/736x/4f/e5/56/4fe556d4dfcfac61cbb3b4830067c1bf.jpg",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
    genre: "Pop",
  },
  {
    id: "27",
    title: "Neon Dreams",
    artist: "AlexiAction",
    album: "Future Sounds",
    duration: 167,
    artwork: "https://i.pinimg.com/control1/736x/c7/74/09/c77409994ac290ba7e638c6e2aa3fe00.jpg",
    colorTheme: "prismatic",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3eb42.mp3",
    genre: "Synthwave",
  },
  {
    id: "28",
    title: "Ocean Waves",
    artist: "Olexy",
    album: "Coastal Melodies",
    duration: 195,
    artwork: "https://i.pinimg.com/control1/1200x/6a/df/86/6adf866763754a46dce6f85aa7edc108.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2024/10/25/audio_fd97551dd7.mp3",
    genre: "Chill",
  },
  {
    id: "29",
    title: "Starlight",
    artist: "SergePavkinMusic",
    album: "Cosmic Journey",
    duration: 203,
    artwork: "https://i.pinimg.com/736x/fb/f3/03/fbf303c7b2f87bca137b13a3eaa19db1.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/15/audio_8a8452a246.mp3",
    genre: "Ambient",
  },
  {
    id: "30",
    title: "City Lights",
    artist: "penguinmusic",
    album: "Metropolitan",
    duration: 142,
    artwork: "https://i.pinimg.com/control1/1200x/ef/10/a9/ef10a98d61e8adedfa27adcb18f9a455.jpg",
    colorTheme: "prismatic",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/03/audio_54ca0ffa52.mp3",
    genre: "Electronic",
  },
  {
    id: "31",
    title: "Rainy Day",
    artist: "FASSounds",
    album: "Melancholy Moods",
    duration: 178,
    artwork: "https://i.pinimg.com/736x/97/05/ce/9705ce7a6b0c01b16e9c4b436dc920b9.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3",
    genre: "Lo-Fi",
  },
  {
    id: "32",
    title: "Electric Love",
    artist: "Watr",
    album: "Heart Beats",
    duration: 163,
    artwork: "https://i.pinimg.com/control1/1200x/f4/82/c6/f482c699457962920158475b9c9f0eed.jpg",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2023/05/16/audio_167a49e4ad.mp3",
    genre: "Pop",
  },
  {
    id: "33",
    title: "Sunset Drive",
    artist: "TVARI",
    album: "California Dreams",
    duration: 189,
    artwork: "https://i.pinimg.com/736x/32/b4/c8/32b4c8290a5a156a119d3b27d24412e2.jpg",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
    genre: "Chill",
  },
  {
    id: "34",
    title: "Moonlight Sonata",
    artist: "Daddy_s_Music",
    album: "Classical Nights",
    duration: 224,
    artwork: "https://i.pinimg.com/736x/8f/d3/e4/8fd3e4f2754b16374ed88d57b5fb13ef.jpg",
    colorTheme: "cool",
    audioUrl: "https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3",
    genre: "Classical",
  },
  {
    id: "35",
    title: "Velvet Night",
    artist: "Lesfm",
    album: "Midnight Jazz",
    duration: 176,
    artwork: "https://i.pinimg.com/736x/74/18/7b/74187bf728915ce0ff015d197ac31dc9.jpg",
    colorTheme: "warm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_4f56e1ac1c.mp3",
    genre: "Jazz",
  },
  {
    id: "36",
    title: "Crystal Clear",
    artist: "SoundGalleryByDmitryTaras",
    album: "Pure Tones",
    duration: 198,
    artwork: "https://i.pinimg.com/736x/3a/3d/fa/3a3dfa782045c34f2ac7cd89667ad22d.jpg",
    colorTheme: "sage",
    audioUrl: "https://cdn.pixabay.com/audio/2023/11/24/audio_8b1576fca7.mp3",
    genre: "Ambient",
  },
  {
    id: "37",
    title: "Don't Know What To Do (slowed + reverbed)",
    artist: "Blackpink",
    album: "Nostalgia",
    duration: 167,
    artwork: "https://i.pinimg.com/736x/e7/49/14/e74914cdaa63b66128a456bff24b7869.jpg",
    colorTheme: "warm",
    audioUrl: "/audio/blackpink_dont_know.mp3",
    genre: "Pop",
  },
];

// Working radio stations with reliable streams
const radioStations: RadioStation[] = [
  // UK Stations - Real UK FM Radio
  {
    id: "uk-absolute-radio",
    name: "Absolute Radio",
    country: "United Kingdom",
    region: "UK",
    genre: "Rock / Pop Hits",
    streamUrl: "https://ais-sa3.cdnstream1.com/2567_128.mp3",
    logo: "/radio/uk-radio.png",
    isLive: true,
  },
  {
    id: "uk-capital-fm",
    name: "Capital FM",
    country: "United Kingdom",
    region: "UK",
    genre: "Pop / Chart Hits",
    streamUrl: "https://media-ice.musicradio.com/CapitalMP3",
    logo: "/radio/uk-radio.png",
    isLive: true,
  },
  {
    id: "uk-heart-fm",
    name: "Heart FM",
    country: "United Kingdom",
    region: "UK",
    genre: "Pop / Love Songs",
    streamUrl: "https://media-ice.musicradio.com/HeartLondonMP3",
    logo: "/radio/uk-radio.png",
    isLive: true,
  },
  {
    id: "uk-kiss-fm",
    name: "Kiss FM UK",
    country: "United Kingdom",
    region: "UK",
    genre: "Dance / Urban",
    streamUrl: "https://media-ice.musicradio.com/KissMP3",
    logo: "/radio/uk-radio.png",
    isLive: true,
  },
  {
    id: "uk-smooth-radio",
    name: "Smooth Radio",
    country: "United Kingdom",
    region: "UK",
    genre: "Easy Listening / Soul",
    streamUrl: "https://media-ice.musicradio.com/SmoothNorthWestMP3",
    logo: "/radio/uk-radio.png",
    isLive: true,
  },
  {
    id: "uk-classic-fm",
    name: "Classic FM",
    country: "United Kingdom",
    region: "UK",
    genre: "Classical Music",
    streamUrl: "https://media-ice.musicradio.com/ClassicFMMP3",
    logo: "/radio/uk-radio.png",
    isLive: true,
  },
  // Europe Stations
  {
    id: "eu-nrj-france",
    name: "NRJ France",
    country: "France",
    region: "Europe",
    genre: "Pop / Dance",
    streamUrl: "https://scdn.nrjaudio.fm/fr/30001/mp3_128.mp3",
    logo: "/radio/europe-radio.png",
    isLive: true,
  },
  {
    id: "eu-radio-538",
    name: "Radio 538",
    country: "Netherlands",
    region: "Europe",
    genre: "Pop / Dance",
    streamUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538.mp3",
    logo: "/radio/europe-radio.png",
    isLive: true,
  },
  {
    id: "eu-antenne-bayern",
    name: "Antenne Bayern",
    country: "Germany",
    region: "Europe",
    genre: "Pop / Hits",
    streamUrl: "https://stream.antenne.de/antenne",
    logo: "/radio/europe-radio.png",
    isLive: true,
  },
  {
    id: "soma-fm-drone",
    name: "SomaFM Drone Zone",
    country: "Internet",
    region: "Europe",
    genre: "Ambient / Atmospheric",
    streamUrl: "https://ice1.somafm.com/dronezone-128-mp3",
    logo: "/radio/europe-radio.png",
    isLive: true,
  },
  // Asia Stations - Malaysian FM
  {
    id: "asia-hitz-fm",
    name: "Hitz FM Malaysia",
    country: "Malaysia",
    region: "Asia",
    genre: "Pop / Top 40",
    streamUrl: "https://22253.live.streamtheworld.com/HITZFM.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  {
    id: "asia-fly-fm",
    name: "Fly FM Malaysia",
    country: "Malaysia",
    region: "Asia",
    genre: "Pop / Contemporary",
    streamUrl: "https://22253.live.streamtheworld.com/FLYFM.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  {
    id: "asia-era-fm",
    name: "Era FM Malaysia",
    country: "Malaysia",
    region: "Asia",
    genre: "Malay Pop / Hits",
    streamUrl: "https://22253.live.streamtheworld.com/ERAFM.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  {
    id: "asia-mix-fm",
    name: "Mix FM Malaysia",
    country: "Malaysia",
    region: "Asia",
    genre: "Adult Contemporary",
    streamUrl: "https://22253.live.streamtheworld.com/MIXFM.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  {
    id: "asia-988-fm",
    name: "988 FM Malaysia",
    country: "Malaysia",
    region: "Asia",
    genre: "Chinese Pop",
    streamUrl: "https://22253.live.streamtheworld.com/988FM.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  {
    id: "asia-my-fm",
    name: "MY FM Malaysia",
    country: "Malaysia",
    region: "Asia",
    genre: "Chinese Pop / Hits",
    streamUrl: "https://22253.live.streamtheworld.com/MYFM.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  // More Asia - Japan, Korea, Singapore, India
  {
    id: "asia-jwave",
    name: "J-WAVE Tokyo",
    country: "Japan",
    region: "Asia",
    genre: "J-Pop / Urban",
    streamUrl: "https://ic-stream.j-wave.co.jp/jwave.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  {
    id: "asia-class95",
    name: "Class 95 Singapore",
    country: "Singapore",
    region: "Asia",
    genre: "Adult Contemporary",
    streamUrl: "https://22253.live.streamtheworld.com/CLASS95.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  {
    id: "asia-987fm",
    name: "987 FM Singapore",
    country: "Singapore",
    region: "Asia",
    genre: "Pop / Chart Hits",
    streamUrl: "https://22253.live.streamtheworld.com/987FM.mp3",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  {
    id: "asia-radio-mirchi",
    name: "Radio Mirchi India",
    country: "India",
    region: "Asia",
    genre: "Bollywood / Hindi",
    streamUrl: "https://radioindia.net/radio/mirchi98/icecast.audio",
    logo: "/radio/asia-radio.png",
    isLive: true,
  },
  // Americas Stations
  {
    id: "us-iheartradio-top40",
    name: "iHeart Top 40",
    country: "United States",
    region: "Americas",
    genre: "Pop / Top 40",
    streamUrl: "https://ice1.somafm.com/poptron-128-mp3",
    logo: "/radio/americas-radio.png",
    isLive: true,
  },
  {
    id: "us-hot97",
    name: "Hot 97 Hip Hop",
    country: "United States",
    region: "Americas",
    genre: "Hip Hop / R&B",
    streamUrl: "https://ice1.somafm.com/beatblender-128-mp3",
    logo: "/radio/americas-radio.png",
    isLive: true,
  },
  {
    id: "soma-fm-groove",
    name: "SomaFM Groove Salad",
    country: "United States",
    region: "Americas",
    genre: "Ambient / Chill",
    streamUrl: "https://ice1.somafm.com/groovesalad-128-mp3",
    logo: "/radio/americas-radio.png",
    isLive: true,
  },
  {
    id: "soma-fm-defcon",
    name: "SomaFM DEF CON",
    country: "United States",
    region: "Americas",
    genre: "Electronic",
    streamUrl: "https://ice1.somafm.com/defcon-128-mp3",
    logo: "/radio/americas-radio.png",
    isLive: true,
  },
];

const rooms: Room[] = [
  {
    id: "1",
    name: "Chill Vibes",
    host: "Alex",
    listeners: [
      { id: "1", name: "Alex", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", isActive: true },
      { id: "2", name: "Sam", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isActive: true },
      { id: "3", name: "Jordan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", isActive: false },
    ],
    currentTrack: tracks[0],
    isPublic: true,
  },
  {
    id: "2",
    name: "Late Night Sessions",
    host: "Maya",
    listeners: [
      { id: "4", name: "Maya", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", isActive: true },
      { id: "5", name: "Chris", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", isActive: true },
    ],
    currentTrack: tracks[2],
    isPublic: true,
  },
  {
    id: "3",
    name: "Focus Flow",
    host: "Taylor",
    listeners: [
      { id: "6", name: "Taylor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", isActive: true },
      { id: "7", name: "Riley", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", isActive: true },
      { id: "8", name: "Casey", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", isActive: true },
      { id: "9", name: "Morgan", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", isActive: false },
    ],
    currentTrack: tracks[4],
    isPublic: false,
  },
];

const defaultProfile: UserProfile = {
  id: "1",
  name: "Aether User",
  email: "user@aether.music",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  bio: "Music enthusiast. Always discovering new sounds.",
  isPremium: true,
};

// Pre-made playlist for World Hits
const worldHitsPlaylist: Playlist = {
  id: "world-hits",
  name: "World Hits",
  trackIds: ["25", "26", "27", "30", "32", "33", "37", "39"],
  createdAt: Date.now(),
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([worldHitsPlaylist]);
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null);
  const [isRadioMode, setIsRadioMode] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load persisted data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load user profile
      const savedProfile = localStorage.getItem("aether_user_profile");
      if (savedProfile) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Failed to parse saved profile");
        }
      }

      // Load liked songs
      const savedLikes = localStorage.getItem("aether_liked_songs");
      if (savedLikes) {
        try {
          setLikedSongIds(JSON.parse(savedLikes));
        } catch (e) {
          console.error("Failed to parse saved likes");
        }
      }

      // Load playlists
      const savedPlaylists = localStorage.getItem("aether_playlists");
      if (savedPlaylists) {
        try {
          const parsed = JSON.parse(savedPlaylists);
          // Merge with default playlist if not exists
          const hasWorldHits = parsed.some((p: Playlist) => p.id === "world-hits");
          if (!hasWorldHits) {
            setPlaylists([worldHitsPlaylist, ...parsed]);
          } else {
            setPlaylists(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved playlists");
        }
      }

      // Load volume
      const savedVolume = localStorage.getItem("aether_volume");
      if (savedVolume) {
        try {
          setVolumeState(parseFloat(savedVolume));
        } catch (e) {
          console.error("Failed to parse saved volume");
        }
      }
    }
  }, []);

  // Save user profile to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aether_user_profile", JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Save liked songs to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aether_liked_songs", JSON.stringify(likedSongIds));
    }
  }, [likedSongIds]);

  // Save playlists to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aether_playlists", JSON.stringify(playlists));
    }
  }, [playlists]);

  // Save volume to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aether_volume", volume.toString());
    }
  }, [volume]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(tracks);
    } else {
      const query = searchQuery.toLowerCase();
      const results = tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query) ||
          track.album.toLowerCase().includes(query) ||
          track.genre.toLowerCase().includes(query)
      );
      setSearchResults(results);
    }
  }, [searchQuery]);

  // Audio element management
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTimeState(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (!isRadioMode) {
        nextTrack();
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleError = () => {
      console.error("Audio failed to load:");
      console.error("Source:", audio.src);
      console.error("Error:", audio.error);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [isRadioMode]);

  // Update audio volume when volume or mute state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = useCallback((track: Track) => {
    // Stop radio if playing
    setIsRadioMode(false);
    setCurrentRadio(null);
    
    setCurrentTrack(track);
    setCurrentTimeState(0);
    
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch((e) => {
        console.error("Playback failed:", e);
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => {
          console.error("Playback failed:", e);
        });
      }
    }
  }, [isPlaying]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current && !isRadioMode) {
      audioRef.current.currentTime = time;
      setCurrentTimeState(time);
    }
  }, [isRadioMode]);

  const setCurrentTime = useCallback((time: number) => {
    setCurrentTimeState(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clampedVolume;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentTrack || isRadioMode) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  }, [currentTrack, playTrack, isRadioMode]);

  const previousTrack = useCallback(() => {
    if (!currentTrack || isRadioMode) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  }, [currentTrack, playTrack, isRadioMode]);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  }, []);

  const toggleLike = useCallback((trackId: string) => {
    setLikedSongIds((prev) => {
      if (prev.includes(trackId)) {
        return prev.filter((id) => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  }, []);

  const isLiked = useCallback((trackId: string) => {
    return likedSongIds.includes(trackId);
  }, [likedSongIds]);

  const createPlaylist = useCallback((name: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      trackIds: [],
      createdAt: Date.now(),
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  }, []);

  const addToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId && !p.trackIds.includes(trackId)) {
          return { ...p, trackIds: [...p.trackIds, trackId] };
        }
        return p;
      })
    );
  }, []);

  const removeFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) };
        }
        return p;
      })
    );
  }, []);

  const renamePlaylist = useCallback((playlistId: string, newName: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, name: newName };
        }
        return p;
      })
    );
  }, []);

  const playRadio = useCallback((station: RadioStation) => {
    // Stop current track
    setCurrentTrack(null);
    setIsRadioMode(true);
    setCurrentRadio(station);
    setCurrentTimeState(0);
    
    if (audioRef.current) {
      audioRef.current.src = station.streamUrl;
      audioRef.current.load();
      audioRef.current.play().catch((e) => {
        console.error("Radio playback failed:", e);
      });
    }
  }, []);

  const stopRadio = useCallback(() => {
    setIsRadioMode(false);
    setCurrentRadio(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        tracks,
        rooms,
        userProfile,
        searchQuery,
        searchResults,
        likedSongIds,
        playlists,
        radioStations,
        currentRadio,
        isRadioMode,
        playTrack,
        togglePlay,
        setCurrentTime,
        seekTo,
        setVolume,
        toggleMute,
        showExpanded,
        setShowExpanded,
        nextTrack,
        previousTrack,
        setSearchQuery,
        updateUserProfile,
        audioRef,
        toggleLike,
        isLiked,
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        renamePlaylist,
        playRadio,
        stopRadio,
      }}
    >
      {children}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
