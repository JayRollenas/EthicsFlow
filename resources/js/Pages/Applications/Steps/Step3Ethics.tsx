import { useState, type FormEvent } from 'react';

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Info,
} from 'lucide-react';

// ==============================================
// TYPES
// ==============================================

export interface EthicsAnswers {
    humanParticipants: '' | 'yes' | 'no';
    vulnerableGroups: '' | 'yes' | 'no' | 'na';
    consent: string;
    dataProtection: string;
}

export const initialEthics: EthicsAnswers = {
    humanParticipants: '',
    vulnerableGroups: '',
    consent: '',
    dataProtection: '',
};

// ==============================================
// VALIDATION
// ==============================================

export function ethicsIsComplete(
    data: EthicsAnswers,
): boolean {
    return Boolean(
        data.humanParticipants &&
        data.vulnerableGroups &&
        data.consent.trim() &&
        data.dataProtection.trim(),
    );
}

// ==============================================
// PROPS
// ==============================================

interface Props {
    value: EthicsAnswers;
    onChange: (value: EthicsAnswers) => void;
    onBack: () => void;
    onSaveDraft: () => void;
    onNext: () => void;
}

// ==============================================
// STYLES
// ==============================================

const outlineButton =
    'inline-flex h-[45px] items-center justify-center gap-2 rounded-md border border-[#a50021] bg-white px-5 text-[14px] font-bold text-[#a50021] hover:bg-[#fff0f3]';

const radioClass =
    'h-5 w-5 cursor-pointer border-[#8fa1bd] text-[#a50021] focus:ring-[#a50021]';

const textareaClass =
    'min-h-[72px] w-full resize-y rounded-md border border-[#cdd7e8] bg-white px-4 py-3 text-[14px] text-[#171725] placeholder:text-[#8297b8] focus:border-[#a50021] focus:ring-1 focus:ring-[#a50021]';

// ==============================================
// COMPONENT
// ==============================================

export default function Step3Ethics({
    value,
    onChange,
    onBack,
    onSaveDraft,
    onNext,
}: Props) {
    const [error, setError] = useState('');

    function update<K extends keyof EthicsAnswers>(
        field: K,
        newValue: EthicsAnswers[K],
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

        if (!ethicsIsComplete(value)) {
            setError(
                'Please answer all required ethics questions.',
            );
            return;
        }

        onNext();
    }

    return (
        <div className="space-y-4">

            {/* SAMPLE QUESTIONS WARNING */}
            <div className="flex items-center gap-3 rounded-lg border border-[#ffd17c] bg-[#fff5df] px-5 py-3">
                <Info
                    size={21}
                    className="shrink-0 text-[#e87500]"
                />

                <p className="text-[14px] font-semibold text-[#b94700]">
                    Sample questions — replace with the official
                    Ethics Office form.
                </p>
            </div>

            {/* ETHICS QUESTIONS FORM */}
            <form
                onSubmit={handleSubmit}
                className="rounded-xl bg-white px-5 py-5 sm:px-6"
            >

                {/* HEADING */}
                <div className="mb-3">
                    <h2 className="text-[23px] font-extrabold tracking-tight text-[#171725]">
                        Ethics questions
                    </h2>

                    <p className="mt-1 text-[14px] text-[#7b8eae]">
                        Fields marked{' '}
                        <span className="font-bold text-red-600">*</span>{' '}
                        are required. Answer based on your proposed study.
                    </p>
                </div>

                {/* =====================================
                    QUESTION 1
                ===================================== */}

                <div className="border-b border-[#dce3ee] py-4">

                    <p className="text-[15px] font-bold text-[#171725]">
                        1. Will your study involve human participants?
                        <span className="text-red-600"> *</span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-8 pl-7">

                        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[#63799c]">
                            <input
                                type="radio"
                                name="humanParticipants"
                                value="yes"
                                required
                                checked={
                                    value.humanParticipants === 'yes'
                                }
                                onChange={() =>
                                    update(
                                        'humanParticipants',
                                        'yes',
                                    )
                                }
                                className={radioClass}
                            />
                            Yes
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[#63799c]">
                            <input
                                type="radio"
                                name="humanParticipants"
                                value="no"
                                required
                                checked={
                                    value.humanParticipants === 'no'
                                }
                                onChange={() =>
                                    update(
                                        'humanParticipants',
                                        'no',
                                    )
                                }
                                className={radioClass}
                            />
                            No
                        </label>
                    </div>
                </div>

                {/* =====================================
                    QUESTION 2
                ===================================== */}

                <div className="border-b border-[#dce3ee] py-4">

                    <p className="text-[15px] font-bold text-[#171725]">
                        2. Will participants include minors or other
                        vulnerable groups?
                        <span className="text-red-600"> *</span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-8 pl-7">

                        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[#63799c]">
                            <input
                                type="radio"
                                name="vulnerableGroups"
                                required
                                value="yes"
                                checked={
                                    value.vulnerableGroups === 'yes'
                                }
                                onChange={() =>
                                    update(
                                        'vulnerableGroups',
                                        'yes',
                                    )
                                }
                                className={radioClass}
                            />
                            Yes
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[#63799c]">
                            <input
                                type="radio"
                                name="vulnerableGroups"
                                required
                                value="no"
                                checked={
                                    value.vulnerableGroups === 'no'
                                }
                                onChange={() =>
                                    update(
                                        'vulnerableGroups',
                                        'no',
                                    )
                                }
                                className={radioClass}
                            />
                            No
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[#63799c]">
                            <input
                                type="radio"
                                name="vulnerableGroups"
                                required
                                value="na"
                                checked={
                                    value.vulnerableGroups === 'na'
                                }
                                onChange={() =>
                                    update(
                                        'vulnerableGroups',
                                        'na',
                                    )
                                }
                                className={radioClass}
                            />
                            Not applicable
                        </label>
                    </div>
                </div>

                {/* =====================================
                    QUESTION 3
                ===================================== */}

                <div className="border-b border-[#dce3ee] py-4">

                    <label
                        htmlFor="consent"
                        className="mb-2 block text-[15px] font-bold text-[#171725]"
                    >
                        3. How will informed consent be obtained?
                        <span className="text-red-600"> *</span>
                    </label>

                    <textarea
                        id="consent"
                        required
                        rows={3}
                        maxLength={5000}
                        value={value.consent}
                        onChange={(e) =>
                            update(
                                'consent',
                                e.target.value,
                            )
                        }
                        placeholder="Describe the consent process, or explain why it does not apply."
                        className={textareaClass}
                    />
                </div>

                {/* =====================================
                    QUESTION 4
                ===================================== */}

                <div className="py-4">

                    <label
                        htmlFor="dataProtection"
                        className="mb-2 block text-[15px] font-bold text-[#171725]"
                    >
                        4. How will participant privacy and research
                        data be protected?
                        <span className="text-red-600"> *</span>
                    </label>

                    <textarea
                        id="dataProtection"
                        required
                        rows={3}
                        maxLength={5000}
                        value={value.dataProtection}
                        onChange={(e) =>
                            update(
                                'dataProtection',
                                e.target.value,
                            )
                        }
                        placeholder="Describe confidentiality, data access, and storage safeguards."
                        className={textareaClass}
                    />
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div
                        role="alert"
                        className="mb-4 flex items-center gap-2 rounded-lg bg-[#fff0f3] px-4 py-3 text-[13px] text-[#a50021]"
                    >
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex flex-col justify-between gap-3 border-t border-[#dce3ee] pt-4 sm:flex-row sm:items-center">

                    <button
                        type="button"
                        onClick={onBack}
                        className={outlineButton}
                    >
                        <ArrowLeft size={19} />
                        Back: Researchers &amp; adviser
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row">

                        <button
                            type="button"
                            onClick={onSaveDraft}
                            className={outlineButton}
                        >
                            Save draft
                        </button>

                        <button
                            type="submit"
                            className="inline-flex h-[45px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-5 text-[14px] font-bold text-white hover:bg-[#87001b]"
                        >
                            Next: Documents
                            <ArrowRight size={19} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}