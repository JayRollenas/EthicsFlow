import type { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';

import {
    Bell,
    ClipboardList,
    FileCheck2,
    FileText,
    House,
    LogOut,
    Users,
} from 'lucide-react';

export type CoordinatorSection =
    | 'dashboard'
    | 'applications'
    | 'reviewers'
    | 'progress'
    | 'clearances'
    | 'notifications';

interface Props {
    children: ReactNode;
    activeSection: CoordinatorSection;
    breadcrumb: string;
    notificationCount: number;
    onNavigate: (section: CoordinatorSection) => void;
}

const navigation = [
    {
        section: 'dashboard',
        label: 'Dashboard',
        icon: House,
    },
    {
        section: 'applications',
        label: 'All Applications',
        icon: FileText,
    },
    {
        section: 'reviewers',
        label: 'Reviewers',
        icon: Users,
    },
    {
        section: 'progress',
        label: 'Review Progress',
        icon: ClipboardList,
    },
    {
        section: 'clearances',
        label: 'Clearances',
        icon: FileCheck2,
    },
] as const;

export default function CoordinatorLayout({
    children,
    activeSection,
    breadcrumb,
    notificationCount,
    onNavigate,
}: Props) {
    const page = usePage();

    const auth = (
        page.props as {
            auth?: {
                user?: {
                    name?: string;
                    role?: string;
                };
            };
        }
    ).auth;

    const name = auth?.user?.name || 'Dr. Liza Cruz';

    const initials = name
        .replace(/^(Dr\.?|Engr\.?|Prof\.?)\s+/i, '')
        .split(' ')
        .filter(Boolean)
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    function navigate(section: CoordinatorSection) {
        onNavigate(section);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    return (
        <div className="min-h-screen bg-[#faf9f9] p-3 font-sans md:p-6">
            <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1600px] gap-5">

                {/* =====================================
                    COORDINATOR SIDEBAR
                ===================================== */}

                <aside className="relative hidden w-[255px] shrink-0 overflow-hidden rounded-xl bg-white md:flex md:flex-col">

                    {/* LOGO AND BRAND */}
                    <div className="relative z-10 px-6 pb-3 pt-7">
                        <img
                            src="/images/pup-logo.png"
                            alt="PUP Logo"
                            className="mb-4 h-[99px] w-[99px] object-contain"
                        />

                        <h2 className="text-[23px] font-extrabold leading-tight tracking-tight text-[#14152e]">
                            Research Ethics
                        </h2>

                        <p className="mt-1 text-[12px] text-[#6c82ac]">
                            Review Management System
                        </p>

                        <div className="mt-3 h-[4px] w-[42px] rounded-full bg-[#ff8500]" />
                    </div>

                    {/* MAIN NAVIGATION */}
                    <nav
                        aria-label="Coordinator navigation"
                        className="relative z-10 mt-1 space-y-1 px-3"
                    >
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active =
                                activeSection === item.section;

                            return (
                                <button
                                    key={item.section}
                                    type="button"
                                    onClick={() => navigate(item.section)}
                                    className={`flex w-full items-center gap-4 rounded-md px-4 py-3 text-left text-[14px] transition ${
                                        active
                                            ? 'bg-[#fde7eb] font-bold text-[#b00025]'
                                            : 'font-medium text-[#5473a9] hover:bg-[#f8f2f4] hover:text-[#b00025]'
                                    }`}
                                >
                                    <Icon
                                        size={21}
                                        strokeWidth={1.8}
                                        className="shrink-0"
                                    />

                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* SECONDARY NAVIGATION */}
                    <div className="relative z-10 mx-4 mt-5 border-t border-[#e0e7f0] pt-2">

                        <button
                            type="button"
                            onClick={() => navigate('notifications')}
                            className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-[14px] transition ${
                                activeSection === 'notifications'
                                    ? 'bg-[#fde7eb] font-bold text-[#b00025]'
                                    : 'text-[#5473a9] hover:bg-[#f8f2f4]'
                            }`}
                        >
                            <Bell size={21} strokeWidth={1.8} />

                            <span className="flex-1 text-left">
                                Notifications
                            </span>

                            {notificationCount > 0 && (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b9002b] text-[12px] font-bold text-white">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="min-h-[220px] flex-1" />

                    {/* CIRCUIT DECORATION */}
                    <svg
                        viewBox="0 0 240 300"
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-90"
                    >
                        <g
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.3"
                        >
                            <path
                                d="M0 55 L28 85 H75 L110 120 V220 L174 284"
                                stroke="#ff5470"
                            />
                            <path
                                d="M0 85 L24 109 H59 L93 143 V230 L159 296"
                                stroke="#ff5470"
                            />
                            <path
                                d="M0 112 L35 147 H68 L84 163 V246 L133 295"
                                stroke="#ff7a42"
                            />
                            <path
                                d="M0 165 L24 189 V226 L82 284"
                                stroke="#ff9c24"
                            />
                            <path
                                d="M48 194 V245 L98 295"
                                stroke="#ff8b13"
                            />
                            <path
                                d="M20 125 L53 158 H86"
                                stroke="#f54266"
                            />
                        </g>

                        <g fill="#ff4e69">
                            <circle cx="75" cy="85" r="4" />
                            <circle cx="110" cy="220" r="4" />
                            <circle cx="59" cy="109" r="4" />
                            <circle cx="93" cy="230" r="4" />
                        </g>

                        <g fill="#ff9019">
                            <circle cx="24" cy="189" r="4" />
                            <circle cx="48" cy="194" r="4" />
                            <circle cx="82" cy="284" r="4" />
                            <circle cx="174" cy="284" r="4" />
                        </g>
                    </svg>

                    {/* SIGN OUT */}
                    <div className="relative z-10 px-5 pb-7 pt-5">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center gap-3 rounded-md px-2 py-2 text-[14px] text-[#6a83ad] hover:bg-white/90 hover:text-[#b00025]"
                        >
                            <LogOut size={21} strokeWidth={1.8} />
                            Sign out
                        </Link>
                    </div>
                </aside>

                {/* =====================================
                    MAIN CONTENT
                ===================================== */}

                <div className="min-w-0 flex-1">

                    {/* TOP NAVBAR */}
                    <header className="flex min-h-[68px] items-center justify-between gap-4 rounded-xl bg-white px-5 sm:px-7">

                        <p className="min-w-0 truncate text-[14px] text-[#6680ad] sm:text-[16px]">
                            {breadcrumb}
                        </p>

                        <div className="flex shrink-0 items-center gap-5">

                            <button
                                type="button"
                                onClick={() => navigate('notifications')}
                                aria-label="View notifications"
                                className="relative text-[#6580ab] hover:text-[#b00025]"
                            >
                                <Bell size={24} strokeWidth={1.7} />

                                {notificationCount > 0 && (
                                    <span className="absolute right-[-1px] top-[-2px] h-[9px] w-[9px] rounded-full bg-[#ff8500]" />
                                )}
                            </button>

                            <div className="hidden h-8 w-px bg-[#dce4f0] sm:block" />

                            <div className="flex items-center gap-3 text-left">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#b50028] text-sm font-bold text-white">
                                    {initials || 'LC'}
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-[14px] font-bold text-[#14152e]">
                                        {name}
                                    </p>

                                    <p className="mt-0.5 text-[12px] text-[#7890b7]">
                                        Ethics Coordinator
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* MOBILE NAVIGATION */}
                    <div className="mt-3 flex gap-2 overflow-x-auto rounded-lg bg-white p-2 md:hidden">
                        {[
                            ...navigation,
                            {
                                section: 'notifications' as const,
                                label: 'Notifications',
                                icon: Bell,
                            },
                        ].map((item) => (
                            <button
                                key={item.section}
                                type="button"
                                onClick={() => navigate(item.section)}
                                className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold ${
                                    activeSection === item.section
                                        ? 'bg-[#fde7eb] text-[#b00025]'
                                        : 'text-[#6680ad]'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* PAGE CONTENT */}
                    <main className="py-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}