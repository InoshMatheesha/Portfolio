// layers.ts - The five layers of the hero stack, bottom (L1) to top (L5).

export interface Layer {
  n: 1 | 2 | 3 | 4 | 5;
  title: string;
  detail: string;
  href: string;
}

export const layers: Layer[] = [
  {
    n: 5,
    title: 'Detection & intel',
    detail: 'Junior SOC analyst at Cryptogen. Built ThreatOrbit.',
    href: '#project-threatorbit',
  },
  {
    n: 4,
    title: 'Web application',
    detail: 'OWASP testing, SecureShopCTF, six writeups.',
    href: '#project-secureshopctf',
  },
  {
    n: 3,
    title: 'Network',
    detail: 'Nmap and Masscan recon, Wireshark analysis.',
    href: '#skills',
  },
  {
    n: 2,
    title: 'Wireless',
    detail: 'ZeNeOn: ESP32 deauth and Evil Twin lab tests.',
    href: '#project-zeneon',
  },
  {
    n: 1,
    title: 'Hardware',
    detail: 'Pro Micro payloads for keystroke injection.',
    href: '#project-promicro',
  },
];
