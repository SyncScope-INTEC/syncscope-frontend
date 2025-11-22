import { render, screen } from '@testing-library/react'
import { Footer } from '../footer'

describe('Footer', () => {
  it('renders footer component', () => {
    render(<Footer />)
    expect(screen.getByText('Proyecto final de grado')).toBeInTheDocument()
    expect(screen.getByText('SyncScope')).toBeInTheDocument()
    expect(screen.getByText('2025-26')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('bg-purple-900')
    expect(footer).toHaveClass('text-white')
  })

  it('renders within a max-width container', () => {
    const { container } = render(<Footer />)
    const maxWidthDiv = container.querySelector('.max-w-7xl')
    expect(maxWidthDiv).toBeInTheDocument()
  })
})
