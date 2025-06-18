import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Mower from './Mower';

describe('Tondeuse Component', () => {
  it('renders position and orientation correctly', () => {
    render(<Mower x={0} y={0} orientation="N" />);

    expect(screen.getByText(/Position: 0, 0/)).toBeInTheDocument();
    expect(screen.getByText(/Orientation: N/)).toBeInTheDocument();
  });

  it('updates position when move Forward is called', async () => {
    render(<Mower x={0} y={0} orientation="N" />);

    const button = screen.getByText(/F/); // forwardButton = screen.getByText(/^\^/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Orientation: N/)).toBeInTheDocument();
    expect(screen.getByText(/Position: 0, 1/)).toBeInTheDocument();
  });

  it('updates position when move Right is called', async () => {
    render(<Mower x={0} y={0} orientation="N" />);

    const button = screen.getByText(/R/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Orientation: E/)).toBeInTheDocument();
    expect(screen.getByText(/Position: 0, 0/)).toBeInTheDocument();
  });

  it('updates position when move Left is called', async () => {
    render(<Mower x={0} y={0} orientation="E" />);

    const button = screen.getByText(/L/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Orientation: N/)).toBeInTheDocument();
    expect(screen.getByText(/Position: 0, 0/)).toBeInTheDocument();
  });

  it('updates position when move Right is called, starting from West (check rotating limit)', async () => {
    render(<Mower x={0} y={0} orientation="W" />);

    const button = screen.getByText(/R/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Orientation: N/)).toBeInTheDocument();
    expect(screen.getByText(/Position: 0, 0/)).toBeInTheDocument();
  });

  it('updates position when move Left is called, starting from Nord (check rotating limit)', async () => {
    render(<Mower x={0} y={0} orientation="N" />);

    const button = screen.getByText(/L/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Orientation: W/)).toBeInTheDocument();
    expect(screen.getByText(/Position: 0, 0/)).toBeInTheDocument();
  });
});
