import { useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import {
    AlertCircle,
    Check,
    Save,
    X,
} from 'lucide-react';

import Step1Research, {
    initialResearch,
    researchIsComplete,
    type ResearchDetails,
} from './Steps/Step1Research';

import Step2Researchers, {
    initialTeam,
    teamIsComplete,
    type TeamData,
} from './Steps/Step2Researchers';

import Step3Ethics, {
    initialEthics,
    ethicsIsComplete,
    type EthicsAnswers,
} from './Steps/Step3Ethics';

import Step4Documents, {
    initialDocuments,
    documentsAreComplete,
    type DocumentUploads,
} from './Steps/Step4Documents';

import Step5Review from './Steps/Step5Review';

import Preview, {
    downloadApplicationPdf,
} from './Preview';

// ==============================================
// TYPES
// ==============================================

interface AuthUser {
    name?: string;
    email?: string;
    student_number?: string;
    studentNumber?: string;
}

// ==============================================
// APPLICATION STEPS
// ==============================================

const steps = [
    'Research details',
    'Researchers & adviser',
    'Ethics questions',
    'Documents',
    'Review & submit',
];

const descriptions = [
    'Tell us about your research.',
    'Add your research team and adviser.',
    'Provide the ethics information for your study.',
    'Upload your manuscript and supporting documents.',
    'Review your information before submitting.',
];

// ==============================================
// MAIN COMPONENT
// ==============================================

export default function CreateApplication() {
    const page = usePage();

    const user = (
        page.props as {
            auth?: {
                user?: AuthUser;
            };
        }
    ).auth?.user;

    // CURRENT STEP
    const [currentStep, setCurrentStep] = useState(1);

    // STEP 1
    const [research, setResearch] =
        useState<ResearchDetails>({
            ...initialResearch,
        });

    // STEP 2
    const [team, setTeam] = useState<TeamData>(() =>
        initialTeam(user),
    );

    // STEP 3
    const [ethics, setEthics] =
        useState<EthicsAnswers>({
            ...initialEthics,
        });

    // STEP 4
    const [documents, setDocuments] =
        useState<DocumentUploads>({
            ...initialDocuments,
        });

    // PREVIEW AND SUBMISSION
    const [previewOpen, setPreviewOpen] =
        useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // NOTIFICATION
    const [notice, setNotice] = useState('');

    // ==========================================
    // STEP COMPLETION VALIDATION
    // ==========================================

    const completion = useMemo(
        () => [
            researchIsComplete(research),
            teamIsComplete(team),
            ethicsIsComplete(ethics),
            documentsAreComplete(documents),
            false,
        ],
        [research, team, ethics, documents],
    );

    // CHECK ALL REQUIRED STEPS
    const allComplete = completion
        .slice(0, 4)
        .every(Boolean);

    // FIND INCOMPLETE PREVIOUS STEPS
    const incompletePreviousSteps = completion
        .slice(0, currentStep - 1)
        .flatMap((complete, index) =>
            complete ? [] : [index + 1],
        );

    // CALCULATE PROGRESS LINE
    let completedChain = 0;

    for (let index = 0; index < 4; index++) {
        if (!completion[index]) {
            break;
        }

        completedChain++;
    }

    // ==========================================
    // STEP NAVIGATION
    // ==========================================

    function goToStep(step: number) {
        if (step < 1 || step > 5) {
            return;
        }

        // Allow clicking any step even if earlier
        // steps have not been completed.
        setCurrentStep(step);
        setNotice('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    // ==========================================
    // CANCEL APPLICATION
    // ==========================================

    function cancelApplication() {
        const confirmed = window.confirm(
            'Leave this application? Any unsaved changes will be lost.',
        );

        if (confirmed) {
            router.visit('/applications');
        }
    }

    // ==========================================
    // SAVE DRAFT - BACKEND PENDING
    // ==========================================

    function saveDraft() {
        setNotice(
            'Draft saving is not connected to Laravel yet. Your entries remain available while this page stays open.',
        );
    }

    // ==========================================
    // SAVE AND EXIT - BACKEND PENDING
    // ==========================================

    function saveAndExit() {
        setNotice(
            'Save and exit requires Laravel backend integration. Your application has not been saved to the database.',
        );
    }

    // ==========================================
    // SUBMIT APPLICATION
    // ==========================================

    function submitApplication() {
        if (!allComplete) {
            setNotice(
                'Please complete all required sections before proceeding.',
            );

            return;
        }

        setNotice('');
        router.post(
            route('applications.store'),
            {
                research: {
                    researchTitle: research.researchTitle,
                    department: research.department,
                    researchType: research.researchType,
                    studyDescription: research.studyDescription,
                    proposedStartDate: research.proposedStartDate,
                    proposedEndDate: research.proposedEndDate,
                },
                team: {
                    primary: {
                        fullName: team.primary.fullName,
                        email: team.primary.email,
                        studentNumber: team.primary.studentNumber,
                        contactNumber: team.primary.contactNumber,
                    },
                    members: team.members.map((member) => ({
                        id: member.id,
                        fullName: member.fullName,
                        email: member.email,
                        studentNumber: member.studentNumber,
                    })),
                    adviser: {
                        fullName: team.adviser.fullName,
                        email: team.adviser.email,
                        department: team.adviser.department,
                    },
                },
                ethics: {
                    humanParticipants: ethics.humanParticipants,
                    vulnerableGroups: ethics.vulnerableGroups,
                    consent: ethics.consent,
                    dataProtection: ethics.dataProtection,
                },
                documents,
            },
            {
                forceFormData: true,
                onStart: () => setIsSubmitting(true),
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setNotice(
                        firstError ||
                            'Your application could not be submitted. Please review the form and try again.',
                    );
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    }

    // ==========================================
    // DOWNLOAD APPLICATION PDF
    // ==========================================

    async function handleDownloadPdf() {
        try {
            await downloadApplicationPdf({
                research,
                team,
                ethics,
                documents,
            });
        } catch (error) {
            console.error('PDF generation error:', error);

            window.alert(
                'Unable to generate the application PDF. Please try again.',
            );
        }
    }

    // ==========================================
    // ==========================================
    // PDF PREVIEW SCREEN
    // ==========================================

    if (previewOpen) {
        return (
            <AuthenticatedLayout>
                <Head title="Application Form Preview" />

                <Preview
                    research={research}
                    team={team}
                    ethics={ethics}
                    documents={documents}
                    onBack={() => {
                        setPreviewOpen(false);
                        setCurrentStep(5);
                    }}
                />
            </AuthenticatedLayout>
        );
    }

    // ==========================================
    // MAIN APPLICATION FORM
    // ==========================================

    return (
        <AuthenticatedLayout>
            <Head title="New Ethics Application" />

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="mb-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div>
                    {/* ORANGE ACCENT */}
                    <div className="mb-3 h-1 w-12 rounded-full bg-[#ff8500]" />

                    {/* PAGE TITLE */}
                    <h1 className="text-[30px] font-extrabold tracking-tight text-[#171725] sm:text-[42px] sm:leading-[1.15]">
                        New ethics application
                    </h1>

                    {/* CURRENT STEP DESCRIPTION */}
                    <p className="mt-2 text-[16px] text-[#798aaa] sm:text-[19px]">
                        Step {currentStep} of 5 —{' '}
                        {descriptions[currentStep - 1]}
                    </p>
                </div>

                {/* SAVE AND EXIT */}
                <button
                    type="button"
                    onClick={saveAndExit}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#a50021] bg-white px-5 text-sm font-bold text-[#a50021] transition hover:bg-[#fff0f3]"
                >
                    <Save size={19} />
                    Save and exit
                </button>
            </div>

            {/* =====================================
                CLICKABLE STEP INDICATOR
            ===================================== */}

            <div className="relative mb-7 mt-6">

                {/* BACKGROUND PROGRESS LINE */}
                <div className="absolute left-[10%] right-[10%] top-[20px] h-[2px] bg-[#d9dfeb]" />

                {/* COMPLETED PROGRESS LINE */}
                <div
                    className="absolute left-[10%] top-[20px] h-[2px] bg-[#a50021] transition-all duration-300"
                    style={{
                        width: `${completedChain * 20}%`,
                    }}
                />

                {/* STEP CIRCLES */}
                <div className="relative grid grid-cols-5 gap-1">

                    {steps.map((step, index) => {
                        const number = index + 1;

                        const active =
                            currentStep === number;

                        const complete =
                            completion[index];

                        const previous =
                            number < currentStep;

                        const incomplete =
                            previous && !complete;

                        return (
                            <button
                                key={number}
                                type="button"
                                onClick={() =>
                                    goToStep(number)
                                }
                                aria-current={
                                    active
                                        ? 'step'
                                        : undefined
                                }
                                aria-label={`${step}${
                                    complete
                                        ? ', completed'
                                        : incomplete
                                          ? ', incomplete'
                                          : ''
                                }`}
                                className="group flex min-w-0 flex-col items-center text-center"
                            >

                                {/* NUMBER / CHECK ICON */}
                                <span
                                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-[4px] border-[#faf8f8] text-[17px] font-bold transition group-hover:scale-105 ${
                                        active
                                            ? 'bg-[#a50021] text-white'
                                            : complete
                                              ? 'bg-[#a50021] text-white'
                                              : incomplete
                                                ? 'bg-[#fff0e5] text-[#db6a00] ring-1 ring-[#f7a451]'
                                                : 'bg-[#e6e8ef] text-[#667792]'
                                    }`}
                                >
                                    {complete && !active ? (
                                        <Check
                                            size={21}
                                            strokeWidth={2.5}
                                        />
                                    ) : incomplete ? (
                                        '!'
                                    ) : (
                                        number
                                    )}
                                </span>

                                {/* STEP LABEL */}
                                <span
                                    className={`mt-1.5 text-[11px] leading-snug sm:text-[13px] ${
                                        active
                                            ? 'font-bold text-[#a50021]'
                                            : complete
                                              ? 'font-semibold text-[#a50021]'
                                              : incomplete
                                                ? 'font-semibold text-[#d46a00]'
                                                : 'text-[#7d8eac]'
                                    }`}
                                >
                                    {step}
                                </span>

                                {/* INCOMPLETE INDICATOR */}
                                {incomplete && (
                                    <span className="mt-1 rounded-full bg-[#fff0e5] px-2 py-0.5 text-[10px] font-semibold text-[#ce6500]">
                                        Incomplete
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* =====================================
                INCOMPLETE PREVIOUS STEP WARNING
            ===================================== */}

            {incompletePreviousSteps.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-[#ffddb4] bg-[#fff7ed] px-4 py-3">

                    <AlertCircle
                        size={20}
                        className="shrink-0 text-[#e87500]"
                    />

                    <p className="flex-1 text-[13px] text-[#ad5900]">
                        {incompletePreviousSteps.length === 1
                            ? `Step ${incompletePreviousSteps[0]} is incomplete.`
                            : `Steps ${incompletePreviousSteps.join(', ')} are incomplete.`}{' '}
                        Complete the missing information before submitting your application.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            goToStep(
                                incompletePreviousSteps[0],
                            )
                        }
                        className="text-[12px] font-bold text-[#a50021] hover:underline"
                    >
                        Complete now
                    </button>
                </div>
            )}

            {/* =====================================
                STEP 1 - RESEARCH DETAILS
            ===================================== */}

            {currentStep === 1 && (
                <Step1Research
                    value={research}
                    onChange={setResearch}
                    onCancel={cancelApplication}
                    onSaveDraft={saveDraft}
                    onNext={() => goToStep(2)}
                />
            )}

            {/* =====================================
                STEP 2 - RESEARCHERS & ADVISER
            ===================================== */}

            {currentStep === 2 && (
                <Step2Researchers
                    value={team}
                    onChange={setTeam}
                    onBack={() => goToStep(1)}
                    onSaveDraft={saveDraft}
                    onNext={() => goToStep(3)}
                />
            )}

            {/* =====================================
                STEP 3 - ETHICS QUESTIONS
            ===================================== */}

            {currentStep === 3 && (
                <Step3Ethics
                    value={ethics}
                    onChange={setEthics}
                    onBack={() => goToStep(2)}
                    onSaveDraft={saveDraft}
                    onNext={() => goToStep(4)}
                />
            )}

            {/* =====================================
                STEP 4 - DOCUMENT UPLOADS
            ===================================== */}

            {currentStep === 4 && (
                <Step4Documents
                    value={documents}
                    onChange={setDocuments}
                    onBack={() => goToStep(3)}
                    onSaveDraft={saveDraft}
                    onNext={() => goToStep(5)}
                />
            )}

            {/* =====================================
                STEP 5 - REVIEW & SUBMIT
            ===================================== */}

            {currentStep === 5 && (
                <Step5Review
                    research={research}
                    team={team}
                    ethics={ethics}
                    documents={documents}
                    allComplete={allComplete}
                    onEdit={goToStep}
                    onBack={() => goToStep(4)}
                    onSaveDraft={saveDraft}
                    onPreview={() =>
                        setPreviewOpen(true)
                    }
                    onSubmit={submitApplication}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* =====================================
                NOTIFICATION MESSAGE
            ===================================== */}

            {notice && (
                <div
                    role="status"
                    className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-lg bg-[#171725] px-4 py-3 text-[13px] text-white shadow-xl"
                >
                    <span>{notice}</span>

                    <button
                        type="button"
                        onClick={() => setNotice('')}
                        aria-label="Dismiss notification"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

        </AuthenticatedLayout>
    );
}