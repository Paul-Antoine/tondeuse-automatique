import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Mower from './Mower';

describe('Tondeuse Component', () => {
  it('renders position and orientation correctly', () => {
    render(<Mower name="Tondeuse 1" position={{ x: 0, y: 0, orientation: "N" }} lawnSize={{ x: 5, y: 5 }} />);

    expect(screen.getByText(/Position: 0, 0, N/)).toBeInTheDocument();
  });

  it('updates position when move Forward is called', async () => {
    render(<Mower name="Tondeuse 1" position={{ x: 0, y: 0, orientation: "N" }} program='F' lawnSize={{ x: 5, y: 5 }} />);

    const button = screen.getByText(/Start/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Position: 0, 1, N/)).toBeInTheDocument();
  });

  it('updates position when move Right is called', async () => {
    render(<Mower name="Tondeuse 1" position={{ x: 0, y: 0, orientation: "N" }} program='R' lawnSize={{ x: 5, y: 5 }} />);

    const button = screen.getByText(/Start/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Position: 0, 0, E/)).toBeInTheDocument();
  });

  it('updates position when move Left is called', async () => {
    render(<Mower name="Tondeuse 1" position={{ x: 0, y: 0, orientation: "E" }} program='L' lawnSize={{ x: 5, y: 5 }} />);

    const button = screen.getByText(/Start/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Position: 0, 0, N/)).toBeInTheDocument();
  });

  it('updates position when move Right is called, starting from West (check rotating limit)', async () => {
    render(<Mower name="Tondeuse 1" position={{ x: 0, y: 0, orientation: "W" }} program='R' lawnSize={{ x: 5, y: 5 }} />);

    const button = screen.getByText(/Start/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Position: 0, 0, N/)).toBeInTheDocument();
  });

  it('updates position when move Left is called, starting from Nord (check rotating limit)', async () => {
    render(<Mower name="Tondeuse 1" position={{ x: 0, y: 0, orientation: "N" }} program='L' lawnSize={{ x: 5, y: 5 }} />);

    const button = screen.getByText(/Start/);
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for state update
    expect(screen.getByText(/Position: 0, 0, W/)).toBeInTheDocument();
  });
});
