import { db, FieldValue } from '../src/config/firebase.js';

interface SeedTrack {
  title: string;
  domain: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxTeams: number;
}

const SEED_PROBLEM_STATEMENTS: SeedTrack[] = [
  {
    title: 'Accessible Multimodal Navigation for Visually Impaired Students',
    domain: 'AI for Accessibility & Inclusivity',
    description:
      'Design an offline-capable, multimodal indoor campus navigation system that leverages computer vision, audio cues, and haptic feedback to help visually impaired students navigate college buildings, lecture halls, and facilities with high spatial accuracy.',
    difficulty: 'advanced',
    maxTeams: 2,
  },
  {
    title: 'Federated Rural Health Clinic Diagnostic & Teleconsultation Hub',
    domain: 'Healthcare & Public Wellness',
    description:
      'Build a lightweight, privacy-preserving teleconsultation and automated diagnostic triage platform for rural health centers. It should operate reliably under low or intermittent internet connectivity and support regional Indian languages with speech-to-text.',
    difficulty: 'intermediate',
    maxTeams: 3,
  },
  {
    title: 'Interactive Peer-to-Peer Collaborative Learning & Code Mentorship Portal',
    domain: 'Open EdTech & Student Tools',
    description:
      'Create an open-source collaborative workspace for engineering students featuring interactive live coding, real-time whiteboarding, automated peer review suggestions, and curriculum mapping with verifiable skill credentials.',
    difficulty: 'intermediate',
    maxTeams: 3,
  },
  {
    title: 'Autonomous Smart Waste Monitoring & Resource Optimization Grid',
    domain: 'Civic Infrastructure & Sustainability',
    description:
      'Develop an IoT telemetry and analytics platform that monitors campus municipal waste collection, predicts overflow thresholds, optimizes collection routes for reduced emissions, and provides a student incentive dashboard for recycling.',
    difficulty: 'beginner',
    maxTeams: 2,
  },
  {
    title: 'Distributed Container Build Pipeline & Security Vulnerability Scanner',
    domain: 'Open Source DevTools & Infrastructure',
    description:
      'Construct a high-performance, developer-first command-line tool and web dashboard for validating microservice container configurations, identifying SBOM dependencies, detecting secret leaks, and accelerating CI/CD build caching.',
    difficulty: 'advanced',
    maxTeams: 2,
  },
  {
    title: 'Decentralized Academic Credential Verification & Open Bounty Marketplace',
    domain: 'Open Innovation (Wildcard)',
    description:
      'An open-ended, high-impact wildcard solution addressing decentralized identity for student achievements, campus hackathon bounties, micro-internship escrow payments, and community-driven campus governance.',
    difficulty: 'intermediate',
    maxTeams: 3,
  },
];

async function seed() {
  console.log('🌱 Starting Problem Statements seed for CBIT Hacktoberfest \'26...');

  const collectionRef = db.collection('problemStatements');

  for (const item of SEED_PROBLEM_STATEMENTS) {
    // Check if a problem statement with this domain or title already exists to avoid duplicates
    const existing = await collectionRef.where('title', '==', item.title).limit(1).get();

    if (!existing.empty) {
      console.log(`ℹ️ Already exists: "${item.title}" (Domain: ${item.domain})`);
      continue;
    }

    const docRef = collectionRef.doc();
    const now = FieldValue.serverTimestamp();

    await docRef.set({
      title: item.title,
      domain: item.domain,
      description: item.description,
      difficulty: item.difficulty,
      maxTeams: item.maxTeams,
      currentTeamCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    console.log(`✅ Seeded: "${item.title}" [${item.domain}] (Cap: ${item.maxTeams} teams) -> Doc ID: ${docRef.id}`);
  }

  console.log('🎉 Seeding completed successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Failed to seed problem statements:', err);
  process.exit(1);
});
