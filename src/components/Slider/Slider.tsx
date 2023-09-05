import { useEffect, useRef, useState } from 'react';

import { getRefValue, useStateRef } from '../../utils/typedHooks';
import { getTouchEventData } from '../../utils/universalTouch';
import './Slider.scss';
import SliderItem from './SliderItem';
import { SliderItemDataSourceType } from './SliderItem';

export interface SliderType {
  items: SliderItemDataSourceType[];
  selectedIndex?: number;
}

export default function Slider({ items, selectedIndex = 0 }: SliderType) {
  const [isSwiping, setIsSwiping] = useState(false);
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const MIN_SWIPE_LENGTH = 50;

  const ulRef = useRef<HTMLUListElement>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(selectedIndex);

  const onTouchStart = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = getTouchEventData(e).clientX;
    const ulElement = getRefValue(ulRef);
    minOffsetXRef.current = ulElement.offsetWidth - ulElement.scrollWidth; //scrollWidth - the whole width of the container

    setIsSwiping(true);

    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  const onTouchMove = (e: MouseEvent | TouchEvent) => {
    const currentX = getTouchEventData(e).clientX;
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

  useEffect(() => {
    // console.log(`useEffect selectItemAtIndex wiht currentItemIndex ${currentItemIndex}`);
    selectItemAtIndex(currentItemIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchEnd = () => {
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

    // then it's just a click, no scroll/swipe attempt
    if (difference === 0) {
      // no drug/scroll => means click
      // console.log('click');
      items[currentItemIndex].onClickHandler?.(currentItemIndex);
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentItemIndex(Math.abs(newOffsetX / containerWidth));

    window.removeEventListener('mouseup', onTouchEnd);
    window.removeEventListener('mousemove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchmove', onTouchMove);
  };

  const selectItemAtIndex = function (index: number) {
    // console.log(`SELECT item at index ${index}`);
    const ulElement = getRefValue(ulRef);
    const containerWidth = ulElement.offsetWidth;

    setCurrentItemIndex(index);
    setOffsetX(-(containerWidth * index));
  };

  return (
    <div className='slider'>
      <ul
        className={`slider__list ${isSwiping ? 'swiping' : ''}`}
        ref={ulRef}
        style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
        onMouseDown={onTouchStart}
        onTouchStart={onTouchStart}
      >
        {items.map((item, index) => (
          <SliderItem {...item} index={index} key={index} />
        ))}
      </ul>
      <ul className='slider__navigation'>
        {items.map((_item, index) => (
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
