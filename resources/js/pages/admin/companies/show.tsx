import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Company } from '@/types/medical';

type Props = {
    company: Company;
};

export default function CompanyShow({ company }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Companies', href: '/admin/companies' },
        { title: company.name, href: `/admin/companies/${company.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={company.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">{company.name}</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/companies/${company.id}/edit`}>Edit</Link>
                    </Button>
                </div>

                <div className="max-w-2xl rounded-xl border p-6">
                    <dl className="grid gap-4">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                            <dd className="mt-1">{company.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Contact Person</dt>
                            <dd className="mt-1">{company.contact_person ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                            <dd className="mt-1">{company.email ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                            <dd className="mt-1">{company.phone ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                            <dd className="mt-1 whitespace-pre-line">{company.address ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                            <dd className="mt-1">
                                <Badge variant={company.is_active ? 'default' : 'secondary'}>
                                    {company.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Assigned Profiles */}
                <div className="rounded-xl border">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Assigned Profiles</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-t bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Profile Name</th>
                                    <th className="px-6 py-3 text-left font-medium">Description</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(company.examination_profiles ?? []).map((profile) => (
                                    <tr key={profile.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">
                                            <Link href={`/admin/examination-profiles/${profile.id}`} className="text-primary hover:underline">
                                                {profile.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">{profile.description ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                                                {profile.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                                {(company.examination_profiles ?? []).length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                            No profiles assigned.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Employees */}
                <div className="rounded-xl border">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Employees</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-t bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Name</th>
                                    <th className="px-6 py-3 text-left font-medium">National ID</th>
                                    <th className="px-6 py-3 text-left font-medium">Phone</th>
                                    <th className="px-6 py-3 text-left font-medium">Email</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(company.employees ?? []).map((employee) => (
                                    <tr key={employee.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">
                                            <Link href={`/admin/employees/${employee.id}`} className="text-primary hover:underline">
                                                {employee.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3">{employee.national_id}</td>
                                        <td className="px-6 py-3">{employee.phone ?? '-'}</td>
                                        <td className="px-6 py-3">{employee.email ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/employees/${employee.id}`}>View</Link>
                                                </Button>
                                                {(company.examination_profiles ?? []).map((profile) => (
                                                    <Button key={profile.id} variant="outline" size="sm" asChild>
                                                        <Link href={`/admin/checkups/create?employee_id=${employee.id}&examination_profile_id=${profile.id}`}>
                                                            New Checkup ({profile.name})
                                                        </Link>
                                                    </Button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(company.employees ?? []).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No employees yet.
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
