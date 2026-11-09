import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CoordinatorLayout, {
    type CoordinatorSection,
} from '@/Layouts/Coordinator';
import {
    ArrowLeft,
    CheckCircle2,
    ClipboardList,
    FileCheck2,
    FileText,
    Info,
    Users,
} from 'lucide-react';

interface Application {
    id: number;
    reference: string;
    title: string;
    abstract: string;
    researcher: string;
    researcherEmail: string;
    department: string;
    researchType: string;
    status: string;
    submittedAt: string | null;
    documents: Record<string, string>;
    panels: {
        id: number;
        cycle: number;
        status: string;
        assignments: {
            id: number;
            reviewer: string;
            status: string;
            decision: string | null;
            comment: string | null;
        }[];
    }[];
    clearance: string | null;
}

interface Reviewer {
    id: number;
    name: string;
    email: string;
}

interface Notice {
    id: number;
    type: string;
    message: string;
    read_at: string | null;
    created_at: string;
}

interface Clearance {
    id: number;
    certificateNumber: string;
    reference: string;
    title: string;
    researcher: string;
    issuedAt: string;
}

interface Props {
    applications: Application[];
    reviewers: Reviewer[];
    notifications: Notice[];
    clearances: Clearance[];
    stats: {
        readyToAssign: number;
        underReview: number;
        revisionRequired: number;
        cleared: number;
    };
}

const documentLabels: Record<string, string> = {
    manuscript: 'Research manuscript / protocol',
    consent: 'Informed consent form',
    instruments: 'Research instruments',
    supporting: 'Supporting documents',
};

const statusLabels: Record<string, string> = {
    submitted: 'Submitted — ready for panel assignment',
    resubmitted: 'Resubmitted — ready for new panel',
    revision_required: 'Revisions requested by reviewers',
    under_review: 'Under review',
    approved: 'Panel approved',
    cleared: 'Cleared',
};

function formattedDate(date: string | null): string {
    return date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : '—';
}

export default function CoordinatorDashboard({
    applications,
    reviewers,
    notifications,
    clearances,
    stats,
}: Props) {
    const [activeSection, setActiveSection] = useState<CoordinatorSection>('dashboard');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [reviewerIds, setReviewerIds] = useState<string[]>(['', '', '']);
    const [actionError, setActionError] = useState('');

    const selected = applications.find((application) => application.id === selectedId);
    const pageTitle: Record<CoordinatorSection, string> = {
        dashboard: 'Coordinator dashboard',
        applications: 'Research submissions',
        reviewers: 'Reviewers',
        progress: 'Review panel progress',
        clearances: 'Issued clearances',
        notifications: 'Notifications',
    };

    function openApplication(application: Application) {
        setSelectedId(application.id);
        setReviewerIds(['', '', '']);
        setActionError('');
        setActiveSection('applications');
    }

    function assignPanel() {
        if (!selected || reviewerIds.some((id) => !id)) {
            return;
        }

        router.post(
            route('coordinator.submissions.panel', selected.id),
            { reviewer_ids: reviewerIds.map(Number) },
            {
                onSuccess: () => setActionError(''),
                onError: (errors) => setActionError(Object.values(errors).join(' ')),
            },
        );
    }

    function renderQueue(showAll: boolean) {
        const queue = showAll
            ? applications
            : applications.filter((application) =>
                ['submitted', 'resubmitted'].includes(application.status),
            );

        if (queue.length === 0) {
            return <p className="p-6 text-sm text-[#7185a6]">No submissions to display.</p>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left">
                    <thead className="bg-[#f7f8fa] text-xs text-[#526684]">
                        <tr>
                            <th className="px-4 py-3">Submission</th>
                            <th className="px-4 py-3">Researcher</th>
                            <th className="px-4 py-3">Submitted</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e7ef]">
                        {queue.map((application) => (
                            <tr key={application.id}>
                                <td className="px-4 py-4">
                                    <p className="font-bold text-[#171725]">{application.title}</p>
                                    <p className="mt-1 text-xs text-[#7185a6]">{application.reference}</p>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                    {application.researcher}
                                    <p className="text-xs text-[#7185a6]">{application.department}</p>
                                </td>
                                <td className="px-4 py-4 text-sm">{formattedDate(application.submittedAt)}</td>
                                <td className="px-4 py-4 text-sm">
                                    {statusLabels[application.status] ?? application.status}
                                </td>
                                <td className="px-4 py-4">
                                    <button
                                        type="button"
                                        onClick={() => openApplication(application)}
                                        className="rounded-md bg-[#a50021] px-4 py-2 text-xs font-bold text-white"
                                    >
                                        View submission
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <CoordinatorLayout
            activeSection={activeSection}
            breadcrumb={selected && activeSection === 'applications'
                ? selected.reference
                : pageTitle[activeSection]}
            notificationCount={notifications.filter((notification) => !notification.read_at).length}
            onNavigate={(section) => {
                setSelectedId(null);
                setActiveSection(section);
            }}
        >
            <Head title={pageTitle[activeSection]} />

            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="mb-3 h-1 w-12 rounded-full bg-[#ff8500]" />
                    <h1 className="text-3xl font-extrabold text-[#171725]">
                        {selected && activeSection === 'applications' && (
                            <button
                                type="button"
                                onClick={() => setSelectedId(null)}
                                className="mr-3 inline-flex items-center gap-1 text-sm font-semibold text-[#a50021]"
                            >
                                <ArrowLeft size={17} /> All submissions
                            </button>
                        )}
                        {selected && activeSection === 'applications'
                            ? 'Submission details'
                            : pageTitle[activeSection]}
                    </h1>
                    {selected && activeSection === 'applications' && (
                        <p className="mt-2 text-sm text-[#7185a6]">
                            {selected.reference} · {selected.title}
                        </p>
                    )}
                </div>
            </div>

            {activeSection === 'dashboard' && (
                <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            { label: 'Ready for panel assignment', count: stats.readyToAssign, Icon: FileText },
                            { label: 'Under review', count: stats.underReview, Icon: ClipboardList },
                            { label: 'Revisions requested', count: stats.revisionRequired, Icon: Info },
                            { label: 'Clearances issued', count: stats.cleared, Icon: CheckCircle2 },
                        ].map(({ label, count, Icon }) => (
                            <div key={label} className="flex items-center gap-4 rounded-xl bg-white p-5">
                                <Icon size={28} className="text-[#a50021]" />
                                <div>
                                    <p className="text-sm text-[#7185a6]">{label}</p>
                                    <p className="text-3xl font-extrabold">{count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <section className="rounded-xl bg-white p-5">
                        <h2 className="mb-3 text-xl font-extrabold">Submissions ready for assignment</h2>
                        {renderQueue(false)}
                    </section>
                </div>
            )}

            {activeSection === 'applications' && (
                selected ? (
                    <div className="space-y-5">
                        <section className="grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-[#7185a6]">Researcher</p>
                                <p className="mt-1 font-bold">{selected.researcher}</p>
                                <p className="text-sm">{selected.researcherEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#7185a6]">Department / research type</p>
                                <p className="mt-1 font-bold">{selected.department}</p>
                                <p className="text-sm">{selected.researchType}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#7185a6]">Status</p>
                                <p className="mt-1 font-bold">
                                    {statusLabels[selected.status] ?? selected.status}
                                </p>
                                <p className="text-sm">Submitted {formattedDate(selected.submittedAt)}</p>
                            </div>
                        </section>

                        <section className="rounded-xl bg-white p-5">
                            <h2 className="text-xl font-extrabold">Manuscript submission</h2>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#30436a]">
                                {selected.abstract}
                            </p>
                            <h3 className="mt-5 font-bold">Submitted documents</h3>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                {Object.entries(selected.documents).map(([key, fileName]) => (
                                    <a
                                        key={key}
                                        href={route('coordinator.submissions.documents', [selected.id, key])}
                                        className="flex items-center gap-2 rounded-md border border-[#e1e6ef] p-3 text-sm text-blue-700 underline"
                                    >
                                        <FileText size={18} />
                                        {documentLabels[key] ?? key}: {fileName}
                                    </a>
                                ))}
                                {Object.keys(selected.documents).length === 0 && (
                                    <p className="text-sm text-[#7185a6]">No documents were attached.</p>
                                )}
                            </div>
                        </section>

                        {['submitted', 'resubmitted'].includes(selected.status) && (
                            <section className="rounded-xl bg-white p-5">
                                <h2 className="text-xl font-extrabold">Assign a three-reviewer panel</h2>
                                <p className="mt-1 text-sm text-[#7185a6]">
                                    Select three distinct reviewers. They will review the manuscript and make the clearance recommendation.
                                </p>
                                <div className="mt-4 grid gap-3 md:grid-cols-3">
                                    {reviewerIds.map((reviewerId, index) => (
                                        <label key={index} className="text-sm font-semibold">
                                            Reviewer {index + 1}
                                            <select
                                                value={reviewerId}
                                                onChange={(event) => setReviewerIds((previous) =>
                                                    previous.map((id, itemIndex) =>
                                                        itemIndex === index ? event.target.value : id,
                                                    ),
                                                )}
                                                className="mt-1 block w-full rounded-md border border-[#cdd7e8] p-2"
                                            >
                                                <option value="">Select a reviewer</option>
                                                {reviewers.map((reviewer) => (
                                                    <option
                                                        key={reviewer.id}
                                                        value={reviewer.id}
                                                        disabled={reviewerIds.includes(String(reviewer.id)) &&
                                                            reviewerId !== String(reviewer.id)}
                                                    >
                                                        {reviewer.name} ({reviewer.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    ))}
                                </div>
                                {actionError && (
                                    <p role="alert" className="mt-3 text-sm text-red-600">
                                        {actionError}
                                    </p>
                                )}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        disabled={reviewerIds.some((id) => !id)}
                                        onClick={assignPanel}
                                        className="rounded-md bg-[#a50021] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                                    >
                                        Assign panel
                                    </button>
                                </div>
                            </section>
                        )}

                        {selected.panels.map((panel) => (
                            <section key={panel.id} className="rounded-xl bg-white p-5">
                                <h2 className="text-lg font-extrabold">
                                    Review cycle {panel.cycle} · {panel.status.replaceAll('_', ' ')}
                                </h2>
                                <div className="mt-3 divide-y">
                                    {panel.assignments.map((assignment) => (
                                        <div key={assignment.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                                            <span>{assignment.reviewer}</span>
                                            <span>{assignment.status.replaceAll('_', ' ')}</span>
                                            <span>{assignment.decision ?? 'Awaiting decision'}</span>
                                            {assignment.comment && (
                                                <p className="basis-full text-[#7185a6]">{assignment.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <section className="rounded-xl bg-white p-5">
                        <p className="mb-4 text-sm text-[#7185a6]">
                            View submissions and assign reviewers to submitted or resubmitted manuscripts.
                        </p>
                        {renderQueue(true)}
                    </section>
                )
            )}

            {activeSection === 'reviewers' && (
                <section className="rounded-xl bg-white p-5">
                    <div className="mb-4 flex items-center gap-2">
                        <Users />
                        <h2 className="text-xl font-bold">Reviewer accounts</h2>
                    </div>
                    {reviewers.map((reviewer) => (
                        <div key={reviewer.id} className="flex flex-wrap justify-between border-t py-3">
                            <span className="font-semibold">{reviewer.name}</span>
                            <span>{reviewer.email}</span>
                        </div>
                    ))}
                    {reviewers.length === 0 && <p>No reviewer accounts are available.</p>}
                </section>
            )}

            {activeSection === 'progress' && (
                <section className="rounded-xl bg-white p-5">
                    <div className="mb-4 flex items-center gap-2">
                        <ClipboardList />
                        <h2 className="text-xl font-bold">Panel progress</h2>
                    </div>
                    {applications.filter((application) => application.panels.length > 0).map((application) => (
                        <div key={application.id} className="border-t py-4">
                            <p className="font-bold">{application.reference} · {application.title}</p>
                            {application.panels.map((panel) => (
                                <div key={panel.id} className="mt-2 pl-4 text-sm">
                                    <p>Cycle {panel.cycle}: {panel.status.replaceAll('_', ' ')}</p>
                                    <p>
                                        {panel.assignments.filter((assignment) => assignment.status === 'completed').length}
                                        {' '}of 3 reviews submitted
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                    {applications.every((application) => application.panels.length === 0) && (
                        <p>No review panels have been assigned.</p>
                    )}
                </section>
            )}

            {activeSection === 'clearances' && (
                <section className="rounded-xl bg-white p-5">
                    <div className="mb-4 flex items-center gap-2">
                        <FileCheck2 />
                        <h2 className="text-xl font-bold">Issued ethics clearances</h2>
                    </div>
                    {clearances.map((clearance) => (
                        <div key={clearance.id} className="border-t py-4">
                            <p className="font-bold">{clearance.certificateNumber} · {clearance.reference}</p>
                            <p>{clearance.title}</p>
                            <p className="text-sm text-[#7185a6]">
                                {clearance.researcher} · Issued {clearance.issuedAt}
                            </p>
                        </div>
                    ))}
                    {clearances.length === 0 && <p>No clearances have been issued.</p>}
                    <p className="mt-4 flex items-center gap-2 border-t pt-4 text-sm text-[#7185a6]">
                        <CheckCircle2 size={18} />
                        Clearance is issued automatically after unanimous reviewer approval.
                    </p>
                </section>
            )}

            {activeSection === 'notifications' && (
                <section className="rounded-xl bg-white p-5">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="border-t py-3">
                            <p>{notification.message}</p>
                            <p className="mt-1 text-xs text-[#7185a6]">
                                {notification.type.replaceAll('_', ' ')} · {formattedDate(notification.created_at)}
                            </p>
                        </div>
                    ))}
                    {notifications.length === 0 && <p>No notifications.</p>}
                </section>
            )}
        </CoordinatorLayout>
    );
}
