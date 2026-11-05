import {
    useEffect,
    useRef,
    useState,
    type DragEvent,
} from 'react';

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    CloudUpload,
    Eye,
    FileText,
    LockKeyhole,
    Plus,
    Upload,
    X,
} from 'lucide-react';

// ==============================================
// TYPES
// ==============================================

export type DocumentKey =
    | 'manuscript'
    | 'consent'
    | 'instruments'
    | 'supporting';

export type DocumentUploads = Record<
    DocumentKey,
    File | null
>;

export const initialDocuments: DocumentUploads = {
    manuscript: null,
    consent: null,
    instruments: null,
    supporting: null,
};

// ==============================================
// FILE CONFIGURATION
// ==============================================

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface DocumentField {
    key: DocumentKey;
    title: string;
    required: boolean;
    accept: string;
}

const documentFields: DocumentField[] = [
    {
        key: 'manuscript',
        title: 'Research manuscript / protocol',
        required: true,
        accept: '.pdf',
    },
    {
        key: 'consent',
        title: 'Informed consent form',
        required: true,
        accept: '.pdf',
    },
    {
        key: 'instruments',
        title: 'Research instruments',
        required: true,
        accept: '.pdf',
    },
    {
        key: 'supporting',
        title: 'Additional supporting documents',
        required: false,
        accept: '.pdf,.docx',
    },
];

// ==============================================
// VALIDATION
// ==============================================

function validFile(
    file: File,
    accept: string,
): boolean {
    const extension = file.name
        .split('.')
        .pop()
        ?.toLowerCase();

    const allowedExtensions = accept
        .split(',')
        .map((item) => item.replace('.', ''));

    if (
        !extension ||
        !allowedExtensions.includes(extension)
    ) {
        return false;
    }

    return file.size > 0 && file.size <= MAX_FILE_SIZE;
}

export function documentsAreComplete(
    data: DocumentUploads,
): boolean {
    return documentFields
        .filter((field) => field.required)
        .every((field) => {
            const file = data[field.key];

            return (
                file !== null &&
                validFile(file, field.accept)
            );
        });
}

function formatFileSize(size: number): string {
    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.ceil(size / 1024)} KB`;
}

// ==============================================
// INDIVIDUAL FILE FIELD
// ==============================================

interface FileFieldProps {
    field: DocumentField;
    file: File | null;
    onFileChange: (file: File | null) => void;
}

function FileField({
    field,
    file,
    onFileChange,
}: FileFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);

    // Generate a temporary PDF preview URL
    useEffect(() => {
        if (
            !file ||
            !file.name.toLowerCase().endsWith('.pdf')
        ) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(file);

        setPreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    // SELECT AND VALIDATE FILE
    function selectFile(selected: File | null) {
        if (!selected) return;

        if (!validFile(selected, field.accept)) {
            setError(
                `Invalid file. Accepted formats: ${field.accept}. Maximum size: 10 MB.`,
            );
            return;
        }

        setError('');
        onFileChange(selected);
    }

    // DRAG AND DROP
    function handleDrop(
        event: DragEvent<HTMLDivElement>,
    ) {
        event.preventDefault();

        setDragging(false);

        selectFile(
            event.dataTransfer.files[0] || null,
        );
    }

    // VIEW FILE
    function viewFile() {
        if (!previewUrl) return;

        window.open(
            previewUrl,
            '_blank',
            'noopener,noreferrer',
        );
    }

    return (
        <div className="rounded-lg border border-[#d7dfeb] bg-white px-3 py-3">

            {/* FIELD TITLE AND STATUS */}
            <div className="mb-2 flex flex-wrap items-center gap-3">

                <span className="text-[13px] font-medium text-[#171725]">
                    {field.title}

                    {field.required && (
                        <span className="text-red-600">
                            {' '}*
                        </span>
                    )}

                    {!field.required && (
                        <span className="text-[12px] text-[#7b8eae]">
                            {' '}(optional)
                        </span>
                    )}
                </span>

                {/* FILE STATUS */}
                {file ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e0f6e8] px-3 py-1 text-[12px] text-[#00894c]">
                        <CheckCircle2 size={15} />
                        Selected
                    </span>
                ) : field.required ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0df] px-3 py-1 text-[12px] text-[#ce6700]">
                        <AlertCircle size={15} />
                        Missing
                    </span>
                ) : null}
            </div>

            {/* HIDDEN FILE INPUT */}
            <input
                ref={inputRef}
                type="file"
                accept={field.accept}
                className="hidden"
                aria-label={`Choose ${field.title}`}
                onChange={(event) => {
                    selectFile(
                        event.target.files?.[0] || null,
                    );

                    // Allow selecting the same file again
                    event.target.value = '';
                }}
            />

            {/* FILE SELECTED */}
            {file ? (
                <div className="flex flex-wrap items-center gap-3 rounded-md border border-[#dce3ee] bg-[#fbfcfe] px-3 py-2">

                    {/* FILE ICON */}
                    <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white ${
                            file.name.toLowerCase().endsWith('.pdf')
                                ? 'bg-[#e60023]'
                                : 'bg-[#0876d9]'
                        }`}
                    >
                        {file.name.toLowerCase().endsWith('.pdf')
                            ? 'PDF'
                            : 'DOCX'}
                    </span>

                    {/* FILE INFORMATION */}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[#171725]">
                            {file.name}
                        </p>

                        <p className="mt-0.5 text-[12px] text-[#8295b2]">
                            {formatFileSize(file.size)}
                        </p>
                    </div>

                    {/* VIEW BUTTON */}
                    {previewUrl && (
                        <button
                            type="button"
                            onClick={viewFile}
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-[#617597] px-4 text-[12px] font-bold text-[#34476c] hover:bg-[#f1f5fa]"
                        >
                            <Eye size={18} />
                            View
                        </button>
                    )}

                    {/* REPLACE BUTTON */}
                    <button
                        type="button"
                        onClick={() =>
                            inputRef.current?.click()
                        }
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-[#d00027] px-4 text-[12px] font-bold text-[#d00027] hover:bg-[#fff0f3]"
                    >
                        <Upload size={18} />
                        Replace
                    </button>

                    {/* REMOVE BUTTON */}
                    <button
                        type="button"
                        onClick={() => {
                            onFileChange(null);
                            setError('');
                        }}
                        aria-label={`Remove ${field.title}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#d00027] hover:bg-[#fff0f3]"
                    >
                        <X size={19} />
                    </button>
                </div>
            ) : (

                /* FILE DROP ZONE */
                <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Upload ${field.title}`}
                    onClick={() =>
                        inputRef.current?.click()
                    }
                    onKeyDown={(event) => {
                        if (
                            event.key === 'Enter' ||
                            event.key === ' '
                        ) {
                            event.preventDefault();
                            inputRef.current?.click();
                        }
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() =>
                        setDragging(false)
                    }
                    onDrop={handleDrop}
                    className={`flex min-h-[68px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-3 py-2 text-center transition ${
                        dragging
                            ? 'border-[#a50021] bg-[#fff0f3]'
                            : 'border-[#c9d5e7] bg-[#fafbfe] hover:bg-[#fff5f6]'
                    }`}
                >
                    <div className="flex items-center gap-2 text-[14px] text-[#d00027]">

                        {field.key === 'supporting' ? (
                            <Plus size={21} />
                        ) : (
                            <CloudUpload size={23} />
                        )}

                        {field.key === 'supporting'
                            ? 'Upload supporting document'
                            : 'Choose file or drag and drop'}
                    </div>

                    <p className="mt-1 text-[12px] text-[#8295b2]">
                        {field.accept.includes('docx')
                            ? 'PDF or DOCX'
                            : 'PDF'}{' '}
                        • Maximum 10 MB
                    </p>
                </div>
            )}

            {/* FILE ERROR */}
            {error && (
                <p
                    role="alert"
                    className="mt-2 text-[12px] font-medium text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

// ==============================================
// MAIN STEP 4 COMPONENT
// ==============================================

interface Props {
    value: DocumentUploads;
    onChange: (value: DocumentUploads) => void;
    onBack: () => void;
    onSaveDraft: () => void;
    onNext: () => void;
}

export default function Step4Documents({
    value,
    onChange,
    onBack,
    onSaveDraft,
    onNext,
}: Props) {
    const requiredFields = documentFields.filter(
        (field) => field.required,
    );

    const requiredCount = requiredFields.length;

    const selectedCount = requiredFields.filter(
        (field) => {
            const file = value[field.key];

            return (
                file !== null &&
                validFile(file, field.accept)
            );
        },
    ).length;

    const missingCount = requiredCount - selectedCount;

    const complete = documentsAreComplete(value);

    function updateFile(
        field: DocumentKey,
        file: File | null,
    ) {
        onChange({
            ...value,
            [field]: file,
        });
    }

    return (
        <section className="rounded-xl bg-white px-5 py-5 sm:px-6">

            {/* HEADER */}
            <h2 className="text-[23px] font-extrabold tracking-tight text-[#171725]">
                Upload requirements
            </h2>

            <p className="mt-1 text-[14px] text-[#7b8eae]">
                Sample requirements and upload limits for this mockup.
            </p>

            {/* UPLOAD STATUS BANNER */}
            <div
                className={`mt-3 flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] ${
                    complete
                        ? 'bg-[#e7f7eb] text-[#087c40]'
                        : 'bg-[#fff0d9] text-[#be5b00]'
                }`}
            >
                {complete ? (
                    <CheckCircle2
                        size={20}
                        className="shrink-0"
                    />
                ) : (
                    <AlertCircle
                        size={20}
                        className="shrink-0"
                    />
                )}

                <span>
                    {selectedCount} of {requiredCount} required
                    documents selected
                    {missingCount > 0 &&
                        ` • ${missingCount} missing requirement${missingCount > 1 ? 's' : ''}`}
                </span>
            </div>

            {/* FILE UPLOAD SECTIONS */}
            <div className="mt-3 space-y-2">
                {documentFields.map((field) => (
                    <FileField
                        key={field.key}
                        field={field}
                        file={value[field.key]}
                        onFileChange={(file) =>
                            updateFile(
                                field.key,
                                file,
                            )
                        }
                    />
                ))}
            </div>

            {/* SECURITY INFORMATION */}
            <div className="mt-3 flex items-center gap-2 text-[12px] text-[#7b8eae]">
                <LockKeyhole size={15} />

                Files are selected locally. Secure server
                storage will be enabled after backend integration.
            </div>

            {/* BOTTOM BUTTONS */}
            <div className="mt-4 flex flex-col justify-between gap-3 border-t border-[#dce3ee] pt-4 sm:flex-row sm:items-center">

                {/* BACK */}
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md border border-[#a50021] px-5 text-[13px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                >
                    <ArrowLeft size={19} />
                    Back: Ethics questions
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">

                    {/* SAVE DRAFT */}
                    <button
                        type="button"
                        onClick={onSaveDraft}
                        className="h-[44px] rounded-md border border-[#a50021] px-5 text-[13px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                    >
                        Save draft
                    </button>

                    {/* NEXT */}
                    <button
                        type="button"
                        disabled={!complete}
                        onClick={onNext}
                        className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-5 text-[13px] font-bold text-white hover:bg-[#87001b] disabled:cursor-not-allowed disabled:bg-[#d8dce5] disabled:text-[#7382a0]"
                    >
                        Next: Review &amp; submit
                        <ArrowRight size={19} />
                    </button>
                </div>
            </div>

            {/* MISSING DOCUMENT WARNING */}
            {!complete && (
                <p className="mt-2 text-right text-[11px] text-[#8295b2]">
                    Select the missing required documents to continue.
                </p>
            )}
        </section>
    );
}