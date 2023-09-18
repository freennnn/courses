import { BrowserRouter } from 'react-router-dom';

import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('NotFoundPage', () => {
  it('Should render NotFoundPage', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>,
    );

    const titleElement = screen.getByRole('heading');
    const expectedText = 'This page could not be found';
    const linkElement = screen.getByRole('link');
    expect(titleElement).toHaveTextContent(expectedText);
    expect(linkElement).toHaveTextContent('BACK TO HOME');
  });
});
