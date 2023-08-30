import { Link } from 'react-router-dom';

import './NotFoundPage.scss';

const NotFoundPage = () => {
  return (
    <div className='not-found-page'>
      <div className='container'>
        <div className='not-found-page-content'>
          <div className='not-found-page-content__image'>
            <p className='not-found-page-content__image__text'>404</p>
          </div>
          <div className='not-found-page-content__separator'></div>
          <div className='not-found-page-content__info'>
            <h2 className='not-found-page-content__info__title'>This page could not be found</h2>
            <p className='not-found-page-content__info__text'>
              You can either stay and chill here, or go back to the beginning.
            </p>
            <Link className='not-found-page-content__link' to='/'>
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
