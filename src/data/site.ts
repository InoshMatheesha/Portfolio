// site.ts - Identity, contact channels and navigation, taken from Portfolio Content.txt.

export const person = {
  name: 'Inosh Matheesha',
  firstName: 'Inosh',
  lastName: 'Matheesha',
  handle: '_MoOdY_',
  title: 'Cyber Security Undergraduate @ SLIIT',
  tagline: 'Offensive Security & Research',
  role: 'Junior SOC Analyst',
  employer: 'Cryptogen',
  university: 'Sri Lanka Institute of Information Technology (SLIIT)',
  universityShort: 'SLIIT',
  degree: 'BSc (Hons) in Information Technology, specialising in Cyber Security',
  duration: '2023 - Present',
  gpa: '3.4 / 4.0',
  location: 'Sri Lanka',
  timeZone: 'Asia/Colombo',
  availability: 'Open for internships - immediate placement',
  status: 'Available for internships',
} as const;

export const targetRoles = ['SOC Analyst', 'Penetration Tester', 'GRC Analyst', 'Security Analyst'] as const;

export const expertise = [
  'BadUSB Payloads',
  'ESP32 WiFi Pentesting',
  'Email Security',
  'Browser Extensions',
  'OWASP Web Security',
] as const;

export const about = [
  "I'm a Cyber Security undergraduate at Sri Lanka Institute of Information Technology (SLIIT) with a passion for offensive security, threat analysis, and building ethical security tools.",
  "I don't just study security concepts - I actively build custom hardware payloads (Arduino ProMicro BadUSB), WiFi security frameworks (ESP32 ZeNeOn), browser security extensions (ShadowByte SafePaste), and CTF challenge environments.",
  "My work combines creative problem solving with technical rigor: identifying vulnerabilities, documenting attack paths on Medium, and helping developers understand security from an attacker's perspective.",
] as const;

export const contact = {
  email: 'inoshmatheesha@gmail.com',
  phone: '+94 77 643 9435',
  phoneHref: 'tel:+94776439435',
  github: { label: 'github.com/InoshMatheesha', href: 'https://github.com/InoshMatheesha' },
  linkedin: {
    label: 'linkedin.com/in/inosh-matheesha',
    href: 'https://www.linkedin.com/in/inosh-matheesha-9682b429b/',
  },
  medium: { label: 'medium.com/@inoshmatheesha', href: 'https://medium.com/@inoshmatheesha' },
  blurb:
    'Interested in cybersecurity collaboration, research discussions, or internship opportunities? Reach out directly through any of the channels below.',
} as const;

// GitHub numbers as listed in the content file.
export const github = [
  { label: 'Repositories', value: 13 },
  { label: 'Followers', value: 55 },
  { label: 'Stars earned', value: 6 },
  { label: 'Following', value: 34 },
] as const;

export const nav = [
  { label: 'Profile', href: '#profile' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' },
] as const;

export const ethics =
  'All pentesting tools, hardware payloads, and proof-of-concept exploits are developed exclusively for research, education, and authorized security assessments.';

export const labNote = 'All offensive tools and techniques used strictly in authorized lab & CTF environments.';
