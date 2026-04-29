import { describe, expect, it } from 'vitest'
import {
  findRegexMatches,
  formatJson,
  generateBugReport,
  generateChecklist,
  generateTestData,
} from './toolbox'

describe('toolbox utilities', () => {
  it('generates a markdown bug report with numbered steps', () => {
    const report = generateBugReport({
      title: 'Кнопка входа не работает',
      environment: 'Chrome, Windows',
      severity: 'High',
      priority: 'Medium',
      steps: 'Открыть страницу входа\nНажать кнопку Login',
      expected: 'Открылся dashboard',
      actual: 'Ничего не происходит',
      notes: 'Только на staging',
    })

    expect(report).toContain('# Bug Report: Кнопка входа не работает')
    expect(report).toContain('1. Открыть страницу входа')
    expect(report).toContain('2. Нажать кнопку Login')
    expect(report).toContain('## Фактический результат')
  })

  it('creates a checklist for API testing', () => {
    const checklist = generateChecklist('api')

    expect(checklist).toContain('# API checklist')
    expect(checklist).toContain('- [ ] Проверить успешные ответы')
  })

  it('generates common test data fields', () => {
    const data = generateTestData()

    expect(data.email).toMatch(/^qa\.[a-z0-9-]+@example\.com$/)
    expect(data.password).toContain('Qa!')
    expect(data.phone).toMatch(/^\+7 9\d{2} \d{3}-\d{2}-\d{2}$/)
    expect(data.json).toContain('createdAt')
  })

  it('formats valid JSON and reports invalid JSON', () => {
    expect(formatJson('{"a":1}')).toMatchObject({
      ok: true,
      output: '{\n  "a": 1\n}',
    })

    expect(formatJson('{bad json}').ok).toBe(false)
  })

  it('finds regex matches', () => {
    const result = findRegexMatches('\\d+', 'g', 'ID 123 and 456')

    expect(result.ok).toBe(true)
    expect(result.matches).toEqual([
      { value: '123', index: 3 },
      { value: '456', index: 11 },
    ])
  })
})
