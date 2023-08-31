import { useLocation } from 'react-router-dom';
// import { SliderType }
import Slider from '@/components/Slider/Slider';
import { SliderItemType } from '@/components/Slider/SliderItem';
import { ProductItem } from 'types';
import './ProductDetailPage.scss';

export default function ProductDetailPage() {
  const product = useLocation().state as ProductItem | null;
  //TODO: if product is null (user typed in browser route instead of clicking in product gallery => then we need to download the product info manually)

  console.log(product);
  const sliderItems: SliderItemType[] | undefined = product?.images?.map((image) => {
    return { imgSrc: image.url };
  });

  let slider;
  if (sliderItems) {
    slider = <Slider items={sliderItems} />;
  } else {
    slider = <h3>Ups, product does not have images</h3>;
  }

  return (
    <div className='product-detail'>
      <h1>3 beers for the price of 2! The more you drink - the more you save!</h1>
      {slider}
    </div>
  );
}
