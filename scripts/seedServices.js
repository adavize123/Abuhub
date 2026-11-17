// Seed script to create default services via backend API
const fetch = globalThis.fetch || require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

const defaults = [
  {
    serviceName: 'Web Development',
    description: 'Modern, responsive websites built with cutting-edge technologies',
    shortDescription: 'Modern, responsive websites built with cutting-edge technologies',
    icon: '🌐',
    pricing: 'Custom Quote',
  },
  {
    serviceName: 'App Development',
    description: 'Native and cross-platform mobile applications',
    shortDescription: 'Native and cross-platform mobile applications',
    icon: '📱',
    pricing: 'Custom Quote',
  },
  {
    serviceName: 'AI Training',
    description: 'Comprehensive training in artificial intelligence and machine learning',
    shortDescription: 'Comprehensive AI & ML training',
    icon: '🤖',
    pricing: 'Contact us',
  },
  {
    serviceName: 'Data Analysis',
    description: 'Insights and intelligence from your business data',
    shortDescription: 'Insights from your business data',
    icon: '📊',
    pricing: 'Custom Quote',
  },
  {
    serviceName: 'Business Support',
    description: 'Strategic guidance and support for your business growth',
    shortDescription: 'Strategic guidance and business support',
    icon: '💼',
    pricing: 'Contact us',
  },
  {
    serviceName: 'UI/UX Design',
    description: 'Beautiful and intuitive user interfaces for digital products',
    shortDescription: 'Design for delightful user experiences',
    icon: '🎨',
    pricing: 'Custom Quote',
  },
];

async function run() {
  try {
    const res = await fetch(`${API_BASE}/services`);
    const body = await res.json();
    const existing = body && body.data ? body.data.map((s) => s.serviceName) : [];

    for (const svc of defaults) {
      if (!existing.includes(svc.serviceName)) {
        console.log('Creating:', svc.serviceName);
        const createRes = await fetch(`${API_BASE}/services`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(svc),
        });
        const createBody = await createRes.json();
        console.log('Result:', createBody.success ? 'ok' : 'failed', createBody?.data?.serviceName || createBody?.message || '');
      } else {
        console.log('Already exists:', svc.serviceName);
      }
    }

    const final = await fetch(`${API_BASE}/services`);
    const finalBody = await final.json();
    console.log('Total services now:', finalBody.data.length);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
