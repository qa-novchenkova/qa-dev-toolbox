import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

describe('App', () => {
  it('shows the bug report builder by default', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'QA Dev Toolbox' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bug Report Builder' })).toBeInTheDocument()
    expect(screen.getByText(/# Bug Report: Кнопка входа не работает/)).toBeInTheDocument()
  })

  it('switches to the JSON formatter and validates input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'JSON' }))
    fireEvent.change(screen.getByLabelText('Вставьте JSON'), {
      target: { value: '{"hello":"world"}' },
    })

    expect(screen.getByText('JSON валиден')).toBeInTheDocument()
    expect(screen.getByText(/"hello": "world"/)).toBeInTheDocument()
  })

  it('switches to the regex tester and shows matches', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Regex' }))

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('opens and closes project information modal', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'О проекте' }))

    const dialog = screen.getByRole('dialog', { name: 'QA Dev Toolbox' })

    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText('CI/CD на примере этого проекта')).toBeInTheDocument()
    expect(within(dialog).getByText('GitHub Actions')).toBeInTheDocument()
    expect(within(dialog).getByText('GitHub Pages')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Закрыть окно' }))

    expect(screen.queryByRole('dialog', { name: 'QA Dev Toolbox' })).not.toBeInTheDocument()
  })
})
