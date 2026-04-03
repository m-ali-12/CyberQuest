// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@CyberQuest2024', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cyberquest.io' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@cyberquest.io',
      password: adminPassword,
      role: 'ADMIN',
      plan: 'PRO',
      xp: 9999,
      level: 50,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Achievements
  const achievements = [
    { title: 'First Blood', description: 'Complete your first lesson', icon: '🎯', condition: 'first_lesson', xpReward: 50 },
    { title: 'Hacker Initiate', description: 'Complete 5 lessons', icon: '💻', condition: 'lessons_5', xpReward: 100 },
    { title: 'Challenge Accepted', description: 'Solve your first challenge', icon: '🔓', condition: 'first_challenge', xpReward: 75 },
    { title: 'CTF Hunter', description: 'Solve 10 challenges', icon: '🏆', condition: 'challenges_10', xpReward: 200 },
    { title: 'Speed Runner', description: 'Complete a lesson in under 5 minutes', icon: '⚡', condition: 'speed_lesson', xpReward: 60 },
    { title: 'Night Owl', description: 'Study after midnight', icon: '🦉', condition: 'night_study', xpReward: 40 },
    { title: 'Streak Master', description: 'Maintain 7-day streak', icon: '🔥', condition: 'streak_7', xpReward: 150 },
    { title: 'Certified Pro', description: 'Earn your first certification', icon: '🎓', condition: 'first_cert', xpReward: 500 },
    { title: 'XP Legend', description: 'Reach 10,000 XP', icon: '⭐', condition: 'xp_10000', xpReward: 300 },
    { title: 'Perfect Score', description: 'Get 100% on an exam', icon: '💯', condition: 'perfect_exam', xpReward: 250 },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.title.replace(/\s/g, '-').toLowerCase() },
      update: {},
      create: { id: ach.title.replace(/\s/g, '-').toLowerCase(), ...ach },
    }).catch(() => prisma.achievement.create({ data: ach }));
  }
  console.log('✅ Achievements seeded');

  // Course 1: Cybersecurity Fundamentals (FREE)
  const course1 = await prisma.course.upsert({
    where: { slug: 'cybersecurity-fundamentals' },
    update: {},
    create: {
      title: 'Cybersecurity Fundamentals',
      slug: 'cybersecurity-fundamentals',
      description: 'Start your cybersecurity journey from zero. Learn core concepts, terminology, and foundational skills every security professional needs.',
      icon: '🛡️',
      color: '#00ff88',
      difficulty: 'BEGINNER',
      isPremium: false,
      order: 1,
      totalXp: 1000,
    },
  });

  const module1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Cybersecurity',
      description: 'What is cybersecurity and why does it matter?',
      order: 1,
      xpReward: 100,
      isPremium: false,
      lessons: {
        create: [
          {
            title: 'What is Cybersecurity?',
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                { type: 'intro', text: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.' },
                { type: 'keypoint', text: 'The CIA Triad: Confidentiality, Integrity, and Availability are the three pillars of information security.' },
                { type: 'example', text: 'A bank uses encryption (Confidentiality), checksums (Integrity), and redundant servers (Availability) to protect your money.' },
                { type: 'quiz', question: 'What does the "C" in CIA Triad stand for?', options: ['Control', 'Confidentiality', 'Cryptography', 'Compliance'], answer: 1 }
              ]
            }),
            type: 'TEXT',
            order: 1,
            xpReward: 25,
            duration: 8,
            isPremium: false,
          },
          {
            title: 'Types of Cyber Threats',
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                { type: 'intro', text: 'Cyber threats come in many forms. Understanding them is the first step to defending against them.' },
                { type: 'list', title: 'Common Threat Types', items: ['Malware', 'Phishing', 'Social Engineering', 'Man-in-the-Middle', 'DDoS Attacks', 'SQL Injection', 'Zero-Day Exploits'] },
                { type: 'keypoint', text: 'Social Engineering is often the easiest attack vector — humans are the weakest link in security!' },
                { type: 'game', gameType: 'threat_match', description: 'Match the threat to its description' }
              ]
            }),
            type: 'TEXT',
            order: 2,
            xpReward: 25,
            duration: 10,
            isPremium: false,
          },
          {
            title: 'Security Mindset & Thinking Like a Hacker',
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                { type: 'intro', text: 'To defend systems effectively, you must learn to think like an attacker.' },
                { type: 'keypoint', text: 'Ethical hackers (White Hats) use the same techniques as criminals but with permission and good intent.' },
                { type: 'scenario', text: 'You find an unlocked computer in a coffee shop. What would a malicious actor do? What should you do?' },
                { type: 'quiz', question: 'What is the ethical hacker also known as?', options: ['Black Hat', 'Grey Hat', 'White Hat', 'Red Hat'], answer: 2 }
              ]
            }),
            type: 'TEXT',
            order: 3,
            xpReward: 50,
            duration: 12,
            isPremium: false,
          },
        ],
      },
    },
  });

  const module2 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Networking Basics',
      description: 'TCP/IP, DNS, HTTP — foundations every hacker must know',
      order: 2,
      xpReward: 150,
      isPremium: false,
      lessons: {
        create: [
          {
            title: 'OSI Model Deep Dive',
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                { type: 'intro', text: 'The OSI model is a 7-layer framework for how network communication works.' },
                { type: 'layers', layers: ['Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'] },
                { type: 'mnemonic', text: 'Remember: "Please Do Not Throw Sausage Pizza Away"' },
                { type: 'game', gameType: 'layer_sort', description: 'Drag and drop OSI layers in correct order' }
              ]
            }),
            type: 'TEXT',
            order: 1,
            xpReward: 30,
            duration: 15,
            isPremium: false,
          },
          {
            title: 'TCP/IP & Protocols',
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                { type: 'intro', text: 'TCP/IP is the foundational protocol suite of the internet.' },
                { type: 'keypoint', text: 'Every device on a network has an IP address. Ports allow multiple services on one IP.' },
                { type: 'list', title: 'Critical Ports to Know', items: ['22 - SSH', '80 - HTTP', '443 - HTTPS', '21 - FTP', '25 - SMTP', '3306 - MySQL', '3389 - RDP'] },
                { type: 'quiz', question: 'Which port does HTTPS run on by default?', options: ['80', '8080', '443', '8443'], answer: 2 }
              ]
            }),
            type: 'TEXT',
            order: 2,
            xpReward: 30,
            duration: 12,
            isPremium: false,
          },
        ],
      },
    },
  });

  // Course 2: Web Application Security (FREE start, then PREMIUM)
  const course2 = await prisma.course.upsert({
    where: { slug: 'web-application-security' },
    update: {},
    create: {
      title: 'Web Application Security',
      slug: 'web-application-security',
      description: 'Master OWASP Top 10, SQL Injection, XSS, CSRF and more. Hands-on labs included.',
      icon: '🌐',
      color: '#ff6b35',
      difficulty: 'INTERMEDIATE',
      isPremium: false,
      order: 2,
      totalXp: 2000,
    },
  });

  await prisma.module.create({
    data: {
      courseId: course2.id,
      title: 'OWASP Top 10',
      description: 'The most critical web application security risks',
      order: 1,
      xpReward: 200,
      isPremium: false,
      lessons: {
        create: [
          {
            title: 'SQL Injection — The Classic Attack',
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                { type: 'intro', text: 'SQL Injection occurs when user input is not properly sanitized and gets executed as SQL code.' },
                { type: 'code', language: 'sql', code: "SELECT * FROM users WHERE username='' OR '1'='1' --'" },
                { type: 'keypoint', text: 'Always use parameterized queries or prepared statements to prevent SQLi.' },
                { type: 'lab', labId: 'sqli_basic', description: 'Try SQL injection on a practice login form' }
              ]
            }),
            type: 'LAB',
            order: 1,
            xpReward: 50,
            duration: 20,
            isPremium: false,
          },
          {
            title: 'Cross-Site Scripting (XSS)',
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                { type: 'intro', text: 'XSS allows attackers to inject malicious scripts into web pages viewed by other users.' },
                { type: 'types', items: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS'] },
                { type: 'code', language: 'html', code: '<script>alert(document.cookie)</script>' },
                { type: 'quiz', question: 'Which XSS type permanently stores the payload in the database?', options: ['Reflected', 'DOM-based', 'Stored', 'Universal'], answer: 2 }
              ]
            }),
            type: 'TEXT',
            order: 2,
            xpReward: 50,
            duration: 18,
            isPremium: false,
          },
          {
            title: 'Authentication Bypass Techniques',
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                { type: 'intro', text: 'Weak authentication is one of the most exploited vulnerabilities in web applications.' },
                { type: 'list', title: 'Common Auth Bypasses', items: ['Default credentials', 'Brute force attacks', 'JWT manipulation', 'Session fixation', 'Insecure password reset'] },
                { type: 'lab', labId: 'auth_bypass', description: 'Bypass login on a practice app using 3 different methods' }
              ]
            }),
            type: 'LAB',
            order: 3,
            xpReward: 75,
            duration: 25,
            isPremium: true,
          },
        ],
      },
    },
  });

  // Course 3: Ethical Hacking (PREMIUM)
  const course3 = await prisma.course.upsert({
    where: { slug: 'ethical-hacking' },
    update: {},
    create: {
      title: 'Ethical Hacking & Penetration Testing',
      slug: 'ethical-hacking',
      description: 'Full penetration testing methodology. Recon, exploitation, post-exploitation. Real-world techniques.',
      icon: '⚔️',
      color: '#ff0055',
      difficulty: 'ADVANCED',
      isPremium: true,
      order: 3,
      totalXp: 3500,
    },
  });

  // Course 4: Digital Forensics (PREMIUM)
  await prisma.course.upsert({
    where: { slug: 'digital-forensics' },
    update: {},
    create: {
      title: 'Digital Forensics & Incident Response',
      slug: 'digital-forensics',
      description: 'Investigate cyber crimes, analyze evidence, and respond to security incidents professionally.',
      icon: '🔍',
      color: '#7c3aed',
      difficulty: 'ADVANCED',
      isPremium: true,
      order: 4,
      totalXp: 3000,
    },
  });

  // Course 5: Cryptography (FREE start)
  await prisma.course.upsert({
    where: { slug: 'cryptography' },
    update: {},
    create: {
      title: 'Cryptography & Encryption',
      slug: 'cryptography',
      description: 'From Caesar cipher to AES-256. Understand how encryption protects the digital world.',
      icon: '🔐',
      color: '#f59e0b',
      difficulty: 'INTERMEDIATE',
      isPremium: false,
      order: 5,
      totalXp: 2500,
    },
  });

  // Challenges
  const challenges = [
    {
      title: 'Caesar Says',
      description: 'Decrypt this message: "Khoor Zruog". Find the flag in format FLAG{...}',
      category: 'CRYPTO',
      difficulty: 'BEGINNER',
      points: 50,
      flag: 'FLAG{hello_world}',
      hints: ['Try shifting each letter by 3', 'Julius Caesar used this cipher'],
      isPremium: false,
    },
    {
      title: 'Hidden in Plain Sight',
      description: 'There is a secret message hidden in this image. Can you find it? Download the image and extract the hidden data.',
      category: 'STEGANOGRAPHY',
      difficulty: 'BEGINNER',
      points: 75,
      flag: 'FLAG{steganography_master}',
      hints: ['Try using steghide', 'The password is "cybersec"'],
      isPremium: false,
    },
    {
      title: 'Login Bypass 101',
      description: 'The admin panel at /practice/login has a vulnerability. Can you get in without valid credentials?',
      category: 'WEB',
      difficulty: 'BEGINNER',
      points: 100,
      flag: "FLAG{sql_injection_works}",
      hints: ["Try ' OR '1'='1", 'Think about SQL injection in the username field'],
      isPremium: false,
    },
    {
      title: 'Base64 Detective',
      description: 'Decode this: "Q1lCRVJRVUVTVHtlbmNvZGVkX3NlY3JldH0="',
      category: 'CRYPTO',
      difficulty: 'BEGINNER',
      points: 50,
      flag: 'CYBERQUEST{encoded_secret}',
      hints: ['This is base64 encoding', 'Use atob() in browser console'],
      isPremium: false,
    },
    {
      title: 'Network Sniff',
      description: 'Analyze the provided pcap file and find the password transmitted in cleartext over HTTP.',
      category: 'NETWORK',
      difficulty: 'INTERMEDIATE',
      points: 150,
      flag: 'FLAG{http_is_not_secure}',
      hints: ['Use Wireshark', 'Filter by HTTP POST requests'],
      isPremium: true,
    },
    {
      title: 'JWT Jailbreak',
      description: 'This API uses JWT tokens. The algorithm is set to "none". Can you forge an admin token?',
      category: 'WEB',
      difficulty: 'INTERMEDIATE',
      points: 200,
      flag: 'FLAG{jwt_none_algorithm}',
      hints: ['Modify the header algorithm field', 'Base64 decode the token parts'],
      isPremium: true,
    },
    {
      title: 'OSINT: Find the Employee',
      description: 'The company "TechCorp" has a security researcher. Find their Twitter/X handle using only public information.',
      category: 'OSINT',
      difficulty: 'INTERMEDIATE',
      points: 175,
      flag: 'FLAG{osint_is_powerful}',
      hints: ['Check LinkedIn', 'Look at company website team page'],
      isPremium: true,
    },
    {
      title: 'Reverse the Binary',
      description: 'This binary checks for a password. Reverse engineer it and find the correct password.',
      category: 'REVERSE',
      difficulty: 'ADVANCED',
      points: 300,
      flag: 'FLAG{reverse_engineering_pro}',
      hints: ['Use strings command', 'Try Ghidra or IDA Free'],
      isPremium: true,
    },
  ];

  for (const challenge of challenges) {
    await prisma.challenge.create({ data: challenge });
  }
  console.log('✅ Challenges seeded');

  // Exams
  await prisma.exam.create({
    data: {
      courseId: course1.id,
      title: 'Cybersecurity Fundamentals Exam',
      description: 'Test your understanding of core cybersecurity concepts',
      duration: 30,
      passingScore: 70,
      xpReward: 300,
      isPremium: false,
      questions: {
        create: [
          { text: 'What does CIA stand for in cybersecurity?', type: 'MCQ', options: ['Control, Integrity, Access', 'Confidentiality, Integrity, Availability', 'Cyber, Intrusion, Attack', 'Code, Identity, Authentication'], answer: '1', explanation: 'CIA Triad = Confidentiality, Integrity, Availability', points: 10, order: 1 },
          { text: 'Which type of malware encrypts your files and demands payment?', type: 'MCQ', options: ['Virus', 'Worm', 'Ransomware', 'Spyware'], answer: '2', explanation: 'Ransomware encrypts files and demands ransom', points: 10, order: 2 },
          { text: 'A firewall can completely protect against all cyber attacks.', type: 'TRUE_FALSE', options: ['True', 'False'], answer: '1', explanation: 'Firewalls are just one layer of defense. Defense in depth is required.', points: 10, order: 3 },
          { text: 'What port does SSH typically run on?', type: 'MCQ', options: ['21', '22', '23', '25'], answer: '1', explanation: 'SSH runs on port 22 by default', points: 10, order: 4 },
          { text: 'What is a "zero-day" vulnerability?', type: 'MCQ', options: ['A vulnerability found on day zero of a project', 'An unknown vulnerability with no available patch', 'A vulnerability that takes zero days to exploit', 'A critical vulnerability rated 0 in severity'], answer: '1', explanation: 'Zero-day = unknown vulnerability with no patch available', points: 10, order: 5 },
          { text: 'Which OSI layer handles IP addressing?', type: 'MCQ', options: ['Layer 1 - Physical', 'Layer 2 - Data Link', 'Layer 3 - Network', 'Layer 4 - Transport'], answer: '2', explanation: 'Layer 3 (Network layer) handles IP addressing and routing', points: 10, order: 6 },
          { text: 'Social engineering attacks target technical vulnerabilities, not humans.', type: 'TRUE_FALSE', options: ['True', 'False'], answer: '1', explanation: 'Social engineering targets human psychology, not technical systems', points: 10, order: 7 },
          { text: 'What is the purpose of a VPN?', type: 'MCQ', options: ['Speed up internet connection', 'Create encrypted tunnel for secure communication', 'Block all hackers', 'Replace firewall'], answer: '1', explanation: 'VPN creates an encrypted tunnel protecting your traffic', points: 10, order: 8 },
          { text: 'What does "phishing" primarily rely on?', type: 'MCQ', options: ['Technical exploits', 'Social engineering', 'Brute force', 'Zero-day exploits'], answer: '1', explanation: 'Phishing is a social engineering attack using deceptive emails', points: 10, order: 9 },
          { text: 'Two-factor authentication (2FA) uses something you know and _____.', type: 'FILL_BLANK', options: ['something you have', 'something you steal', 'something random', 'something encrypted'], answer: '0', explanation: '2FA = Something you know (password) + Something you have (phone/token)', points: 10, order: 10 },
        ],
      },
    },
  });

  console.log('✅ Exams seeded');
  console.log('\n🎉 Database seeding complete!');
  console.log('\n📋 Admin Credentials:');
  console.log('   Email: admin@cyberquest.io');
  console.log('   Password: Admin@CyberQuest2024');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
