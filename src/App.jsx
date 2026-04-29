import { useMemo, useState } from 'react'
import './App.css'
import {
  checklistTemplates,
  findRegexMatches,
  formatJson,
  generateBugReport,
  generateChecklist,
  generateTestData,
} from './tools/toolbox'

const tabs = [
  { id: 'bug', label: 'Bug Report' },
  { id: 'checklist', label: 'Чек-листы' },
  { id: 'data', label: 'Тестовые данные' },
  { id: 'json', label: 'JSON' },
  { id: 'regex', label: 'Regex' },
]

const initialBug = {
  title: 'Кнопка входа не работает',
  environment: 'Chrome 124, Windows 11',
  severity: 'High',
  priority: 'Medium',
  steps: 'Открыть страницу входа\nВвести валидный email и пароль\nНажать кнопку Login',
  expected: 'Пользователь авторизуется и попадает на dashboard',
  actual: 'После клика по кнопке ничего не происходит',
  notes: 'Воспроизводится на staging-сборке.',
}

function App() {
  const [activeTab, setActiveTab] = useState('bug')
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [bug, setBug] = useState(initialBug)
  const [checklistCategory, setChecklistCategory] = useState('ui')
  const [testData, setTestData] = useState(() => generateTestData())
  const [jsonInput, setJsonInput] = useState('{"status":"ok","items":[1,2,3]}')
  const [regexPattern, setRegexPattern] = useState('\\b[A-Z][a-z]+\\b')
  const [regexFlags, setRegexFlags] = useState('g')
  const [regexText, setRegexText] = useState(
    'На странице входа отображаются сообщения Error и Warning. ID ошибки: 12345.',
  )
  const [copyStatus, setCopyStatus] = useState('')

  const bugReport = useMemo(() => generateBugReport(bug), [bug])
  const checklist = useMemo(() => generateChecklist(checklistCategory), [checklistCategory])
  const jsonResult = useMemo(() => formatJson(jsonInput), [jsonInput])
  const regexResult = useMemo(
    () => findRegexMatches(regexPattern, regexFlags, regexText),
    [regexPattern, regexFlags, regexText],
  )

  async function copyText(value) {
    await navigator.clipboard.writeText(value)
    setCopyStatus('Скопировано')
    window.setTimeout(() => setCopyStatus(''), 1500)
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <button className="info-button" type="button" onClick={() => setIsInfoOpen(true)}>
          О проекте
        </button>
        <div>
          <p className="eyebrow">QA инструментарий + developer mini toolkit</p>
          <h1>QA Dev Toolbox</h1>
          <p className="hero-text">
            Портфолио-проект на React: с полезными QA-инструментами, автотестами,
            сборкой через GitHub Actions и автодеплоем на GitHub Pages.
          </p>
        </div>
      </header>

      <nav className="tabs" aria-label="Разделы QA Dev Toolbox">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? 'tab active' : 'tab'}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="workspace">
        {activeTab === 'bug' && (
          <ToolCard title="Bug Report Builder">
            <ToolIntro>
              Помогает быстро оформить баг-репорт в едином формате Markdown для
              Jira, GitHub Issues или таск-трекера.
            </ToolIntro>
            <div className="grid two-columns">
              <div className="form-stack">
                <TextInput label="Заголовок" name="title" state={bug} setState={setBug} />
                <TextInput
                  label="Окружение"
                  name="environment"
                  state={bug}
                  setState={setBug}
                />
                <div className="row">
                  <SelectInput
                    label="Severity"
                    name="severity"
                    options={['Low', 'Medium', 'High', 'Critical']}
                    state={bug}
                    setState={setBug}
                  />
                  <SelectInput
                    label="Priority"
                    name="priority"
                    options={['Low', 'Medium', 'High']}
                    state={bug}
                    setState={setBug}
                  />
                </div>
                <TextArea label="Шаги воспроизведения" name="steps" state={bug} setState={setBug} />
                <TextArea label="Ожидаемый результат" name="expected" state={bug} setState={setBug} />
                <TextArea label="Фактический результат" name="actual" state={bug} setState={setBug} />
                <TextArea label="Примечания" name="notes" state={bug} setState={setBug} />
              </div>
              <Preview title="Markdown preview" value={bugReport} onCopy={copyText} />
            </div>
          </ToolCard>
        )}

        {activeTab === 'checklist' && (
          <ToolCard title="QA Checklist Generator">
            <ToolIntro>
              Генерирует базовый чек-лист по выбранному типу проверки, чтобы не
              забыть типовые сценарии при тестировании задачи.
            </ToolIntro>
            <div className="grid two-columns">
              <label>
                Тип чек-листа
                <select
                  value={checklistCategory}
                  onChange={(event) => setChecklistCategory(event.target.value)}
                >
                  {Object.entries(checklistTemplates).map(([key, template]) => (
                    <option key={key} value={key}>
                      {template.title}
                    </option>
                  ))}
                </select>
              </label>
              <Preview title="Чек-лист" value={checklist} onCopy={copyText} />
            </div>
          </ToolCard>
        )}

        {activeTab === 'data' && (
          <ToolCard title="Test Data Generator">
            <ToolIntro>
              Создаёт тестовые значения для ручной проверки форм, API-запросов и
              демо-данных: email, пароль, UUID, телефон, дату и JSON.
            </ToolIntro>
            <div className="action-row">
              <button type="button" onClick={() => setTestData(generateTestData())}>
                Сгенерировать новые данные
              </button>
              <button type="button" onClick={() => copyText(JSON.stringify(testData, null, 2))}>
                Скопировать JSON
              </button>
            </div>
            <dl className="data-list">
              {Object.entries(testData).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </ToolCard>
        )}

        {activeTab === 'json' && (
          <ToolCard title="JSON Formatter / Validator">
            <ToolIntro>
              Проверяет, валидный ли JSON, и форматирует его с отступами. Полезно
              при работе с API-ответами, логами и тестовыми JSON-данными.
            </ToolIntro>
            <div className="grid two-columns">
              <label>
                Вставьте JSON
                <textarea value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} />
              </label>
              <div>
                <p className={jsonResult.ok ? 'status success' : 'status error'}>
                  {jsonResult.message}
                </p>
                <Preview title="Отформатированный JSON" value={jsonResult.output} onCopy={copyText} />
              </div>
            </div>
          </ToolCard>
        )}

        {activeTab === 'regex' && (
          <ToolCard title="Regex Tester">
            <ToolIntro>
              Помогает проверить регулярное выражение на тестовом тексте. Это
              удобно для валидации email, телефонов, ID, ошибок в логах и других
              строковых правил.
            </ToolIntro>
            <div className="grid two-columns">
              <div className="form-stack">
                <label>
                  Pattern
                  <input
                    value={regexPattern}
                    onChange={(event) => setRegexPattern(event.target.value)}
                  />
                </label>
                <label>
                  Flags
                  <input value={regexFlags} onChange={(event) => setRegexFlags(event.target.value)} />
                </label>
                <label>
                  Тестовый текст
                  <textarea value={regexText} onChange={(event) => setRegexText(event.target.value)} />
                </label>
                <div className="help-box">
                  <p>
                    <strong>Pattern</strong> — само регулярное выражение без
                    слешей, например <code>\d+</code> для поиска чисел.
                  </p>
                  <p>
                    <strong>Flags</strong> — режим поиска: <code>g</code> ищет
                    все совпадения, <code>i</code> игнорирует регистр.
                  </p>
                  <p>
                    <strong>Тестовый текст</strong> — строка, в которой нужно
                    найти совпадения.
                  </p>
                </div>
              </div>
              <div>
                <p className={regexResult.ok ? 'status success' : 'status error'}>
                  {regexResult.message}
                </p>
                <ul className="match-list">
                  {regexResult.matches.map((match) => (
                    <li key={`${match.value}-${match.index}`}>
                      <strong>{match.value}</strong> — позиция {match.index}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ToolCard>
        )}
      </section>

      {copyStatus && <div className="toast">{copyStatus}</div>}
      {isInfoOpen && <InfoModal onClose={() => setIsInfoOpen(false)} />}
    </main>
  )
}

function ToolCard({ title, children }) {
  return (
    <article className="tool-card">
      <h2>{title}</h2>
      {children}
    </article>
  )
}

function ToolIntro({ children }) {
  return <p className="tool-intro">{children}</p>
}

function TextInput({ label, name, state, setState }) {
  return (
    <label>
      {label}
      <input value={state[name]} onChange={(event) => setState({ ...state, [name]: event.target.value })} />
    </label>
  )
}

function SelectInput({ label, name, options, state, setState }) {
  return (
    <label>
      {label}
      <select value={state[name]} onChange={(event) => setState({ ...state, [name]: event.target.value })}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function TextArea({ label, name, state, setState }) {
  return (
    <label>
      {label}
      <textarea value={state[name]} onChange={(event) => setState({ ...state, [name]: event.target.value })} />
    </label>
  )
}

function Preview({ title, value, onCopy }) {
  return (
    <div className="preview">
      <div className="preview-header">
        <h3>{title}</h3>
        <button type="button" onClick={() => onCopy(value)}>
          Скопировать
        </button>
      </div>
      <pre>{value}</pre>
    </div>
  )
}

function InfoModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-labelledby="project-info-title"
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Как устроен проект</p>
            <h2 id="project-info-title">QA Dev Toolbox</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть окно">
            x
          </button>
        </div>

        <div className="modal-content">
          <section>
            <h3>Стек проекта</h3>
            <ul className="info-list">
              <li>
                <strong>React</strong> отвечает за интерфейс: вкладки, формы,
                кнопки, модальное окно и обновление данных на странице.
              </li>
              <li>
                <strong>JavaScript</strong> содержит логику инструментов:
                генерацию баг-репорта, чек-листов, тестовых данных, проверку
                JSON и regex.
              </li>
              <li>
                <strong>Vite</strong> запускает сайт локально и собирает
                production-версию в папку <code>dist</code>.
              </li>
              <li>
                <strong>Vitest и Testing Library</strong> запускают автотесты:
                проверяют функции и базовое поведение интерфейса.
              </li>
            </ul>
          </section>

          <section>
            <h3>CI/CD на примере этого проекта</h3>
            <ol className="pipeline-list">
              <li>Изменения вносятся локально и сохраняются в commit.</li>
              <li>После <code>git push</code> код попадает в GitHub-репозиторий.</li>
              <li>
                <strong>GitHub Actions</strong> автоматически запускает workflow:
                устанавливает зависимости, запускает тесты и собирает проект.
              </li>
              <li>
                Если тесты и сборка прошли успешно, workflow публикует готовую
                папку <code>dist</code>.
              </li>
              <li>
                <strong>GitHub Pages</strong> принимает собранные файлы и
                обновляет опубликованный сайт.
              </li>
            </ol>
          </section>

          <section>
            <h3>Что показывает проект</h3>
            <p>
              Проект демонстрирует полный цикл: разработка локально, проверка
              автотестами, автоматическая сборка и деплой. Если проверка падает,
              новая версия сайта не публикуется.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}

export default App
