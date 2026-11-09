import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import {
    Bell,
    ChevronDown,
    ClipboardList,
    FileText,
    House,
    LogOut,
    Menu,
    Settings,
    X,
} from 'lucide-react';

// Check Laravel routes
function safeRoute(name) {
    try {
        return typeof route === 'function' && route().has(name)
            ? route(name)
            : null;
    } catch {
        return null;
    }
}

// SIDEBAR NAVIGATION
const navigation = [
    {
        label: 'Dashboard',
        icon: House,
        routeName: 'dashboard',
    },
    {
        label: 'My Applications',
        icon: ClipboardList,
        routeName: 'applications.index',
    },
    {
        label: 'Requirements',
        icon: FileText,
        routeName: 'requirements.index',
    },
    {
        label: 'Notifications',
        icon: Bell,
        routeName: 'notifications.index',
        count: 3,
    },
    {
        label: 'Account Settings',
        icon: Settings,
        routeName: 'profile.edit',
    },
];

// CIRCUIT DECORATION
function CircuitDecoration() {
    return (
        <svg
            viewBox="0 0 232 258"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 w-full opacity-90"
        >
            <g
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path stroke="#ff5068" d="M-17 13 49 79h35l33 33h38l19 19v47" />
                <path stroke="#ff5068" d="M-14 43 43 100h40l27 27h39l16 16v44" />
                <path stroke="#ff5068" d="M-5 69 26 100h43l33 33h44l12 12v48" />
                <path stroke="#ff931f" d="M-11 114 34 159v38l28 28h44l24 24" />
                <path stroke="#ff931f" d="M-3 139 45 187v27l25 25h29" />
                <path stroke="#ff931f" d="M46 162v42l40 40h37l25 25" />
                <path stroke="#ff931f" d="M121 199h41l25 25v34" />
                <path stroke="#ff931f" d="M168 218 198 248v26" />
                <path stroke="#ff931f" d="M198 202v24l20 20" />
                <path stroke="#ff931f" d="M222 230 211 241v18" />
            </g>

            <g fill="#ff4567">
                <circle cx="84" cy="79" r="4" />
                <circle cx="155" cy="178" r="4" />
                <circle cx="165" cy="187" r="4" />
            </g>

            <g fill="#ff871d">
                <circle cx="34" cy="159" r="4" />
                <circle cx="45" cy="204" r="4" />
                <circle cx="62" cy="225" r="4" />
                <circle cx="130" cy="249" r="4" />
                <circle cx="198" cy="202" r="4" />
                <circle cx="222" cy="230" r="4" />
            </g>
        </svg>
    );
}

// MAIN AUTHENTICATED LAYOUT
export default function AuthenticatedLayout({ children }) {
    const { auth, url } = usePage().props;
    const currentUrl = usePage().url;

    const user = auth?.user;

    const name = user?.name || 'Student Researcher';

    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const role = user?.role || 'Student Researcher';

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [previewNotice, setPreviewNotice] = useState('');

    // SIDEBAR CONTENT
    const menu = (
        <>
            {/* LOGO AND SYSTEM NAME */}
            <div className="px-6 pb-5 pt-6">
                <div className="mb-2 flex justify-center">
                    <img
                        src="/images/pup-logo.png"
                        alt="PUP Logo"
                        className="h-[106px] w-[106px] object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>

                <h2 className="whitespace-nowrap text-[22px] font-extrabold tracking-tight text-[#171725]">
                    Research Ethics
                </h2>

                <p className="whitespace-nowrap text-xs text-[#7c8ba8]">
                    Review Management System
                </p>

                <div className="mt-2 h-1 w-10 rounded-full bg-[#ff8500]" />
            </div>

            {/* NAVIGATION LINKS */}
            <nav
                className="relative z-10 space-y-1 px-3"
                aria-label="Main navigation"
            >
                {navigation.map(
                    ({ label, icon: Icon, routeName, count }) => {
                        const href = safeRoute(routeName);

                        const pathname = currentUrl.split('?')[0];

                        const isActive =
                            routeName === 'applications.index'
                                ? pathname === '/applications' ||
                                pathname.startsWith('/applications/')
                                : href
                                ? pathname ===
                                    new URL(href, window.location.origin).pathname
                                : false;

                        const className = `
                            flex w-full items-center gap-4
                            rounded-lg px-4 py-3
                            text-left text-[15px]
                            transition
                            ${
                                isActive
                                    ? 'bg-[#fdecef] font-semibold text-[#a50021]'
                                    : 'text-[#63799c] hover:bg-[#fff5f5] hover:text-[#a50021]'
                            }
                        `;

                        const content = (
                            <>
                                <Icon
                                    size={21}
                                    strokeWidth={isActive ? 2.1 : 1.8}
                                />

                                <span className="flex-1 whitespace-nowrap">
                                    {label}
                                </span>

                                {count ? (
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#a50021] text-xs font-semibold text-white">
                                        {count}
                                    </span>
                                ) : null}
                            </>
                        );

                        return href ? (
                            <Link
                                key={label}
                                href={href}
                                className={className}
                                onClick={() => setMobileOpen(false)}
                            >
                                {content}
                            </Link>
                        ) : (
                            <button
                                key={label}
                                type="button"
                                className={className}
                                onClick={() =>
                                    setPreviewNotice(
                                        `${label} is not connected to a Laravel route yet.`
                                    )
                                }
                            >
                                {content}
                            </button>
                        );
                    }
                )}
            </nav>

            {/* BOTTOM SIDEBAR */}
            <div className="relative mt-auto min-h-[245px] overflow-hidden">
                <CircuitDecoration />

                <div className="absolute bottom-6 left-6 z-10">
                    {safeRoute('logout') && (
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center gap-3 text-[15px] text-[#647597] hover:text-[#a50021]"
                        >
                            <LogOut size={20} />
                            Sign out
                        </Link>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#faf8f8] font-sans text-[#171725] lg:flex">

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    aria-label="Close sidebar"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-[260px] flex-col
                    overflow-hidden bg-white shadow-sm
                    transition-transform duration-200
                    lg:sticky lg:top-6 lg:ml-6 lg:mt-6
                    lg:h-[calc(100vh-3rem)]
                    lg:w-[238px] lg:shrink-0
                    lg:translate-x-0 lg:rounded-xl
                    ${
                        mobileOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    }
                `}
            >
                <button
                    type="button"
                    aria-label="Close menu"
                    className="absolute right-3 top-3 z-20 text-[#71819c] lg:hidden"
                    onClick={() => setMobileOpen(false)}
                >
                    <X size={22} />
                </button>

                {menu}
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="min-w-0 flex-1 lg:mr-6 lg:mt-6">

                {/* TOP NAVIGATION */}
                <header className="relative z-30 flex h-[70px] items-center justify-between rounded-xl bg-white px-5 sm:px-7 lg:rounded-l-none lg:rounded-r-xl lg:px-8">

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Open menu"
                            className="text-[#6e7e9b] lg:hidden"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <span className="text-sm font-medium text-[#65799c]">
                            Dashboard
                        </span>
                    </div>

                    {/* TOP RIGHT PROFILE */}
                    <div className="flex items-center gap-5">

                        {/* NOTIFICATION BELL */}
                        <div className="relative">
                            <button
                                type="button"
                                aria-label="Recent notifications"
                                aria-expanded={notificationsOpen}
                                className="relative flex h-10 w-10 items-center justify-center text-[#66718a]"
                                onClick={() => {
                                    setNotificationsOpen(
                                        !notificationsOpen
                                    );
                                    setProfileOpen(false);
                                }}
                            >
                                <Bell
                                    size={24}
                                    strokeWidth={1.9}
                                />

                                <span className="absolute right-[5px] top-[2px] h-[9px] w-[9px] rounded-full bg-[#ff8500]" />
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 top-12 w-[300px] rounded-xl border border-[#eff0f4] bg-white p-4 text-sm shadow-xl">
                                    <p className="font-bold text-[#171725]">
                                        Recent notifications
                                    </p>

                                    <p className="mt-2 text-[#6e7e9b]">
                                        You have 3 recent application
                                        updates.
                                    </p>

                                    <button
                                        type="button"
                                        className="mt-3 font-semibold text-[#a50021]"
                                        onClick={() => {
                                            setNotificationsOpen(false);
                                            setPreviewNotice(
                                                'The Notifications page needs a Laravel route.'
                                            );
                                        }}
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            )}
                        </div>

                        <span className="hidden h-9 w-px bg-[#e5e8ef] sm:block" />

                        {/* USER PROFILE */}
                        <div className="relative">
                            <button
                                type="button"
                                aria-expanded={profileOpen}
                                className="flex items-center gap-3"
                                onClick={() => {
                                    setProfileOpen(!profileOpen);
                                    setNotificationsOpen(false);
                                }}
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#a50021] text-sm font-bold text-white">
                                    {initials}
                                </span>

                                <span className="hidden text-left sm:block">
                                    <span className="block text-sm font-bold text-[#171725]">
                                        {name}
                                    </span>

                                    <span className="block text-xs text-[#7c8ba8]">
                                        {role}
                                    </span>
                                </span>

                                <ChevronDown
                                    size={19}
                                    className="text-[#66718a]"
                                />
                            </button>

                            {/* PROFILE DROPDOWN */}
                            {profileOpen && (
                                <div className="absolute right-0 top-14 w-52 rounded-xl border border-[#eff0f4] bg-white p-2 shadow-xl">
                                    {safeRoute('profile.edit') && (
                                        <Link
                                            href={route('profile.edit')}
                                            className="block rounded-lg px-3 py-2 text-sm text-[#66718a] hover:bg-[#fff3f4]"
                                        >
                                            Account settings
                                        </Link>
                                    )}

                                    {safeRoute('logout') && (
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#a50021] hover:bg-[#fff3f4]"
                                        >
                                            Sign out
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="mx-auto w-full max-w-[1510px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>

            {/* NOTIFICATION FOR UNAVAILABLE ROUTES */}
            {previewNotice && (
                <div
                    role="status"
                    className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-4 rounded-lg bg-[#171725] px-4 py-3 text-sm text-white shadow-xl"
                >
                    <span>{previewNotice}</span>

                    <button
                        type="button"
                        className="text-white/75 hover:text-white"
                        aria-label="Dismiss"
                        onClick={() => setPreviewNotice('')}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}