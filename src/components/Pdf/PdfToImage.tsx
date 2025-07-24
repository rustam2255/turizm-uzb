import { useEffect, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js'; // Worker fayl manzilini tekshiring

const PdfToImage: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const [loading, setLoading] = useState(true);
  const [pageImage, setPageImage] = useState<string | null>(null);

  useEffect(() => {
    const renderPdf = async () => {
      try {
        const pdf = await getDocument(fileUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport }).promise;
        const imageData = canvas.toDataURL(); // Birinchi sahifani rasm sifatida olish
        setPageImage(imageData);
      } catch (error) {
        console.error('PDF render error:', error);
      } finally {
        setLoading(false);
      }
    };

    renderPdf();
  }, [fileUrl]);

  const openInNewTab = () => {
    const newWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.document.write(`
        <html>
        <head>
          <title>PDF Viewer</title>
          <style>
            body { margin: 0; padding: 0; background: #f9f9f9; text-align: center; font-family: Arial, sans-serif; }
            .canvas-container { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px; }
            canvas { display: block; margin: 10px auto; box-shadow: 0 0 10px rgba(0,0,0,0.2); max-width: 100%; }
            .loading { font-size: 18px; color: #666; }
            .error { font-size: 16px; color: #dc3545; padding: 10px; }
          </style>
        </head>
        <body>
          <div class="loading">Yuklanmoqda...</div>
          <div class="canvas-container" id="canvasContainer"></div>
          <script>
            const fileUrl = ${JSON.stringify(fileUrl)};
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.min.js';
            script.onload = async function() {
              try {
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
                const loadingDiv = document.querySelector('.loading');
                const canvasContainer = document.getElementById('canvasContainer');
                loadingDiv.textContent = 'PDF ni yuklab olinmoqda...';
                const pdf = await pdfjsLib.getDocument(fileUrl).promise;
                loadingDiv.textContent = 'Sahifalar tayyorlanmoqda...';
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                  const page = await pdf.getPage(pageNum);
                  const viewport = page.getViewport({ scale: 1.5 });
                  const canvas = document.createElement('canvas');
                  const context = canvas.getContext('2d');
                  canvas.width = viewport.width;
                  canvas.height = viewport.height;
                  canvasContainer.appendChild(canvas);
                  await page.render({ canvasContext: context, viewport }).promise;
                }
                loadingDiv.style.display = 'none';
              } catch (error) {
                document.querySelector('.loading').outerHTML = '<div class="error">PDF ni ko‘rsatishda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.</div>';
                console.error('PDF error:', error);
              }
            };
            document.head.appendChild(script);
          </script>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="text-center">
      {loading && <p className="text-gray-600">Yuklanmoqda...</p>}
      {pageImage && (
        <div>
          <img src={pageImage} alt="PDF Preview" className="mx-auto my-4 shadow-lg rounded-lg max-w-full" />
          <button
            onClick={openInNewTab}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            To‘liq ko‘rish
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfToImage;