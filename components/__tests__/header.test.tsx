import { render, screen } from '@testing-library/react'
import { Header } from '../header'

describe('Header', () => {
  it('renders header component', () => {
    render(<Header />)
    expect(screen.getByText('SyncScope')).toBeInTheDocument()
    expect(screen.getByText('S')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Paquetes')).toBeInTheDocument()
    expect(screen.getByText('Servicios')).toBeInTheDocument()
    expect(screen.getByText('Saber más')).toBeInTheDocument()
  })

  it('renders login button', () => {
    render(<Header />)
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })

  it('logo has correct styling', () => {
    const { container } = render(<Header />)
    const logo = container.querySelector('.bg-purple-600')
    expect(logo).toHaveClass('rounded-lg')
    expect(logo).toHaveClass('w-8')
    expect(logo).toHaveClass('h-8')
  })

  it('nav links have correct href', () => {
    const { container } = render(<Header />)
    const links = container.querySelectorAll('nav a')
    links.forEach(link => {
      expect(link).toHaveAttribute('href', '#')
    })
  })

  it('navigation is hidden on mobile', () => {
    const { container } = render(<Header />)
    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('hidden')
    expect(nav).toHaveClass('md:flex')
  })
})
