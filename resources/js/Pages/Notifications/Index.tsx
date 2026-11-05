
import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Bell,
    MessageCircle,
    FileText,
    Clock3,
    Mail,
    ChevronRight,
    CheckCheck,
    Circle,
} from 'lucide-react';

type NotificationCategory =
    | 'comments'
    | 'revisions'
    | 'status-updates';

type NotificationItem = {
    id: number;
    title: string;
    description: string;
    time: string;
    group: 'Today' | 'Earlier';
    category: NotificationCategory;
    action: string;
    unread: boolean;
    icon: 'comment' | 'file' | 'clock' | 'mail';
};

type Tab =
    | 'all'
    | 'unread'
    | 'comments'
    | 'revisions'
    | 'status-updates';

const initialNotifications: NotificationItem[] = [
    {
        id: 1,
        title: 'New review comments',
        description:
            'Feedback is available for application REC-2026-0042.',
        time: '10 minutes ago',
        group: 'Today',
        category: 'comments',
        action: 'View feedback',
        unread: true,
        icon: 'comment',
    },
    {
        id: 2,
        title: 'Revision requested',
        description:
            'Review the comments and submit your revised documents.',
        time: '1 hour ago',
        group: 'Today',
        category: 'revisions',
        action: 'Submit revisions',
        unread: true,
        icon: 'file',
    },
    {
        id: 3,
        title: 'Reviewers assigned',
        description:
            'Your application REC-2026-0042 has been assigned for review.',
        time: '2 hours ago',
        group: 'Today',
        category: 'status-updates',
        action: 'View application',
        unread: true,
        icon: 'clock',
    },
    {
        id: 4,
        title: 'Application received',
        description:
            'Your ethics application REC-2026-0042 was successfully submitted.',
        time: 'Yesterday',
        group: 'Earlier',
        category: 'status-updates',
        action: 'View application',
        unread: false,
        icon: 'file',
    },
    {
        id: 5,
        title: 'Email verified',
        description:
            'Your researcher account is ready to use.',
        time: 'Yesterday',
        group: 'Earlier',
        category: 'status-updates',
        action: 'View profile',
        unread: false,
        icon: 'mail',
    },
];

const tabs: { label: string; value: Tab }[] = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Comments', value: 'comments' },
    { label: 'Revisions', value: 'revisions' },
    { label: 'Status updates', value: 'status-updates' },
];

function NotificationIcon({
    type,
}: {
    type: NotificationItem['icon'];
}) {
    const iconClass = 'h-6 w-6';

    switch (type) {
        case 'comment':
            return <MessageCircle className={iconClass} />;
        case 'file':
            return <FileText className={iconClass} />;
        case 'clock':
            return <Clock3 className={iconClass} />;
        case 'mail':
            return <Mail className={iconClass} />;
    }
}

export default function Index() {
    const [notifications, setNotifications] = useState(
        initialNotifications,
    );

    const [activeTab, setActiveTab] = useState<Tab>('all');

    const unreadCount = notifications.filter(
        (notification) => notification.unread,
    ).length;

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            if (activeTab === 'all') return true;
            if (activeTab === 'unread') return notification.unread;

            return notification.category === activeTab;
        });
    }, [notifications, activeTab]);

    const todayNotifications = filteredNotifications.filter(
        (notification) => notification.group === 'Today',
    );

    const earlierNotifications = filteredNotifications.filter(
        (notification) => notification.group === 'Earlier',
    );

    const markAsRead = (id: number) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? { ...notification, unread: false }
                    : notification,
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false,
            })),
        );
    };

    const renderNotification = (
        notification: NotificationItem,
    ) => (
        <div
            key={notification.id}
            className={`group flex flex-col gap-4 border-b border-gray-200 px-4 py-5 transition last:border-b-0 sm:flex-row sm:items-center sm:px-5 ${
                notification.unread
                    ? 'bg-[#fff0f2] hover:bg-[#ffe8ec]'
                    : 'bg-white hover:bg-gray-50'
            }`}
        >
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex w-4 shrink-0 justify-center">
                    {notification.unread && (
                        <Circle
                            className="h-3 w-3 fill-[#a00020] text-[#a00020]"
                            aria-label="Unread"
                        />
                    )}
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        notification.unread
                            ? 'bg-[#fbdfe5] text-[#a00020]'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    <NotificationIcon type={notification.icon} />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-gray-900">
                        {notification.title}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                        {notification.description}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pl-8 sm:justify-end sm:pl-0">
                <span className="whitespace-nowrap text-xs text-gray-500 sm:w-28 sm:text-right">
                    {notification.time}
                </span>

                <button
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className={`min-w-36 rounded-lg border px-4 py-2.5 text-xs font-bold transition ${
                        notification.unread
                            ? 'border-[#a00020] bg-[#a00020] text-white hover:bg-[#800019]'
                            : 'border-[#a00020] bg-white text-[#a00020] hover:bg-[#fff0f2]'
                    }`}
                >
                    {notification.action}
                </button>

                <button
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    aria-label={`Mark ${notification.title} as read`}
                    className="hidden text-gray-500 transition hover:translate-x-1 hover:text-[#a00020] sm:block"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

            <div className="min-h-screen bg-[#faf8f8] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Page heading */}
                    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="mb-4 h-1 w-11 rounded-full bg-orange-500" />

                            <h1 className="text-3xl font-bold tracking-tight text-[#171827] sm:text-4xl">
                                Notifications
                            </h1>

                            <p className="mt-2 text-base text-gray-500 sm:text-lg">
                                Stay updated on your ethics applications
                                and review progress.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#a00020] bg-white px-5 py-3 text-sm font-bold text-[#a00020] transition hover:bg-[#fff0f2] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="mb-5 overflow-x-auto border-b border-gray-200">
                        <div className="flex min-w-max items-center gap-8 px-1">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.value;

                                const count =
                                    tab.value === 'all'
                                        ? notifications.length
                                        : tab.value === 'unread'
                                          ? unreadCount
                                          : undefined;

                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() =>
                                            setActiveTab(tab.value)
                                        }
                                        className={`relative flex items-center gap-2 pb-4 text-sm font-medium transition ${
                                            isActive
                                                ? 'text-[#a00020]'
                                                : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab.label}

                                        {count !== undefined && (
                                            <span
                                                className={`text-xs ${
                                                    isActive
                                                        ? 'font-bold text-[#a00020]'
                                                        : 'text-gray-400'
                                                }`}
                                            >
                                                ({count})
                                            </span>
                                        )}

                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-[#a00020]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notification list */}
                    <div className="rounded-xl bg-white p-2 shadow-sm sm:p-3">
                        {todayNotifications.length > 0 && (
                            <section>
                                <h2 className="px-4 pb-3 pt-3 text-base font-bold text-gray-900">
                                    Today
                                </h2>

                                <div className="overflow-hidden rounded-xl">
                                    {todayNotifications.map(
                                        renderNotification,
                                    )}
                                </div>
                            </section>
                        )}

                        {earlierNotifications.length > 0 && (
                            <section className="mt-5">
                                <h2 className="border-b border-gray-200 px-4 pb-3 pt-2 text-base font-bold text-gray-900">
                                    Earlier
                                </h2>

                                <div>
                                    {earlierNotifications.map(
                                        renderNotification,
                                    )}
                                </div>
                            </section>
                        )}

                        {filteredNotifications.length === 0 && (
                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                    <Bell className="h-7 w-7" />
                                </div>

                                <h2 className="mt-4 text-lg font-bold text-gray-900">
                                    No notifications found
                                </h2>

                                <p className="mt-1 max-w-sm text-sm text-gray-500">
                                    There are no notifications in this
                                    category right now.
                                </p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 px-4 py-4">
                            <p className="text-xs text-gray-400">
                                Showing {filteredNotifications.length}{' '}
                                {filteredNotifications.length === 1
                                    ? 'notification'
                                    : 'notifications'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
