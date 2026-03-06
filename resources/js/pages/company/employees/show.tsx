import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Employee } from '@/types/medical';

type Props = {
    employee: Employee;
};

export default function EmployeesShow({ employee }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Company Dashboard', href: '/company/dashboard' },
        { title: 'Employees', href: '/company/employees' },
        { title: employee.name, href: `/company/employees/${employee.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employee.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{employee.name}</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/company/employees/${employee.id}/edit`}>Edit</Link>
                    </Button>
                </div>

                <div className="max-w-2xl rounded-xl border p-6">
                    <dl className="grid gap-4">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                            <dd className="mt-1">{employee.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">National ID</dt>
                            <dd className="mt-1">{employee.national_id}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                            <dd className="mt-1">{employee.date_of_birth || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                            <dd className="mt-1">{employee.phone || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                            <dd className="mt-1">{employee.email || '-'}</dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-xl border">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Checkup History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-t bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Profile</th>
                                    <th className="px-6 py-3 text-left font-medium">Date</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employee.checkups?.map((checkup) => (
                                    <tr key={checkup.id} className="border-t">
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
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {(!employee.checkups || employee.checkups.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                            No checkups found.
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
