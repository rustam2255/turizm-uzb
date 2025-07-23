import { useEffect,  useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

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
                const imageData = canvas.toDataURL(); // Convert to base64 image
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
                        body { margin: 0; padding: 0; background: #f9f9f9; text-align: center; }
                        canvas { display: block; margin: 20px auto; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
                    </style>
                </head>
                <body>
                    <h2>Yuklanmoqda...</h2>
                    <script>
                        const fileUrl = ${JSON.stringify(fileUrl)};
                        const script = document.createElement('script');
                        script.src = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.min.js';
                        script.onload = function() {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
                            pdfjsLib.getDocument(fileUrl).promise.then(async function(pdf) {
                                document.body.innerHTML = '';
                                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                                    const page = await pdf.getPage(pageNum);
                                    const viewport = page.getViewport({ scale: 1.5 });
                                    const canvas = document.createElement('canvas');
                                    const context = canvas.getContext('2d');
                                    canvas.width = viewport.width;
                                    canvas.height = viewport.height;
                                    document.body.appendChild(canvas);
                                    await page.render({ canvasContext: context, viewport }).promise;
                                }
                            });
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
            {loading && <p>Yuklanmoqda...</p>}
            {pageImage && (
                <div>
                    <img src={pageImage} alt="PDF Preview" className="mx-auto my-4 shadow" />
                    <button
                        onClick={openInNewTab}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        To‘liq ko‘rish
                    </button>
                </div>
            )}
        </div>
    );
};

export default PdfToImage;
