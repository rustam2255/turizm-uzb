import { Listbox } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

interface RatingSelectProps {
  selectedRating: number | null;
  setSelectedRating: (val: number | null) => void;
}

const RatingSelect = ({ selectedRating, setSelectedRating }: RatingSelectProps) => {
  const allRatingOption = 0;
  const ratingOptions = [allRatingOption, 1, 2, 3, 4, 5];
  const selected = selectedRating ?? allRatingOption;

  return (
    <div className="w-full md:w-64  ">
      <Listbox
        value={selected}
        onChange={(value) => {
          setSelectedRating(value === 0 ? null : value);
        }}
      >
        <div className="relative">
          <Listbox.Button
            className="
              relative w-full cursor-default rounded-md border border-gray-300 
              bg-white py-2 pl-3 pr-10 text-left shadow-sm
              focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500
              sm:text-sm text-xs
              transition duration-150 ease-in-out
              hover:border-orange-400
            "
            aria-label="Select rating"
          >
            <span className="block truncate text-xs sm:text-sm md:text-base">
              {selected === 0 ? "All Ratings" : `${selected} star${selected > 1 ? "s" : ""}`}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="
              absolute  z-50  mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1
              text-xs sm:text-sm md:text-base shadow-lg ring-1 ring-black/10 focus:outline-none
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
            "
          >
            {ratingOptions.map((rating) => (
              <Listbox.Option
                key={rating}
                value={rating}
                className={({ active }) =>
                  `relative cursor-default select-none z-50  py-2 pl-10 pr-4 ${
                    active ? "bg-orange-100 text-orange-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate   ${
                        selected ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {rating === 0 ? "All Ratings" : `${rating} star${rating > 1 ? "s" : ""}`}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default RatingSelect;
