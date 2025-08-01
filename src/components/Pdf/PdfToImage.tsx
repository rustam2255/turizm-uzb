import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PdfViewerProps {
  fileUrl: string;
}

const PdfToImage: React.FC<PdfViewerProps> = ({ fileUrl }) => {
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation()
  // URL ni sanitizatsiya qilish
  const sanitizeUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:') throw new Error('Faqat HTTPS URL ruxsat etiladi');
      const validPattern = /^[a-zA-Z0-9/._-]+\.pdf$/;
      if (!validPattern.test(urlObj.pathname)) throw new Error('Noto‘g‘ri PDF fayl formati');
      return encodeURI(url);
    } catch {
      throw new Error('Noto‘g‘ri URL');
    }
  };

  // PDF ni to‘g‘ridan-to‘g‘ri ochish
  const openFullPdf = () => {
    try {
      const sanitizedUrl = sanitizeUrl(fileUrl);
      window.open(sanitizedUrl, '_blank', 'noopener,noreferrer');
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Noma’lum xato');
      }
    }
  };

  useEffect(() => {
    if (!fileUrl) {
      setError('PDF fayl URL manzili ko‘rsatilmagan');
    }
  }, [fileUrl]);

  return (
    <div className="text-center space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">⚠️ {error}</p>
        </div>
      )}

      {!error && (
        <div>
          <button
            onClick={openFullPdf}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {t("magazine.open_pdf")}
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfToImage;