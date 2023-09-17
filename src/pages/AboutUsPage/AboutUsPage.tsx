import { Link } from 'react-router-dom';

import AboutCard from '@/components/AboutCard/AboutCard';

import './AboutUs.scss';
import { aboutUsData } from './aboutUsData';

const AboutUsPage = () => {
  return (
    <div className='about-us-page'>
      <div className='container'>
        <h2 className='about-us-page__title'>JS Wizards</h2>
        <p className='about-us-page__subtitle'>Sorcery in Syntax, Magic in Code</p>
        <div className='about-us-page__description'>
          <p>
            Our development team maintained a close-knit and collaborative approach throughout the
            entire project. We harnessed the power of the Jira task management system to
            meticulously organize tasks and effectively track the project&apos;s progress.
          </p>
          <p>
            In addition to task management, we facilitated open lines of communication and
            collaboration through weekly meetings on Discord. These sessions provided an opportunity
            for team members to come together, discuss project updates, address challenges, and
            share valuable insights.
          </p>
          <p>
            Furthermore, regular code reviews were conducted to ensure code quality and foster
            continuous improvement. Our round-the-clock presence on Discord allowed for seamless and
            timely discussions of tasks and immediate troubleshooting when needed. This cohesive
            approach to teamwork was instrumental in our project&apos;s success, resulting in a
            product we are proud to deliver.
          </p>
        </div>
        <div className='cards-list'>
          {aboutUsData.map((item) => (
            <AboutCard key={item.id} {...item} />
          ))}
        </div>
        <div className='thanks-block'>
          <h3 className='thanks-block__title'>Special thanks to: </h3>
          <Link className='thanks-block__link_school' to='https://rs.school/js/' target='_blank'>
            <img src='https://rs.school/images/rs_school_js.svg' alt='RSSchool' />
          </Link>
          <p>and</p>
          <p>
            <span>Our mentor </span>
            <Link
              className='thanks-block__link'
              to='https://github.com/vladpoltorin'
              target='_blank'
            >
              Vlad Poltorin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
