import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetDocumentDetailQuery } from "@/services/api";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const docId = Number(id);
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";
  const {
    data: document,
    error,
    isLoading,
  } = useGetDocumentDetailQuery(docId, { skip: isNaN(docId) });

  if (isLoading) {
    return <div className="p-6">{t("loading")}</div>;
  }

  if (error || !document) {
    return <div className="p-6 text-red-500">{t("documents.fetch_error")}</div>;
  }

  const localizedTitle = document.title[currentLang] || document.title.en;
  const link = document.file ?? document.url;

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center text-[14px] font-medium md:text-[18px] gap-2 mb-4">
        <Link to="/" className="hover:underline text-black">
          {t("breadcrumb.home")}
        </Link>
        <span className="text-black">&gt;</span>
        <Link to="/documents" className="hover:underline text-black">
          {t("breadcrumb.documents")}
        </Link>
        <span className="text-black">&gt;</span>
        <span className="text-[#DE5D26]">{t("documents.detail")}</span>
      </div>

      <h1 className="text-2xl font-bold font-serif mb-4">{localizedTitle}</h1>

      <div className="mb-2 text-sm text-gray-700">
        <span className="font-medium">{t("documents.number")}:</span> {document.number}
      </div>
      <div className="mb-6 text-sm text-gray-500">
        <span className="font-medium">{t("documents.date")}:</span> {document.date}
      </div>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#DE5D26] hover:bg-[#c84e1f] text-white text-sm px-4 py-2 rounded transition"
        >
          {t("documents.view_document")}
        </a>
      ) : (
        <p className="text-red-500">{t("documents.no_file_available")}</p>
      )}
    </div>
  );
};

export default DocumentDetail;
