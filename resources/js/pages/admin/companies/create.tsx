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
import type { ExaminationProfile } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Companies', href: '/admin/companies' },
    { title: 'Create Company', href: '/admin/companies/create' },
];

type Props = {
    examinationProfiles: ExaminationProfile[];
};

export default function CompanyCreate({ examinationProfiles }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const profileOptions = examinationProfiles.map((p) => ({ value: p.id, label: p.name, description: p.description }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Company" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-xl font-semibold tracking-tight">Create Company</h1>

                <Form
                    action="/admin/companies"
                    method="post"
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required placeholder="Company name" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contact_person">Contact Person</Label>
                                <Input id="contact_person" name="contact_person" placeholder="Contact person name" />
                                <InputError message={errors.contact_person} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="company@example.com" />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" placeholder="Phone number" />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    className="border-input placeholder:text-muted-foreground flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                    placeholder="Company address"
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox id="is_active" name="is_active" defaultChecked />
                                <Label htmlFor="is_active">Active</Label>
                                <InputError message={errors.is_active} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Examination Profiles</Label>
                                <MultiSelect
                                    options={profileOptions}
                                    selected={selectedIds}
                                    onChange={setSelectedIds}
                                    placeholder="Search examination profiles..."
                                    emptyMessage="No examination profiles found."
                                />
                                <InputError message={errors.examination_profiles} />
                            </div>

                            {selectedIds.map((id) => (
                                <input key={id} type="hidden" name="examination_profiles[]" value={id} />
                            ))}

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Create Company
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/companies">Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
