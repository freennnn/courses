import './SliderItem.scss';

export interface SliderItemType {
  imgSrc: string;
  imgLargeSrc?: string;
}

function showModal(imgLargeSrc: string) {
  console.log(`openModalWindow with ${imgLargeSrc}`);
}

export default function SliderItem({ imgSrc, imgLargeSrc }: SliderItemType) {
  return (
    <li className='slider__item'>
      <img
        src={imgSrc}
        alt='Product Image'
        className='slider__item__img'
        onClick={() => showModal(imgLargeSrc ?? imgSrc)}
        draggable={false}
      ></img>
    </li>
  );
}
