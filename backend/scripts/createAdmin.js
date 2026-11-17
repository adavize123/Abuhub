import prisma from '../src/config/prismaClient.js';
import bcrypt from 'bcryptjs';

async function run() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      if (existing.role !== 'admin') {
        await prisma.user.update({ where: { id: existing.id }, data: { role: 'admin', isActive: true, isEmailVerified: true } });
        console.log('Updated existing user to admin:', email);
      } else {
        console.log('Admin already exists:', email);
      }
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
      },
    });

    console.log('Created admin user:', user.email, 'with default password (change in production)');
  } catch (err) {
    console.error('Create admin failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
