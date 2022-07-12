import { render, screen } from '@testing-library/react';
import App from './App';

test('it button contact exists', () => {
  render(<App />);
  const linkElement = screen.getByText(/Adicionar contato/i);
  expect(linkElement).toBeInTheDocument();
});
