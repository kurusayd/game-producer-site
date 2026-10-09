/* ============================================================
   Aleksei Merzliakov — landing logic (v2)
   RU/EN, data-driven sections, funnel guess + simulator,
   mini-game, method & loot, bosses, projects filters, offer quiz,
   FAQ, resume tabs, XP/levels, achievements, x-ray, Konami, egg.
   ============================================================ */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const TG_USER = 'AlekseiMerzliakov';
  const MAIL = 'kurusayd@gmail.com';
  const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };

  /* ------------------------------------------------------------
     Static strings (data-i18n)
  ------------------------------------------------------------ */
  const I18N = {
    ru: {
      'meta.title': 'Алексей Мерзляков — Game Producer. Скажу, где споткнётся игрок',
      'meta.desc': 'Senior Game Producer, 14+ лет в mobile F2P. За час консультации ($60) скажу, где ваша игра теряет игроков и деньги — и что чинить первым.',
      'meta.ogTitle': 'Ваша воронка течёт. За час покажу, где именно.',
      'meta.ogDesc': 'Алексей Мерзляков, Senior Game Producer. 14+ лет в mobile F2P, Dead Impact — D1 с 20%+ до 40%+. Час разбора вашей игры — $60.',
      'hud.name': 'Алексей Мерзляков', 'hud.role': 'Senior Game Producer', 'hud.lvl': 'LVL', 'hud.cta': 'Час',
      'nav.funnel': 'Воронка', 'nav.method': 'Метод', 'nav.cases': 'Кейсы', 'nav.offer': 'Цена', 'nav.skills': 'Навыки', 'nav.projects': 'Проекты', 'nav.faq': 'FAQ', 'nav.cv': 'Резюме',
      'cta.book': 'Забронировать час',
      'hero.eyebrow': 'Мобильные F2P на софт-лонче и в лайве · 14+ лет в геймдеве',
      'hero.h1': 'Скажу, где споткнётся игрок — <span class="hl">раньше, чем это покажут метрики</span>',
      'hero.lead': 'Аналитика показывает, где игрок ушёл. Я объясняю, почему — и что чинить первым. Ещё до созвона прохожу вашу игру как новичок. Главные правки называю прямо на созвоне, а полный список из 5–10 правок по приоритетам присылаю в чат в течение суток. Час — $60.',
      'hero.cta2': 'Как это работает ↓',
      'hero.micro': 'Кнопка откроет Telegram с уже написанным сообщением — останется добавить ссылку на стор, билд или прототип. Нет Telegram — пишите на почту.',
      'hero.worked': '<span>Работал в:</span> Playrix · Reaction Games · Digital Pill · Social Quantum · ArtWorkout',
      'hero.alt': 'Алексей Мерзляков, игровой продюсер — студийный портрет',
      'char.tag': 'Открыт для консультаций', 'char.name': 'Алексей Мерзляков',
      'char.cls': 'Класс: Game Producer / Product Manager · Специализация: полишинг и воронки',
      'pain.eyebrow': 'Симптомы', 'pain.h2': 'Узнаёте свою игру?',
      'pain.take': '<b>Дело не в вашей команде.</b> В своей игре проблем не замечаешь — слишком хорошо знаешь, куда нажимать. Со стороны они видны за один час.',
      'pain.note': 'Цифры в списке условные: они для узнавания, а не из какого-то конкретного проекта.',
      'funnel.eyebrow': 'Воронка', 'funnel.h2': 'Где воронка сужается?',
      'funnel.lead': 'Семь шагов типичной мобильной F2P-игры: от установки до второй покупки. Игроки теряются на каждом. Вопрос в том, где их теряется больше, чем должно. Сначала попробуйте угадать, потом подставьте свои цифры.',
      'funnel.players': 'Из 1000 установок осталось:', 'funnel.badge': 'Типовая воронка · условные цифры',
      'funnel.guess': 'На каком шаге типичная игра теряет больше всего из тех, кто до него дошёл? Шаг оплаты не считается. Нажмите на свой вариант.',
      'funnel.note': 'Проценты условные — усреднённые по открытым отчётам о мобильном F2P. Это не мои проекты: реальные цифры Dead Impact — в разделе «Кейсы».',
      'funnel.simBtn': 'Подставить свои цифры →', 'funnel.simHide': 'Скрыть симулятор ↑',
      'funnel.reactIdle': '<b>Ваш ход.</b> Выберите шаг — скажу, угадали ли вы главную проблему.',
      'funnel.sideTitle': 'На что я смотрю в первую очередь', 'funnel.cta': 'Найти узкие места в моей игре',
      'sim.h3': 'Подставьте свои цифры',
      'sim.lead': 'Выставьте ползунки под свою игру. Счётчик покажет, сколько платящих остаётся из 1000 установок и какой шаг съедает больше всего.',
      'sim.micro': 'Нет метрик? Оставьте значения по умолчанию. Половина проблем видна и без аналитики — достаточно пройти первые десять минут глазами новичка.',
      'mini.t1': 'Час — $60', 'mini.t2': 'Заранее прохожу игру · 60 минут созвона · 5–10 правок по приоритетам в течение суток',
      'game.eyebrow': 'Мини-игра', 'game.h2': 'Найдите, где споткнётся игрок',
      'game.lead': 'Пять экранов типичной мобильной игры. На каждом есть место, где новичок, скорее всего, закроет приложение. Найдите его и нажмите — кликабельные зоны обведены пунктиром.',
      'game.hint': 'Нажмите на одну из обведённых зон — туда, где, по-вашему, новичок бросит игру.', 'game.next': 'Следующий экран →', 'game.photoCap': '<b>Так выглядит новичок</b> на седьмом экране туториала. Найдите, что его довело.', 'game.cta': 'Такой же разбор вашей игры', 'game.replay': 'Сыграть ещё раз',
      'method.eyebrow': 'Метод', 'method.h2': 'Как я нахожу, где споткнётся игрок',
      'method.lead': 'Аналитика скажет: «на четвёртом шаге туториала теряем 18%». Но чтобы починить игру, нужно понять почему — например, игрок просто не догадался, что награда — это валюта. Вот как я прохожу путь от цифры до причины.', 'method.when': 'Шаги 1–2 делаю до созвона, шаги 3–6 — вместе с вами за 60 минут.',
      'method.outTitle': 'Что вы получите',
      'method.out': 'Список из 5–10 правок по приоритетам: что сделать до следующего билда, что — в следующем спринте, а что не трогать вообще. Не «подумайте над онбордингом», а «на третьем экране туториала игрок не понимает, что нажимать — уберите текст, подсветите кнопку и дайте выстрелить уже на второй секунде».',
      'loot.h3': 'Лут: 12 мест, где сужается воронка',
      'loot.closed': 'Нажмите — внутри чек-лист, который можно забрать команде. Жанры разные, а места одни и те же.',
      'loot.copy': 'Скопировать чек-лист', 'loot.copied': 'Скопировано ✓',
      'loot.note': 'Список бесплатный — забирайте команде. А вот какие из двенадцати пунктов — ваши, насколько всё серьёзно и что чинить первым — это и есть час за $60.',
      'loot.cta': 'Проверить мою игру по этому списку — $60 →',
      'cases.eyebrow': 'Кейсы · босс-файт', 'cases.h2': 'D1 ×2, D7 ×3, D30 ×4',
      'cases.lead': 'Можно подумать — удача? Нет. Всего лишь три года кропотливой работы над одной игрой. Ретеншен в этой игре — три разных противника, и у каждого своя тактика. В Dead Impact я бился со всеми тремя: от прототипа до глобального запуска и выхода в плюс. Чинить пришлось годами, а вот найти проблему каждый раз удавалось за час — с этого и начинался каждый бой. Ниже — цифры до и после.',
      'cases.ctx': 'Dead Impact — мобильная зомби-MMORPG, Reaction Games, 2022–2025. Команда 45 человек, 10 в прямом подчинении. Видение продукта, геймплей и роадмап — моя зона. Производственные процессы строил вместе с CEO и HR-директором.',
      'cases.cap': 'Босс не повержен — в F2P его не победить окончательно. Но ретеншен вырос вдвое, а на D30 — вчетверо. Цифры настоящие; «чем бьют» — общий подход, конкретные правки Dead Impact не раскрываю.',
      'cases.cta': 'Разобрать мою игру', 'cases.more': 'Ещё проекты ↓',
      'cases.photoCap': '<b>Ретеншен не чинится пушами.</b> Он чинится в первой сессии — там, где игрок решает, вернётся ли завтра.',
      'offer.eyebrow': 'Цена', 'offer.h2': 'Час консультации — $60',
      'offer.lead': 'Один формат, одна цена. На созвоне ничего не продаю: захотите продолжить — скажете сами.',
      'offer.inTitle': 'Что входит', 'offer.forTitle': 'Кому подойдёт', 'offer.notTitle': 'Кому не подойдёт',
      'offer.for': 'Инди-студии, продюсеру или основателю мобильной F2P-игры на софт-лонче или в раннем лайве. Нужен билд или прототип; первые метрики — плюс, но не обязательно. Подойдёт и продуктовым командам с геймификацией — ArtWorkout был как раз таким.',
      'offer.not': 'Тем, кому нужно «написать ГДД за час»: за час будет диагноз и план, а не документация. Аутсорс разработки или арта — не ко мне. Premium на PC и консолях, web3 — честно скажу до оплаты, где мой опыт применим напрямую, а где с оговорками.',
      'offer.whyTitle': 'Почему $60, а не $600',
      'offer.why': 'Честно: 14 лет я делал игры в штате и консультировать начал недавно. Кейсов за плечами много, а отзывов как у консультанта пока нет — поэтому первые разборы идут по цене входа, чтобы отзывы появились. За $60 вы получаете разбор уровня сеньора — дешевле, чем один созвон вашей команды впятером о том, почему просел D1. Это стартовая цена.',
      'offer.sendTitle': 'Что прислать перед созвоном', 'offer.sampleTitle': 'Пример списка правок', 'offer.sampleNote': 'Условный пример формата, не реальный проект.',
      'offer.howTitle': 'Три шага до списка правок', 'offer.per': '/ 60 минут',
      'offer.priceNote': 'Стартовая цена за первый час. Моя задача — чтобы после него вы захотели второй или позвали меня в проект.',
      'offer.mail': 'Написать письмо', 'offer.copy': 'Скопировать ник', 'offer.step': 'Шаг', 'offer.copied': 'Скопировано ✓',
      'offer.micro': 'Откроется Telegram с уже написанным сообщением. Отвечаю сам, обычно в течение часа. Нет Telegram — пишите на почту kurusayd@gmail.com.',
      'quiz.h3': 'Пока не готовы бронировать?', 'quiz.sub': 'Пять вопросов — и я скажу, куда посмотрел бы в первую очередь.', 'quiz.start': 'Пройти за 30 секунд', 'quiz.back': '← Назад',
      'quiz.end': 'Это первые 15 минут нашего часа. Остальные 45 — на то, чего по квизу не разглядеть.', 'quiz.cta': 'Разобрать за $60', 'quiz.retry': 'Пройти заново',
      'skills.eyebrow': 'Навыки', 'skills.h2': 'Что я умею — и чем докажу',
      'skills.lead': 'За каждым навыком — факт из моего опыта, а не строчка из вакансии. Любой из них можно разобрать за тот же час.',
      'skills.more': 'Ещё три навыка ↓', 'skills.less': 'Свернуть ↑',
      'skills.foot': 'Если вашей проблемы здесь нет — напишите. Честно скажу, помогу или нет.',
      'projects.eyebrow': 'Проекты', 'projects.h2': 'Игры, которые я делал',
      'projects.lead': 'Четырнадцать лет и семь жанров — от match-3 в Одноклассниках до зомби-MMORPG с глобальным запуском. Логотипов студийных игр нет намеренно: права на них у студий. Зато есть роль, годы и результат. Первая карточка — моя собственная игра.',
      'projects.foot': 'Ссылки ведут в сторы и на официальные страницы. Соцсетевые игры 2012–2016 годов уже сняты с публикации — для игр десятилетней давности это нормально.',
      'faq.eyebrow': 'Вопросы', 'faq.h2': 'Вопросы, которые вы наверняка хотите задать',
      'faq.foot': 'Не нашли свой вопрос — задайте его в Telegram. Отвечаю сам, без ассистентов.',
      'faq.cap': '<b>Не помогу — так и скажу.</b> Если ваша задача не про мой опыт, честно предупрежу об этом до оплаты.',
      'about.eyebrow': 'Кто я', 'about.h2': 'Начинал с того, что ломал игры. Теперь чиню', 'about.alt': 'Алексей Мерзляков',
      'cv.eyebrow': 'Резюме', 'cv.h2': 'Опыт по годам', 'cv.lead': 'То же, что в резюме, — только по порядку и с цифрами на виду.',
      'cv.line': 'Senior Game Producer / Senior Product Manager · Москва, готов к релокации · рассматриваю позиции в штат и проектную работу',
      'cv.summary': '14+ лет в mobile F2P. Вёл продукты от прототипа до глобального запуска и выхода в плюс. Управлял кросс-функциональными командами до 45 человек и работал с топ-менеджментом. Растил метрики через продуктовую аналитику, A/B-тесты, LiveOps, монетизацию и дизайн игровой экономики. Строил процессы, которые выдерживали рост команды.',
      'cv.tabExp': 'Опыт', 'cv.tabEdu': 'Образование и навыки', 'cv.dlTitle': 'Скачать и распечатать', 'cv.print': 'Версия для печати',
      'cv.dlEn': 'CV — English (PDF)', 'cv.dlRu': 'Резюме — русский (PDF)', 'cv.plain': 'Режим резюме: без игрового слоя', 'cv.factsTitle': 'Коротко',
      'contact.h2': 'В вашей воронке уже есть узкое место. Найдём его',
      'contact.lead': 'Одно сообщение: название игры, ссылка и что болит. Остальное — моя работа.',
      'contact.cta': 'Написать в Telegram', 'contact.price': '$60 / 60 мин', 'contact.mail': 'Написать письмо',
      'contact.micro': 'Час — $60. Список правок — в течение суток после созвона. Не уверены, подходит ли ваша игра? Спросите в чате — отвечу честно и в течение часа.',
      'contact.title': 'Контакты',
      'foot.loc': 'Москва / удалённо · RU | EN', 'foot.name': 'Алексей Мерзляков', 'foot.ach': 'Открыто ачивок:', 'foot.egg': 'пасхалка на клавиатуре:', 'xray.label': 'Рентген воронки',
      'sticky.t1': 'Час — $60', 'sticky.t2': 'Список правок в течение суток', 'sticky.btn': 'Telegram',
      'egg.t1': 'Секрет найден', 'egg.h3': 'Вы нашли секрет. В играх клиентов я проверяю и такое',
      'egg.p': 'Пасхалки, которых никто не найдёт, тоже съедают время команды. Скажу, какие из них окупаются, а какие — нет.',
      'egg.cta': 'Расскажу, что ещё проверяю →',
    },
    en: {
      'meta.title': 'Aleksei Merzliakov — Game Producer. I’ll tell you where players stumble',
      'meta.desc': 'Senior Game Producer, 14+ years in mobile F2P. In a one-hour consultation ($60) I’ll tell you where your game loses players and money — and what to fix first.',
      'meta.ogTitle': 'Your funnel is leaking. In one hour I’ll show you where.',
      'meta.ogDesc': 'Aleksei Merzliakov, Senior Game Producer. 14+ years in mobile F2P, Dead Impact — D1 from 20%+ to 40%+. One hour on your game — $60.',
      'hud.name': 'Aleksei Merzliakov', 'hud.role': 'Senior Game Producer', 'hud.lvl': 'LVL', 'hud.cta': 'Hour',
      'nav.funnel': 'Funnel', 'nav.method': 'Method', 'nav.cases': 'Cases', 'nav.offer': 'Price', 'nav.skills': 'Skills', 'nav.projects': 'Projects', 'nav.faq': 'FAQ', 'nav.cv': 'Resume',
      'cta.book': 'Book an hour',
      'hero.eyebrow': 'For mobile F2P games in soft launch or early live · Senior Game Producer, 14+ years',
      'hero.h1': 'I’ll tell you where players will stumble — <span class="hl">before your metrics do</span>',
      'hero.lead': 'Analytics shows where players leave. I tell you why — and what to fix first. I play your game as a new player before we even talk; in 60 minutes you get 5–10 concrete, prioritized fixes. One hour — $60, the list in your chat within a day.',
      'hero.cta2': 'How it works ↓',
      'hero.micro': 'The button opens Telegram with the message already written — add a store link, a build or a prototype. No Telegram — send an email.',
      'hero.worked': '<span>Worked at:</span> Playrix · Reaction Games · Digital Pill · Social Quantum · ArtWorkout',
      'hero.alt': 'Aleksei Merzliakov, game producer — studio portrait',
      'char.tag': 'Open for consultations', 'char.name': 'Aleksei Merzliakov',
      'char.cls': 'Class: Game Producer / Product Manager · Spec: polish & funnels',
      'pain.eyebrow': 'Symptoms', 'pain.h2': 'Does this sound like your game?',
      'pain.take': '<b>It isn’t your team’s fault.</b> You can’t see the leaks from inside your own game — you know too well how to play it. From the outside they show up in an hour.',
      'pain.note': 'The numbers in the list are illustrative — for recognition, not from a specific project.',
      'funnel.eyebrow': 'Funnel', 'funnel.h2': 'Where does the funnel leak?',
      'funnel.lead': 'Seven steps of a typical mobile F2P game — from install to the second purchase. Every step loses players. The question is where the game loses more than it should. Guess first. Then plug in your own numbers.',
      'funnel.players': 'Out of 1,000 installs left:', 'funnel.badge': 'Typical funnel · illustrative numbers',
      'funnel.guess': 'Where does a typical game lose the biggest share of the players who reach a step? Don’t count the payment step. Tap a step.',
      'funnel.note': 'Percentages are illustrative — typical for mobile F2P according to public reports. They are not from my projects; the real Dead Impact numbers are in the Cases section.',
      'funnel.simBtn': 'Plug in your numbers →', 'funnel.simHide': 'Hide the simulator ↑',
      'funnel.reactIdle': '<b>Your move.</b> Pick a step — I’ll tell you whether you hit the main leak.',
      'funnel.sideTitle': 'What I look at first', 'funnel.cta': 'Find out why mine leaks',
      'sim.h3': 'Plug in your numbers',
      'sim.lead': 'Move the sliders to match your game. The counter shows how many payers remain out of 1,000 installs — and which step costs you the most.',
      'sim.micro': 'No metrics? Keep the defaults. Half the problems are visible without analytics — just play the first ten minutes as a new player.',
      'mini.t1': 'One hour — $60', 'mini.t2': 'I play the game beforehand · 60-minute call · 5–10 prioritized fixes within a day',
      'game.eyebrow': 'Mini-game', 'game.h2': 'Spot where the player stumbles',
      'game.lead': 'Five screens from a typical mobile game. Each has one spot where a new player is very likely to close the app. Tap it — the outlined areas are clickable.',
      'game.hint': 'Tap an outlined area on the mock screen. One of them is where a newcomer leaves.', 'game.next': 'Next screen →', 'game.photoCap': '<b>This is a newcomer</b> on the seventh tutorial screen. Find what drove him here.', 'game.cta': 'Same review for your game', 'game.replay': 'Play again',
      'method.eyebrow': 'Method', 'method.h2': 'How I find where players stumble',
      'method.lead': 'Between “we lose 18% on tutorial step four” and “the player didn’t realize the reward is a currency” is the whole gap between a dashboard and a fixed game. Here’s how I close it.', 'method.when': 'Steps 1–2 happen before the call, steps 3–6 — with you, in 60 minutes.',
      'method.outTitle': 'What you get',
      'method.out': 'A list of 5–10 changes with priorities: what to do before the next build, what goes into the next sprint, what not to touch at all. Not “think about your onboarding”, but “on tutorial screen three the player doesn’t know what to tap — remove the text, highlight the button, let them fire a shot within two seconds”.',
      'loot.h3': 'Loot: 12 places where F2P funnels narrow',
      'loot.closed': 'Tap to open — inside is a checklist you can take to your team. Genres differ; the places don’t.',
      'loot.copy': 'Copy the checklist', 'loot.copied': 'Copied ✓',
      'loot.note': 'The list is free — take it to your team. Which of the twelve you have, how deep, and what to fix first — that’s the $60 hour.',
      'loot.cta': 'Check my game against this list — $60 →',
      'cases.eyebrow': 'Cases · boss fight', 'cases.h2': 'D1 ×2, D7 ×3, D30 ×4',
      'cases.lead': 'Not luck — three-plus years of work on one game. Retention is three different opponents, each with its own tactics. On Dead Impact I fought all three: from prototype to global launch and break-even. Fixing took years. Seeing where it leaks takes an hour — that’s how each of the three fights started. Scroll — the bars show where we started and where we ended up.',
      'cases.ctx': 'Dead Impact — mobile zombie MMORPG, Reaction Games, 2022–2025. A 45-person team, 10 direct reports. Product vision, gameplay direction and roadmap were mine. Production processes — built with the CEO and HR Director.',
      'cases.cap': 'The boss isn’t defeated — in F2P it never is. But retention doubled, and on D30 it quadrupled. The numbers are real; “how you fight it” is the general approach — I don’t disclose the specific Dead Impact changes.',
      'cases.cta': 'Review my game', 'cases.more': 'More projects ↓',
      'cases.photoCap': '<b>Retention isn’t fixed with push notifications.</b> It’s fixed in the first session — where the player decides whether to come back tomorrow.',
      'offer.eyebrow': 'Price', 'offer.h2': 'One-hour consultation — $60',
      'offer.lead': 'One format. One price. I don’t sell anything on the call: if you want to continue, you’ll say so yourself.',
      'offer.inTitle': 'What’s included', 'offer.forTitle': 'Who it’s for', 'offer.notTitle': 'Who it’s not for',
      'offer.for': 'Indie studios, producers and founders of a mobile F2P game in soft launch or early live. You have a build or a prototype. First metrics are a plus, not a must. Product teams with gamification — ArtWorkout was exactly that.',
      'offer.not': '“Write our GDD in an hour” — in an hour you get a diagnosis and a plan, not documentation. Outsourced development or art — not my role. PC and console premium, web3 — I’ll tell you honestly before you pay where my experience applies directly and where it comes with caveats.',
      'offer.whyTitle': 'Why $60 and not $600',
      'offer.why': 'Honest answer: I spent 14 years making games in-house and have only just started consulting. Plenty of cases from employment, no consultant reviews yet — so the first reviews go at an entry price so those appear. You get a senior-level review for $60 — less than one five-person team meeting about why D1 dropped. This is the starting price.',
      'offer.sendTitle': 'What to send before the call', 'offer.sampleTitle': 'Sample list of fixes', 'offer.sampleNote': 'An illustrative format, not a real project.',
      'offer.howTitle': 'Three steps to your list of fixes', 'offer.per': '/ 60 minutes',
      'offer.priceNote': 'The starting price of the first hour. My goal is that after it you want a second one, or bring me onto the project.',
      'offer.mail': 'Send an email', 'offer.copy': 'Copy @handle', 'offer.step': 'Step', 'offer.copied': 'Copied ✓',
      'offer.micro': 'Opens Telegram with the message already written. I reply personally, usually within an hour. No Telegram — kurusayd@gmail.com.',
      'quiz.h3': 'Not ready to book?', 'quiz.sub': 'Five questions — I’ll tell you where I’d look first.', 'quiz.start': 'Take the 30-second quiz', 'quiz.back': '← Back',
      'quiz.end': 'That’s 15 minutes of our hour. The other 45 go to what a quiz can’t see.', 'quiz.cta': 'Review my game — $60', 'quiz.retry': 'Start over',
      'skills.eyebrow': 'Skills', 'skills.h2': 'What I do — and how I can prove it',
      'skills.lead': 'Every skill below is backed by a fact from my career, not a word from a job ad. Any of them can be what we spend the hour on.',
      'skills.more': 'Three more skills ↓', 'skills.less': 'Collapse ↑',
      'skills.foot': 'If your problem isn’t on this list — write to me. I’ll tell you honestly whether I can help.',
      'projects.eyebrow': 'Projects', 'projects.h2': 'Games I’ve made',
      'projects.lead': 'Fourteen years across genres — from match-3 on OK.ru to a zombie MMORPG with a global launch. No studio logos on purpose: the studios own them. What’s here is the role, the years and the result. The first card is my own game.',
      'projects.foot': 'Links go to stores and official pages. The 2012–2016 social titles have been unpublished — normal for games a decade old.',
      'faq.eyebrow': 'Questions', 'faq.h2': 'The questions you’d ask',
      'faq.foot': 'Didn’t find your question — ask on Telegram. You’ll get me, not an assistant.',
      'faq.cap': '<b>“We already have analytics.”</b> Analytics tells you where. I tell you why — and what to change first.',
      'about.eyebrow': 'Who I am', 'about.h2': 'I started out breaking games. Now I fix them', 'about.alt': 'Aleksei Merzliakov',
      'cv.eyebrow': 'Resume', 'cv.h2': 'Experience by year', 'cv.lead': 'Everything that’s in the résumé — in chronological order, with the numbers up front.',
      'cv.line': 'Senior Game Producer / Senior Product Manager · Moscow, willing to relocate · open to full-time and project roles',
      'cv.summary': '14+ years in mobile F2P. Led products from prototype to global launch and break-even. Managed cross-functional teams of up to 45 people and worked with top management. Growth through product analytics, A/B testing, LiveOps, monetization and game economy design. Built processes that held up as teams grew.',
      'cv.tabExp': 'Experience', 'cv.tabEdu': 'Education & skills', 'cv.dlTitle': 'Download & print', 'cv.print': 'Print version',
      'cv.dlEn': 'CV — English (PDF)', 'cv.dlRu': 'Resume — Russian (PDF)', 'cv.plain': 'Résumé mode: no game layer', 'cv.factsTitle': 'In short',
      'contact.h2': 'Your funnel leaks somewhere. Let’s find where',
      'contact.lead': 'One message: the name, the link, what hurts. The rest is my job.',
      'contact.title': 'Contacts', 'contact.cta': 'Message me on Telegram', 'contact.price': '$60 / 60 min', 'contact.mail': 'Send an email',
      'contact.micro': 'One hour — $60. The list of fixes — within a day of the call. Not sure your game is a fit? Ask in the chat — I’ll answer honestly.',
      'foot.loc': 'Moscow / remote · RU | EN', 'foot.name': 'Aleksei Merzliakov', 'foot.ach': 'Achievements unlocked:', 'foot.egg': 'keyboard easter egg:', 'xray.label': 'Funnel X-ray',
      'sticky.t1': 'One hour — $60', 'sticky.t2': 'Fix list within a day', 'sticky.btn': 'Telegram',
      'egg.t1': 'Secret found', 'egg.h3': 'You found the secret. I check for this in clients’ games too',
      'egg.p': 'Easter eggs nobody will ever find still eat up the team’s time. I’ll tell you which ones pay off and which don’t.',
      'egg.cta': 'I’ll tell you what else I check →',
    },
  };

  /* ------------------------------------------------------------
     Structured data
  ------------------------------------------------------------ */
  const PROJ_COMMON = [
    { id: 'rb', c: '#3a1f5e', em: '🎉', g: 'pet', y: '2026', h: 'Escape to the Party', co: 'Roblox', imgs: ['img/roblox-1-800.jpg', 'img/roblox-2-800.jpg', 'img/roblox-3-800.jpg'], links: [['Roblox', 'https://www.roblox.com/games/138774538553922/Escape-to-the-Party-Obby']] },
    { id: 'aw', c: '#5c3a12', em: '🎨', g: 'app', y: '2025–2026', h: 'ArtWorkout', co: 'ArtWorkout', links: [['artworkout.app', 'https://artworkout.app/']] },
    { id: 'di', c: '#5a1c24', em: '🧟', g: 'shooter', y: '2022–2025', h: 'Dead Impact', co: 'Reaction Games', links: [['deadimpact.com', 'https://deadimpact.com/']] },
    { id: 'da', c: '#1f3a2a', em: '🏕️', g: 'shooter', y: '2022', h: 'Days After', co: 'Reaction Games', links: [['days-after.com', 'https://days-after.com/']] },
    { id: 'ws', c: '#174a46', em: '🦒', g: 'casual', y: '2021–2022', h: 'Wildscapes', co: 'Playrix', links: [['App Store', 'https://apps.apple.com/us/app/wildscapes/id1199882006']] },
    { id: 'fs', c: '#163a63', em: '🐠', g: 'casual', y: '2021–2022', h: 'Fishdom Solitaire', co: 'Playrix', links: [['App Store', 'https://apps.apple.com/us/app/fishdom-solitaire/id1642487048']] },
    { id: 'cl', c: '#3a1f5e', em: '⚔️', g: 'rpg', y: '2017–2020', h: 'Chaos Lords', co: 'Digital Pill', links: [['App Store', 'https://apps.apple.com/gb/app/chaos-lords-tactical-rpg/id1442800810'], ['Google Play', 'https://play.google.com/store/apps/details?id=games.dpill.chaoslords']] },
    { id: 'uo', c: '#0f4a5c', em: '🐙', g: 'casual', y: '2016–2017', h: 'Underwater Odyssey', co: 'Social Quantum', links: [['VK', 'https://vk.com/app5192190_730326']] },
    { id: 'ast', c: '#5e1f4a', em: '🍬', g: 'social', y: '2012–2016', h: 'Jewel Bay · Pirate Cat · Candy Dale · Bubble Chronicles · Plyushk', co: 'AST222', links: [] },
  ];

  const DATA = {
    ru: {
      strip: [
        ['14+ лет', 'в mobile F2P', 'С 2012 года: AST222 → Social Quantum → Digital Pill → Playrix → Reaction Games → ArtWorkout.'],
        ['D1 20%+ → 40%+', 'Dead Impact', 'Reaction Games, 2022–2025. Там же D7 5%+ → 15%+, D30 1%+ → 4%+.'],
        ['+30%', 'к конверсии', 'ArtWorkout, 2025–2026. A/B-эксперименты Live Activity и Animated Paywall.'],
        ['7 жанров', 'от match-3 до MMORPG', 'Match-3, bubble shooter, social casino, тактическая RPG, пасьянс, зомби-MMORPG, survival. Плюс приложение с геймификацией — ArtWorkout.'],
        ['2', 'глобальных запуска', 'Dead Impact (mobile) и Chaos Lords (iOS, Android, Samsung Galaxy Store) — от прототипа до глобального запуска.'],
      ],
      stats: [['Полишинг игрового опыта', 98], ['Диагностика воронки', 96], ['A/B-эксперименты', 94], ['Ретеншен', 92], ['Команда и процессы', 90], ['Экономика и монетизация', 88]],
      pain: [
        '<b>D1 застрял ниже 30%</b>, и каждая новая версия двигает его на ±1%.',
        'Туториал проходят, скажем, 70%. До первого боя, уровня или матча доходят 40%, до первого пейвола — 10%. <b>Куда делись остальные — не знает никто.</b>',
        'A/B-тесты «плоские»: <b>третий эксперимент подряд без значимой разницы</b>, и уже непонятно, что тестировать дальше.',
        'Команда уже месяц спорит, что чинить первым: мету, экономику или онбординг. <b>А пока спорит, бюджет на трафик уходит на игроков, которые не вернутся.</b>',
        'Вы чувствуете, что игра «не затягивает», <b>но не можете ткнуть пальцем в конкретный экран.</b>',
      ],
      funnel: [
        { l: 'Установка', n: 1000, rate: 100, t: 'Здесь ещё никто не ушёл. Всё, что ниже, — про первые десять минут и первые два дня.' },
        { l: 'Первый запуск', n: 900, rate: 90, t: 'Загрузка дольше пяти секунд, запрос логина и разрешений раньше, чем игрок успел хоть раз тапнуть по самой игре.' },
        { l: 'Туториал пройден', n: 610, rate: 68, main: true, t: 'Туториал объясняет вместо того, чтобы дать попробовать; отбирает управление; тянется дольше трёх минут — игрок читает, а не играет.' },
        { l: 'Первая сессия завершена', n: 520, rate: 85, t: 'Первое поражение случается раньше, чем игрок понял правила; после туториала непонятно, что делать дальше; награду выдали, а потратить её негде.' },
        { l: 'Вернулся на D1', n: 290, rate: 56, main: true, t: 'Игрок выходит, а у него нет ни незаконченного дела, ни цели на завтра; пуш пришёл не вовремя или не пришёл вовсе.' },
        { l: 'Первая покупка', n: 29, rate: 10, pay: true, t: 'Пейвол раньше первого «вау»; ценность оффера не понять без чтения описания; три валюты в первые десять минут. Падение здесь самое большое, и это нормально: в F2P обычно платят 2–5% установивших.' },
        { l: 'Вторая покупка', n: 14, rate: 48, t: 'Стартовый набор закрыл все потребности; после покупки темп прогресса не изменился; следующий оффер никак не связан с тем, что происходит у игрока.' },
      ],
      funnelLbls: { breaks: 'Что обычно ломается', drop: 'отвал', ofPrev: 'от предыдущего шага',
        hit: '<b>Да. Это одно из двух самых узких мест типичной игры.</b> В чужой игре это видно сразу. В своей — нет: слишком хорошо знаешь, как в неё играть. Для этого и нужен взгляд со стороны.',
        pay: '<b>Падение здесь самое большое, но это норма:</b> в F2P платят единицы процентов. Главная проблема выше — в туториале и возврате на D1. Почините её, и платящих станет больше, даже если в магазине не менять ни строчки.',
        miss: '<b>Здесь тоже теряют, но главная проблема не здесь.</b> Посмотрите на туториал и возврат на D1: там типичная игра теряет от трети до половины дошедших игроков.',
        first: '<b>Первый шаг — это 100%.</b> Потери начинаются ниже: попробуйте ещё раз.' },
      checks: [
        ['Первые 90 секунд', 'Сколько тапов и экранов отделяют игрока от первого «я выиграл».'],
        ['Момент «понял»', 'Где игрок впервые решает сам, а не идёт по стрелке туториала.'],
        ['Причина вернуться', 'Что остаётся незаконченным, когда игрок закрывает игру.'],
        ['Первый пейвол', 'Когда появляется, что в нём и отвечает ли он на то, чего игроку сейчас не хватает.'],
        ['Мелкие помехи', 'Загрузки, подтверждения, лишние экраны, непонятные иконки — всё, где тап не приводит к ожидаемому результату.'],
      ],
      sim: { lbl: 'доля дошедших с предыдущего шага, %', typical: 'типично', out: 'Из 1000 установок: <b>{n}</b> платящих, <b>{m}</b> — повторно.', narrow: 'Самая узкая точка: <b>{s}</b>.', tail: 'Симулятор показывает, где узко. Почему так и что менять первым — это уже разбор.', ref: 'Для сравнения: у Dead Impact к концу моей работы D1 был 40%+. Это ориентир, а не обещание.', payers: 'платящих', repeat: 'повторно' },
      rounds: [
        { title: 'Туториал', task: 'Первая минута в игре. Где новичок закроет приложение?',
          ok: 'Стена текста. Игрок не читает — он тапает. Семь экранов объяснений до первого действия — и заметная часть новичков уже ушла. Туториал должен быть первым выигранным ходом, а не лекцией.',
          bad: 'Не здесь. Поле и заголовок игрока не пугают — пугает то, сколько нужно прочитать, прежде чем дадут поиграть.' },
        { title: 'Первая победа', task: 'Игрок только что прошёл первый уровень. Что его оттолкнёт?',
          ok: 'Пейвол раньше первого «хочу». У игрока ещё нет ни потребности, ни понимания, зачем ему монеты. Он закроет окно и запомнит одно: игра просит денег. Оффер должен появляться, когда в нём есть нужда.',
          bad: 'Не здесь. Победа и звёзды — как раз то, что нужно. Проблема в том, что выскакивает сразу после них.' },
        { title: 'Главный экран', task: 'Вторая минута. Игрок вышел в меню. Что здесь не так?',
          ok: 'Девять иконок и шесть красных бейджей на второй минуте — это не контент, а шум. Мета должна открываться по одной системе за раз — когда у игрока появился вопрос, на который она отвечает.',
          bad: 'Не здесь. Кнопка «В бой» — единственное, что игроку сейчас понятно. Посмотрите, что её окружает.' },
        { title: 'Энергия', task: 'Третий уровень. Что заставит игрока выйти и не вернуться?',
          ok: 'Полчаса ожидания на третьем уровне. Игрок ещё не решил, нравится ли ему игра, — а ограничение работает только тогда, когда он уже хочет продолжить. Здесь это не монетизация, а дверь на выход.',
          bad: 'Не здесь. Уровень и поле в порядке. Ищите то, что не даёт играть дальше.' },
        { title: 'Регистрация', task: 'Игра только скачана. Первый экран. Что убивает конверсию?',
          ok: 'Регистрация до первой игры — классическая стена. Сделайте гостевой вход и предложите сохранить прогресс после первой победы — и этот шаг перестанет терять игроков.',
          bad: 'Не здесь. Кнопка ни при чём — дело в том, что игрока заставляют заполнять форму до того, как он увидел игру.' },
      ],
      gameEnd: [
        ['Глаз-алмаз: 5 из 5', 'У вас глаз продюсера. Теперь представьте такой же разбор вашей игры — с вашими метриками и конкретными правками.'],
        ['Хороший глаз: {n} из 5', 'Пару мест вы бы пропустили, а игроки — нет. Именно такие места я и ищу в билде за час.'],
        ['{n} из 5 — это нормально', 'Изнутри проекта такие мелочи не видны: вы и так знаете, куда нажимать. Поэтому и нужен взгляд новичка.'],
      ],
      ui: { tut: 'Как играть', next: 'Далее (1/7)', win: 'Победа!', buy: 'Купить за $9.99', nothx: 'Нет, спасибо', pack: 'Стартовый набор', packDesc: '1000 монет + редкий герой', battle: 'В бой', lvl1: 'Уровень 1', lvl3: 'Уровень 3', wait: 'Подождать 29:59', buyE: 'Купить за 50 💎', noEnergy: 'Энергия закончилась', reg: 'Создайте аккаунт', email: 'Email', pass: 'Пароль', agree: '☐ Согласен с условиями', signup: 'Зарегистрироваться', google: 'или войти через Google', board: 'игровое поле',
        tutText: ['Добро пожаловать! В этой игре вы собираете ресурсы, строите базу и сражаетесь с другими игроками. Ресурсы бывают четырёх типов…', 'Золото нужно для построек, кристаллы — для ускорений, энергия тратится на бой, а жетоны — на арену…', 'Чтобы открыть меню героя, нажмите на портрет. Чтобы улучшить героя, нужны осколки…', 'Нажимайте «Далее», чтобы продолжить обучение.'],
        icons: ['Магазин', 'Гильдия', 'Арена', 'Герои', 'События', 'Квесты', 'Почта', 'Рейтинг', 'Бонус'],
        aria: { text: 'Текст туториала', title: 'Заголовок', board: 'Игровое поле', next: 'Кнопка «Далее»', win: 'Экран победы', pack: 'Окно стартового набора', grid: 'Сетка иконок меню', battle: 'Кнопка «В бой»', energy: 'Полоса энергии', modal: 'Окно «Энергия закончилась»', form: 'Форма регистрации', signup: 'Кнопка регистрации' } },
      roundLbl: 'Экран', ok: 'Верно!', miss: 'Мимо', found: 'Найдено',
      method: [
        ['Прохожу игру как новый игрок, а не как продюсер.', 'С секундомером: сколько секунд проходит до первого самостоятельного решения и когда впервые возникает мысль «а зачем я здесь». Отмечаю каждый экран, на котором рука тянется свернуть игру. Я начинал в QA, и привычка искать, где ломается у живого человека, никуда не делась.'],
        ['Сверяю с воронкой.', 'Если аналитика есть — сравниваю шаги туториала, первой сессии и первого пейвола с нормой жанра: где провал глубже ожидаемого? Если аналитики нет — называю пять событий, которые стоит добавить первыми, чтобы через неделю провалы стало видно.'],
        ['Ищу расхождение между «что хотел дизайнер» и «что понял игрок».', 'Там, где они расходятся, игроки отваливаются. Три типичные причины: непонятна цель, не чувствуется награда, неочевиден следующий шаг.'],
        ['Проверяю экономику первых 30 минут.', 'Хватает ли ресурсов, чтобы почувствовать прогресс? Не упирается ли игрок в стену раньше, чем понял, за что здесь платят? Пейвол раньше первого «вау» или сразу после обидного поражения — оба варианта режут конверсию.'],
        ['Приоритизирую по RICE.', 'RICE — фреймворк приоритизации, которым пользуются продуктовые команды от Intercom до Google и Amazon: охват, влияние, уверенность, трудоёмкость. Работаю по нему много лет. На выходе не «переделать всё», а 5–10 правок, которые действительно сдвинут метрику.'],
        ['Формулирую каждую правку как гипотезу для A/B-теста.', 'Что меняем, что должно вырасти, что считаем успехом. Плоский результат — тоже результат: в ArtWorkout первый редизайн геймификации и экономики не дал эффекта. Мы не отчитались об успехе, а переделали гипотезу и запустили тест заново.'],
      ],
      loot: [
        ['Первые 10 секунд.', 'Лого, загрузка, запрос логина — а поиграть ещё не дали.', 'Сколько тапов до первого игрового действия.'],
        ['Туториал объясняет, а не даёт сделать.', 'Длинные подсказки: игрок читает вместо того, чтобы играть.', 'Сколько шагов «сделай сам», а сколько — «прочитай».'],
        ['Первое поражение раньше понимания правил.', 'Игрок проигрывает и решает, что игра нечестная.', 'Сложность первых пяти уровней и момент первого провала.'],
        ['Пустота после туториала.', '«А что мне делать дальше?»', 'Есть ли на экране одна явная цель сессии.'],
        ['Первая награда не ощущается.', 'Выдали ресурс, который некуда потратить.', 'Сколько шагов от первой награды до первого осмысленного выбора.'],
        ['Стена экономики.', 'Ресурсы заканчиваются до того, как игрок понял ценность покупки.', 'Баланс первых 30 минут.'],
        ['Пейвол не вовремя.', 'Оффер раньше первого «вау» или сразу после обидного поражения.', 'Когда и в какой ситуации показывается каждый пейвол.'],
        ['Мета не связана с кором.', 'Прокачка есть, но в геймплее она не чувствуется.', 'Что меняется в ощущениях от боя или уровня после апгрейда.'],
        ['Нет причины вернуться завтра.', 'D1 проваливается, хотя первая сессия прошла нормально.', 'Таймеры, ежедневные цели, незаконченные дела на момент выхода.'],
        ['Скачок сложности.', 'Сложность подскакивает на 3–5-м уровне и уносит половину когорты.', 'Соотношение побед и поражений по уровням.'],
        ['Перегруз интерфейса.', 'Все мета-экраны открылись сразу, и игрок не знает, куда смотреть.', 'Порядок, в котором открываются фичи.'],
        ['Лишние тапы до покупки.', 'Между «хочу» и «купил» — три подтверждения.', 'Сколько шагов от оффера до оплаты.'],
      ],
      lootLbls: { sym: 'Что обычно нахожу', chk: 'Где смотрю' },
      skills: [
        { ic: 'eye', main: true, h: 'Полишинг: вижу, где споткнётся игрок', p: 'Прохожу игру глазами новичка и говорю, на каком экране он запутается, заскучает или разозлится — раньше, чем это покажет аналитика. С этого начинается каждый разбор.', proof: 'Dead Impact — D1 <b>20%+ → 40%+</b>, D7 <b>5%+ → 15%+</b>, D30 <b>1%+ → 4%+</b>. Глаз натренирован ещё в QA: я был лидом тестирования в AST222.' },
        { ic: 'funnel', h: 'Воронка до первого платежа', p: 'Нахожу шаги, на которых теряется будущий платящий: момент первого пейвола, понятность оффера, число тапов до покупки. Говорю, что менять и в каком порядке.', proof: 'ArtWorkout: Live Activity и Animated Paywall — конверсия <b>+30%</b> и рост смежных метрик LTV. Экономика и монетизация Chaos Lords — моя работа.' },
        { ic: 'flask', wide: true, cert: 'img/kohavi.jpg', certAlt: 'Сертификат Accelerating Innovation with A/B Testing, Ronny Kohavi, Maven', h: 'A/B-тесты и дерево метрик', p: 'Помогу выстроить дерево метрик и вывести OEC — единую метрику, по которой принимаются решения. Посмотрю ваши дашборды и процесс A/B-тестов: как формулируются гипотезы, когда тест останавливают, что считают успехом. Гипотезу помогу сформулировать так, чтобы тест дал ответ, а не плоский результат.', proof: 'Сертификат <b>Accelerating Innovation with A/B Testing</b> — курс Ронни Кохави, который руководил экспериментами в Amazon, Microsoft и Airbnb. Приоритизирую по RICE.' },
        { ic: 'coins', h: 'Экономика и монетизация F2P', p: 'Разбираю баланс валют, темп прогресса, цену и момент первого оффера. Нахожу, где экономика душит игрока, а где отдаёт слишком много бесплатно.', proof: 'Экономика и монетизация <b>Chaos Lords</b> (три стора). Экономика и монетизация live-проектов в Playrix. Редизайн core-экономики ArtWorkout.' },
        { ic: 'calendar', h: 'LiveOps, который держит ретеншен', p: 'Говорю, какие ивенты, ежедневные цели и офферы возвращают игрока, а какие только создают шум. Планирую LiveOps ради D7 и D30, а не ради всплеска на неделю.', proof: 'Участие в глобальном LiveOps-роадмапе <b>Wildscapes</b> (Playrix, юнит на 150 человек). Ретеншен и выручку растил через LiveOps по данным аналитики.' },
        { ic: 'rocket', h: 'От прототипа до глобального запуска', p: 'Знаю, что ломается между софт-лончем и глобальным запуском и какие метрики должны быть «зелёными», прежде чем вкладываться в трафик. Помогаю решить: докручивать, разворачивать или переключаться на другой проект.', proof: '<b>Dead Impact</b> — прототип → глобальный запуск → выход в плюс. <b>Chaos Lords</b> — прототип → софт-лонч → глобальный запуск. <b>Underwater Odyssey</b> — прототип → софт-лонч.' },
        { ic: 'layers', extra: true, h: 'Уровни и контент, которые не надоедают', p: 'Понимаю кривую сложности, ритм уровней и момент, когда контент начинает повторяться. Говорю, где игрок устанет и где его нужно удивить.', proof: 'Около <b>600</b> готовых к продакшену уровней для Underwater Odyssey. ГДД с нуля. Match-3 и bubble shooter в AST222.' },
        { ic: 'users', extra: true, h: 'Процессы, которые ускоряют команду', p: 'Вижу, где команда теряет недели: нет ответственного за решение, эксперименты не задокументированы, спорят вместо того, чтобы тестировать. Даю схему, которая работает и для пяти человек, и для сорока пяти.', proof: 'Команда из <b>45</b> человек в Reaction Games, процессы вместе с CEO и HR-директором. Процессы в Asana и стандарт документации в ArtWorkout. QA-отдел с нуля в AST222.' },
        { ic: 'gamepad', extra: true, h: 'Свою игру делаю сам', p: 'Чтобы советы не отрывались от практики, веду собственный проект на Roblox: геймдизайн, экономика, монетизация, обновления. На нём проверяю на живых игроках идеи про онбординг и первую сессию.', proof: '<b>Escape to the Party</b> — обби на Roblox, 2026. Двенадцать этажей препятствий, сундуки, бонусы, внутриигровой магазин.' },
      ],
      bosses: [
        { who: 'Босс 1', h: 'Первый день (D1)', sub: 'Доля игроков, открывших игру на следующий день', was: 20, now: 40, stamp: 'РЕТЕНШЕН ×2', dmg: '−20 п.п. оттока', how: 'Первые минуты: убрать шаги без награды, дать победить раньше, чем выбирать, и выкинуть всё, что игроку не понадобится до завтра.' },
        { who: 'Босс 2', h: 'Неделя (D7)', sub: 'Доля игроков, вернувшихся через неделю', was: 5, now: 15, stamp: 'РЕТЕНШЕН ×3', dmg: '−10 п.п. оттока', how: 'Дать причину вернуться: заметный прогресс и цель, понятная в момент, когда игрок закрывает игру.' },
        { who: 'Босс 3', h: 'Привычка (D30)', sub: 'Доля игроков, оставшихся через месяц', was: 1, now: 4, stamp: 'РЕТЕНШЕН ×4', dmg: '−3 п.п. оттока', how: 'Экономика и LiveOps: контент и события, ради которых есть смысл оставаться в игре, а не только пройти её.' },
        { who: 'Бонус-босс', h: 'Конверсия', sub: 'ArtWorkout: рост конверсии за счёт A/B-экспериментов, 2025–2026', was: 0, now: 30, bonus: true, stamp: '+30%', dmg: '+30%', how: 'A/B-тесты вместо споров — Live Activity, Animated Paywall. Плоский первый результат редизайна геймификации — повод переделать гипотезу, а не похоронить идею.' },
      ],
      bossLbls: { was: 'было', now: 'стало', scale50: '50%', conv: 'конверсия' },
      inside: [
        ['60 минут созвона', 'Telegram, Google Meet или Zoom — как удобно вам. На русском или английском.'],
        ['Прохожу игру заранее', 'До созвона 20–30 минут сам играю в вашу игру как новичок.'],
        ['Разбор воронки: 7 шагов и 12 типичных узких мест', 'На созвоне разбираем, где вы теряете больше, чем должны, и почему. Плюс ваши вопросы: экономика, LiveOps, A/B, процессы в команде.'],
        ['Аудит аналитики и A/B-процесса', 'Дерево метрик и OEC, дашборды, процесс экспериментов — если болит это, посвятим созвон этому.'],
        ['Топ-3 правки — сразу, полный список — в течение суток', 'Главное назову прямо на созвоне. Письменный список из 5–10 правок по приоритетам пришлю в тот же чат.'],
      ],
      send: ['Ссылку на стор, билд (TestFlight / APK) или прототип — ГДД, Figma, видео геймплея. Прототип разбираю так же, как билд.', 'Если есть — 3–5 метрик воронки: установки → туториал → первый матч → D1 → первая покупка.', 'Если есть — скринкаст первой сессии нового игрока.', 'Одну фразу о том, что болит.', 'Нужен NDA — пришлите ваш шаблон до того, как отправлять билд.'],
      sample: [
        ['P0', 'Туториал, экран 3.', 'Игрок не понимает, что нажимать. Убрать текст, подсветить кнопку, дать выстрелить на второй секунде.', 'До следующего билда'],
        ['P0', 'Первая награда.', '50 монет, а магазин закрыт до 5-го уровня. Открыть один предмет за 50 монет сразу после первого боя.', 'До следующего билда'],
        ['P1', 'Первый пейвол.', 'На 7-й минуте, до первой победы. Перенести за первую победу и показывать в контексте награды.', 'Следующий спринт'],
        ['P1', 'Выход из первой сессии.', 'Нет незаконченного дела. Дать таймер или цель на завтра перед выходом.', 'Следующий спринт'],
        ['P2', 'Главное меню.', 'Семь вкладок при первом заходе. Открывать по одной начиная с 3-го уровня.', 'После проверки P0–P1 на метриках'],
        ['—', 'Не трогать: мета-прогрессию.', 'Пока не починен туториал, до неё не доходит большинство игроков.', ''],
      ],
      howto: [['Пишете в Telegram', 'Название игры, ссылка на стор или билд, одна фраза — что болит.'], ['Договариваемся о времени', 'Я заранее прохожу игру. Вам готовить ничего не нужно — разве что метрики, если они есть.'], ['Созвон 60 минут', 'Три главные правки — на созвоне. Полный список по приоритетам — в течение суток у вас в чате.']],
      priceMeta: ['Онлайн, 60 минут', 'RU / EN', 'Готов подписать ваш NDA', 'Список правок — в течение суток'],
      quiz: {
        q: [
          ['Ваш D1?', ['меньше 25%', '25–35%', '35–45%', 'больше 45%', 'не знаю']],
          ['Какая доля игроков доходит до конца туториала?', ['меньше 50%', '50–75%', 'больше 75%', 'не знаю']],
          ['Когда игрок видит первый пейвол?', ['в первой сессии', 'на D1–D2', 'позже', 'пейвола нет']],
          ['Сколько человек в команде?', ['1–5', '6–15', '16–40', 'больше 40']],
          ['Что уже пробовали?', ['A/B-тесты', 'редизайн онбординга', 'пуши', 'ничего']],
        ],
        zones: {
          nometrics: ['Нет метрик', 'Судя по ответам, метрик пока нет — и это не мешает. Первым делом я бы прошёл первые десять минут вашей игры как новичок и назвал пять событий, которые стоит добавить в аналитику первыми. Через неделю провалы станет видно — и будет что чинить.'],
          tutorial: ['Туториал', 'Судя по ответам, первым делом я бы смотрел на туториал. Когда до его конца доходит меньше половины, до всего, что ниже по воронке, добирается слишком мало игроков, чтобы имело смысл это чинить.'],
          session: ['Первая сессия и возврат', 'Судя по ответам, первым делом я бы смотрел на первую сессию и момент выхода из неё. Туториал проходят, а назавтра не возвращаются — значит, причина вернуться так и не появилась.'],
          paywall: ['Первый пейвол', 'Судя по ответам, первым делом я бы смотрел на первый пейвол. Он либо раньше первого «вау», либо его нет вовсе — и оба варианта стоят вам денег.'],
          meta: ['Мета и D7', 'Судя по ответам, первым делом я бы смотрел на мету и прогресс между D1 и D7. Первые дни в норме — значит, узкое место дальше по воронке.'],
        },
        prog: 'Вопрос {i} из {n}',
        tg: 'Здравствуйте! Хочу разбор игры за $60. Игра: ___ (ссылка). Болит: ___. Квиз: D1 {0}, туториал {1}, пейвол {2}, команда {3}, пробовали {4}.',
      },
      tgDefault: 'Здравствуйте! Хочу разбор игры за $60. Игра: ___ (ссылка на стор или билд). Болит: ___.',
      mailSubject: 'Разбор игры — $60',
      filters: [['all', 'Все'], ['shooter', 'MMORPG и survival'], ['rpg', 'RPG'], ['casual', 'Match-3 и казуальные'], ['social', 'Соцсети 2012–2016'], ['app', 'Не игры'], ['pet', 'Свой проект']],
      projects: {
        rb: { genre: 'Obby · свой проект', plat: 'ПК, мобильные, консоли', role: 'автор', lbl: 'Делаю от идеи до обновлений', p: 'Побег на вечеринку на крыше: двенадцать этажей с шарами для боулинга, лазерами и цунами, монеты, сундуки, бонусы и магазин. Здесь я на живых игроках проверяю то же, что советую клиентам.', res: 'В активной разработке: новые этажи на подходе' },
        di: { genre: 'Мобильная зомби-MMORPG', plat: 'Mobile', role: 'Game Producer', lbl: 'Вёл от прототипа до глобального запуска', p: 'Команда 45 человек, 10 в прямом подчинении. Видение продукта, геймплей, роадмап.', res: 'D1 <b>20%+ → 40%+</b> · D7 <b>5%+ → 15%+</b> · D30 <b>1%+ → 4%+</b>. Игра вышла в плюс.' },
        da: { genre: 'Survival', plat: 'Mobile', role: 'Game Producer', lbl: 'Проверял гипотезы', p: 'Проверил ранние продуктовые гипотезы, прежде чем студия сосредоточилась на Dead Impact.', res: null },
        ws: { genre: 'Match-3 с метой', plat: 'App Store', role: 'Game Producer', lbl: 'Участвовал в LiveOps-роадмапе', p: 'Участвовал в глобальном LiveOps-роадмапе: core-геймплей, ретеншен, монетизация. Работал в связке с лидами команд — в юните было 150 человек.', res: 'Рост ретеншена и выручки за счёт LiveOps по данным аналитики' },
        fs: { genre: 'Пасьянс', plat: 'App Store', role: 'Game Producer', lbl: 'Делал core-геймплей и прогресс', p: 'Core-геймплей и системы прогресса в живом F2P-проекте.', res: null },
        cl: { genre: 'Тактическая RPG', plat: 'iOS · Android · Samsung Galaxy Store', role: 'Game Producer', lbl: 'Вёл от прототипа до глобального запуска', p: 'Прототип → софт-лонч → глобальный запуск в трёх сторах. Команда 20 человек.', res: 'Отвечал за экономику, монетизацию и core-геймплей' },
        uo: { genre: 'Казуальная · match-3', plat: 'ВКонтакте', role: 'Game Designer', lbl: 'Уровни и ГДД — сам', p: 'Прототип → успешный софт-лонч. Написал ГДД с нуля, собрал команду геймдизайнеров и руководил ею.', res: 'Около <b>600</b> готовых к продакшену уровней' },
        aw: { genre: 'Рисование · геймификация', plat: 'Mobile', role: 'Senior Product Manager', lbl: 'Вёл продукт и эксперименты', p: 'Гипотезы по RICE и A/B-тесты. Редизайн геймификации и core-экономики. Процессы в Asana, роадмап, структура сквадов.', res: 'Конверсия <b>+30%</b>: Live Activity, Animated Paywall' },
        ast: { genre: 'Match-3 · bubble · casino', plat: 'OK.ru · Facebook · ВКонтакте', role: 'Lead QA → Game Designer → Producer', lbl: 'Выпускал', p: 'Социальные и казуальные игры. Параллельно построил с нуля QA-отдел и процесс тестирования: тест-стратегия, Jira и Trello.', res: null },
      },
      faq: [
        ['«$60 — подозрительно дёшево. В чём подвох?»', 'Подвоха нет, есть расчёт. Это первый час: я хочу, чтобы после него вы захотели второй или позвали меня в проект. Недорогой вход — мой способ показать работу, а не рассказывать о ней. Когда очередь вырастет, вырастет и цена.'],
        ['«Что если за час вы ничего не найдёте?»', 'За 14 лет я не видел игры, в которой первые десять минут обходились бы без проблем, — но допустим. Тогда вы услышите это прямо, и это тоже ответ: проблема не в продукте, а в трафике или рынке, и тратить бюджет на переделку онбординга не нужно.'],
        ['«У нас есть аналитика, мы и так всё видим»', 'Аналитика показывает, где. Я объясняю, почему и что менять первым. А если аналитики нет — половина проблем видна и без неё, а вторую начнём измерять: скажу, какие пять событий добавить первыми.'],
        ['«У нас другой жанр. Ваш опыт не подойдёт»', 'За 14 лет я делал зомби-MMORPG, тактическую RPG, match-3, пасьянс, bubble shooter, social casino и приложение для рисования с геймификацией. Воронка «установка → туториал → первый матч → первый пейвол → возврат» почти везде устроена одинаково. Жанр меняет детали, а не места, где спотыкается игрок. А там, где не помогу — premium на PC, web3, — скажу об этом до оплаты.'],
        ['«Мы ещё на прототипе. Рано»', 'Наоборот, это самый дешёвый момент что-то менять. Прототипы и дизайн-документы разбираю так же, как билды. В Reaction Games я проверял ранние гипотезы Days After, прежде чем студия сосредоточилась на Dead Impact, — и Dead Impact дошёл до глобального запуска. Час на этапе прототипа экономит месяцы после софт-лонча.'],
        ['«Нужен NDA»', 'Пришлите ваш шаблон — подпишу до того, как увижу билд. Ничего из вашей игры не попадёт в мои кейсы без вашего письменного согласия.'],
        ['«Вы сейчас в найме? Хватит ли на нас времени?»', 'Сейчас я не в штате: консультирую и беру проекты на несколько недель, так что время на вас есть. Отвечаю сам, обычно в течение часа. Созвон — на русском или английском.'],
        ['«Как и когда платить?»', 'Договоримся в Telegram: выберем удобный вам способ, детали подтвержу в чате до созвона.'],
      ],
      about: [
        'В геймдев я пришёл в 2012-м, в AST222: лидом QA ловил баги в социальных match-3 и строил отдел тестирования с нуля. Там же дорос до геймдизайнера и продюсера. В Social Quantum собрал около 600 уровней для Underwater Odyssey — и понял, что <b>игрок видит не механику, а конкретный экран</b>.',
        'Дальше — продюсером: Chaos Lords довёл до релиза в трёх сторах, Dead Impact — до глобального запуска с командой в 45 человек. В Playrix увидел, как устроен LiveOps в юните на 150 человек. В ArtWorkout, приложении с геймификацией, поднял конверсию на 30% A/B-экспериментами.',
        'Поэтому я вижу игру с трёх сторон сразу: <b>как тестировщик</b> — где сломается, <b>как дизайнер</b> — где непонятно, <b>как продакт</b> — где это ударит по метрикам. И с каждым в вашей команде говорю на его языке — от геймдизайнера до CEO.',
        'А чтобы не терять хватку, делаю свою игру на Roblox — <a href="https://www.roblox.com/games/138774538553922/Escape-to-the-Party-Obby" target="_blank" rel="noopener"><b>Escape to the Party</b></a>. На ней проверяю на живых игроках всё, что советую клиентам.',
      ],
      aboutLoc: 'Москва, работаю удалённо с командами в любом часовом поясе. Русский — родной, английский — рабочий.',
      timeline: [
        { y: 'Дек 2025 — Сен 2026', co: 'ArtWorkout', role: 'Senior Product Manager · Москва (удалённо)', b: ['Формулировал и приоритизировал продуктовые гипотезы: конкурентный анализ, аналитика, RICE, A/B-тесты. Запустил Live Activity и Animated Paywall — <b>+30% к конверсии</b> и рост смежных драйверов LTV.', 'Провёл крупный редизайн геймификации и core-экономики через A/B; после плоского первого результата доработал гипотезу и перезапустил.', 'Выстроил кросс-командные процессы в Asana, роадмап и структуру сквадов; стандартизировал документацию фич, решений и экспериментов. Сертификат «Accelerating Innovation with A/B Testing», Dr. Ronny Kohavi.'] },
        { y: 'Авг 2022 — Дек 2025', co: 'Reaction Games', role: 'Game Producer · Москва (удалённо)', b: ['Руководил кросс-функциональной командой из <b>45 человек</b>: 10 в прямом подчинении, остальные — через лидов.', 'Довёл <b>Dead Impact</b> от прототипа до глобального мобильного запуска и выхода в плюс. Ретеншен: D1 <b>20%+ → 40%+</b>, D7 <b>5%+ → 15%+</b>, D30 <b>1%+ → 4%+</b>. Видение продукта, направление геймплея, роадмап.', 'Выстроил производственные процессы и performance review вместе с CEO и HR-директором. Проверил ранние гипотезы Days After (survival), прежде чем студия сосредоточилась на Dead Impact.'] },
        { y: 'Янв 2021 — Май 2022', co: 'Playrix', role: 'Game Producer · Россия (удалённо)', b: ['Работал в связке с лидами команд производственного юнита на <b>150 человек</b>.', 'Участвовал в глобальном LiveOps-роадмапе <b>Wildscapes</b>: core-геймплей, ретеншен, монетизация. Делал core-геймплей и системы прогресса для <b>Fishdom Solitaire</b>.', 'Вёл live-разработку F2P: core- и мета-фичи; проектировал и дорабатывал экономику и монетизацию; согласовывал приоритеты дизайна, аналитики и разработки.'] },
        { y: 'Дек 2017 — Дек 2020', co: 'Digital Pill', role: 'Game Producer · Москва', b: ['Координировал команду из <b>20 человек</b>: дизайн, арт, разработка, QA.', 'Довёл <b>Chaos Lords</b> (тактическая RPG / военная стратегия) от прототипа через софт-лонч до глобального запуска на iOS, Android и в Samsung Galaxy Store.', 'Спроектировал экономику и монетизацию. Поднимал KPI фичами, выбранными по данным аналитики.'] },
        { y: 'Июн 2016 — Дек 2017', co: 'Social Quantum', role: 'Game Designer · Москва', b: ['Довёл <b>Underwater Odyssey</b> от прототипа до успешного софт-лонча во ВКонтакте.', 'Создал около <b>600</b> готовых к продакшену уровней. Написал полную игровую документацию с нуля.', 'Собрал команду геймдизайнеров и руководил ею.'] },
        { y: 'Авг 2012 — Июн 2016', co: 'AST222', role: 'Lead QA → Game Designer → Producer · Россия', b: ['Выпустил несколько социальных и казуальных игр: Jewel Bay и Pirate Cat (OK.ru), Candy Dale и Bubble Chronicles (Facebook), Plyushk (ВКонтакте) — match-3, bubble shooter, social casino.', 'Построил с нуля QA-отдел и процесс тестирования: тест-стратегия, сменное тестирование, Jira и Trello.', 'Разрабатывал продуктовую стратегию вместе со стейкхолдерами.'] },
      ],
      edu: {
        blocks: [
          ['Образование', ['<b>Петрозаводский государственный университет (ПетрГУ)</b>, 2011 — специалист (5 лет), «Информационные системы и технологии».']],
          ['Сертификат', ['<b>Accelerating Innovation with A/B Testing</b> — Dr. Ronny Kohavi.']],
          ['Языки', ['<b>Русский</b> — родной', '<b>Английский</b> — Upper-Intermediate, рабочий уровень']],
        ],
        tagsTitle: 'Навыки',
        tags: ['Product Strategy', 'Product Discovery', 'Product Analytics', 'Experiment Design', 'A/B Testing', 'RICE', 'Roadmapping', 'Gamification', 'Game Economy Design', 'Monetization', 'LiveOps', 'Feature Design', 'Conversion Optimization', 'F2P Mobile', 'Stakeholder Management', 'People Management', 'Asana', 'Jira', 'Confluence', 'Unity'],
      },
      cvFacts: ['<b>Локация:</b> Москва, готов к релокации и удалёнке', '<b>Роли:</b> Senior Game Producer / Senior Product Manager', '<b>Языки:</b> RU — родной, EN — Upper-Intermediate', '<b>Образование:</b> ПетрГУ, 2011', '<b>Телефон:</b> <a href="tel:+79673215453">+7 967 321-54-53</a>', '<b>Почта:</b> <a href="mailto:kurusayd@gmail.com">kurusayd@gmail.com</a>'],
      ach: {
        first: ['Первый запуск', 'Вы открыли сайт. Первый шаг воронки пройден.', '🚀'],
        pain: ['Знакомая картина', 'Дочитали «Узнаёте свою игру?» до вывода.', '🪞'],
        leak: ['Узкое место найдено', 'Сыграли в «Где воронка сужается?».', '🔍'],
        sim: ['Свои цифры', 'Подвигали ползунки симулятора.', '🎚️'],
        game: ['Тестировщик', 'Мини-игра пройдена.', '🎮'],
        perfect: ['Глаз-алмаз', '5 из 5. Вы видите, где споткнётся игрок.', '💎'],
        boss: ['Босс не повержен', 'Досмотрели босс-файт: D1 ×2, D7 ×3, D30 ×4.', '⚔️'],
        price: ['Цена не спугнула', 'Самый узкий шаг любой воронки пройден.', '💰'],
        xray: ['Рентген', 'Включили режим «Рентген воронки».', '🩻'],
        faq: ['Собеседник', 'Открыли три вопроса.', '💬'],
        reader: ['Читатель', 'Открыли резюме.', '📜'],
        contact: ['Контакт', 'Нажали на Telegram. Дальше — моя работа.', '✉️'],
        secret: ['Секрет', 'Нашли пасхалку.', '🕹️'],
      },
      achLbl: 'Ачивка открыта',
      levels: { hero: 'Старт', pain: 'Симптомы', funnel: 'Воронка', game: 'Мини-игра', method: 'Метод', cases: 'Кейсы', offer: 'Цена', skills: 'Навыки', projects: 'Проекты', faq: 'Вопросы', about: 'Кто я', cv: 'Резюме', contact: 'Контакты' },
      tips: ['Совет: первая награда должна появиться раньше первого решения.', 'Совет: если туториал длиннее трёх минут — игрок уже читает, а не играет.', 'Совет: пейвол раньше первого «вау» режет конверсию. Пейвол сразу после обидного поражения — тоже.', 'Совет: игрок уходит из сессии без цели на завтра — и D1 уходит вместе с ним.', 'Совет: плоский A/B — это тоже результат. Его разбирают, а не прячут.', 'Совет: регистрацию просите после первой победы, а не до первой игры.'],
      xray: {
        hero: ['Первый экран', 'За 3 секунды объяснить, что я делаю и кому это нужно.', 'Общие слова («опытный продюсер») — посетитель уходит, не поняв, зачем ему это.', 'Обещание в одной фразе, цена сразу, пять проверяемых цифр.'],
        pain: ['Симптомы', 'Чтобы вы кивнули.', 'Список болей читается как давление.', 'Вывод снимает вину — «дело не в вашей команде».'],
        offer: ['Оффер', 'Назвать цену так, чтобы она не стала точкой выхода.', 'Самый узкий шаг любой воронки — первый пейвол.', 'Цена названа ещё на первом экране, здесь она уже не новость; рядом — что входит в час и пример результата.'],
        faq: ['Вопросы', 'Снять возражения до того, как они стали поводом закрыть вкладку.', 'Ответы звучат как оправдания.', 'Первые вопросы — про цену и «что если ничего не найдёте» — раскрыты сразу.'],
        contact: ['Контакты', 'Одно действие.', 'Форма с пятью полями.', 'Формы нет — ссылка в Telegram с уже написанным сообщением.'],
      },
      xrayLbls: { goal: 'Задача', risk: 'Риск', fix: 'Решение', foot: 'Так же я размечаю первую сессию вашей игры. Только шагов там часто 15–20, и каждый второй — лишний.' },
    },
    en: {
      strip: [
        ['14+ years', 'in mobile F2P', 'Since 2012: AST222 → Social Quantum → Digital Pill → Playrix → Reaction Games → ArtWorkout.'],
        ['D1 20%+ → 40%+', 'Dead Impact', 'Reaction Games, 2022–2025. Same game: D7 5%+ → 15%+, D30 1%+ → 4%+.'],
        ['+30%', 'conversion', 'ArtWorkout, 2025–2026. A/B experiments: Live Activity and Animated Paywall.'],
        ['7 genres', 'from match-3 to MMORPG', 'Match-3, bubble shooter, social casino, tactical RPG, solitaire, zombie MMORPG, survival. Plus a gamified app — ArtWorkout.'],
        ['2', 'global launches', 'Dead Impact (mobile) and Chaos Lords (iOS, Android, Samsung Galaxy Store) — from prototype to global launch.'],
      ],
      stats: [['Player-experience polish', 98], ['Funnel diagnostics', 96], ['A/B experiments', 94], ['Retention', 92], ['Team & process', 90], ['Economy & monetization', 88]],
      pain: [
        '<b>D1 is stuck under 30%</b>, and every new build moves it by ±1%.',
        'Say 70% finish the tutorial. 40% reach the first fight, level or match. 10% ever see the first paywall. <b>Nobody knows where the rest went.</b>',
        'A/B tests come back flat: <b>third experiment in a row with no significant difference</b>, and you’re running out of things to test.',
        'The team has spent a month arguing about what to fix first — meta, economy or onboarding. <b>Meanwhile the UA budget is buying players who won’t come back.</b>',
        'You can feel the game isn’t sticky, <b>but you can’t point to the exact screen.</b>',
      ],
      funnel: [
        { l: 'Install', n: 1000, rate: 100, t: 'Nobody has left yet. Everything below is about the first ten minutes and the first two days.' },
        { l: 'First launch', n: 900, rate: 90, t: 'Loading takes over five seconds; login and permission prompts before the first tap on the actual game.' },
        { l: 'Tutorial completed', n: 610, rate: 68, main: true, t: 'The tutorial tells instead of letting players try; it takes control away; it runs over three minutes — players read instead of playing.' },
        { l: 'First session completed', n: 520, rate: 85, t: 'The first loss comes before the rules are understood; after the tutorial there’s no obvious next thing to do; a reward is granted with nowhere to spend it.' },
        { l: 'Returned on D1', n: 290, rate: 56, main: true, t: 'Nothing left unfinished and no goal for tomorrow when the player quits; the push notification comes at the wrong time — or not at all.' },
        { l: 'First purchase', n: 29, rate: 10, pay: true, t: 'Paywall before the first “wow”; the offer’s value isn’t clear without reading the description; three currencies in the first ten minutes. The biggest drop is here — and that’s normal: in F2P, usually 2–5% of installs pay.' },
        { l: 'Second purchase', n: 14, rate: 48, t: 'The starter pack covered every need; progression pace didn’t change after the purchase; no contextual follow-up offer.' },
      ],
      funnelLbls: { breaks: 'What usually breaks', drop: 'drop', ofPrev: 'from the previous step',
        hit: '<b>Yes. That’s one of the two main leaks in a typical game.</b> In someone else’s game it’s obvious. In your own it isn’t — you know too well how to play it. That’s what the hour is for.',
        pay: '<b>The biggest drop is here — but that’s normal:</b> in F2P only a few percent ever pay. The main leak is higher up the funnel — the tutorial and the D1 return. Fix that and you’ll have more payers without touching the shop.',
        miss: '<b>Players are lost here too — but it’s not the main leak.</b> Look at the tutorial and the D1 return: a typical game loses a third to a half of the players who get there.',
        first: '<b>The first step is 100%.</b> The leak starts below — try again.' },
      checks: [
        ['The first 90 seconds', 'How many taps and screens stand between the player and the first “I won”.'],
        ['The “got it” moment', 'Where the player first makes a decision on their own, not by following a tutorial arrow.'],
        ['A reason to return', 'What is left unfinished when the player quits.'],
        ['The first paywall', 'When it appears, what’s inside, and whether it answers the player’s current pain.'],
        ['Friction', 'Loads, confirmations, extra screens, unclear icons — every place where a tap doesn’t deliver what was expected.'],
      ],
      sim: { lbl: '% who make it here from the previous step', typical: 'typical', out: 'Out of 1,000 installs: <b>{n}</b> payers, <b>{m}</b> repeat payers.', narrow: 'Narrowest point: <b>{s}</b>.', tail: 'The simulator says where. Why — and what to fix first — is the review.', ref: 'Reference: Dead Impact by the end of my work — D1 40%+. A reference point, not a promise.', payers: 'payers', repeat: 'repeat' },
      rounds: [
        { title: 'Tutorial', task: 'The first minute in the game. Where does a newcomer close the app?',
          ok: 'The wall of text. Players don’t read — they tap. Seven screens of explanation before the first action lose a noticeable share of newcomers. A tutorial should be the first winning move, not a lecture.',
          bad: 'Not here. The board and the title don’t scare the player — what they have to read before being allowed to play does.' },
        { title: 'First win', task: 'The player just beat level one. What pushes them away?',
          ok: 'A paywall before the first “I want this”. The player has no pain yet and no idea why they need coins. They close the window and remember one thing: the game asks for money. An offer must arrive at the moment of need.',
          bad: 'Not here. The victory and the stars are exactly right. The problem is what shows up right after them.' },
        { title: 'Main screen', task: 'Minute two. The player is in the menu. What’s wrong here?',
          ok: 'Nine icons and six red badges at minute two is not content, it’s noise. Meta systems should unlock one at a time — when the player has a question that system answers.',
          bad: 'Not here. The “Battle” button is the only thing the player understands right now. Look at what surrounds it.' },
        { title: 'Energy', task: 'Level three. What makes the player leave and not come back?',
          ok: 'A 30-minute timer on level three. The player hasn’t decided anything about the game yet — a limit works once they already want to continue. Here it’s not monetization, it’s the exit door.',
          bad: 'Not here. The level and the board are fine. Look for what stops the game.' },
        { title: 'Sign-up', task: 'Just installed. The very first screen. What kills conversion?',
          ok: 'Registration before any gameplay — the classic wall. Guest login plus an offer to save progress after the first win, and this step stops losing players.',
          bad: 'Not here. The button isn’t guilty — what the player has to fill in before seeing the game is.' },
      ],
      gameEnd: [
        ['Eagle eye: 5 of 5', 'You see friction like a producer. Now imagine the same for your game — with your metrics and concrete fixes.'],
        ['Good eye: {n} of 5', 'You would have missed a couple of spots — players won’t. These are exactly the spots I hunt for in a build within an hour.'],
        ['{n} of 5 — that’s normal', 'Friction is invisible from inside a project: you know where to tap. That’s why you need a first-time player’s eye.'],
      ],
      ui: { tut: 'How to play', next: 'Next (1/7)', win: 'Victory!', buy: 'Buy for $9.99', nothx: 'No, thanks', pack: 'Starter pack', packDesc: '1,000 coins + rare hero', battle: 'Battle', lvl1: 'Level 1', lvl3: 'Level 3', wait: 'Wait 29:59', buyE: 'Buy for 50 💎', noEnergy: 'Out of energy', reg: 'Create an account', email: 'Email', pass: 'Password', agree: '☐ I agree to the terms', signup: 'Sign up', google: 'or continue with Google', board: 'game board',
        tutText: ['Welcome! In this game you gather resources, build a base and fight other players. There are four types of resources…', 'Gold is for buildings, crystals for speed-ups, energy is spent on battles, and tokens on the arena…', 'To open the hero menu, tap the portrait. To upgrade a hero you need shards…', 'Tap “Next” to continue the tutorial.'],
        icons: ['Shop', 'Guild', 'Arena', 'Heroes', 'Events', 'Quests', 'Mail', 'Ranking', 'Bonus'],
        aria: { text: 'Tutorial text', title: 'Title', board: 'Game board', next: '“Next” button', win: 'Victory screen', pack: 'Starter pack window', grid: 'Menu icon grid', battle: '“Battle” button', energy: 'Energy bar', modal: '“Out of energy” window', form: 'Sign-up form', signup: 'Sign-up button' } },
      roundLbl: 'Screen', ok: 'Correct!', miss: 'Miss', found: 'Found',
      method: [
        ['I play the game as a new player, not as a producer.', 'With a timer: how many seconds until the first decision, how many until the first “why am I here”. I mark every screen where my thumb drifts toward the home button. I started out in QA — and the habit of spotting where things break for a real person never left.'],
        ['I line it up with the funnel.', 'If you have analytics, I take the tutorial, first-session and first-paywall steps and look for drops bigger than expected. If you don’t, I mark the five events to instrument first so the drops become visible within a week.'],
        ['I look for the gap between what the designer intended and what the player understood.', 'Wherever they don’t match, there’s a drop. Three typical causes: the goal is unclear, the reward isn’t felt, the next step isn’t obvious.'],
        ['I check the economy of the first 30 minutes.', 'Are there enough resources to feel progress? Does the player hit a wall before understanding what’s worth paying for? A paywall before the first “wow” or right after frustration — both cut conversion.'],
        ['I prioritize with RICE.', 'Not “redo everything”, but 5–10 changes that will move the metric — by step reach, depth of the drop and cost of the change.'],
        ['I phrase each change as an A/B hypothesis.', 'What we change, which metric we expect to move, what counts as success. A flat result is still a result: at ArtWorkout the first gamification and economy redesign showed no effect, and we reworked the hypothesis instead of declaring victory.'],
      ],
      loot: [
        ['The first 10 seconds.', 'Logo, loading, login prompt — and no gameplay yet.', 'How many taps until the first in-game action.'],
        ['The tutorial tells instead of letting you try.', 'Long hints; players read instead of playing.', 'How many steps are “do it yourself” vs. “read this”.'],
        ['First defeat before the rules are understood.', 'The player loses and decides the game is unfair.', 'Difficulty of the first five levels and the moment of the first failure.'],
        ['Emptiness after the tutorial.', '“So what do I do now?”', 'Whether there is one clear session goal on screen.'],
        ['The first reward isn’t felt.', 'A resource is granted with nowhere to spend it.', 'The distance from the first reward to the first meaningful choice.'],
        ['The economy wall.', 'Resources run out before the player understands the value of a purchase.', 'The balance of the first 30 minutes.'],
        ['Paywall at the wrong moment.', 'An offer before the first “wow” or right after frustration.', 'The context and timing of every paywall impression.'],
        ['Meta disconnected from core.', 'There’s progression, but you can’t feel it in gameplay.', 'What changes in how a fight or level feels after an upgrade.'],
        ['No reason to come back tomorrow.', 'D1 collapses even though the first session went fine.', 'Timers, daily goals, unfinished business at the moment of quitting.'],
        ['Difficulty spike.', 'The curve jumps at level 3–5 and takes half the cohort with it.', 'The win/loss curve by level.'],
        ['Interface overload.', 'Every meta screen unlocks at once; the player doesn’t know where to look.', 'The feature unlock schedule.'],
        ['Extra taps before a purchase.', 'Three confirmations between “I want it” and “I bought it”.', 'How many steps from offer to receipt.'],
      ],
      lootLbls: { sym: 'What I usually find', chk: 'Where I look' },
      skills: [
        { ic: 'eye', main: true, h: 'Polish: I see where players stumble', p: 'I play the game as a new player and tell you on which screen they get confused, bored or annoyed — before analytics shows it. Every review starts here.', proof: 'Dead Impact — D1 <b>20%+ → 40%+</b>, D7 <b>5%+ → 15%+</b>, D30 <b>1%+ → 4%+</b>. Foundation: Lead QA at AST222.' },
        { ic: 'funnel', h: 'The funnel to the first payment', p: 'I find the steps where a future payer is lost: the moment of the first paywall, the clarity of the offer, the number of taps to purchase. I tell you what to change and in what order.', proof: 'ArtWorkout: Live Activity and Animated Paywall — conversion <b>+30%</b> and better secondary LTV metrics. I designed Chaos Lords’ economy.' },
        { ic: 'flask', wide: true, cert: 'img/kohavi.jpg', certAlt: 'Certificate: Accelerating Innovation with A/B Testing, Ronny Kohavi, Maven', h: 'A/B tests and the metrics tree', p: 'I help build a metrics tree and define the OEC — the single metric decisions are made on. I review your dashboards and A/B process: how hypotheses are phrased, when a test is stopped, what counts as success. I help phrase a hypothesis so the test gives an answer, not a flat result.', proof: 'Certified in <b>Accelerating Innovation with A/B Testing</b> — the course by Dr. Ronny Kohavi, who ran experimentation at Amazon, Microsoft and Airbnb. I prioritize with RICE.' },
        { ic: 'coins', h: 'F2P economy and monetization', p: 'I review currency balance, progression pace, the price and timing of the first offer. I find where the economy starves players and where it gives away too much for free.', proof: 'Economy and monetization of <b>Chaos Lords</b> (three stores). Economy and monetization of live projects at Playrix. ArtWorkout core economy redesign.' },
        { ic: 'calendar', h: 'LiveOps that holds retention', p: 'I tell you which events, daily goals and offers bring players back and which just make noise. I plan LiveOps for D7 and D30, not for a one-week spike.', proof: 'Contributed to the global LiveOps roadmap for <b>Wildscapes</b> (Playrix, 150-person unit). Grew retention and revenue through analytics-driven LiveOps.' },
        { ic: 'rocket', h: 'From prototype to global launch', p: 'I know what breaks between soft launch and global, and which metrics must be green before you spend UA budget. I help decide: keep polishing, pivot, or move on.', proof: '<b>Dead Impact</b> — prototype → global launch → break-even. <b>Chaos Lords</b> — prototype → soft launch → global. <b>Underwater Odyssey</b> — prototype → soft launch.' },
        { ic: 'layers', extra: true, h: 'Levels and content that don’t get old', p: 'I understand difficulty curves, level pacing and the moment content starts repeating. I tell you where players will get bored and where they need a surprise.', proof: 'About <b>600</b> production-ready levels for Underwater Odyssey. Full GDD from scratch. Match-3 and bubble shooter titles at AST222.' },
        { ic: 'users', extra: true, h: 'Processes that speed teams up', p: 'I see where a team loses weeks: no decision owner, no experiment documentation, arguing instead of testing. I give a structure that works for five people and for forty-five.', proof: 'A <b>45</b>-person team at Reaction Games, processes built with the CEO and HR Director. Asana processes and a documentation standard at ArtWorkout. A QA department from scratch at AST222.' },
        { ic: 'gamepad', extra: true, h: 'I build my own game', p: 'To keep my advice grounded in practice, I run my own Roblox project: game design, economy, monetization, updates. It’s where I test onboarding and first-session ideas on live players.', proof: '<b>Escape to the Party</b> — a Roblox obby, 2026. Twelve floors of obstacles, chests, power-ups and an in-game shop.' },
      ],
      bosses: [
        { who: 'Boss 1', h: 'Day one (D1)', sub: 'Share of players who open the game the next day', was: 20, now: 40, stamp: 'RETENTION ×2', dmg: '−20 pp churn', how: 'The first minutes — remove steps without a reward, give the first win before the first choice, cut everything the player doesn’t need until tomorrow.' },
        { who: 'Boss 2', h: 'The week (D7)', sub: 'Share of players who return after a week', was: 5, now: 15, stamp: 'RETENTION ×3', dmg: '−10 pp churn', how: 'A reason to return — visible progression and a goal that’s clear the moment the session ends.' },
        { who: 'Boss 3', h: 'The habit (D30)', sub: 'Share of players still around after a month', was: 1, now: 4, stamp: 'RETENTION ×4', dmg: '−3 pp churn', how: 'Economy and LiveOps — content and events worth sticking around for, not just finishing the game.' },
        { who: 'Bonus boss', h: 'Conversion', sub: 'ArtWorkout: conversion growth through A/B experiments, 2025–2026', was: 0, now: 30, bonus: true, stamp: '+30%', dmg: '+30%', how: 'A/B tests instead of arguments — Live Activity, Animated Paywall. A flat first result on the gamification redesign is a reason to rework the hypothesis, not to bury the idea.' },
      ],
      bossLbls: { was: 'before', now: 'after', scale50: '50%', conv: 'conversion' },
      inside: [
        ['A 60-minute call', 'Telegram, Google Meet or Zoom — whatever works for you. In English or Russian.'],
        ['I play the game beforehand', 'Before the call I play your game myself for 20–30 minutes as a new player.'],
        ['Your funnel across 7 steps and 12 places', 'On the call — where you lose more than you should, and why. Plus your questions: economy, LiveOps, A/B, team processes.'],
        ['Analytics & A/B process audit', 'Metrics tree and OEC, dashboards, the experiment process — if that’s your pain, we spend the call on it.'],
        ['Top 3 fixes right away, the full list within a day', 'The main ones you hear on the call. A written list of 5–10 prioritized fixes lands in the same chat.'],
      ],
      send: ['A store link, a build (TestFlight / APK) or a prototype — GDD, Figma, gameplay video. I review a prototype the same way as a build.', 'If you have them — 3–5 funnel metrics: installs → tutorial → first match → D1 → first purchase.', 'If you have it — a screen recording of a new player’s first session.', 'One sentence: what hurts.', 'Need an NDA — send your template before the build.'],
      sample: [
        ['P0', 'Tutorial, screen 3.', 'The player doesn’t know what to tap. Remove the text, highlight the button, let them fire a shot within two seconds.', 'Before the next build'],
        ['P0', 'First reward.', '50 coins, shop locked until level 5. Unlock one item for 50 coins right after the first fight.', 'Before the next build'],
        ['P1', 'First paywall.', 'At minute 7, before the first win. Move it after the first win, show it in the context of a reward.', 'Next sprint'],
        ['P1', 'End of the first session.', 'Nothing left unfinished. Give a timer or a goal for tomorrow before the player quits.', 'Next sprint'],
        ['P2', 'Main menu.', 'Seven tabs on the first visit. Unlock them one at a time from level 3.', 'After P0–P1 are verified on metrics'],
        ['—', 'Don’t touch: meta progression.', 'Until the tutorial is fixed, most players never see it.', ''],
      ],
      howto: [['Message me on Telegram', 'Game name, store link or build, one sentence about what hurts.'], ['We agree on a slot', 'I play the game beforehand. You don’t prepare anything — just bring your metrics, if you have them.'], ['A 60-minute call', 'Top 3 fixes on the call. The full prioritized list in your chat within a day.']],
      priceMeta: ['Online, 60 minutes', 'RU / EN', 'Happy to sign your NDA', 'I reply personally, within an hour'],
      quiz: {
        q: [
          ['Your D1?', ['under 25%', '25–35%', '35–45%', 'over 45%', 'don’t know']],
          ['How many finish the tutorial?', ['under 50%', '50–75%', 'over 75%', 'don’t know']],
          ['When does the player see the first paywall?', ['in the first session', 'on D1–D2', 'later', 'no paywall']],
          ['Team size?', ['1–5', '6–15', '16–40', '40+']],
          ['What have you tried?', ['A/B tests', 'onboarding redesign', 'push notifications', 'nothing']],
        ],
        zones: {
          nometrics: ['No metrics', 'Judging by your answers, there are no metrics yet — and that’s fine. First I’d play the first ten minutes of your game as a new player and name the five events to instrument first. Within a week the drops become visible — and there’s something to fix.'],
          tutorial: ['Tutorial', 'Based on your answers, I’d look at the tutorial first. When fewer than half finish it, everything further down the funnel is seen by too few players to be worth fixing yet.'],
          session: ['First session & return', 'Based on your answers, I’d look at the first session and the moment it ends. Players finish the tutorial but don’t come back tomorrow — so they never found a reason to come back.'],
          paywall: ['First paywall', 'Based on your answers, I’d look at the first paywall. It’s either before the first “wow” or missing entirely — and both cost you money.'],
          meta: ['Meta & D7', 'Based on your answers, I’d look at the meta and the progression between D1 and D7. The first days are fine — so the leak is further down.'],
        },
        prog: 'Question {i} of {n}',
        tg: 'Hi! I’d like the $60 game review. Game: ___ (link). What hurts: ___. Quiz: D1 {0}, tutorial {1}, paywall {2}, team {3}, tried {4}.',
      },
      tgDefault: 'Hi! I’d like the $60 game review. Game: ___ (store link or build). What hurts: ___.',
      mailSubject: 'Game review — $60',
      filters: [['all', 'All'], ['shooter', 'MMORPG & survival'], ['rpg', 'RPG'], ['casual', 'Match-3 & casual'], ['social', 'Social 2012–2016'], ['app', 'Not games'], ['pet', 'My own game']],
      projects: {
        rb: { genre: 'Obby · my own game', plat: 'PC, mobile, console', role: 'author', lbl: 'Building it from idea to updates', p: 'An escape to the rooftop party: twelve floors of bowling balls, lasers and tsunamis, plus coins, chests, power-ups and a shop. It’s where I test on live players what I recommend to clients.', res: 'In active development: new floors on the way' },
        di: { genre: 'Mobile zombie MMORPG', plat: 'Mobile', role: 'Game Producer', lbl: 'Led from prototype to global launch', p: 'A 45-person team, 10 direct reports. Vision, gameplay direction, roadmap.', res: 'D1 <b>20%+ → 40%+</b> · D7 <b>5%+ → 15%+</b> · D30 <b>1%+ → 4%+</b>. Break-even.' },
        da: { genre: 'Survival', plat: 'Mobile', role: 'Game Producer', lbl: 'Validated hypotheses', p: 'Validated early-stage product hypotheses before the studio focused on Dead Impact.', res: null },
        ws: { genre: 'Match-3 with meta', plat: 'App Store', role: 'Game Producer', lbl: 'Contributed to the LiveOps roadmap', p: 'Contributed to the global LiveOps roadmap — core gameplay, retention, monetization. Worked with leads across a 150-person unit.', res: 'Retention and revenue growth through analytics-driven LiveOps' },
        fs: { genre: 'Solitaire', plat: 'App Store', role: 'Game Producer', lbl: 'Built core gameplay & progression', p: 'Core gameplay and progression systems in live F2P development.', res: null },
        cl: { genre: 'Tactical RPG', plat: 'iOS · Android · Samsung Galaxy Store', role: 'Game Producer', lbl: 'Led from prototype to global launch', p: 'Prototype → soft launch → global launch on three stores. A 20-person team.', res: 'I designed the economy and monetization' },
        uo: { genre: 'Casual · match-3', plat: 'VK', role: 'Game Designer', lbl: 'Built it hands-on', p: 'Prototype → successful soft launch. GDD from scratch, hired and managed game designers.', res: 'About <b>600</b> production-ready levels' },
        aw: { genre: 'Learn-to-draw · gamification', plat: 'Mobile', role: 'Senior Product Manager', lbl: 'Led product & experiments', p: 'Hypotheses via RICE and A/B tests. Gamification and core economy redesign. Asana processes, roadmap, squads.', res: 'Conversion <b>+30%</b>: Live Activity, Animated Paywall' },
        ast: { genre: 'Match-3 · bubble · casino', plat: 'OK.ru · Facebook · VK', role: 'Lead QA → Game Designer → Producer', lbl: 'Shipped', p: 'Social and casual games. In parallel, built the QA department and testing pipeline from scratch: test strategy, Jira/Trello.', res: null },
      },
      faq: [
        ['“$60 is suspiciously cheap. What’s the catch?”', 'No catch — just math. This is the first hour: I want you to come back for a second one, or to bring me onto the project. A cheap entry is my way of showing the work instead of talking about it. The price goes up as the queue gets longer.'],
        ['“What if you find nothing in an hour?”', 'In 14 years I haven’t seen a game without a leak in the first ten minutes — but suppose so. Then you’ll hear it straight, and that’s an answer too: the problem isn’t the product, it’s traffic or market, and you don’t burn UA budget on redoing onboarding.'],
        ['“We have analytics, we already see everything”', 'Analytics shows where. I tell you why — and what to change first. And if you don’t have analytics — half the problems are visible without it; we’ll start measuring the other half: I’ll tell you which five events to instrument first.'],
        ['“We’re a different genre. Your experience won’t apply”', 'In 14 years I’ve worked on a zombie MMORPG, a tactical RPG, match-3, solitaire, a bubble shooter, social casino and a gamified drawing app. The funnel “install → tutorial → first match → first paywall → return” works the same almost everywhere. Genre changes the details, not the places where players stumble. Where I can’t help — PC premium, web3 — I’ll say so before you pay.'],
        ['“We’re still on a prototype. It’s too early”', 'Quite the opposite — it’s the cheapest moment to change anything. I review prototypes and design docs the same way I review builds. At Reaction Games I validated the early hypotheses for Days After before the studio focused on Dead Impact — and Dead Impact made it to global launch. An hour on a prototype saves months after soft launch.'],
        ['“We need an NDA”', 'Send your template — I’ll sign it before I see the build. Nothing from your game ends up in my case studies without your written consent.'],
        ['“Are you employed right now? Will you have time for us?”', 'I’m between full-time roles — I consult and take on projects a few weeks at a time, so there’s time for you. I reply personally, usually within an hour. Calls in English or Russian.'],
        ['“How and when do I pay?”', 'We agree in Telegram: whatever method works for you; I confirm the details in the chat before the call.'],
      ],
      about: [
        'In 2012 I got into game dev at AST222 — as Lead QA I hunted bugs in social match-3 games and built a testing department from scratch. There I grew into a game designer and then a producer. At Social Quantum I built about 600 levels for Underwater Odyssey — and learned that <b>players don’t see mechanics, they see a specific screen</b>.',
        'Then as a producer: I took Chaos Lords to three stores and Dead Impact to global launch with a 45-person team. At Playrix I saw how LiveOps works in a 150-person unit. At ArtWorkout — a gamified product, not a game — I lifted conversion by 30% with A/B experiments.',
        'That’s why I see a game from three sides at once: <b>as a tester</b> — where it breaks; <b>as a designer</b> — where it’s confusing; <b>as a product manager</b> — where it hurts the numbers. And I speak to everyone on your team in their own language, from the game designer to the CEO.',
        'And to stay hands-on, I’m building my own Roblox game — <a href="https://www.roblox.com/games/138774538553922/Escape-to-the-Party-Obby" target="_blank" rel="noopener"><b>Escape to the Party</b></a>. It’s where I test on live players everything I recommend to clients.',
      ],
      aboutLoc: 'Based in Moscow, working remotely with teams in any time zone. Russian — native; English — professional working proficiency.',
      timeline: [
        { y: 'Dec 2025 — Sep 2026', co: 'ArtWorkout', role: 'Senior Product Manager · Moscow (remote)', b: ['Generated and prioritized product hypotheses: competitive research, analytics, RICE, A/B testing. Launched Live Activity and Animated Paywall — <b>+30% conversion</b> and improved secondary LTV drivers.', 'Led a major gamification and core economy redesign through A/B testing; iterated after a flat initial result.', 'Established cross-team processes in Asana, built the roadmap and squad structure; standardized documentation for features, decisions and experiments. Certified in Accelerating Innovation with A/B Testing by Dr. Ronny Kohavi.'] },
        { y: 'Aug 2022 — Dec 2025', co: 'Reaction Games', role: 'Game Producer · Moscow (remote)', b: ['Led a <b>45-person</b> cross-functional team: 10 direct reports, the rest through leads.', 'Led <b>Dead Impact</b> from prototype to global mobile launch and break-even. Retention: D1 <b>20%+ → 40%+</b>, D7 <b>5%+ → 15%+</b>, D30 <b>1%+ → 4%+</b>. Product vision, gameplay direction, roadmap.', 'Built production processes and performance reviews with the CEO and HR Director. Validated early-stage hypotheses for Days After (survival) before the studio focused on Dead Impact.'] },
        { y: 'Jan 2021 — May 2022', co: 'Playrix', role: 'Game Producer · Russia (remote)', b: ['Collaborated with team leads across a <b>150-person</b> production unit.', 'Contributed to the global LiveOps roadmap for <b>Wildscapes</b>: core gameplay, retention, monetization. Developed core gameplay and progression systems for <b>Fishdom Solitaire</b>.', 'Managed live F2P development across core and meta features; designed and iterated economy and monetization systems; aligned design, analytics and engineering priorities.'] },
        { y: 'Dec 2017 — Dec 2020', co: 'Digital Pill', role: 'Game Producer · Moscow', b: ['Coordinated a <b>20-person</b> cross-functional team across design, art, engineering and QA.', 'Led <b>Chaos Lords</b> (tactical RPG / war strategy) from prototype through soft launch to global launch on iOS, Android and Samsung Galaxy Store.', 'Designed the game economy and monetization systems. Improved KPIs with features chosen from analytics data.'] },
        { y: 'Jun 2016 — Dec 2017', co: 'Social Quantum', role: 'Game Designer · Moscow', b: ['Took <b>Underwater Odyssey</b> from prototype to a successful soft launch on VK.', 'Created approximately <b>600</b> production-ready levels. Wrote complete game design documentation from scratch.', 'Recruited and managed game designers.'] },
        { y: 'Aug 2012 — Jun 2016', co: 'AST222', role: 'Lead QA → Game Designer → Producer · Russia', b: ['Released multiple social and casual titles: Jewel Bay and Pirate Cat (OK.ru), Candy Dale and Bubble Chronicles (Facebook), Plyushk (VK) — match-3, bubble shooter, social casino.', 'Built the QA department and testing pipeline from scratch: test strategy, shift-based testing, Jira/Trello.', 'Developed product strategy with stakeholders.'] },
      ],
      edu: {
        blocks: [
          ['Education', ['<b>Petrozavodsk State University (PetrSU)</b>, 2011 — Specialist degree (5-year), Information Systems & Technologies.']],
          ['Certification', ['<b>Accelerating Innovation with A/B Testing</b> — Dr. Ronny Kohavi.']],
          ['Languages', ['<b>Russian</b> — native', '<b>English</b> — Upper-Intermediate, professional working proficiency']],
        ],
        tagsTitle: 'Skills',
        tags: ['Product Strategy', 'Product Discovery', 'Product Analytics', 'Experiment Design', 'A/B Testing', 'RICE', 'Roadmapping', 'Gamification', 'Game Economy Design', 'Monetization', 'LiveOps', 'Feature Design', 'Conversion Optimization', 'F2P Mobile', 'Stakeholder Management', 'People Management', 'Asana', 'Jira', 'Confluence', 'Unity'],
      },
      cvFacts: ['<b>Location:</b> Moscow, open to relocation and remote', '<b>Roles:</b> Senior Game Producer / Senior Product Manager', '<b>Languages:</b> RU — native, EN — Upper-Intermediate', '<b>Education:</b> PetrSU, 2011', '<b>Phone:</b> <a href="tel:+79673215453">+7 967 321-54-53</a>', '<b>Email:</b> <a href="mailto:kurusayd@gmail.com">kurusayd@gmail.com</a>'],
      ach: {
        first: ['First Launch', 'You opened the site. Step one of the funnel done.', '🚀'],
        pain: ['Sounds Familiar', 'You read “Does this sound like your game?” to the end.', '🪞'],
        leak: ['Leak Found', 'You played “Where does the funnel leak?”.', '🔍'],
        sim: ['Your Numbers', 'You moved the simulator sliders.', '🎚️'],
        game: ['Tester', 'Mini-game completed.', '🎮'],
        perfect: ['Eagle Eye', '5 of 5. You see friction.', '💎'],
        boss: ['Boss Not Defeated', 'You watched the boss fight to the end: D1 ×2, D7 ×3, D30 ×4.', '⚔️'],
        price: ['Saw the Price and Stayed', 'The narrowest step of any funnel.', '💰'],
        xray: ['X-ray', 'You switched on the Funnel X-ray.', '🩻'],
        faq: ['Good Talk', 'You opened three questions.', '💬'],
        reader: ['The Reader', 'You opened the résumé.', '📜'],
        contact: ['Contact', 'You tapped Telegram. The rest is my job.', '✉️'],
        secret: ['Secret', 'You found the easter egg.', '🕹️'],
      },
      achLbl: 'Achievement unlocked',
      levels: { hero: 'Start', pain: 'Symptoms', funnel: 'Funnel', game: 'Mini-game', method: 'Method', cases: 'Cases', offer: 'Price', skills: 'Skills', projects: 'Projects', faq: 'Questions', about: 'Who I am', cv: 'Resume', contact: 'Contacts' },
      tips: ['Tip: the first reward should come before the first decision.', 'Tip: if the tutorial runs over three minutes, the player is reading, not playing.', 'Tip: a paywall before the first “wow” cuts conversion. A paywall right after frustration does too.', 'Tip: a player who quits without a goal for tomorrow takes your D1 with them.', 'Tip: a flat A/B test is a result. You analyze it, you don’t hide it.', 'Tip: you can’t see the holes from inside your own game. From the outside, they show up in an hour.'],
      xray: {
        hero: ['Hero', 'In 3 seconds, say what I do and who needs it.', 'Generic words (“experienced producer”) — the visitor leaves without seeing the value.', 'A one-sentence promise, the price up front, five verifiable numbers.'],
        pain: ['Symptoms', 'Make you nod.', 'A list of pains reads as pressure.', 'The takeaway removes the blame — “it isn’t your team’s fault”.'],
        offer: ['Offer', 'Name the price without making it an exit point.', 'The narrowest step of any funnel is the first paywall.', 'The price was already named in the hero, so here it’s no surprise; next to it — exactly what’s inside the hour and a sample result.'],
        faq: ['Questions', 'Remove objections before they become a reason to close the tab.', 'Answers sound like excuses.', 'The first questions — about price and “what if you find nothing” — are open by default.'],
        contact: ['Contacts', 'One action.', 'A five-field form.', 'No form — a Telegram link with the message already written.'],
      },
      xrayLbls: { goal: 'Goal', risk: 'Risk', fix: 'How I handle it', foot: 'This is how I mark up the first session of your game. Except there it’s often 15–20 steps, and every other one is dead weight.' },
    },
  };

  const ICONS = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    funnel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6"/><path d="M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3"/><path d="M7 15h10"/></svg>',
    coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.4 18"/><path d="M7 6h1v4"/><path d="m16.7 13.7.4 1"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8-.8-.7-2-.7-3 0Z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.9 12.9 0 0 1 22 2c0 2.7-.9 7.4-6 11a22 22 0 0 1-4 2Z"/><path d="M9 12H4s.5-3 2-4 4 0 4 0"/><path d="M12 15v5s3-.5 4-2 0-4 0-4"/></svg>',
    gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 11h4M8 9v4"/><path d="M15 12h.01M18 10h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-3.96 3.4l-.9 6.3A2.5 2.5 0 0 0 6.2 16.9L9 14h6l2.8 2.9a2.5 2.5 0 0 0 4.36-2.2l-.9-6.3A4 4 0 0 0 17.3 5Z"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>',
  };

  /* ------------------------------------------------------------
     State
  ------------------------------------------------------------ */
  let lang = 'ru';
  (function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ru' || q === 'en') { lang = q; return; }
    const saved = store.get('lang', null);
    if (saved === 'ru' || saved === 'en') { lang = saved; return; }
    if (!/^ru/i.test(navigator.language || '')) lang = 'en';
  })();
  const T = () => I18N[lang];
  const D = () => DATA[lang];

  const game = { round: 0, results: [], picked: [], locked: false, done: false };
  const fun = { revealed: false, picked: -1, simOpen: false, rates: null, simTouched: false };
  const quiz = { open: false, i: 0, a: [], done: false, zone: null };
  const unlocked = new Set(store.get('ach', []));
  const ACH_TOTAL = Object.keys(DATA.ru.ach).length;
  let bossesSeen = false, lootOpen = false, skillsOpen = false, faqOpened = new Set(), filter = 'all';
  let maxLevel = 1;

  /* ------------------------------------------------------------
     i18n
  ------------------------------------------------------------ */
  function tgLink(text) { return 'https://t.me/' + TG_USER + '?text=' + encodeURIComponent(text); }
  function applyStatic() {
    const t = T();
    $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (t[k] != null) el.textContent = t[k]; });
    $$('[data-i18n-html]').forEach(el => { const k = el.dataset.i18nHtml; if (t[k] != null) el.innerHTML = t[k]; });
    $$('[data-i18n-content]').forEach(el => { const k = el.dataset.i18nContent; if (t[k] != null) el.setAttribute('content', t[k]); });
    $$('[data-i18n-alt]').forEach(el => { const k = el.dataset.i18nAlt; if (t[k] != null) el.alt = t[k]; });
    document.documentElement.lang = lang;
    document.title = t['meta.title'];
    $$('.lang button').forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    $$('[data-tg]').forEach(a => { a.href = tgLink(D().tgDefault); });
    $$('[data-mail]').forEach(a => { a.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(D().mailSubject); });
    const ac = $('#achCount'); if (ac) ac.textContent = unlocked.size;
    const at = $('#achTotal'); if (at) at.textContent = ACH_TOTAL;
    const st = $('#simToggle'); if (st) st.textContent = t[fun.simOpen ? 'funnel.simHide' : 'funnel.simBtn'];
    const ms = $('#moreSkills'); if (ms) ms.textContent = t[skillsOpen ? 'skills.less' : 'skills.more'];
    $$('.eyebrow .q').forEach((q, i) => { q.textContent = String(i + 1).padStart(2, '0'); });
    const ft = $('#footTip'); if (ft) { const tips = D().tips; ft.textContent = tips[tipIdx % tips.length]; }
    renderXray();
  }
  const tipIdx = Math.floor((Date.now() / 86400000)) % 6;

  /* ------------------------------------------------------------
     Hero
  ------------------------------------------------------------ */
  function renderHero() {
    const d = D();
    $('#strip').innerHTML = d.strip.map(([v, l, tip], i) => `<li><button type="button" aria-expanded="false" aria-describedby="tip${i}"><b>${v}</b> <span>${l}</span></button><div class="tip" id="tip${i}" role="tooltip">${tip}</div></li>`).join('');
    $('#stats').innerHTML = d.stats.map(([n, v]) => `<div class="stat"><span class="n">${n}</span><span class="v">${v}</span><span class="bar"><i data-v="${v}"></i></span></div>`).join('');
    animateStats();
  }
  function animateStats() {
    requestAnimationFrame(() => $$('#stats .bar i').forEach((b, i) => setTimeout(() => { b.style.width = b.dataset.v + '%'; }, RM ? 0 : 200 + i * 90)));
  }

  /* ------------------------------------------------------------
     Symptoms
  ------------------------------------------------------------ */
  function renderPain() {
    $('#painList').innerHTML = D().pain.map(x => `<li>${x}</li>`).join('');
  }

  /* ------------------------------------------------------------
     Funnel (guess + simulator)
  ------------------------------------------------------------ */
  function renderFunnel() {
    const d = D(); const steps = d.funnel; const L = d.funnelLbls;
    $('#steps').innerHTML = steps.map((s, i) => {
      const prev = i ? steps[i - 1].n : s.n;
      const drop = i ? Math.round((1 - s.n / prev) * 100) : 0;
      const cls = ['step', s.main ? 'main' : '', s.pay ? 'pay' : '', fun.picked === i ? 'picked' : ''].filter(Boolean).join(' ');
      const shown = fun.revealed || i === 0;
      return `<li class="${cls}" data-i="${i}">
        <span class="idx">${String(i + 1).padStart(2, '0')}</span>
        <button type="button" class="lbl btn-reset step-btn-main" aria-expanded="false" aria-controls="tip-f${i}">${s.l}</button>
        <span class="num">${i && shown ? `<span class="drop">−${drop}% ${L.drop}</span>` : ''}<b class="${shown ? '' : 'hid'}" data-n="${s.n}">${shown ? s.n : '?'}</b></span>
        <span class="bar" aria-hidden="true"><i style="width:${shown ? s.n / 10 : 0}%"></i></span>
        <div class="tip" id="tip-f${i}"><b>${L.breaks}:</b> ${s.t}</div>
      </li>`;
    }).join('');
    $('#steps').classList.toggle('revealed', fun.revealed);
    $('#checks').innerHTML = d.checks.map(([h, p], i) => `<li><span class="ic">${String(i + 1).padStart(2, '0')}</span><span><b>${h}</b>${p}</span></li>`).join('');
    $('#funnelCount').textContent = fun.revealed ? steps[steps.length - 1].n : '?';
    $('#guessHint').hidden = fun.revealed;
    if (fun.revealed && fun.picked >= 0) showReaction(fun.picked, true);
    renderSim();
  }
  function showReaction(i, instant) {
    const d = D(); const s = d.funnel[i]; const L = d.funnelLbls;
    const box = $('#react'); const img = $('#reactImg');
    let txt, cls, pic;
    if (i === 0) { txt = L.first; cls = ''; pic = 'calm'; }
    else if (s.main) { txt = L.hit; cls = 'hit'; pic = 'hero-smile'; }
    else if (s.pay) { txt = L.pay; cls = 'miss'; pic = 'shock2'; }
    else { txt = L.miss; cls = 'miss'; pic = 'shock2'; }
    box.className = 'react ' + cls;
    $('#reactTxt').innerHTML = txt;
    img.src = 'img/' + pic + '-800.jpg';
    if (!instant && window.innerWidth < 900) setTimeout(() => box.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'nearest' }), 150);
  }
  function revealFunnel(i) {
    if (i === 0) { showReaction(0, false); return; }
    fun.revealed = true; fun.picked = i;
    const steps = D().funnel;
    const rows = $$('#steps .step');
    rows.forEach((r, k) => {
      r.classList.toggle('picked', k === i);
      const b = r.querySelector('.num b'); b.classList.remove('hid');
      const prev = k ? steps[k - 1].n : steps[k].n; const drop = k ? Math.round((1 - steps[k].n / prev) * 100) : 0;
      if (k) { r.querySelector('.num').insertAdjacentHTML('afterbegin', `<span class="drop">−${drop}% ${D().funnelLbls.drop}</span>`); }
      setTimeout(() => { r.querySelector('.bar i').style.width = (steps[k].n / 10) + '%'; animateNumber(b, 0, steps[k].n, RM ? 0 : 700); }, RM ? 0 : k * 160);
    });
    $('#steps').classList.add('revealed');
    $('#guessHint').hidden = true;
    animateNumber($('#funnelCount'), 0, steps[steps.length - 1].n, RM ? 0 : 1400);
    showReaction(i, false);
    const tipBtn = rows[i].querySelector('.step-btn-main'); rows[i].classList.add('on'); tipBtn.setAttribute('aria-expanded', 'true');
    unlock('leak');
  }
  function onStepClick(e) {
    const li = e.target.closest('.step'); if (!li) return;
    const i = Number(li.dataset.i);
    if (!fun.revealed) { revealFunnel(i); return; }
    const on = li.classList.toggle('on');
    li.querySelector('.step-btn-main').setAttribute('aria-expanded', on);
  }
  function animateNumber(el, from, to, dur) {
    if (!el) return;
    if (!dur) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function renderSim() {
    const d = D(); const steps = d.funnel;
    if (!fun.rates) fun.rates = steps.map(s => s.rate);
    $('#sliders').innerHTML = steps.map((s, i) => i === 0 ? '' : `<div class="sl">
      <label for="sl${i}">${s.l}<small>${d.sim.lbl}</small></label>
      <span class="v"><span id="slv${i}">${fun.rates[i]}</span>% <small>· ${d.sim.typical} ${s.rate}%</small></span>
      <input type="range" id="sl${i}" min="1" max="100" step="1" value="${fun.rates[i]}" data-i="${i}" aria-valuetext="${fun.rates[i]}%">
      ${i === 4 ? `<span class="ref">${d.sim.ref}</span>` : ''}
    </div>`).join('');
    calcSim();
    $('#sim').hidden = !fun.simOpen;
    $('#simToggle').setAttribute('aria-expanded', fun.simOpen);
  }
  function calcSim() {
    const d = D(); const steps = d.funnel;
    const counts = [1000];
    for (let i = 1; i < steps.length; i++) counts[i] = Math.round(counts[i - 1] * fun.rates[i] / 100);
    const payers = counts[5], repeat = counts[6];
    let best = -1, bestGap = -Infinity;
    steps.forEach((s, i) => { if (i === 0 || s.pay) return; const gap = s.rate - fun.rates[i]; if (gap > bestGap) { bestGap = gap; best = i; } });
    if (bestGap <= 0) { best = fun.rates[2] <= fun.rates[4] ? 2 : 4; }
    $('#simRes').innerHTML = `<div class="big">${d.sim.out.replace('{n}', payers).replace('{m}', repeat)}</div>
      <div class="row">${steps.map((s, i) => i === 0 ? '' : `<span>${s.l}: <b>${counts[i]}</b></span>`).join('')}</div>
      <div class="narrow">${d.sim.narrow.replace('{s}', steps[best].l)} ${d.sim.tail}</div>`;
  }
  function onSlider(e) {
    const inp = e.target.closest('input[type=range]'); if (!inp) return;
    const i = Number(inp.dataset.i); fun.rates[i] = Number(inp.value);
    inp.setAttribute('aria-valuetext', inp.value + '%');
    $('#slv' + i).textContent = inp.value;
    calcSim();
    if (!fun.simTouched) { fun.simTouched = true; unlock('sim'); }
  }
  function toggleSim(force) {
    fun.simOpen = typeof force === 'boolean' ? force : !fun.simOpen;
    $('#sim').hidden = !fun.simOpen;
    $('#simToggle').setAttribute('aria-expanded', fun.simOpen);
    $('#simToggle').textContent = T()[fun.simOpen ? 'funnel.simHide' : 'funnel.simBtn'];
    if (fun.simOpen) setTimeout(() => $('#sim').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }), 60);
  }

  /* ------------------------------------------------------------
     Mini-game
  ------------------------------------------------------------ */
  function screenHTML(i) {
    const u = D().ui; const A = u.aria;
    const hot = (ok, cls, inner, label, extra = '') => `<div class="hot ${cls}" data-ok="${ok ? 1 : 0}" role="button" tabindex="0" aria-label="${label}" ${extra}>${inner}</div>`;
    switch (i) {
      case 0: return `
        <div class="ui-hud"><span>${u.tut}</span><span>1/7</span></div>
        ${hot(false, 'ui-title', u.tut, A.title)}
        ${hot(true, '', u.tutText.map(t => `<div class="ui-text">${t}</div>`).join('<div style="height:6px"></div>'), A.text, 'style="display:grid;gap:0"')}
        ${hot(false, 'ui-board', u.board + ' <span class="ui-arrow" aria-hidden="true" style="right:14px;top:8px">⬇</span>', A.board)}
        ${hot(false, 'ui-btn gray', u.next, A.next)}`;
      case 1: return `
        <div class="ui-hud"><span>${u.lvl1}</span><span>⭐ 3/3</span></div>
        ${hot(false, 'ui-victory', `<div class="ui-title">${u.win}</div><div class="ui-stars">★★★</div>`, A.win)}
        ${hot(false, 'ui-board', u.board, A.board)}
        ${hot(true, 'ui-modal', `<div class="ui-title">🎁 ${u.pack}</div><div class="ui-small" style="text-align:left">${u.packDesc}</div><div class="ui-btn gold">${u.buy}</div><div class="ui-small">${u.nothx}</div>`, A.pack)}`;
      case 2: return `
        <div class="ui-hud"><span>🪙 120</span><span>💎 5</span><span>⚡ 5/5</span></div>
        ${hot(true, 'ui-grid', u.icons.map((n, k) => `<div class="ui-icon">${['🛒', '🛡️', '🏟️', '🦸', '🎉', '📜', '✉️', '🏆', '🎁'][k]}${k % 3 !== 1 ? '<span class="bdg">!</span>' : ''}<span style="position:absolute;bottom:3px;font-size:9px;color:#9aa3b5">${n}</span></div>`).join(''), A.grid)}
        ${hot(false, 'ui-board', u.board, A.board)}
        ${hot(false, 'ui-btn', u.battle, A.battle)}`;
      case 3: return `
        <div class="ui-hud"><span>${u.lvl3}</span><span>🪙 340</span></div>
        ${hot(false, 'ui-energy', `⚡ <i style="--w:0%"></i> <span>0/5</span>`, A.energy)}
        ${hot(false, 'ui-board', u.board, A.board)}
        ${hot(true, 'ui-modal', `<div class="ui-title">⚡ ${u.noEnergy}</div><div class="ui-row"><div class="ui-btn gray">${u.wait}</div><div class="ui-btn gold">${u.buyE}</div></div>`, A.modal)}`;
      case 4: return `
        <div style="height:10px"></div>
        ${hot(false, 'ui-title', u.reg, A.title)}
        ${hot(true, '', `<div class="ui-field">${u.email}</div><div style="height:8px"></div><div class="ui-field">${u.pass}</div><div style="height:8px"></div><div class="ui-small" style="text-align:left">${u.agree}</div>`, A.form, 'style="display:block"')}
        ${hot(false, 'ui-btn', u.signup, A.signup)}
        <div class="ui-small">${u.google}</div>
        ${hot(false, 'ui-board', u.board, A.board)}`;
    }
    return '';
  }
  function renderRound() {
    const d = D(); const r = d.rounds[game.round];
    $('#roundLbl').textContent = `${d.roundLbl} ${game.round + 1} / ${d.rounds.length}`;
    $('#roundTitle').textContent = r.title;
    $('#roundTask').textContent = r.task;
    $('#screen').innerHTML = screenHTML(game.round);
    $('#screen').parentElement.classList.toggle('locked', game.results[game.round] !== undefined);
    const n = game.results.filter(Boolean).length;
    const sc = $('#score');
    sc.innerHTML = d.rounds.map((_, i) => `<i class="${game.results[i] === true ? 'hit' : game.results[i] === false ? 'miss' : ''}"></i>`).join('');
    sc.setAttribute('aria-label', `${d.found}: ${n} / ${d.rounds.length}`);
    const res = game.results[game.round];
    const fb = $('#feedback');
    if (res === undefined) { fb.classList.remove('show'); fb.classList.add('idle'); $('#fbTitle').textContent = ''; $('#fbText').textContent = T()['game.hint']; $('#nextRound').style.display = 'none'; game.locked = false; }
    else { fb.classList.remove('idle'); showFeedback(res, true); }
    $('#gameEnd').classList.toggle('show', game.done);
    if (game.done) renderEnd();
  }
  function showFeedback(ok, restore) {
    const d = D(); const r = d.rounds[game.round];
    const fb = $('#feedback');
    $('#fbTitle').className = 'ttl ' + (ok ? 'ok' : 'bad');
    $('#fbTitle').innerHTML = `<span aria-hidden="true">${ok ? '✅' : '❌'}</span> ${ok ? d.ok : d.miss} — ${r.title}`;
    $('#fbText').textContent = ok ? r.ok : r.bad + ' ' + r.ok;
    fb.classList.remove('idle'); fb.classList.add('show');
    $('#nextRound').style.display = game.round < d.rounds.length - 1 ? '' : 'none';
    const hots = $$('#screen .hot');
    hots.forEach(h => { h.setAttribute('aria-disabled', 'true'); if (h.dataset.ok === '1') h.classList.add('ok'); });
    if (!ok && game.picked[game.round] != null && hots[game.picked[game.round]]) hots[game.picked[game.round]].classList.add('bad');
    $('#screen').parentElement.classList.add('locked');
    if (!restore && window.innerWidth < 900) setTimeout(() => fb.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }), 250);
    game.locked = true;
  }
  function pickHot(hot, x, y) {
    if (!hot || game.locked) return;
    const ok = hot.dataset.ok === '1';
    game.results[game.round] = ok;
    game.picked[game.round] = $$('#screen .hot').indexOf(hot);
    if (ok) { burst(x, y, 8); }
    $$('#score i')[game.round].className = ok ? 'hit' : 'miss';
    showFeedback(ok, false);
    if (game.round === D().rounds.length - 1) finishGame();
  }
  function onHotClick(e) {
    const hot = e.target.closest('.hot');
    if (!hot) return;
    pickHot(hot, e.clientX, e.clientY);
  }
  function onHotKey(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const hot = e.target.closest('.hot'); if (!hot) return;
    e.preventDefault();
    const r = hot.getBoundingClientRect();
    pickHot(hot, r.left + r.width / 2, r.top + r.height / 2);
  }
  function finishGame() {
    game.done = true;
    $('#gameEnd').classList.add('show');
    renderEnd();
    unlock('game');
    if (game.results.filter(Boolean).length === 5) unlock('perfect');
  }
  function renderEnd() {
    const d = D(); const n = game.results.filter(Boolean).length;
    const [h, p] = n === 5 ? d.gameEnd[0] : n >= 3 ? d.gameEnd[1] : d.gameEnd[2];
    $('#endTitle').textContent = h.replace('{n}', n);
    $('#endText').textContent = p.replace('{n}', n);
  }
  function resetGame() { game.round = 0; game.results = []; game.picked = []; game.locked = false; game.done = false; renderRound(); }

  /* ------------------------------------------------------------
     Method & loot
  ------------------------------------------------------------ */
  function renderMethod() {
    const d = D();
    $('#methodSteps').innerHTML = d.method.map(([h, p], i) => `<li><i>${String(i + 1).padStart(2, '0')}</i><div><b>${h}</b><p>${p}</p></div></li>`).join('');
    $('#lootList').innerHTML = d.loot.map(([h, s, c], i) => `<li><i>${String(i + 1).padStart(2, '0')}</i><div><b>${h}</b>${d.lootLbls.chk}: ${c}<em>→ ${d.lootLbls.sym}: ${s}</em></div></li>`).join('');
    $('#loot').hidden = !lootOpen;
    $('#chest').setAttribute('aria-expanded', lootOpen);
  }
  function lootText() {
    const d = D();
    return d.loot.map(([h, s, c], i) => `${i + 1}. ${h} ${d.lootLbls.chk}: ${c} → ${d.lootLbls.sym}: ${s}`).join('\n') + '\n\n' + T()['loot.h3'] + ' — Aleksei Merzliakov, t.me/' + TG_USER;
  }
  async function copyText(text, btn, doneKey) {
    try { await navigator.clipboard.writeText(text); } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e2) { /* ignore */ } ta.remove();
    }
    const old = btn.textContent; btn.textContent = T()[doneKey]; setTimeout(() => { btn.textContent = old; }, 1800);
  }

  /* ------------------------------------------------------------
     Skills
  ------------------------------------------------------------ */
  function renderSkills() {
    $('#skillsGrid').innerHTML = D().skills.map(s => `<article class="skill${s.main ? ' main' : ''}${s.wide ? ' wide' : ''}${s.extra ? ' extra' : ''}" ${s.extra && !skillsOpen ? 'hidden' : ''}>
      <span class="rank" aria-hidden="true">${s.main ? 'S-RANK' : 'A-RANK'}</span>
      <div class="ic">${ICONS[s.ic]}</div>
      <h3>${s.h}</h3><p>${s.p}</p>
      <div class="proof">${s.proof}</div>
      ${s.cert ? `<img class="cert" src="${s.cert}" alt="${s.certAlt}" loading="lazy" decoding="async">` : ''}
    </article>`).join('');
    $('#moreSkills').setAttribute('aria-expanded', skillsOpen);
  }
  function toggleSkills() {
    skillsOpen = !skillsOpen;
    $$('#skillsGrid .skill.extra').forEach(el => { el.hidden = !skillsOpen; });
    $('#moreSkills').setAttribute('aria-expanded', skillsOpen);
    $('#moreSkills').textContent = T()[skillsOpen ? 'skills.less' : 'skills.more'];
  }

  /* ------------------------------------------------------------
     Bosses
  ------------------------------------------------------------ */
  function renderBosses() {
    const d = D();
    $('#bosses').innerHTML = d.bosses.map((b, i) => `<article class="boss rv rv-d${i % 4}${b.bonus ? ' bonus' : ''}" data-stamp="${b.stamp}">
      <div class="who">${b.who}</div>
      <h3>${b.h}</h3><p class="sub">${b.sub}</p>
      <div class="hp"><div class="lbls"><span>0%</span><span>${b.bonus ? '+50%' : d.bossLbls.scale50}</span></div>
        <div class="track" aria-hidden="true"><i class="was" data-w="${b.was * 2}"></i><i class="now" data-w="${b.now * 2}"></i>${b.bonus ? '' : `<i class="mark" data-l="${d.bossLbls.was} ${b.was}%+" data-w="${b.was * 2}"></i>`}</div></div>
      <div class="res"><span class="big">${b.bonus ? '+' : ''}${b.now}%${b.bonus ? '' : '+'}</span><span class="mult">${b.bonus ? d.bossLbls.conv : '×' + Math.round(b.now / b.was)}</span><span class="src">${b.bonus ? '' : d.bossLbls.was + ' ' + b.was + '%+ → ' + d.bossLbls.now + ' ' + b.now + '%+'}</span></div>
      <div class="how"><b>${lang === 'ru' ? 'Чем бьют:' : 'How you fight it:'}</b> ${b.how}</div>
      <span class="dmg" aria-hidden="true">${b.dmg}</span>
    </article>`).join('');
    if (bossesSeen) fireBosses(true);
  }
  function fireBosses(instant) {
    $$('#bosses .boss').forEach((card, i) => {
      const run = () => {
        card.querySelectorAll('.was, .now').forEach(el => { el.style.width = el.dataset.w + '%'; });
        const mk = card.querySelector('.mark'); if (mk) { mk.style.left = mk.dataset.w + '%'; mk.style.opacity = 1; if (Number(mk.dataset.w) < 15) mk.dataset.edge = 'l'; }
        const dmg = card.querySelector('.dmg'); if (dmg && !instant && !RM) setTimeout(() => dmg.classList.add('go'), 500);
        setTimeout(() => card.classList.add('defeated'), instant || RM ? 0 : 1500);
      };
      instant || RM ? run() : setTimeout(run, i * 250);
    });
  }

  /* ------------------------------------------------------------
     Projects
  ------------------------------------------------------------ */
  function renderProjects() {
    const d = D();
    $('#filters').innerHTML = d.filters.map(([k, l]) => `<button type="button" data-f="${k}" aria-pressed="${filter === k}">${l}</button>`).join('');
    $('#projectsGrid').innerHTML = PROJ_COMMON.map(p => {
      const x = d.projects[p.id];
      return `<article class="proj" data-genre="${p.g}" ${filter !== 'all' && filter !== p.g ? 'hidden' : ''}>
      <div class="cover${p.imgs ? ' has-img' : ''}" style="--c:${p.c}">${p.imgs ? `<div class="shots" aria-hidden="true">${p.imgs.map((s, i) => `<img src="${s}" alt="" width="800" height="450" loading="lazy" decoding="async" style="--i:${i}">`).join('')}</div>` : `<span class="em" aria-hidden="true">${p.em}</span>`}<span class="genre">${x.genre}</span><span class="yrs">${p.y}</span></div>
      <div class="body">
        <h3>${p.h}</h3>
        <div class="meta"><b>${p.co}</b> · ${x.role}</div>
        <span class="rolelbl">${x.lbl}</span>
        <span class="plat">${x.plat}</span>
        <p>${x.p}</p>
        ${x.res ? `<div class="res">${x.res}</div>` : ''}
        <div class="links">${p.links.map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${l} ${ICONS.ext}</a>`).join('')}</div>
      </div>
    </article>`; }).join('');
  }
  function setFilter(f) {
    filter = f;
    $$('#filters button').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === f));
    $$('#projectsGrid .proj').forEach(p => { p.hidden = f !== 'all' && p.dataset.genre !== f; });
  }

  /* ------------------------------------------------------------
     Offer + quiz
  ------------------------------------------------------------ */
  function renderOffer() {
    const d = D();
    $('#inside').innerHTML = d.inside.map(([h, p], i) => `<li><span class="ic">${String(i + 1).padStart(2, '0')}</span><span><b>${h}</b><span>${p}</span></span></li>`).join('');
    $('#sendList').innerHTML = d.send.map(x => `<li>${x}</li>`).join('');
    $('#sampleList').innerHTML = d.sample.map(([p, h, t, w]) => `<li><span class="p ${p === 'P0' ? 'p0' : p === 'P1' ? 'p1' : p === 'P2' ? 'p2' : 'px'}">${p}</span><span><b>${h}</b> ${t}</span>${w ? `<span class="when">→ ${w}</span>` : '<span></span>'}</li>`).join('');
    $('#howto').innerHTML = d.howto.map(([h, p], i) => `<li><i>${T()['offer.step']} ${i + 1}</i><b>${h}</b>${p}</li>`).join('');
    $('#priceMeta').innerHTML = d.priceMeta.map(x => `<li>${x}</li>`).join('');
    renderQuiz();
  }
  function renderQuiz() {
    const d = D().quiz;
    $('#quizBody').hidden = !quiz.open || quiz.done;
    $('#quizRes').hidden = !quiz.done;
    $('#quizStart').hidden = quiz.open;
    if (quiz.open && !quiz.done) {
      const [q, opts] = d.q[quiz.i];
      $('#quizProg').textContent = d.prog.replace('{i}', quiz.i + 1).replace('{n}', d.q.length);
      $('#quizQ').textContent = q;
      $('#quizOpts').innerHTML = opts.map((o, k) => `<button type="button" role="radio" aria-checked="${quiz.a[quiz.i] === k}" data-k="${k}">${o}</button>`).join('');
      $('#quizBack').disabled = quiz.i === 0;
    }
    if (quiz.done) {
      const z = d.zones[quiz.zone];
      $('#quizZone').textContent = z[0];
      $('#quizText').textContent = z[1];
      const ans = quiz.a.map((k, i) => d.q[i][1][k]);
      $('#quizCta').href = tgLink(d.tg.replace(/\{(\d)\}/g, (_, n) => ans[Number(n)]));
    }
  }
  function quizAnswer(k) {
    quiz.a[quiz.i] = k;
    if (quiz.i < D().quiz.q.length - 1) { quiz.i++; renderQuiz(); return; }
    const [q1, q2, q3] = quiz.a;
    // option indices: q1: 0 <25, 1 25–35, 2 35–45, 3 >45, 4 dunno; q2: 0 <50, 1 50–75, 2 >75, 3 dunno; q3: 0 first session, 1 D1–D2, 2 later, 3 none
    let zone;
    if (q1 === 4 && q2 === 3) zone = 'nometrics';
    else if (q2 === 0) zone = 'tutorial';
    else if (q1 === 0 || q1 === 1) zone = 'session';
    else if (q3 === 0 || q3 === 3) zone = 'paywall';
    else zone = 'meta';
    quiz.zone = zone; quiz.done = true; renderQuiz();
  }

  /* ------------------------------------------------------------
     FAQ, About, CV
  ------------------------------------------------------------ */
  function renderFAQ() {
    $('#faqList').innerHTML = D().faq.map(([q, a], i) => `<details data-i="${i}" ${i < 2 ? 'open' : ''}><summary>${q}</summary><div class="a">${a}</div></details>`).join('');
  }
  function renderAbout() {
    const d = D();
    $('#aboutTxt').innerHTML = d.about.map(p => `<p>${p}</p>`).join('') + `<p class="loc">${d.aboutLoc}</p>`;
  }
  function renderCV() {
    const d = D();
    $('#timeline').innerHTML = d.timeline.map(j => `<article class="job"><div class="yrs">${j.y}</div><h3>${j.co}</h3><div class="role">${j.role}</div><ul>${j.b.map(x => `<li>${x}</li>`).join('')}</ul></article>`).join('');
    $('#edu').innerHTML = d.edu.blocks.map(([h, items]) => `<div class="side-card"><h3 class="sc-h">${h}</h3><ul>${items.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('') +
      `<div class="side-card"><h3 class="sc-h">${d.edu.tagsTitle}</h3><ul class="tags">${d.edu.tags.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
    $('#cvFacts').innerHTML = d.cvFacts.map(x => `<li>${x}</li>`).join('');
  }

  /* ------------------------------------------------------------
     X-ray notes
  ------------------------------------------------------------ */
  function renderXray() {
    const d = D();
    $$('.xray-note').forEach(el => {
      const x = d.xray[el.dataset.xray]; if (!x) return;
      el.innerHTML = `<span class="xt">${d.xrayLbls.goal === 'Goal' ? 'X-ray' : 'Рентген'} · ${x[0]}</span><div class="xr"><span><b>${d.xrayLbls.goal}:</b> ${x[1]}</span><span><b>${d.xrayLbls.risk}:</b> ${x[2]}</span><span><b>${d.xrayLbls.fix}:</b> ${x[3]}</span></div><small>${d.xrayLbls.foot}</small>`;
    });
  }
  function setXray(on, silent) {
    document.documentElement.classList.toggle('xray', on);
    store.set('xray', on);
    const cb = $('#xrayToggle'); if (cb) cb.checked = on;
    if (on && !silent) unlock('xray');
  }

  /* ------------------------------------------------------------
     Achievements / toasts
  ------------------------------------------------------------ */
  const toastQueue = []; let toastBusy = false, offerVisible = false;
  function unlock(key) {
    if (unlocked.has(key)) return;
    unlocked.add(key); store.set('ach', Array.from(unlocked));
    const ac = $('#achCount'); if (ac) ac.textContent = unlocked.size;
    if (key === 'price' || RM) return;
    toastQueue.push(key); pumpToasts();
  }
  function pumpToasts() {
    if (toastBusy || !toastQueue.length) return;
    if (offerVisible) { setTimeout(pumpToasts, 1500); return; }
    toastBusy = true;
    const key = toastQueue.shift();
    const d = D(); const [t2, t3, ic] = d.ach[key];
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<div class="ic" aria-hidden="true">${ic}</div><div><div class="t1">${d.achLbl} · ${unlocked.size}/${ACH_TOTAL}</div><div class="t2">${t2}</div><div class="t3">${t3}</div></div>`;
    $('#toasts').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => { el.remove(); toastBusy = false; setTimeout(pumpToasts, 600); }, 450); }, 3200);
  }
  function burst(x, y, n = 12) {
    if (RM || !document.body.animate) return;
    for (let i = 0; i < n; i++) {
      const c = document.createElement('i'); c.className = 'coin';
      c.style.left = x + 'px'; c.style.top = y + 'px';
      document.body.appendChild(c);
      const a = (Math.PI * 2 * i) / n + Math.random() * .5, v = 60 + Math.random() * 90;
      const dx = Math.cos(a) * v, dy = Math.sin(a) * v - 60;
      c.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 80}px)) scale(.4)`, opacity: 0 }], { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => c.remove();
    }
  }

  /* ------------------------------------------------------------
     XP / levels / sticky
  ------------------------------------------------------------ */
  const SECTIONS = ['hero', 'pain', 'funnel', 'game', 'method', 'cases', 'offer', 'skills', 'projects', 'faq', 'about', 'cv', 'contact'];
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
    $('#xpBar').style.width = (p * 100) + '%';
    const mid = h.scrollTop + h.clientHeight * 0.5;
    let passed = 0;
    SECTIONS.forEach(id => { const s = document.getElementById(id); if (s && s.offsetTop <= mid) passed++; });
    const lvl = Math.min(14, Math.max(1, passed + (p > 0.985 ? 1 : 0)));
    const el = $('#lvlNum');
    if (lvl !== Number(el.textContent)) {
      el.textContent = lvl;
      const name = D().levels[SECTIONS[Math.min(passed, SECTIONS.length) - 1]] || '';
      $('#hudLvl').title = name;
      if (lvl > maxLevel) { maxLevel = lvl; if (!RM) $('#hudLvl').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 400 }); }
    }
    // sticky CTA (mobile)
    const sc = $('#stickyCta');
    const hero = $('#hero'); const contact = $('#contact'); const offer = $('#offer');
    const inOffer = offer && h.scrollTop + h.clientHeight > offer.offsetTop + 200 && h.scrollTop < offer.offsetTop + offer.offsetHeight - 200;
    const nearEnd = contact && h.scrollTop + h.clientHeight > contact.offsetTop + 100;
    const show = window.innerWidth <= 900 && hero && h.scrollTop > hero.offsetHeight * 0.8 && !nearEnd && !inOffer;
    sc.classList.toggle('show', show);
    document.body.classList.toggle('has-sticky', window.innerWidth <= 900);
    if (p > 0.985) unlock('reader');
  }

  /* ------------------------------------------------------------
     Konami + 7 taps
  ------------------------------------------------------------ */
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let kpos = 0, taps = 0, tapT = 0;
  function secret() {
    document.body.classList.toggle('god');
    unlock('secret');
    burst(window.innerWidth / 2, window.innerHeight / 2, 24);
    const egg = $('#egg'); egg.hidden = false; $('#eggClose').focus();
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#egg').hidden) { $('#egg').hidden = true; return; }
    const k = e.code || e.key;
    kpos = k === KONAMI[kpos] ? kpos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kpos === KONAMI.length) { kpos = 0; secret(); }
  });

  /* ------------------------------------------------------------
     Render all / language
  ------------------------------------------------------------ */
  function renderAll() {
    const safe = fn => { try { fn(); } catch (e) { console.error(e); } };
    safe(applyStatic); safe(renderHero); safe(renderPain); safe(renderFunnel); safe(renderMethod); safe(renderSkills); safe(renderBosses);
    safe(renderProjects); safe(renderOffer); safe(renderFAQ); safe(renderAbout); safe(renderCV); safe(renderRound);
    observeAll();
  }
  function setLang(l) { if (l === lang) return; lang = l; store.set('lang', l); renderAll(); onScroll(); }

  /* ------------------------------------------------------------
     Observers
  ------------------------------------------------------------ */
  let revealObs, navObs, bossObs, painObs, offerObs;
  function observeAll() {
    if (!('IntersectionObserver' in window)) { $$('.rv').forEach(el => el.classList.add('in')); bossesSeen = true; fireBosses(true); return; }
    if (revealObs) revealObs.disconnect();
    revealObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.rv:not(.in)').forEach(el => revealObs.observe(el));
    if (!bossObs) {
      bossObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !bossesSeen) { bossesSeen = true; fireBosses(false); setTimeout(() => unlock('boss'), RM ? 0 : 2400); bossObs.disconnect(); } }), { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
      const bz = $('#bosses'); if (bz) bossObs.observe(bz);
    }
    if (!painObs) {
      painObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { unlock('pain'); painObs.disconnect(); } }), { threshold: 0.6 });
      const pt = $('#painTake'); if (pt) painObs.observe(pt);
    }
    if (!offerObs) {
      offerObs = new IntersectionObserver(es => es.forEach(e => { offerVisible = e.isIntersecting; if (e.isIntersecting) unlock('price'); }), { threshold: 0.15 });
      const of = $('#offer'); if (of) offerObs.observe(of);
    }
  }
  function observeNav() {
    const links = $$('.nav a');
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    if (!('IntersectionObserver' in window)) return;
    navObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('active')); const a = map.get(e.target.id); if (a) a.classList.add('active'); } }), { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) navObs.observe(s); });
  }

  /* ------------------------------------------------------------
     Tilt + glow
  ------------------------------------------------------------ */
  function initTilt() {
    const card = $('#charCard'); if (!card || RM || matchMedia('(hover: none)').matches) return;
    const wrap = card.parentElement;
    wrap.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
    });
    wrap.addEventListener('mouseleave', () => { card.style.transform = ''; });
    $('#skillsGrid').addEventListener('mousemove', e => {
      const s = e.target.closest('.skill'); if (!s) return;
      const r = s.getBoundingClientRect();
      s.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      s.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }

  /* ------------------------------------------------------------
     Init
  ------------------------------------------------------------ */
  function init() {
    $('#year').textContent = new Date().getFullYear();
    setXray(!!store.get('xray', false), true);
    renderAll();
    observeNav();
    initTilt();
    setTimeout(() => unlock('first'), 900);

    $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    // burger
    const burger = $('#burger'); const hud = $('#hud');
    burger.addEventListener('click', () => { const open = hud.classList.toggle('open'); burger.setAttribute('aria-expanded', open); });
    $('#nav').addEventListener('click', () => { hud.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('click', e => { if (!e.target.closest('#hud')) { hud.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
    // strip tooltips
    $('#strip').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const li = b.parentElement; const open = !li.classList.contains('open'); $$('#strip li').forEach(x => { x.classList.remove('open'); x.querySelector('button').setAttribute('aria-expanded', 'false'); }); li.classList.toggle('open', open); b.setAttribute('aria-expanded', open); });
    document.addEventListener('click', e => { if (!e.target.closest('#strip')) $$('#strip li.open').forEach(x => { x.classList.remove('open'); x.querySelector('button').setAttribute('aria-expanded', 'false'); }); });
    // funnel
    $('#steps').addEventListener('click', onStepClick);
    $('#simToggle').addEventListener('click', () => toggleSim());
    $('#sliders').addEventListener('input', onSlider);
    // game
    $('#screen').addEventListener('click', onHotClick);
    $('#screen').addEventListener('keydown', onHotKey);
    $('#nextRound').addEventListener('click', () => { if (game.round < D().rounds.length - 1) { game.round++; renderRound(); if (window.innerWidth < 900) $('#phone').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); } });
    $('#replay').addEventListener('click', resetGame);
    // loot
    $('#chest').addEventListener('click', () => { lootOpen = !lootOpen; $('#loot').hidden = !lootOpen; $('#chest').setAttribute('aria-expanded', lootOpen); if (lootOpen) burst(window.innerWidth / 2, $('#chest').getBoundingClientRect().top + 40, 14); });
    $('#copyLoot').addEventListener('click', e => copyText(lootText(), e.currentTarget, 'loot.copied'));
    $('#copyTg').addEventListener('click', e => copyText('@' + TG_USER, e.currentTarget, 'offer.copied'));
    // skills
    $('#moreSkills').addEventListener('click', toggleSkills);
    // filters
    $('#filters').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setFilter(b.dataset.f); });
    // quiz
    $('#quizStart').addEventListener('click', () => { quiz.open = true; quiz.done = false; quiz.i = 0; quiz.a = []; renderQuiz(); });
    $('#quizOpts').addEventListener('click', e => { const b = e.target.closest('button'); if (b) quizAnswer(Number(b.dataset.k)); });
    $('#quizBack').addEventListener('click', () => { if (quiz.i > 0) { quiz.i--; renderQuiz(); } });
    $('#quizRetry').addEventListener('click', () => { quiz.done = false; quiz.i = 0; quiz.a = []; quiz.zone = null; renderQuiz(); });
    // faq
    $('#faqList').addEventListener('toggle', e => { const d = e.target; if (d.open) { faqOpened.add(d.dataset.i); if (faqOpened.size >= 3) unlock('faq'); } }, true);
    // cv tabs
    const tabs = $$('.tabs button');
    const selectTab = b => { tabs.forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; }); $$('.tabpane').forEach(p => p.classList.toggle('on', p.id === 'tab-' + b.dataset.tab)); unlock('reader'); };
    tabs.forEach(b => { b.addEventListener('click', () => selectTab(b)); b.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const i = tabs.indexOf(b); const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); selectTab(n); } }); });
    $('#printBtn').addEventListener('click', () => window.print());
    $('#plainToggle').addEventListener('change', e => { document.documentElement.classList.toggle('plain', e.target.checked); store.set('plain', e.target.checked); });
    if (store.get('plain', false)) { document.documentElement.classList.add('plain'); $('#plainToggle').checked = true; }
    // x-ray
    const xt = $('#xrayToggle'); if (xt) xt.addEventListener('change', e => setXray(e.target.checked, false));
    // egg
    $('#eggClose').addEventListener('click', () => { $('#egg').hidden = true; });
    $('#egg').addEventListener('click', e => { if (e.target === e.currentTarget) e.currentTarget.hidden = true; });
    $('#heroPhoto').addEventListener('click', () => { const now = Date.now(); if (now - tapT > 3000) taps = 0; tapT = now; taps++; if (taps >= 7) { taps = 0; secret(); } });
    // CTA coins + contact achievement
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-cta]'); if (!a) return;
      const r = a.getBoundingClientRect();
      const x = e.detail === 0 ? r.left + r.width / 2 : e.clientX; const y = e.detail === 0 ? r.top + r.height / 2 : e.clientY;
      burst(x, y, 10);
      if (a.href && /t\.me|mailto:/.test(a.href)) unlock('contact');
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    console.log('%c' + (lang === 'ru' ? 'Нашли консоль? Значит, вы тоже ищете, где споткнётся игрок. Пишите: ' : 'Found the console? Then you also look for where players stumble. Write me: ') + 'https://t.me/' + TG_USER, 'color:#f5d547;font-weight:bold');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
