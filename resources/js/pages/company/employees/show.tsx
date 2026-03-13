import { Head, Link, useForm } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Employee, ExaminationProfile } from '@/types/medical';

type Props = {
    employee: Employee;
    examinationProfiles: Pick<ExaminationProfile, 'id' | 'name'>[];
};

export default function EmployeesShow({ employee, examinationProfiles }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Company Dashboard', href: '/company/dashboard' },
        { title: 'Employees', href: '/company/employees' },
        { title: employee.name, href: `/company/employees/${employee.id}` },
    ];

    const form = useForm({
        employee_id: employee.id,
        examination_profile_id: '',
        checkup_date: new Date().toISOString().split('T')[0],
        exam_type: '',
        job_environment: '',
        notes: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/company/checkups');
    }

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
                    <dl className="grid gap-4 sm:grid-cols-2">
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
                            <dt className="text-sm font-medium text-muted-foreground">Sex</dt>
                            <dd className="mt-1 capitalize">{employee.sex || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Nationality</dt>
                            <dd className="mt-1">{employee.nationality || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                            <dd className="mt-1">{employee.phone || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                            <dd className="mt-1">{employee.email || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Job Description</dt>
                            <dd className="mt-1">{employee.job_description || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Job Location</dt>
                            <dd className="mt-1">{employee.job_location || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Employee Number</dt>
                            <dd className="mt-1">{employee.company_employee_number || '-'}</dd>
                        </div>
                    </dl>
                </div>

                {/* Request Checkup */}
                <div className="max-w-2xl rounded-xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">Request Checkup</h2>
                    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="examination_profile_id">Examination Profile *</Label>
                            <Select
                                value={form.data.examination_profile_id}
                                onValueChange={(v) => form.setData('examination_profile_id', v)}
                            >
                                <SelectTrigger id="examination_profile_id">
                                    <SelectValue placeholder="Select profile" />
                                </SelectTrigger>
                                <SelectContent>
                                    {examinationProfiles.map((profile) => (
                                        <SelectItem key={profile.id} value={String(profile.id)}>
                                            {profile.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.examination_profile_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="checkup_date">Checkup Date *</Label>
                            <Input
                                id="checkup_date"
                                type="date"
                                value={form.data.checkup_date}
                                onChange={(e) => form.setData('checkup_date', e.target.value)}
                                required
                            />
                            <InputError message={form.errors.checkup_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="exam_type">Exam Type</Label>
                            <Select
                                value={form.data.exam_type}
                                onValueChange={(v) => form.setData('exam_type', v)}
                            >
                                <SelectTrigger id="exam_type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pre_employment">Pre-Employment</SelectItem>
                                    <SelectItem value="periodic">Periodic</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.exam_type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="job_environment">Job Environment</Label>
                            <Select
                                value={form.data.job_environment}
                                onValueChange={(v) => form.setData('job_environment', v)}
                            >
                                <SelectTrigger id="job_environment">
                                    <SelectValue placeholder="Select environment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="office">Office</SelectItem>
                                    <SelectItem value="rig_field">Rig / Field</SelectItem>
                                    <SelectItem value="workshop_laboratory">Workshop / Laboratory</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.job_environment} />
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                placeholder="Optional notes"
                            />
                            <InputError message={form.errors.notes} />
                        </div>

                        <div className="sm:col-span-2">
                            <Button type="submit" disabled={form.processing || !form.data.examination_profile_id}>
                                Submit Checkup Request
                            </Button>
                        </div>
                    </form>
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
