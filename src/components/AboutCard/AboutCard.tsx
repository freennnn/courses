import { Link } from 'react-router-dom';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import type { AboutCardPersonData } from 'types';

const AboutCard = (data: AboutCardPersonData) => {
  return (
    <div className='card'>
      <div className='card__image'>
        <img src={data.image} />
      </div>
      <div className='card__description'>
        <h3 className='card__description__name'>{data.name}</h3>
        <p className='card__description__role'>{data.role}</p>
        <p>{data.bio}</p>
        <p>
          <span>Significal contributions: </span>
          {data.contribution}
        </p>
        <Link to={data.github} target='_blank'>
          <FaGithub />
        </Link>
        {data.linkedIn ? (
          <Link to={data.linkedIn} target='_blank'>
            <FaLinkedin />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default AboutCard;
