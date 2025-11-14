"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

import ClearIcon from "../icons/ClearIcon";
import { MultiSelectOption, OptionGroup, MultiSelectProps } from "./types";
import styles from "./GlassMultiSelect.module.css";

type InternalOption<T extends string | number> = MultiSelectOption<T> & {
  __isCreatable__?: boolean;
};

const defaultFilter = <T extends string | number>(
  option: MultiSelectOption<T>,
  input: string
): boolean => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

const valueKey = <T extends string | number>(
  option: MultiSelectOption<T>
): string => {
  if (option.id !== undefined) return String(option.id);
  return String(option.value);
};

const normalizeValue = <T extends string | number>(
  value: T | undefined | null
): string => {
  if (value === undefined || value === null) return "";
  return String(value);
};

const mergeOptionCollections = <T extends string | number>(
  options: MultiSelectOption<T>[],
  groups?: OptionGroup<T>[],
  withGroups?: boolean
) => {
  if (withGroups && groups && groups.length > 0) {
    return groups.flatMap((group) => group.options ?? []);
  }
  return options ?? [];
};

const buildOptionLookup = <T extends string | number>(
  options: MultiSelectOption<T>[]
) => {
  const map = new Map<string, MultiSelectOption<T>>();
  options.forEach((option) => {
    map.set(valueKey(option), option);
  });
  return map;
};

function ensureOption<T extends string | number>(
  optionLookup: Map<string, MultiSelectOption<T>>,
  value: T
): MultiSelectOption<T> {
  const existing = optionLookup.get(String(value));
  if (existing) return existing;
  return {
    value,
    label: String(value),
  };
}

function flattenGroups<T extends string | number>(
  groups: OptionGroup<T>[] | undefined,
  fallbackOptions: MultiSelectOption<T>[],
  withGroups?: boolean
): { group?: OptionGroup<T>; options: MultiSelectOption<T>[] }[] {
  if (withGroups && groups && groups.length > 0) {
    return groups.map((group) => ({ group, options: group.options ?? [] }));
  }
  return [{ options: fallbackOptions }];
}

const createCreatableOption = <T extends string | number>(
  inputValue: string
): InternalOption<T> => ({
  id: `__creatable__${inputValue}`,
  value: inputValue as unknown as T,
  label: inputValue,
  __isCreatable__: true,
});

const GlassMultiSelectInternal = <T extends string | number = string | number>(
  props: MultiSelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    options = [],
    groups,
    withGroups,
    value,
    defaultValue,
    onChange,
    placeholder = "Select…",
    label,
    helperText,
    error,
    errorMessage,
    fullWidth,
    width,
    size = "medium",
    disabled,
    searchable = true,
    clearable = true,
    creatable,
    closeOnSelect = true,
    clearInputOnSelect = true,
    keyboardNavigation = true,
    filterOptions,
    filterFunction,
    onCreateOption,
    onInputChange,
    onRemove,
    onSelect,
    onOpen,
    onClose,
    loading,
    loadingText = "Loading…",
    noOptionsText = "No options",
    renderOption,
    renderToken,
    renderValue,
    renderGroup,
    maxSelections,
    maxHeight = 280,
    openUp,
    ariaLabel,
    autoFocus,
    dataTestId,
    id,
    className,
    style,
  } = props;

  const generatedId = useId();
  const inputId = id ?? `glass-multi-select-${generatedId}`;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [openDirectionUp, setOpenDirectionUp] = useState<boolean | undefined>(
    undefined
  );

  const allOptions = useMemo(
    () => mergeOptionCollections<T>(options, groups, withGroups),
    [options, groups, withGroups]
  );

  const optionLookup = useMemo(
    () => buildOptionLookup(allOptions),
    [allOptions]
  );

  const initializeValue = useCallback(
    (values: T[] | undefined): MultiSelectOption<T>[] => {
      if (!values || values.length === 0) return [];
      return values.map((val) => ensureOption(optionLookup, val));
    },
    [optionLookup]
  );

  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState<
    MultiSelectOption<T>[]
  >(() => initializeValue(isControlled ? (value as T[]) : defaultValue));

  const selectedOptions = isControlled
    ? initializeValue(value as T[])
    : internalSelected;

  const notifyChange = useCallback(
    (next: MultiSelectOption<T>[]) => {
      const valuesOnly = next.map((opt) => opt.value);
      onChange?.(valuesOnly);
    },
    [onChange]
  );

  const updateSelected = useCallback(
    (next: MultiSelectOption<T>[]) => {
      if (!isControlled) {
        setInternalSelected(next);
      }
      notifyChange(next);
    },
    [isControlled, notifyChange]
  );

  useEffect(() => {
    if (isControlled) {
      setInternalSelected(initializeValue(value as T[]));
    }
  }, [isControlled, value, optionLookup]);

  useEffect(() => {
    if (!isOpen) return;
    if (openUp !== undefined) {
      setOpenDirectionUp(openUp);
      return;
    }
    const container = rootRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const availableBelow = viewportHeight - rect.bottom;
    const availableAbove = rect.top;
    const shouldOpenUp =
      availableBelow < 200 && availableAbove > availableBelow;
    setOpenDirectionUp(shouldOpenUp);
  }, [isOpen, openUp]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      const container = rootRef.current;
      if (!container) return;
      if (!container.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const groupedOptions = useMemo(
    () => flattenGroups(groups, options, withGroups),
    [groups, options, withGroups]
  );

  const filteredGroups = useMemo(() => {
    if (!searchable || !inputValue.trim()) {
      return groupedOptions;
    }

    const userFilter = (opts: MultiSelectOption<T>[]) => {
      if (filterOptions) {
        try {
          return filterOptions(opts, inputValue);
        } catch (error) {
          return opts;
        }
      }

      if (filterFunction) {
        try {
          const result = filterFunction(opts, inputValue);
          if (Array.isArray(result)) {
            return result;
          }
          // Allow predicate-style fallthrough
        } catch (error) {
          // Fallthrough to default filter
        }
      }

      return opts.filter((option) => defaultFilter(option, inputValue));
    };

    const filteredFlat = userFilter(allOptions);
    const allowedKeys = new Set(filteredFlat.map((option) => valueKey(option)));

    return groupedOptions
      .map((group) => ({
        group: group.group,
        options: group.options.filter((option) =>
          allowedKeys.has(valueKey(option))
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [
    searchable,
    inputValue,
    groupedOptions,
    filterOptions,
    filterFunction,
    allOptions,
  ]);

  const flatOptionList: InternalOption<T>[] = useMemo(() => {
    const flattened: InternalOption<T>[] = [];
    filteredGroups.forEach(({ options: groupOptions }) => {
      flattened.push(...groupOptions);
    });

    if (creatable && inputValue.trim()) {
      const existing = flattened.find(
        (option) =>
          normalizeValue(option.value) ===
          normalizeValue(inputValue as unknown as T)
      );
      if (!existing) {
        flattened.push(createCreatableOption<T>(inputValue.trim()));
      }
    }

    return flattened;
  }, [filteredGroups, creatable, inputValue]);

  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
      return;
    }
    if (keyboardNavigation) {
      setFocusedIndex(flatOptionList.length > 0 ? 0 : -1);
    }
  }, [isOpen, flatOptionList, keyboardNavigation]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (!isOpen) {
      setIsOpen(true);
      onOpen?.();
    }
  }, [disabled, isOpen, onOpen]);

  const handleClose = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    }
  }, [isOpen, onClose]);

  const handleSelectOption = useCallback(
    (option: InternalOption<T>) => {
      if (option.disabled) return;
      if (option.__isCreatable__) {
        onCreateOption?.(option.label);
      }

      const alreadySelected = selectedOptions.some(
        (selected) =>
          normalizeValue(selected.value) === normalizeValue(option.value)
      );

      let nextSelected: MultiSelectOption<T>[];

      if (alreadySelected) {
        nextSelected = selectedOptions.filter(
          (selected) =>
            normalizeValue(selected.value) !== normalizeValue(option.value)
        );
        onRemove?.(option.value);
      } else {
        if (maxSelections && selectedOptions.length >= maxSelections) {
          return;
        }
        nextSelected = [...selectedOptions, option];
        onSelect?.(option);
      }

      updateSelected(nextSelected);

      if (clearInputOnSelect) {
        setInputValue("");
        onInputChange?.("");
      }

      if (closeOnSelect) {
        handleClose();
      }
    },
    [
      selectedOptions,
      updateSelected,
      clearInputOnSelect,
      closeOnSelect,
      handleClose,
      onInputChange,
      onSelect,
      onCreateOption,
      maxSelections,
    ]
  );

  const handleRemoveOption = useCallback(
    (option: MultiSelectOption<T>) => {
      const next = selectedOptions.filter(
        (selected) =>
          normalizeValue(selected.value) !== normalizeValue(option.value)
      );
      updateSelected(next);
      onRemove?.(option.value);
    },
    [selectedOptions, onRemove, updateSelected]
  );

  const handleClearAll = useCallback(() => {
    selectedOptions.forEach((option) => {
      onRemove?.(option.value);
    });
    updateSelected([]);
    setInputValue("");
    onInputChange?.("");
  }, [selectedOptions, onRemove, onInputChange, updateSelected]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setInputValue(nextValue);
      onInputChange?.(nextValue);
      if (!isOpen) {
        setIsOpen(true);
        onOpen?.();
      }
    },
    [isOpen, onInputChange, onOpen]
  );

  const focusPrevious = useCallback(() => {
    setFocusedIndex((prev) => {
      if (!keyboardNavigation) return prev;
      if (flatOptionList.length === 0) return -1;
      const nextIndex = prev <= 0 ? flatOptionList.length - 1 : prev - 1;
      return nextIndex;
    });
  }, [flatOptionList.length, keyboardNavigation]);

  const focusNext = useCallback(() => {
    setFocusedIndex((prev) => {
      if (!keyboardNavigation) return prev;
      if (flatOptionList.length === 0) return -1;
      const nextIndex = prev >= flatOptionList.length - 1 ? 0 : prev + 1;
      return nextIndex;
    });
  }, [flatOptionList.length, keyboardNavigation]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          handleOpen();
          focusNext();
          break;
        case "ArrowUp":
          event.preventDefault();
          handleOpen();
          focusPrevious();
          break;
        case "Enter":
          if (
            isOpen &&
            focusedIndex >= 0 &&
            focusedIndex < flatOptionList.length
          ) {
            event.preventDefault();
            handleSelectOption(flatOptionList[focusedIndex]);
          }
          break;
        case "Escape":
          if (isOpen) {
            event.preventDefault();
            handleClose();
          }
          break;
        case "Backspace":
          if (inputValue === "" && selectedOptions.length > 0) {
            event.preventDefault();
            const lastOption = selectedOptions[selectedOptions.length - 1];
            handleRemoveOption(lastOption);
          }
          break;
        default:
          break;
      }
    },
    [
      disabled,
      handleOpen,
      focusNext,
      focusPrevious,
      isOpen,
      focusedIndex,
      flatOptionList,
      handleSelectOption,
      handleClose,
      inputValue,
      selectedOptions,
      handleRemoveOption,
    ]
  );

  const handleContainerClick = useCallback(() => {
    if (disabled) return;
    handleOpen();
    inputRef.current?.focus();
  }, [disabled, handleOpen]);

  const dropdownMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

  const renderTokens = () => {
    if (renderValue) {
      return renderValue(selectedOptions);
    }

    return selectedOptions.map((option) => {
      if (renderToken) {
        return (
          <div
            key={valueKey(option)}
            className={cn("galileo-multiselect-token-wrapper")}
          >
            {renderToken(option, () => handleRemoveOption(option))}
          </div>
        );
      }

      return (
        <span
          key={valueKey(option)}
          className={cn(
            styles.token,
            "galileo-multiselect-token",
            option.disabled && styles.tokenDisabled
          )}
        >
          <span className={styles.tokenLabel}>{option.label}</span>
          {!disabled && !option.disabled && (
            <button
              type="button"
              className={cn(styles.removeButton, "remove-button")}
              onClick={(event) => {
                event.stopPropagation();
                handleRemoveOption(option);
              }}
              aria-label={`Remove ${option.label}`}
            >
              <ClearIcon />
            </button>
          )}
        </span>
      );
    });
  };

  const dropdownClassName = cn(
    styles.dropdown,
    isOpen && styles.dropdownVisible,
    openDirectionUp && styles.dropdownAbove
  );

  const containerClassName = cn(
    styles.container,
    styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
    error && styles.containerError,
    disabled && styles.containerDisabled,
    !disabled && isOpen && styles.containerFocused
  );

  const rootClassName = cn(
    styles.root,
    fullWidth && styles.rootFullWidth,
    className
  );

  const resolvedWidthValue = fullWidth
    ? "100%"
    : width
      ? typeof width === "number"
        ? `${width}px`
        : width
      : undefined;

  const inlineStyle: React.CSSProperties = {
    ...(style ?? {}),
  };

  if (resolvedWidthValue) {
    (inlineStyle as Record<string, unknown>)["--multi-select-width"] =
      resolvedWidthValue;
  }

  (inlineStyle as Record<string, unknown>)["--multi-select-dropdown-height"] =
    dropdownMaxHeight;

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      className={rootClassName}
      style={inlineStyle}
      data-testid={dataTestId}
    >
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div
        className={containerClassName}
        onClick={handleContainerClick}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        aria-controls={
          isOpen && flatOptionList.length > 0 ? `${inputId}-listbox` : undefined
        }
      >
        <div className={styles.tokenList}>
          {selectedOptions.length > 0
            ? renderTokens()
            : !inputValue && (
                <span className={styles.placeholder}>{placeholder}</span>
              )}

          <input
            ref={inputRef}
            id={inputId}
            className={styles.input}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleOpen}
            onKeyDown={handleKeyDown}
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            disabled={disabled || !searchable}
            aria-autocomplete="list"
            aria-controls={
              isOpen && flatOptionList.length > 0
                ? `${inputId}-listbox`
                : undefined
            }
            aria-label={ariaLabel || label || placeholder}
            autoComplete="off"
          />
        </div>

        {clearable && selectedOptions.length > 0 && !disabled && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={(event) => {
              event.stopPropagation();
              handleClearAll();
            }}
            aria-label="Clear all selections"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {helperText && !error && (
        <div className={styles.helperText}>{helperText}</div>
      )}

      {error && errorMessage && (
        <div className={styles.errorText}>{errorMessage}</div>
      )}

      <div ref={dropdownRef} className={dropdownClassName} role="presentation">
        {loading && (
          <div className={styles.loading}>
            <span className={styles.spinner} aria-hidden="true" />
            <span>{loadingText}</span>
          </div>
        )}

        {!loading && flatOptionList.length === 0 && (
          <div className={styles.noOptions}>{noOptionsText}</div>
        )}

        {!loading && flatOptionList.length > 0 && (
          <ul
            className={styles.optionList}
            role="listbox"
            id={`${inputId}-listbox`}
          >
            {filteredGroups.map(({ group, options: groupOptions }) => (
              <React.Fragment
                key={group?.id ?? group?.label ?? "group-default"}
              >
                {group?.label &&
                  (renderGroup ? (
                    renderGroup(group)
                  ) : (
                    <li className={styles.groupHeader}>{group.label}</li>
                  ))}

                {groupOptions.map((option) => {
                  const key = valueKey(option);
                  const isSelected = selectedOptions.some(
                    (selected) =>
                      normalizeValue(selected.value) ===
                      normalizeValue(option.value)
                  );
                  const optionIndex = flatOptionList.findIndex(
                    (item) =>
                      normalizeValue(item.value) ===
                      normalizeValue(option.value)
                  );
                  const isFocused = optionIndex === focusedIndex;
                  const optionClassName = cn(
                    styles.option,
                    isSelected && styles.optionSelected,
                    isFocused && styles.optionFocused,
                    option.disabled && styles.optionDisabled
                  );

                  return (
                    <li
                      key={key}
                      role="option"
                      aria-selected={isSelected}
                      className={optionClassName}
                      onClick={(event) => {
                        event.preventDefault();
                        handleSelectOption(option);
                      }}
                      onMouseEnter={() => setFocusedIndex(optionIndex)}
                    >
                      {renderOption
                        ? renderOption(option, isSelected)
                        : option.label}
                    </li>
                  );
                })}
              </React.Fragment>
            ))}

            {flatOptionList.length > 0 &&
              creatable &&
              inputValue.trim() &&
              (() => {
                const creatableOption = flatOptionList.find(
                  (opt) => opt.__isCreatable__
                );
                if (!creatableOption) return null;
                const optionIndex = flatOptionList.findIndex(
                  (item) => item.__isCreatable__
                );
                const optionClassName = cn(
                  styles.option,
                  optionIndex === focusedIndex && styles.optionFocused
                );
                return (
                  <li
                    key={creatableOption.id}
                    className={optionClassName}
                    onClick={(event) => {
                      event.preventDefault();
                      handleSelectOption(creatableOption);
                    }}
                    onMouseEnter={() => setFocusedIndex(optionIndex)}
                  >
                    Create “{inputValue.trim()}”
                  </li>
                );
              })()}
          </ul>
        )}
      </div>
    </div>
  );
};

function mergeRefs<T>(
  forwardedRef: React.ForwardedRef<T>,
  localRef: React.MutableRefObject<T | null>
) {
  return (value: T | null) => {
    localRef.current = value;
    if (typeof forwardedRef === "function") {
      forwardedRef(value);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<T | null>).current = value;
    }
  };
}

export const GlassMultiSelect = forwardRef(GlassMultiSelectInternal) as <
  T extends string | number = string | number,
>(
  props: MultiSelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

(GlassMultiSelect as any).displayName = "GlassMultiSelect";

export default GlassMultiSelect;
