import { Link } from 'react-router-dom';

import './Breadcrumbs.scss';

interface Props {
  data: {
    id: string;
    name: string;
    path?: string;
    pathid?: string;
  };
}

const Breadcrumbs = ({ data }: Props) => {
  return (
    <div className='breadcrumbs'>
      <Link to={`/`}>Main / </Link>
      <Link to={`/products`}>Catalog / </Link>
      <Link to={`/products/category/${data.pathid}`}>{data.path}</Link>{' '}
      <Link to={`/products/category/${data.id}`}>{data.name}</Link> /
    </div>
  );
};

export default Breadcrumbs;
