import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Examinations', href: '/admin/examinations' },
    { title: 'Create', href: '/admin/examinations/create' },
];

export default function ExaminationsCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Examination" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Create Examination</h1>
                </div>

                <div className="max-w-2xl rounded-xl border p-6">
                    <Form method="post" action="/admin/examinations" className="flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input id="unit" name="unit" placeholder="e.g., mg/dL, mmHg" />
                                    <InputError message={errors.unit} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="min_value">Min Value</Label>
                                        <Input id="min_value" name="min_value" type="number" step="any" />
                                        <InputError message={errors.min_value} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="max_value">Max Value</Label>
                                        <Input id="max_value" name="max_value" type="number" step="any" />
                                        <InputError message={errors.max_value} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="is_required" name="is_required" defaultChecked />
                                        <Label htmlFor="is_required">Required</Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="requires_document" name="requires_document" />
                                        <Label htmlFor="requires_document">Requires Document</Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="is_active" name="is_active" defaultChecked />
                                        <Label htmlFor="is_active">Active</Label>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Create Examination
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/examinations">Cancel</Link>
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
