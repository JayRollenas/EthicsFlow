import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import {
    AlertCircle,
    ChevronRight,
    Download,
    FileText,
    Plus,
    X,
} from 'lucide-react';

// SUBMISSION CHECKLIST
const checklist = [
    {
        id: 1,
        title: 'Completed ethics application form',
        description: 'Complete your details in the online application.',
    },
    {
        id: 2,
        title: 'Research manuscript / protocol',
        description:
            'Prepare your study objectives, methods, and procedures.',
    },
    {
        id: 3,
        title: 'Informed consent form (if applicable)',
        description: 'Explain participation and consent clearly.',
    },
    {
        id: 4,
        title: 'Research instruments (if applicable)',
        description:
            'Include questionnaires, interview guides, or assessment tools.',
    },
    {
        id: 5,
        title: 'Supporting permissions (if applicable)',
        description:
            'Include relevant authorization or permission letters.',
    },
];

// FILE UPLOAD GUIDELINES
const guidelines = [
    {
        title: 'Use PDF for final documents',
        description:
            'Use PDF format for all final documents, such as manuscripts, consent forms, and official letters.',
    },
    {
        title: 'Use DOCX where allowed',
        description:
            'Use DOCX format only for editable templates or where explicitly allowed.',
    },
    {
        title: 'Ensure files are readable and complete',
        description:
            'Make sure all files are clear, legible, and complete before uploading.',
    },
    {
        title: 'Use clear filenames',
        description:
            'Use descriptive filenames (e.g., “ConsentForm.docx”).',
    },
];

// APPLICATION PROCESS
const applicationSteps = [
    {
        number: 1,
        title: 'Complete the online application',
    },
    {
        number: 2,
        title: 'Upload applicable requirements',
    },
    {
        number: 3,
        title: 'Review and submit',
    },
    {
        number: 4,
        title: 'Track feedback and revisions',
    },
];

// DOWNLOADABLE RESOURCES
// Replace null with the actual file path once files are uploaded.
const resources = [
    {
        id: 1,
        title: 'Ethics application form',
        format: 'PDF',
        file: null as string | null,
    },
    {
        id: 2,
        title: 'Informed consent template',
        format: 'DOCX',
        file: null as string | null,
    },
    {
        id: 3,
        title: 'Submission guide',
        format: 'PDF',
        file: null as string | null,
    },
];

// CHECK IF A NAMED LARAVEL ROUTE EXISTS
function getRoute(name: string): string | null {
    const ziggy = (
        window as Window & {
            route?: ((name: string) => string) & {
                has?: (name: string) => boolean;
            };
        }
    ).route;

    if (ziggy?.has?.(name)) {
        return ziggy(name);
    }

    return null;
}

export default function Requirements() {
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [notice, setNotice] = useState<string>('');

    // CHECKBOX HANDLER
    function toggleChecklist(id: number) {
        setCheckedItems((previous) =>
            previous.includes(id)
                ? previous.filter((item) => item !== id)
                : [...previous, id],
        );
    }

    // START APPLICATION
    function startApplication() {
        const url = getRoute('applications.create');

        if (url) {
            router.visit(url);
        } else {
            setNotice(
                'The application form is not available yet. Create the application page and route first.',
            );
        }
    }

    // DOWNLOAD RESOURCE
    function downloadResource(
        title: string,
        file: string | null,
    ) {
        if (!file) {
            setNotice(
                `${title} is not available for download yet.`,
            );
            return;
        }

        const link = document.createElement('a');
        link.href = file;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    return (
        <AuthenticatedLayout>
            <Head title="Requirements & Guidelines" />

            {/* PAGE HEADER */}
            <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-3 h-1 w-12 rounded-full bg-[#ff8500]" />

                    <h1 className="text-[30px] font-extrabold tracking-tight text-[#171725] sm:text-[38px] sm:leading-[1.15]">
                        Requirements &amp; guidelines
                    </h1>

                    <p className="mt-2 text-[15px] text-[#7d8dab] sm:text-[18px]">
                        Prepare your documents before starting an
                        ethics application.
                    </p>
                </div>

                {/* START APPLICATION BUTTON */}
                <button
                    type="button"
                    onClick={startApplication}
                    className="inline-flex h-[49px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#a50021] px-8 text-[15px] font-bold text-white transition hover:bg-[#85001b]"
                >
                    Start application
                </button>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">

                {/* LEFT COLUMN */}
                <div className="space-y-4">

                    {/* SAMPLE CHECKLIST ALERT */}
                    <div className="flex min-h-[50px] items-center gap-3 rounded-lg bg-[#fff0e5] px-4 py-3">
                        <AlertCircle
                            size={27}
                            fill="#ff8500"
                            stroke="white"
                            className="shrink-0"
                        />

                        <p className="text-[14px] text-[#e95300]">
                            Sample checklist — confirm requirements
                            with the Ethics Office.
                        </p>
                    </div>

                    {/* SUBMISSION CHECKLIST CARD */}
                    <section className="rounded-xl bg-white px-5 py-4">
                        <h2 className="text-[22px] font-extrabold tracking-tight text-[#171725]">
                            Submission checklist
                        </h2>

                        <p className="mt-0.5 text-[14px] text-[#7b8eae]">
                            Prepare the applicable documents for
                            your study.
                        </p>

                        {/* CHECKLIST ITEMS */}
                        <div className="mt-3 divide-y divide-[#dfe5ee] border-t border-[#dfe5ee]">
                            {checklist.map((item) => {
                                const checked =
                                    checkedItems.includes(item.id);

                                return (
                                    <label
                                        key={item.id}
                                        className="flex cursor-pointer items-start gap-5 px-1 py-3 transition hover:bg-[#fdfafa]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                toggleChecklist(item.id)
                                            }
                                            className="mt-1 h-[23px] w-[23px] shrink-0 cursor-pointer rounded-[4px] border-[#8da0bc] text-[#a50021] focus:ring-[#a50021]"
                                        />

                                        <span className="min-w-0 flex-1">
                                            <span
                                                className={`block text-[15px] font-medium leading-snug ${
                                                    checked
                                                        ? 'text-[#8692a7] line-through'
                                                        : 'text-[#171725]'
                                                }`}
                                            >
                                                {item.title}
                                            </span>

                                            <span className="mt-1 block text-[13px] leading-snug text-[#7b8eae]">
                                                {item.description}
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    {/* HOW TO APPLY CARD */}
                    <section className="rounded-xl bg-white px-5 py-4">
                        <h2 className="text-[22px] font-extrabold tracking-tight text-[#171725]">
                            How to apply
                        </h2>

                        <p className="mt-0.5 text-[14px] text-[#7b8eae]">
                            Follow these steps to submit your
                            ethics application.
                        </p>

                        {/* APPLICATION STEPS */}
                        <div className="mt-4 flex items-start justify-between">
                            {applicationSteps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className="contents"
                                >
                                    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                                        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#ffdee3] text-[23px] font-extrabold text-[#a50021]">
                                            {step.number}
                                        </span>

                                        <p className="mt-2 text-[12px] leading-[1.4] text-[#233969] sm:text-[14px]">
                                            {step.title}
                                        </p>
                                    </div>

                                    {index < applicationSteps.length - 1 && (
                                        <ChevronRight
                                            size={19}
                                            strokeWidth={1.7}
                                            className="mx-1 mt-3 shrink-0 text-[#6b82a3]"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">

                    {/* FILE UPLOAD GUIDELINES */}
                    <section className="rounded-xl bg-white px-5 py-4">
                        <h2 className="text-[21px] font-extrabold tracking-tight text-[#171725]">
                            File upload guidelines
                        </h2>

                        <p className="mt-0.5 text-[14px] text-[#7b8eae]">
                            Follow these guidelines when preparing
                            your files.
                        </p>

                        <div className="mt-4 space-y-4">
                            {guidelines.map((guide, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4"
                                >
                                    {/* GUIDELINE ICON */}
                                    <span className="flex h-[49px] w-[49px] shrink-0 items-center justify-center rounded-full bg-[#fff0e5] text-[#f35c14]">
                                        <FileText
                                            size={27}
                                            strokeWidth={1.8}
                                        />
                                    </span>

                                    {/* GUIDELINE TEXT */}
                                    <div className="min-w-0 pt-1">
                                        <h3 className="text-[13px] font-bold leading-snug text-[#171725]">
                                            {guide.title}
                                        </h3>

                                        <p className="mt-1 text-[13px] leading-[1.4] text-[#7b8eae]">
                                            {guide.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* GUIDELINE FOOTER */}
                        <div className="mt-4 border-t border-[#dfe5ee] pt-3">
                            <p className="text-[12px] leading-[1.5] text-[#7b8eae]">
                                Check accepted formats and size limits
                                beside each upload field.
                            </p>
                        </div>
                    </section>

                    {/* TEMPLATES AND RESOURCES */}
                    <section className="rounded-xl bg-white px-5 py-4">
                        <h2 className="text-[21px] font-extrabold tracking-tight text-[#171725]">
                            Templates &amp; resources
                        </h2>

                        <p className="mt-0.5 text-[14px] text-[#7b8eae]">
                            Download the latest templates and guides.
                        </p>

                        {/* RESOURCE LIST */}
                        <div className="mt-3 space-y-2">
                            {resources.map((resource) => (
                                <button
                                    key={resource.id}
                                    type="button"
                                    onClick={() =>
                                        downloadResource(
                                            resource.title,
                                            resource.file,
                                        )
                                    }
                                    className="flex w-full items-center gap-4 rounded-md border border-[#d9e0eb] bg-white px-3 py-2 text-left transition hover:border-[#a50021] hover:bg-[#fffafb]"
                                >
                                    {/* FILE TYPE ICON */}
                                    <span
                                        className={`flex h-[36px] w-[29px] shrink-0 items-end justify-center rounded-[3px] pb-2 text-[8px] font-extrabold text-white ${
                                            resource.format === 'PDF'
                                                ? 'bg-[#ed0025]'
                                                : 'bg-[#0876d9]'
                                        }`}
                                    >
                                        {resource.format}
                                    </span>

                                    {/* FILE INFORMATION */}
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-[14px] font-medium text-[#171725]">
                                            {resource.title}
                                        </span>

                                        <span className="mt-0.5 block text-[12px] text-[#7b8eae]">
                                            {resource.format}
                                        </span>
                                    </span>

                                    {/* DOWNLOAD ICON */}
                                    <Download
                                        size={23}
                                        strokeWidth={1.8}
                                        className="shrink-0 text-[#7187a8]"
                                    />
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* NOTIFICATION MESSAGE */}
            {notice && (
                <div
                    role="status"
                    className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-lg bg-[#171725] px-4 py-3 text-sm text-white shadow-xl"
                >
                    <span>{notice}</span>

                    <button
                        type="button"
                        onClick={() => setNotice('')}
                        aria-label="Dismiss notification"
                        className="text-white/80 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </AuthenticatedLayout>
    );
}