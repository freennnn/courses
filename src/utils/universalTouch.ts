import React from 'react';

export function getTouchEventData(
  event: TouchEvent | MouseEvent | React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
) {
  return 'changedTouches' in event ? event.changedTouches[0] : event;
}
