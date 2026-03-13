type Props = {
    label: string;
    value: number;
    href?: string;
};

export function StatCard({ label, value, href }: Props) {
    const content = (
        <>
            <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </>
    );

    if (href) {
        return (
            <a href={href} className="block rounded-xl border p-6 transition-colors hover:bg-muted/50">
                {content}
            </a>
        );
    }

    return <div className="rounded-xl border p-6">{content}</div>;
}
