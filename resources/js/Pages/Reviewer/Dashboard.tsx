import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import ReviewerLayout, {
    type ReviewerSection,
} from '@/Layouts/ReviewerLayout';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    FileText,
    Info,
    UserRound,
    X,
} from 'lucide-react';

type Decision = 'approve' | 'disapprove';
type StudyStatus = 'assigned' | 'in_progress' | 'completed';

interface Study {
    id: number;
    reference: string;
    title: string;
    abstract: string;
    researcher: string;
    department: string;
    status: StudyStatus;
    assignedAt?: string | null;
    completedAt?: string | null;
    decision: Decision | null;
    comment: string | null;
    documents: Record<string, string>;
}

interface Notice {
    id: number;
    type: string;
    message: string;
    read_at: string | null;
    created_at: string;
}

interface Props {
    assignedStudies: Study[];
    completedReviews: Study[];
    notifications: Notice[];
    stats: {
        assigned: number;
        pending: number;
        inProgress: number;
        completed: number;
    };
}

const documentLabels: Record<string, string> = {
    manuscript: 'Research manuscript / protocol',
    consent: 'Informed consent form',
    instruments: 'Research instruments',
    supporting: 'Supporting documents',
};

function formattedDate(date: string | null | undefined): string {
    return date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';
}

export default function ReviewerDashboard({
    assignedStudies,
    completedReviews,
    notifications,
    stats,
}: Props) {
    const [section, setSection] = useState<ReviewerSection>('dashboard');
    const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
    const [decision, setDecision] = useState<Decision>('approve');
    const [comment, setComment] = useState('');
    const [clientError, setClientError] = useState('');
    const { auth } = usePage().props as {
        auth?: { user?: { name?: string; email?: string } };
    };
    const userName = auth?.user?.name ?? 'Reviewer';
    const userEmail = auth?.user?.email ?? '';
    const greetingName = userName.trim().split(/\s+/).at(-1) || 'Reviewer';
    const isCompleted = selectedStudy?.status === 'completed';

    const pageInformation: Record<ReviewerSection, { title: string; description: string }> = {
        dashboard: {
            title: `Welcome back, ${greetingName}`,
            description: 'Manage your assigned studies and submit your review decisions.',
        },
        assigned: {
            title: 'Assigned studies',
            description: 'Review the submitted research documents and provide your recommendation.',
        },
        completed: {
            title: 'Completed reviews',
            description: 'Review your previously submitted decisions and comments.',
        },
        notifications: {
            title: 'Notifications',
            description: 'Updates about reviewer assignments and workflow activity.',
        },
        settings: {
            title: 'Account settings',
            description: 'Reviewer account information.',
        },
    };

    function navigate(destination: ReviewerSection) {
        setSection(destination);
        setSelectedStudy(null);
    }

    function openStudy(study: Study) {
        setSelectedStudy({
            ...study,
            status: study.status === 'assigned' ? 'in_progress' : study.status,
        });
        setDecision(study.decision === 'disapprove' ? 'disapprove' : 'approve');
        setComment(study.comment ?? '');
        setClientError('');

        if (study.status === 'assigned') {
            router.post(route('reviewer.assignments.start', study.id), {}, {
                preserveScroll: true,
                onError: (errors) => setClientError(Object.values(errors).join(' ')),
            });
        }
    }

    function submitReview() {
        if (!selectedStudy || isCompleted) {
            return;
        }
        if (!comment.trim()) {
            setClientError('Add a comment explaining your recommendation.');
            return;
        }

        router.post(
            route('reviewer.assignments.review', selectedStudy.id),
            { decision, comment },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedStudy(null),
                onError: (errors) => setClientError(Object.values(errors).join(' ')),
            },
        );
    }

    const assignedToShow = section === 'dashboard'
        ? assignedStudies.slice(0, 3)
        : assignedStudies;
    const completedToShow = section === 'dashboard'
        ? completedReviews.slice(0, 3)
        : completedReviews;
    const currentPage = pageInformation[section];

    return (
        <ReviewerLayout
            section={section}
            notificationCount={notifications.filter((notification) => !notification.read_at).length}
            onNavigate={navigate}
        >
            <Head title={currentPage.title} />

            <div className="mb-5">
                <div className="mb-3 h-1 w-12 rounded-full bg-[#ff8500]" />
                <h1 className="text-3xl font-extrabold text-[#171725]">{currentPage.title}</h1>
                <p className="mt-1 text-sm text-[#8295b1]">{currentPage.description}</p>
            </div>

            {section === 'dashboard' && (
                <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { label: 'Assigned studies', count: stats.assigned, Icon: FileText },
                        { label: 'Awaiting your review', count: stats.pending, Icon: Clock3 },
                        { label: 'In progress', count: stats.inProgress, Icon: BookOpen },
                        { label: 'Completed reviews', count: stats.completed, Icon: CheckCircle2 },
                    ].map(({ label, count, Icon }) => (
                        <div key={label} className="flex items-center gap-4 rounded-xl bg-white p-5">
                            <Icon size={28} className="text-[#b00025]" />
                            <div>
                                <p className="text-sm text-[#8295b1]">{label}</p>
                                <p className="text-3xl font-extrabold text-[#171725]">{count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {(section === 'dashboard' || section === 'assigned') && (
                <section className="rounded-xl bg-white p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-extrabold text-[#171725]">
                            {section === 'dashboard' ? 'Studies requiring your review' : 'All assigned studies'}
                        </h2>
                        {section === 'dashboard' && assignedStudies.length > 3 && (
                            <button
                                type="button"
                                onClick={() => setSection('assigned')}
                                className="text-sm font-semibold text-[#a50021]"
                            >
                                View all
                            </button>
                        )}
                    </div>
                    {assignedToShow.map((study) => (
                        <div key={study.id} className="flex flex-col gap-3 border-t border-[#e9edf3] py-4 sm:flex-row sm:items-center">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                <FileText size={23} className="mt-1 shrink-0 text-[#b00025]" />
                                <div className="min-w-0">
                                    <p className="text-xs text-[#8295b1]">{study.reference}</p>
                                    <h3 className="font-bold text-[#171725]">{study.title}</h3>
                                    <p className="mt-1 text-sm text-[#8295b1]">
                                        {study.department} · {study.researcher} · Assigned {formattedDate(study.assignedAt)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => openStudy(study)}
                                className="shrink-0 rounded-md bg-[#b00025] px-5 py-2.5 text-sm font-bold text-white"
                            >
                                {study.status === 'in_progress' ? 'Continue review' : 'Review study'}
                            </button>
                        </div>
                    ))}
                    {assignedToShow.length === 0 && (
                        <p className="border-t py-5 text-sm text-[#8295b1]">No studies are currently assigned to you.</p>
                    )}
                </section>
            )}

            {(section === 'dashboard' || section === 'completed') && (
                <section className="mt-5 rounded-xl bg-white p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-extrabold text-[#171725]">
                            {section === 'dashboard' ? 'Recently completed' : 'Completed reviews'}
                        </h2>
                        {section === 'dashboard' && completedReviews.length > 3 && (
                            <button
                                type="button"
                                onClick={() => setSection('completed')}
                                className="text-sm font-semibold text-[#a50021]"
                            >
                                View all
                            </button>
                        )}
                    </div>
                    {completedToShow.map((study) => (
                        <div key={study.id} className="flex flex-col gap-3 border-t border-[#e9edf3] py-4 sm:flex-row sm:items-center">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-[#8295b1]">{study.reference}</p>
                                <h3 className="font-bold text-[#171725]">{study.title}</h3>
                                <p className="mt-1 text-sm text-[#8295b1]">
                                    {study.department} · Completed {formattedDate(study.completedAt)}
                                </p>
                            </div>
                            <span className="text-sm font-semibold text-[#278856]">
                                {study.decision === 'approve' ? 'Recommended approval' : 'Revisions requested'}
                            </span>
                            <button
                                type="button"
                                onClick={() => openStudy(study)}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-[#a50021]"
                            >
                                View review <ArrowRight size={15} />
                            </button>
                        </div>
                    ))}
                    {completedToShow.length === 0 && (
                        <p className="border-t py-5 text-sm text-[#8295b1]">You have not submitted any reviews yet.</p>
                    )}
                </section>
            )}

            {section === 'notifications' && (
                <section className="rounded-xl bg-white p-5">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="flex gap-3 border-t border-[#e9edf3] py-4">
                            <UserRound size={20} className="mt-1 shrink-0 text-[#9258e8]" />
                            <div>
                                <p className="text-sm font-semibold text-[#171725]">{notification.message}</p>
                                <p className="mt-1 text-xs text-[#8295b1]">
                                    {notification.type.replaceAll('_', ' ')} · {formattedDate(notification.created_at)}
                                </p>
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && <p className="py-4 text-sm text-[#8295b1]">No notifications.</p>}
                </section>
            )}

            {section === 'settings' && (
                <section className="rounded-xl bg-white p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <UserRound className="text-[#a50021]" />
                        <h2 className="text-xl font-bold">Reviewer account</h2>
                    </div>
                    <p className="border-t py-3"><span className="text-sm text-[#8295b1]">Name</span><br />{userName}</p>
                    <p className="border-t py-3"><span className="text-sm text-[#8295b1]">Email</span><br />{userEmail}</p>
                    <p className="border-t py-3"><span className="text-sm text-[#8295b1]">Role</span><br />Reviewer</p>
                </section>
            )}

            {selectedStudy && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
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
                        className="my-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs text-[#8295b1]">{selectedStudy.reference}</p>
                                <h2 id="review-study-title" className="mt-1 text-2xl font-extrabold text-[#171725]">
                                    {selectedStudy.title}
                                </h2>
                                <p className="mt-1 text-sm text-[#8295b1]">
                                    {selectedStudy.researcher} · {selectedStudy.department}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedStudy(null)}
                                aria-label="Close review"
                                className="rounded-md p-1 text-[#8295b1] hover:bg-[#f2f3f6]"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <div className="mt-5">
                            <h3 className="font-bold">Study description</h3>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#30436a]">{selectedStudy.abstract}</p>
                        </div>

                        <div className="mt-5">
                            <h3 className="font-bold">Submission documents</h3>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                {Object.entries(selectedStudy.documents).map(([key, fileName]) => (
                                    <a
                                        key={key}
                                        href={route('reviewer.assignments.documents', [selectedStudy.id, key])}
                                        className="flex items-center gap-2 rounded-md border border-[#e1e6ef] p-3 text-sm text-blue-700 underline"
                                    >
                                        <FileText size={18} />
                                        {documentLabels[key] ?? key}: {fileName}
                                    </a>
                                ))}
                                {Object.keys(selectedStudy.documents).length === 0 && (
                                    <p className="text-sm text-[#8295b1]">No documents are available.</p>
                                )}
                            </div>
                        </div>

                        {isCompleted ? (
                            <div className="mt-5 rounded-lg bg-[#f7f8fa] p-4">
                                <p className="font-bold">
                                    {selectedStudy.decision === 'approve' ? 'Recommended approval' : 'Revisions requested'}
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-[#30436a]">{selectedStudy.comment}</p>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-4 border-t pt-5">
                                <h3 className="font-bold">Your recommendation</h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {([
                                        ['approve', 'Recommend approval'],
                                        ['disapprove', 'Request revisions'],
                                    ] as const).map(([value, label]) => (
                                        <label key={value} className={`cursor-pointer rounded-lg border p-4 ${decision === value ? 'border-[#a50021] bg-[#fff7f8]' : 'border-[#dce3ed]'}`}>
                                            <input
                                                type="radio"
                                                name="decision"
                                                value={value}
                                                checked={decision === value}
                                                onChange={() => setDecision(value)}
                                                className="mr-2 accent-[#a50021]"
                                            />
                                            <span className="font-semibold">{label}</span>
                                        </label>
                                    ))}
                                </div>
                                <label className="block text-sm font-semibold">
                                    Review comments
                                    <textarea
                                        rows={5}
                                        maxLength={10000}
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        className="mt-1 block w-full rounded-md border border-[#cdd7e8] p-3"
                                        placeholder="Explain your assessment and any required changes."
                                        required
                                    />
                                </label>
                                <div className="flex items-start gap-2 rounded-md bg-[#fff8ea] p-3 text-sm text-[#a36b24]">
                                    <Info size={18} className="mt-0.5 shrink-0" />
                                    <p>The application is cleared only if all three reviewers recommend approval. A revision request returns it to the researcher.</p>
                                </div>
                                {clientError && <p role="alert" className="text-sm text-red-600">{clientError}</p>}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={submitReview}
                                        className="rounded-md bg-[#b00025] px-5 py-3 text-sm font-bold text-white"
                                    >
                                        Submit review
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </ReviewerLayout>
    );
}
