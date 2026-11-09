
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Transition } from '@headlessui/react';

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: () => {
                reset('password', 'password_confirmation');
            },
        });
    };

    const inputClass =
        'block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-16 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-red-800 focus:ring-2 focus:ring-red-800/10';

    const labelClass = 'text-sm font-semibold text-gray-700';

    const renderPasswordField = (
        id: string,
        label: string,
        value: string,
        visible: boolean,
        toggleVisibility: () => void,
        onChange: (value: string) => void,
        error?: string,
        placeholder = 'Enter password',
    ) => (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>

            <div className="relative mt-2">
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={inputClass}
                    placeholder={placeholder}
                    autoComplete={
                        id === 'current_password'
                            ? 'current-password'
                            : 'new-password'
                    }
                    required
                />

                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-3 my-auto h-fit text-xs font-semibold text-red-800 hover:text-red-950 focus:outline-none focus:underline"
                    aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
                >
                    {visible ? 'Hide' : 'Show'}
                </button>
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );

    return (
        <section className={className}>
            <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">
                    Account security
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                    Change password
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Update your password to keep your account secure.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {renderPasswordField(
                    'current_password',
                    'Current password',
                    data.current_password,
                    showCurrent,
                    () => setShowCurrent(!showCurrent),
                    (value) => setData('current_password', value),
                    errors.current_password,
                    'Enter your current password',
                )}

                {renderPasswordField(
                    'password',
                    'New password',
                    data.password,
                    showNew,
                    () => setShowNew(!showNew),
                    (value) => setData('password', value),
                    errors.password,
                    'Enter your new password',
                )}

                {renderPasswordField(
                    'password_confirmation',
                    'Confirm new password',
                    data.password_confirmation,
                    showConfirmation,
                    () => setShowConfirmation(!showConfirmation),
                    (value) =>
                        setData('password_confirmation', value),
                    errors.password_confirmation,
                    'Re-enter your new password',
                )}

                <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-900">
                        Password reminder
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-amber-800">
                        Choose a strong password that is difficult to guess.
                        Avoid reusing passwords from other accounts. Your
                        password must also satisfy the application's
                        configured password validation rules.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center rounded-lg bg-red-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Updating...' : 'Update password'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-medium text-green-700">
                            Password updated successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
