import { Link } from 'react-router-dom';

import '../../components/Breadcrumbs/Breadcrumbs.scss';
import './ProductDetailBreadcrumbs.scss';

interface Props {
  productName: string;
  productId: string;
}

export default function ProductDetailBreadcrumbs({ productName, productId }: Props) {
  return (
    <div className='breadcrumbs product-detail-breadcrumbs'>
      <Link to={`/`}>Main / </Link>
      <Link to={`/products`}>Catalog / </Link>
      <Link to={`/products:${productId}`} className='active'>
        {productName}
      </Link>
    </div>
  );
}
