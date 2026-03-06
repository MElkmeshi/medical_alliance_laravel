import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
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

                            <div className="grid gap-3">
                                <Label>Examinations</Label>
                                <div className="grid gap-2 rounded-md border p-4">
                                    {examinations.map((exam) => (
                                        <div key={exam.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`exam-${exam.id}`}
                                                name="examinations[]"
                                                value={String(exam.id)}
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
