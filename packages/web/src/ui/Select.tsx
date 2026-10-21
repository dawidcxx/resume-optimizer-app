import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/cn";
import { inputSizes, type InputSize } from "./Input";

export type SelectItem<TValue extends string = string> = {
  label: string;
  value: TValue;
  icon?: ReactNode;
};

export type SelectOption<TValue extends string = string> = TValue | SelectItem<TValue>;

export type SelectProps<TValue extends string = string> = {
  value: TValue | null;
  options: readonly SelectOption<TValue>[];
  onChange: (value: TValue | null) => void;
  onBlur?: () => void;
  localOptions?: readonly SelectItem<TValue>[];
  onLocalOptionsChange?: (options: SelectItem<TValue>[]) => void;
  clearable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  size?: InputSize;
  className?: string;
  emptyMessage?: string;
  createMessage?: (input: string) => string;
  confirmMessage?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  ref?: Ref<HTMLInputElement>;
};

const selectBase = [
  "flex w-full rounded-ui border border-border bg-background text-foreground",
  "transition-colors placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const selectInvalid = "border-danger focus-visible:border-danger focus-visible:ring-danger";

function normalizeOption<TValue extends string>(option: SelectOption<TValue>): SelectItem<TValue> {
  return typeof option === "string" ? { label: option, value: option } : option;
}

export function Select<TValue extends string = string>({
  value,
  options,
  onChange,
  onBlur,
  localOptions = [],
  onLocalOptionsChange,
  clearable = true,
  placeholder = "",
  disabled = false,
  invalid = false,
  size = "md",
  className,
  emptyMessage = "No matching options",
  createMessage = (input) => `Create "${input}"`,
  confirmMessage = "Press Enter to confirm",
  id,
  name,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ref,
}: SelectProps<TValue>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-options`;

  const [isOpen, setIsOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    [ref],
  );

  const allOptions = useMemo(
    () => [...options.map(normalizeOption), ...localOptions],
    [localOptions, options],
  );

  const selectedOption = useMemo(() => {
    if (value === null || value === "") return null;
    return allOptions.find((option) => option.value === value) ?? { label: value, value };
  }, [allOptions, value]);

  const selectedLabel = selectedOption?.label ?? (value === null ? "" : value);
  const hasSelection = value !== null && value !== "";
  const renderedValue = isFiltering ? inputValue : selectedLabel;
  const normalizedInputValue = inputValue.trim();
  const normalizedQuery = normalizedInputValue.toLowerCase();

  useEffect(() => {
    if (!isFiltering) {
      setInputValue(selectedLabel);
    }
  }, [isFiltering, selectedLabel]);

  const visibleOptions = useMemo(() => {
    if (!isFiltering || !normalizedQuery) return allOptions;
    return allOptions.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [allOptions, isFiltering, normalizedQuery]);

  const canCreate =
    onLocalOptionsChange !== undefined &&
    isFiltering &&
    normalizedInputValue !== "" &&
    visibleOptions.length === 0 &&
    !allOptions.some((option) => option.label.toLowerCase() === normalizedQuery);

  function scrollToIndex(index: number) {
    const item = listRef.current?.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }

  function setFocusedIndexWithScroll(index: number) {
    const nextIndex = Number.isNaN(index) ? -1 : index;
    setFocusedIndex(nextIndex);
    queueMicrotask(() => scrollToIndex(nextIndex));
  }

  function resetDropdownState() {
    setIsOpen(false);
    setFocusedIndex(-1);
    setIsFiltering(false);
  }

  function closeDropdown(options: { restoreInput?: boolean } = {}) {
    resetDropdownState();
    if (options.restoreInput) {
      setInputValue(selectedLabel);
    }
  }

  function openDropdown() {
    setIsOpen(true);
    setIsFiltering(false);
    setFocusedIndexWithScroll(allOptions.findIndex((option) => option.value === value));
  }

  function commitSelection(option: SelectItem<TValue>) {
    onChange(option.value);
    closeDropdown();
  }

  function createOption() {
    if (!onLocalOptionsChange) return;
    const trimmedValue = normalizedInputValue as TValue;
    const nextOption: SelectItem<TValue> = { label: trimmedValue, value: trimmedValue };
    onLocalOptionsChange([...localOptions, nextOption]);
    onChange(nextOption.value);
    closeDropdown();
  }

  function clearSelection() {
    onChange(null);
    resetDropdownState();
    inputRef.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    setIsOpen(true);
    setIsFiltering(true);
    setFocusedIndex(-1);
  }

  function handleInputBlur(event: FocusEvent<HTMLInputElement>) {
    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && wrapperRef.current?.contains(relatedTarget)) {
      return;
    }
    closeDropdown({ restoreInput: true });
    onBlur?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && event.key === "ArrowDown") {
      event.preventDefault();
      openDropdown();
      return;
    }

    switch (event.key) {
      case "ArrowDown": {
        if (visibleOptions.length === 0) return;
        event.preventDefault();
        setFocusedIndexWithScroll(
          (focusedIndex + 1 + visibleOptions.length) % visibleOptions.length,
        );
        break;
      }
      case "ArrowUp": {
        if (visibleOptions.length === 0) return;
        event.preventDefault();
        setFocusedIndexWithScroll(
          (focusedIndex - 1 + visibleOptions.length) % visibleOptions.length,
        );
        break;
      }
      case "Enter": {
        if (event.ctrlKey && !isOpen) {
          event.currentTarget.closest("form")?.requestSubmit();
          return;
        }
        event.preventDefault();
        if (focusedIndex >= 0 && visibleOptions[focusedIndex]) {
          commitSelection(visibleOptions[focusedIndex]);
          return;
        }
        if (visibleOptions.length === 1) {
          commitSelection(visibleOptions[0]);
          return;
        }
        if (canCreate) {
          createOption();
          return;
        }
        if (hasSelection && normalizedInputValue === "") {
          clearSelection();
        }
        break;
      }
      case "Escape": {
        closeDropdown({ restoreInput: true });
        break;
      }
      default:
        break;
    }
  }

  function handleToggleClick() {
    if (disabled) return;
    if (isOpen) {
      closeDropdown({ restoreInput: true });
      return;
    }
    inputRef.current?.focus();
    openDropdown();
  }

  function handleListMouseDown(event: MouseEvent<HTMLUListElement>) {
    event.preventDefault();

    const item = (event.target as HTMLElement).closest("li");
    if (!item) return;

    if (item.dataset.create === "true") {
      createOption();
      return;
    }

    const rawIndex = item.getAttribute("data-index");
    if (rawIndex === null) return;

    const index = Number(rawIndex);
    if (!Number.isNaN(index) && visibleOptions[index]) {
      commitSelection(visibleOptions[index]);
    }
  }

  function handleListMouseMove(event: MouseEvent<HTMLUListElement>) {
    const item = (event.target as HTMLElement).closest("li");
    const rawIndex = item?.getAttribute("data-index");
    if (rawIndex === null || rawIndex === undefined) return;

    const index = Number(rawIndex);
    if (!Number.isNaN(index) && index !== focusedIndex) {
      setFocusedIndex(index);
    }
  }

  return (
    <div className={cn("relative", isOpen ? "z-30" : "z-0", className)} ref={wrapperRef}>
      {selectedOption?.icon ? (
        <span className="pointer-events-none absolute left-2.5 top-1/2 z-10 flex -translate-y-1/2 items-center text-muted-foreground">
          {selectedOption.icon}
        </span>
      ) : null}

      <input
        type="text"
        id={inputId}
        ref={setInputRef}
        name={name}
        disabled={disabled}
        value={renderedValue}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        aria-activedescendant={focusedIndex >= 0 ? `${listId}-option-${focusedIndex}` : undefined}
        aria-autocomplete="list"
        onFocus={openDropdown}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={cn(
          selectBase,
          inputSizes[size],
          selectedOption?.icon ? "pl-8" : "pl-2.5",
          hasSelection ? "pr-12" : "pr-7",
          invalid && selectInvalid,
        )}
      />

      {hasSelection && !disabled && clearable ? (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={clearSelection}
          className="absolute right-7 top-1/2 -translate-y-1/2 rounded-[3px] p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Clear selection"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className="h-3.5 w-3.5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        tabIndex={-1}
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleToggleClick}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[3px] p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        aria-label="Toggle options"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d={isOpen ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
        </svg>
      </button>

      {isOpen ? (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          className={cn(
            "absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-ui border border-border bg-surface py-1 shadow-lg",
            invalid && "border-danger",
          )}
          onMouseDown={handleListMouseDown}
          onMouseMove={handleListMouseMove}
        >
          {visibleOptions.length > 0 ? (
            visibleOptions.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-option-${index}`}
                data-index={index}
                role="option"
                aria-selected={value === option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-sm transition-colors",
                  focusedIndex === index
                    ? "bg-muted text-foreground"
                    : value === option.value
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted",
                )}
              >
                {option.icon}
                <span>{option.label}</span>
              </li>
            ))
          ) : canCreate ? (
            <li
              data-create="true"
              className="cursor-pointer px-2.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
            >
              {createMessage(normalizedInputValue)}
            </li>
          ) : (
            <li className="px-2.5 py-1.5 text-sm text-muted-foreground">{emptyMessage}</li>
          )}

          {visibleOptions.length === 1 ? (
            <li className="mt-1 border-t border-border px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {confirmMessage}
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}