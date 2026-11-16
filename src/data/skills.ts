// skills.ts - Skill groups and self-assessed proficiency from the content file.

export const skillGroups = [
  {
    title: 'Offensive Security',
    items: [
      'Web Application Pentesting (OWASP Top 10)',
      'Arduino BadUSB Payload Engineering',
      'ESP32 WiFi Deauth & Evil Twin Lab Tests',
      'Privilege Escalation & Command Injection',
      'CTF Challenge Authoring & Exploitation',
    ],
  },
  {
    title: 'Security Tooling',
    items: [
      'Burp Suite / OWASP ZAP',
      'Nmap / Masscan Surface Recon',
      'Wireshark Network Traffic Analysis',
      'Metasploit Framework (Authorized Labs)',
      'Custom Wordlist & Recon Generation',
    ],
  },
  {
    title: 'Development & Scripting',
    items: [
      'Python (Automation, Exploits, WordlistGen)',
      'JavaScript (Browser Extensions, Web Security)',
      'PHP & MySQL (Web Backend Security)',
      'C / C++ (Arduino Payloads, Microcontrollers)',
      'Kotlin (Android Application Development)',
    ],
  },
  {
    title: 'Fundamentals & OS',
    items: [
      'Linux / Windows Internals & Administration',
      'TCP/IP Networking & Packet Analysis',
      'Git Version Control & Documentation',
      'Email Security & Spoofing Defense',
      'Ethical Hacking Methodologies',
    ],
  },
] as const;

export const proficiency = [
  { skill: 'JavaScript / Web Security', value: 85 },
  { skill: 'Pentesting & OWASP', value: 80 },
  { skill: 'C / C++ / Microcontrollers', value: 80 },
  { skill: 'Linux Administration', value: 80 },
  { skill: 'Networking & Wireshark', value: 75 },
  { skill: 'Python Scripting', value: 70 },
] as const;
