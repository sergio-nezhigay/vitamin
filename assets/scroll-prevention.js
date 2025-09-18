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

  // CSS prevention styles with scrollbar space preservation
  const preventionStyle = document.createElement('style');
  preventionStyle.textContent = `
    /* Method 1: Hide overflow but preserve scrollbar space */
    .scroll-prevention-active.method-hidden {
      overflow: hidden !important;
      position: fixed !important;
      width: 100% !important;
      height: 100% !important;
    }

    .scroll-prevention-active.method-hidden.has-scrollbar {
      padding-right: var(--scrollbar-width, 0) !important;
    }

    /* Method 2: Keep scrollbar visible but disable scrolling (smoother) */
    .scroll-prevention-active.method-disabled {
      position: fixed !important;
      width: 100% !important;
      height: 100% !important;
      overflow-y: scroll !important;
      top: var(--scroll-lock-offset, 0);
    }

    /* Modern approach using scrollbar-gutter if supported */
    @supports (scrollbar-gutter: stable) {
      .scroll-prevention-active.method-modern {
        scrollbar-gutter: stable;
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
      }
    }
  `;
  document.head.appendChild(preventionStyle);

  // Calculate and store scrollbar width
  const getScrollbarWidth = () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

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

  // Detect best scroll prevention method
  const getBestPreventionMethod = () => {
    // Check for modern scrollbar-gutter support
    if (CSS.supports && CSS.supports('scrollbar-gutter', 'stable')) {
      return 'method-modern';
    }

    // Use visible scrollbar method (smoothest for most browsers)
    return 'method-disabled';
  };

  // Enable scroll prevention
  const enablePrevention = () => {
    if (scrollPrevented) return;

    scrollPrevented = true;
    log('Scroll prevention enabled');

    const method = getBestPreventionMethod();

    if (method === 'method-disabled') {
      // Store current scroll position and set offset
      const currentScroll = window.pageYOffset || window.scrollY;
      document.documentElement.style.setProperty('--scroll-lock-offset', `-${currentScroll}px`);
      document.documentElement.classList.add('scroll-prevention-active', method);
    } else if (method === 'method-modern') {
      // Modern browsers with scrollbar-gutter support
      document.documentElement.classList.add('scroll-prevention-active', method);
    } else {
      // Fallback: calculate scrollbar width and preserve space
      const scrollbarWidth = getScrollbarWidth();
      const hasScrollbar = scrollbarWidth > 0 && document.body.scrollHeight > window.innerHeight;

      if (hasScrollbar) {
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
        document.documentElement.classList.add('scroll-prevention-active', 'method-hidden', 'has-scrollbar');
      } else {
        document.documentElement.classList.add('scroll-prevention-active', 'method-hidden');
      }
    }

    log('Using prevention method:', method);

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

    // Get current scroll offset if using method-disabled
    const scrollOffset = document.documentElement.style.getPropertyValue('--scroll-lock-offset');

    // Remove all CSS classes and properties
    document.documentElement.classList.remove(
      'scroll-prevention-active',
      'has-scrollbar',
      'method-hidden',
      'method-disabled',
      'method-modern'
    );
    document.documentElement.style.removeProperty('--scrollbar-width');
    document.documentElement.style.removeProperty('--scroll-lock-offset');

    // Restore scroll position if we were using method-disabled
    if (scrollOffset) {
      const scrollY = Math.abs(parseInt(scrollOffset));
      if (scrollY > 0) {
        setTimeout(() => window.scrollTo(0, scrollY), 0);
      }
    }

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