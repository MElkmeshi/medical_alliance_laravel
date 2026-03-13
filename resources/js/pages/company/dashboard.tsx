import { Head } from '@inertiajs/react';
import { RecentCheckupsTable } from '@/components/recent-checkups-table';
import { StatCard } from '@/components/stat-card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Checkup, Company } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Company Dashboard', href: '/company/dashboard' }];

type Props = {
    company: Company;
    employeesCount: number;
    recentCheckups: Checkup[];
};

export default function CompanyDashboard({ company, employeesCount, recentCheckups }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">{company.name}</h1>

                <div className="grid gap-4 md:grid-cols-2">
                    <StatCard label="Employees" value={employeesCount} />
                    <StatCard label="Recent Checkups" value={recentCheckups.length} />
                </div>

                <RecentCheckupsTable
                    checkups={recentCheckups}
                    viewHref={(checkup) => `/company/checkups/${checkup.id}`}
                />
            </div>
        </AppLayout>
    );
}
