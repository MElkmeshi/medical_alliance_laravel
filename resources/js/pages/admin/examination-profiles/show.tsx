import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ExaminationProfile } from '@/types/medical';

type Props = {
    profile: ExaminationProfile;
};

export default function ExaminationProfileShow({ profile }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Examination Profiles', href: '/admin/examination-profiles' },
        { title: profile.name, href: `/admin/examination-profiles/${profile.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={profile.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">{profile.name}</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/examination-profiles/${profile.id}/edit`}>Edit</Link>
                    </Button>
                </div>

                <div className="max-w-2xl rounded-xl border p-6">
                    <dl className="grid gap-4">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                            <dd className="mt-1">{profile.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                            <dd className="mt-1">{profile.description ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                            <dd className="mt-1">
                                <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                                    {profile.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-xl border">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Examinations</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-t bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">#</th>
                                    <th className="px-6 py-3 text-left font-medium">Name</th>
                                    <th className="px-6 py-3 text-left font-medium">Description</th>
                                    <th className="px-6 py-3 text-left font-medium">Unit</th>
                                    <th className="px-6 py-3 text-left font-medium">Required</th>
                                    <th className="px-6 py-3 text-left font-medium">Requires Document</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(profile.examinations ?? []).map((exam, index) => (
                                    <tr key={exam.id} className="border-t">
                                        <td className="px-6 py-3">{exam.pivot?.sort_order ?? index + 1}</td>
                                        <td className="px-6 py-3 font-medium">{exam.name}</td>
                                        <td className="px-6 py-3 text-muted-foreground">{exam.description ?? '-'}</td>
                                        <td className="px-6 py-3">{exam.unit ?? '-'}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant={exam.is_required ? 'default' : 'secondary'}>
                                                {exam.is_required ? 'Yes' : 'No'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge variant={exam.requires_document ? 'default' : 'secondary'}>
                                                {exam.requires_document ? 'Yes' : 'No'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                                {(profile.examinations ?? []).length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No examinations assigned.
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
