import { Listbox } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

type Lang = "uz" | "ru" | "en";

interface HotelCity {
  id: number;
  name: string | Record<Lang, string>;
}
const getLocalizedText = (
  text: string | Record<Lang, string> | undefined,
  lang: Lang
): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] || text.en || "";
};

const CityFilter = ({
  cities,
  selectedCity,
  setSelectedCity,
}: {
  cities: HotelCity[];
  selectedCity: number | null;
  setSelectedCity: (val: number | null) => void;
  fetchHotels: (page: number, cityId?: number | null) => void;
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";

  const allCityOption: HotelCity = {
    id: 0,
    name:
      currentLang === "uz"
        ? "Barcha shaharlar"
        : currentLang === "ru"
          ? "Все города"
          : "All Cities",
  };

  const cityOptions = [allCityOption, ...cities];
  const selected = selectedCity
    ? cityOptions.find((c) => c.id === selectedCity)
    : allCityOption;

  return (
    <div className="w-full sm:w-56 md:w-64">
      <Listbox
        value={selected}
        onChange={(city) => {
          const cityId = city.id === 0 ? null : city.id;
          setSelectedCity(cityId);
        }}
      >
        <div className="relative">
          <Listbox.Button
            className="
              relative w-full cursor-default rounded-md border border-gray-300 
              bg-white py-2 pl-3 pr-10 text-left shadow-sm
              focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500
              text-xs sm:text-sm md:text-base
              transition duration-150 ease-in-out
              hover:border-orange-400
            "
            aria-label="Select city"
          >
            <span className="block truncate">{getLocalizedText(selected?.name,currentLang)}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="
              absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1
              text-xs sm:text-sm md:text-base shadow-lg ring-1 ring-black/10 focus:outline-none
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {cityOptions.map((city) => (
              <Listbox.Option
                key={city.id}
                value={city}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-7 md:pl-10 pr-3 md:pr-4 ${active ? "bg-orange-100 text-orange-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? "font-semibold" : "font-normal"
                        }`}
                    >
                      {getLocalizedText(city.name, currentLang)}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                        <Check className="h-3 w-3 md:h-5 md:w-5" aria-hidden="true" />
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

export default CityFilter;
