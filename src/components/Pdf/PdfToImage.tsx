import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
const PdfToImage: React.FC<{ fileUrl: string }> = ({ fileUrl = 'https://api.tourism-uzbekistan.uz/media/magazines/Toastmaster-__April_2014.pdf' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const renderPdf = async () => {
            const pdf = await getDocument(fileUrl).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = canvasRef.current;

            if (canvas) {
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context!, viewport }).promise;
                setLoading(false);
            }
        };

        renderPdf();
    }, [fileUrl]);

    return (
        <div className="text-center">
            {loading && <p>Yuklanmoqda...</p>}
            <canvas ref={canvasRef} style={{ display: loading ? 'none' : 'block' }} />
        </div>
    );
};

export default PdfToImage;
