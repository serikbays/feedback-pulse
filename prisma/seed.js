import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.feedback.deleteMany();
  await prisma.project.deleteMany();

  await prisma.project.create({
    data: {
      name: 'Mobile App v2',
      description: 'Main iOS and Android application',
      feedbacks: {
        create: [
          { content: 'App crashes on checkout screen!', category: 'bug', sentiment: 'negative' },
          { content: 'Love the new dark mode toggle feature.', category: 'praise', sentiment: 'positive' }
        ]
      }
    }
  });

  await prisma.project.create({
    data: {
      name: 'SaaS Dashboard',
      description: 'Web analytics portal',
      feedbacks: {
        create: [
          { content: 'Please add CSV export option for analytics.', category: 'feature_request', sentiment: 'neutral' }
        ]
      }
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
