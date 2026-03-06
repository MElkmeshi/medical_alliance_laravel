import { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type MultiSelectOption = {
    value: number;
    label: string;
    description?: string | null;
};

type Props = {
    options: MultiSelectOption[];
    selected: number[];
    onChange: (selected: number[]) => void;
    placeholder?: string;
    emptyMessage?: string;
};

export function MultiSelect({ options, selected, onChange, placeholder = 'Select items...', emptyMessage = 'No items found.' }: Props) {
    const [open, setOpen] = useState(false);

    function toggle(value: number) {
        onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    }

    function remove(value: number) {
        onChange(selected.filter((v) => v !== value));
    }

    const selectedOptions = options.filter((o) => selected.includes(o.value));

    return (
        <div className="grid gap-2">
            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                        <Badge key={option.value} variant="secondary" className="gap-1 pr-1">
                            {option.label}
                            <button
                                type="button"
                                className="ml-0.5 rounded-sm outline-none ring-offset-background hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={() => remove(option.value)}
                            >
                                <XIcon className="size-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
                        <span className="text-muted-foreground">{placeholder}</span>
                        <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem key={option.value} value={option.label} onSelect={() => toggle(option.value)}>
                                        <CheckIcon className={cn('mr-2 size-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                                        <span>{option.label}</span>
                                        {option.description && <span className="ml-1 text-muted-foreground">- {option.description}</span>}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
