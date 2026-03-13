import { Head, Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Checkup } from '@/types/medical';

type Props = {
    checkup: Checkup;
};

export default function CheckupsShow({ checkup }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Company Dashboard', href: '/company/dashboard' },
        { title: 'Employees', href: '/company/employees' },
        { title: checkup.employee?.name || 'Employee', href: `/company/employees/${checkup.employee_id}` },
        { title: `Checkup - ${formatDate(checkup.checkup_date)}`, href: `/company/checkups/${checkup.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Checkup - ${formatDate(checkup.checkup_date)}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Checkup Details</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/company/employees/${checkup.employee_id}`}>Back to Employee</Link>
                    </Button>
                </div>

                <div className="max-w-4xl rounded-xl border p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Employee</dt>
                            <dd className="mt-1">{checkup.employee?.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Examination Profile</dt>
                            <dd className="mt-1">{checkup.examination_profile?.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                            <dd className="mt-1">{formatDate(checkup.checkup_date)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                            <dd className="mt-1">
                                <StatusBadge status={checkup.status} />
                            </dd>
                        </div>
                        {checkup.notes && (
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                                <dd className="mt-1">{checkup.notes}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                <div className="max-w-4xl rounded-xl border">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Results</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-t bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Examination</th>
                                    <th className="px-6 py-3 text-left font-medium">Value</th>
                                    <th className="px-6 py-3 text-left font-medium">Reference Range</th>
                                    <th className="px-6 py-3 text-left font-medium">Result</th>
                                    <th className="px-6 py-3 text-left font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checkup.results?.map((result) => (
                                    <tr key={result.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">{result.examination?.name}</td>
                                        <td className="px-6 py-3">
                                            {result.value || '-'}
                                            {result.value && result.examination?.unit && (
                                                <span className="ml-1 text-muted-foreground">{result.examination.unit}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">
                                            {result.examination?.min_value || result.examination?.max_value
                                                ? `${result.examination.min_value ?? '-'} - ${result.examination.max_value ?? '-'}`
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-3">
                                            {result.is_normal === null ? (
                                                <Badge variant="secondary">Pending</Badge>
                                            ) : result.is_normal ? (
                                                <Badge variant="default">Normal</Badge>
                                            ) : (
                                                <Badge variant="destructive">Abnormal</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">{result.notes || '-'}</td>
                                    </tr>
                                ))}
                                {(!checkup.results || checkup.results.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No results recorded yet.
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
