import { Head, Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Checkup } from '@/types/medical';

type Props = {
    checkup: Checkup;
};

export default function CheckupShow({ checkup }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Companies', href: '/admin/companies' },
        { title: checkup.employee?.company?.name ?? 'Company', href: `/admin/companies/${checkup.employee?.company_id}` },
        { title: checkup.employee?.name ?? 'Employee', href: `/admin/employees/${checkup.employee_id}` },
        { title: `Checkup #${checkup.id}`, href: `/admin/checkups/${checkup.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Checkup #${checkup.id}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Checkup #{checkup.id}</h1>
                    <div className="flex gap-2">
                        {checkup.status === 'pending' && (
                            <Button asChild>
                                <Link href={`/admin/checkups/${checkup.id}/edit`}>Start Checkup</Link>
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href={`/admin/employees/${checkup.employee_id}`}>Back to Employee</Link>
                        </Button>
                    </div>
                </div>

                {/* Checkup Details */}
                <div className="max-w-2xl rounded-xl border p-6">
                    <dl className="grid gap-4">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Employee</dt>
                            <dd className="mt-1">
                                <Link href={`/admin/employees/${checkup.employee_id}`} className="text-primary hover:underline">
                                    {checkup.employee?.name ?? '-'}
                                </Link>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                            <dd className="mt-1">
                                {checkup.employee?.company ? (
                                    <Link href={`/admin/companies/${checkup.employee.company.id}`} className="text-primary hover:underline">
                                        {checkup.employee.company.name}
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Examination Profile</dt>
                            <dd className="mt-1">
                                {checkup.examination_profile ? (
                                    <Link href={`/admin/examination-profiles/${checkup.examination_profile.id}`} className="text-primary hover:underline">
                                        {checkup.examination_profile.name}
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Checkup Date</dt>
                            <dd className="mt-1">{checkup.checkup_date}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                            <dd className="mt-1">
                                <StatusBadge status={checkup.status} />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Performed By</dt>
                            <dd className="mt-1">{checkup.performer?.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                            <dd className="mt-1 whitespace-pre-line">{checkup.notes ?? '-'}</dd>
                        </div>
                    </dl>
                </div>

                {/* Results Table */}
                <div className="rounded-xl border">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Results</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-t bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Examination</th>
                                    <th className="px-6 py-3 text-left font-medium">Value</th>
                                    <th className="px-6 py-3 text-left font-medium">Result</th>
                                    <th className="px-6 py-3 text-left font-medium">Document</th>
                                    <th className="px-6 py-3 text-left font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(checkup.results ?? []).map((result) => (
                                    <tr key={result.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">{result.examination?.name ?? '-'}</td>
                                        <td className="px-6 py-3">{result.value ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <ResultBadge isNormal={result.is_normal} />
                                        </td>
                                        <td className="px-6 py-3">
                                            {result.document_path ? (
                                                <a
                                                    href={`/storage/${result.document_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    View Document
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">{result.notes ?? '-'}</td>
                                    </tr>
                                ))}
                                {(checkup.results ?? []).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No results recorded.
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

function ResultBadge({ isNormal }: { isNormal: boolean | null }) {
    if (isNormal === null) {
        return (
            <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Pending
            </span>
        );
    }
    if (isNormal) {
        return (
            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                Normal
            </span>
        );
    }
    return (
        <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
            Abnormal
        </span>
    );
}
