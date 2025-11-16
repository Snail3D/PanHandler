/**
 * Fake Touch Support for macOS
 * Allows the app to work with mouse/trackpad on macOS by converting mouse events to touch events
 */

import { Platform } from 'react-native';

export const enableFakeTouchSupport = () => {
  if (Platform.OS !== 'macos') {
    return;
  }

  // Convert mouse events to touch events for macOS
  if (typeof window !== 'undefined' && window.document) {
    const document = window.document;

    // Track mouse state
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Convert mousedown to touchstart
    document.addEventListener('mousedown', (e: MouseEvent) => {
      isMouseDown = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      const touch = new Touch({
        identifier: Date.now(),
        target: e.target as EventTarget,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        pageX: e.pageX,
        pageY: e.pageY,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 0,
        force: 1,
      });

      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [touch] as any,
        targetTouches: [touch] as any,
        changedTouches: [touch] as any,
      });

      (e.target as Element).dispatchEvent(touchEvent);
    }, true);

    // Convert mousemove to touchmove
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (isMouseDown) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        const touch = new Touch({
          identifier: Date.now(),
          target: e.target as EventTarget,
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          pageX: e.pageX,
          pageY: e.pageY,
          radiusX: 2.5,
          radiusY: 2.5,
          rotationAngle: 0,
          force: 1,
        });

        const touchEvent = new TouchEvent('touchmove', {
          bubbles: true,
          cancelable: true,
          touches: [touch] as any,
          targetTouches: [touch] as any,
          changedTouches: [touch] as any,
        });

        (e.target as Element).dispatchEvent(touchEvent);
      }
    }, true);

    // Convert mouseup to touchend
    document.addEventListener('mouseup', (e: MouseEvent) => {
      if (isMouseDown) {
        isMouseDown = false;

        const touchEvent = new TouchEvent('touchend', {
          bubbles: true,
          cancelable: true,
          touches: [] as any,
          targetTouches: [] as any,
          changedTouches: [] as any,
        });

        (e.target as Element).dispatchEvent(touchEvent);
      }
    }, true);

    console.log('✅ Fake touch support enabled for macOS');
  }
};

