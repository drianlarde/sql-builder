import { cn } from '@/lib/utils';

export default function Container({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                // 'container mx-auto px-10 md:px-20 lg:px-40 xl:px-96',
                'container mx-auto px-6 md:px-40',
                className,
            )}
        >
            {children}
        </div>
    );
}
