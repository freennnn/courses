import { Link, NavLink } from 'react-router-dom';

import './Breadcrumbs.scss';

interface Props {
  data: {
    id: string;
    name: string;
    path?: string;
    pathid?: string;
  };
  onActiveId: (id: string) => void;
}

const Breadcrumbs = ({ data, onActiveId }: Props) => {
  return (
    <div className='breadcrumbs'>
      <Link to={`/`}>Main / </Link>
      <Link to={`/products`}>Catalog / </Link>
      <NavLink
        onClick={(e) => {
          e.stopPropagation();
          onActiveId(data.pathid ? data.pathid : data.id);
        }}
        to={`/products/category/${data.pathid}`}
        className={({ isActive }) => (isActive ? ' active' : '')}
      >
        {data.path}
      </NavLink>{' '}
      <NavLink
        to={`/products/category/${data.id}`}
        className={({ isActive }) => (isActive ? ' active' : '')}
      >
        {data.name}
      </NavLink>
    </div>
  );
};

export default Breadcrumbs;
