import './SliderItem.scss';

export interface SliderItemDataSourceType {
  imgSrc: string;
  onClickHandler?: (index: number) => void;
}

export default function SliderItem({ imgSrc }: SliderItemDataSourceType & { index: number }) {
  return (
    <li className='slider__item'>
      <img
        src={imgSrc}
        alt='Product Image'
        className='slider__item__img'
        // onClick={() => onClickHandler?.(index)}
        draggable={false}
      ></img>
    </li>
  );
}
