import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: npm run generate-api-key <wallet_address> <name> [expires_in_days]');
    process.exit(1);
  }
  
  const walletAddress = args[0].toLowerCase();
  const name = args[1];
  const expiresInDays = args[2] ? parseInt(args[2], 10) : null;
  
  // Generate a random API key
  const key = randomBytes(32).toString('hex');
  
  // Calculate expiration date if provided
  let expiresAt = null;
  if (expiresInDays) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  }
  
  try {
    // Create the API key in the database
    const apiKey = await prisma.apiKey.create({
      data: {
        key,
        name,
        walletAddress,
        expiresAt,
        isActive: true,
      },
    });
    
    console.log('API key generated successfully!');
    console.log('=================================');
    console.log(`ID: ${apiKey.id}`);
    console.log(`Name: ${apiKey.name}`);
    console.log(`Key: ${key}`);
    console.log(`Wallet Address: ${walletAddress}`);
    console.log(`Expires At: ${expiresAt ? expiresAt.toISOString() : 'Never'}`);
    console.log('=================================');
    console.log('Keep this key secure! It will not be shown again.');
  } catch (error) {
    console.error('Error generating API key:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 