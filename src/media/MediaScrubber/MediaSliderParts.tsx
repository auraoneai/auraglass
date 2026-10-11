'use client';
/* Slider parts shared by MediaScrubber and MediaControls.Volume: the Base UI
 * Control/Track/Indicator/Thumb set composed inside CMP Slider.Root (the
 * S-30 seam renders these same parts by default). Composing them here lets
 * the media slider (a) put aria-valuetext on the thumb input (CMP
 * Slider.Root forwards getAriaValueText to the Base UI root, which ignores
 * it), (b) mark the thumb transient glass only while it is dragged, and (c) join the MediaControls toolbar as a roving
 * item that keeps its own arrow keys (REQ-SURF-135/136). */
import * as React from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { CompositeItem } from '@base-ui/react/internals/composite';
import { materialProps } from '../../material';

/** Keys the slider owns while its thumb is focused; they must not bubble to
 * the toolbar's roving handler. */
const SLIDER_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']);

export interface MediaSliderPartsProps {
  'aria-label': string;
  getAriaValueText?: ((formattedValue: string, value: number, index: number) => string) | undefined;
  /** Dragging state owned by the parent (drives transient glass). */
  dragging: boolean;
  children?: React.ReactNode;
}

interface ThumbBindings {
  tabIndex?: number | undefined;
  onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
  inputRef?: React.Ref<HTMLInputElement> | undefined;
}

const ThumbBindingContext = React.createContext<ThumbBindings | null>(null);

type ItemProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> | undefined };

/**
 * Wrap a Slider.Root so its thumb input is one item of the surrounding
 * toolbar's roving focus. The composite item is registered here, outside the
 * slider (Base UI Slider keeps its own composite list for thumbs), and its
 * tabIndex/onFocus/ref are handed to the thumb input through context.
 */
export function SliderToolbarItem({ enabled, children }: { enabled: boolean | undefined; children: React.ReactNode }) {
  if (!enabled) return <>{children}</>;
  return (
    <CompositeItem
      render={(itemProps: ItemProps) => (
        <ThumbBindingContext.Provider
          value={{
            tabIndex: itemProps.tabIndex,
            onFocus: itemProps.onFocus as React.FocusEventHandler<HTMLInputElement> | undefined,
            inputRef: itemProps.ref as React.Ref<HTMLInputElement> | undefined,
          }}
        >
          {children}
        </ThumbBindingContext.Provider>
      )}
    />
  );
}

function Thumb({ dragging, getAriaValueText, ...rest }: {
  dragging: boolean;
  'aria-label': string;
  getAriaValueText?: MediaSliderPartsProps['getAriaValueText'];
}) {
  const bindings = React.useContext(ThumbBindingContext) ?? {};
  const transient = dragging ? materialProps({ layer: 'transient' }) : {};
  return (
    <BaseSlider.Thumb
      {...transient}
      data-ag-part="thumb"
      className="ag-media-scrubber-thumb"
      aria-label={rest['aria-label']}
      {...(getAriaValueText ? { getAriaValueText } : {})}
      {...(bindings.tabIndex !== undefined ? { tabIndex: bindings.tabIndex } : {})}
      {...(bindings.onFocus ? { onFocus: bindings.onFocus } : {})}
      {...(bindings.inputRef ? { inputRef: bindings.inputRef } : {})}
      onKeyDown={(e: React.KeyboardEvent) => { if (SLIDER_KEYS.has(e.key)) e.stopPropagation(); }}
    />
  );
}

export function MediaSliderParts({ dragging, getAriaValueText, children, ...rest }: MediaSliderPartsProps) {
  return (
    <BaseSlider.Control data-ag-part="control" className="ag-media-scrubber-control">
      <BaseSlider.Track data-ag-part="track" className="ag-media-scrubber-track">
        <BaseSlider.Indicator data-ag-part="range" />
        <Thumb dragging={dragging} aria-label={rest['aria-label']} getAriaValueText={getAriaValueText} />
      </BaseSlider.Track>
      {children}
    </BaseSlider.Control>
  );
}
