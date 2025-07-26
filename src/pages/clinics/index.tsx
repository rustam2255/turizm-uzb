
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useGetClinicsQuery, useGetCitiesHotelQuery } from "@/services/api";
import SkeletonCard from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import IMAGE from '@/assets/images/clinic.png';
import { MapPin } from "lucide-react";
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;
import IMAGE1 from '@/assets/images/place3.png'
import { slugify } from "@/utils/slugify";
import { motion, AnimatePresence } from "framer-motion";

type Lang = "uz" | "ru" | "en";

interface ClinicCity {
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

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
      <Link to="/" className="hover:underline text-black">
        {t("breadcrumb.home")}
      </Link>
      <span className="text-black">&gt;</span>
      <Link to="/services">
        <span className="text-blue-400">{t("services.title")}</span>
      </Link>
      <span className="text-black">&gt;</span>
      <span className="text-blue-600">{t("services.clinic")}</span>
    </div>
  );
};

interface ClinicCardProps {
  clinic: dataClinic;
  lang: Lang;
}
export interface MultilangText {
  name_uz: string;
  name_ru: string;
  name_en: string;
}

interface dataClinic {
  id: number;
  name: string;
  city: MultilangText;
  latitude: number;
  longitude: number;
  images: {
    id: number;
    photo: string;
  }[];
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic, lang }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const firstImage =
    clinic.images && clinic.images.length > 0 ? `${MEDIA_URL}${clinic.images[0].photo}` : IMAGE;
  const secondImage =
    clinic.images && clinic.images.length > 1 ? `${MEDIA_URL}${clinic.images[1].photo}` : IMAGE;
  const navigate = useNavigate();
  console.log(isImageHovered);
  
  return (
    <motion.div
      className="flex flex-col p-3 hover:scale-105 transition h-full cursor-pointer"
      onClick={() => navigate(`/services/clinic/${clinic.id}-${slugify(clinic.name)}`)}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
    >
      <motion.div
        className="relative h-48 overflow-hidden mb-3 rounded-xl group"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative h-48 overflow-hidden mb-3 rounded-xl group"
          style={{ perspective: "1000px" }}
        >
          <div
            className="w-full h-full transition-transform duration-700 ease-in-out transform-gpu group-hover:[transform:rotateY(180deg)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front Image */}
            <img
              src={firstImage}
              alt={clinic.name}
              className="w-full h-full absolute top-0 left-0"
              style={{ backfaceVisibility: "hidden" }}

              onError={(e) => {
                (e.target as HTMLImageElement).src = IMAGE1;
              }}
            />

            {/* Back Image */}
            <img
              src={secondImage}
              alt={clinic.name}
              className="w-full h-full object-cover absolute top-0 left-0"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}

              onError={(e) => {
                (e.target as HTMLImageElement).src = IMAGE;
              }}
            />
          </div>
        </div>
      </motion.div>
      <motion.h2
        className="text-lg font-semibold mb-2 line-clamp-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {clinic.name}
      </motion.h2>
      <motion.div
        className="flex items-center gap-1 text-gray-500 text-sm mt-auto pt-2 border-t border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <MapPin size={16} className="mr-1" />
        <span className="truncate">{getLocalizedText({
          uz: clinic.city.name_uz,
          ru: clinic.city.name_ru,
          en: clinic.city.name_en,
        }, lang)}</span>
      </motion.div>
    </motion.div>
  );
};

const Clinics = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language.split("-")[0] as Lang) || "en";
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: cities = [],
    isLoading: loadingCities,
    isError: errorCities,
  } = useGetCitiesHotelQuery();
  const { data: dataClinics, isLoading: loadingClinis, isError } = useGetClinicsQuery({
    page: currentPage,
    search: searchQuery || undefined,
    city: selectedCity || undefined,
  });
  const dataClinic: dataClinic[] = dataClinics?.results || [];
  const totalPages = Math.ceil((dataClinics?.count || 0) / 10);
  const isLoading = loadingClinis || loadingCities;

  if (isError || !dataClinic || errorCities) return <p className="text-center text-red-500">{t("error.failed_to_load_data")}</p>;

  return (
    <motion.div
      className="w-full py-6 pt-[80px] md:pt-[30px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1800px] xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
        <motion.div
          className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Breadcrumb />
        </motion.div>
        <motion.h1
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {t("services.clinic")}
        </motion.h1>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.input
            type="text"
            placeholder={t("placeholder.clinic")}
            className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
          <motion.select
            onChange={(e) => {
              setSelectedCity(String(e.target.value) || null);
              setCurrentPage(1);
            }}
            value={selectedCity || ""}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/3 text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <option value="">{t("travel.select_city")}</option>
            {cities.map((city: ClinicCity) => (
              <option key={city.id} value={city.id}>
                {getLocalizedText(city.name, lang)}
              </option>
            ))}
          </motion.select>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <AnimatePresence>
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
              : dataClinic.map((clinic) => (
                <motion.div
                  key={clinic.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: dataClinic.indexOf(clinic) * 0.1 }}
                >
                  <ClinicCard clinic={clinic} lang={lang} />
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-8 flex-wrap gap-2 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded text-sm sm:text-base transition-colors duration-200 ${currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (page - 1) * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              {page}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Clinics;
