import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Company Dashboard', href: '/company/dashboard' },
    { title: 'Employees', href: '/company/employees' },
    { title: 'Add Employee', href: '/company/employees/create' },
];

export default function EmployeesCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Employee" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Add Employee</h1>
                </div>

                <div className="max-w-2xl rounded-xl border p-6">
                    <Form method="post" action="/company/employees" className="flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <p className="text-sm font-medium text-muted-foreground">Personal Information</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input id="name" name="name" required />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="sex">Sex</Label>
                                        <Select name="sex">
                                            <SelectTrigger id="sex">
                                                <SelectValue placeholder="Select sex" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.sex} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                                        <Input id="date_of_birth" name="date_of_birth" type="date" />
                                        <InputError message={errors.date_of_birth} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="nationality">Nationality</Label>
                                        <Input id="nationality" name="nationality" />
                                        <InputError message={errors.nationality} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="national_id">ID / Passport Number *</Label>
                                    <Input id="national_id" name="national_id" required />
                                    <InputError message={errors.national_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="home_address">Home Address</Label>
                                    <Input id="home_address" name="home_address" />
                                    <InputError message={errors.home_address} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" name="phone" type="tel" />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-muted-foreground">Employment Information</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="company_employee_number">Employee ID / GIN</Label>
                                        <Input id="company_employee_number" name="company_employee_number" />
                                        <InputError message={errors.company_employee_number} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="job_location">Job Location (Country)</Label>
                                        <Input id="job_location" name="job_location" />
                                        <InputError message={errors.job_location} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="job_description">Job Description</Label>
                                    <Input id="job_description" name="job_description" />
                                    <InputError message={errors.job_description} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Add Employee
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
