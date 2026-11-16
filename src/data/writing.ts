// writing.ts - Medium articles and walkthroughs.

export interface Article {
  title: string;
  kind: string;
  minutes: number;
  tags: string[];
  summary: string;
  href: string;
}

export const articles: Article[] = [
  {
    title: 'SecureShop CTF Room - Complete Walkthrough Guide',
    kind: 'Writeup',
    minutes: 10,
    tags: ['CTF', 'OWASP Top 10', 'Walkthrough'],
    summary:
      'In-depth step-by-step walkthrough detailing vulnerability discovery, exploitation of OWASP flaws, authentication bypass, and root flag capture.',
    href: 'https://medium.com/@inoshmatheesha/secureshop-ctf-room-complete-walkthrough-guide-8827bc27e57d',
  },
  {
    title: 'Understanding & Exploiting OS Command Injection',
    kind: 'Article',
    minutes: 7,
    tags: ['Command Injection', 'RCE', 'Web Security'],
    summary:
      'Comprehensive guide to shell injection vulnerabilities, payload crafting, blind command injection detection, and server hardening techniques.',
    href: 'https://medium.com/@inoshmatheesha/os-command-injection-056c2ee7aaa6',
  },
  {
    title: 'Deep Dive: File Upload Vulnerabilities & Bypass Tactics',
    kind: 'Article',
    minutes: 8,
    tags: ['File Upload', 'Webshell', 'RCE'],
    summary:
      'Analyzing how improper file validation enables webshell uploads and remote code execution, with practical mitigation strategies for developers.',
    href: 'https://medium.com/@inoshmatheesha/file-upload-vulnerabilities-93ca2f959938',
  },
  {
    title: 'Path Traversal Vulnerabilities: From Reading Files to Server Compromise',
    kind: 'Article',
    minutes: 6,
    tags: ['Path Traversal', 'File Read', 'Filter Bypass'],
    summary:
      'Explaining directory traversal mechanisms, encoding tricks to bypass filters, and how attackers exfiltrate sensitive configuration files.',
    href: 'https://medium.com/@inoshmatheesha/path-traversal-e8faafaca05f',
  },
  {
    title: 'XML External Entity (XXE) Injection Masterclass',
    kind: 'Article',
    minutes: 9,
    tags: ['XXE', 'XML Security', 'SSRF'],
    summary:
      'How misconfigured XML parsers allow attackers to read local files, trigger SSRF attacks, and compromise internal infrastructure.',
    href: 'https://medium.com/@inoshmatheesha/xml-external-entity-xxe-injection-f72848d2bd2c',
  },
  {
    title: 'PortSwigger Apprentice Labs: XSS Labs 1-9 Detailed Walkthrough',
    kind: 'Walkthrough',
    minutes: 12,
    tags: ['XSS', 'PortSwigger', 'Lab Walkthrough'],
    summary:
      "Step-by-step solutions and technical context for PortSwigger Web Security Academy's Reflected, Stored, and DOM-based XSS apprentice labs.",
    href: 'https://medium.com/@inoshmatheesha/cross-site-scripting-xss-portswiggers-apprentice-labs-labs-1-9-walkthrough-9ff6ae1369fe',
  },
];
