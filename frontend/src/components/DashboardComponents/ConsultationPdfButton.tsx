import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import ConsultationPdfTemplate from "./ConsultationPdfTemplate.tsx";

export default function ConsultationPdfButton({
    consultation,
}: any) {
    const pdfRef = useRef<HTMLDivElement>(null);

    const downloadPdf = async () => {
        if (!pdfRef.current) return;

        const canvas = await html2canvas(pdfRef.current, { scale: 1,useCORS: true,});

        const imgData = canvas.toDataURL("image/jpeg", 1);

        const pdf = new jsPDF({orientation: "p",unit: "mm",format: "a4",compress: true});

        const imgWidth = 210;
        const pageHeight = 297;

        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData,"JPEG",0,position,imgWidth,imgHeight);

        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;

            pdf.addPage();

            pdf.addImage(imgData,"PNG",0,position,imgWidth,imgHeight);

            heightLeft -= pageHeight;
        }

        pdf.save(`${consultation?.patient?.fullname}-${new Date(consultation.createdat).toLocaleString("en-IN", {timeZone: "Asia/Kolkata",day: "2-digit",month: "short",year: "numeric",hour: "numeric",minute: "2-digit",hour12: true})}-consultation.pdf`);
    };

    return (
        <>
            <button onClick={downloadPdf} className="mt-[10px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                Download PDF
            </button>

            <div className="fixed left-[-99999px] top-0">
                <ConsultationPdfTemplate ref={pdfRef} consultation={consultation}/>
            </div>
        </>
    );
}