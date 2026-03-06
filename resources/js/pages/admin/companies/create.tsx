import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
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

                            <div className="grid gap-3">
                                <Label>Examination Profiles</Label>
                                <div className="grid gap-2 rounded-md border p-4">
                                    {examinationProfiles.map((profile) => (
                                        <div key={profile.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`profile-${profile.id}`}
                                                name="examination_profiles[]"
                                                value={String(profile.id)}
                                            />
                                            <Label htmlFor={`profile-${profile.id}`} className="font-normal">
                                                {profile.name}
                                                {profile.description && (
                                                    <span className="ml-1 text-muted-foreground">- {profile.description}</span>
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                    {examinationProfiles.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No examination profiles available.</p>
                                    )}
                                </div>
                                <InputError message={errors.examination_profiles} />
                            </div>

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
