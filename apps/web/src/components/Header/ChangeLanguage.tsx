import React, { useState } from "react";
import { api } from "~/src/utils/api";
import { Country, ChangeLanguageProps } from "../../../../../@types";

const ChangeLanguage: React.FC<ChangeLanguageProps> = ({
  locales,
  locale,
  push,
  path,
  openMenu,
  onMenuToggle,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
  
    const countryQuery = api.language.getCountry.useQuery(locale, {
      refetchOnWindowFocus: false,
    });
  
    const countriesQuery = api.language.getMultipleCountries.useQuery(
      locales.filter((l: string) => l !== locale),
      {
        refetchOnWindowFocus: false,
      },
    );
  
    const countryData = countryQuery.data;
    const countriesData = countriesQuery.data;
  
    const handleLanguageSelection = (alpha2Code: string) => {
      push(path, undefined, { locale: alpha2Code.toLowerCase() });
      setMenuOpen(false);
      onMenuToggle(); // Close the menu in the parent component
    };
  
    return (
      <div className="relative">
        <button
          onClick={() => {
            onMenuToggle(); // Toggle the menu state in the parent component
            setMenuOpen(!menuOpen); // Toggle the menu state in the local component
          }}
          id="dropdownRadioButton"
          data-dropdown-toggle="dropdownDefaultRadio"
          className="inline-flex items-center rounded-lg bg-transparent px-4 py-2.5 text-center text-sm font-medium text-white transition-all outline-none"
          type="button"
        >
          <img
            className="h-4 w-4 rounded-full"
            src={countryData?.flag}
            alt={countryData?.name}
          />
          <p className="ml-2">{locale.toUpperCase()}</p>
          <svg
            className="ml-2 h-4 w-4 -scale-x-[1]"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <div
          style={{ display: !openMenu ? "none" : "block" }}
          id="dropdownDefaultRadio"
          className="absolute right-0 top-12 z-20 hidden min-w-[170px] max-w-[200px] divide-y divide-gray-100 rounded-lg bg-[#24252e] shadow"
        >
          <ul
            className="space-2 py-2 text-sm"
            aria-labelledby="dropdownRadioButton"
          >
            {countriesData?.map((c: Country) => (
              <span
                key={c.alpha2Code}
                className="mx-2 my-2 grid cursor-pointer grid-cols-1 gap-1.5"
                onClick={() => handleLanguageSelection(c.alpha2Code)}
              >
                <div className="flex items-center justify-start gap-3 rounded-sm px-4 py-2 transition-all duration-200 hover:bg-[#363845]">
                  <img
                    className="h-4 w-4 rounded-full"
                    src={c.flag}
                    alt={c.name}
                  />
                  <p className="text-white">{c.language}</p>
                </div>
              </span>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  

export default ChangeLanguage;