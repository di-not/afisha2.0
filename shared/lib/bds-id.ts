
export function generateBDSId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export async function getUniqueBDSId(): Promise<string> {
  const { prisma } = await import('@/shared/lib/prisma');
  let bdsId: string;
  let isUnique = false;
  
  while (!isUnique) {
    bdsId = generateBDSId();
    const existingUser = await prisma.user.findUnique({
      where: { bdsId }
    });
    
    if (!existingUser) {
      isUnique = true;
    }
  }
  
  return bdsId!;
}