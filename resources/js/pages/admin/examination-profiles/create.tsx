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
import type { Examination } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Examination Profiles', href: '/admin/examination-profiles' },
    { title: 'Create Profile', href: '/admin/examination-profiles/create' },
];

type Props = {
    examinations: Examination[];
};

export default function ExaminationProfileCreate({ examinations }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const examOptions = examinations.map((e) => ({ value: e.id, label: e.name, description: e.description }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Examination Profile" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-xl font-semibold tracking-tight">Create Examination Profile</h1>

                <Form
                    action="/admin/examination-profiles"
                    method="post"
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required placeholder="Profile name" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="border-input placeholder:text-muted-foreground flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                    placeholder="Profile description"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox id="is_active" name="is_active" defaultChecked />
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
                                    Create Profile
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
