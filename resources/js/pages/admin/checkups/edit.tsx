import { Head, Link, useForm } from '@inertiajs/react';
import { CheckupResultsTable, boolToStatus, computeIsNormal, hasRange } from '@/components/checkup-results-table';
import type { ResultData } from '@/components/checkup-results-table';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Checkup, Examination } from '@/types/medical';

type FormData = {
    checkup_date: string;
    notes: string;
    results: ResultData[];
};

type Props = {
    checkup: Checkup;
};

export default function CheckupEdit({ checkup }: Props) {
    const employee = checkup.employee!;
    const examinationProfile = checkup.examination_profile!;
    const examinations: Examination[] = examinationProfile.examinations ?? [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Checkups', href: '/admin/checkups' },
        { title: `Checkup #${checkup.id}`, href: `/admin/checkups/${checkup.id}` },
        { title: 'Fill Results', href: `/admin/checkups/${checkup.id}/edit` },
    ];

    const existingResults = Object.fromEntries(
        (checkup.results ?? []).map((r) => [r.examination_id, r]),
    );

    const form = useForm<FormData>({
        checkup_date: checkup.checkup_date,
        notes: checkup.notes ?? '',
        results: examinations.map((exam) => {
            const existing = existingResults[exam.id];
            return {
                examination_id: exam.id,
                value: existing?.value ?? '',
                is_normal: existing ? boolToStatus(existing.is_normal) : 'pending',
                document: null,
                notes: existing?.notes ?? '',
            };
        }),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.put(`/admin/checkups/${checkup.id}`, { forceFormData: true });
    }

    function updateResult(index: number, field: keyof ResultData, value: string | File | null) {
        const updatedResults = [...form.data.results];
        updatedResults[index] = { ...updatedResults[index], [field]: value };

        if (field === 'value' && typeof value === 'string') {
            const exam = examinations[index];
            if (hasRange(exam)) {
                updatedResults[index].is_normal = computeIsNormal(exam, value);
            }
        }

        form.setData('results', updatedResults);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Fill Results — Checkup #${checkup.id}`} />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-xl font-semibold tracking-tight">Fill Results — Checkup #{checkup.id}</h1>

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

                    <CheckupResultsTable
                        examinations={examinations}
                        results={form.data.results}
                        errors={form.errors as Record<string, string>}
                        onUpdate={updateResult}
                    />

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={form.processing}>
                            Save Results
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/admin/checkups/${checkup.id}`}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
