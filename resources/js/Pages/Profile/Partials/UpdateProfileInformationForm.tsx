
import { useForm, usePage, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Transition } from '@headlessui/react';
import { PageProps } from '@/types';

interface ProfileFormData {
    first_name: string;
    last_name: string;
    email: string;
    student_number: string;
    campus: string;
    academic_level: string;
    department: string;
}

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const nameParts = (user.name || '').trim().split(/\s+/);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm<ProfileFormData>({
            first_name: user.first_name ?? nameParts[0] ?? '',
            last_name:
                user.last_name ?? nameParts.slice(1).join(' ') ?? '',
            email: user.email ?? '',
            student_number: user.student_number ?? '',
            campus: user.campus ?? '',
            academic_level: user.academic_level ?? '',
            department: user.department ?? '',
        });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const inputClass =
        'mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-red-800 focus:ring-2 focus:ring-red-800/10';

    const labelClass =
        'text-sm font-semibold text-gray-700';

    return (
        <section className={className}>
            <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">
                    Personal information
                </p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">
                    Your profile details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Keep your personal and academic information up to date.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* First and last name */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first_name" className={labelClass}>
                            First name
                        </label>
                        <input
                            id="first_name"
                            type="text"
                            value={data.first_name}
                            onChange={(event) =>
                                setData('first_name', event.target.value)
                            }
                            className={inputClass}
                            placeholder="Enter your first name"
                            required
                        />
                        {errors.first_name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.first_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="last_name" className={labelClass}>
                            Last name
                        </label>
                        <input
                            id="last_name"
                            type="text"
                            value={data.last_name}
                            onChange={(event) =>
                                setData('last_name', event.target.value)
                            }
                            className={inputClass}
                            placeholder="Enter your last name"
                            required
                        />
                        {errors.last_name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                </div>

                {/* University email */}
                <div>
                    <label htmlFor="email" className={labelClass}>
                        University email address
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) =>
                            setData('email', event.target.value)
                        }
                        className={inputClass}
                        placeholder="yourname@iskolarngbayan.pup.edu.ph"
                        required
                    />

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        {user.email_verified_at ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                                Email verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Email not verified
                            </span>
                        )}

                        {mustVerifyEmail &&
                            !user.email_verified_at && (
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="text-xs font-semibold text-red-800 underline underline-offset-2 hover:text-red-950"
                                >
                                    Resend verification email
                                </Link>
                            )}
                    </div>

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Student number */}
                <div>
                    <label htmlFor="student_number" className={labelClass}>
                        Student number
                    </label>
                    <input
                        id="student_number"
                        type="text"
                        value={data.student_number}
                        onChange={(event) =>
                            setData('student_number', event.target.value)
                        }
                        className={inputClass}
                        placeholder="Enter your student number"
                        required
                    />
                    {errors.student_number && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.student_number}
                        </p>
                    )}
                </div>

                {/* Campus */}
                <div>
                    <label htmlFor="campus" className={labelClass}>
                        Campus
                    </label>
                    <input
                        id="campus"
                        type="text"
                        value={data.campus}
                        onChange={(event) =>
                            setData('campus', event.target.value)
                        }
                        className={inputClass}
                        placeholder="Enter your PUP campus"
                        required
                    />
                    {errors.campus && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.campus}
                        </p>
                    )}
                </div>

                {/* Academic level */}
                <div>
                    <label htmlFor="academic_level" className={labelClass}>
                        Academic level
                    </label>
                    <select
                        id="academic_level"
                        value={data.academic_level}
                        onChange={(event) =>
                            setData('academic_level', event.target.value)
                        }
                        className={inputClass}
                        required
                    >
                        <option value="">Select academic level</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Open University">Open University</option>
                        <option value="Senior High School">
                            Senior High School
                        </option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.academic_level && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.academic_level}
                        </p>
                    )}
                </div>

                {/* Department / Program */}
                <div>
                    <label htmlFor="department" className={labelClass}>
                        Department / Program
                    </label>
                    <input
                        id="department"
                        type="text"
                        value={data.department}
                        onChange={(event) =>
                            setData('department', event.target.value)
                        }
                        className={inputClass}
                        placeholder="Enter your college, department, or program"
                        required
                    />
                    {errors.department && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.department}
                        </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                        Enter your official PUP college, department, or
                        academic program.
                    </p>
                </div>

                {/* Save */}
                <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center rounded-lg bg-red-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Saving...' : 'Save changes'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-medium text-green-700">
                            Changes saved successfully.
                        </p>
                    </Transition>
                </div>

                {status === 'verification-link-sent' && (
                    <p className="text-sm font-medium text-green-700">
                        A new verification link has been sent to your email.
                    </p>
                )}
            </form>
        </section>
    );
}
