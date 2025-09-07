// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dance styles...');
  
  const danceStyles = [
    { name: "Хип-хоп", description: "Уличный танцевальный стиль" },
    { name: "Брейк-данс", description: "Акробатический уличный танец" },
    { name: "Джаз-фанк", description: "Современный джазовый стиль" },
    { name: "Контемпорари", description: "Современный танец" },
    { name: "Бальные танцы", description: "Классические парные танцы" },
    { name: "Латина", description: "Латиноамериканские танцы" },
    { name: "Балет", description: "Классический танец" },
    { name: "Хаус", description: "Электронный танцевальный стиль" },
    { name: "Вог", description: "Стиль на основе модельной походки" },
    { name: "Дэнсхолл", description: "Ямайский танцевальный стиль" },
  ];

  // Очищаем существующие данные (осторожно - это удалит все данные!)
  await prisma.user.deleteMany({});
  await prisma.danceSchool.deleteMany({});
  await prisma.danceStyle.deleteMany({});

  console.log('Creating dance styles...');
  
  // Создаем стили танцев по одному
  for (const style of danceStyles) {
    await prisma.danceStyle.create({
      data: style
    });
  }
  console.log('Dance styles created successfully!');

  // Получаем созданные стили для использования в школах
  const hipHopStyle = await prisma.danceStyle.findFirst({ 
    where: { name: "Хип-хоп" } 
  });
  const ballroomStyle = await prisma.danceStyle.findFirst({ 
    where: { name: "Бальные танцы" } 
  });

  if (!hipHopStyle || !ballroomStyle) {
    throw new Error('Required dance styles not found');
  }

  console.log('Creating dance schools...');
  const schools = [
    { 
      name: "Танцевальная студия «Ритм»", 
      city: "Москва",
      description: "Профессиональное обучение современным танцам",
      styleId: hipHopStyle.id 
    },
    { 
      name: "Школа бальных танцев «Грация»", 
      city: "Санкт-Петербург",
      description: "Классические бальные танцы для всех возрастов",
      styleId: ballroomStyle.id 
    },
    { 
      name: "Hip-Hop Academy", 
      city: "Москва",
      description: "Уличные танцы и хип-хоп культура",
      styleId: hipHopStyle.id 
    },
  ];

  // Создаем школы танцев по одной
  for (const school of schools) {
    await prisma.danceSchool.create({
      data: school
    });
  }
  console.log('Dance schools created successfully!');

  console.log('Creating admin user...');
  
  // Создаем администратора
  await prisma.user.create({
    data: {
      email: 'admin@afisha.ru',
      fullName: 'Администратор Афиши',
      password: hashSync('admin123', 10),
      role: UserRole.ADMIN,
      phone: '+79991234567',
      city: 'Москва',
      about: 'Системный администратор платформы',
    },
  });
  console.log('Admin user created successfully!');

  // Создаем тестового пользователя
  console.log('Creating test user...');
  await prisma.user.create({
    data: {
      email: 'user@test.ru',
      fullName: 'Тестовый Пользователь',
      password: hashSync('user123', 10),
      role: UserRole.USER,
      phone: '+79997654321',
      city: 'Москва',
      about: 'Обычный пользователь для тестирования',
    },
  });
  console.log('Test user created successfully!');

  // Создаем тестового организатора
  console.log('Creating test organizer...');
  const hipHopSchool = await prisma.danceSchool.findFirst({ 
    where: { name: "Hip-Hop Academy" } 
  });

  if (!hipHopSchool) {
    throw new Error('Hip-Hop Academy not found');
  }

  await prisma.user.create({
    data: {
      email: 'org@test.ru',
      fullName: 'Организатор Мероприятий',
      password: hashSync('org123', 10),
      role: UserRole.ORGANIZER,
      isOrganizer: true,
      organizationName: "Hip-Hop Academy",
      organizationCity: "Москва",
      organizationStyleId: hipHopStyle.id,
      danceSchoolId: hipHopSchool.id,
      phone: '+79995554433',
      city: 'Москва',
      about: 'Организатор танцевальных мероприятий',
    },
  });
  console.log('Test organizer created successfully!');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });