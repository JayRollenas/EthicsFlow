import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

type DocumentKey = 'manuscript' | 'consent' | 'instruments' | 'supporting';

interface SubmissionRevision {
    id: number;
    reference: string;
    title: string;
    abstract: string;
    department: string;
    reviewerFeedback: string[];
    documents: Partial<Record<DocumentKey, { fileName: string }>>;
}

const documents: { key: DocumentKey; label: string; accept: string; required: boolean }[] = [
    { key: 'manuscript', label: 'Research manuscript / protocol', accept: '.pdf', required: true },
    { key: 'consent', label: 'Informed consent form', accept: '.pdf', required: true },
    { key: 'instruments', label: 'Research instruments', accept: '.pdf', required: true },
    { key: 'supporting', label: 'Supporting documents', accept: '.pdf,.docx', required: false },
];

export default function Revision({ submission }: { submission: SubmissionRevision }) {
    const form = useForm({
        research_title: submission.title,
        abstract: submission.abstract,
        documents: {
            manuscript: null as File | null,
            consent: null as File | null,
            instruments: null as File | null,
            supporting: null as File | null,
        },
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(route('applications.resubmit', submission.id), {
            forceFormData: true,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Correct application" />
            <div className="mx-auto max-w-4xl space-y-5">
                <header className="rounded-xl bg-white p-6">
                    <p className="text-sm font-semibold text-[#7d8dab]">{submission.reference}</p>
                    <h1 className="mt-2 text-3xl font-extrabold text-[#171725]">Correct your application</h1>
                    <p className="mt-2 text-[#7185a6]">
                        Address the reviewer feedback, then submit a new version for panel review.
                    </p>
                </header>

                <section className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h2 className="font-bold text-amber-900">Changes requested</h2>
                    {submission.reviewerFeedback.map((comment, index) => (
                        <p key={index} className="text-sm text-amber-900">{comment}</p>
                    ))}
                </section>

                <form onSubmit={submit} className="space-y-5 rounded-xl bg-white p-6">
                    <div>
                        <label htmlFor="research_title" className="mb-2 block font-semibold text-[#171725]">
                            Research title
                        </label>
                        <input
                            id="research_title"
                            value={form.data.research_title}
                            onChange={(event) => form.setData('research_title', event.target.value)}
                            required
                            maxLength={255}
                            className="w-full rounded-md border border-[#cdd7e8] px-4 py-3"
                        />
                        {form.errors.research_title && <p className="mt-1 text-sm text-red-600">{form.errors.research_title}</p>}
                    </div>

                    <div>
                        <label htmlFor="abstract" className="mb-2 block font-semibold text-[#171725]">
                            Study description / abstract
                        </label>
                        <textarea
                            id="abstract"
                            value={form.data.abstract}
                            onChange={(event) => form.setData('abstract', event.target.value)}
                            required
                            maxLength={20000}
                            rows={6}
                            className="w-full rounded-md border border-[#cdd7e8] px-4 py-3"
                        />
                        {form.errors.abstract && <p className="mt-1 text-sm text-red-600">{form.errors.abstract}</p>}
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-bold text-[#171725]">Replace documents</h2>
                        {documents.map((document) => {
                            const replacementRequired = document.required && !submission.documents[document.key];

                            return (
                                <div key={document.key} className="rounded-lg border border-[#e1e6ef] p-4">
                                    <label htmlFor={document.key} className="block font-semibold text-[#171725]">
                                        {document.label}{replacementRequired ? ' (replacement required)' : ''}
                                    </label>
                                    {submission.documents[document.key]?.fileName && (
                                        <p className="mt-1 text-sm text-[#7185a6]">
                                            Current file: {submission.documents[document.key]?.fileName}
                                        </p>
                                    )}
                                    <input
                                        id={document.key}
                                        type="file"
                                        accept={document.accept}
                                        required={replacementRequired}
                                        onChange={(event) => {
                                            const file = event.target.files?.[0] ?? null;
                                            form.setData('documents', {
                                                ...form.data.documents,
                                                [document.key]: file,
                                            });
                                        }}
                                        className="mt-3 block w-full text-sm"
                                    />
                                    {form.errors[`documents.${document.key}` as keyof typeof form.errors] && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors[`documents.${document.key}` as keyof typeof form.errors]}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap justify-end gap-3 border-t border-[#e1e6ef] pt-5">
                        <Link
                            href={route('applications.index')}
                            className="rounded-md border border-[#a50021] px-5 py-3 font-semibold text-[#a50021]"
                        >
                            Back to applications
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-md bg-[#a50021] px-5 py-3 font-bold text-white disabled:opacity-60"
                        >
                            {form.processing ? 'Submitting...' : 'Submit corrected version'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
