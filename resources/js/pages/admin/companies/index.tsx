import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Company } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Companies', href: '/admin/companies' },
];

type Props = {
    companies: Company[];
};

export default function CompaniesIndex({ companies }: Props) {
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this company?')) {
            router.delete(`/admin/companies/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Companies</h1>
                    <Button asChild>
                        <Link href="/admin/companies/create">Create Company</Link>
                    </Button>
                </div>

                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Name</th>
                                    <th className="px-6 py-3 text-left font-medium">Contact</th>
                                    <th className="px-6 py-3 text-left font-medium">Email</th>
                                    <th className="px-6 py-3 text-left font-medium">Employees</th>
                                    <th className="px-6 py-3 text-left font-medium">Profiles</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company) => (
                                    <tr key={company.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">{company.name}</td>
                                        <td className="px-6 py-3">{company.contact_person ?? '-'}</td>
                                        <td className="px-6 py-3">{company.email ?? '-'}</td>
                                        <td className="px-6 py-3">{company.employees_count ?? 0}</td>
                                        <td className="px-6 py-3 text-muted-foreground">
                                            {(company.examination_profiles ?? []).map((p) => p.name).join(', ') || '-'}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/companies/${company.id}`}>View</Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/companies/${company.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(company.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {companies.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No companies yet.
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
