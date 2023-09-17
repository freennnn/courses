import { Link } from 'react-router-dom';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import type { AboutCardPersonData } from 'types';

const AboutCard = (data: AboutCardPersonData) => {
  return (
    <div className='card'>
      <div className='card__image'>
        {data.image ? (
          <img src={data.image} />
        ) : (
          <img className='not-avalable' src='/photo-not-available.jpg' />
        )}
      </div>
      <div className='card__description'>
        <h3 className='card__description__name'>{data.name}</h3>
        <p className='card__description__role'>{data.role}</p>
        <p className='card__description__bio'>{data.bio}</p>
        <p className='card__description__contribution'>
          <span>Contribution: </span>
          {data.contribution}
        </p>
        <div className='card__description__social-media'>
          <Link className='card__description__social-media_link' to={data.github} target='_blank'>
            <FaGithub />
          </Link>
          {data.linkedIn ? (
            <Link
              className='card__description__social-media_link'
              to={data.linkedIn}
              target='_blank'
            >
              <FaLinkedin />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AboutCard;
