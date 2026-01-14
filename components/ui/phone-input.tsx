"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import { CircleFlag } from "react-circle-flags";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ComponentRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      "rounded-e-lg rounded-s-none h-12 text-base",
      className
    )}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCountries = React.useMemo(() => {
    if (!searchQuery) return countryList;
    const query = searchQuery.toLowerCase();
    return countryList.filter(
      ({ value, label }) =>
        value &&
        (label.toLowerCase().includes(query) ||
          value.toLowerCase().includes(query) ||
          `+${RPNInput.getCountryCallingCode(value)}`.includes(query))
    );
  }, [countryList, searchQuery]);

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setSearchQuery("");
    }}>
      <PopoverTrigger
        className={cn(
          "flex gap-2 items-center rounded-e-none rounded-s-lg px-3 h-12 border border-r-0 border-input bg-background hover:bg-accent hover:text-accent-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled}
      >
        <FlagComponent
          country={selectedCountry}
          countryName={selectedCountry}
        />
        <span className="text-xs text-foreground/70">
          (+{selectedCountry && RPNInput.getCountryCallingCode(selectedCountry)})
        </span>
        <ChevronsUpDown
          className={cn(
            "-mr-2 size-4 opacity-50",
            disabled ? "hidden" : "opacity-100"
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-3">
            <svg
              className="mr-2 h-4 w-4 shrink-0 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Country List */}
          <div className="max-h-72 overflow-y-auto p-1">
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No country found.
              </div>
            ) : (
              filteredCountries.map(({ value, label }) => {
                if (!value) return null;

                return (
                  <div
                    key={value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === selectedCountry && "bg-accent"
                    )}
                    onClick={() => {
                      onChange(value);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <FlagComponent country={value} countryName={label} />
                    <span className="flex-1 text-sm">{label}</span>
                    <span className="text-sm text-foreground/50">
                      {`+${RPNInput.getCountryCallingCode(value)}`}
                    </span>
                    <CheckIcon
                      className={cn(
                        "ml-auto size-4",
                        value === selectedCountry ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  return (
    <span className="flex size-5 overflow-hidden rounded-full bg-foreground/20">
      {country && (
        <CircleFlag
          countryCode={country.toLowerCase()}
          height={20}
          width={20}
          title={countryName}
        />
      )}
    </span>
  );
};

export { PhoneInput };
export type { PhoneInputProps };
