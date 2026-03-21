import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-clay-500');
  });

  it('applies secondary variant styles when specified', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-clay-100');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>,
    );
    const btn = screen.getByText('Disabled');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });
});
