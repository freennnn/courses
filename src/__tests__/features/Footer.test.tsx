import { BrowserRouter } from 'react-router-dom';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Footer from '../../components/Footer/Footer';

describe('Footer', () => {
  it('Should render Footer', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    );

    const paragraph = screen.getByText('Sorcery in Syntax, Magic in Code');
    expect(paragraph).toBeInTheDocument();
  });
});
