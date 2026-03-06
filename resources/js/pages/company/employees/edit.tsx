import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Employee } from '@/types/medical';

type Props = {
    employee: Employee;
};

export default function EmployeesEdit({ employee }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Company Dashboard', href: '/company/dashboard' },
        { title: 'Employees', href: '/company/employees' },
        { title: employee.name, href: `/company/employees/${employee.id}` },
        { title: 'Edit', href: `/company/employees/${employee.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${employee.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Employee</h1>
                </div>

                <div className="max-w-2xl rounded-xl border p-6">
                    <Form method="put" action={`/company/employees/${employee.id}`} className="flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required defaultValue={employee.name} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="national_id">National ID</Label>
                                    <Input id="national_id" name="national_id" required defaultValue={employee.national_id} />
                                    <InputError message={errors.national_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        type="date"
                                        defaultValue={employee.date_of_birth || ''}
                                    />
                                    <InputError message={errors.date_of_birth} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" type="tel" defaultValue={employee.phone || ''} />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" defaultValue={employee.email || ''} />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Update Employee
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/company/employees">Cancel</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
