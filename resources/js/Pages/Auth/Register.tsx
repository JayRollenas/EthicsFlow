
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!acceptedTerms) return;

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create an Account | EthicsFlow" />

            <main className="min-h-screen bg-[#faf8f8] flex items-center justify-center p-4 md:p-8">

                <div className="w-full max-w-[1400px] bg-white rounded-[34px] p-4 md:p-5 grid lg:grid-cols-2 gap-8 shadow-sm">

                    {/* LEFT IMAGE PANEL */}
                    <section
                        className="relative min-h-[600px] lg:min-h-[882px] rounded-[26px] overflow-hidden bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('/images/pup-circuit-login.png')",
                        }}
                    />

                    {/* RIGHT REGISTRATION PANEL */}
                    <section className="flex flex-col justify-center px-5 md:px-8 lg:px-10 py-10">

                        {/* ACCENT */}
                        <div className="w-11 h-2 rounded-full bg-orange-500 mb-4" />

                        {/* HEADING */}
                        <h1 className="text-4xl md:text-[48px] leading-tight font-extrabold tracking-tight text-[#171722]">
                            Create an account
                        </h1>

                        <p className="text-lg md:text-[23px] text-[#686879] mt-1 mb-7">
                            Register as a student researcher.
                        </p>

                        <form onSubmit={submit} className="space-y-4">

                            {/* FIRST NAME AND LAST NAME */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="first_name" className="block font-bold text-[#171722] mb-2">
                                        First name
                                    </label>

                                    <input
                                        id="first_name"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFirstName(value);
                                            setData('name', `${value} ${lastName}`.trim());
                                        }}
                                        autoComplete="given-name"
                                        required
                                        placeholder="Enter your first name"
                                        className="w-full h-12 border border-[#d5d5df] rounded-lg px-4 text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block font-bold text-[#171722] mb-2">
                                        Last name
                                    </label>

                                    <input
                                        id="last_name"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setLastName(value);
                                            setData('name', `${firstName} ${value}`.trim());
                                        }}
                                        autoComplete="family-name"
                                        required
                                        placeholder="Enter your last name"
                                        className="w-full h-12 border border-[#d5d5df] rounded-lg px-4 text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                    />
                                </div>

                            </div>

                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}

                            {/* UNIVERSITY EMAIL */}
                            <div>
                                <label htmlFor="email" className="block font-bold text-[#171722] mb-2">
                                    University email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                    required
                                    placeholder="Enter your university email"
                                    className="w-full h-12 border border-[#d5d5df] rounded-lg px-4 text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                />

                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* STUDENT NUMBER */}
                            <div>
                                <label htmlFor="student_number" className="block font-bold text-[#171722] mb-2">
                                    Student number
                                </label>

                                <input
                                    id="student_number"
                                    type="text"
                                    value={studentNumber}
                                    onChange={(e) => setStudentNumber(e.target.value)}
                                    placeholder="Enter your student number"
                                    className="w-full h-12 border border-[#d5d5df] rounded-lg px-4 text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                />
                            </div>

                            {/* DEPARTMENT / PROGRAM */}
                            <div>
                                <label htmlFor="department" className="block font-bold text-[#171722] mb-2">
                                    Department / Program
                                </label>

                                <select
                                    id="department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full h-12 border border-[#d5d5df] rounded-lg px-4 text-[#686879] bg-white outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                >
                                    <option value="">Select your department / program</option>
                                    <option value="Computer Engineering">Computer Engineering</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* PASSWORD AND CONFIRM PASSWORD */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* PASSWORD */}
                                <div>
                                    <label htmlFor="password" className="block font-bold text-[#171722] mb-2">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="new-password"
                                            required
                                            placeholder="Enter your password"
                                            className="w-full h-12 border border-[#d5d5df] rounded-lg px-4 pr-12 text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858597]"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            <PasswordIcon visible={showPassword} />
                                        </button>
                                    </div>

                                    <p className="text-sm text-[#858597] mt-1">
                                        Use at least 8 characters.
                                    </p>

                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div>
                                    <label htmlFor="password_confirmation" className="block font-bold text-[#171722] mb-2">
                                        Confirm password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            autoComplete="new-password"
                                            required
                                            placeholder="Confirm your password"
                                            className="w-full h-12 border border-[#d5d5df] rounded-lg px-4 pr-12 text-gray-800 placeholder:text-[#a0a0af] outline-none focus:border-[#92001d] focus:ring-2 focus:ring-red-100 transition"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858597]"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        >
                                            <PasswordIcon visible={showConfirmPassword} />
                                        </button>
                                    </div>

                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* TERMS AND PRIVACY */}
                            <label className="flex items-start gap-3 text-[#686879] text-sm cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    required
                                    className="w-5 h-5 mt-0.5 shrink-0 rounded border-gray-300 accent-[#92001d]"
                                />

                                <span>
                                    I agree to the{' '}
                                    <a href="#terms" className="text-[#a00020] hover:underline">
                                        Terms of Use
                                    </a>
                                    {' '}and{' '}
                                    <a href="#privacy" className="text-[#a00020] hover:underline">
                                        Privacy Notice
                                    </a>.
                                </span>
                            </label>

                            {/* CREATE ACCOUNT */}
                            <button
                                type="submit"
                                disabled={processing || !acceptedTerms}
                                className="w-full h-[52px] bg-[#a00020] hover:bg-[#850019] disabled:opacity-60 text-white font-bold text-lg rounded-lg transition duration-200 flex items-center justify-center gap-3"
                            >
                                {processing ? 'Creating account...' : 'Create researcher account'}

                                {!processing && (
                                    <span className="text-2xl font-normal">→</span>
                                )}
                            </button>

                        </form>

                        {/* LOGIN LINK */}
                        <div className="border-t border-[#dedee4] mt-6 pt-4 text-center text-[#686879] text-sm">
                            Already have an account?

                            <Link
                                href={route('login')}
                                className="text-[#a00020] underline ml-1 hover:text-[#740017]"
                            >
                                Sign in
                            </Link>
                        </div>

                        {/* FOOTER */}
                        <div className="flex items-center justify-center gap-3 mt-6 text-[#89899a] text-xs text-center">
                            <svg
                                className="w-5 h-5 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="2" />
                                <path d="M8 10V7a4 4 0 118 0v3" strokeWidth="2" />
                            </svg>

                            <p>
                                For student researchers only. Reviewer accounts are managed by the Ethics Coordinator.
                            </p>
                        </div>

                    </section>
                </div>
            </main>
        </>
    );
}

function PasswordIcon({ visible }: { visible: boolean }) {
    return visible ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.9 10.9 0 0112 5c5 0 9 7 9 7a15.3 15.3 0 01-4 4.7M6.2 6.2C3.5 8 2 12 2 12s4 7 10 7c1 0 2-.2 2.9-.5" />
        </svg>
    ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
        </svg>
    );
}
