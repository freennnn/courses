import { useRef, useState } from 'react';
import { SliderItemType } from './SliderItem';
import SliderItem from './SliderItem';
import { useStateRef, getRefValue } from '../../utils/typedHooks';

import './Slider.scss';

export interface SliderType {
  items: SliderItemType[];
}

export default function Slider({ items }: SliderType) {
  const [isSwiping, setIsSwiping] = useState(false);
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const MIN_SWIPE_LENGTH = 50;

  const ulRef = useRef<HTMLUListElement>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = e.clientX;
    const ulElement = getRefValue(ulRef);
    minOffsetXRef.current = ulElement.offsetWidth - ulElement.scrollWidth; //scrollWidth - the whole width of the container

    setIsSwiping(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    const currentX = e.clientX;
    const difference = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - difference;

    const maxOffsetX = 0; // always 0 - can't scroll pass the first image
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }
    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }
    setOffsetX(newOffsetX);
  };

  const onMouseUp = () => {
    const ulElement = getRefValue(ulRef);
    const containerWidth = ulElement.clientWidth;
    const currentOffsetX = getRefValue(currentOffsetXRef);
    let newOffsetX = getRefValue(offsetXRef);
    const difference = currentOffsetX - newOffsetX;

    if (Math.abs(difference) > MIN_SWIPE_LENGTH) {
      if (difference > 0) {
        // swipe to the right
        newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth;
      } else {
        // to the left
        newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth;
      }
    } else {
      // not a significant enought swipe, scroll back to current image
      newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth;
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentItemIndex(Math.abs(newOffsetX / containerWidth));

    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
  };

  const selectItemAtIndex = function (index: number) {
    const ulElement = getRefValue(ulRef);
    const containerWidth = ulElement.offsetWidth;

    setCurrentItemIndex(index);
    setOffsetX(-(containerWidth * index));
  };

  return (
    <div className='slider' onMouseDown={onMouseDown}>
      <ul
        className={`slider__list ${isSwiping ? 'swiping' : ''}`}
        ref={ulRef}
        style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
      >
        {items.map((item, index) => (
          <SliderItem key={index} {...item} />
        ))}
      </ul>
      <ul className='slider__navigation'>
        {items.map((item, index) => (
          <li
            key={index}
            className={`slider__navigation-item ${currentItemIndex === index ? 'active' : ''}`}
            onClick={() => selectItemAtIndex(index)}
          />
        ))}
      </ul>
    </div>
  );
}
