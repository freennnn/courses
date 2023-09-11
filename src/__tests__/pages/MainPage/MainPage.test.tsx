import MainPage from '@/pages/MainPage/MainPage';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Main page component', () => {
  it('Should render main page', () => {
    render(<MainPage />);
    const header = screen.getByRole('heading');
    const expectedHeaderText = 'Hello fellow wizards!';
    expect(header).toHaveTextContent(expectedHeaderText);
  });
});
