import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import type { Examination } from '@/types/medical';

export type ResultData = {
    examination_id: number;
    value: string;
    is_normal: string;
    document: File | null;
    notes: string;
};

export function hasRange(exam: Examination): boolean {
    return exam.min_value !== null || exam.max_value !== null;
}

export function isQualitative(exam: Examination): boolean {
    return !exam.unit && !hasRange(exam);
}

export function computeIsNormal(exam: Examination, value: string): 'normal' | 'abnormal' | 'pending' {
    if (!value.trim()) return 'pending';
    const num = parseFloat(value);
    if (isNaN(num)) return 'pending';
    if (exam.min_value !== null && num < parseFloat(exam.min_value)) return 'abnormal';
    if (exam.max_value !== null && num > parseFloat(exam.max_value)) return 'abnormal';
    return 'normal';
}

export function boolToStatus(isNormal: boolean | null): string {
    if (isNormal === true) return 'normal';
    if (isNormal === false) return 'abnormal';
    return 'pending';
}

export function ResultBadge({ status }: { status: string }) {
    if (status === 'normal') {
        return (
            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                Normal
            </span>
        );
    }
    if (status === 'abnormal') {
        return (
            <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                Abnormal
            </span>
        );
    }
    return (
        <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            Pending
        </span>
    );
}

type Props = {
    examinations: Examination[];
    results: ResultData[];
    errors: Record<string, string>;
    onUpdate: (index: number, field: keyof ResultData, value: string | File | null) => void;
};

export function CheckupResultsTable({ examinations, results, errors, onUpdate }: Props) {
    return (
        <div className="rounded-xl border">
            <div className="p-6">
                <h2 className="text-lg font-semibold">Examination Results</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Results with a reference range are evaluated automatically. Others require manual selection.
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-t bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Examination</th>
                            <th className="px-4 py-3 text-left font-medium">Value</th>
                            <th className="px-4 py-3 text-left font-medium">Result</th>
                            <th className="px-4 py-3 text-left font-medium">Document</th>
                            <th className="px-4 py-3 text-left font-medium">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examinations.map((exam, index) => (
                            <tr key={exam.id} className="border-t">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{exam.name}</div>
                                    {exam.unit && (
                                        <div className="text-xs text-muted-foreground">Unit: {exam.unit}</div>
                                    )}
                                    {hasRange(exam) && (
                                        <div className="text-xs text-muted-foreground">
                                            Range: {exam.min_value ?? '—'} – {exam.max_value ?? '—'}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {isQualitative(exam) ? (
                                        <span className="text-muted-foreground">—</span>
                                    ) : (
                                        <>
                                            <Input
                                                value={results[index]?.value ?? ''}
                                                onChange={(e) => onUpdate(index, 'value', e.target.value)}
                                                placeholder="Enter value"
                                                className="w-32"
                                            />
                                            <InputError message={errors[`results.${index}.value`]} />
                                        </>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {isQualitative(exam) ? (
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => onUpdate(index, 'is_normal', 'normal')}
                                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                    results[index]?.is_normal === 'normal'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-muted text-muted-foreground hover:bg-green-50 hover:text-green-700'
                                                }`}
                                            >
                                                Normal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onUpdate(index, 'is_normal', 'abnormal')}
                                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                    results[index]?.is_normal === 'abnormal'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                        : 'bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-700'
                                                }`}
                                            >
                                                Abnormal
                                            </button>
                                        </div>
                                    ) : hasRange(exam) ? (
                                        <ResultBadge status={results[index]?.is_normal ?? 'pending'} />
                                    ) : (
                                        <select
                                            value={results[index]?.is_normal ?? 'pending'}
                                            onChange={(e) => onUpdate(index, 'is_normal', e.target.value)}
                                            className="border-input flex h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="normal">Normal</option>
                                            <option value="abnormal">Abnormal</option>
                                        </select>
                                    )}
                                    <InputError message={errors[`results.${index}.is_normal`]} />
                                </td>
                                <td className="px-4 py-3">
                                    {exam.requires_document ? (
                                        <>
                                            <Input
                                                type="file"
                                                onChange={(e) => onUpdate(index, 'document', e.target.files?.[0] ?? null)}
                                                className="w-40"
                                            />
                                            <InputError message={errors[`results.${index}.document`]} />
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <Input
                                        value={results[index]?.notes ?? ''}
                                        onChange={(e) => onUpdate(index, 'notes', e.target.value)}
                                        placeholder="Notes"
                                        className="w-40"
                                    />
                                </td>
                            </tr>
                        ))}
                        {examinations.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                    No examinations in this profile.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
