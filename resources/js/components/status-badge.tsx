const styles = {
    pass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    fail: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
