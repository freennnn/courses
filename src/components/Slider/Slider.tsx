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
  // 1) isSwiping needed for css transition style - while actively swiping no need for delay/animation
  // 2) isSwipingRef needed to check if the gesture was a swipe (even if the swipe was out of bounds and
  // we didn't update offsetX - to distinguish out of bounds swipe attempt from just a click.
  const [isSwiping, setIsSwiping, isSwipingRef] = useStateRef(false);
  // value for translate3d/translateX css property of slider in render (representing real time offset of the slider).
  // Initially set to 0 - showing 1st image. (-image.width*n) will show n-th element.
  // Combined state + ref: offSetXRef is used in touch callbacks to get updated offSetX value during same render
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  // current offset during one touch (when scrolling/swiping) - equals to offsetXRef on TouchStart
  const touchStartOffsetXRef = useRef(0);
  // Touch start x position
  const touchStartXRef = useRef(0);

  // 0 - cause user can't scroll pass the first image to the left. Scrolls to the right will have negative offset (minOffset)
  const maxOffsetX = 0;
  const minOffsetXRef = useRef(0);

  const MIN_SWIPE_LENGTH = 50;

  // slider element to which we apply offsetX via translate3d property
  const ulRef = useRef<HTMLUListElement>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(selectedIndex);

  const onTouchStart = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    touchStartOffsetXRef.current = getRefValue(offsetXRef);
    touchStartXRef.current = getTouchEventData(e).clientX;
    const ulElement = getRefValue(ulRef);

    // visible width of container (1 element since it's 100% width) - whole (scrollable) content
    // width of slider. Negative value, ex: 640 - 3200(aka 640*5) = -2400
    minOffsetXRef.current = ulElement.offsetWidth - ulElement.scrollWidth;

    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('contextmenu', onContextMenu);
  };

  const onTouchMove = (e: MouseEvent | TouchEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const difference = getRefValue(touchStartXRef) - currentX;
    let newOffsetX = getRefValue(touchStartOffsetXRef) - difference;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }
    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }

    // console.log(`onTouchMove with difference ${difference}`);
    // not considering a gesture a swipe, if touchMove got triggered way too sensitive, with 0 position change
    if (difference > 0) setIsSwiping(true);

    //re-render to scroll slider
    setOffsetX(newOffsetX);
    //console.log(`touch Move with newOffSet ${newOffsetX} and isSwiping ${getRefValue(isSwipingRef)}`);
  };

  const onTouchEnd = () => {
    const ulElement = getRefValue(ulRef);
    // no borders/scrollbars, so technically same as offsetWidth (in former minOffsetXRef calculation)
    const containerWidth = ulElement.clientWidth;
    const touchStartOffsetX = getRefValue(touchStartOffsetXRef);
    // using offsetXRef instead of offsetX cause slider might not have rerendered yet (hence state counterpart variable is not updated)
    let newOffsetX = getRefValue(offsetXRef);
    const difference = touchStartOffsetX - newOffsetX;

    if (Math.abs(difference) > MIN_SWIPE_LENGTH) {
      if (difference > 0) {
        // swipe to the right (rounding offset exactly to the next element start)
        newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth;
      } else {
        // to the left
        newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth;
      }
    } else {
      // not a significant enought swipe, scroll back to current image
      newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth;
    }

    // difference could be zero in case out of bounds swipe (we check max/min offset boundaries
    // in touchMove). So additinal check for isSwiping (again Ref counterpart isntead of State)
    //console.log(`touchEnd with difference ${difference} and isSwiping ${isSwiping} and isSwipingRef ${getRefValue(isSwipingRef)} `);
    if (difference === 0 && !getRefValue(isSwipingRef)) {
      //console.log(`click with difference ${difference} and isSwiping ${isSwiping} `);
      items[currentItemIndex].onClickHandler?.(currentItemIndex);
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentItemIndex(Math.abs(newOffsetX / containerWidth));

    window.removeEventListener('mouseup', onTouchEnd);
    window.removeEventListener('mousemove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('contextmenu', onContextMenu);
  };

  // disable Context menu on long touch
  const onContextMenu = (e: Event) => {
    e.preventDefault();
  };

  useEffect(() => {
    // console.log(`useEffect selectItemAtIndex wiht currentItemIndex ${currentItemIndex}`);
    // in case initially we want to show non first slider item
    selectItemAtIndex(currentItemIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
