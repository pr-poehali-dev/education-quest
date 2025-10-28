import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type GameState = 'start' | 'map' | 'question' | 'final';
type LocationStatus = 'locked' | 'available' | 'current' | 'completed';

interface Location {
  id: string;
  name: string;
  status: LocationStatus;
  x: number;
  y: number;
  connections: string[];
}

interface QuestionData {
  id: string;
  pedagogue: string;
  pedagogueImage: string;
  dialogue: string;
  question: string;
  answers: { text: string; next: string }[];
}

const QUESTIONS: Record<string, QuestionData> = {
  '1': {
    id: '1',
    pedagogue: 'Аристотель',
    pedagogueImage: '🏛️',
    dialogue: 'Здравствуй, дитя! Я вижу в тебе стремление к знаниям. Позволь мне испытать твою мудрость…',
    question: 'Какой метод обучения Аристотель считал наиболее эффективным?',
    answers: [
      { text: 'а) Заучивание наизусть', next: '2Б' },
      { text: 'б) Практические упражнения и опыты', next: '2А' },
      { text: 'в) Размышление и философские беседы', next: '2' }
    ]
  },
  '2': {
    id: '2',
    pedagogue: 'Ян Амос Коменский',
    pedagogueImage: '📚',
    dialogue: 'Рад приветствовать тебя, юная коллега! Готова ли ты обсудить принципы обучения?',
    question: 'Какова главная цель обучения, по мнению Коменского?',
    answers: [
      { text: 'a) Подготовка к конкретной профессии', next: '3А' },
      { text: 'б) Всестороннее развитие человека и подготовка к жизни', next: '3' },
      { text: 'в) Приобретение знаний для экзаменов', next: '3Б' }
    ]
  },
  '2А': {
    id: '2А',
    pedagogue: 'Ян Амос Коменский',
    pedagogueImage: '📚',
    dialogue: 'Рад приветствовать тебя, юная коллега! Готова ли ты обсудить принципы обучения?',
    question: 'Какой принцип обучения Коменский считал важнейшим?',
    answers: [
      { text: 'а) Принцип наглядности', next: '3А' },
      { text: 'б) Принцип дисциплины', next: '3Б' },
      { text: 'в) Принцип индивидуального подхода', next: '3В' }
    ]
  },
  '2Б': {
    id: '2Б',
    pedagogue: 'Ян Амос Коменский',
    pedagogueImage: '📚',
    dialogue: 'Рад приветствовать тебя, юная коллега! Готова ли ты обсудить принципы обучения?',
    question: 'Какое пособие для обучения создал Коменский?',
    answers: [
      { text: 'а) "Букварь"', next: '3А' },
      { text: 'б) "Великая дидактика"', next: '3В' },
      { text: 'в) "Мир чувственных вещей в картинках"', next: '3Б' }
    ]
  },
  '3': {
    id: '3',
    pedagogue: 'Иоганн Генрих Песталоцци',
    pedagogueImage: '🌱',
    dialogue: 'Добро пожаловать в мой мир, где детство – это радость и творчество! Готова ли ты познать мои принципы?',
    question: 'Какой принцип обучения Песталоцци считал основополагающим?',
    answers: [
      { text: 'a) Принцип природосообразности', next: '4' },
      { text: 'б) Принцип дисциплины и строгости', next: '4А' },
      { text: 'в) Принцип индивидуального подхода', next: '4Б' }
    ]
  },
  '3А': {
    id: '3А',
    pedagogue: 'Иоганн Генрих Песталоцци',
    pedagogueImage: '🌱',
    dialogue: 'Добро пожаловать в мой мир, где детство – это радость и творчество! Готова ли ты познать мои принципы?',
    question: 'Что такое "элементарное образование" по Песталоцци?',
    answers: [
      { text: 'а) Обучение чтению, письму и счету', next: '4В' },
      { text: 'б) Развитие основных способностей и чувств', next: '4А' },
      { text: 'в) Подготовка к престижной школе', next: '4Б' }
    ]
  },
  '3Б': {
    id: '3Б',
    pedagogue: 'Иоганн Генрих Песталоцци',
    pedagogueImage: '🌱',
    dialogue: 'Добро пожаловать в мой мир, где детство – это радость и творчество! Готова ли ты познать мои принципы?',
    question: 'Какова роль учителя в системе Песталоцци?',
    answers: [
      { text: 'а) Строгий контролер и наставник', next: '4В' },
      { text: 'б) Источник знаний', next: '4А' },
      { text: 'в) Друг и помощник', next: '4Б' }
    ]
  },
  '3В': {
    id: '3В',
    pedagogue: 'Иоганн Генрих Песталоцци',
    pedagogueImage: '🌱',
    dialogue: 'Добро пожаловать в мой мир, где детство – это радость и творчество! Готова ли ты познать мои принципы?',
    question: 'Какое значение Песталоцци придавал трудовому воспитанию?',
    answers: [
      { text: 'а) Важно для развития самостоятельности', next: '4В' },
      { text: 'б) Второстепенно по сравнению с умственным', next: '4Б' },
      { text: 'в) Средство подготовки к профессии', next: '4А' }
    ]
  },
  '4': {
    id: '4',
    pedagogue: 'Константин Ушинский',
    pedagogueImage: '📖',
    dialogue: 'Здравствуй, коллега! Готов ли ты обсудить основы народного образования и роль учителя?',
    question: 'Что Ушинский считал основой народного образования?',
    answers: [
      { text: 'a) Слепое следование традициям', next: '5Б' },
      { text: 'б) Приверженность религиозным догматам', next: '5А' },
      { text: 'в) Народность и связь с культурой', next: '5' }
    ]
  },
  '4А': {
    id: '4А',
    pedagogue: 'Константин Ушинский',
    pedagogueImage: '📖',
    dialogue: 'Здравствуй, коллега! Готов ли ты обсудить основы народного образования и роль учителя?',
    question: 'Какое значение Ушинский придавал родному языку?',
    answers: [
      { text: 'а) Один из многих предметов', next: '5Б' },
      { text: 'б) Ключ к пониманию мира и культуры', next: '5А' },
      { text: 'в) Средство общения в классе', next: '5В' }
    ]
  },
  '4Б': {
    id: '4Б',
    pedagogue: 'Константин Ушинский',
    pedagogueImage: '📖',
    dialogue: 'Здравствуй, коллега! Готов ли ты обсудить основы народного образования и роль учителя?',
    question: 'Какой метод подачи материала Ушинский считал оптимальным?',
    answers: [
      { text: 'a) Лекции и заучивание', next: '5В' },
      { text: 'б) Диалог и активное обсуждение', next: '5Б' },
      { text: 'в) Самостоятельная работа с учебником', next: '5А' }
    ]
  },
  '4В': {
    id: '4В',
    pedagogue: 'Константин Ушинский',
    pedagogueImage: '📖',
    dialogue: 'Здравствуй, коллега! Готов ли ты обсудить основы народного образования и роль учителя?',
    question: 'Что Ушинский считал главным в подготовке учителя?',
    answers: [
      { text: 'а) Глубокое знание предмета', next: '5А' },
      { text: 'б) Умение применять методики', next: '5Б' },
      { text: 'в) Любовь к детям', next: '5В' }
    ]
  },
  '5': {
    id: '5',
    pedagogue: 'Антон Макаренко',
    pedagogueImage: '⚙️',
    dialogue: 'Запомните главное. Только в коллективе и через коллектив можно воспитать настоящего человека!',
    question: 'Что является основой педагогической системы Макаренко?',
    answers: [
      { text: 'а) Индивидуальный подход к ученику', next: '6В' },
      { text: 'б) Воспитание в коллективе', next: '6' },
      { text: 'в) Строгое соблюдение дисциплины', next: '6Б' }
    ]
  },
  '5А': {
    id: '5А',
    pedagogue: 'Антон Макаренко',
    pedagogueImage: '⚙️',
    dialogue: 'Запомните главное. Только в коллективе и через коллектив можно воспитать настоящего человека!',
    question: 'Какую роль играет труд в воспитании по Макаренко?',
    answers: [
      { text: 'а) Подготовка к профессии', next: '6В' },
      { text: 'б) Занять свободное время', next: '6Б' },
      { text: 'в) Формирует ответственность', next: '6А' }
    ]
  },
  '5Б': {
    id: '5Б',
    pedagogue: 'Антон Макаренко',
    pedagogueImage: '⚙️',
    dialogue: 'Запомните главное. Только в коллективе и через коллектив можно воспитать настоящего человека!',
    question: 'Как Макаренко относился к игре в воспитании?',
    answers: [
      { text: 'а) Пустая трата времени', next: '6В' },
      { text: 'б) Важное средство социализации', next: '6Б' },
      { text: 'в) Только в свободное время', next: '6А' }
    ]
  },
  '5В': {
    id: '5В',
    pedagogue: 'Антон Макаренко',
    pedagogueImage: '⚙️',
    dialogue: 'Запомните главное. Только в коллективе и через коллектив можно воспитать настоящего человека!',
    question: 'Какое значение Макаренко придавал семейному воспитанию?',
    answers: [
      { text: 'а) Менее важно чем коллектив', next: '6А' },
      { text: 'б) Требует контроля государства', next: '6Б' },
      { text: 'в) Основа воспитательного процесса', next: '6В' }
    ]
  },
  '6': {
    id: '6',
    pedagogue: 'Лев Выготский',
    pedagogueImage: '🧠',
    dialogue: 'Обучение – это социальный процесс. Готовы ли вы изучить, как взаимодействие формирует сознание?',
    question: 'Что является основным фактором развития личности?',
    answers: [
      { text: 'а) Наследственность', next: '7Б' },
      { text: 'б) Социальное взаимодействие', next: '7' },
      { text: 'в) Индивидуальные усилия', next: '7А' }
    ]
  },
  '6А': {
    id: '6А',
    pedagogue: 'Лев Выготский',
    pedagogueImage: '🧠',
    dialogue: 'Обучение – это социальный процесс. Готовы ли вы изучить, как взаимодействие формирует сознание?',
    question: 'Что такое "зона ближайшего развития"?',
    answers: [
      { text: 'а) Область уже освоенных знаний', next: '7Б' },
      { text: 'б) Область с помощью взрослого', next: '7А' },
      { text: 'в) Область недоступных знаний', next: '7В' }
    ]
  },
  '6Б': {
    id: '6Б',
    pedagogue: 'Лев Выготский',
    pedagogueImage: '🧠',
    dialogue: 'Обучение – это социальный процесс. Готовы ли вы изучить, как взаимодействие формирует сознание?',
    question: 'Какую роль играет речь в развитии мышления?',
    answers: [
      { text: 'а) Речь отражает уровень мышления', next: '7А' },
      { text: 'б) Речь – инструмент мышления', next: '7Б' },
      { text: 'в) Речь мешает мышлению', next: '7В' }
    ]
  },
  '6В': {
    id: '6В',
    pedagogue: 'Лев Выготский',
    pedagogueImage: '🧠',
    dialogue: 'Обучение – это социальный процесс. Готовы ли вы изучить, как взаимодействие формирует сознание?',
    question: 'Как Выготский относился к обучению детей с особыми потребностями?',
    answers: [
      { text: 'а) Не способны к образованию', next: '7А' },
      { text: 'б) Нуждаются в специальной поддержке', next: '7В' },
      { text: 'в) Обучаться без изменений', next: '7Б' }
    ]
  },
  '7': {
    id: '7',
    pedagogue: 'Василий Сухомлинский',
    pedagogueImage: '💚',
    dialogue: 'Сердце отдаю детям! Готовы ли вы понять, почему ребенок – высшая ценность?',
    question: 'Что является главной целью воспитания?',
    answers: [
      { text: 'а) Подготовка к профессии', next: '8Б' },
      { text: 'б) Развитие гармоничной личности', next: '8' },
      { text: 'в) Хорошая успеваемость', next: '8А' }
    ]
  },
  '7А': {
    id: '7А',
    pedagogue: 'Василий Сухомлинский',
    pedagogueImage: '💚',
    dialogue: 'Сердце отдаю детям! Готовы ли вы понять, почему ребенок – высшая ценность?',
    question: 'Какую роль играет природа в воспитании?',
    answers: [
      { text: 'а) Лишь фон для занятий', next: '8В' },
      { text: 'б) Источник вдохновения', next: '8А' },
      { text: 'в) Место для физкультуры', next: '8Б' }
    ]
  },
  '7Б': {
    id: '7Б',
    pedagogue: 'Василий Сухомлинский',
    pedagogueImage: '💚',
    dialogue: 'Сердце отдаю детям! Готовы ли вы понять, почему ребенок – высшая ценность?',
    question: 'Как Сухомлинский относился к дисциплине?',
    answers: [
      { text: 'а) Необходимое условие обучения', next: '8В' },
      { text: 'б) Основана на уважении', next: '8Б' },
      { text: 'в) Поддерживается наказаниями', next: '8А' }
    ]
  },
  '7В': {
    id: '7В',
    pedagogue: 'Василий Сухомлинский',
    pedagogueImage: '💚',
    dialogue: 'Сердце отдаю детям! Готовы ли вы понять, почему ребенок – высшая ценность?',
    question: 'Что Сухомлинский считал главным в работе учителя?',
    answers: [
      { text: 'а) Знание своего предмета', next: '8Б' },
      { text: 'б) Индивидуальный подход', next: '8В' },
      { text: 'в) Строгий контроль', next: '8А' }
    ]
  },
  '8': {
    id: '8',
    pedagogue: 'Мария Монтессори',
    pedagogueImage: '✨',
    dialogue: 'Помоги мне сделать это самому! Готовы ли вы узнать, как раскрыть потенциал ребенка?',
    question: 'Каков основной принцип методики Монтессори?',
    answers: [
      { text: 'a) "Делай, как я говорю"', next: 'final-3' },
      { text: 'б) "Помоги мне сделать самому"', next: 'final-1' },
      { text: 'в) "Учись у лучших"', next: 'final-2' }
    ]
  },
  '8А': {
    id: '8А',
    pedagogue: 'Мария Монтессори',
    pedagogueImage: '✨',
    dialogue: 'Помоги мне сделать это самому! Готовы ли вы узнать, как раскрыть потенциал ребенка?',
    question: 'Какова роль учителя в системе Монтессори?',
    answers: [
      { text: 'а) Строгий контролер', next: 'final-4' },
      { text: 'б) Источник знаний', next: 'final-3' },
      { text: 'в) Наблюдатель и помощник', next: 'final-2' }
    ]
  },
  '8Б': {
    id: '8Б',
    pedagogue: 'Мария Монтессори',
    pedagogueImage: '✨',
    dialogue: 'Помоги мне сделать это самому! Готовы ли вы узнать, как раскрыть потенциал ребенка?',
    question: 'Какова особенность "Монтессори-среды"?',
    answers: [
      { text: 'а) Строгая и дисциплинированная', next: 'final-4' },
      { text: 'б) Организована для самостоятельности', next: 'final-2' },
      { text: 'в) Соответствует стандартам', next: 'final-3' }
    ]
  },
  '8В': {
    id: '8В',
    pedagogue: 'Мария Монтессори',
    pedagogueImage: '✨',
    dialogue: 'Помоги мне сделать это самому! Готовы ли вы узнать, как раскрыть потенциал ребенка?',
    question: 'Какую роль играет сенсорное развитие?',
    answers: [
      { text: 'а) Не имеет особого значения', next: 'final-3' },
      { text: 'б) Основа познания мира', next: 'final-2' },
      { text: 'в) Только для детей с ОВЗ', next: 'final-4' }
    ]
  }
};

const FINALS: Record<string, { title: string; description: string; emoji: string; color: string }> = {
  'final-1': {
    title: 'Отличная сдача!',
    description: 'Варя просыпается полная уверенности в своих знаниях. Все вопросы педагогов помогли ей систематизировать информацию и лучше понять суть педагогических теорий. Экзамен сдан на отлично! Варя станет прекрасным педагогом!',
    emoji: '🌟',
    color: 'bg-primary'
  },
  'final-2': {
    title: 'Удовлетворительно',
    description: 'Сон был полезным, но не решил всех проблем. Варя усвоила основные идеи, но некоторые вопросы остались не до конца понятыми. На экзамене Варе повезло, и она ответила на вопросы, которые знала, сдав экзамен на "удовлетворительно".',
    emoji: '📝',
    color: 'bg-accent'
  },
  'final-3': {
    title: 'Пересдача',
    description: 'Сон оказался слишком сумбурным. Варя запуталась в теориях и именах. На экзамене ей попались сложные вопросы, и она не смогла ответить на достаточное количество, чтобы сдать. Пересдача неизбежна!',
    emoji: '📋',
    color: 'bg-secondary'
  },
  'final-4': {
    title: 'Провал',
    description: 'Этот сон только запутал Варю! Все перемешалось в ее голове. На экзамене Варя не смогла ответить ни на один вопрос. Провал! Ее ждет отчисление!',
    emoji: '❌',
    color: 'bg-destructive'
  }
};

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQuestion, setCurrentQuestion] = useState<string>('1');
  const [visitedLocations, setVisitedLocations] = useState<string[]>([]);
  const [showDialogue, setShowDialogue] = useState(true);
  const [finalType, setFinalType] = useState<string>('final-1');

  const initLocations = (): Location[] => [
    { id: '1', name: 'Аристотель', status: 'current', x: 50, y: 20, connections: ['2', '2А', '2Б'] },
    { id: '2', name: 'Коменский', status: 'locked', x: 50, y: 35, connections: ['3'] },
    { id: '2А', name: 'Коменский', status: 'locked', x: 30, y: 35, connections: ['3А'] },
    { id: '2Б', name: 'Коменский', status: 'locked', x: 70, y: 35, connections: ['3Б', '3В'] },
    { id: '3', name: 'Песталоцци', status: 'locked', x: 50, y: 50, connections: ['4'] },
    { id: '3А', name: 'Песталоцци', status: 'locked', x: 30, y: 50, connections: ['4А', '4В', '4Б'] },
    { id: '3Б', name: 'Песталоцци', status: 'locked', x: 70, y: 50, connections: ['4А', '4Б', '4В'] },
    { id: '3В', name: 'Песталоцци', status: 'locked', x: 20, y: 50, connections: ['4А', '4Б', '4В'] },
    { id: '4', name: 'Ушинский', status: 'locked', x: 50, y: 65, connections: ['5'] },
    { id: '4А', name: 'Ушинский', status: 'locked', x: 30, y: 65, connections: ['5А'] },
    { id: '4Б', name: 'Ушинский', status: 'locked', x: 70, y: 65, connections: ['5Б'] },
    { id: '4В', name: 'Ушинский', status: 'locked', x: 20, y: 65, connections: ['5В'] },
    { id: '5', name: 'Макаренко', status: 'locked', x: 50, y: 75, connections: ['6'] },
    { id: '5А', name: 'Макаренко', status: 'locked', x: 30, y: 75, connections: ['6А'] },
    { id: '5Б', name: 'Макаренко', status: 'locked', x: 70, y: 75, connections: ['6Б'] },
    { id: '5В', name: 'Макаренко', status: 'locked', x: 20, y: 75, connections: ['6В'] },
    { id: '6', name: 'Выготский', status: 'locked', x: 50, y: 85, connections: ['7'] },
    { id: '6А', name: 'Выготский', status: 'locked', x: 30, y: 85, connections: ['7А'] },
    { id: '6Б', name: 'Выготский', status: 'locked', x: 70, y: 85, connections: ['7Б'] },
    { id: '6В', name: 'Выготский', status: 'locked', x: 20, y: 85, connections: ['7В'] },
    { id: '7', name: 'Сухомлинский', status: 'locked', x: 50, y: 92, connections: ['8'] },
    { id: '7А', name: 'Сухомлинский', status: 'locked', x: 30, y: 92, connections: ['8А'] },
    { id: '7Б', name: 'Сухомлинский', status: 'locked', x: 70, y: 92, connections: ['8Б'] },
    { id: '7В', name: 'Сухомlинский', status: 'locked', x: 20, y: 92, connections: ['8В'] },
    { id: '8', name: 'Монтессори', status: 'locked', x: 50, y: 98, connections: [] },
    { id: '8А', name: 'Монтессори', status: 'locked', x: 30, y: 98, connections: [] },
    { id: '8Б', name: 'Монтессори', status: 'locked', x: 70, y: 98, connections: [] },
    { id: '8В', name: 'Монтессори', status: 'locked', x: 20, y: 98, connections: [] }
  ];

  const [locations, setLocations] = useState<Location[]>(initLocations());

  const playSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWm98OScTgwPUKnk77hkHQc5k9nyzngqBSF1xu/+');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleAnswer = (nextId: string) => {
    if (nextId.startsWith('final-')) {
      setFinalType(nextId);
      setGameState('final');
      return;
    }

    playSound();
    setVisitedLocations([...visitedLocations, currentQuestion]);
    setCurrentQuestion(nextId);

    const updatedLocations = locations.map(loc => {
      if (loc.id === currentQuestion) return { ...loc, status: 'completed' as LocationStatus };
      if (loc.id === nextId) return { ...loc, status: 'available' as LocationStatus };
      return loc;
    });

    setLocations(updatedLocations);
    setShowDialogue(true);
    setGameState('map');
  };

  const handleLocationClick = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    if (location?.status === 'available' || location?.status === 'current') {
      playSound();
      const updatedLocations = locations.map(loc => {
        if (loc.id === locationId) return { ...loc, status: 'current' as LocationStatus };
        return loc;
      });
      setLocations(updatedLocations);
    }
  };

  const startQuestion = (locationId: string) => {
    setCurrentQuestion(locationId);
    setGameState('question');
  };

  const resetGame = () => {
    setGameState('start');
    setCurrentQuestion('1');
    setVisitedLocations([]);
    setLocations(initLocations());
    setShowDialogue(true);
  };

  const getLocationColor = (status: LocationStatus) => {
    switch (status) {
      case 'current': return 'bg-red-500 border-red-600 animate-pulse-glow text-white shadow-red-500/50';
      case 'completed': return 'bg-green-500 border-green-600 text-white shadow-green-500/30';
      case 'available': return 'bg-blue-500 border-blue-600 hover:scale-110 text-white shadow-blue-500/50 cursor-pointer';
      default: return 'bg-gray-400 border-gray-500 opacity-40 text-gray-300';
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full p-8 animate-fade-in shadow-2xl border-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-5xl font-bold mb-4 text-primary">Педагогический квест Вари</h1>
            <p className="text-xl text-muted-foreground">Путешествие в мир великих педагогов</p>
          </div>

          <div className="space-y-6 text-lg">
            <div className="bg-primary/5 p-6 rounded-xl border-2 border-primary/20">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Icon name="BookOpen" size={28} />
                Вступление
              </h2>
              <p className="leading-relaxed">
                Варя, студентка колледжа, готовится к ответственному экзамену по педагогике. 
                Уставшая и измученная, она засыпает прямо над учебником. Внезапно она оказывается 
                в странном месте, где ее ждут великие педагоги прошлого. Каждый из них приготовил 
                для Вари испытание - серию вопросов, которые помогут ей понять суть их педагогических 
                идей. Судьба экзамена Вари - в ваших руках!
              </p>
            </div>

            <div className="bg-secondary/5 p-6 rounded-xl border-2 border-secondary/20">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Icon name="Map" size={28} />
                Правила игры
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🗺️</span>
                  <span>Перемещайтесь по карте, отвечая на вопросы педагогов</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <span>Выбирайте ответы внимательно - каждый выбор определяет ваш путь</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🔴</span>
                  <span>Красная локация - ваше текущее положение</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🔵</span>
                  <span>Голубая локация - доступна для перехода</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🟢</span>
                  <span>Зелёная локация - уже пройдена</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">⚪</span>
                  <span>Серая локация - недоступна</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <span>4 возможных финала ждут вас в конце пути!</span>
                </li>
              </ul>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full mt-8 text-xl py-6 hover:scale-105 transition-transform"
            onClick={() => setGameState('map')}
          >
            Начать приключение <Icon name="ArrowRight" size={24} className="ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  if (gameState === 'map') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 animate-fade-in shadow-2xl border-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-primary">Карта колледжа</h1>
              <p className="text-lg text-muted-foreground">Выберите локацию для продолжения путешествия</p>
            </div>

            <div 
              className="relative w-full h-[600px] rounded-2xl border-4 border-primary/20 overflow-hidden shadow-inner" 
              style={{ 
                backgroundImage: 'url("https://cdn.poehali.dev/files/16043395-7238-4f88-b93e-866a212cc69b.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <svg className="absolute inset-0 w-full h-full">
                {locations.map(loc => {
                  const connectedLocs = locations.filter(l => loc.connections.includes(l.id));
                  return connectedLocs.map(connLoc => (
                    <line
                      key={`${loc.id}-${connLoc.id}`}
                      x1={`${loc.x}%`}
                      y1={`${loc.y}%`}
                      x2={`${connLoc.x}%`}
                      y2={`${connLoc.y}%`}
                      stroke="#9b87f5"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      opacity="0.3"
                    />
                  ));
                })}
              </svg>

              {locations.map(location => (
                <div key={location.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${location.x}%`, top: `${location.y}%` }}>
                  <button
                    onClick={() => handleLocationClick(location.id)}
                    disabled={location.status === 'locked' || location.status === 'completed'}
                    className={`w-16 h-16 rounded-full border-4 
                      flex items-center justify-center transition-all duration-300 shadow-lg
                      ${getLocationColor(location.status)}
                      ${(location.status === 'available' || location.status === 'current') ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    <Icon name="Flag" size={28} />
                  </button>
                  {location.status === 'current' && (
                    <button
                      onClick={() => startQuestion(location.id)}
                      className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      Начать задание
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4 justify-center flex-wrap">
              <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg border border-red-300">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">Текущая</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg border border-blue-300">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">Доступна</span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg border border-green-300">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Пройдена</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <span className="text-sm font-medium">Недоступна</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'question') {
    const questionData = QUESTIONS[currentQuestion];

    if (!questionData) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full p-8 animate-scale-in shadow-2xl border-4">
          {showDialogue ? (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="text-8xl mb-4">{questionData.pedagogueImage}</div>
                <h2 className="text-4xl font-bold text-primary mb-2">{questionData.pedagogue}</h2>
              </div>

              <div className="relative bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-100 p-8 rounded-3xl border-4 border-orange-400 shadow-xl">
                <div className="absolute -top-4 left-8 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-orange-400"></div>
                <p className="text-2xl leading-relaxed text-center italic font-semibold text-gray-800">{questionData.dialogue}</p>
              </div>

              <Button 
                size="lg" 
                className="w-full text-xl py-6 hover:scale-105 transition-transform"
                onClick={() => setShowDialogue(false)}
              >
                Продолжить <Icon name="ArrowRight" size={24} className="ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{questionData.pedagogueImage}</div>
                <h3 className="text-3xl font-bold text-primary mb-4">{questionData.pedagogue}</h3>
                <p className="text-2xl leading-relaxed font-medium">{questionData.question}</p>
              </div>

              <div className="space-y-4">
                {questionData.answers.map((answer, index) => (
                  <Button
                    key={index}
                    size="lg"
                    variant="outline"
                    className="w-full text-left text-lg py-6 px-6 hover:scale-102 transition-all hover:border-primary hover:bg-primary/5 border-2"
                    onClick={() => handleAnswer(answer.next)}
                  >
                    <span className="text-xl">{answer.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (gameState === 'final') {
    const final = FINALS[finalType];

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full p-8 animate-scale-in shadow-2xl border-4">
          <div className="text-center space-y-6">
            <div className="text-9xl mb-4 animate-pulse-glow">{final.emoji}</div>
            <h1 className={`text-5xl font-bold mb-4 ${final.color} bg-clip-text text-transparent`}>
              {final.title}
            </h1>
            <div className="bg-primary/5 p-8 rounded-2xl border-2 border-primary/20">
              <p className="text-2xl leading-relaxed">{final.description}</p>
            </div>

            <div className="flex gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                className="text-xl py-6 px-8 hover:scale-105 transition-transform"
                onClick={resetGame}
              >
                <Icon name="RotateCcw" size={24} className="mr-2" />
                Пройти заново
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default Index;