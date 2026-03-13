import { Head } from '@inertiajs/react';
import { RecentCheckupsTable } from '@/components/recent-checkups-table';
import { StatCard } from '@/components/stat-card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Checkup } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin Dashboard', href: '/admin/dashboard' }];

type Props = {
    companiesCount: number;
    employeesCount: number;
    checkupsCount: number;
    recentCheckups: Checkup[];
};

export default function AdminDashboard({ companiesCount, employeesCount, checkupsCount, recentCheckups }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard label="Companies" value={companiesCount} />
                    <StatCard label="Employees" value={employeesCount} />
                    <StatCard label="Checkups" value={checkupsCount} href="/admin/checkups" />
                </div>

                <RecentCheckupsTable checkups={recentCheckups} showCompany />
            </div>
        </AppLayout>
    );
}
