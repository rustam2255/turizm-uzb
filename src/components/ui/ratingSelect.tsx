import { Listbox } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { motion } from "framer-motion";

interface RatingSelectProps {
  selectedRating: number | null;
  setSelectedRating: (val: number | null) => void;
  className?: string;
}

const RatingSelect = ({ selectedRating, setSelectedRating, className }: RatingSelectProps) => {
  const allRatingOption = 0;
  const ratingOptions = [allRatingOption, 1, 2, 3, 4, 5];
  const selected = selectedRating ?? allRatingOption;

  return (
    <motion.div
      className={`w-full md:w-64 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Listbox
        value={selected}
        onChange={(value) => {
          setSelectedRating(value === 0 ? null : value);
        }}
      >
        <div className="relative">
          <Listbox.Button
            className="
              relative w-full cursor-default rounded-lg border border-[#4DC7E8]/50 
              bg-white py-2 pl-3 pr-10 text-left shadow-sm shadow-[#4DC7E8]/20
              focus:border-[#4DC7E8] focus:ring-2 focus:ring-[#4DC7E8]/30
              text-xs sm:text-sm md:text-base
              transition-all duration-300
              hover:bg-[#4DC7E8]/10 hover:shadow-[#4DC7E8]/30
            "
            aria-label="Select rating"
          >
            <span className="block truncate text-rgba(25,110,150,255)">
              {selected === 0 ? "All Ratings" : `${selected} star${selected > 1 ? "s" : ""}`}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-rgba(25,110,150,255)" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="
              absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1
              text-xs sm:text-sm md:text-base shadow-lg shadow-[#4DC7E8]/20 
              ring-1 ring-[#4DC7E8]/20 focus:outline-none
              scrollbar-thin scrollbar-thumb-[#4DC7E8] scrollbar-track-gray-100
            "
          >
            {ratingOptions.map((rating) => (
              <Listbox.Option
                key={rating}
                value={rating}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-[#4DC7E8]/10 text-[rgba(25,110,150,255)]" : "text-sky-900"
                  } transition-colors duration-200`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-semibold text-[rgba(25,110,150,255)]" : "font-normal"
                      }`}
                    >
                      {rating === 0 ? "All Ratings" : `${rating} star${rating > 1 ? "s" : ""}`}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4DC7E8]">
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
    </motion.div>
  );
};

export default RatingSelect;