import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';

import ReviewerLayout, {
    type ReviewerSection,
} from '@/Layouts/ReviewerLayout';

import {
    ArrowRight,
    Bell,
    BookOpen,
    Check,
    CheckCircle2,
    Clock3,
    FileText,
    Info,
    UserRound,
    X,
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

type ReviewStatus =
    | 'pending'
    | 'revision'
    | 'completed';

interface Study {
    reference: string;
    title: string;
    department: string;
    status: ReviewStatus;
    assignedDate?: string;
    completedDate?: string;
}

interface ReviewerNotification {
    id: number;
    title: string;
    description: string;
    date: string;
    type: 'assigned' | 'revised';
}

// ==========================================
// PLACEHOLDER REVIEW DATA
// ==========================================

const studiesRequiringAction: Study[] = [
    {
        reference: 'REC-2026-0042',
        title: 'Student Experiences with Online Learning',
        department: 'Computer Engineering',
        status: 'pending',
        assignedDate: 'Oct 22, 2026',
    },
    {
        reference: 'REC-2026-0047',
        title: 'Campus Accessibility Survey',
        department: 'Industrial Engineering',
        status: 'pending',
        assignedDate: 'Oct 25, 2026',
    },
    {
        reference: 'REC-2026-0035',
        title: 'Usability of a Campus Navigation App',
        department: 'Computer Engineering',
        status: 'revision',
        assignedDate: 'Oct 20, 2026',
    },
];

const recentlyCompleted: Study[] = [
    {
        reference: 'REC-2026-0018',
        title: 'Usability of a Student Information Portal',
        department: 'Computer Engineering',
        status: 'completed',
        completedDate: 'Oct 12, 2026',
    },
];

const recentNotifications: ReviewerNotification[] = [
    {
        id: 1,
        title: 'New study assigned',
        description:
            'REC-2026-0047 is ready for your review.',
        date: 'Oct 25, 2026, 9:00 AM',
        type: 'assigned',
    },
    {
        id: 2,
        title: 'Revised documents submitted',
        description:
            'REC-2026-0035 has an updated submission.',
        date: 'Oct 24, 2026, 10:30 AM',
        type: 'revised',
    },
];

// ==========================================
// STATISTICS CARD
// ==========================================

function StatisticsCard({
    label,
    count,
    icon: Icon,
    background,
    iconColor,
}: {
    label: string;
    count: number;
    icon: typeof FileText;
    background: string;
    iconColor: string;
}) {
    return (
        <div className="flex min-h-[96px] items-center gap-4 rounded-xl bg-white px-4 py-5 sm:px-5">

            <div
                className={`flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-full ${background}`}
            >
                <Icon
                    size={26}
                    strokeWidth={1.8}
                    className={iconColor}
                />
            </div>

            <div>
                <p className="text-[13px] text-[#8799b4]">
                    {label}
                </p>

                <p className="mt-1 text-[30px] font-extrabold leading-none text-[#171725]">
                    {count}
                </p>
            </div>

        </div>
    );
}

// ==========================================
// STUDY ROW
// ==========================================

function StudyRow({
    study,
    onOpen,
}: {
    study: Study;
    onOpen: (study: Study) => void;
}) {
    const revision = study.status === 'revision';

    return (
        <div className="flex flex-col gap-4 border-b border-[#e9edf3] py-4 last:border-b-0 sm:flex-row sm:items-center">

            {/* STUDY DETAILS */}
            <div className="flex min-w-0 flex-1 items-center gap-4">

                {/* DOCUMENT ICON */}
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#ffe8ed]">
                    <FileText
                        size={26}
                        strokeWidth={1.8}
                        className="text-[#d00030]"
                    />
                </div>

                {/* STUDY INFO */}
                <div className="min-w-0">

                    <p className="text-[12px] text-[#8a9bb5]">
                        {study.reference}
                    </p>

                    <h3 className="mt-0.5 text-[14px] font-bold leading-snug text-[#171725]">
                        {study.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2">

                        <span className="text-[12px] text-[#8295b1]">
                            {study.department}
                        </span>

                        <span className="rounded-full bg-[#fff1d7] px-3 py-1 text-[11px] font-medium text-[#c17b19]">
                            {revision
                                ? 'Revision review'
                                : 'Pending review'}
                        </span>

                    </div>

                    <p className="mt-2 text-[11px] text-[#8295b1]">
                        Assigned on {study.assignedDate}
                    </p>

                </div>
            </div>

            {/* REVIEW BUTTON */}
            <button
                type="button"
                onClick={() => onOpen(study)}
                className="h-[40px] shrink-0 rounded-md bg-[#b00025] px-5 text-[12px] font-bold text-white transition hover:bg-[#8f001e] sm:min-w-[130px]"
            >
                {revision
                    ? 'Review revisions'
                    : 'Start review'}
            </button>
        </div>
    );
}

// ==========================================
// RECENT NOTIFICATION ROW
// ==========================================

function NotificationRow({
    notification,
}: {
    notification: ReviewerNotification;
}) {
    const revised = notification.type === 'revised';

    return (
        <div className="flex gap-3 border-b border-[#e9edf3] py-4 last:border-b-0">

            {/* ICON */}
            <div
                className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full ${
                    revised
                        ? 'bg-[#e5f4ff]'
                        : 'bg-[#f1e9ff]'
                }`}
            >
                {revised ? (
                    <FileText
                        size={22}
                        className="text-[#3499ff]"
                    />
                ) : (
                    <UserRound
                        size={22}
                        className="text-[#9258e8]"
                    />
                )}
            </div>

            {/* NOTIFICATION DETAILS */}
            <div className="min-w-0">

                <h3 className="text-[12px] font-bold text-[#171725]">
                    {notification.title}
                </h3>

                <p className="mt-1 text-[12px] leading-[1.5] text-[#8295b1]">
                    {notification.description}
                </p>

                <p className="mt-1 text-[11px] text-[#8295b1]">
                    {notification.date}
                </p>

            </div>
        </div>
    );
}

// ==========================================
// COMPLETED REVIEW ROW
// ==========================================

function CompletedReviewRow({
    study,
    onOpen,
}: {
    study: Study;
    onOpen: (study: Study) => void;
}) {
    return (
        <div className="flex flex-col gap-4 border-t border-[#e9edf3] py-4 lg:flex-row lg:items-center lg:justify-between">

            {/* STUDY INFORMATION */}
            <div className="flex min-w-0 items-center gap-4">

                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#ffe8ed]">
                    <FileText
                        size={26}
                        className="text-[#d00030]"
                    />
                </div>

                <div className="min-w-0">
                    <p className="text-[12px] text-[#8a9bb5]">
                        {study.reference}
                    </p>

                    <h3 className="mt-0.5 text-[14px] font-bold text-[#171725]">
                        {study.title}
                    </h3>

                    <p className="mt-1 text-[12px] text-[#8295b1]">
                        {study.department}
                    </p>
                </div>
            </div>

            {/* REVIEW STATUS */}
            <div className="flex flex-wrap items-center gap-4 pl-[68px] lg:pl-0">

                <span className="whitespace-nowrap rounded-full bg-[#dff8e9] px-3 py-1.5 text-[11px] font-semibold text-[#258957]">
                    Review submitted
                </span>

                <span className="text-[11px] text-[#8295b1]">
                    Completed on {study.completedDate}
                </span>

                <button
                    type="button"
                    onClick={() => onOpen(study)}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#b00025] hover:underline"
                >
                    View review
                    <ArrowRight size={15} />
                </button>

            </div>
        </div>
    );
}

// ==========================================
// MAIN REVIEWER DASHBOARD
// ==========================================

export default function ReviewerDashboard() {
    const { auth } = usePage().props as {
        auth?: {
            user?: {
                name?: string;
                email?: string;
                role?: string;
            };
        };
    };

    const [section, setSection] =
        useState<ReviewerSection>('dashboard');

    const [selectedStudy, setSelectedStudy] =
        useState<Study | null>(null);

    const userName = auth?.user?.name || 'Engr. Elena Garcia';

    const lastName = userName.trim().split(/\s+/).at(-1) || 'Garcia';

    const greetingName = /^Engr\.?/i.test(userName)
        ? `Engr. ${lastName}`
        : userName;

    // ======================================
    // NAVIGATION
    // ======================================

    function navigate(destination: ReviewerSection) {
        setSection(destination);
        setSelectedStudy(null);
    }

    // ======================================
    // HEADER TITLES
    // ======================================

    const pageInformation: Record<
        ReviewerSection,
        { title: string; description: string }
    > = {
        dashboard: {
            title: `Welcome back, ${greetingName}`,
            description:
                'Manage your assigned studies and review submissions.',
        },
        assigned: {
            title: 'Assigned studies',
            description:
                'View research applications assigned to you for review.',
        },
        completed: {
            title: 'Completed reviews',
            description:
                'View your previously submitted research reviews.',
        },
        notifications: {
            title: 'Notifications',
            description:
                'Stay informed about assigned studies and review updates.',
        },
        settings: {
            title: 'Account settings',
            description:
                'View your reviewer account information.',
        },
    };

    const currentPage = pageInformation[section];

    return (
        <ReviewerLayout
            section={section}
            onNavigate={navigate}
        >
            <Head title={currentPage.title} />

            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                    {/* ORANGE ACCENT */}
                    <div className="mb-3 h-[4px] w-[48px] rounded-full bg-[#ff8500]" />

                    {/* TITLE */}
                    <h1 className="text-[29px] font-extrabold tracking-tight text-[#171725] sm:text-[34px]">
                        {currentPage.title}
                    </h1>

                    {/* DESCRIPTION */}
                    <p className="mt-1 text-[15px] text-[#8295b1]">
                        {currentPage.description}
                    </p>

                </div>

                {/* MAIN ACTION */}
                {section === 'dashboard' ? (
                    <button
                        type="button"
                        onClick={() => navigate('assigned')}
                        className="inline-flex h-[43px] items-center justify-center rounded-md border border-[#c9002a] bg-white px-6 text-[12px] font-semibold text-[#b00025] transition hover:bg-[#fff0f3]"
                    >
                        View assigned studies
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => navigate('dashboard')}
                        className="inline-flex h-[43px] items-center justify-center rounded-md border border-[#c9002a] bg-white px-6 text-[12px] font-semibold text-[#b00025] transition hover:bg-[#fff0f3]"
                    >
                        Back to dashboard
                    </button>
                )}

            </div>

            {/* =================================
                DASHBOARD CONTENT
            ================================= */}

            {section === 'dashboard' && (
                <div className="space-y-5">

                    {/* =========================
                        SUMMARY CARDS
                    ========================= */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <StatisticsCard
                            label="Assigned studies"
                            count={6}
                            icon={FileText}
                            background="bg-[#ffe8ed]"
                            iconColor="text-[#d00030]"
                        />

                        <StatisticsCard
                            label="Pending reviews"
                            count={2}
                            icon={Clock3}
                            background="bg-[#fff0dc]"
                            iconColor="text-[#d78916]"
                        />

                        <StatisticsCard
                            label="Revision reviews"
                            count={1}
                            icon={FileText}
                            background="bg-[#fff0df]"
                            iconColor="text-[#e18a22]"
                        />

                        <StatisticsCard
                            label="Completed reviews"
                            count={3}
                            icon={CheckCircle2}
                            background="bg-[#e0f8e9]"
                            iconColor="text-[#0da76a]"
                        />

                    </div>

                    {/* =========================
                        ACTIONS + NOTIFICATIONS
                    ========================= */}

                    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(290px,1fr)]">

                        {/* REVIEWS REQUIRING ACTION */}
                        <section className="rounded-xl bg-white px-5 py-4">

                            <div className="mb-1 flex flex-wrap items-center justify-between gap-3">

                                <h2 className="text-[19px] font-extrabold text-[#171725]">
                                    Reviews requiring action
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => navigate('assigned')}
                                    className="text-[12px] font-medium text-[#b00025] hover:underline"
                                >
                                    View all assigned studies
                                </button>

                            </div>

                            {studiesRequiringAction.map((study) => (
                                <StudyRow
                                    key={study.reference}
                                    study={study}
                                    onOpen={setSelectedStudy}
                                />
                            ))}

                        </section>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-4">

                            {/* RECENT NOTIFICATIONS */}
                            <section className="rounded-xl bg-white px-4 py-4">

                                <div className="flex flex-wrap items-center justify-between gap-2">

                                    <h2 className="text-[19px] font-extrabold text-[#171725]">
                                        Recent notifications
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={() => navigate('notifications')}
                                        className="inline-flex items-center gap-1 text-[12px] font-medium text-[#b00025] hover:underline"
                                    >
                                        View all
                                        <ArrowRight size={14} />
                                    </button>

                                </div>

                                <div>
                                    {recentNotifications.map(
                                        (notification) => (
                                            <NotificationRow
                                                key={notification.id}
                                                notification={notification}
                                            />
                                        ),
                                    )}
                                </div>

                            </section>

                            {/* REVIEWER REMINDER */}
                            <section className="flex gap-4 rounded-xl bg-white px-4 py-5">

                                <div className="flex h-[51px] w-[51px] shrink-0 items-center justify-center rounded-full bg-[#ffe8ed]">
                                    <BookOpen
                                        size={25}
                                        className="text-[#d00030]"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-[17px] font-extrabold text-[#171725]">
                                        Reviewer reminder
                                    </h2>

                                    <p className="mt-2 text-[12px] leading-[1.6] text-[#8295b1]">
                                        Read the latest documents, record
                                        your comments, and submit your
                                        reviewer decision.
                                    </p>
                                </div>

                            </section>

                        </div>
                    </div>

                    {/* =========================
                        RECENTLY COMPLETED
                    ========================= */}

                    <section className="rounded-xl bg-white px-5 py-4">

                        <div className="mb-3 flex items-center justify-between gap-3">

                            <h2 className="text-[19px] font-extrabold text-[#171725]">
                                Recently completed
                            </h2>

                            <button
                                type="button"
                                onClick={() => navigate('completed')}
                                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#b00025] hover:underline"
                            >
                                View all
                                <ArrowRight size={14} />
                            </button>

                        </div>

                        {recentlyCompleted.map((study) => (
                            <CompletedReviewRow
                                key={study.reference}
                                study={study}
                                onOpen={setSelectedStudy}
                            />
                        ))}

                    </section>

                </div>
            )}

            {/* =================================
                ASSIGNED STUDIES
                PLACEHOLDER VIEW
            ================================= */}

            {section === 'assigned' && (
                <section className="rounded-xl bg-white px-5 py-5">

                    <div className="mb-3">
                        <h2 className="text-[20px] font-extrabold text-[#171725]">
                            Reviews requiring action
                        </h2>

                        <p className="mt-1 text-[13px] text-[#8295b1]">
                            Sample assigned studies awaiting your review.
                        </p>
                    </div>

                    {studiesRequiringAction.map((study) => (
                        <StudyRow
                            key={study.reference}
                            study={study}
                            onOpen={setSelectedStudy}
                        />
                    ))}

                    <p className="mt-4 text-[12px] text-[#8295b1]">
                        Additional assigned records will appear here
                        once the backend is connected.
                    </p>

                </section>
            )}

            {/* =================================
                COMPLETED REVIEWS
                PLACEHOLDER VIEW
            ================================= */}

            {section === 'completed' && (
                <section className="rounded-xl bg-white px-5 py-5">

                    <h2 className="mb-3 text-[20px] font-extrabold text-[#171725]">
                        Completed reviews
                    </h2>

                    {recentlyCompleted.map((study) => (
                        <CompletedReviewRow
                            key={study.reference}
                            study={study}
                            onOpen={setSelectedStudy}
                        />
                    ))}

                    <p className="mt-4 text-[12px] text-[#8295b1]">
                        This is a sample of a completed review.
                        Actual review records will be loaded from Laravel.
                    </p>

                </section>
            )}

            {/* =================================
                NOTIFICATIONS
                PLACEHOLDER VIEW
            ================================= */}

            {section === 'notifications' && (
                <section className="rounded-xl bg-white px-5 py-5">

                    <div className="mb-3 flex items-center gap-3">
                        <Bell
                            size={22}
                            className="text-[#b00025]"
                        />

                        <h2 className="text-[20px] font-extrabold text-[#171725]">
                            Recent notifications
                        </h2>
                    </div>

                    {recentNotifications.map((notification) => (
                        <NotificationRow
                            key={notification.id}
                            notification={notification}
                        />
                    ))}

                </section>
            )}

            {/* =================================
                ACCOUNT SETTINGS
                PLACEHOLDER VIEW
            ================================= */}

            {section === 'settings' && (
                <section className="rounded-xl bg-white px-5 py-6">

                    <h2 className="text-[20px] font-extrabold text-[#171725]">
                        Reviewer account information
                    </h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">

                        <div>
                            <p className="text-[12px] text-[#8295b1]">
                                Full name
                            </p>

                            <p className="mt-1 text-[14px] font-semibold text-[#171725]">
                                {userName}
                            </p>
                        </div>

                        <div>
                            <p className="text-[12px] text-[#8295b1]">
                                Email
                            </p>

                            <p className="mt-1 text-[14px] font-semibold text-[#171725]">
                                {auth?.user?.email || 'Not available'}
                            </p>
                        </div>

                        <div>
                            <p className="text-[12px] text-[#8295b1]">
                                Account role
                            </p>

                            <p className="mt-1 text-[14px] font-semibold text-[#171725]">
                                Reviewer
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-[#fff6e7] px-4 py-3 text-[13px] text-[#a96712]">
                        Reviewer account editing will be implemented
                        when this page is connected to the backend.
                    </div>

                </section>
            )}

            {/* =================================
                STUDY PREVIEW MODAL
            ================================= */}

            {selectedStudy && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedStudy(null);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="review-study-title"
                        className="w-full max-w-[510px] rounded-xl bg-white p-6 shadow-2xl"
                    >

                        {/* MODAL HEADER */}
                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <p className="text-[12px] text-[#8295b1]">
                                    {selectedStudy.reference}
                                </p>

                                <h2
                                    id="review-study-title"
                                    className="mt-1 text-[22px] font-extrabold text-[#171725]"
                                >
                                    {selectedStudy.status === 'completed'
                                        ? 'Completed review'
                                        : selectedStudy.status === 'revision'
                                          ? 'Review revisions'
                                          : 'Start review'}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedStudy(null)}
                                aria-label="Close study preview"
                                className="rounded-md p-1 text-[#8295b1] hover:bg-[#f2f3f6]"
                            >
                                <X size={21} />
                            </button>

                        </div>

                        {/* STUDY DETAILS */}
                        <div className="mt-5 space-y-4">

                            <div>
                                <p className="text-[12px] text-[#8295b1]">
                                    Research title
                                </p>

                                <p className="mt-1 font-bold text-[#171725]">
                                    {selectedStudy.title}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-[#8295b1]">
                                    Department
                                </p>

                                <p className="mt-1 text-[14px] text-[#30436a]">
                                    {selectedStudy.department}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-[#8295b1]">
                                    Review status
                                </p>

                                <p className="mt-1 text-[14px] text-[#30436a]">
                                    {selectedStudy.status === 'pending'
                                        ? 'Pending review'
                                        : selectedStudy.status === 'revision'
                                          ? 'Revision review'
                                          : 'Review submitted'}
                                </p>
                            </div>

                            {/* DEMO NOTICE */}
                            <div className="flex gap-3 rounded-lg border border-[#f5dca9] bg-[#fff8ea] px-4 py-3">

                                <Info
                                    size={19}
                                    className="shrink-0 text-[#c17b19]"
                                />

                                <p className="text-[13px] leading-relaxed text-[#a36b24]">
                                    This is a frontend preview using
                                    sample data. The review form,
                                    comments, and reviewer decisions
                                    will be implemented in the next
                                    UI and connected to Laravel later.
                                </p>

                            </div>

                        </div>

                        {/* MODAL FOOTER */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedStudy(null)}
                                className="rounded-md bg-[#b00025] px-6 py-2.5 text-[13px] font-bold text-white hover:bg-[#8f001e]"
                            >
                                Close
                            </button>
                        </div>

                    </section>
                </div>
            )}

        </ReviewerLayout>
    );
}