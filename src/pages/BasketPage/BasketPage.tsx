import { Link } from 'react-router-dom';

import BasketList from '@/features/BasketList/BasketList';

import './BasketPage.scss';

export default function BasketPage() {
  return (
    <div className='basket' id='user'>
      <div className='basket__wrapper'>
        <div className='basket__decor'>
          <Link className='basket__main-link' to={'/'}></Link>
          <p className='basket__logo'></p>
          <h2 className='basket__subtitle'>Nice to meet you :)</h2>
          <p className='basket__text'>Check your goods</p>
        </div>
        <section className='basket__inner'>
          <div className='user__flex user__flex--center'>
            <h1>Basket</h1>
          </div>
          <div className='basket__flex'>
            <BasketList />
          </div>
        </section>
      </div>
    </div>
  );
}
