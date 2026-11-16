// projects.ts - Project catalogue, ordered security work first.
import type { ImageMetadata } from 'astro';
import threatorbit from '../../assets/threatorbit.png';
import secureshop from '../../assets/SecureShopCTF.png';
import zeneon from '../../assets/ZeNeOn ESP32.png';
import promicro from '../../assets/promicro-payloads.png';
import mynox from '../../assets/mynox.png';
import melodix from '../../assets/melodix.png';
import moodex from '../../assets/moodex-gaming-hub.png';
import freebie from '../../assets/freebie-games.png';
import exam from '../../assets/exam-scheduler.png';

export type Category = 'offensive' | 'defensive' | 'software';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  name: string;
  subtitle?: string;
  type: string;
  category: Category;
  tech: string[];
  description: string;
  image: ImageMetadata;
  links: ProjectLink[];
}

export const categories: { id: Category; label: string }[] = [
  { id: 'offensive', label: 'Offensive' },
  { id: 'defensive', label: 'Defensive' },
  { id: 'software', label: 'Software' },
];

export const projects: Project[] = [
  {
    id: 'threatorbit',
    name: 'ThreatOrbit',
    subtitle: 'IOC Triage',
    type: 'Threat Intel Web App',
    category: 'defensive',
    tech: ['TypeScript', 'React', 'Node.js', 'MongoDB'],
    description:
      'Bulk indicator enrichment for SOC teams. Paste hundreds of IPs, hashes, domains and URLs and get a risk verdict from VirusTotal, AbuseIPDB, AlienVault OTX and URLhaus, with the evidence behind every call.',
    image: threatorbit,
    links: [
      { label: 'Live app', href: 'https://threatorbit.vercel.app' },
      { label: 'Repository', href: 'https://github.com/InoshMatheesha/ThreatOrbit' },
    ],
  },
  {
    id: 'secureshopctf',
    name: 'SecureShopCTF',
    type: 'CTF Lab',
    category: 'offensive',
    tech: ['Python', 'OWASP', 'Web'],
    description:
      'Vulnerable e-commerce web app challenge focusing on authentication & command injection.',
    image: secureshop,
    links: [
      { label: 'Live lab', href: 'https://moody.gt.tc/' },
      { label: 'Repository', href: 'https://github.com/InoshMatheesha/SecureShopCTF' },
      {
        label: 'Guide',
        href: 'https://medium.com/@inoshmatheesha/secureshop-ctf-room-complete-walkthrough-guide-8827bc27e57d',
      },
    ],
  },
  {
    id: 'zeneon',
    name: 'ZeNeOn ESP32 Framework',
    type: 'WiFi Pentesting Tool',
    category: 'offensive',
    tech: ['ESP32', 'Pentesting', 'C++'],
    description:
      'ESP32 wireless assessment framework with deauth, Evil Twin AP, and injection features.',
    image: zeneon,
    links: [
      { label: 'Repository', href: 'https://github.com/InoshMatheesha/ZeNeOn-ESP32-WiFi-Framework' },
    ],
  },
  {
    id: 'promicro',
    name: 'ProMicro Payloads',
    type: 'Hardware / BadUSB',
    category: 'offensive',
    tech: ['Arduino', 'C++', 'BadUSB'],
    description:
      'Arduino ATmega32U4 USB HID payloads for keystroke injection & security research.',
    image: promicro,
    links: [{ label: 'Repository', href: 'https://github.com/InoshMatheesha/ProMicro-Payloads' }],
  },
  {
    id: 'mynox',
    name: 'MyNoX Download Manager',
    type: 'Desktop App',
    category: 'software',
    tech: ['Rust', 'egui', 'Windows', 'Inno Setup'],
    description:
      'A fast, free download manager for Windows: up to 32 connections per file, resume anything, browser integration with a one-click extension, videos and torrents, and signed self-updates. Its own MyNoX Choice design in light and dark.',
    image: mynox,
    links: [
      { label: 'Website', href: 'https://mynox-download-manager.vercel.app' },
      { label: 'Repository', href: 'https://github.com/InoshMatheesha/MyNoX-Download-Manager' },
    ],
  },
  {
    id: 'melodix',
    name: 'Melodix',
    subtitle: 'Your Music. Your World.',
    type: 'Desktop App',
    category: 'software',
    tech: ['Electron', 'JavaScript', 'Node.js', 'Web Audio'],
    description:
      'An open-source, ad-free desktop music player for YouTube Music, YouTube, SoundCloud and local files. Synced lyrics with a full-screen karaoke mode. A home page that fills itself from your listening. Built on the open-source Riff player. Windows, Linux and macOS (v1.1.14).',
    image: melodix,
    links: [
      { label: 'Web app', href: 'https://melodix-your-music-app.vercel.app' },
      { label: 'Repository', href: 'https://github.com/InoshMatheesha/MeloDiX-YourMusic.YourWorld' },
    ],
  },
  {
    id: 'moodex',
    name: 'MooDeX',
    subtitle: 'PC Gaming Hub',
    type: 'Desktop App',
    category: 'software',
    tech: ['C#', 'WPF', 'Desktop', 'Vercel Web'],
    description:
      'Organize, track, discover and launch every PC game you own from one dark-themed WPF desktop app.',
    image: moodex,
    links: [
      { label: 'Website', href: 'https://getmoodex.vercel.app/' },
      { label: 'Repository', href: 'https://github.com/InoshMatheesha/MooDeX' },
    ],
  },
  {
    id: 'freebie',
    name: 'FreebieGamesFinder',
    type: 'Browser Extension',
    category: 'software',
    tech: ['JavaScript', 'Chrome API'],
    description:
      'Chrome extension indexing 500+ free games with instant filtering & FreeToGame API caching.',
    image: freebie,
    links: [
      { label: 'Repository', href: 'https://github.com/InoshMatheesha/FreebieGamesFinder-Extension' },
    ],
  },
  {
    id: 'exam',
    name: 'Exam Scheduler App',
    type: 'Mobile App',
    category: 'software',
    tech: ['Kotlin', 'Android', 'Room DB'],
    description:
      'Android task organizer for university students built with Jetpack Compose & Room DB.',
    image: exam,
    links: [{ label: 'Repository', href: 'https://github.com/InoshMatheesha/Exam-Scheduler' }],
  },
];
