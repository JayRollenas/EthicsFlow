import { useState, type FormEvent } from 'react';

import {
    ArrowRight,
    Info,
} from 'lucide-react';

// ==============================================
// TYPES
// ==============================================

export interface ResearchDetails {
    researchTitle: string;
    department: string;
    researchType: string;
    studyDescription: string;
    proposedStartDate: string;
    proposedEndDate: string;
}

export const initialResearch: ResearchDetails = {
    researchTitle: '',
    department: '',
    researchType: '',
    studyDescription: '',
    proposedStartDate: '',
    proposedEndDate: '',
};

// ==============================================
// OPTIONS
// ==============================================

const departments = [
    'Computer Engineering',
    'Computer Science',
    'Information Technology',
    'Electronics Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Education',
    'Psychology',
    'Other',
];

const researchTypes = [
    'Quantitative Research',
    'Qualitative Research',
    'Mixed Methods Research',
    'Experimental Research',
    'Descriptive Research',
    'Survey Research',
    'Other',
];

// ==============================================
// VALIDATION
// ==============================================

export function researchIsComplete(
    data: ResearchDetails,
): boolean {
    return Boolean(
        data.researchTitle.trim() &&
        data.department.trim() &&
        data.researchType.trim() &&
        data.studyDescription.trim() &&
        data.proposedStartDate &&
        data.proposedEndDate &&
        data.proposedEndDate >= data.proposedStartDate,
    );
}

// ==============================================
// PROPS
// ==============================================

interface Props {
    value: ResearchDetails;
    onChange: (value: ResearchDetails) => void;
    onCancel: () => void;
    onSaveDraft: () => void;
    onNext: () => void;
}

// ==============================================
// STYLING
// ==============================================

const inputClass =
    'h-[44px] w-full rounded-md border border-[#cdd7e8] bg-white px-4 text-[14px] text-[#171725] placeholder:text-[#8a9bb6] focus:border-[#a50021] focus:ring-1 focus:ring-[#a50021]';

const labelClass =
    'mb-2 block text-[14px] font-medium text-[#171725]';

// ==============================================
// COMPONENT
// ==============================================

export default function Step1Research({
    value,
    onChange,
    onCancel,
    onSaveDraft,
    onNext,
}: Props) {
    const [error, setError] = useState('');

    function update<K extends keyof ResearchDetails>(
        field: K,
        newValue: ResearchDetails[K],
    ) {
        onChange({
            ...value,
            [field]: newValue,
        });

        setError('');
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!researchIsComplete(value)) {
            setError(
                'Please complete all required fields and check the proposed dates.',
            );
            return;
        }

        onNext();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-white px-5 py-5 sm:px-6"
        >
            {/* FORM TITLE */}
            <div className="mb-5">
                <h2 className="text-[23px] font-extrabold tracking-tight text-[#171725]">
                    Research details
                </h2>

                <p className="mt-1 text-[14px] text-[#7b8eae]">
                    Fields marked{' '}
                    <span className="font-bold text-red-600">*</span>{' '}
                    are required.
                </p>
            </div>

            {/* RESEARCH TITLE */}
            <div className="mb-5">
                <label
                    htmlFor="researchTitle"
                    className={labelClass}
                >
                    Research title{' '}
                    <span className="text-red-600">*</span>
                </label>

                <input
                    id="researchTitle"
                    type="text"
                    required
                    maxLength={255}
                    value={value.researchTitle}
                    onChange={(e) =>
                        update(
                            'researchTitle',
                            e.target.value,
                        )
                    }
                    placeholder="Enter the complete title of your study."
                    className={inputClass}
                />

                <div className="mt-2 flex items-center gap-2 text-[12px] text-[#7b8eae]">
                    <Info
                        size={17}
                        fill="#6b7893"
                        stroke="white"
                        className="shrink-0"
                    />

                    Use the same research title as your manuscript.
                </div>
            </div>

            {/* DEPARTMENT AND RESEARCH TYPE */}
            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* DEPARTMENT */}
                <div>
                    <label
                        htmlFor="department"
                        className={labelClass}
                    >
                        Department / Program{' '}
                        <span className="text-red-600">*</span>
                    </label>

                    <select
                        id="department"
                        required
                        value={value.department}
                        onChange={(e) =>
                            update(
                                'department',
                                e.target.value,
                            )
                        }
                        className={inputClass}
                    >
                        <option value="">
                            Select department / program
                        </option>

                        {departments.map((department) => (
                            <option
                                key={department}
                                value={department}
                            >
                                {department}
                            </option>
                        ))}
                    </select>
                </div>

                {/* RESEARCH TYPE */}
                <div>
                    <label
                        htmlFor="researchType"
                        className={labelClass}
                    >
                        Type of research{' '}
                        <span className="text-red-600">*</span>
                    </label>

                    <select
                        id="researchType"
                        required
                        value={value.researchType}
                        onChange={(e) =>
                            update(
                                'researchType',
                                e.target.value,
                            )
                        }
                        className={inputClass}
                    >
                        <option value="">
                            Select research type
                        </option>

                        {researchTypes.map((type) => (
                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* STUDY DESCRIPTION */}
            <div className="mb-5">
                <label
                    htmlFor="studyDescription"
                    className={labelClass}
                >
                    Study description{' '}
                    <span className="text-red-600">*</span>
                </label>

                <textarea
                    id="studyDescription"
                    required
                    rows={3}
                    maxLength={5000}
                    value={value.studyDescription}
                    onChange={(e) =>
                        update(
                            'studyDescription',
                            e.target.value,
                        )
                    }
                    placeholder="Briefly describe your study, its purpose, and proposed approach."
                    className="min-h-[85px] w-full resize-y rounded-md border border-[#cdd7e8] bg-white px-4 py-3 text-[14px] text-[#171725] placeholder:text-[#8a9bb6] focus:border-[#a50021] focus:ring-1 focus:ring-[#a50021]"
                />
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* START DATE */}
                <div>
                    <label
                        htmlFor="proposedStartDate"
                        className={labelClass}
                    >
                        Proposed start date{' '}
                        <span className="text-red-600">*</span>
                    </label>

                    <input
                        id="proposedStartDate"
                        type="date"
                        required
                        value={value.proposedStartDate}
                        onChange={(e) =>
                            update(
                                'proposedStartDate',
                                e.target.value,
                            )
                        }
                        className={inputClass}
                    />
                </div>

                {/* END DATE */}
                <div>
                    <label
                        htmlFor="proposedEndDate"
                        className={labelClass}
                    >
                        Proposed end date{' '}
                        <span className="text-red-600">*</span>
                    </label>

                    <input
                        id="proposedEndDate"
                        type="date"
                        required
                        min={
                            value.proposedStartDate ||
                            undefined
                        }
                        value={value.proposedEndDate}
                        onChange={(e) =>
                            update(
                                'proposedEndDate',
                                e.target.value,
                            )
                        }
                        className={inputClass}
                    />
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <p
                    role="alert"
                    className="mt-4 text-[13px] font-medium text-red-600"
                >
                    {error}
                </p>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[#e0e5ed] pt-4 sm:flex-row sm:items-center">

                {/* CANCEL */}
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-[45px] rounded-md border border-[#a50021] bg-white px-8 text-[14px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                >
                    Cancel
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">

                    {/* SAVE DRAFT */}
                    <button
                        type="button"
                        onClick={onSaveDraft}
                        className="h-[45px] rounded-md border border-[#a50021] bg-white px-6 text-[14px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                    >
                        Save draft
                    </button>

                    {/* NEXT */}
                    <button
                        type="submit"
                        className="inline-flex h-[45px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-5 text-[14px] font-bold text-white hover:bg-[#87001b]"
                    >
                        Next: Researchers &amp; adviser
                        <ArrowRight size={19} />
                    </button>
                </div>
            </div>
        </form>
    );
}