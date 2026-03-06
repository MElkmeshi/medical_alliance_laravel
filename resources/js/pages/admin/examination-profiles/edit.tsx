import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Examination, ExaminationProfile } from '@/types/medical';

type Props = {
    profile: ExaminationProfile;
    examinations: Examination[];
};

export default function ExaminationProfileEdit({ profile, examinations }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Examination Profiles', href: '/admin/examination-profiles' },
        { title: profile.name, href: `/admin/examination-profiles/${profile.id}` },
        { title: 'Edit', href: `/admin/examination-profiles/${profile.id}/edit` },
    ];

    const [selectedIds, setSelectedIds] = useState<number[]>(
        (profile.examinations ?? []).map((e) => e.id),
    );

    function toggleExam(id: number, checked: boolean) {
        setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((v) => v !== id)));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${profile.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-xl font-semibold tracking-tight">Edit Examination Profile</h1>

                <Form
                    action={`/admin/examination-profiles/${profile.id}`}
                    method="put"
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required defaultValue={profile.name} placeholder="Profile name" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    defaultValue={profile.description ?? ''}
                                    className="border-input placeholder:text-muted-foreground flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                    placeholder="Profile description"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox id="is_active" name="is_active" defaultChecked={profile.is_active} />
                                <Label htmlFor="is_active">Active</Label>
                                <InputError message={errors.is_active} />
                            </div>

                            <div className="grid gap-3">
                                <Label>Examinations</Label>
                                <div className="grid gap-2 rounded-md border p-4">
                                    {examinations.map((exam) => (
                                        <div key={exam.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`exam-${exam.id}`}
                                                checked={selectedIds.includes(exam.id)}
                                                onCheckedChange={(checked) => toggleExam(exam.id, checked === true)}
                                            />
                                            <Label htmlFor={`exam-${exam.id}`} className="font-normal">
                                                {exam.name}
                                                {exam.description && (
                                                    <span className="ml-1 text-muted-foreground">- {exam.description}</span>
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                    {examinations.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No examinations available.</p>
                                    )}
                                </div>
                                <InputError message={errors.examinations} />
                            </div>

                            {selectedIds.map((id) => (
                                <input key={id} type="hidden" name="examinations[]" value={id} />
                            ))}

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Update Profile
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/examination-profiles">Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
