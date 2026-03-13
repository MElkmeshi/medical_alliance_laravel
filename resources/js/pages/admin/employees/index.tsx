import { Head, Link, router } from '@inertiajs/react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Employee } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Employees', href: '/admin/employees' },
];

type PaginatedEmployees = {
    data: Employee[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
};

type Props = {
    employees: PaginatedEmployees;
    filters: { search?: string; company_id?: string };
};

export default function EmployeesIndex({ employees, filters }: Props) {
    function search(value: string) {
        router.get('/admin/employees', { ...filters, search: value || undefined }, { preserveState: true, replace: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Employees</h1>
                    <p className="text-sm text-muted-foreground">{employees.total} total</p>
                </div>

                <div className="max-w-sm">
                    <Input
                        placeholder="Search by name, ID, or GIN…"
                        defaultValue={filters.search ?? ''}
                        onChange={(e) => search(e.target.value)}
                    />
                </div>

                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Name</th>
                                    <th className="px-6 py-3 text-left font-medium">Company</th>
                                    <th className="px-6 py-3 text-left font-medium">GIN / Employee ID</th>
                                    <th className="px-6 py-3 text-left font-medium">National ID</th>
                                    <th className="px-6 py-3 text-left font-medium">Date of Birth</th>
                                    <th className="px-6 py-3 text-left font-medium">Job</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.data.map((employee) => (
                                    <tr key={employee.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">
                                            <Link href={`/admin/employees/${employee.id}`} className="hover:underline">
                                                {employee.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">
                                            {employee.company ? (
                                                <Link href={`/admin/companies/${employee.company.id}`} className="hover:underline">
                                                    {employee.company.name}
                                                </Link>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-3">{employee.company_employee_number ?? '-'}</td>
                                        <td className="px-6 py-3">{employee.national_id}</td>
                                        <td className="px-6 py-3">{formatDate(employee.date_of_birth)}</td>
                                        <td className="px-6 py-3 text-muted-foreground">{employee.job_description ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/employees/${employee.id}`}>View</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {employees.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                            No employees found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {employees.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-6 py-4">
                            <p className="text-sm text-muted-foreground">
                                Page {employees.current_page} of {employees.last_page}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={!employees.prev_page_url}
                                    onClick={() => employees.prev_page_url && router.get(employees.prev_page_url)}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" disabled={!employees.next_page_url}
                                    onClick={() => employees.next_page_url && router.get(employees.next_page_url)}>
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
