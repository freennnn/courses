import { useState } from 'react';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';

import Button from '@/components/Button/Button';
import { ButtonBackgroundColor, ButtonType } from '@/components/Button/Button.types';
import { customStyles } from '@/components/Modal/Modal.tsx';
import Slider from '@/components/Slider/Slider';
import { SliderItemDataSourceType } from '@/components/Slider/SliderItem';
import { ProductItem } from 'types';

import './ProductDetailPage.scss';

export default function ProductDetailPage() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedModalSliderItemIndex, setSelectedModalSliderItemIndex] = useState(0);

  function openModal(index: number) {
    //console.log(`openModalSlider at index${index}`);
    setSelectedModalSliderItemIndex(index);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const product = useLocation().state as ProductItem | null;
  //TODO: if product is null (user typed in browser route instead of clicking in product gallery => then we need to download the product info manually)

  //console.log(product);
  const sliderItems: SliderItemDataSourceType[] | undefined = product?.images?.map((image) => {
    return { imgSrc: image.url, onClickHandler: openModal };
  });

  let slider;
  if (sliderItems) {
    slider = <Slider items={sliderItems} />;
  } else {
    slider = <h3>Ups, product does not have images</h3>;
  }

  let modalSlider;
  if (sliderItems) {
    modalSlider = <Slider items={sliderItems} selectedIndex={selectedModalSliderItemIndex} />;
  } else {
    modalSlider = <h3>Ups, product does not have images</h3>;
  }

  let fullPrice = 0;
  let discountedPrice = 0;

  if (product?.price) {
    fullPrice = product.price / 100;
  }

  if (product?.discount) {
    discountedPrice = fullPrice - Number(product.discount) / 100;
  }

  return (
    <div className='product-detail'>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Product Image Modal'
      >
        {modalSlider}
      </Modal>
      <div className='product-detail__container '>
        <div className='product-detail__content-container'>
          <div className='product-detail__text-content'>
            <h3 className='product-detail__title'>{product?.name['en-US']}</h3>
            <p className='product-detail__description'>{product?.description?.['en-US']}</p>
            <Button type={ButtonType.contained} color={ButtonBackgroundColor.accented}>
              {`Buy for $${discountedPrice > 0 ? discountedPrice : fullPrice} `}
              {discountedPrice > 0 ? (
                <span className='full-price_crossed'>{`$${fullPrice}`}</span>
              ) : (
                ''
              )}
            </Button>
          </div>
          {slider}
        </div>
      </div>
    </div>
  );
}
