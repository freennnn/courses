import AboutCard from '@/components/AboutCard/AboutCard';

import './AboutUs.scss';
import { aboutUsData } from './aboutUsData';

const AboutUsPage = () => {
  return (
    <div className='about-us-page'>
      <div className='container'>
        <h2 className='about-us-page__title'>JS Wizards</h2>
        <div className='cards-list'>
          {aboutUsData.map((item) => (
            <AboutCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
