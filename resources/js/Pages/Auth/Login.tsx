
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In | EthicsFlow" />

            <main className="min-h-screen bg-[#faf8f8] flex items-center justify-center p-4 md:p-8">

                <div className="w-full max-w-[1304px] bg-white rounded-[34px] p-4 md:p-5 grid lg:grid-cols-2 gap-8 shadow-sm">

                    {/* LEFT IMAGE PANEL */}
                    <section
                        className="relative min-h-[600px] lg:min-h-[832px] rounded-[26px] overflow-hidden bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('/images/pup-circuit-login.png')",
                        }}
                    />

                    {/* RIGHT LOGIN PANEL */}
                    <section className="flex flex-col justify-center px-5 md:px-10 lg:px-14 py-12 lg:py-16">

                        {/* ACCENT */}
                        <div className="w-14 h-2 rounded-full bg-orange-500 mb-5" />

                        {/* HEADING */}
                        <h1 className="text-4xl md:text-[52px] leading-tight font-extrabold tracking-tight text-[#171722]">
                            Welcome back
                        </h1>

                        <p className="text-lg md:text-[23px] text-[#686879] mt-2 mb-9 leading-snug">
                            Sign in to the Research Ethics Review
                            <br className="hidden md:block" />
                            Management System.
                        </p>

                        {/* STATUS MESSAGE */}
                        {status && (
                            <div className="mb-5 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        {/* LOGIN FORM */}
                        <form onSubmit={submit} className="space-y-5">

                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-lg font-bold text-[#171722] mb-2"
                                >
                                    University email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                    required
                                    placeholder="Enter your university email"
                                    className="w-full h-[58px] border border-[#d5d5df] rounded-xl px-6 text-lg text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                />

                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-2">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-lg font-bold text-[#171722] mb-2"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="current-password"
                                        required
                                        placeholder="Enter your password"
                                        className="w-full h-[58px] border border-[#d5d5df] rounded-xl px-6 pr-14 text-lg text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#858597] hover:text-[#92001d] transition"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <svg
                                                className="w-7 h-7"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.9 10.9 0 0112 5c5 0 9 7 9 7a15.3 15.3 0 01-4 4.7M6.2 6.2C3.5 8 2 12 2 12s4 7 10 7c1 0 2-.2 2.9-.5"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-7 h-7"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="3"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-sm text-red-600 mt-2">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* REMEMBER ME / FORGOT PASSWORD */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">

                                <label className="flex items-center gap-3 text-[#686879] text-base cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-6 h-6 rounded border-gray-300 accent-[#92001d]"
                                    />
                                    Remember me
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-[#a00020] hover:text-[#740017] hover:underline text-base font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* SIGN IN BUTTON */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-16 bg-[#a00020] hover:bg-[#850019] disabled:opacity-60 text-white font-bold text-xl rounded-xl transition duration-200 flex items-center justify-center gap-5"
                            >
                                {processing ? 'Signing in...' : 'Sign in'}

                                {!processing && (
                                    <span className="text-3xl font-normal leading-none">
                                        →
                                    </span>
                                )}
                            </button>

                        </form>

                        {/* REGISTER */}
                        <div className="border-t border-[#dedee4] mt-9 pt-5 text-center text-[#686879] text-base">
                            New researcher?

                            <Link
                                href={route('register')}
                                className="text-[#a00020] underline hover:text-[#740017]"
                            >
                                Create an account
                            </Link>
                        </div>

                        {/* SECURITY FOOTER */}
                        <div className="flex items-center justify-center gap-3 mt-9 text-[#89899a] text-sm text-center">

                            <svg
                                className="w-6 h-6 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    x="4"
                                    y="10"
                                    width="16"
                                    height="11"
                                    rx="2"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M8 10V7a4 4 0 118 0v3"
                                    strokeWidth="2"
                                />
                            </svg>

                            <p>
                                Secure access for researchers, reviewers, and coordinators.
                            </p>

                        </div>

                    </section>
                </div>
            </main>
        </>
    );
}
