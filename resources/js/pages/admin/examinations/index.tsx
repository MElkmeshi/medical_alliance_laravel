import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Examination } from '@/types/medical';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Examinations', href: '/admin/examinations' },
];

type Props = {
    examinations: Examination[];
};

export default function ExaminationsIndex({ examinations }: Props) {
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this examination?')) {
            router.delete(`/admin/examinations/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Examinations" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Examinations</h1>
                    <Button asChild>
                        <Link href="/admin/examinations/create">Create Examination</Link>
                    </Button>
                </div>

                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Name</th>
                                    <th className="px-6 py-3 text-left font-medium">Unit</th>
                                    <th className="px-6 py-3 text-left font-medium">Range</th>
                                    <th className="px-6 py-3 text-left font-medium">Required</th>
                                    <th className="px-6 py-3 text-left font-medium">Document</th>
                                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examinations.map((examination) => (
                                    <tr key={examination.id} className="border-t">
                                        <td className="px-6 py-3 font-medium">{examination.name}</td>
                                        <td className="px-6 py-3">{examination.unit || '-'}</td>
                                        <td className="px-6 py-3">
                                            {examination.min_value || examination.max_value
                                                ? `${examination.min_value ?? '-'} - ${examination.max_value ?? '-'}`
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge variant={examination.is_required ? 'default' : 'secondary'}>
                                                {examination.is_required ? 'Yes' : 'No'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge variant={examination.requires_document ? 'default' : 'secondary'}>
                                                {examination.requires_document ? 'Yes' : 'No'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/examinations/${examination.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(examination.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {examinations.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No examinations found.
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
