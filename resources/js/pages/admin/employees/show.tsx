import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Employee, ExaminationProfile } from '@/types/medical';

type Props = {
    employee: Employee;
    examinationProfiles: ExaminationProfile[];
};

export default function EmployeeShow({ employee, examinationProfiles }: Props) {
    const [selectedProfileId, setSelectedProfileId] = useState<number | ''>('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Companies', href: '/admin/companies' },
        { title: employee.company?.name ?? 'Company', href: `/admin/companies/${employee.company_id}` },
        { title: employee.name, href: `/admin/employees/${employee.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employee.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">{employee.name}</h1>
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedProfileId}
                            onChange={(e) => setSelectedProfileId(e.target.value ? Number(e.target.value) : '')}
                            className="border-input flex h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                            <option value="">Select profile...</option>
                            {examinationProfiles.map((profile) => (
                                <option key={profile.id} value={profile.id}>
                                    {profile.name}
                                </option>
                            ))}
                        </select>
                        <Button asChild disabled={!selectedProfileId}>
                            {selectedProfileId ? (
                                <Link href={`/admin/checkups/create?employee_id=${employee.id}&examination_profile_id=${selectedProfileId}`}>
                                    New Checkup
                                </Link>
                            ) : (
                                <span>New Checkup</span>
                            )}
                        </Button>
                    </div>
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
                            <dd className="mt-1">{employee.date_of_birth ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                            <dd className="mt-1">{employee.phone ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                            <dd className="mt-1">{employee.email ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                            <dd className="mt-1">
                                {employee.company ? (
                                    <Link href={`/admin/companies/${employee.company.id}`} className="text-primary hover:underline">
                                        {employee.company.name}
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Checkup History */}
                <div className="rounded-xl border">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Checkup History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-t bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Date</th>
                                    <th className="px-6 py-3 text-left font-medium">Profile</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                    <th className="px-6 py-3 text-left font-medium">Notes</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(employee.checkups ?? []).map((checkup) => (
                                    <tr key={checkup.id} className="border-t">
                                        <td className="px-6 py-3">{checkup.checkup_date}</td>
                                        <td className="px-6 py-3">{checkup.examination_profile?.name ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <StatusBadge status={checkup.status} />
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">{checkup.notes ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/checkups/${checkup.id}`}>View</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {(employee.checkups ?? []).length === 0 && (
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
