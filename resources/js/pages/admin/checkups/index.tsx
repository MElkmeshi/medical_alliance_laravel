import { Head, Link, router } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Checkup } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Checkups', href: '/admin/checkups' },
];

type PaginatedCheckups = {
    data: Checkup[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
};

type Props = {
    checkups: PaginatedCheckups;
    filters: {
        status?: string;
        company_id?: string;
    };
};

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'pass', label: 'Pass' },
    { value: 'fail', label: 'Fail' },
];

const EXAM_TYPE_LABELS: Record<string, string> = {
    pre_employment: 'Pre-Employment',
    periodic: 'Periodic',
    other: 'Other',
};

export default function CheckupsIndex({ checkups, filters }: Props) {
    function filterByStatus(status: string) {
        router.get('/admin/checkups', { ...filters, status: status || undefined }, { preserveState: true, replace: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Checkups" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Checkups</h1>
                    <p className="text-sm text-muted-foreground">{checkups.total} total</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => filterByStatus(opt.value)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                (filters.status ?? '') === opt.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Employee</th>
                                    <th className="px-6 py-3 text-left font-medium">Company</th>
                                    <th className="px-6 py-3 text-left font-medium">Profile</th>
                                    <th className="px-6 py-3 text-left font-medium">Date</th>
                                    <th className="px-6 py-3 text-left font-medium">Exam Type</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checkups.data.map((checkup) => (
                                    <tr key={checkup.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">
                                            <Link
                                                href={`/admin/employees/${checkup.employee_id}`}
                                                className="hover:underline"
                                            >
                                                {checkup.employee?.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">
                                            {checkup.employee?.company?.name ?? '-'}
                                        </td>
                                        <td className="px-6 py-3">{checkup.examination_profile?.name ?? '-'}</td>
                                        <td className="px-6 py-3">{formatDate(checkup.checkup_date)}</td>
                                        <td className="px-6 py-3 text-muted-foreground">
                                            {checkup.exam_type ? EXAM_TYPE_LABELS[checkup.exam_type] : '-'}
                                        </td>
                                        <td className="px-6 py-3">
                                            <StatusBadge status={checkup.status} />
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex gap-2">
                                                {checkup.status === 'pending' && (
                                                    <Button size="sm" asChild>
                                                        <Link href={`/admin/checkups/${checkup.id}/edit`}>Start</Link>
                                                    </Button>
                                                )}
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/checkups/${checkup.id}`}>View</Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {checkups.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                            No checkups found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {checkups.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-6 py-4">
                            <p className="text-sm text-muted-foreground">
                                Page {checkups.current_page} of {checkups.last_page}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!checkups.prev_page_url}
                                    onClick={() => checkups.prev_page_url && router.get(checkups.prev_page_url)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!checkups.next_page_url}
                                    onClick={() => checkups.next_page_url && router.get(checkups.next_page_url)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
