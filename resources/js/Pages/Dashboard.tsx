import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import {
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    Clock3,
    FileText,
    Info,
    Plus,
    X,
} from 'lucide-react';

// SAMPLE DATA - Replace with database data later
const exampleDashboard = {
    stats: {
        total: 3,
        drafts: 1,
        underReview: 1,
        cleared: 1,
    },

    currentApplication: {
        id: 'REC-2026-0042',
        title: 'Student Experiences with Online Learning',
        status: 'Under review',
        submittedAt: 'October 24, 2026',
        requirementsVerifiedAt: 'Oct 25, 2026',
        submittedShort: 'Oct 24, 2026',
    },

    notifications: [
        {
            id: 1,
            title: 'Reviewers assigned',
            description:
                'Your application REC-2026-0042 has been assigned to reviewers.',
            date: 'Oct 26, 2026, 9:00 AM',
            type: 'purple',
        },
        {
            id: 2,
            title: 'Requirements verified',
            description:
                'All submitted requirements have been verified.',
            date: 'Oct 25, 2026, 10:00 AM',
            type: 'green',
        },
        {
            id: 3,
            title: 'Application received',
            description:
                'Your application REC-2026-0042 has been received.',
            date: 'Oct 24, 2026, 3:00 PM',
            type: 'blue',
        },
    ],

    draft: {
        id: 1,
        title: 'Complete your draft application',
        description:
            "You have a draft application that's not yet submitted.",
    },
};

// Check whether a Laravel route exists
function safeRoute(name, params) {
    try {
        return typeof route === 'function' && route().has(name)
            ? route(name, params)
            : null;
    } catch {
        return null;
    }
}

// STATISTICS CARD
function StatCard({ icon: Icon, label, value, circle, iconColor }) {
    return (
        <div className="flex min-h-[102px] items-center gap-5 rounded-xl bg-white px-5 py-4">
            <span
                className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full ${circle}`}
            >
                <Icon
                    size={29}
                    strokeWidth={2}
                    className={iconColor}
                />
            </span>

            <div className="min-w-0">
                <p className="whitespace-nowrap text-[13px] text-[#6d80a0]">
                    {label}
                </p>

                <p className="mt-0.5 text-[34px] font-extrabold leading-none text-[#161827]">
                    {value}
                </p>
            </div>
        </div>
    );
}

// NOTIFICATION ICON
function NotificationIcon({ type }) {
    const colors = {
        purple: 'bg-[#eee6ff] text-[#713cf1]',
        green: 'bg-[#dcf7e9] text-[#00a75a]',
        blue: 'bg-[#dff0ff] text-[#168bfa]',
    };

    return (
        <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                colors[type] || colors.blue
            }`}
        >
            <FileText size={27} strokeWidth={2} />
        </span>
    );
}

// APPLICATION PROGRESS TRACKER
function ProgressSteps({ application }) {
    const steps = [
        {
            label: 'Submitted',
            detail: application.submittedShort,
            state: 'done',
        },
        {
            label: 'Requirements',
            detail: application.requirementsVerifiedAt,
            state: 'done',
        },
        {
            label: 'Under review',
            detail: 'In progress',
            state: 'active',
        },
        {
            label: 'Clearance issued',
            detail: 'Pending',
            state: 'pending',
        },
    ];

    return (
        <div className="relative mt-5">
            {/* Background progress line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-[15px] h-[2px] bg-[#c4cbd5]" />

            {/* Completed progress line */}
            <div className="absolute left-[12.5%] right-[37.5%] top-[15px] h-[2px] bg-[#a50021]" />

            <div className="relative grid grid-cols-4 gap-1">
                {steps.map((step) => (
                    <div
                        key={step.label}
                        className="flex min-w-0 flex-col items-center text-center"
                    >
                        <span
                            className={`flex h-[32px] w-[32px] items-center justify-center rounded-full ${
                                step.state === 'pending'
                                    ? 'bg-[#f6f6f8]'
                                    : 'bg-[#a50021]'
                            }`}
                        >
                            {step.state === 'done' && (
                                <Check
                                    size={21}
                                    className="text-white"
                                    strokeWidth={2.5}
                                />
                            )}
                        </span>

                        <span className="mt-2 text-xs font-medium leading-tight text-[#191c2b] sm:text-[14px]">
                            {step.label}
                        </span>

                        <span className="mt-1 text-xs leading-tight text-[#8090ad] sm:text-[13px]">
                            {step.detail}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// MAIN DASHBOARD
export default function Dashboard({ dashboard }) {
    const { auth } = usePage().props;

    const firstName = (auth?.user?.name || 'Researcher')
        .trim()
        .split(/\s+/)[0];

    const data = dashboard
        ? { ...exampleDashboard, ...dashboard }
        : exampleDashboard;

    const {
        stats,
        currentApplication,
        notifications,
        draft,
    } = data;

    const [notice, setNotice] = useState('');

    function navigate(routeName, params) {
        const url = safeRoute(routeName, params);

        if (url) {
            router.visit(url);
        } else {
            setNotice(
                `The "${routeName}" route is not available yet.`
            );
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* WELCOME SECTION */}
            <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-3 h-1 w-12 rounded-full bg-[#ff8500]" />

                    <h1 className="text-[30px] font-extrabold tracking-tight text-[#171725] sm:text-[38px] sm:leading-[1.13]">
                        Welcome back, {firstName}
                    </h1>

                    <p className="mt-2 text-[15px] text-[#7d8dab] sm:text-[18px]">
                        Track your ethics application and keep your
                        research moving.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate('applications.create')
                    }
                    className="inline-flex h-[48px] shrink-0 items-center justify-center gap-3 rounded-lg bg-[#a50021] px-6 text-[15px] font-bold text-white transition hover:bg-[#8b001d]"
                >
                    <Plus size={25} strokeWidth={1.8} />
                    New application
                </button>
            </div>

            {/* STATISTICS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={FileText}
                    label="Total applications"
                    value={stats.total}
                    circle="bg-[#ffe6e9]"
                    iconColor="text-[#ad0026]"
                />

                <StatCard
                    icon={FileText}
                    label="Drafts"
                    value={stats.drafts}
                    circle="bg-[#ffe8d7]"
                    iconColor="text-[#ac5700]"
                />

                <StatCard
                    icon={Clock3}
                    label="Under review"
                    value={stats.underReview}
                    circle="bg-[#fff0c7]"
                    iconColor="text-[#a05a00]"
                />

                <StatCard
                    icon={CheckCircle2}
                    label="Clearance issued"
                    value={stats.cleared}
                    circle="bg-[#d7f5e5]"
                    iconColor="text-[#008f55]"
                />
            </div>

            {/* DASHBOARD GRID */}
            <div className="mt-5 grid items-stretch gap-4 xl:grid-cols-[minmax(0,2.05fr)_minmax(305px,0.97fr)]">

                {/* CURRENT APPLICATION */}
                <section className="rounded-xl bg-white px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-[20px] font-extrabold tracking-tight text-[#171725]">
                            Current application
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('applications.index')
                            }
                            className="inline-flex items-center gap-1 text-sm font-medium text-[#a50021] hover:underline"
                        >
                            View all applications
                            <ArrowRight size={17} />
                        </button>
                    </div>

                    <p className="mt-4 text-sm text-[#7589a8]">
                        {currentApplication.id}
                    </p>

                    <h3 className="mt-1 text-[19px] font-extrabold leading-snug text-[#171725] sm:text-[21px]">
                        {currentApplication.title}
                    </h3>

                    <span className="mt-2 inline-flex rounded-full bg-[#fff0d0] px-3 py-1 text-[13px] font-medium leading-none text-[#9c4c00]">
                        {currentApplication.status}
                    </span>

                    <p className="mt-2 text-sm text-[#7489a9]">
                        Submitted on {currentApplication.submittedAt}
                    </p>

                    <ProgressSteps application={currentApplication} />

                    <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="flex min-h-[50px] flex-1 items-center gap-3 rounded-lg bg-[#fff0f3] px-3 py-2 text-[13px] text-[#b00028]">
                            <Info
                                size={24}
                                className="shrink-0"
                                fill="#a50021"
                                stroke="white"
                            />

                            <span>
                                Your application is being evaluated.
                                No action is required right now.
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    'applications.show',
                                    currentApplication.id
                                )
                            }
                            className="h-[48px] shrink-0 rounded-lg bg-[#a50021] px-5 text-sm font-bold text-white transition hover:bg-[#8b001d]"
                        >
                            View application
                        </button>
                    </div>
                </section>

                {/* RECENT NOTIFICATIONS */}
                <section className="rounded-xl bg-white px-5 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-[19px] font-extrabold tracking-tight text-[#171725]">
                            Recent notifications
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('notifications.index')
                            }
                            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#a50021] hover:underline"
                        >
                            View all
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="mt-3 divide-y divide-[#e0e5ee]">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex gap-4 py-3.5 first:pt-1"
                            >
                                <NotificationIcon
                                    type={notification.type}
                                />

                                <div className="min-w-0">
                                    <h3 className="text-[13px] font-bold text-[#171725]">
                                        {notification.title}
                                    </h3>

                                    <p className="mt-1 text-[13px] leading-[1.4] text-[#7b8eae]">
                                        {notification.description}
                                    </p>

                                    <p className="mt-1 text-xs text-[#8da0bb]">
                                        {notification.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PENDING TASKS */}
                <section className="rounded-xl bg-white px-5 py-4 sm:px-6">
                    <h2 className="mb-2 text-[20px] font-extrabold tracking-tight text-[#171725]">
                        Pending tasks
                    </h2>

                    {draft ? (
                        <div className="flex flex-col gap-3 rounded-lg border border-[#f0e3e6] bg-[#fff7f8] px-3 py-3 sm:flex-row sm:items-center">
                            <div className="flex flex-1 items-center gap-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffebdd] text-[#ff8500]">
                                    <FileText size={26} />
                                </span>

                                <div>
                                    <p className="text-[14px] font-bold text-[#171725]">
                                        {draft.title}
                                    </p>

                                    <p className="mt-1 text-[13px] text-[#798ba9]">
                                        {draft.description}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        'applications.edit',
                                        draft.id
                                    )
                                }
                                className="h-[42px] shrink-0 rounded-lg border border-[#b00028] bg-white px-5 text-sm font-bold text-[#a50021] transition hover:bg-[#fff0f3]"
                            >
                                Continue draft
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-[#7b8eae]">
                            You don't have any pending tasks.
                        </p>
                    )}
                </section>

                {/* HELP SECTION */}
                <section className="flex items-start gap-4 rounded-xl bg-white px-5 py-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffe6e9] text-[#a50021]">
                        <BookOpen size={28} />
                    </span>

                    <div>
                        <h2 className="text-[14px] font-bold text-[#171725]">
                            Need help getting started?
                        </h2>

                        <p className="mt-1 text-[13px] leading-[1.45] text-[#7b8eae]">
                            Learn about the review process,
                            requirements, and submission guidelines.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('requirements.index')
                            }
                            className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-[#a50021] hover:underline"
                        >
                            View requirements and guidelines
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </section>
            </div>

            {/* MISSING ROUTE NOTIFICATION */}
            {notice && (
                <div
                    role="status"
                    className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-lg bg-[#171725] px-4 py-3 text-sm text-white shadow-xl"
                >
                    <span>{notice}</span>

                    <button
                        type="button"
                        aria-label="Dismiss"
                        onClick={() => setNotice('')}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </AuthenticatedLayout>
    );
}