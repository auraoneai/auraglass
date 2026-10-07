/**
 * AuraGlass Browser Compatibility Layer
 * Polyfills and fallbacks for maximum browser support
 */

export class CompatibilityLayer {
  private static instance: CompatibilityLayer;
  private capabilities: Map<string, boolean> = new Map();
  
  private constructor() {
    this.detectCapabilities();
    this.applyPolyfills();
  }
  
  static getInstance(): CompatibilityLayer {
    if (!CompatibilityLayer.instance) {
      CompatibilityLayer.instance = new CompatibilityLayer();
    }
    return CompatibilityLayer.instance;
  }
  
  /**
   * Detect browser capabilities
   */
  private detectCapabilities() {
    if (typeof window === 'undefined') return;
    
    // Backdrop filter support
    this.capabilities.set('backdropFilter', CSS.supports('backdrop-filter', 'blur(10px)'));
    
    // Focus-visible support
    this.capabilities.set('focusVisible', CSS.supports(':focus-visible'));
    
    // Gap property support
    this.capabilities.set('gap', CSS.supports('gap', '1rem'));
    
    // Aspect ratio support
    this.capabilities.set('aspectRatio', CSS.supports('aspect-ratio', '16/9'));
    
    // Container queries support
    this.capabilities.set('containerQueries', CSS.supports('container-type', 'inline-size'));
    
    // Subgrid support
    this.capabilities.set('subgrid', CSS.supports('grid-template-columns', 'subgrid'));
    
    // Has selector support
    this.capabilities.set('has', CSS.supports(':has(*)'));
    
    // Text wrap balance support
    this.capabilities.set('textWrapBalance', CSS.supports('text-wrap', 'balance'));
    
    // Inert attribute support
    this.capabilities.set('inert', 'inert' in HTMLElement.prototype);
    
    // WebP support
    this.detectWebPSupport();
    
    // AVIF support
    this.detectAVIFSupport();
  }
  
  /**
   * Apply necessary polyfills
   */
  private applyPolyfills() {
    if (typeof document === 'undefined') return;
    
    // Polyfill for focus-visible
    if (!this.capabilities.get('focusVisible')) {
      this.polyfillFocusVisible();
    }
    
    // Polyfill for inert
    if (!this.capabilities.get('inert')) {
      this.polyfillInert();
    }
    
    // Fallback for backdrop-filter
    if (!this.capabilities.get('backdropFilter')) {
      this.addBackdropFilterFallback();
    }
    
    // Fallback for text-wrap: balance
    if (!this.capabilities.get('textWrapBalance')) {
      this.polyfillTextBalance();
    }
  }
  
  /**
   * Focus-visible polyfill
   */
  private polyfillFocusVisible() {
    const style = document.createElement('style');
    style.textContent = `
      .glass-focus:focus:not(:focus-visible) {
        outline: none;
      }
      .glass-focus.focus-visible {
        outline: var(--glass-focus-width) solid var(--glass-focus-color);
        outline-offset: var(--glass-focus-offset);
      }
    `;
    document.head.appendChild(style);
    
    // Add focus-visible class on keyboard navigation
    let hadKeyboardEvent = false;
    
    const keydownHandler = () => {
      hadKeyboardEvent = true;
    };
    
    const focusHandler = (e: FocusEvent) => {
      if (hadKeyboardEvent || (e.target as HTMLElement).matches(':focus-visible')) {
        (e.target as HTMLElement).classList.add('focus-visible');
      }
    };
    
    const blurHandler = (e: FocusEvent) => {
      (e.target as HTMLElement).classList.remove('focus-visible');
    };
    
    const clickHandler = () => {
      hadKeyboardEvent = false;
    };
    
    document.addEventListener('keydown', keydownHandler, true);
    document.addEventListener('focus', focusHandler, true);
    document.addEventListener('blur', blurHandler, true);
    document.addEventListener('click', clickHandler, true);
  }
  
  /**
   * Inert attribute polyfill
   */
  private polyfillInert() {
    Object.defineProperty(HTMLElement.prototype, 'inert', {
      get() {
        return this.hasAttribute('inert');
      },
      set(value) {
        if (value) {
          this.setAttribute('inert', '');
          // Make element non-interactive
          this.setAttribute('aria-hidden', 'true');
          this.style.pointerEvents = 'none';
          this.style.userSelect = 'none';
          
          // Disable all focusable children
          const focusable = this.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          focusable.forEach((el: Element) => {
            el.setAttribute('tabindex', '-1');
            el.setAttribute('data-inert-tabindex', el.getAttribute('tabindex') || '0');
          });
        } else {
          this.removeAttribute('inert');
          this.removeAttribute('aria-hidden');
          this.style.pointerEvents = '';
          this.style.userSelect = '';
          
          // Restore focusable children
          const focusable = this.querySelectorAll('[data-inert-tabindex]');
          focusable.forEach((el: Element) => {
            el.setAttribute('tabindex', el.getAttribute('data-inert-tabindex') || '0');
            el.removeAttribute('data-inert-tabindex');
          });
        }
      },
    });
  }
  
  /**
   * Backdrop filter fallback
   */
  private addBackdropFilterFallback() {
    const style = document.createElement('style');
    style.textContent = `
      /* Fallback for browsers without backdrop-filter support */
      @supports not (backdrop-filter: blur(0)) {
        .glass-foundation-complete,
        .glass-blur-sm,
        .glass-blur-md,
        .glass-blur-lg,
        .glass-blur-xl {
          background: rgba(var(--glass-color-black) / 0.85) !important;
          position: relative;
        }
        
        .glass-foundation-complete::before,
        .glass-blur-sm::before,
        .glass-blur-md::before,
        .glass-blur-lg::before,
        .glass-blur-xl::before {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          filter: blur(8px);
          z-index: -1;
          opacity: 0.5;
        }
        
        /* Enhance borders and shadows for depth */
        .glass-foundation-complete {
          border-width: 2px;
          box-shadow: var(--glass-elev-3);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Text balance polyfill
   */
  private polyfillTextBalance() {
    // Simple text balancing algorithm
    const balanceText = (element: HTMLElement) => {
      const text = element.textContent || '';
      const words = text.split(' ');
      
      if (words.length < 3) return;
      
      // Try to balance lines
      const midpoint = Math.ceil(words.length / 2);
      const firstHalf = words.slice(0, midpoint).join(' ');
      const secondHalf = words.slice(midpoint).join(' ');
      
      // Add soft break opportunity
      element.innerHTML = `${firstHalf}<wbr>${secondHalf}`;
    };
    
    // Apply to all elements with text-balance class
    document.querySelectorAll('.glass-text-balance').forEach((el: Element) => {
      balanceText(el as HTMLElement);
    });
    
    // Observer for dynamic content
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        if (mutation.type === 'childList' && mutation.target instanceof Element) {
          mutation.target.querySelectorAll('.glass-text-balance').forEach((el: Element) => {
            balanceText(el as HTMLElement);
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  /**
   * Detect WebP support
   */
  private detectWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const isSupported = canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
    this.capabilities.set('webp', isSupported);
  }
  
  /**
   * Detect AVIF support
   */
  private detectAVIFSupport() {
    const img = new Image();
    img.onload = () => this.capabilities.set('avif', true);
    img.onerror = () => this.capabilities.set('avif', false);
    img.src = 'data:image/avif;base64,AAAAFGZ0eXBhdmlmAAAAAG1pZjEAAACgbWV0YQAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAC8AAAAGwAAACgpaW5mAAAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAamlwcnAAAABLaXBjbwAAABNjb2xybmNseAABAA0ABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg';
  }
  
  /**
   * Check if a capability is supported
   */
  supports(capability: string): boolean {
    return this.capabilities.get(capability) || false;
  }
  
  /**
   * Get all capabilities
   */
  getCapabilities(): Record<string, boolean> {
    return Object.fromEntries(this.capabilities);
  }
  
  /**
   * Get recommended quality settings based on capabilities
   */
  getQualitySettings(): {
    blur: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    shadows: boolean;
    animations: boolean;
    parallax: boolean;
  } {
    const hasBackdrop = this.supports('backdropFilter');
    const hasGoodGPU = navigator.hardwareConcurrency > 4;
    
    return {
      blur: hasBackdrop ? (hasGoodGPU ? 'lg' : 'md') : 'none',
      shadows: true,
      animations: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      parallax: hasGoodGPU,
    };
  }
}

// Export singleton
export const compatibility = CompatibilityLayer.getInstance();