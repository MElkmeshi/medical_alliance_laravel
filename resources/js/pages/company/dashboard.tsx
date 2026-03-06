import { Head, Link } from '@inertiajs/react';
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
                    <div className="rounded-xl border p-6">
                        <h3 className="text-sm font-medium text-muted-foreground">Employees</h3>
                        <p className="mt-2 text-3xl font-bold">{employeesCount}</p>
                    </div>
                    <div className="rounded-xl border p-6">
                        <h3 className="text-sm font-medium text-muted-foreground">Recent Checkups</h3>
                        <p className="mt-2 text-3xl font-bold">{recentCheckups.length}</p>
                    </div>
                </div>

                <div className="rounded-xl border">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Recent Checkups</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-t bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Employee</th>
                                    <th className="px-6 py-3 text-left font-medium">Profile</th>
                                    <th className="px-6 py-3 text-left font-medium">Date</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCheckups.map((checkup) => (
                                    <tr key={checkup.id} className="border-t">
                                        <td className="px-6 py-3">{checkup.employee?.name}</td>
                                        <td className="px-6 py-3">{checkup.examination_profile?.name}</td>
                                        <td className="px-6 py-3">{checkup.checkup_date}</td>
                                        <td className="px-6 py-3">
                                            <StatusBadge status={checkup.status} />
                                        </td>
                                        <td className="px-6 py-3">
                                            <Link
                                                href={`/company/checkups/${checkup.id}`}
                                                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {recentCheckups.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No checkups yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        fail: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
