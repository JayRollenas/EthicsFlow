import {
    useEffect,
    useRef,
    useState,
} from 'react';

import { jsPDF } from 'jspdf';

import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    Info,
    Minus,
    Plus,
    Printer,
} from 'lucide-react';

import type { ResearchDetails } from './Steps/Step1Research';
import type { TeamData } from './Steps/Step2Researchers';
import type { EthicsAnswers } from './Steps/Step3Ethics';
import type { DocumentUploads } from './Steps/Step4Documents';

// ==============================================
// TYPES
// ==============================================

export interface ApplicationFormData {
    research: ResearchDetails;
    team: TeamData;
    ethics: EthicsAnswers;
    documents: DocumentUploads;
}

interface PreviewProps extends ApplicationFormData {
    onBack: () => void;
}

interface PDFRow {
    label: string;
    value: string;
}

interface PDFSection {
    title: string;
    rows: PDFRow[];
}

// ==============================================
// FORMAT HELPERS
// ==============================================

function formatDate(value: string): string {
    if (!value) {
        return 'Not provided';
    }

    return new Date(
        `${value}T00:00:00`,
    ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function answerText(value: string): string {
    switch (value) {
        case 'yes':
            return 'Yes';

        case 'no':
            return 'No';

        case 'na':
            return 'Not applicable';

        default:
            return 'Not answered';
    }
}

// ==============================================
// PREPARE PDF DATA
// ==============================================

function createSections(
    data: ApplicationFormData,
): PDFSection[] {
    const {
        research,
        team,
        ethics,
        documents,
    } = data;

    const groupMembers = team.members
        .filter((member) => member.fullName.trim())
        .map((member) => member.fullName)
        .join(', ');

    return [
        // ======================================
        // SECTION A
        // ======================================
        {
            title: 'A. RESEARCH DETAILS',

            rows: [
                {
                    label: 'Research title',
                    value: research.researchTitle,
                },
                {
                    label: 'Department',
                    value: research.department,
                },
                {
                    label: 'Type of research',
                    value: research.researchType,
                },
                {
                    label: 'Study description',
                    value: research.studyDescription,
                },
                {
                    label: 'Proposed period of conduct',
                    value:
                        `${formatDate(research.proposedStartDate)} - ` +
                        formatDate(research.proposedEndDate),
                },
            ],
        },

        // ======================================
        // SECTION B
        // ======================================
        {
            title: 'B. RESEARCHERS AND ADVISER',

            rows: [
                {
                    label: 'Primary researcher',
                    value: team.primary.fullName,
                },
                {
                    label: 'University email',
                    value: team.primary.email,
                },
                {
                    label: 'Student number',
                    value: team.primary.studentNumber,
                },
                {
                    label: 'Contact number',
                    value: team.primary.contactNumber,
                },
                {
                    label: 'Co-researchers',
                    value: groupMembers || 'None',
                },
                {
                    label: 'Research adviser',
                    value: team.adviser.fullName,
                },
                {
                    label: 'Adviser email',
                    value: team.adviser.email,
                },
                {
                    label: 'Adviser affiliation',
                    value: team.adviser.department,
                },
            ],
        },

        // ======================================
        // SECTION C
        // ======================================
        {
            title: 'C. ETHICS SUMMARY',

            rows: [
                {
                    label: 'Human participants',
                    value: answerText(
                        ethics.humanParticipants,
                    ),
                },
                {
                    label: 'Minors or vulnerable groups',
                    value: answerText(
                        ethics.vulnerableGroups,
                    ),
                },
                {
                    label: 'Informed consent',
                    value: ethics.consent,
                },
                {
                    label: 'Data protection',
                    value: ethics.dataProtection,
                },
            ],
        },

        // ======================================
        // SECTION D
        // ======================================
        {
            title: 'D. ATTACHED DOCUMENTS',

            rows: [
                {
                    label: 'Research manuscript',
                    value:
                        documents.manuscript?.name ||
                        'Missing',
                },
                {
                    label: 'Informed consent form',
                    value:
                        documents.consent?.name ||
                        'Missing',
                },
                {
                    label: 'Research instruments',
                    value:
                        documents.instruments?.name ||
                        'Missing',
                },
                {
                    label: 'Supporting documents',
                    value:
                        documents.supporting?.name ||
                        'None',
                },
            ],
        },
    ];
}

// ==============================================
// LOAD LOGO
// ==============================================

async function loadLogo(): Promise<HTMLImageElement | null> {
    try {
        const logo = new Image();

        logo.src = '/images/pup-logo.png';

        await logo.decode();

        return logo;
    } catch {
        return null;
    }
}

// ==============================================
// GENERATE PDF
// ==============================================

async function generatePDF(
    data: ApplicationFormData,
): Promise<jsPDF> {
    const sections = createSections(data);

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    const marginLeft = 16;
    const tableWidth = 178;
    const labelWidth = 56;

    let y = 19;

    // ==========================================
    // DOCUMENT LOGO
    // ==========================================

    const logo = await loadLogo();

    if (logo) {
        try {
            pdf.addImage(
                logo,
                'PNG',
                18,
                13,
                21,
                21,
            );
        } catch {
            // Keep PDF usable without a logo.
        }
    }

    // ==========================================
    // DOCUMENT HEADER
    // ==========================================

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(20, 24, 36);

    pdf.text(
        'POLYTECHNIC UNIVERSITY OF THE PHILIPPINES',
        118,
        y,
        {
            align: 'center',
        },
    );

    y += 7;

    pdf.setFontSize(11);

    pdf.text(
        'RESEARCH ETHICS APPLICATION FORM',
        118,
        y,
        {
            align: 'center',
        },
    );

    y += 10;

    // SAMPLE FORM NOTICE
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(165, 0, 33);

    pdf.text(
        'SAMPLE PREVIEW - NOT AN OFFICIAL SUBMISSION',
        pageWidth / 2,
        y,
        {
            align: 'center',
        },
    );

    y += 12;

    // ==========================================
    // PAGE BREAK FUNCTION
    // ==========================================

    function ensureSpace(requiredHeight: number) {
        if (
            y + requiredHeight >
            pageHeight - 20
        ) {
            pdf.addPage();
            y = 20;
        }
    }

    // ==========================================
    // DRAW SECTIONS
    // ==========================================

    for (const section of sections) {
        ensureSpace(15);

        // SECTION HEADER BACKGROUND
        pdf.setFillColor(220, 224, 230);
        pdf.setDrawColor(150, 159, 172);

        pdf.rect(
            marginLeft,
            y,
            tableWidth,
            8,
            'FD',
        );

        // SECTION TITLE
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(20, 24, 36);

        pdf.text(
            section.title,
            marginLeft + 3,
            y + 5.4,
        );

        y += 8;

        // ======================================
        // SECTION ROWS
        // ======================================

        for (const row of section.rows) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);

            const labelLines =
                pdf.splitTextToSize(
                    row.label,
                    labelWidth - 8,
                ) as string[];

            const valueLines =
                pdf.splitTextToSize(
                    row.value || 'Not provided',
                    tableWidth - labelWidth - 8,
                ) as string[];

            const totalLines = Math.max(
                labelLines.length,
                valueLines.length,
                1,
            );

            let offset = 0;

            // Allow long descriptions to continue
            // onto the next PDF page.
            while (offset < totalLines) {
                ensureSpace(12);

                const availableHeight =
                    pageHeight - 20 - y;

                const linesFit = Math.max(
                    1,
                    Math.floor(
                        (availableHeight - 6) / 4.5,
                    ),
                );

                const linesToDraw = Math.min(
                    linesFit,
                    totalLines - offset,
                );

                const rowHeight =
                    linesToDraw * 4.5 + 6;

                pdf.setDrawColor(
                    160,
                    170,
                    182,
                );

                // OUTER BORDER
                pdf.rect(
                    marginLeft,
                    y,
                    tableWidth,
                    rowHeight,
                );

                // DIVIDER BETWEEN LABEL AND VALUE
                pdf.line(
                    marginLeft + labelWidth,
                    y,
                    marginLeft + labelWidth,
                    y + rowHeight,
                );

                pdf.setTextColor(25, 30, 45);

                const currentLabel =
                    labelLines.slice(
                        offset,
                        offset + linesToDraw,
                    );

                const currentValue =
                    valueLines.slice(
                        offset,
                        offset + linesToDraw,
                    );

                // LABEL TEXT
                if (currentLabel.length > 0) {
                    pdf.text(
                        currentLabel,
                        marginLeft + 3,
                        y + 5,
                    );
                }

                // VALUE TEXT
                if (currentValue.length > 0) {
                    pdf.text(
                        currentValue,
                        marginLeft + labelWidth + 3,
                        y + 5,
                    );
                }

                y += rowHeight;
                offset += linesToDraw;
            }
        }

        // SPACE BETWEEN SECTIONS
        y += 10;
    }

    // ==========================================
    // PAGE NUMBER FOOTERS
    // ==========================================

    const totalPages =
        pdf.getNumberOfPages();

    for (
        let pageNumber = 1;
        pageNumber <= totalPages;
        pageNumber++
    ) {
        pdf.setPage(pageNumber);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(115, 135, 169);

        pdf.text(
            `Application form - Page ${pageNumber} of ${totalPages}`,
            pageWidth - 16,
            pageHeight - 10,
            {
                align: 'right',
            },
        );
    }

    return pdf;
}

// ==============================================
// EXPORTED DOWNLOAD FUNCTION
// ==============================================

// This can be called from Create.tsx,
// including the demo confirmation screen.

export async function downloadApplicationPdf(
    data: ApplicationFormData,
): Promise<void> {
    const pdf = await generatePDF(data);

    pdf.save(
        'Ethics_Application_Preview.pdf',
    );
}

// ==============================================
// MAIN PREVIEW COMPONENT
// ==============================================

export default function Preview({
    research,
    team,
    ethics,
    documents,
    onBack,
}: PreviewProps) {
    const pdfRef = useRef<jsPDF | null>(null);

    const [pdfUrl, setPdfUrl] =
        useState('');

    const [page, setPage] =
        useState(1);

    const [pageCount, setPageCount] =
        useState(1);

    const [zoom, setZoom] =
        useState(100);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    // ==========================================
    // GENERATE PDF ON PREVIEW
    // ==========================================

    useEffect(() => {
        let cancelled = false;
        let generatedUrl = '';

        async function preparePDF() {
            setLoading(true);

            try {
                const pdf = await generatePDF({
                    research,
                    team,
                    ethics,
                    documents,
                });

                if (cancelled) {
                    return;
                }

                pdfRef.current = pdf;

                generatedUrl =
                    URL.createObjectURL(
                        pdf.output('blob'),
                    );

                setPdfUrl(generatedUrl);

                setPageCount(
                    pdf.getNumberOfPages(),
                );

                setPage(1);
                setError('');
            } catch (err) {
                console.error(
                    'PDF preview error:',
                    err,
                );

                if (!cancelled) {
                    setError(
                        'Unable to generate the PDF preview.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void preparePDF();

        return () => {
            cancelled = true;

            if (generatedUrl) {
                URL.revokeObjectURL(generatedUrl);
            }

            pdfRef.current = null;
        };
    }, [
        research,
        team,
        ethics,
        documents,
    ]);

    // ==========================================
    // PDF VIEWER URL
    // ==========================================

    const viewerUrl = pdfUrl
        ? `${pdfUrl}#page=${page}&zoom=${zoom}&toolbar=0&navpanes=0`
        : '';

    // ==========================================
    // DOWNLOAD PDF
    // ==========================================

    function downloadPDF() {
        pdfRef.current?.save(
            'Ethics_Application_Preview.pdf',
        );
    }

    // ==========================================
    // OPEN PDF FOR PRINTING
    // ==========================================

    function printPDF() {
        if (!pdfUrl) {
            return;
        }

        window.open(
            pdfUrl,
            '_blank',
            'noopener,noreferrer',
        );
    }

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div>

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <div className="mb-3 h-1 w-12 rounded-full bg-[#ff8500]" />

                    <h1 className="text-[30px] font-extrabold tracking-tight text-[#171725] sm:text-[39px]">
                        Application form preview
                    </h1>

                    <p className="mt-1 text-[16px] text-[#7b8eae] sm:text-[18px]">
                        Review and download your completed application form.
                    </p>
                </div>

                {/* BACK AND DOWNLOAD BUTTONS */}
                <div className="flex flex-wrap gap-3">

                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md border border-[#a50021] bg-white px-5 text-[13px] font-bold text-[#a50021] transition hover:bg-[#fff0f3]"
                    >
                        <ArrowLeft size={18} />
                        Back to application
                    </button>

                    <button
                        type="button"
                        onClick={downloadPDF}
                        disabled={loading || !pdfUrl}
                        className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-5 text-[13px] font-bold text-white transition hover:bg-[#87001b] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* =====================================
                SAMPLE FORM WARNING
            ===================================== */}

            <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#fff3d7] px-4 py-3 text-[13px] text-[#b85a00]">

                <Info
                    size={19}
                    className="shrink-0"
                />

                Sample form layout — official template to be
                provided by the Ethics Office.
            </div>

            {/* =====================================
                PDF VIEWER
            ===================================== */}

            <section className="overflow-hidden rounded-xl bg-white">

                {/* =================================
                    PDF TOOLBAR
                ================================= */}

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dde4ee] px-4 py-3">

                    {/* FILE NAME */}
                    <div className="flex min-w-0 items-center gap-3">

                        <span className="flex h-9 w-8 shrink-0 items-center justify-center rounded bg-[#e60023] text-[9px] font-bold text-white">
                            PDF
                        </span>

                        <span className="truncate text-[13px] font-medium text-[#171725]">
                            Ethics_Application_Preview.pdf
                        </span>
                    </div>

                    {/* TOOLBAR BUTTONS */}
                    <div className="flex flex-wrap items-center gap-3">

                        {/* PREVIOUS PAGE */}
                        <button
                            type="button"
                            aria-label="Previous page"
                            disabled={
                                loading ||
                                page <= 1
                            }
                            onClick={() =>
                                setPage((previous) =>
                                    Math.max(
                                        1,
                                        previous - 1,
                                    ),
                                )
                            }
                            className="text-[#64799d] disabled:opacity-30"
                        >
                            <ChevronLeft size={21} />
                        </button>

                        {/* CURRENT PAGE */}
                        <span className="rounded border border-[#d6dfec] px-3 py-1 text-[13px] text-[#34476b]">
                            {page}
                        </span>

                        <span className="text-xs text-[#34476b]">
                            / {pageCount}
                        </span>

                        {/* NEXT PAGE */}
                        <button
                            type="button"
                            aria-label="Next page"
                            disabled={
                                loading ||
                                page >= pageCount
                            }
                            onClick={() =>
                                setPage((previous) =>
                                    Math.min(
                                        pageCount,
                                        previous + 1,
                                    ),
                                )
                            }
                            className="text-[#64799d] disabled:opacity-30"
                        >
                            <ChevronRight size={21} />
                        </button>

                        {/* DIVIDER */}
                        <span className="mx-1 h-7 w-px bg-[#dce3ee]" />

                        {/* ZOOM OUT */}
                        <button
                            type="button"
                            aria-label="Zoom out"
                            disabled={loading}
                            onClick={() =>
                                setZoom((previous) =>
                                    Math.max(
                                        50,
                                        previous - 25,
                                    ),
                                )
                            }
                            className="rounded border border-[#d6dfec] p-1 text-[#52698d] disabled:opacity-30"
                        >
                            <Minus size={17} />
                        </button>

                        {/* ZOOM LEVEL */}
                        <span className="min-w-[52px] text-center text-[13px] text-[#52698d]">
                            {zoom}%
                        </span>

                        {/* ZOOM IN */}
                        <button
                            type="button"
                            aria-label="Zoom in"
                            disabled={loading}
                            onClick={() =>
                                setZoom((previous) =>
                                    Math.min(
                                        200,
                                        previous + 25,
                                    ),
                                )
                            }
                            className="rounded border border-[#d6dfec] p-1 text-[#52698d] disabled:opacity-30"
                        >
                            <Plus size={17} />
                        </button>

                        {/* DIVIDER */}
                        <span className="mx-1 h-7 w-px bg-[#dce3ee]" />

                        {/* PRINT BUTTON */}
                        <button
                            type="button"
                            aria-label="Open PDF for printing"
                            onClick={printPDF}
                            disabled={loading || !pdfUrl}
                            title="Open the PDF to print"
                            className="text-[#52698d] disabled:opacity-30"
                        >
                            <Printer size={20} />
                        </button>
                    </div>
                </div>

                {/* =================================
                    PDF CONTENT
                ================================= */}

                {pdfUrl && !loading ? (

                    <iframe
                        title="Application PDF Preview"
                        src={viewerUrl}
                        className="h-[650px] w-full border-0 bg-[#d6dce5]"
                    />

                ) : (

                    <div className="flex h-[650px] items-center justify-center bg-[#d6dce5]">

                        <div className="text-center text-[14px] text-[#52698d]">

                            <FileText
                                size={36}
                                className="mx-auto mb-3"
                            />

                            {error ||
                                'Preparing PDF preview...'}

                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}