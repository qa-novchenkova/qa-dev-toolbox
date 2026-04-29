export const checklistTemplates = {
  ui: {
    title: 'UI checklist',
    items: [
      'Проверить основной экран на desktop и mobile разрешениях.',
      'Проверить, что кнопки, ссылки, поля ввода и иконки отображаются корректно.',
      'Проверить hover, focus, disabled и error состояния элементов.',
      'Убедиться, что текст не обрезается и не наезжает на соседние блоки.',
      'Проверить контрастность текста и читаемость основных элементов.',
      'Проверить навигацию с клавиатуры: Tab, Enter, Escape.',
      'Убедиться, что модальные окна и выпадающие списки закрываются ожидаемо.',
      'Проверить пустые состояния: нет данных, нет результатов, ошибка загрузки.',
      'Проверить отображение длинных названий, email, ID и других длинных строк.',
      'Сравнить ключевые элементы с макетом или требованиями.',
    ],
  },
  forms: {
    title: 'Form validation checklist',
    items: [
      'Отправить форму с валидными данными и проверить успешный сценарий.',
      'Отправить пустые обязательные поля и проверить тексты ошибок.',
      'Проверить минимальные, максимальные и граничные значения.',
      'Проверить невалидные форматы email, телефона, даты и пароля.',
      'Проверить ввод пробелов в начале и конце строки.',
      'Проверить очень длинные значения в текстовых полях.',
      'Проверить повторную отправку формы двойным кликом.',
      'Проверить сохранение или очистку данных после обновления страницы.',
      'Проверить поведение при ошибке сервера.',
      'Убедиться, что успешное сообщение понятно пользователю.',
    ],
  },
  api: {
    title: 'API checklist',
    items: [
      'Проверить успешные ответы, status code и структуру response body.',
      'Проверить ошибки валидации для отсутствующих и невалидных полей.',
      'Проверить авторизацию: без токена, неверный токен, истёкший токен.',
      'Проверить доступы: forbidden для пользователя без нужных прав.',
      'Проверить 404, conflict и server error сценарии.',
      'Проверить фильтрацию, сортировку и пагинацию.',
      'Проверить response time на типовых запросах.',
      'Проверить корректность Content-Type и основных headers.',
      'Проверить idempotency там, где это важно для метода.',
      'Сравнить контракт API с документацией или Swagger.',
    ],
  },
  auth: {
    title: 'Auth checklist',
    items: [
      'Проверить вход с валидными логином и паролем.',
      'Проверить ошибку при неверном пароле.',
      'Проверить ошибку при несуществующем пользователе.',
      'Проверить logout и очистку пользовательской сессии.',
      'Открыть защищённые страницы без авторизации.',
      'Проверить редирект после успешного входа.',
      'Проверить истечение сессии или токена.',
      'Проверить восстановление пароля, если такая функция есть.',
      'Проверить блокировку или лимиты после нескольких неудачных попыток.',
      'Убедиться, что пароль не отображается в открытом виде.',
    ],
  },
  responsive: {
    title: 'Responsive checklist',
    items: [
      'Проверить layout на mobile, tablet, laptop и wide screen размерах.',
      'Проверить, что меню и модальные окна помещаются на маленьких экранах.',
      'Проверить размер кликабельных элементов для touch-устройств.',
      'Проверить landscape orientation на мобильном устройстве.',
      'Убедиться, что изображения не растягиваются и не ломают экран.',
      'Проверить таблицы, карточки и длинные списки на узком экране.',
      'Проверить отсутствие горизонтального скролла там, где он не нужен.',
      'Проверить переносы длинных слов, email, ссылок и ID.',
      'Проверить sticky/header/footer элементы при скролле.',
      'Проверить основные сценарии в DevTools device mode.',
    ],
  },
}

export function generateBugReport(data) {
  const steps = normalizeLines(data.steps)
  const formattedSteps = steps.length
    ? steps.map((step, index) => `${index + 1}. ${step}`).join('\n')
    : '1. Не указано'

  return `# Bug Report: ${fallback(data.title)}

## Окружение
${fallback(data.environment)}

## Severity
${fallback(data.severity)}

## Priority
${fallback(data.priority)}

## Шаги воспроизведения
${formattedSteps}

## Ожидаемый результат
${fallback(data.expected)}

## Фактический результат
${fallback(data.actual)}

## Примечания
${fallback(data.notes)}`
}

export function generateChecklist(category) {
  const template = checklistTemplates[category] ?? checklistTemplates.ui

  return `# ${template.title}

${template.items.map((item) => `- [ ] ${item}`).join('\n')}`
}

export function generateTestData() {
  const id = crypto.randomUUID()
  const shortId = id.slice(0, 8)
  const timestamp = new Date().toISOString()

  return {
    email: `qa.${shortId}@example.com`,
    password: `Qa!${shortId}2026`,
    uuid: id,
    phone: `+7 9${randomDigits(2)} ${randomDigits(3)}-${randomDigits(2)}-${randomDigits(2)}`,
    date: timestamp,
    json: JSON.stringify(
      {
        userId: id,
        email: `qa.${shortId}@example.com`,
        active: true,
        createdAt: timestamp,
      },
      null,
      2,
    ),
  }
}

export function formatJson(input) {
  try {
    const parsed = JSON.parse(input)

    return {
      ok: true,
      output: JSON.stringify(parsed, null, 2),
      message: 'JSON валиден',
    }
  } catch (error) {
    return {
      ok: false,
      output: input,
      message: error instanceof Error ? error.message : 'JSON невалиден',
    }
  }
}

export function findRegexMatches(pattern, flags, text) {
  try {
    const safeFlags = flags.includes('g') ? flags : `${flags}g`
    const regex = new RegExp(pattern, safeFlags)
    const matches = [...text.matchAll(regex)].map((match) => ({
      value: match[0],
      index: match.index ?? 0,
    }))

    return { ok: true, matches, message: `Найдено совпадений: ${matches.length}` }
  } catch (error) {
    return {
      ok: false,
      matches: [],
      message: error instanceof Error ? error.message : 'Некорректное регулярное выражение',
    }
  }
}

function fallback(value) {
  return value?.trim() || 'Не указано'
}

function normalizeLines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function randomDigits(length) {
  return String(Math.floor(Math.random() * 10 ** length)).padStart(length, '0')
}
