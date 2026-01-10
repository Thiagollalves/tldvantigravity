// This file is only used in API routes (server-side)
// It will not be bundled in the client build
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prisma: any

if (process.env.NODE_ENV === 'production') {
  prisma = {}
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalForPrisma = global as unknown as { prisma: any }

  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: ['query'],
    })

  if (process.env.NODE_ENV === 'development') globalForPrisma.prisma = prisma
}

export { prisma }
