import { useState } from 'react';
import { Head } from '@inertiajs/react';

import CoordinatorLayout, {
    type CoordinatorSection,
} from '@/Layouts/Coordinator';

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    FileText,
    Info,
    Save,
    Undo2,
    X,
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

type VerificationStatus =
    | 'verified'
    | 'correction'
    | 'missing';

type Screen =
    | 'verification'
    | 'application'
    | 'section';

interface Requirement {
    id: number;
    name: string;
    file: string | null;
    status: VerificationStatus;
    remark: string;
}

// ==========================================
// SAMPLE APPLICATION
// ==========================================

const application = {
    reference: 'REC-2026-0051',
    title: 'Campus Energy Monitoring Study',
    researcher: 'Marco Dela Cruz',
    department: 'Computer Engineering',
    submittedAt: 'October 26, 2026',
    status: 'Awaiting checking',
};

// ==========================================
// SAMPLE REQUIREMENTS
// ==========================================

const initialRequirements: Requirement[] = [
    {
        id: 1,
        name: 'Research manuscript / protocol',
        file: 'Research_Manuscript.pdf',
        status: 'verified',
        remark: 'Complete and readable.',
    },
    {
        id: 2,
        name: 'Informed consent form',
        file: 'Informed_Consent.pdf',
        status: 'correction',
        remark:
            'Participant information section is incomplete.',
    },
    {
        id: 3,
        name: 'Research instruments',
        file: null,
        status: 'missing',
        remark:
            'Upload the questionnaire or applicable research instrument.',
    },
];

// ==========================================
// STATUS CONFIGURATION
// ==========================================

const statusLabels: Record<
    VerificationStatus,
    string
> = {
    verified: 'Verified',
    correction: 'Needs correction',
    missing: 'Missing',
};

const statusColors: Record<
    VerificationStatus,
    string
> = {
    verified: 'bg-[#ddf8e7] text-[#008c46]',
    correction: 'bg-[#fff0d9] text-[#f07800]',
    missing: 'bg-[#ffe2e8] text-[#e6002d]',
};

// ==========================================
// COORDINATOR PAGE TITLES
// ==========================================

const sectionTitles: Record<
    CoordinatorSection,
    string
> = {
    dashboard: 'Coordinator dashboard',
    applications: 'All applications',
    reviewers: 'Reviewers',
    progress: 'Review progress',
    clearances: 'Clearances',
    users: 'User management',
    activity: 'Activity log',
    notifications: 'Notifications',
    settings: 'Account settings',
};

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({
    status,
    count,
}: {
    status: VerificationStatus;
    count: number;
}) {
    const icon =
        status === 'verified' ? (
            <Check size={15} />
        ) : status === 'correction' ? (
            <span className="font-bold">!</span>
        ) : (
            <X size={15} />
        );

    const label =
        status === 'verified'
            ? 'verified'
            : status === 'correction'
              ? 'needs correction'
              : 'missing';

    return (
        <span
            className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium ${statusColors[status]}`}
        >
            {icon}
            {count} {label}
        </span>
    );
}

// ==========================================
// APPLICATION SUMMARY
// ==========================================

function ApplicationSummary() {
    return (
        <section className="mb-4 rounded-xl bg-white px-5 py-5">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_0.85fr_0.95fr]">

                {/* RESEARCHER */}
                <div className="flex items-center gap-4 border-b border-[#dfe6f0] pb-4 sm:pb-2 xl:border-b-0 xl:border-r xl:pr-5">

                    <div className="flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-full bg-[#ffe7eb]">
                        <FileText
                            size={28}
                            strokeWidth={1.8}
                            className="text-[#c4002b]"
                        />
                    </div>

                    <div>
                        <p className="text-[14px] text-[#5c7bb2]">
                            Researcher
                        </p>

                        <p className="mt-3 text-[17px] font-extrabold text-[#13152f]">
                            {application.researcher}
                        </p>
                    </div>
                </div>

                {/* DEPARTMENT */}
                <div className="border-b border-[#dfe6f0] pb-4 sm:pb-2 xl:border-b-0 xl:border-r xl:px-5">

                    <p className="text-[14px] text-[#5c7bb2]">
                        Department
                    </p>

                    <p className="mt-3 text-[17px] text-[#13152f]">
                        {application.department}
                    </p>
                </div>

                {/* SUBMITTED DATE */}
                <div className="border-b border-[#dfe6f0] pb-4 sm:border-b-0 xl:border-r xl:px-5">

                    <p className="text-[14px] text-[#5c7bb2]">
                        Submitted on
                    </p>

                    <p className="mt-3 text-[16px] text-[#13152f]">
                        {application.submittedAt}
                    </p>
                </div>

                {/* STATUS */}
                <div className="xl:pl-5">

                    <p className="text-[14px] text-[#5c7bb2]">
                        Application status
                    </p>

                    <div className="mt-3 rounded-full bg-[#fff0d5] px-4 py-1.5 text-center text-[13px] font-medium text-[#ee7100]">
                        {application.status}
                    </div>
                </div>

            </div>
        </section>
    );
}

// ==========================================
// MAIN COORDINATOR DASHBOARD
// ==========================================

export default function CoordinatorDashboard() {

    // ======================================
    // PAGE NAVIGATION
    // ======================================

    const [activeSection, setActiveSection] =
        useState<CoordinatorSection>('applications');

    const [screen, setScreen] =
        useState<Screen>('verification');

    // ======================================
    // DOCUMENT REQUIREMENTS
    // ======================================

    const [requirements, setRequirements] =
        useState<Requirement[]>(initialRequirements);

    // ======================================
    // COORDINATOR NOTES
    // ======================================

    const [notes, setNotes] = useState(
        'Please complete the consent form and upload the research instrument before review assignment.',
    );

    // ======================================
    // NOTIFICATION
    // ======================================

    const [notice, setNotice] = useState('');

    // ======================================
    // REQUIREMENT COUNTS
    // ======================================

    const verifiedCount = requirements.filter(
        (item) => item.status === 'verified',
    ).length;

    const correctionCount = requirements.filter(
        (item) => item.status === 'correction',
    ).length;

    const missingCount = requirements.filter(
        (item) => item.status === 'missing',
    ).length;

    const allVerified = requirements.every(
        (item) =>
            item.status === 'verified' &&
            item.file !== null,
    );

    // ======================================
    // UPDATE VERIFICATION STATUS
    // ======================================

    function updateStatus(
        id: number,
        status: VerificationStatus,
    ) {
        setRequirements((previous) =>
            previous.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                // Cannot verify a document that
                // has not been uploaded.
                if (!item.file && status === 'verified') {
                    setNotice(
                        'A missing document cannot be marked as verified.',
                    );

                    return item;
                }

                return {
                    ...item,
                    status,
                };
            }),
        );
    }

    // ======================================
    // UPDATE REMARKS
    // ======================================

    function updateRemark(
        id: number,
        remark: string,
    ) {
        setRequirements((previous) =>
            previous.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          remark,
                      }
                    : item,
            ),
        );
    }

    // ======================================
    // NAVIGATION FUNCTIONS
    // ======================================

    function navigate(section: CoordinatorSection) {
        setActiveSection(section);
        setNotice('');

        if (section === 'applications') {
            setScreen('application');
        } else {
            setScreen('section');
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    function openVerification() {
        setActiveSection('applications');
        setScreen('verification');
        setNotice('');
    }

    function openApplication() {
        setActiveSection('applications');
        setScreen('application');
        setNotice('');
    }

    // ======================================
    // SAMPLE DOCUMENT VIEW
    // ======================================

    function openFile(fileName: string) {
        setNotice(
            `"${fileName}" is a placeholder file. Actual document viewing will be connected to Laravel later.`,
        );
    }

    // ======================================
    // SAVE VERIFICATION DRAFT
    // ======================================

    function saveDraft() {
        setNotice(
            'Demo mode: Your verification changes are kept in this page, but have not been saved to the database.',
        );
    }

    // ======================================
    // RETURN FOR COMPLIANCE
    // ======================================

    function returnForCompliance() {
        if (allVerified) {
            return;
        }

        setNotice(
            'Demo mode: This application requires corrections. No compliance request has been submitted or sent to the researcher.',
        );
    }

    // ======================================
    // PROCEED TO REVIEWER ASSIGNMENT
    // ======================================

    function proceedToAssignment() {
        if (!allVerified) {
            return;
        }

        setNotice(
            'Demo mode: Requirements are complete. Reviewer assignment will become available after backend integration.',
        );
    }

    // ======================================
    // DYNAMIC PAGE TITLE
    // ======================================

    const pageTitle =
        screen === 'verification'
            ? 'Requirements verification'
            : screen === 'application'
              ? 'Application details'
              : sectionTitles[activeSection];

    const breadcrumb =
        screen === 'verification'
            ? 'Applications / Requirements verification'
            : screen === 'application'
              ? 'Applications / Application details'
              : sectionTitles[activeSection];

    // ======================================
    // MAIN PAGE
    // ======================================

    return (
        <CoordinatorLayout
            activeSection={activeSection}
            breadcrumb={breadcrumb}
            onNavigate={navigate}
        >
            <Head title={pageTitle} />

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                    <div className="mb-3 h-[4px] w-[45px] rounded-full bg-[#ff8500]" />

                    <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-[#12142e] sm:text-[39px]">
                        {pageTitle}
                    </h1>

                    {(screen === 'verification' ||
                        screen === 'application') && (
                        <p className="mt-1 text-[17px] text-[#607eaf] sm:text-[21px]">
                            {application.reference}
                            {' • '}
                            {application.title}
                        </p>
                    )}

                    {screen === 'section' && (
                        <p className="mt-2 text-[14px] text-[#748ab0]">
                            Research Ethics Review Management System
                        </p>
                    )}
                </div>

                {/* BACK TO APPLICATION */}
                {screen === 'verification' && (
                    <button
                        type="button"
                        onClick={openApplication}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#d0002c] bg-white px-6 text-[13px] font-bold text-[#b90028] transition hover:bg-[#fff0f3]"
                    >
                        <ArrowLeft size={18} />
                        Back to application
                    </button>
                )}

                {/* CHECK REQUIREMENTS */}
                {screen === 'application' && (
                    <button
                        type="button"
                        onClick={openVerification}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#b50028] px-6 text-[13px] font-bold text-white hover:bg-[#910021]"
                    >
                        Check requirements
                        <ArrowRight size={18} />
                    </button>
                )}

            </div>

            {/* =====================================
                REQUIREMENTS VERIFICATION SCREEN
            ===================================== */}

            {screen === 'verification' && (
                <>

                    {/* APPLICATION SUMMARY */}
                    <ApplicationSummary />

                    {/* =================================
                        DOCUMENT COMPLETENESS CHECK
                    ================================= */}

                    <section className="mb-4 rounded-xl bg-white px-5 py-5">

                        {/* SECTION HEADER */}
                        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">

                            <div>
                                <h2 className="text-[23px] font-extrabold text-[#14152e]">
                                    Document completeness check
                                </h2>

                                <p className="mt-1 text-[14px] text-[#6a82ab]">
                                    Sample checklist — confirm against official submission requirements.
                                </p>
                            </div>

                            {/* COUNTERS */}
                            <div className="flex flex-wrap gap-2">

                                <StatusBadge
                                    status="verified"
                                    count={verifiedCount}
                                />

                                <StatusBadge
                                    status="correction"
                                    count={correctionCount}
                                />

                                <StatusBadge
                                    status="missing"
                                    count={missingCount}
                                />

                            </div>
                        </div>

                        {/* DOCUMENT TABLE */}
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[850px] border-collapse text-left">

                                <thead>
                                    <tr className="bg-[#edf2f7] text-[12px] font-bold text-[#264b83]">

                                        <th className="w-[23%] rounded-l-md px-3 py-4">
                                            Requirement
                                        </th>

                                        <th className="w-[28%] px-3 py-4">
                                            Submitted file
                                        </th>

                                        <th className="w-[19%] px-3 py-4">
                                            Verification
                                        </th>

                                        <th className="w-[30%] rounded-r-md px-3 py-4">
                                            Remarks
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {requirements.map((item) => (

                                        <tr
                                            key={item.id}
                                            className="border-b border-[#dce4ee]"
                                        >

                                            {/* REQUIREMENT */}
                                            <td className="px-3 py-3 text-[13px] text-[#304f84]">
                                                {item.name}
                                            </td>

                                            {/* SUBMITTED FILE */}
                                            <td className="px-3 py-3">

                                                {item.file ? (

                                                    <div className="flex flex-wrap items-center gap-3">

                                                        <span className="break-all text-[13px] text-[#2465df]">
                                                            {item.file}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openFile(item.file!)
                                                            }
                                                            className="whitespace-nowrap text-[13px] font-medium text-[#2465df] hover:underline"
                                                        >
                                                            Open ↗
                                                        </button>

                                                    </div>

                                                ) : (

                                                    <span className="text-[13px] text-[#7186ad]">
                                                        No file uploaded
                                                    </span>

                                                )}
                                            </td>

                                            {/* VERIFICATION STATUS */}
                                            <td className="px-3 py-3">

                                                <select
                                                    value={item.status}
                                                    disabled={!item.file}
                                                    aria-label={`Verification status for ${item.name}`}
                                                    onChange={(event) =>
                                                        updateStatus(
                                                            item.id,
                                                            event.target.value as VerificationStatus,
                                                        )
                                                    }
                                                    className={`w-full max-w-[185px] cursor-pointer appearance-none rounded-full border-0 px-4 py-2 text-[13px] font-medium outline-none focus:ring-2 focus:ring-[#c9002a] disabled:cursor-not-allowed ${statusColors[item.status]}`}
                                                >
                                                    <option value="verified">
                                                        {statusLabels.verified}
                                                    </option>

                                                    <option value="correction">
                                                        {statusLabels.correction}
                                                    </option>

                                                    <option value="missing">
                                                        {statusLabels.missing}
                                                    </option>

                                                </select>
                                            </td>

                                            {/* REMARKS */}
                                            <td className="px-3 py-3">

                                                <textarea
                                                    rows={1}
                                                    value={item.remark}
                                                    onChange={(event) =>
                                                        updateRemark(
                                                            item.id,
                                                            event.target.value,
                                                        )
                                                    }
                                                    aria-label={`Remarks for ${item.name}`}
                                                    className="min-h-[43px] w-full resize-y rounded-md border border-[#ccd8eb] bg-white px-3 py-2.5 text-[12px] leading-[1.5] text-[#304f84] outline-none focus:border-[#b00025]"
                                                />

                                            </td>

                                        </tr>

                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </section>

                    {/* =================================
                        COORDINATOR NOTES AND OUTCOME
                    ================================= */}

                    <div className="mb-4 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.05fr_0.95fr]">

                        {/* COORDINATOR NOTES */}
                        <section className="rounded-xl bg-white px-5 py-4">

                            <h2 className="mb-3 text-[21px] font-extrabold text-[#14152e]">
                                Coordinator notes
                            </h2>

                            <textarea
                                rows={5}
                                maxLength={500}
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
                                placeholder="Enter verification notes..."
                                className="min-h-[125px] w-full resize-y rounded-md border border-[#ccd8eb] bg-white px-4 py-3 text-[13px] leading-[1.7] text-[#305189] outline-none focus:border-[#b00025]"
                            />

                            <p className="mt-1 text-right text-[12px] text-[#7186ad]">
                                {notes.length}/500
                            </p>

                        </section>

                        {/* VERIFICATION OUTCOME */}
                        <section className="rounded-xl bg-white px-5 py-4">

                            <h2 className="mb-3 text-[21px] font-extrabold text-[#14152e]">
                                Verification outcome
                            </h2>

                            <div
                                className={`rounded-lg px-4 py-4 ${
                                    allVerified
                                        ? 'bg-[#ebfaf0]'
                                        : 'bg-[#fff2dc]'
                                }`}
                            >

                                <div className="flex items-center gap-4">

                                    {/* STATUS ICON */}
                                    <div
                                        className={`flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full text-white ${
                                            allVerified
                                                ? 'bg-[#0da663]'
                                                : 'bg-[#ff8500]'
                                        }`}
                                    >
                                        {allVerified ? (
                                            <CheckCircle2 size={27} />
                                        ) : (
                                            <AlertCircle size={27} />
                                        )}
                                    </div>

                                    {/* STATUS MESSAGE */}
                                    <div>

                                        <h3
                                            className={`text-[18px] font-extrabold ${
                                                allVerified
                                                    ? 'text-[#008e47]'
                                                    : 'text-[#ed6800]'
                                            }`}
                                        >
                                            {allVerified
                                                ? 'Requirements complete'
                                                : 'Requirements incomplete'}
                                        </h3>

                                        <p className="mt-1 text-[12px] text-[#8b704e]">
                                            {allVerified
                                                ? 'All required documents are marked verified.'
                                                : 'Return for compliance before assigning reviewers.'}
                                        </p>

                                    </div>
                                </div>

                                {/* DISCLAIMER */}
                                <div className="mt-4 border-t border-[#eadcc6] pt-3">

                                    <p className="flex items-start gap-2 text-[12px] text-[#6b83b0]">

                                        <Info
                                            size={15}
                                            className="mt-0.5 shrink-0"
                                        />

                                        Completeness checking does not constitute ethics approval.

                                    </p>

                                </div>

                            </div>
                        </section>

                    </div>

                    {/* =================================
                        BOTTOM ACTION BUTTONS
                    ================================= */}

                    <section className="flex flex-wrap justify-end gap-3 rounded-xl bg-white px-5 py-4">

                        {/* SAVE DRAFT */}
                        <button
                            type="button"
                            onClick={saveDraft}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#c8002b] bg-white px-5 text-[13px] font-bold text-[#b00025] hover:bg-[#fff0f3]"
                        >
                            <Save size={17} />
                            Save verification draft
                        </button>

                        {/* RETURN FOR COMPLIANCE */}
                        <button
                            type="button"
                            onClick={returnForCompliance}
                            disabled={allVerified}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#b00025] px-5 text-[13px] font-bold text-white transition hover:bg-[#8d001e] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Undo2 size={17} />
                            Return for compliance
                        </button>

                        {/* PROCEED TO REVIEWER ASSIGNMENT */}
                        <button
                            type="button"
                            onClick={proceedToAssignment}
                            disabled={!allVerified}
                            className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-[13px] font-bold ${
                                allVerified
                                    ? 'bg-[#b00025] text-white hover:bg-[#8d001e]'
                                    : 'cursor-not-allowed bg-[#c0c6d2] text-white'
                            }`}
                        >
                            Proceed to reviewer assignment
                        </button>

                    </section>
                </>
            )}

            {/* =====================================
                APPLICATION DETAILS PLACEHOLDER
            ===================================== */}

            {screen === 'application' && (
                <div className="space-y-4">

                    <ApplicationSummary />

                    <section className="rounded-xl bg-white p-6">

                        <h2 className="text-[22px] font-extrabold text-[#14152e]">
                            Application overview
                        </h2>

                        <p className="mt-2 text-[14px] text-[#6a82ab]">
                            Review the sample application information
                            and verify the submitted documents.
                        </p>

                        <div className="mt-5 rounded-lg border border-[#dfe6ef] p-5">

                            <p className="text-[18px] font-bold text-[#14152e]">
                                {application.title}
                            </p>

                            <p className="mt-2 text-[13px] text-[#6a82ab]">
                                Reference: {application.reference}
                            </p>

                            <p className="mt-1 text-[13px] text-[#6a82ab]">
                                Researcher: {application.researcher}
                            </p>

                            <p className="mt-1 text-[13px] text-[#6a82ab]">
                                Department: {application.department}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={openVerification}
                            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#b00025] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#8d001e]"
                        >
                            Verify requirements
                            <ArrowRight size={17} />
                        </button>

                    </section>
                </div>
            )}

            {/* =====================================
                OTHER COORDINATOR SIDEBAR PAGES
            ===================================== */}

            {screen === 'section' && (
                <section className="rounded-xl bg-white px-6 py-7">

                    <h2 className="text-[22px] font-extrabold text-[#14152e]">
                        {sectionTitles[activeSection]}
                    </h2>

                    <p className="mt-3 text-[14px] text-[#6a82ab]">
                        This section is currently a frontend placeholder.
                        Its full interface will be added using your
                        next UI reference.
                    </p>

                    {/* QUICK ACCESS */}
                    {activeSection === 'dashboard' && (
                        <div className="mt-5 rounded-lg border border-[#e0e6ef] p-5">

                            <h3 className="text-[17px] font-bold text-[#14152e]">
                                Applications awaiting checking
                            </h3>

                            <p className="mt-2 text-[14px] text-[#6a82ab]">
                                {application.reference} — {application.title}
                            </p>

                            <button
                                type="button"
                                onClick={openVerification}
                                className="mt-4 rounded-md bg-[#b00025] px-5 py-3 text-[13px] font-bold text-white"
                            >
                                Verify requirements
                            </button>

                        </div>
                    )}

                    {/* DEMO DISCLAIMER */}
                    <div className="mt-5 flex items-start gap-3 rounded-lg bg-[#fff6e8] p-4">

                        <Info
                            size={19}
                            className="shrink-0 text-[#c17b19]"
                        />

                        <p className="text-[13px] leading-relaxed text-[#a56b24]">
                            This page uses placeholder information.
                            No actual coordinator records have been
                            retrieved or modified.
                        </p>

                    </div>

                </section>
            )}

            {/* =====================================
                DEMO NOTIFICATION
            ===================================== */}

            {notice && (
                <div
                    role="status"
                    className="fixed bottom-5 right-5 z-[100] flex max-w-[440px] items-start gap-3 rounded-lg bg-[#171725] px-4 py-4 text-[13px] leading-relaxed text-white shadow-xl"
                >

                    <Info
                        size={19}
                        className="shrink-0"
                    />

                    <span className="flex-1">
                        {notice}
                    </span>

                    <button
                        type="button"
                        onClick={() => setNotice('')}
                        aria-label="Dismiss notification"
                    >
                        <X size={18} />
                    </button>

                </div>
            )}

        </CoordinatorLayout>
    );
}