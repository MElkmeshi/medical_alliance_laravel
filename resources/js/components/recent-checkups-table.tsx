import { Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/utils';
import type { Checkup } from '@/types/medical';

type Props = {
    checkups: Checkup[];
    showCompany?: boolean;
    viewHref?: (checkup: Checkup) => string;
};

export function RecentCheckupsTable({ checkups, showCompany = false, viewHref }: Props) {
    const colSpan = 3 + (showCompany ? 1 : 0) + (viewHref ? 1 : 0) + 1; // Employee + optional Company + Profile + Date + Status + optional Actions

    return (
        <div className="rounded-xl border">
            <div className="p-6">
                <h2 className="text-lg font-semibold">Recent Checkups</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-t bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Employee</th>
                            {showCompany && <th className="px-6 py-3 text-left font-medium">Company</th>}
                            <th className="px-6 py-3 text-left font-medium">Profile</th>
                            <th className="px-6 py-3 text-left font-medium">Date</th>
                            <th className="px-6 py-3 text-left font-medium">Status</th>
                            {viewHref && <th className="px-6 py-3 text-left font-medium">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {checkups.map((checkup) => (
                            <tr key={checkup.id} className="border-t">
                                <td className="px-6 py-3">{checkup.employee?.name}</td>
                                {showCompany && <td className="px-6 py-3">{checkup.employee?.company?.name}</td>}
                                <td className="px-6 py-3">{checkup.examination_profile?.name}</td>
                                <td className="px-6 py-3">{formatDate(checkup.checkup_date)}</td>
                                <td className="px-6 py-3">
                                    <StatusBadge status={checkup.status} />
                                </td>
                                {viewHref && (
                                    <td className="px-6 py-3">
                                        <Link
                                            href={viewHref(checkup)}
                                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {checkups.length === 0 && (
                            <tr>
                                <td colSpan={colSpan} className="px-6 py-8 text-center text-muted-foreground">
                                    No checkups yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
