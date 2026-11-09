
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Account Settings" />

            <div className="min-h-screen bg-[#f8f7f6] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Page heading */}
                    <div className="mb-8">
                        <p className="text-sm font-medium text-gray-500">
                            Account <span className="mx-2">/</span>
                            <span className="text-red-900">Settings</span>
                        </p>

                        <h1 className="mt-3 text-2xl font-bold text-gray-900">
                            Account Settings
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your personal information and account
                            security.
                        </p>
                    </div>

                    {/* User summary */}
                    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900 text-xl font-bold uppercase text-white">
                                {user.first_name?.charAt(0) ||
                                    user.name?.charAt(0) ||
                                    'U'}
                                {user.last_name?.charAt(0) || ''}
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {user.first_name || user.name}
                                    {user.last_name
                                        ? ` ${user.last_name}`
                                        : ''}
                                </h2>

                                <p className="mt-0.5 text-sm text-gray-500">
                                    {user.email}
                                </p>

                                <span className="mt-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold capitalize text-red-900">
                                    {user.role || 'Researcher'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Settings columns */}
                    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                            <UpdatePasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
