import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    Copy,
    Download,
    Info,
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface SubmittedApplication {
    referenceNumber: string;
    title: string;
    submittedAt: string;
    detailsUrl?: string;
    downloadUrl?: string | null;
}

interface Props {
    application: SubmittedApplication;
    demo?: boolean;
    onBack?: () => void;
    onDownload?: () => void;
}

// ==========================================
// NEXT STEPS
// ==========================================

const nextSteps = [
    {
        number: 1,
        title: 'Requirements checking',
        description:
            'The Ethics Coordinator will check your application and documents.',
    },
    {
        number: 2,
        title: 'Reviewer assignment',
        description:
            'Once complete, your application will be assigned for ethics review.',
    },
    {
        number: 3,
        title: 'Track updates',
        description:
            'Check notifications for feedback or requests for revisions.',
    },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Confirmation({
    application,
    demo = false,
    onBack,
    onDownload,
}: Props) {
    const [copied, setCopied] = useState(false);

    const canDownload =
        Boolean(onDownload) ||
        Boolean(application.downloadUrl);

    // COPY APPLICATION REFERENCE
    async function copyReference() {
        try {
            await navigator.clipboard.writeText(
                application.referenceNumber,
            );

            setCopied(true);
        } catch {
            setCopied(false);
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Submission Confirmation" />

            {/* DEMO NOTICE */}
            {demo && (
                <div className="mx-auto mb-4 flex max-w-[910px] items-center justify-center gap-2 rounded-lg border border-[#ffd17c] bg-[#fff5df] px-4 py-3 text-center text-[13px] text-[#ad5900]">
                    <AlertCircle size={18} className="shrink-0" />
                    Preview only — no application has actually been submitted.
                </div>
            )}

            {/* ======================================
                CONFIRMATION CARD
            ====================================== */}

            <section className="mx-auto max-w-[910px] rounded-xl bg-white px-5 py-7 sm:px-10 sm:py-8">

                {/* SUCCESS ICON */}
                <div className="relative mx-auto flex h-[92px] w-[110px] items-center justify-center">

                    {/* DECORATIONS */}
                    <span className="absolute left-[7px] top-[21px] h-[4px] w-[16px] rotate-45 rounded-full bg-[#ff8500]" />
                    <span className="absolute left-[4px] top-[46px] h-[4px] w-[16px] -rotate-15 rounded-full bg-[#ff8500]" />
                    <span className="absolute right-[7px] top-[21px] h-[4px] w-[16px] -rotate-45 rounded-full bg-[#ff8500]" />
                    <span className="absolute right-[4px] top-[46px] h-[4px] w-[16px] rotate-15 rounded-full bg-[#ff8500]" />

                    {/* MAIN CIRCLE */}
                    <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#ffe6e9]">
                        <Check
                            size={44}
                            strokeWidth={4}
                            className="text-[#a50021]"
                        />
                    </div>
                </div>

                {/* MAIN HEADING */}
                <div className="mt-2 text-center">

                    <h1 className="text-[27px] font-extrabold tracking-tight text-[#171725] sm:text-[36px] sm:leading-tight">
                        Application submitted successfully
                    </h1>

                    <p className="mt-1 text-[15px] leading-relaxed text-[#758bad] sm:text-[18px]">
                        {demo
                            ? 'This is a sample of the confirmation you will see after submitting your application.'
                            : 'Your ethics application has been received and is awaiting requirements checking.'}
                    </p>
                </div>

                {/* ======================================
                    APPLICATION REFERENCE
                ====================================== */}

                <div className="mx-auto mt-4 max-w-[585px] rounded-xl bg-[#ffedf0] px-5 py-4 text-center">

                    <p className="text-[12px] font-bold uppercase text-[#806468]">
                        {demo
                            ? 'Sample application reference number'
                            : 'Application reference number'}
                    </p>

                    <button
                        type="button"
                        onClick={copyReference}
                        title="Copy reference number"
                        className="mt-1 inline-flex max-w-full items-center justify-center gap-3 text-[#a50021] hover:opacity-80"
                    >
                        <span className="break-all text-[25px] font-extrabold tracking-tight sm:text-[30px]">
                            {application.referenceNumber}
                        </span>

                        <Copy
                            size={21}
                            strokeWidth={1.9}
                            className="shrink-0"
                        />
                    </button>

                    {copied && (
                        <p className="mt-1 text-[11px] text-[#a50021]">
                            {demo
                                ? 'Sample reference copied.'
                                : 'Reference number copied.'}
                        </p>
                    )}
                </div>

                {/* ======================================
                    APPLICATION TITLE AND STATUS
                ====================================== */}

                <div className="mt-4 text-center">

                    <h2 className="text-[18px] font-extrabold text-[#171725] sm:text-[20px]">
                        {application.title || 'Untitled research application'}
                    </h2>

                    <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#ffe9ed] px-3 py-1 text-[12px] font-bold text-[#a50021]">
                        <span className="h-[8px] w-[8px] rounded-full bg-[#a50021]" />
                        {demo ? 'Demo preview' : 'Submitted'}
                    </span>

                    {demo ? (
                        <p className="mt-2 text-[13px] text-[#758bad]">
                            No submission has been recorded.
                        </p>
                    ) : (
                        <p className="mt-2 text-[14px] text-[#758bad]">
                            Submitted on {application.submittedAt}
                        </p>
                    )}
                </div>

                {/* ======================================
                    WHAT HAPPENS NEXT
                ====================================== */}

                <div className="mx-auto mt-5 max-w-[615px] border-t border-[#dce3ee] pt-4">

                    <h3 className="mb-3 text-[21px] font-extrabold tracking-tight text-[#171725]">
                        What happens next?
                    </h3>

                    <div className="space-y-3">

                        {nextSteps.map((step) => (
                            <div
                                key={step.number}
                                className="flex items-start gap-5"
                            >
                                {/* STEP NUMBER */}
                                <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#ffe6e9] text-[23px] font-extrabold text-[#a50021]">
                                    {step.number}
                                </span>

                                {/* STEP INFORMATION */}
                                <div className="pt-0.5">

                                    <h4 className="text-[15px] font-bold text-[#171725]">
                                        {step.title}
                                    </h4>

                                    <p className="mt-1 text-[14px] leading-[1.45] text-[#758bad]">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* BOTTOM INFORMATION NOTE */}
                    <div className="mt-4 flex items-center gap-3 border-t border-[#dce3ee] pt-3">

                        <Info
                            size={19}
                            className="shrink-0 text-[#7189ab]"
                        />

                        <p className="text-[12px] text-[#7b8eae]">
                            Submission is not an ethics approval or clearance.
                        </p>
                    </div>
                </div>

                {/* ======================================
                    ACTION BUTTONS
                ====================================== */}

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

                    {/* VIEW APPLICATION */}
                    {demo && onBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex h-[46px] min-w-[225px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-6 text-[14px] font-bold text-white transition hover:bg-[#87001b]"
                        >
                            View application
                            <ArrowRight size={19} />
                        </button>
                    ) : (
                        <Link
                            href={
                                application.detailsUrl ||
                                '/applications'
                            }
                            className="inline-flex h-[46px] min-w-[225px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-6 text-[14px] font-bold text-white transition hover:bg-[#87001b]"
                        >
                            View application
                            <ArrowRight size={19} />
                        </Link>
                    )}

                    {/* DOWNLOAD APPLICATION FORM */}
                    {onDownload ? (
                        <button
                            type="button"
                            onClick={onDownload}
                            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-md border border-[#a50021] bg-white px-6 text-[14px] font-bold text-[#a50021] transition hover:bg-[#fff0f3]"
                        >
                            <Download size={19} />
                            Download application form
                        </button>
                    ) : application.downloadUrl ? (
                        <a
                            href={application.downloadUrl}
                            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-md border border-[#a50021] bg-white px-6 text-[14px] font-bold text-[#a50021] transition hover:bg-[#fff0f3]"
                        >
                            <Download size={19} />
                            Download application form
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled={!canDownload}
                            title="PDF download is not connected yet"
                            className="inline-flex h-[46px] cursor-not-allowed items-center justify-center gap-2 rounded-md border border-[#d3a4af] bg-white px-6 text-[14px] font-bold text-[#a87884] opacity-70"
                        >
                            <Download size={19} />
                            Download application form
                        </button>
                    )}
                </div>

                {/* BACK TO DASHBOARD */}
                <div className="mt-4 text-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-[14px] font-medium text-[#a50021] underline hover:text-[#87001b]"
                    >
                        <ArrowLeft size={17} />
                        Back to dashboard
                    </Link>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}