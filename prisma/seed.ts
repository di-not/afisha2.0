// prisma/seed-real-events.ts
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
  ]);

  // Находим организатора
  const organizer = await prisma.user.findFirst({
    where: { email: "organizer@example.com" },
  });

  // 1. Mucho Mas 2025
  const muchoMasEvent = await prisma.event.create({
    data: {
      id: generateObjectId(),
      title: "Mucho Mas 2025",
      description:
        "<p>Это первый Российский оркестровый танго фестиваль.Роскошь и драйв живого исполнения. Аргентинская культура «оркестров для танцпола» — ощущение ожившей великой эпохи. Невероятная энергетика, объединяющая музыкантов и танцоров. Великолепные локации. Танцоры, влюбленные в танго, собравшиеся со всей страны.Приезжайте, чтобы услышать и ощутить Танго по-новому.</p>",
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
    },
  });
  // Добавляем тэги сети для Mucho Mas

  await prisma.tag.createMany({
    data: tags.map((tag) => {
      return {
        name: tag.name,
        color: tag.color,
        url: tag.url,
        eventId: muchoMasEvent.id,
      };
    }),
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

  // Добавляем расписание для Mucho Mas
  const days = [
    {
      name: "Четверг",
      dateName: "8 Мая",
      date: new Date("2025-05-08"),
      timestamps: [
        {
          name: "Урок №1 / уровень A",
          shortDescription:
            "Magdalena Gutierrez & Germán Ballejo / Контроль пространства в объятиях: техники для поддержания комфорта и равновесия в объятиях",
          time: "11:00 - 12:30",
        },
        {
          name: "Урок №2 / уровень B",
          shortDescription:
            "Magdalena Gutierrez & Germán Ballejo // Хиро. • Техники для достижения точности и энергии в объятиях.",
          time: "12:45 - 14:15",
        },
        {
          name: "Урок №3 / уровень B",
          shortDescription:
            "Esteban Moreno & Claudia Codega // Инструменты для импровизации: Различные способы соединения элементов Хореографические связки №1: сакады, высокие сакады, болео и ганчо",
          time: "14:30 - 16:00",
        },
        {
          name: "Урок №4 / уровень C + Преподаватели",
          shortDescription:
            "Esteban Moreno & Claudia Codega // От танго-салона до сцены: Проекция и энергия, заземление и свинг",
          time: "16:15 - 17:45",
        },
        {
          name: "Урок №13 / уровень ABC + Преподаватели",
          shortDescription:
            "МТ с Esteban Moreno & Germán Ballejo // Урок техник для лидеров, которые хотят улучшить свой шаг, поворот, силу и стиль. Разные качества шага, работа стоп, спины и рук. Повороты, энроске, украшения.",
          time: "18:00 - 19:30",
        },
        {
          name: "Милонга №1",
          shortDescription:
            'DJ Ольга Агапова // Live: "Sonder tango" (Italia/Argentina) // Show: Magdalena Gutierrez & Germán Ballejo',
          time: "21:00 - 03:00",
        },
      ],
    },
    {
      name: "Пятница",
      dateName: "9 Мая",
      date: new Date("2025-05-09"),
      timestamps: [
        {
          name: "Урок №5 / уровень B",
          shortDescription:
            "Esteban Moreno & Claudia Codega // Хореографические связки №2: сакады, высокие сакады, болео и ганчо",
          time: "11:00 - 12:30",
        },
        {
          name: "Урок №6 / уровень A",
          shortDescription:
            "Esteban Moreno & Claudia Codega // Основы социального танго: комфортное объятия, плавные шаги",
          time: "12:45 - 14:15",
        },
        {
          name: "Урок №7 / уровень A",
          shortDescription:
            "Magdalena Gutierrez & Germán Ballejo // Вдохновение великими милонгерос и маэстрос прошлого. Как управлять пространством на танцполе, уважая при этом социальное танго и его музыкальность. Содержание: Очо: перекрестная и параллельные системы",
          time: "14:30 - 16:00",
        },
        {
          name: "Урок №8 / уровень C + Преподаватели",
          shortDescription:
            "Magdalena Gutierrez & Germán Ballejo // Музыкальная фразировка и многослойность мелодии •Определение музыкальных фраз и адаптация движений к этим структурам •Работа с партнером и музыкальной фразировкой и оркестровыми стилями / Д'Арьенцо,Пульезе,Тройло",
          time: "16:15 - 17:45",
        },
        {
          name: "Урок №14 / уровень ABC + Преподаватели",
          shortDescription:
            "ЖТ с Magdalena Gutierrez // Женские техники (Лидеры тоже приветствуются!) Работа с базовыми настройки в танго (управление переносом веса, различные качества шага , повороты)",
          time: "18:00 - 19:30",
        },
        {
          name: "Милонга №2",
          shortDescription:
            "DJ Сергей Попов // Live: Tango en vivo tipica (Россия) // Show: Esteban Moreno & Claudia Codega",
          time: "21:00 - 03:00",
        },
      ],
    },
    {
      name: "Суббота",
      dateName: "10 Мая",
      date: new Date("2025-05-10"),
      timestamps: [
        {
          name: "Урок №9 / уровень B",
          shortDescription: "Magdalena Gutierrez & Germán Ballejo // Вальс. Цепочки и линейные / круговые движения.",
          time: "11:00 - 12:30",
        },
        {
          name: "Урок №10 / уровень C + Преподаватели",
          shortDescription:
            "Magdalena Gutierrez & Germán Ballejo // Стихии: Вода, Земля, Воздух, Огонь • Использование интенсивности и скорости в соответствии с динамикой заложенной в мелодию, плавные и взрывные упражнения. Урок музыкальности",
          time: "12:45 - 14:15",
        },
        {
          name: "Урок №11 / уровень C + Преподаватели",
          shortDescription:
            "Esteban Moreno & Claudia Codega // Совершенствование движений и последовательностей для сцены. Работа с последовательностями и комбинирование элементов / сакады, высокие сакады, болео, ганчо и энганчады, барриды",
          time: "14:30 - 16:00",
        },
        {
          name: "Урок №12 / уровень А",
          shortDescription: "Esteban Moreno & Claudia Codega // Ритм Милонги: задор и игривость",
          time: "16:15 - 18:00",
        },
        {
          name: "Урок №15 / уровень BC и преподаватели",
          shortDescription: "ЖТ с Claudia Codega // Женские техники Характер, сила, украшения.",
          time: "18:00 - 19:30",
        },
        {
          name: "Милонга №3",
          shortDescription: "DJ Николай Ростов // Live: Romantica Milonguera (Argentina)",
          time: "22:00 - 03:00",
        },
      ],
    },
    {
      name: "Воскресенье",
      dateName: "11 Мая",
      date: new Date("2025-05-11"),
      timestamps: [
        {
          name: "Чемпионат и Кубок MUCHO MÁS 2025",
          shortDescription: "По доброй традиции в заключительный день пройдет Кубок MUCHO MÁS",
          time: "09:00 - 19:00",
        },
        {
          name: "Милонга №4",
          shortDescription:
            "Dj Daniel Tuero // Брюссельский формат: Show: Esteban Moreno & Magdalena Gutierrez, Germán Ballejo & Claudia Codega",
          time: "21:00 - 02:00",
        },
      ],
    },
  ];

  for (const day of days) {
    const timetable = await prisma.timetable.create({
      data: {
        id: generateObjectId(),
        name: day.name,
        dateName: day.dateName,
        date: day.date,
        eventId: muchoMasEvent.id,
      },
    });

    await prisma.timestamp.createMany({
      data: day.timestamps.map((ts) => ({
        id: generateObjectId(),
        name: ts.name,
        shortDescription: ts.shortDescription,
        time: ts.time,
        timetableId: timetable.id,
      })),
    });
  }

  // 2. Бачата мастер класс с Дмитрий Вагис
  const bachataEvent = await prisma.event.create({
    data: {
      id: generateObjectId(),
      title: "Бачата мастер класс с Дмитрий Вагис",
      description:
        "<p>Дмитрий Вагин:\n-Главный по Бачате в СНГ\n-За 10 лет обучил более 25000 человек\n-Проводил свои классы в 21й стране и 70и городах мира\n-Двукратный чемпион России\n-Чемпион стран Европы\n-Бронзовый мировой призер</p>\n<p>-Автор собственной методики обучения\n-Автор онлайн курсов, марафонов и интенсивов\n-Основатель Бачата студия Loco Vagis\n-Организатор Бачата ивента Sensual Weekend\n-Организатор Фестиваль-Турнира Association Cup\n-Автор Социально благотворительного проекта «Бачата по-Русски»\n-Организатор Концертно-развлекательного проекта Fiesta by Vagis\n-Организатор BIG Russian Bachata Congress</p>",
      shortDescription: "Дмитрий Вагис в Самаре в октябре 2024 - Бачата Интенсив",

      imageUrl: "/uploads/tango-event.jpg",
      startDate: new Date("2024-10-26T08:00:00"),
      endDate: new Date("2024-10-26T18:00:00"),
      minPrice: 0,
      maxPrice: 0,
      isOnline: false,
      isFree: true,
      isArchived: false,
      isConfirmed: true,
      placeId: places[1].id,
    },
  });

  await prisma.tag.createMany({
    data: tags.map((tag) => ({
      name: tag.name,
      color: tag.color,
      url: tag.url,
      eventId: bachataEvent.id,
    })),
  });

  await prisma.socials.create({
    data: {
      id: generateObjectId(),
      vk: "https://vk.com/vagisinsamara",
      eventId: bachataEvent.id,
    },
  });

  // 3. Конкурсный тур "Самарская танцевальная ярмарка «PROдвижение»"
  const konkursEvent = await prisma.event.create({
    data: {
      id: generateObjectId(),
      title: 'Конкурсный тур "Самарская танцевальная ярмарка «PROдвижение»"',
      description:
        '<p>Всероссийского конкурса-фестиваля\n«Самарская танцевальная ярмарка "PROдвижение"\nОчный этап конкурса состоится 17 августа 2024 года в г. Самара</p>\n<p>Художественный руководитель Конкурса-фестиваля Ульбаев Виталий Фаритович\nГалина Петровна            +79170127126\nЕкатерина Максимовна   +79198030137\n с 10:00 до 18:00 в будние дни\ne-mail: samtanpro@mail.ru\nПри поддержке: Президентский фонда культурных инициатив</p>',
      shortDescription:
        'Очный этап конкурса-фестиваля "Самарская танцевальная ярмарка "PROдвижение" При поддержке Президентского Фонда Культурных Инициатив',

      imageUrl: "/uploads/tango-event.jpg",
      startDate: new Date("2024-08-17T14:00:00"),
      endDate: new Date("2024-08-17T21:30:00"),
      minPrice: 0,
      maxPrice: 0,
      isOnline: false,
      isFree: true,
      isArchived: false,
      isConfirmed: true,
      placeId: places[2].id,
    },
  });

  await prisma.tag.createMany({
    data: tags.map((tag) => ({
      name: tag.name,
      color: tag.color,
      url: tag.url,
      eventId: konkursEvent.id,
    })),
  });

  await prisma.socials.create({
    data: {
      id: generateObjectId(),
      vk: "https://vk.com/samtanpro",
      eventId: konkursEvent.id,
    },
  });

  // 4. Самарская танцевальная ярмарка "PROдвижение"
  const samaraEvent = await prisma.event.create({
    data: {
      id: generateObjectId(),
      title: 'Самарская танцевальная ярмарка "PROдвижение"',
      description:
        '<p>В августе в Самаре состоится Всероссийский конкурс-фестиваль "Самарская танцевальная ярмарка "PROдвижение".</p>\n<p>Призовой фонд конкурса-фестиваля составляет 200 000 рублей. Иногородним участникам оргкомитет предоставляет бесплатное проживание и питание для групп не более 10 человек.</p>\n<p>Конкурс-фестиваль включает в себя онлайн-отбор участников, очный тур конкурса (конкурсные состязания пройдут в 9 хореографических номинациях), образовательную и фестивальную программы: круглые столы, мастер-классы, показательные выступления творческих коллективов, ознакомительную экскурсию по Самаре.</p>\n<p>В жюри — видные деятели искусства и культуры, народные и заслуженные артисты, почётные работники образования, известные педагоги и руководители творческих коллективов, хореографы, артисты музыкальных театров.</p>\n<p>Последний день подачи заявок в онлайн-отбор — 1 мая 2024 года.</p>\n<p>При поддержке Президентского Фонда Культурных Инициатив.</p>',
      shortDescription:
        'Всероссийский конкурс-фестиваль "Самарская танцевальная ярмарка "PROдвижение", При поддержке Президентского Фонда Культурных Инициатив',

      imageUrl: "/uploads/tango-event.jpg",
      startDate: new Date("2024-08-17T14:00:00"),
      endDate: new Date("2024-08-18T21:30:00"),
      minPrice: 0,
      maxPrice: 0,
      isOnline: false,
      isFree: true,
      isArchived: false,
      isConfirmed: true,
      placeId: places[3].id,
    },
  });

  await prisma.tag.createMany({
    data: tags.map((tag) => ({
      name: tag.name,
      color: tag.color,
      url: tag.url,
      eventId: samaraEvent.id,
    })),
  });

  await prisma.socials.create({
    data: {
      id: generateObjectId(),
      vk: "https://vk.com/samtanpro",
      eventId: samaraEvent.id,
    },
  });

  console.log("✅ Реальные мероприятия созданы!");
}

createRealEvents()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
