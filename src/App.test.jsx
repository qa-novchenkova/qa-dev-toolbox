import { fireEvent, render, screen } from '@testing-library/react'
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
})
