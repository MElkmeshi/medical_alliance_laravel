import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { MultiSelect } from '@/components/multi-select';
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

    const examOptions = examinations.map((e) => ({ value: e.id, label: e.name, description: e.description }));

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

                            <div className="grid gap-2">
                                <Label>Examinations</Label>
                                <MultiSelect
                                    options={examOptions}
                                    selected={selectedIds}
                                    onChange={setSelectedIds}
                                    placeholder="Search examinations..."
                                    emptyMessage="No examinations found."
                                />
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
