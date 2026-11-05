
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const [showIntro, setShowIntro] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 4300);

        const removeTimer = setTimeout(() => {
            setShowIntro(false);
        }, 5000);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, []);


    const features = [
        {
            title: 'Research Submission',
            description:
                'Submit research proposals and required documents through an organized process.',
            icon: (
                <svg
                    className="w-11 h-11"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M7 3h7l5 5v13H5V3h2zm7 0v5h5M8 13h8M8 17h8M8 9h2"
                    />
                </svg>
            ),
        },
        {
            title: 'Ethics Review',
            description:
                'Provide reviewers with a structured environment for evaluating applications.',
            icon: (
                <svg
                    className="w-11 h-11"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M12 3v17m-7-14h14M5 6l-3 7h6L5 6zm14 0l-3 7h6l-3-7zM8 20h8M9 17h6"
                    />
                </svg>
            ),
        },
        {
            title: 'Application Tracking',
            description:
                'Monitor application progress and review decisions in real-time.',
            icon: (
                <svg
                    className="w-11 h-11"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4 20V12h4v8H4zm6 0V7h4v13h-4zm6 0V3h4v17h-4z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <>
            <Head title="EthicsFlow | Research Ethics Review Management System" />


            {showIntro && (
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center
                    overflow-hidden bg-[#650012]
                    ${isExiting ? 'ethics-intro-exit' : ''}`}
                >
                    {/* Centered brand animation */}
                    <div className="ethics-brand-lockup">

                        {/* PUP LOGO */}
                        <img
                            src="/images/pup-logo.png"
                            alt="PUP Logo"
                            className="ethics-logo-animation
                            w-24 h-24 md:w-32 md:h-32
                            object-contain shrink-0"
                        />

                        {/* ETHICSFLOW TEXT */}
                        <div className="ethics-name-reveal">
                            <h1 className="text-white text-4xl
                                md:text-6xl font-extrabold
                                tracking-wide whitespace-nowrap">
                                EthicsFlow
                            </h1>
                        </div>

                    </div>
                </div>
            )}


            <main className="min-h-screen bg-white text-gray-900">

                {/* NAVBAR */}
                <nav className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between">

                        {/* BRAND */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/pup-logo.png"
                                alt="Polytechnic University of the Philippines"
                                className="w-14 h-14 md:w-16 md:h-16 object-contain"
                            />

                            <div>
                                <h2 className="text-lg md:text-xl font-extrabold text-[#68000f] leading-tight">
                                    EthicsFlow
                                </h2>

                                <p className="text-xs md:text-sm text-gray-600">
                                    Research Ethics Review Management System
                                </p>
                            </div>
                        </div>

                        {/* NAVIGATION */}
                        <div className="flex items-center gap-5 md:gap-8">

                            <a
                                href="#about"
                                className="hidden sm:block text-sm font-medium text-gray-700 hover:text-[#92001d] transition"
                            >
                                About
                            </a>

                            <a
                                href="#features"
                                className="hidden sm:block text-sm font-medium text-gray-700 hover:text-[#92001d] transition"
                            >
                                Features
                            </a>

                            <Link
                                href={route('login')}
                                className="bg-[#92001d] text-white text-sm font-semibold px-5 md:px-7 py-3 rounded-full hover:bg-[#740017] transition shadow-sm"
                            >
                                Sign In <span className="ml-1">→</span>
                            </Link>

                        </div>
                    </div>
                </nav>


                {/* HERO SECTION */}
                <section
                    className="relative min-h-[350px] md:min-h-[350px] flex items-center bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/pup-circuit-landscape.png')",
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/10" />

                    <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-8 py-12">

                        <div className="max-w-2xl text-white">

                            <p className="text-orange-300 font-bold uppercase tracking-[3px] text-sm mb-3">
                                Research with Integrity
                                <span className="inline-block w-9 h-[2px] bg-orange-400 ml-3 align-middle" />
                            </p>

                            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight">
                                Research Ethics Review

                                <span className="block text-orange-200 mt-1">
                                    Management System
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-white mt-4 max-w-xl leading-relaxed">
                                A centralized platform for submitting, reviewing,
                                and monitoring research ethics applications.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-6">

                                <Link
                                    href={route('login')}
                                    className="bg-white text-[#780014] px-8 py-3 rounded-full font-bold text-sm hover:bg-orange-100 transition shadow-md"
                                >
                                    Get Started <span className="ml-1">→</span>
                                </Link>

                                <a
                                    href="#about"
                                    className="border border-white/80 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition"
                                >
                                    Learn More
                                </a>

                            </div>
                        </div>
                    </div>
                </section>


                {/* ABOUT SECTION */}
                <section
                    id="about"
                    className="px-6 pt-5 pb-4 text-center"
                >
                    <div className="w-9 h-1 bg-orange-500 rounded-full mx-auto mb-2" />

                    <h2 className="text-2xl font-extrabold text-[#68000f]">
                        About the System
                    </h2>

                    <p className="max-w-4xl mx-auto text-sm md:text-base text-gray-600 mt-1 leading-relaxed">
                        The EthicsFlow Research Ethics Review Management System
                        provides a centralized environment where researchers,
                        reviewers, and coordinators can manage research ethics
                        applications and review processes efficiently.
                    </p>
                </section>


                {/* FEATURES SECTION */}
                <section
                    id="features"
                    className="px-5 md:px-8 pt-3 pb-6"
                >
                    <div className="max-w-7xl mx-auto">

                        <div className="text-center mb-3">
                            <div className="w-9 h-1 bg-orange-500 rounded-full mx-auto mb-2" />

                            <h2 className="text-2xl font-extrabold text-[#68000f]">
                                Platform Features
                            </h2>

                            <p className="text-sm text-gray-600">
                                Everything in one place
                            </p>
                        </div>


                        {/* FEATURE CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-orange-200 transition"
                                >

                                    {/* ICON */}
                                    <div className="w-20 h-20 shrink-0 rounded-full bg-[#ffeadb] flex items-center justify-center text-[#92001d]">
                                        {feature.icon}
                                    </div>

                                    {/* TEXT */}
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-[#68000f]">
                                            {feature.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                </section>


                {/* CALL TO ACTION */}
                <section
                    className="relative overflow-hidden bg-cover bg-center text-white text-center py-5 px-6"
                    style={{
                        backgroundImage: "url('/images/pup-circuit-landscape.png')",
                    }}
                >
                    <div className="absolute inset-0 bg-[#760015]/65" />

                    <div className="relative z-10">

                        <h2 className="text-2xl md:text-3xl font-extrabold">
                            Ready to get started?
                        </h2>

                        <p className="text-sm md:text-base text-white/90 mt-1">
                            Access the EthicsFlow Research Ethics Review Management System.
                        </p>

                        <Link
                            href={route('login')}
                            className="inline-block bg-white text-[#780014] font-bold text-sm px-7 py-3 rounded-full mt-3 hover:bg-orange-100 transition shadow-md"
                        >
                            Sign In to Continue <span className="ml-1">→</span>
                        </Link>

                    </div>
                </section>


                {/* FOOTER */}
                <footer className="bg-[#350009] text-white py-3 px-6">

                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs md:text-sm">

                        <p>
                            © {new Date().getFullYear()} EthicsFlow. All rights reserved.
                        </p>

                        <p>
                            Polytechnic University of the Philippines
                        </p>

                    </div>
                </footer>

            </main>
        </>
    );
}
