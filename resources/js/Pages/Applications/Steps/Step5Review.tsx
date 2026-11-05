import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import { jsPDF } from 'jspdf';

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Download,
    Eye,
    FileText,
    HelpCircle,
    Info,
    Paperclip,
    Pencil,
    Users,
} from 'lucide-react';

import type { ResearchDetails } from './Step1Research';
import type { TeamData } from './Step2Researchers';
import type { EthicsAnswers } from './Step3Ethics';
import type { DocumentUploads } from './Step4Documents';

// ==============================================
// TYPES
// ==============================================

interface ReviewRow {
    label: string;
    value: string;
}

interface ReviewSection {
    title: string;
    rows: ReviewRow[];
}

interface ReviewData {
    research: ResearchDetails;
    team: TeamData;
    ethics: EthicsAnswers;
    documents: DocumentUploads;
}

interface Props extends ReviewData {
    allComplete: boolean;
    onEdit: (step: number) => void;
    onBack: () => void;
    onSaveDraft: () => void;
    onPreview: () => void;
    onSubmit: () => void;
}

// ==============================================
// HELPERS
// ==============================================

function formatDate(date: string): string {
    if (!date) return 'Not provided';

    return new Date(
        `${date}T00:00:00`,
    ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.ceil(bytes / 1024)} KB`;
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
// CREATE REVIEW DATA
// ==============================================

function buildReviewSections({
    research,
    team,
    ethics,
    documents,
}: ReviewData): ReviewSection[] {
    const groupMembers = team.members.filter(
        (member) =>
            member.fullName.trim() ||
            member.email.trim() ||
            member.studentNumber.trim(),
    );

    return [
        {
            title: 'Research details',
            rows: [
                {
                    label: 'Title',
                    value: research.researchTitle,
                },
                {
                    label: 'Department',
                    value: research.department,
                },
                {
                    label: 'Type',
                    value: research.researchType,
                },
                {
                    label: 'Description',
                    value: research.studyDescription,
                },
                {
                    label: 'Proposed dates',
                    value:
                        `${formatDate(research.proposedStartDate)} – ` +
                        formatDate(research.proposedEndDate),
                },
            ],
        },

        {
            title: 'Researchers and adviser',
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
                    label: 'Group members',
                    value:
                        groupMembers
                            .map((member) => member.fullName)
                            .join('\n') || 'None',
                },
                {
                    label: 'Adviser',
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

        {
            title: 'Ethics answers',
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
                    label: 'Consent',
                    value: ethics.consent,
                },
                {
                    label: 'Data protection',
                    value: ethics.dataProtection,
                },
            ],
        },

        {
            title: 'Attachments',
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
// REVIEW CARD
// ==============================================

interface ReviewCardProps {
    title: string;
    icon: ReactNode;
    rows: ReviewRow[];
    step: number;
    onEdit: (step: number) => void;
}

function ReviewCard({
    title,
    icon,
    rows,
    step,
    onEdit,
}: ReviewCardProps) {
    return (
        <section className="rounded-xl bg-white px-5 py-4">

            {/* HEADER */}
            <div className="mb-3 flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffe5e9] text-[#d00027]">
                        {icon}
                    </span>

                    <h3 className="text-[17px] font-extrabold text-[#171725]">
                        {title}
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={() => onEdit(step)}
                    className="inline-flex items-center gap-2 text-[13px] font-bold text-[#d00027] hover:underline"
                >
                    <Pencil size={17} />
                    Edit
                </button>
            </div>

            {/* CONTENT */}
            <dl className="space-y-2">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="grid grid-cols-[38%_minmax(0,1fr)] gap-3 text-[13px]"
                    >
                        <dt className="text-[#7188ac]">
                            {row.label}
                        </dt>

                        <dd className="whitespace-pre-line break-words text-[#30436a]">
                            {row.value || 'Not provided'}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

// ==============================================
// ATTACHMENT WITH PDF VIEW
// ==============================================

function AttachmentItem({
    file,
}: {
    file: File;
}) {
    const [url, setUrl] =
        useState<string | null>(null);

    useEffect(() => {
        if (
            !file.name.toLowerCase().endsWith('.pdf')
        ) {
            setUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        setUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    const format = file.name
        .toLowerCase()
        .endsWith('.pdf')
        ? 'PDF'
        : 'DOCX';

    return (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-[#dce3ee] bg-[#fbfcfe] px-3 py-2">

            {/* FILE ICON */}
            <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white ${
                    format === 'PDF'
                        ? 'bg-[#e60023]'
                        : 'bg-[#0876d9]'
                }`}
            >
                {format}
            </span>

            {/* FILE INFO */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-[#30436a]">
                    {file.name}
                </p>

                <p className="mt-1 text-[11px] text-[#8398b9]">
                    {formatSize(file.size)}
                </p>
            </div>

            {/* CHECK ICON */}
            <CheckCircle2
                size={20}
                className="shrink-0 text-[#11954d]"
            />

            {/* PDF VIEW */}
            {url && (
                <button
                    type="button"
                    onClick={() =>
                        window.open(
                            url,
                            '_blank',
                            'noopener,noreferrer',
                        )
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-[#8293ae] px-3 text-[12px] font-semibold text-[#30436a] hover:bg-[#f3f6fb]"
                >
                    <Eye size={17} />
                    View
                </button>
            )}
        </div>
    );
}

// ==============================================
// MAIN STEP 5 REVIEW COMPONENT
// ==============================================

export default function Step5Review({
    research,
    team,
    ethics,
    documents,
    allComplete,
    onEdit,
    onBack,
    onSaveDraft,
    onPreview,
    onSubmit,
}: Props) {
    const [confirmed, setConfirmed] = useState(false);

    const sections = buildReviewSections({
        research,
        team,
        ethics,
        documents,
    });

    const files = Object.values(documents).filter(
        (file): file is File => file !== null,
    );

    return (
        <div className="space-y-4">

            {/* COMPLETION BANNER */}
            <div
                className={`flex items-center gap-3 rounded-lg px-5 py-3 text-[14px] font-semibold ${
                    allComplete
                        ? 'bg-[#e8f7eb] text-[#087338]'
                        : 'bg-[#fff2dd] text-[#a75a00]'
                }`}
            >
                {allComplete ? (
                    <CheckCircle2
                        size={22}
                        className="shrink-0"
                    />
                ) : (
                    <AlertCircle
                        size={22}
                        className="shrink-0"
                    />
                )}

                {allComplete
                    ? 'All required sections are complete. Review your application below.'
                    : 'Some required sections are incomplete. Complete them before submission.'}
            </div>

            {/* =====================================
                REVIEW CARDS
            ===================================== */}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                {/* RESEARCH DETAILS */}
                <ReviewCard
                    title="Research details"
                    icon={<FileText size={19} />}
                    rows={sections[0].rows}
                    step={1}
                    onEdit={onEdit}
                />

                {/* RESEARCHERS */}
                <ReviewCard
                    title="Researchers & adviser"
                    icon={<Users size={19} />}
                    rows={sections[1].rows}
                    step={2}
                    onEdit={onEdit}
                />

                {/* ETHICS ANSWERS */}
                <ReviewCard
                    title="Ethics answers"
                    icon={<HelpCircle size={19} />}
                    rows={sections[2].rows}
                    step={3}
                    onEdit={onEdit}
                />

                {/* ATTACHMENTS */}
                <section className="rounded-xl bg-white px-5 py-4">

                    <div className="mb-3 flex items-center justify-between gap-3">

                        <div className="flex items-center gap-3">

                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe5e9] text-[#d00027]">
                                <Paperclip size={19} />
                            </span>

                            <h3 className="text-[17px] font-extrabold text-[#171725]">
                                Attachments
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={() => onEdit(4)}
                            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#d00027] hover:underline"
                        >
                            <Pencil size={17} />
                            Edit
                        </button>
                    </div>

                    <div className="space-y-2">
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <AttachmentItem
                                    key={`${index}-${file.name}`}
                                    file={file}
                                />
                            ))
                        ) : (
                            <p className="text-[13px] text-[#7b8eae]">
                                No documents selected yet.
                            </p>
                        )}
                    </div>
                </section>
            </div>

            {/* =====================================
                CONFIRMATION & ACTIONS
            ===================================== */}

            <section className="rounded-xl bg-white px-4 py-4">

                {/* CONFIRMATION CHECKBOX */}
                <label className="flex cursor-pointer items-start gap-3">

                    <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(event) =>
                            setConfirmed(
                                event.target.checked,
                            )
                        }
                        className="mt-1 h-5 w-5 shrink-0 rounded border-[#a50021] text-[#a50021] focus:ring-[#a50021]"
                    />

                    <span>
                        <span className="block text-[13px] font-medium text-[#30436a]">
                            I confirm that the information and
                            documents provided are accurate and complete.
                        </span>

                        <span className="mt-1 block text-[12px] text-[#8398b9]">
                            Submission begins the review process and
                            does not constitute ethics approval.
                        </span>
                    </span>
                </label>

                {/* ACTION BUTTONS */}
                <div className="mt-4 flex flex-col justify-between gap-3 border-t border-[#dce3ee] pt-4 sm:flex-row sm:items-center">

                    {/* BACK */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md border border-[#a50021] px-5 text-[13px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                    >
                        <ArrowLeft size={18} />
                        Back: Documents
                    </button>

                    <div className="flex flex-wrap gap-3">

                        {/* PREVIEW */}
                        <button
                            type="button"
                            onClick={onPreview}
                            className="h-[44px] rounded-md border border-[#a50021] px-5 text-[13px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                        >
                            Preview form
                        </button>

                        {/* SAVE DRAFT */}
                        <button
                            type="button"
                            onClick={onSaveDraft}
                            className="h-[44px] rounded-md border border-[#a50021] px-5 text-[13px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                        >
                            Save draft
                        </button>

                        {/* SUBMIT */}
                        <button
                            type="button"
                            disabled={
                                !allComplete || !confirmed
                            }
                            onClick={onSubmit}
                            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-5 text-[13px] font-bold text-white hover:bg-[#87001b] disabled:cursor-not-allowed disabled:bg-[#d8dce5] disabled:text-[#7382a0]"
                        >
                            Submit application
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* DISABLED REASON */}
                {!allComplete && (
                    <p className="mt-3 text-[12px] text-[#b96700]">
                        Complete all required sections to enable submission.
                    </p>
                )}
            </section>
        </div>
    );
}

// ==============================================
// PDF DOCUMENT GENERATOR
// ==============================================

function generatePDF(
    sections: ReviewSection[],
): jsPDF {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    let y = 20;

    // Ensure that content fits on the page
    function ensureSpace(height: number) {
        if (y + height > pageHeight - 20) {
            pdf.addPage();
            y = 20;
        }
    }

    // DOCUMENT HEADER
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(23, 23, 37);
    pdf.setFontSize(13);

    pdf.text(
        'POLYTECHNIC UNIVERSITY OF THE PHILIPPINES',
        pageWidth / 2,
        y,
        { align: 'center' },
    );

    y += 7;

    pdf.setFontSize(11);

    pdf.text(
        'RESEARCH ETHICS APPLICATION FORM',
        pageWidth / 2,
        y,
        { align: 'center' },
    );

    y += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(165, 0, 33);

    pdf.text(
        'SAMPLE PREVIEW - NOT AN OFFICIAL SUBMISSION',
        pageWidth / 2,
        y,
        { align: 'center' },
    );

    y += 12;

    // DOCUMENT SECTIONS
    sections.forEach((section, index) => {
        ensureSpace(15);

        pdf.setFillColor(226, 229, 233);
        pdf.rect(15, y, 180, 8, 'F');

        pdf.setTextColor(23, 23, 37);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);

        pdf.text(
            `${String.fromCharCode(65 + index)}. ${section.title.toUpperCase()}`,
            18,
            y + 5.5,
        );

        y += 11;

        // TABLE ROWS
        section.rows.forEach((row) => {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);

            const labelLines = pdf.splitTextToSize(
                row.label,
                48,
            ) as string[];

            const valueLines = pdf.splitTextToSize(
                row.value || 'Not provided',
                116,
            ) as string[];

            const lineCount = Math.max(
                labelLines.length,
                valueLines.length,
                1,
            );

            let offset = 0;

            // Allow long answers to continue on a new page.
            while (offset < lineCount) {
                ensureSpace(12);

                const availableHeight =
                    pageHeight - 20 - y;

                const maxLines = Math.max(
                    1,
                    Math.floor(
                        (availableHeight - 6) / 4.5,
                    ),
                );

                const chunkLines = Math.min(
                    maxLines,
                    lineCount - offset,
                );

                const rowHeight =
                    chunkLines * 4.5 + 6;

                pdf.setDrawColor(185, 193, 205);

                pdf.rect(
                    15,
                    y,
                    180,
                    rowHeight,
                );

                pdf.line(
                    72,
                    y,
                    72,
                    y + rowHeight,
                );

                pdf.setTextColor(23, 23, 37);

                const labelChunk =
                    labelLines.slice(
                        offset,
                        offset + chunkLines,
                    );

                const valueChunk =
                    valueLines.slice(
                        offset,
                        offset + chunkLines,
                    );

                if (labelChunk.length > 0) {
                    pdf.text(
                        labelChunk,
                        18,
                        y + 5,
                    );
                }

                if (valueChunk.length > 0) {
                    pdf.text(
                        valueChunk,
                        75,
                        y + 5,
                    );
                }

                y += rowHeight;
                offset += chunkLines;
            }
        });

        y += 9;
    });

    // PAGE NUMBERS
    const pageCount = pdf.getNumberOfPages();

    for (
        let page = 1;
        page <= pageCount;
        page++
    ) {
        pdf.setPage(page);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(110, 130, 160);

        pdf.text(
            `Application form - Page ${page} of ${pageCount}`,
            pageWidth - 15,
            pageHeight - 10,
            { align: 'right' },
        );
    }

    return pdf;
}

// ==============================================
// APPLICATION PDF PREVIEW COMPONENT
// ==============================================

interface PreviewProps extends ReviewData {
    onBack: () => void;
}

export function ApplicationPreview({
    research,
    team,
    ethics,
    documents,
    onBack,
}: PreviewProps) {
    const sections = useMemo(
        () =>
            buildReviewSections({
                research,
                team,
                ethics,
                documents,
            }),
        [research, team, ethics, documents],
    );

    const pdf = useMemo(
        () => generatePDF(sections),
        [sections],
    );

    const [pdfUrl, setPdfUrl] = useState('');

    // CREATE PDF OBJECT URL
    useEffect(() => {
        const url = URL.createObjectURL(
            pdf.output('blob'),
        );

        setPdfUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [pdf]);

    // DOWNLOAD
    function downloadPDF() {
        pdf.save(
            'Ethics_Application_Preview.pdf',
        );
    }

    return (
        <div>

            {/* PAGE HEADER */}
            <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div>
                    <div className="mb-3 h-1 w-12 rounded-full bg-[#ff8500]" />

                    <h1 className="text-[30px] font-extrabold tracking-tight text-[#171725] sm:text-[38px]">
                        Application form preview
                    </h1>

                    <p className="mt-1 text-[16px] text-[#7b8eae]">
                        Review and download your completed application form.
                    </p>
                </div>

                {/* TOP BUTTONS */}
                <div className="flex flex-wrap gap-3">

                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md border border-[#a50021] px-5 text-[13px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                    >
                        <ArrowLeft size={18} />
                        Back to application
                    </button>

                    <button
                        type="button"
                        onClick={downloadPDF}
                        className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-5 text-[13px] font-bold text-white hover:bg-[#87001b]"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* NOTICE */}
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#fff3d7] px-4 py-3 text-[13px] text-[#b85a00]">
                <Info
                    size={20}
                    className="shrink-0"
                />

                Sample form layout — official template to
                be provided by the Ethics Office.
            </div>

            {/* PDF VIEWER */}
            <section className="overflow-hidden rounded-xl bg-white">

                {/* PDF HEADER */}
                <div className="flex items-center gap-3 border-b border-[#dde4ee] px-5 py-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded bg-[#e60023] text-[10px] font-bold text-white">
                        PDF
                    </span>

                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#171725]">
                        Ethics_Application_Preview.pdf
                    </span>

                    <button
                        type="button"
                        onClick={downloadPDF}
                        aria-label="Download PDF"
                        className="text-[#63799c] hover:text-[#a50021]"
                    >
                        <Download size={20} />
                    </button>
                </div>

                {/* EMBEDDED PDF */}
                {pdfUrl && (
                    <iframe
                        title="Ethics application PDF preview"
                        src={pdfUrl}
                        className="h-[680px] w-full border-0 bg-[#d9e0e8]"
                    />
                )}
            </section>
        </div>
    );
}