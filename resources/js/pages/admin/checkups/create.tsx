import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Employee, ExaminationProfile } from '@/types/medical';

type ResultData = {
    examination_id: number;
    value: string;
    is_normal: string;
    document: File | null;
    notes: string;
};

type FormData = {
    employee_id: number;
    examination_profile_id: number;
    checkup_date: string;
    notes: string;
    results: ResultData[];
};

type Props = {
    employee: Employee;
    examinationProfile: ExaminationProfile;
};

export default function CheckupCreate({ employee, examinationProfile }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Companies', href: '/admin/companies' },
        { title: employee.company?.name ?? 'Company', href: `/admin/companies/${employee.company_id}` },
        { title: employee.name, href: `/admin/employees/${employee.id}` },
        { title: 'New Checkup', href: `/admin/checkups/create?employee_id=${employee.id}&examination_profile_id=${examinationProfile.id}` },
    ];

    const examinations = examinationProfile.examinations ?? [];

    const form = useForm<FormData>({
        employee_id: employee.id,
        examination_profile_id: examinationProfile.id,
        checkup_date: new Date().toISOString().split('T')[0],
        notes: '',
        results: examinations.map((exam) => ({
            examination_id: exam.id,
            value: '',
            is_normal: 'pending',
            document: null,
            notes: '',
        })),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/admin/checkups', {
            forceFormData: true,
        });
    }

    function updateResult(index: number, field: keyof ResultData, value: string | File | null) {
        const updatedResults = [...form.data.results];
        updatedResults[index] = { ...updatedResults[index], [field]: value };
        form.setData('results', updatedResults);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Checkup" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-xl font-semibold tracking-tight">New Checkup</h1>

                {/* Employee Info */}
                <div className="max-w-4xl rounded-xl border p-6">
                    <dl className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Employee</dt>
                            <dd className="mt-1 font-medium">{employee.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                            <dd className="mt-1">{employee.company?.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Profile</dt>
                            <dd className="mt-1">{examinationProfile.name}</dd>
                        </div>
                    </dl>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="checkup_date">Checkup Date</Label>
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
                            <Label htmlFor="notes">General Notes</Label>
                            <Input
                                id="notes"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                placeholder="Optional notes"
                            />
                            <InputError message={form.errors.notes} />
                        </div>
                    </div>

                    {/* Examination Results */}
                    <div className="rounded-xl border">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold">Examination Results</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-t bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Examination</th>
                                        <th className="px-4 py-3 text-left font-medium">Value</th>
                                        <th className="px-4 py-3 text-left font-medium">Result</th>
                                        <th className="px-4 py-3 text-left font-medium">Document</th>
                                        <th className="px-4 py-3 text-left font-medium">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examinations.map((exam, index) => (
                                        <tr key={exam.id} className="border-t">
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{exam.name}</div>
                                                {exam.unit && (
                                                    <div className="text-xs text-muted-foreground">Unit: {exam.unit}</div>
                                                )}
                                                {(exam.min_value || exam.max_value) && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Range: {exam.min_value ?? '?'} - {exam.max_value ?? '?'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Input
                                                    value={form.data.results[index]?.value ?? ''}
                                                    onChange={(e) => updateResult(index, 'value', e.target.value)}
                                                    placeholder="Enter value"
                                                    className="w-32"
                                                />
                                                <InputError message={(form.errors as Record<string, string>)[`results.${index}.value`]} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={form.data.results[index]?.is_normal ?? 'pending'}
                                                    onChange={(e) => updateResult(index, 'is_normal', e.target.value)}
                                                    className="border-input flex h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="normal">Normal</option>
                                                    <option value="abnormal">Abnormal</option>
                                                </select>
                                                <InputError message={(form.errors as Record<string, string>)[`results.${index}.is_normal`]} />
                                            </td>
                                            <td className="px-4 py-3">
                                                {exam.requires_document ? (
                                                    <>
                                                        <Input
                                                            type="file"
                                                            onChange={(e) =>
                                                                updateResult(index, 'document', e.target.files?.[0] ?? null)
                                                            }
                                                            className="w-40"
                                                        />
                                                        <InputError message={(form.errors as Record<string, string>)[`results.${index}.document`]} />
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Input
                                                    value={form.data.results[index]?.notes ?? ''}
                                                    onChange={(e) => updateResult(index, 'notes', e.target.value)}
                                                    placeholder="Notes"
                                                    className="w-40"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {examinations.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No examinations in this profile.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={form.processing}>
                            Create Checkup
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/admin/employees/${employee.id}`}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
