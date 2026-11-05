
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password | EthicsFlow" />

            <main className="min-h-screen bg-[#faf8f8] flex items-center justify-center p-4 md:p-8">

                <div className="w-full max-w-[1304px] bg-white rounded-[34px] p-4 md:p-5 grid lg:grid-cols-2 gap-8 shadow-sm">

                    {/* LEFT IMAGE PANEL */}
                    <section
                        className="relative min-h-[600px] lg:min-h-[832px] rounded-[26px] overflow-hidden bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('/images/pup-circuit-login.png')",
                        }}
                    />

                    {/* RIGHT PASSWORD RECOVERY PANEL */}
                    <section className="flex flex-col justify-center px-5 md:px-10 lg:px-14 py-12 lg:py-16">

                        {/* ACCENT */}
                        <div className="w-14 h-2 rounded-full bg-orange-500 mb-6" />

                        {/* KEY ICON */}
                        <div className="w-[120px] h-[120px] rounded-full bg-[#fceff1] flex items-center justify-center mb-5">
                            <svg
                                className="w-16 h-16 text-[#a00020]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    cx="16"
                                    cy="8"
                                    r="5"
                                    strokeWidth="1.7"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.7"
                                    d="M12.5 11.5L3 21v-4l3-3H9l3.5-3.5M16 8h.01"
                                />
                            </svg>
                        </div>

                        {/* HEADING */}
                        <h1 className="text-4xl md:text-[48px] leading-tight font-extrabold tracking-tight text-[#171722]">
                            Forgot password?
                        </h1>

                        <p className="text-lg md:text-[23px] text-[#686879] mt-3 mb-8 leading-snug">
                            Enter your university email and we will send
                            you a link to reset your password.
                        </p>

                        {/* STATUS MESSAGE */}
                        {status && (
                            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        {/* RESET FORM */}
                        <form onSubmit={submit} className="space-y-7">

                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-lg font-bold text-[#171722] mb-3"
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
                                    className="w-full h-[60px] border border-[#d5d5df] rounded-xl px-7 text-lg text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                />

                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-2">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* SEND RESET LINK */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-16 bg-[#a00020] hover:bg-[#850019] disabled:opacity-60 text-white font-bold text-xl rounded-xl transition duration-200 flex items-center justify-center gap-5"
                            >
                                {processing ? 'Sending...' : 'Send reset link'}

                                {!processing && (
                                    <span className="text-3xl font-normal leading-none">
                                        →
                                    </span>
                                )}
                            </button>

                        </form>

                        {/* BACK TO LOGIN */}
                        <div className="border-t border-[#dedee4] mt-10 pt-8">

                            <Link
                                href={route('login')}
                                className="flex items-center justify-center gap-4 text-[#a00020] hover:text-[#740017] text-lg font-medium transition"
                            >
                                <span className="text-3xl leading-none">←</span>
                                Back to sign in
                            </Link>

                        </div>

                        {/* SECURITY FOOTER */}
                        <div className="flex items-center justify-center gap-3 mt-10 text-[#89899a] text-sm text-center">

                            <svg
                                className="w-6 h-6 shrink-0"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2L4 5v6c0 5.2 3.4 9.5 8 11 4.6-1.5 8-5.8 8-11V5l-8-3zm0 5a2 2 0 012 2v2h-4V9a2 2 0 012-2zm-3 5h6v5H9v-5z" />
                            </svg>

                            <p>
                                Secure account recovery for all users.
                            </p>

                        </div>

                    </section>
                </div>
            </main>
        </>
    );
}
