import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

function generateObjectId() {
  return new ObjectId().toHexString();
}

async function findOrCreateTag(tagData: { name: string; color?: string; url?: string }) {
  let tag = await prisma.tag.findFirst({
    where: { name: tagData.name },
  });

  if (!tag) {
    tag = await prisma.tag.create({
      data: {
        id: generateObjectId(),
        name: tagData.name,
        color: tagData.color || "#E4E4E4",
        url: tagData.url,
      },
    });
  }

  return tag;
}

async function findOrCreatePlace(placeData: { name: string; url?: string }) {
  let place = await prisma.place.findFirst({
    where: { name: placeData.name },
  });

  if (!place) {
    place = await prisma.place.create({
      data: {
        id: generateObjectId(),
        name: placeData.name,
        url: placeData.url,
      },
    });
  }

  return place;
}

async function createRealEvents() {
  console.log("🌱 Начало заполнения базы данных...");

  await prisma.userDanceStyle.deleteMany();
  await prisma.userEvent.deleteMany();
  await prisma.userFavoriteEvent.deleteMany();
  await prisma.userBookmarkedEvent.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.timestamp.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.document.deleteMany();
  await prisma.socials.deleteMany();
  await prisma.event.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.place.deleteMany();
  await prisma.danceSchool.deleteMany();
  await prisma.danceStyle.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ База данных очищена");
  console.log("💃 Создание стилей танцев...");

  const danceStyles = await Promise.all([
    prisma.danceStyle.create({
      data: {
        id: generateObjectId(),
        name: "Танго",
        description: "Аргентинское танго",
      },
    }),
    prisma.danceStyle.create({
      data: {
        id: generateObjectId(),
        name: "Сальса",
        description: "Латиноамериканский танец",
      },
    }),
    prisma.danceStyle.create({
      data: {
        id: generateObjectId(),
        name: "Бачата",
        description: "Доминиканский танец",
      },
    }),
    prisma.danceStyle.create({
      data: {
        id: generateObjectId(),
        name: "Хип-хоп",
        description: "Уличный танец",
      },
    }),
    prisma.danceStyle.create({
      data: {
        id: generateObjectId(),
        name: "Контемпорари",
        description: "Современный танец",
      },
    }),
    prisma.danceStyle.create({
      data: {
        id: generateObjectId(),
        name: "Бальные танцы",
        description: "Стандартные и латиноамериканские",
      },
    }),
  ]);
  console.log("✅ Стили танцев созданы!");
  console.log("🎪 Создание реальных мероприятий...");

  // Создаем необходимые теги
  const tags = await Promise.all([
    findOrCreateTag({
      name: "18+",
      color: "#E4E4E4",
      url: "/FiltersSearch/?age=18",
    }),
    findOrCreateTag({
      name: "0+",
      color: "#E4E4E4",
      url: "/FiltersSearch/?age=0",
    }),
    findOrCreateTag({
      name: "Фестиваль",
      color: "#E4E4E4",
      url: "/FiltersSearch/?event_type=festival",
    }),
    findOrCreateTag({
      name: "Мастер-Класс",
      color: "#E4E4E4",
      url: "/FiltersSearch/?event_type=master-klass",
    }),
    findOrCreateTag({
      name: "Конкурс",
      color: "#E4E4E4",
      url: "/FiltersSearch/?event_type=konkurs",
    }),
    findOrCreateTag({
      name: "Танго",
      color: "#E4E4E4",
      url: "/tango/",
    }),
    findOrCreateTag({
      name: "Бачата",
      color: "#E4E4E4",
      url: "/bachata/",
    }),
    findOrCreateTag({
      name: "Народные",
      color: "#E4E4E4",
      url: "/narodnye/",
    }),
    findOrCreateTag({
      name: "Танго фестиваль",
      color: "#E4E4E4",
      url: "/FiltersSearch/?search=Танго фестиваль",
    }),
    findOrCreateTag({
      name: "Аргентинское танго",
      color: "#E4E4E4",
      url: "/FiltersSearch/?search=Аргентинское танго",
    }),
    findOrCreateTag({
      name: "Бачата сеншел",
      color: "#E4E4E4",
      url: "/bachata-senshel/",
    }),
  ]);

  // Создаем места
  const places = await Promise.all([
    findOrCreatePlace({
      name: "Лендок",
      url: "https://yandex.ru/maps/org/otkrytaya_kinostudiya_lendok/30884143329",
    }),
    findOrCreatePlace({
      name: "DL Hall",
      url: "https://yandex.ru/maps/org/dance_and_live/128982813941/",
    }),
    findOrCreatePlace({
      name: "ОДО Самара",
      url: "https://yandex.ru/maps/org/dom_ofitserov_samarskogo_garnizona_imeni_voroshilova/1242774233/",
    }),
    findOrCreatePlace({
      name: "Струковский сад в Самаре",
      url: "https://yandex.ru/maps/org/strukovskiy_sad/1071066941",
    }),
    findOrCreatePlace({
      name: "Танцевальный центр Ритм",
      url: "https://yandex.ru/maps/org/ritm/123456789",
    }),
    findOrCreatePlace({
      name: "Культурный центр Искра",
      url: "https://yandex.ru/maps/org/iskra/987654321",
    }),
  ]);

  // Создаем тестового организатора
  const organizer = await prisma.user.create({
    data: {
      id: generateObjectId(),
      fullName: "Организатор Фестивалей",
      email: "organizer@example.com",
      password: "$2b$10$examplepasswordhash",
      role: "ORGANIZER",
      isOrganizer: true,
      organizationName: "Танцевальная Ассоциация",
      organizationCity: "Самара",
      bdsId: "ORG001",
    },
  });

  // 1. Mucho Mas 2025 (главное событие)
  const muchoMasEvent = await prisma.event.create({
    data: {
      id: generateObjectId(),
      title: "Mucho Mas 2025",
      description: "<p>Оркестровый Танго фестиваль</p>",
      shortDescription: "Оркестровый Танго фестиваль / сезон 5",
      imageUrl: "/uploads/tango-event.jpg",
      startDate: new Date("2025-05-08T11:00:00"),
      endDate: new Date("2025-05-12T02:00:00"),
      minPrice: 2700,
      maxPrice: 33600,
      isOnline: false,
      isFree: false,
      isArchived: false,
      isConfirmed: true,
      placeId: places[0].id,
      organizerId: organizer.id,
      creatorId: organizer.id,
      danceStyleId: danceStyles[0].id,
    },
  });

  // Создаем реальные подсобытия для Mucho Mas 2025
  const subEvents = await Promise.all([
    // Подсобытие 1: Мастер-класс по танго
    prisma.event.create({
      data: {
        id: generateObjectId(),
        title: "Мастер-класс по аргентинскому танго с профессионалами",
        description: "<p>Углубленный мастер-класс по технике аргентинского танго с профессиональными преподавателями из Аргентины. Изучение основных фигур, музыкальности и импровизации.</p>",
        shortDescription: "Профессиональный мастер-класс от аргентинских преподавателей",
        imageUrl: "/uploads/tango-masterclass.jpg",
        startDate: new Date("2025-05-08T14:00:00"),
        endDate: new Date("2025-05-08T16:00:00"),
        minPrice: 1500,
        maxPrice: 1500,
        isOnline: false,
        isFree: false,
        isArchived: false,
        isConfirmed: true,
        placeId: places[0].id,
        parentEventId: muchoMasEvent.id,
        organizerId: organizer.id,
        creatorId: organizer.id,
        danceStyleId: danceStyles[0].id,
      },
    }),

    // Подсобытие 2: Конкурс танго
    prisma.event.create({
      data: {
        id: generateObjectId(),
        title: "Конкурс парного танго 'Золотое танго'",
        description: "<p>Ежегодный конкурс парного танго с призовым фондом 100,000 рублей. Участвуют пары со всей России. Жюри из международных экспертов.</p>",
        shortDescription: "Конкурс с призовым фондом 100,000 рублей",
        imageUrl: "/uploads/tango-competition.jpg",
        startDate: new Date("2025-05-09T18:00:00"),
        endDate: new Date("2025-05-09T22:00:00"),
        minPrice: 0,
        maxPrice: 0,
        isOnline: false,
        isFree: true,
        isArchived: false,
        isConfirmed: true,
        placeId: places[0].id,
        parentEventId: muchoMasEvent.id,
        organizerId: organizer.id,
        creatorId: organizer.id,
        danceStyleId: danceStyles[0].id,
      },
    }),

    // Подсобытие 3: Вечерняя милонга
    prisma.event.create({
      data: {
        id: generateObjectId(),
        title: "Традиционная аргентинская милонга 'Noche de Tango'",
        description: "<p>Традиционная аргентинская милонга с живой музыкой оркестра и уютной атмосферой. DJ набор, живое исполнение классических танго.</p>",
        shortDescription: "Традиционная аргентинская вечеринка с живой музыкой",
        imageUrl: "/uploads/milonga.jpg",
        startDate: new Date("2025-05-10T21:00:00"),
        endDate: new Date("2025-05-11T03:00:00"),
        minPrice: 800,
        maxPrice: 800,
        isOnline: false,
        isFree: false,
        isArchived: false,
        isConfirmed: true,
        placeId: places[0].id,
        parentEventId: muchoMasEvent.id,
        organizerId: organizer.id,
        creatorId: organizer.id,
        danceStyleId: danceStyles[0].id,
      },
    }),

    // Подсобытие 4: Воркшоп для начинающих
    prisma.event.create({
      data: {
        id: generateObjectId(),
        title: "Воркшоп 'Танго для начинающих'",
        description: "<p>Специальный воркшоп для тех, кто только начинает свой путь в танго. Основы шага, объятия и музыкальности.</p>",
        shortDescription: "Основы танго для новичков",
        imageUrl: "/uploads/tango-beginners.jpg",
        startDate: new Date("2025-05-09T11:00:00"),
        endDate: new Date("2025-05-09T13:00:00"),
        minPrice: 1000,
        maxPrice: 1000,
        isOnline: false,
        isFree: false,
        isArchived: false,
        isConfirmed: true,
        placeId: places[0].id,
        parentEventId: muchoMasEvent.id,
        organizerId: organizer.id,
        creatorId: organizer.id,
        danceStyleId: danceStyles[0].id,
      },
    }),

    // Подсобытие 5: Гала-концерт
    prisma.event.create({
      data: {
        id: generateObjectId(),
        title: "Гала-концерт звёзд танго",
        description: "<p>Заключительный гала-концерт с участием лучших пар фестиваля. Шоу-программа и награждение победителей.</p>",
        shortDescription: "Гала-концерт и церемония награждения",
        imageUrl: "/uploads/tango-gala.jpg",
        startDate: new Date("2025-05-11T20:00:00"),
        endDate: new Date("2025-05-11T23:00:00"),
        minPrice: 1200,
        maxPrice: 1200,
        isOnline: false,
        isFree: false,
        isArchived: false,
        isConfirmed: true,
        placeId: places[0].id,
        parentEventId: muchoMasEvent.id,
        organizerId: organizer.id,
        creatorId: organizer.id,
        danceStyleId: danceStyles[0].id,
      },
    }),
  ]);

  // Добавляем тэги для Mucho Mas
  await prisma.tag.createMany({
    data: [
      {
        id: generateObjectId(),
        name: "Фестиваль",
        color: "#FF6B6B",
        url: "/FiltersSearch/?event_type=festival",
        eventId: muchoMasEvent.id,
      },
      {
        id: generateObjectId(),
        name: "Танго",
        color: "#4ECDC4",
        url: "/tango/",
        eventId: muchoMasEvent.id,
      },
      {
        id: generateObjectId(),
        name: "18+",
        color: "#45B7D1",
        url: "/FiltersSearch/?age=18",
        eventId: muchoMasEvent.id,
      },
    ],
  });

  // Добавляем тэги для подсобытий
  await prisma.tag.createMany({
    data: [
      {
        id: generateObjectId(),
        name: "Мастер-Класс",
        color: "#F9A826",
        url: "/FiltersSearch/?event_type=master-klass",
        eventId: subEvents[0].id,
      },
      {
        id: generateObjectId(),
        name: "Конкурс",
        color: "#6A0DAD",
        url: "/FiltersSearch/?event_type=konkurs",
        eventId: subEvents[1].id,
      },
      {
        id: generateObjectId(),
        name: "Вечеринка",
        color: "#E84855",
        url: "/FiltersSearch/?event_type=party",
        eventId: subEvents[2].id,
      },
    ],
  });

  // Добавляем социальные сети для Mucho Mas
  await prisma.socials.create({
    data: {
      id: generateObjectId(),
      vk: "https://vk.com/muchomas",
      instagram: "https://www.instagram.com/russiantangoclub/",
      telegram: "https://t.me/Sokhnenko",
      youtube: "https://www.youtube.com/channel/UChTpvMLF1TwX6iNIO7RMuVg/featured",
      eventId: muchoMasEvent.id,
    },
  });

  // 2. Бачата мастер класс с Дмитрий Вагис
  const bachataEvent = await prisma.event.create({
    data: {
      id: generateObjectId(),
      title: "Бачата мастер класс с Дмитрий Вагис",
      description:
        "<p>Дмитрий Вагин - главный по Бачате в СНГ. За 10 лет обучил более 25000 человек. Проводил свои классы в 21й стране и 70и городах мира.</p>",
      shortDescription: "Дмитрий Вагис в Самаре - Бачата Интенсив",
      imageUrl: "/uploads/bachata-event.jpg",
      startDate: new Date("2024-10-26T08:00:00"),
      endDate: new Date("2024-10-26T18:00:00"),
      minPrice: 0,
      maxPrice: 0,
      isOnline: false,
      isFree: true,
      isArchived: false,
      isConfirmed: true,
      placeId: places[1].id,
      organizerId: organizer.id,
      creatorId: organizer.id,
      danceStyleId: danceStyles[2].id,
    },
  });

  // 3. Конкурсный тур "Самарская танцевальная ярмарка «PROдвижение»"
  const konkursEvent = await prisma.event.create({
    data: {
      id: generateObjectId(),
      title: 'Конкурсный тур "Самарская танцевальная ярмарка «PROдвижение»"',
      description: "<p>Всероссийский конкурс-фестиваль танцевального искусства.</p>",
      shortDescription: "Очный этап конкурса-фестиваля",
      imageUrl: "/uploads/competition-event.jpg",
      startDate: new Date("2024-08-17T14:00:00"),
      endDate: new Date("2024-08-17T21:30:00"),
      minPrice: 0,
      maxPrice: 0,
      isOnline: false,
      isFree: true,
      isArchived: false,
      isConfirmed: true,
      placeId: places[2].id,
      organizerId: organizer.id,
      creatorId: organizer.id,
      danceStyleId: danceStyles[5].id,
    },
  });

  // 4. Самарская танцевальная ярмарка "PROдвижение"
  const samaraEvent = await prisma.event.create({
    data: {
      id: generateObjectId(),
      title: 'Самарская танцевальная ярмарка "PROдвижение"',
      description: "<p>Всероссийский конкурс-фестиваль с призовым фондом 200 000 рублей.</p>",
      shortDescription: "Конкурс-фестиваль танцевального искусства",
      imageUrl: "/uploads/festival-event.jpg",
      startDate: new Date("2024-08-17T14:00:00"),
      endDate: new Date("2024-08-18T21:30:00"),
      minPrice: 0,
      maxPrice: 0,
      isOnline: false,
      isFree: true,
      isArchived: false,
      isConfirmed: true,
      placeId: places[3].id,
      organizerId: organizer.id,
      creatorId: organizer.id,
      danceStyleId: danceStyles[5].id,
    },
  });

  // 5. Дополнительные события
  const additionalEvents = await Promise.all([
    // Хип-хоп баттл
    prisma.event.create({
      data: {
        id: generateObjectId(),
        title: "Хип-хоп баттл Street Style",
        description: "<p>Еженедельный хип-хоп баттл для танцоров всех уровней.</p>",
        shortDescription: "Уличные танцевальные баттлы",
        imageUrl: "/uploads/hiphop-event.jpg",
        startDate: new Date("2024-11-15T19:00:00"),
        endDate: new Date("2024-11-15T23:00:00"),
        minPrice: 500,
        maxPrice: 500,
        isOnline: false,
        isFree: false,
        isArchived: false,
        isConfirmed: true,
        placeId: places[4].id,
        organizerId: organizer.id,
        creatorId: organizer.id,
        danceStyleId: danceStyles[3].id,
      },
    }),

    // Сальса вечеринка
    prisma.event.create({
      data: {
        id: generateObjectId(),
        title: "Salsa Night - еженедельная вечеринка",
        description: "<p>Традиционная сальса вечеринка с уроками для начинающих.</p>",
        shortDescription: "Латиноамериканские ритмы",
        imageUrl: "/uploads/salsa-event.jpg",
        startDate: new Date("2024-11-20T20:00:00"),
        endDate: new Date("2024-11-21T02:00:00"),
        minPrice: 700,
        maxPrice: 700,
        isOnline: false,
        isFree: false,
        isArchived: false,
        isConfirmed: true,
        placeId: places[5].id,
        organizerId: organizer.id,
        creatorId: organizer.id,
        danceStyleId: danceStyles[1].id,
      },
    }),

    // Контемпорари воркшоп
    prisma.event.create({
      data: {
        id: generateObjectId(),
        title: "Контемпорари воркшоп с известными хореографами",
        description: "<p>Интенсивный воркшоп по современному танцу.</p>",
        shortDescription: "Современная хореография",
        imageUrl: "/uploads/contemporary-event.jpg",
        startDate: new Date("2024-12-05T11:00:00"),
        endDate: new Date("2024-12-05T17:00:00"),
        minPrice: 2000,
        maxPrice: 2000,
        isOnline: false,
        isFree: false,
        isArchived: false,
        isConfirmed: true,
        placeId: places[4].id,
        organizerId: organizer.id,
        creatorId: organizer.id,
        danceStyleId: danceStyles[4].id,
      },
    }),
  ]);

  console.log("✅ Стили танцев созданы!");
  console.log("✅ Реальные мероприятия созданы!");
  console.log("✅ Подсобытия добавлены!");
  console.log("✅ Дополнительные события созданы!");
}

createRealEvents()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
