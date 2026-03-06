import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Employee } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Company Dashboard', href: '/company/dashboard' },
    { title: 'Employees', href: '/company/employees' },
];

type Props = {
    employees: Employee[];
};

export default function EmployeesIndex({ employees }: Props) {
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(`/company/employees/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Employees</h1>
                    <Button asChild>
                        <Link href="/company/employees/create">Add Employee</Link>
                    </Button>
                </div>

                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Name</th>
                                    <th className="px-6 py-3 text-left font-medium">National ID</th>
                                    <th className="px-6 py-3 text-left font-medium">Date of Birth</th>
                                    <th className="px-6 py-3 text-left font-medium">Phone</th>
                                    <th className="px-6 py-3 text-left font-medium">Email</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">{employee.name}</td>
                                        <td className="px-6 py-3">{employee.national_id}</td>
                                        <td className="px-6 py-3">{employee.date_of_birth || '-'}</td>
                                        <td className="px-6 py-3">{employee.phone || '-'}</td>
                                        <td className="px-6 py-3">{employee.email || '-'}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/company/employees/${employee.id}`}>View</Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/company/employees/${employee.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(employee.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No employees found.
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
