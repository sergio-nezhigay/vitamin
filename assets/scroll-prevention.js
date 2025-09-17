/**
 * Production Scroll Prevention System
 * Prevents unwanted auto-scrolling during page load caused by app scripts focusing elements
 *
 * Configuration is passed via window.SCROLL_PREVENTION_CONFIG
 */

(function() {
  'use strict';

  // Get configuration from global scope (set by theme.liquid)
  const config = window.SCROLL_PREVENTION_CONFIG || {
    enabled: true,
    duration: 4000,
    debug: false,
    blockElements: 'input[type="radio"], input, select, textarea, button'
  };

  if (!config.enabled) return;

  let scrollPrevented = false;
  let cleanupFunctions = [];

  // Store original functions
  const original = {
    scrollTo: window.scrollTo,
    scrollBy: window.scrollBy,
    scrollIntoView: Element.prototype.scrollIntoView,
    focus: HTMLElement.prototype.focus
  };

  const log = (...args) => {
    if (config.debug) console.log('[ScrollPrevention]', ...args);
  };

  // CSS prevention styles
  const preventionStyle = document.createElement('style');
  preventionStyle.textContent = `
    .scroll-prevention-active {
      overflow: hidden !important;
      position: fixed !important;
      width: 100% !important;
      height: 100% !important;
    }
  `;
  document.head.appendChild(preventionStyle);

  // Override scroll functions
  window.scrollTo = function(...args) {
    if (scrollPrevented) {
      log('Blocked scrollTo:', args);
      return;
    }
    return original.scrollTo.apply(this, args);
  };

  window.scrollBy = function(...args) {
    if (scrollPrevented) {
      log('Blocked scrollBy:', args);
      return;
    }
    return original.scrollBy.apply(this, args);
  };

  Element.prototype.scrollIntoView = function(...args) {
    if (scrollPrevented) {
      log('Blocked scrollIntoView on:', this.tagName, this.className);
      return;
    }
    return original.scrollIntoView.apply(this, args);
  };

  HTMLElement.prototype.focus = function(...args) {
    try {
      if (scrollPrevented && this.matches && this.matches(config.blockElements)) {
        log('Blocked focus on:', this.tagName, this.type, this.name);
        return;
      }
      return original.focus.apply(this, args);
    } catch (e) {
      log('Focus override error:', e);
      return original.focus.apply(this, args);
    }
  };

  // Event prevention
  const preventEvent = (e) => {
    if (scrollPrevented) {
      e.preventDefault();
      e.stopPropagation();
      log('Blocked event:', e.type);
      return false;
    }
  };

  const preventFocus = (e) => {
    try {
      if (scrollPrevented && e && e.target && e.target.matches && e.target.matches(config.blockElements)) {
        e.preventDefault();
        e.stopPropagation();
        log('Blocked focus event on:', e.target.tagName, e.target.type);
        return false;
      }
    } catch (error) {
      log('Focus prevention error:', error);
    }
  };

  // Enable scroll prevention
  const enablePrevention = () => {
    if (scrollPrevented) return;

    scrollPrevented = true;
    log('Scroll prevention enabled');

    // Add CSS lock
    document.documentElement.classList.add('scroll-prevention-active');

    // Add event listeners
    const events = [
      { target: window, events: ['scroll', 'wheel'], handler: preventEvent },
      { target: document, events: ['wheel', 'touchmove'], handler: preventEvent },
      { target: document, events: ['focus', 'focusin'], handler: preventFocus }
    ];

    events.forEach(({ target, events: eventList, handler }) => {
      eventList.forEach(eventType => {
        target.addEventListener(eventType, handler, { passive: false, capture: true });
        cleanupFunctions.push(() => target.removeEventListener(eventType, handler, { capture: true }));
      });
    });

    // Prevent keyboard scrolling
    const preventKeyboard = (e) => {
      if (scrollPrevented && [32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        log('Blocked scroll key:', e.keyCode);
      }
    };
    document.addEventListener('keydown', preventKeyboard, { capture: true });
    cleanupFunctions.push(() => document.removeEventListener('keydown', preventKeyboard, { capture: true }));
  };

  // Disable scroll prevention
  const disablePrevention = () => {
    if (!scrollPrevented) return;

    scrollPrevented = false;
    log('Scroll prevention disabled');

    // Remove CSS lock
    document.documentElement.classList.remove('scroll-prevention-active');

    // Clean up event listeners
    cleanupFunctions.forEach(cleanup => cleanup());
    cleanupFunctions = [];

    // Restore original functions
    window.scrollTo = original.scrollTo;
    window.scrollBy = original.scrollBy;
    Element.prototype.scrollIntoView = original.scrollIntoView;
    HTMLElement.prototype.focus = original.focus;
  };

  // Auto-enable on DOM ready and auto-disable after timeout
  const initScrollPrevention = () => {
    try {
      enablePrevention();

      setTimeout(() => {
        try {
          disablePrevention();
        } catch (e) {
          log('Disable error:', e);
        }
      }, config.duration);
    } catch (error) {
      log('Initialization error:', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollPrevention);
  } else {
    // DOM already loaded
    initScrollPrevention();
  }

  // Global access for manual control (useful for debugging)
  window.scrollPrevention = {
    enable: enablePrevention,
    disable: disablePrevention,
    isEnabled: () => scrollPrevented
  };

})();