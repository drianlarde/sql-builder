import { cn } from '@/lib/utils';
import * as React from 'react';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onShow?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, startIcon, endIcon, onShow, ...props }, ref) => {
        return (
            <div
                className={cn(
                    'flex h-full items-center rounded-md border border-input bg-white text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring overflow-hidden',
                    className,
                )}
            >
                {startIcon && (
                    <span className="pl-3 cursor-pointer">{startIcon}</span>
                )}
                <input
                    type={type}
                    className="flex-1 p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    ref={ref}
                    {...props}
                />
                {endIcon && (
                    <span onClick={onShow} className="pr-3 cursor-pointer">
                        {endIcon}
                    </span>
                )}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
