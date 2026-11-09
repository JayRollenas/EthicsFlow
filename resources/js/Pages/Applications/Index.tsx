import { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import {
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    FileText,
    Info,
    Plus,
    Search,
    X,
} from 'lucide-react';

// APPLICATION TYPES
type ApplicationStatus =
    | 'draft'
    | 'submitted'
    | 'under_review'
    | 'revision_required'
    | 'resubmitted'
    | 'approved'
    | 'cleared'
    | 'withdrawn';

type TabType = 'all' | 'submitted' | 'ongoing' | 'completed';

interface Application {
    id: number;
    reference: string | null;
    title: string;
    department: string;
    status: ApplicationStatus;
    submittedAt: string;
    updatedAt: string;
}

const ITEMS_PER_PAGE = 5;

// CHECK IF LARAVEL ROUTE EXISTS
function getRoute(
    name: string,
    parameter?: number,
): string | null {
    type ZiggyRoute = ((
        name: string,
        parameter?: number,
    ) => string) & {
        has?: (name: string) => boolean;
    };

    const ziggy = (
        window as Window & { route?: ZiggyRoute }
    ).route;

    try {
        if (
            ziggy &&
            (typeof ziggy.has !== 'function' || ziggy.has(name))
        ) {
            return ziggy(name, parameter);
        }
    } catch {
        return null;
    }

    return null;
}

// FORMAT DATE
function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
        'en-US',
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        },
    );
}

// STATUS BADGE
function StatusBadge({
    status,
}: {
    status: ApplicationStatus;
}) {
    const labels: Record<ApplicationStatus, string> = {
        draft: 'Draft',
        submitted: 'Submitted',
        under_review: 'Under review',
        revision_required: 'Revision required',
        resubmitted: 'Resubmitted',
        approved: 'Approved',
        cleared: 'Cleared',
        withdrawn: 'Withdrawn',
    };

    const completed = ['approved', 'cleared'].includes(status);
    const neutral = ['draft', 'withdrawn'].includes(status);

    return (
        <span
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-medium ${
                completed
                    ? 'bg-[#ddf6e9] text-[#008d50]'
                    : neutral
                      ? 'bg-[#f0f1f4] text-[#75849d]'
                      : 'bg-[#fff1d8] text-[#f07800]'
            }`}
        >
            {completed ? (
                <CheckCircle2 size={19} fill="#008d50" stroke="white" />
            ) : neutral ? (
                <FileText size={18} strokeWidth={1.8} />
            ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <Check size={15} strokeWidth={2.5} />
                </span>
            )}
            {labels[status]}
        </span>
    );
}

// MAIN APPLICATIONS PAGE
export default function ApplicationsIndex({
    applications = [],
}: {
    applications?: Application[];
}) {
    const [activeTab, setActiveTab] =
        useState<TabType>('all');

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [notice, setNotice] = useState('');

    // APPLICATION COUNTS
    const counts = {
        all: applications.length,

        submitted: applications.filter(
            (app) => app.status === 'submitted',
        ).length,

        ongoing: applications.filter(
            (app) =>
                ['under_review', 'revision_required', 'resubmitted'].includes(
                    app.status,
                ),
        ).length,

        completed: applications.filter(
            (app) => ['approved', 'cleared', 'withdrawn'].includes(app.status),
        ).length,
    };

    // TABS
    const tabs: {
        id: TabType;
        label: string;
        count: number;
    }[] = [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'submitted', label: 'Submitted', count: counts.submitted },
        {
            id: 'ongoing',
            label: 'Ongoing',
            count: counts.ongoing,
        },
        {
            id: 'completed',
            label: 'Completed',
            count: counts.completed,
        },
    ];

    // FILTER APPLICATIONS
    const filteredApplications = useMemo(() => {
        return applications
            .filter((application) => {
                const searchText = search
                    .trim()
                    .toLowerCase();

                const matchesSearch =
                    application.title
                        .toLowerCase()
                        .includes(searchText) ||
                    (application.reference || '')
                        .toLowerCase()
                        .includes(searchText);

                let matchesTab = true;

                if (activeTab === 'submitted') {
                    matchesTab = application.status === 'submitted';
                }

                if (activeTab === 'ongoing') {
                    matchesTab = [
                        'under_review',
                        'revision_required',
                        'resubmitted',
                    ].includes(application.status);
                }

                if (activeTab === 'completed') {
                    matchesTab = ['approved', 'cleared', 'withdrawn'].includes(
                        application.status,
                    );
                }

                const matchesStatus =
                    statusFilter === 'all' ||
                    application.status === statusFilter;

                let matchesDate = true;

                if (dateFilter !== 'all') {
                    const days = Number(dateFilter);

                    const limit = new Date();
                    limit.setHours(0, 0, 0, 0);
                    limit.setDate(
                        limit.getDate() - days,
                    );

                    const updated = new Date(
                        `${application.updatedAt}T00:00:00`,
                    );

                    matchesDate = updated >= limit;
                }

                return (
                    matchesSearch &&
                    matchesTab &&
                    matchesStatus &&
                    matchesDate
                );
            })
            .sort((a, b) =>
                b.updatedAt.localeCompare(a.updatedAt),
            );
    }, [
        applications,
        search,
        activeTab,
        statusFilter,
        dateFilter,
    ]);

    // PAGINATION
    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredApplications.length / ITEMS_PER_PAGE,
        ),
    );

    const currentPage = Math.min(page, totalPages);

    const startIndex =
        (currentPage - 1) * ITEMS_PER_PAGE;

    const paginatedApplications =
        filteredApplications.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE,
        );

    const showingFrom =
        filteredApplications.length === 0
            ? 0
            : startIndex + 1;

    const showingTo = Math.min(
        startIndex + ITEMS_PER_PAGE,
        filteredApplications.length,
    );

    // NAVIGATE TO AN EXISTING ROUTE
    function navigate(
        routeName: string,
        parameter?: number,
    ) {
        const url = getRoute(routeName, parameter);

        if (url) {
            router.visit(url);
        } else {
            setNotice(
                `The "${routeName}" route is not available yet.`,
            );
        }
    }

    // SWITCH TAB
    function selectTab(tab: TabType) {
        setActiveTab(tab);
        setPage(1);
    }

    return (
        <AuthenticatedLayout>
            <Head title="My Applications" />

            {/* PAGE HEADER */}
            <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-3 h-1 w-12 rounded-full bg-[#ff8500]" />

                    <h1 className="text-[32px] font-extrabold tracking-tight text-[#171725] sm:text-[42px] sm:leading-[1.15]">
                        My applications
                    </h1>

                    <p className="mt-2 text-[15px] text-[#7d8dab] sm:text-[18px]">
                        Track the status and review progress of
                        applications you have submitted.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate('applications.create')
                    }
                    className="inline-flex h-[48px] shrink-0 items-center justify-center gap-3 rounded-lg bg-[#a50021] px-6 text-[15px] font-bold text-white transition hover:bg-[#87001b]"
                >
                    <Plus
                        size={25}
                        strokeWidth={1.9}
                    />

                    New application
                </button>
            </div>

            {/* APPLICATIONS TABLE CARD */}
            <section className="rounded-xl bg-white px-4 py-5 sm:px-5">

                {/* SEARCH AND FILTERS */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_205px_205px]">

                    {/* SEARCH INPUT */}
                    <div className="relative">
                        <Search
                            size={23}
                            strokeWidth={2}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#65799c]"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search by title or reference number"
                            className="h-[46px] w-full rounded-md border border-[#d2dced] bg-white pl-12 pr-4 text-[14px] text-[#171725] placeholder:text-[#7186a8] focus:border-[#a50021] focus:ring-1 focus:ring-[#a50021]"
                        />
                    </div>

                    {/* STATUS FILTER */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            aria-label="Filter by status"
                            onChange={(e) => {
                                setStatusFilter(
                                    e.target.value,
                                );
                                setPage(1);
                            }}
                            className="h-[46px] w-full appearance-none rounded-md border border-[#d2dced] bg-white px-4 pr-10 text-[14px] text-[#52688c] focus:border-[#a50021] focus:ring-1 focus:ring-[#a50021]"
                        >
                            <option value="all">
                                All statuses
                            </option>

                            <option value="submitted">
                                Submitted
                            </option>

                            <option value="under_review">
                                Under review
                            </option>

                            <option value="revision_required">
                                Revision required
                            </option>

                            <option value="resubmitted">
                                Resubmitted
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="cleared">
                                Cleared
                            </option>

                            <option value="withdrawn">
                                Withdrawn
                            </option>
                        </select>

                        <ChevronDown
                            size={20}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#63799c]"
                        />
                    </div>

                    {/* DATE FILTER */}
                    <div className="relative">
                        <CalendarDays
                            size={19}
                            strokeWidth={1.8}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7185a5]"
                        />

                        <select
                            value={dateFilter}
                            aria-label="Filter by date"
                            onChange={(e) => {
                                setDateFilter(
                                    e.target.value,
                                );
                                setPage(1);
                            }}
                            className="h-[46px] w-full appearance-none rounded-md border border-[#d2dced] bg-white pl-10 pr-10 text-[14px] text-[#52688c] focus:border-[#a50021] focus:ring-1 focus:ring-[#a50021]"
                        >
                            <option value="all">
                                All dates
                            </option>

                            <option value="7">
                                Last 7 days
                            </option>

                            <option value="30">
                                Last 30 days
                            </option>

                            <option value="90">
                                Last 90 days
                            </option>
                        </select>

                        <ChevronDown
                            size={20}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#63799c]"
                        />
                    </div>
                </div>

                {/* CATEGORY TABS */}
                <div className="mt-5 overflow-x-auto border-b border-[#d9e1ed]">
                    <div
                        role="tablist"
                        aria-label="Application categories"
                        className="flex min-w-max gap-3 sm:gap-5"
                    >
                        {tabs.map((tab) => {
                            const active =
                                activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() =>
                                        selectTab(tab.id)
                                    }
                                    className={`relative whitespace-nowrap border-b-[3px] px-5 py-3 text-[14px] transition ${
                                        active
                                            ? 'border-[#a50021] font-bold text-[#a50021]'
                                            : 'border-transparent font-medium text-[#7084a5] hover:text-[#a50021]'
                                    }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* APPLICATIONS TABLE */}
                <div className="mt-4 overflow-x-auto rounded-lg border border-[#dae1ed]">
                    <table className="w-full min-w-[850px] border-collapse text-left">

                        {/* TABLE HEADER */}
                        <thead className="bg-[#f7f8fa]">
                            <tr className="text-[13px] font-semibold text-[#526684]">
                                <th
                                    scope="col"
                                    className="w-[34%] px-4 py-3"
                                >
                                    Application
                                </th>

                                <th
                                    scope="col"
                                    className="w-[17%] px-3 py-3"
                                >
                                    Department
                                </th>

                                <th
                                    scope="col"
                                    className="w-[18%] px-3 py-3"
                                >
                                    Status
                                </th>

                                <th scope="col" className="w-[15%] px-3 py-3">
                                    Submitted
                                </th>

                                <th scope="col" className="w-[16%] px-3 py-3">
                                    Last updated
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody className="divide-y divide-[#dae1ed]">
                            {paginatedApplications.length >
                            0 ? (
                                paginatedApplications.map(
                                    (application) => (
                                        <tr
                                            key={application.id}
                                            className="transition hover:bg-[#fffafb]"
                                        >
                                            {/* APPLICATION DETAILS */}
                                            <td className="px-4 py-3">
                                                <p className="text-[14px] font-bold leading-snug text-[#171725]">
                                                    {
                                                        application.title
                                                    }
                                                </p>

                                                <p className="mt-1 text-[13px] text-[#7c8fad]">
                                                    {application.reference}
                                                </p>
                                            </td>

                                            {/* DEPARTMENT */}
                                            <td className="px-3 py-3">
                                                <span className="text-[13px] text-[#171725]">
                                                    {
                                                        application.department
                                                    }
                                                </span>
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-3 py-3">
                                                <StatusBadge
                                                    status={
                                                        application.status
                                                    }
                                                />
                                            </td>

                                            {/* SUBMITTED */}
                                            <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[#7185a6]">
                                                {formatDate(
                                                    application.submittedAt,
                                                )}
                                            </td>

                                            {/* LAST UPDATED */}
                                            <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[#7185a6]">
                                                {formatDate(application.updatedAt)}
                                            </td>

                                            <td className="px-3 py-3">
                                                {application.status === 'revision_required' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const url = getRoute(
                                                                'applications.revision',
                                                                application.id,
                                                            );
                                                            if (url) {
                                                                router.visit(url);
                                                            }
                                                        }}
                                                        className="whitespace-nowrap rounded-md bg-[#a50021] px-3 py-2 text-[12px] font-bold text-white"
                                                    >
                                                        Submit corrections
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-[#9aa8bd]">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-12 text-center"
                                    >
                                        <FileText
                                            size={34}
                                            className="mx-auto mb-3 text-[#9aa8bd]"
                                        />

                                        <p className="text-[15px] font-semibold text-[#526684]">
                                            No submitted applications yet
                                        </p>

                                        <p className="mt-1 text-[13px] text-[#8292ac]">
                                            Submit a new application to see it listed here.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TABLE FOOTER / PAGINATION */}
                <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-[14px] text-[#7084a6]">
                        Showing {showingFrom}–{showingTo} of{' '}
                        {filteredApplications.length}{' '}
                        applications
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setPage(currentPage - 1)
                            }
                            className="h-[40px] rounded-md border border-[#e3e7ef] bg-[#fafbfc] px-5 text-[13px] text-[#697d9b] transition hover:bg-[#f0f2f7] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1,
                        ).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                aria-current={
                                    currentPage === pageNumber
                                        ? 'page'
                                        : undefined
                                }
                                onClick={() =>
                                    setPage(pageNumber)
                                }
                                className={`h-[40px] min-w-[40px] rounded-md px-3 text-[13px] font-medium transition ${
                                    currentPage === pageNumber
                                        ? 'bg-[#a50021] text-white'
                                        : 'border border-[#e3e7ef] bg-white text-[#7084a6] hover:bg-[#f7f7f9]'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={
                                currentPage === totalPages
                            }
                            onClick={() =>
                                setPage(currentPage + 1)
                            }
                            className="h-[40px] rounded-md border border-[#e3e7ef] bg-[#fafbfc] px-5 text-[13px] text-[#697d9b] transition hover:bg-[#f0f2f7] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>

            {/* INFORMATION BANNER */}
            <div className="mt-4 flex items-center gap-4 rounded-lg border border-[#b9dcff] bg-[#eef7ff] px-5 py-4">
                <Info
                    size={26}
                    strokeWidth={2}
                    className="shrink-0 text-[#0879e5]"
                />

                <p className="text-[14px] text-[#5578b2]">
                    Submitted applications and their review statuses will appear here.
                </p>
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
                        aria-label="Dismiss notification"
                        onClick={() => setNotice('')}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </AuthenticatedLayout>
    );
}