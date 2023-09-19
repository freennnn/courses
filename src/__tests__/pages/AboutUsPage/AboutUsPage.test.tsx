import { BrowserRouter } from 'react-router-dom';

import AboutUsPage from '@/pages/AboutUsPage/AboutUsPage';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('AboutUsPage', () => {
  it('Should render AboutUsPage', () => {
    render(
      <BrowserRouter>
        <AboutUsPage />
      </BrowserRouter>,
    );

    expect(screen.getByText('JS Wizards')).toBeInTheDocument();
  });
});
