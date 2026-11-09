import type { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';

import {
    Bell,
    CheckCircle2,
    ClipboardList,
    House,
    LogOut,
    UserRound,
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

export type ReviewerSection =
    | 'dashboard'
    | 'assigned'
    | 'completed'
    | 'notifications'
    | 'settings';

interface ReviewerLayoutProps {
    children: ReactNode;
    section: ReviewerSection;
    notificationCount?: number;
    onNavigate: (section: ReviewerSection) => void;
}

interface AuthUser {
    name?: string;
    email?: string;
    role?: string;
}

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

const navigation = [
    {
        label: 'Dashboard',
        section: 'dashboard' as ReviewerSection,
        icon: House,
    },
    {
        label: 'Assigned Studies',
        section: 'assigned' as ReviewerSection,
        icon: ClipboardList,
    },
    {
        label: 'Completed Reviews',
        section: 'completed' as ReviewerSection,
        icon: CheckCircle2,
    },
    {
        label: 'Notifications',
        section: 'notifications' as ReviewerSection,
        icon: Bell,
    },
    {
        label: 'Account Settings',
        section: 'settings' as ReviewerSection,
        icon: UserRound,
    },
];

const sectionTitles: Record<ReviewerSection, string> = {
    dashboard: 'Dashboard',
    assigned: 'Assigned studies',
    completed: 'Completed reviews',
    notifications: 'Notifications',
    settings: 'Account settings',
};

// ==========================================
// MAIN LAYOUT
// ==========================================

export default function ReviewerLayout({
    children,
    section,
    notificationCount = 0,
    onNavigate,
}: ReviewerLayoutProps) {
    const { auth } = usePage().props as {
        auth?: {
            user?: AuthUser;
        };
    };

    const user = auth?.user;

    const fullName = user?.name || 'Engr. Elena Garcia';

    const nameParts = fullName
        .replace(/^(Engr\.?|Dr\.?|Prof\.?)\s+/i, '')
        .trim()
        .split(/\s+/);

    const initials = (
        (nameParts[0]?.charAt(0) || '') +
        (nameParts[nameParts.length - 1]?.charAt(0) || '')
    ).toUpperCase();

    function navigate(destination: ReviewerSection) {
        onNavigate(destination);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    return (
        <div className="min-h-screen bg-[#faf9f9] p-3 font-sans md:p-6">

            <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1540px] gap-4 lg:gap-6">

                {/* =================================
                    DESKTOP SIDEBAR
                ================================= */}

                <aside className="hidden w-[238px] shrink-0 flex-col rounded-xl bg-white px-3 py-6 md:flex">

                    {/* LOGO */}
                    <div className="px-3">
                        <img
                            src="/images/pup-logo.png"
                            alt="Polytechnic University of the Philippines"
                            className="mb-3 h-[76px] w-[76px] object-contain"
                        />

                        <h2 className="text-[19px] font-extrabold leading-tight text-[#171725]">
                            Research Ethics
                        </h2>

                        <p className="mt-1 text-[11px] text-[#7e91b0]">
                            Review Management System
                        </p>

                        <div className="mt-3 h-[4px] w-[45px] rounded-full bg-[#ff8500]" />
                    </div>

                    {/* NAVIGATION */}
                    <nav
                        aria-label="Reviewer navigation"
                        className="mt-5 space-y-1"
                    >
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = section === item.section;

                            return (
                                <button
                                    key={item.section}
                                    type="button"
                                    onClick={() => navigate(item.section)}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] transition ${
                                        active
                                            ? 'bg-[#fde8ec] font-bold text-[#b00025]'
                                            : 'font-medium text-[#6980a4] hover:bg-[#f7f5f6] hover:text-[#a50021]'
                                    }`}
                                >
                                    <Icon
                                        size={19}
                                        strokeWidth={1.8}
                                        className="shrink-0"
                                    />

                                    <span className="flex-1 whitespace-nowrap">
                                        {item.label}
                                    </span>

                                    {item.section === 'notifications' && notificationCount > 0 && (
                                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#c8002b] px-1 text-[11px] font-bold text-white">
                                            {notificationCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* SPACER */}
                    <div className="flex-1" />

                    {/* SIGN OUT */}
                    <div className="border-t border-[#edf0f5] px-2 pt-4">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-[#6980a4] hover:bg-[#fff0f3] hover:text-[#a50021]"
                        >
                            <LogOut size={20} strokeWidth={1.8} />
                            Sign out
                        </Link>
                    </div>
                </aside>

                {/* =================================
                    CONTENT AREA
                ================================= */}

                <div className="min-w-0 flex-1">

                    {/* TOP NAVBAR */}
                    <header className="flex min-h-[68px] items-center justify-between rounded-xl bg-white px-4 sm:px-6 lg:px-7">

                        {/* BREADCRUMB */}
                        <span className="text-[13px] text-[#7e91b0]">
                            {sectionTitles[section]}
                        </span>

                        {/* USER AREA */}
                        <div className="flex items-center gap-5">

                            {/* NOTIFICATION BELL */}
                            <button
                                type="button"
                                onClick={() => navigate('notifications')}
                                aria-label="Open reviewer notifications"
                                className="relative text-[#7e91b0] hover:text-[#b00025]"
                            >
                                <Bell size={21} strokeWidth={1.8} />

                                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ff8500]" />
                            </button>

                            <div className="h-8 w-px bg-[#dce3ed]" />

                            {/* ACCOUNT */}
                            <button
                                type="button"
                                onClick={() => navigate('settings')}
                                className="flex items-center gap-3 text-left"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b00025] text-[12px] font-bold text-white">
                                    {initials}
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-[13px] font-bold text-[#171725]">
                                        {fullName}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-[#8395b1]">
                                        Reviewer
                                    </p>
                                </div>
                            </button>
                        </div>
                    </header>

                    {/* MOBILE NAVIGATION */}
                    <nav
                        aria-label="Mobile reviewer navigation"
                        className="mt-3 flex gap-2 overflow-x-auto rounded-xl bg-white p-2 md:hidden"
                    >
                        {navigation.map((item) => {
                            const active = section === item.section;

                            return (
                                <button
                                    key={item.section}
                                    type="button"
                                    onClick={() => navigate(item.section)}
                                    className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold ${
                                        active
                                            ? 'bg-[#fde8ec] text-[#b00025]'
                                            : 'text-[#6980a4]'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* PAGE CONTENT */}
                    <main className="py-6">
                        {children}
                    </main>

                </div>
            </div>
        </div>
    );
}