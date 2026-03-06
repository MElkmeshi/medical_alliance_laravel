import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ExaminationProfile } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Examination Profiles', href: '/admin/examination-profiles' },
];

type Props = {
    profiles: ExaminationProfile[];
};

export default function ExaminationProfilesIndex({ profiles }: Props) {
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this profile?')) {
            router.delete(`/admin/examination-profiles/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Examination Profiles" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Examination Profiles</h1>
                    <Button asChild>
                        <Link href="/admin/examination-profiles/create">Create Profile</Link>
                    </Button>
                </div>

                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Name</th>
                                    <th className="px-6 py-3 text-left font-medium">Description</th>
                                    <th className="px-6 py-3 text-left font-medium">Exams Count</th>
                                    <th className="px-6 py-3 text-left font-medium">Active</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">{profile.name}</td>
                                        <td className="px-6 py-3 text-muted-foreground">{profile.description ?? '-'}</td>
                                        <td className="px-6 py-3">{profile.examinations_count ?? 0}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                                                {profile.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/examination-profiles/${profile.id}`}>View</Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/examination-profiles/${profile.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(profile.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {profiles.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No examination profiles yet.
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
