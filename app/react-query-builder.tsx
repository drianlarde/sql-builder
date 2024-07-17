'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    compareAsc,
    format,
    isValid,
    parseISO,
    subDays,
    subMonths,
    subWeeks,
    subYears,
} from 'date-fns';
import {
    Calendar as CalendarIcon,
    Edit,
    Eye,
    EyeOff,
    Filter,
    GripVertical,
    Group,
    Hash,
    Info,
    List,
    Plus,
    PlusCircle,
    PlusIcon,
    Search,
    ToggleLeftIcon,
    Trash,
    Trash2,
    Type,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
    Operator,
    OperatorSelectorProps,
    QueryBuilder,
    Field as QueryBuilderField,
    RuleGroupType,
    RuleType,
    ValueEditorProps,
    formatQuery,
} from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

// Custom styles to override react-querybuilder defaults
const queryBuilderCustomStyles = {
    queryBuilder: 'rqb-structure bg-white',
    ruleGroup: '!p-0 !bg-white',
    body: '!gap-2',
    combinators: '!flex !items-center',
    addRule: 'mt-2',
    addGroup: 'mt-2',
    removeGroup: 'mt-2',
    rule: '!flex !items-center !gap-2',
    fields: 'min-w-[200px]',
    operators: 'min-w-[120px]',
    value: 'min-w-[200px]',
};

// Expanded sample data
const sampleData = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        friends: 5,
        created: '2023-01-01',
        firstSeen: '2023-01-01',
        preferences: ['privacy mode', 'auto upload'],
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        age: 28,
        friends: 8,
        created: '2023-02-15',
        firstSeen: '2023-02-15',
        preferences: ['dark mode', 'notifications'],
    },
    {
        id: 3,
        firstName: 'Alice',
        lastName: 'Johnson',
        age: 35,
        friends: 12,
        created: '2023-03-10',
        firstSeen: '2023-03-10',
        preferences: ['auto upload', 'dark mode'],
    },
    {
        id: 4,
        firstName: 'Bob',
        lastName: 'Williams',
        age: 42,
        friends: 3,
        created: '2023-04-05',
        firstSeen: '2023-04-05',
        preferences: ['privacy mode'],
    },
    {
        id: 5,
        firstName: 'Charlie',
        lastName: 'Brown',
        age: 25,
        friends: 15,
        created: '2023-05-20',
        firstSeen: '2023-05-20',
        preferences: ['notifications', 'auto upload'],
    },
    {
        id: 6,
        firstName: 'Diana',
        lastName: 'Davis',
        age: 31,
        friends: 7,
        created: '2023-06-12',
        firstSeen: '2023-06-12',
        preferences: ['dark mode'],
    },
    {
        id: 7,
        firstName: 'Ethan',
        lastName: 'Miller',
        age: 29,
        friends: 10,
        created: '2023-07-08',
        firstSeen: '2023-07-08',
        preferences: ['privacy mode', 'notifications'],
    },
    {
        id: 8,
        firstName: 'Fiona',
        lastName: 'Wilson',
        age: 38,
        friends: 6,
        created: '2023-08-30',
        firstSeen: '2023-08-30',
        preferences: ['auto upload'],
    },
    {
        id: 9,
        firstName: 'George',
        lastName: 'Taylor',
        age: 45,
        friends: 4,
        created: '2023-09-22',
        firstSeen: '2023-09-22',
        preferences: ['dark mode', 'privacy mode'],
    },
    {
        id: 10,
        firstName: 'Hannah',
        lastName: 'Anderson',
        age: 33,
        friends: 9,
        created: '2023-10-15',
        firstSeen: '2023-10-15',
        preferences: ['notifications'],
    },
    {
        id: 11,
        firstName: 'Ian',
        lastName: 'Thomas',
        age: 27,
        friends: 11,
        created: '2023-11-05',
        firstSeen: '2023-11-05',
        preferences: ['auto upload', 'dark mode', 'privacy mode'],
    },
];

// Update the initialFields to include boolean type
const initialFields: (QueryBuilderField & {
    dataType: string;
    elementType?: string;
})[] = [
    { name: 'firstName', label: 'First Name', dataType: 'string' },
    { name: 'lastName', label: 'Last Name', dataType: 'string' },
    { name: 'age', label: 'Age', dataType: 'number' },
    { name: 'friends', label: 'Friends', dataType: 'number' },
    { name: 'created', label: 'Created', dataType: 'date' },
    { name: 'firstSeen', label: 'First Seen', dataType: 'date' },
    {
        name: 'preferences',
        label: 'Preferences',
        dataType: 'array',
        elementType: 'string',
    },
    { name: 'isActive', label: 'Is Active', dataType: 'boolean' },
    {
        name: 'notifications',
        label: 'Notifications',
        dataType: 'array',
        elementType: 'boolean',
    },
];

// Get the icon for each data type
const getIconForDataType = (dataType: string) => {
    switch (dataType) {
        case 'number':
            return <Hash className="h-4 w-4" />;
        case 'date':
            return <CalendarIcon className="h-4 w-4" />;
        case 'string':
            return <Type className="h-4 w-4" />;
        case 'array':
            return <List className="h-4 w-4" />;
        case 'boolean':
            return <ToggleLeftIcon className="h-4 w-4" />;
        default:
            return null;
    }
};

// Update the getDefaultValueForType function to include boolean type
const getDefaultValueForType = (type: string) => {
    switch (type) {
        case 'string':
            return '';
        case 'number':
            return 0;
        case 'date':
            return format(new Date(), 'yyyy-MM-dd');
        case 'array':
            return [];
        case 'boolean':
            return false;
        default:
            return '';
    }
};

// Update the parseArrayElementValue function to handle boolean type
const parseArrayElementValue = (value: string, type: string) => {
    switch (type) {
        case 'number':
            return parseFloat(value);
        case 'boolean':
            return value.toLowerCase() === 'true';
        case 'date':
            return new Date(value).toISOString();
        case 'object':
            try {
                return JSON.parse(value);
            } catch {
                return {};
            }
        default:
            return value;
    }
};

// This function formats the query object into a custom query string
const customFormatQuery = (query: RuleGroupType): string => {
    const valueProcessor = (
        field: string,
        operator: string,
        value: any,
    ): string => {
        const fieldData = initialFields.find((f) => f.name === field);
        console.log(
            `Processing field: ${field}, operator: ${operator}, value:`,
            value,
            `type: ${typeof value}`,
        );

        const formatDate = (date: any): string => {
            if (!date) return 'INVALID_DATE';
            let parsedDate;
            if (date instanceof Date) {
                parsedDate = date;
            } else if (typeof date === 'string') {
                parsedDate = parseISO(date);
            } else if (typeof date === 'number') {
                parsedDate = new Date(date);
            } else {
                return 'INVALID_DATE';
            }
            return isValid(parsedDate)
                ? `'${format(parsedDate, 'yyyy-MM-dd')}'`
                : 'INVALID_DATE';
        };

        const formatDateRange = (range: any): string => {
            if (!range || typeof range !== 'object')
                return 'INVALID_DATE_RANGE';
            const from = formatDate(range.from);
            const to = formatDate(range.to);
            if (from === 'INVALID_DATE' || to === 'INVALID_DATE')
                return 'INVALID_DATE_RANGE';
            return `${from} AND ${to}`;
        };

        const formatInterval = (interval: any): string => {
            if (
                !interval ||
                typeof interval !== 'object' ||
                !interval.amount ||
                !interval.unit
            ) {
                return 'INVALID_INTERVAL';
            }
            return `INTERVAL ${interval.amount} ${interval.unit.toUpperCase()}`;
        };

        switch (fieldData?.dataType) {
            case 'boolean':
                return value ? 'TRUE' : 'FALSE';
            case 'date':
                switch (operator) {
                    case 'between':
                    case 'notBetween':
                        return formatDateRange(value);
                    case 'on':
                    case 'notOn':
                    case 'before':
                    case 'since':
                        return formatDate(value);
                    case 'last':
                    case 'notInLast':
                    case 'inNext':
                    case 'beforeLast':
                        return formatInterval(value);
                    default:
                        return 'INVALID_OPERATOR';
                }
            case 'array':
                if (Array.isArray(value)) {
                    return `(${value.map((v) => (typeof v === 'string' ? `'${v}'` : v)).join(', ')})`;
                }
                break;
        }

        return typeof value === 'string' ? `'${value}'` : value;
    };

    const ruleProcessor = (rule: RuleType): string => {
        const { field, operator, value } = rule;
        console.log(
            `Processing rule: field=${field}, operator=${operator}, value:`,
            value,
        );

        switch (operator) {
            // Non-date operators
            case 'is':
            case 'isNot':
                return `${field} ${operator === 'is' ? '=' : '!='} ${valueProcessor(field, operator, value)}`;

            case 'contains':
                return `${field} LIKE '%${value}%'`;
            case 'beginsWith':
                return `${field} LIKE '${value}%'`;
            case 'endsWith':
                return `${field} LIKE '%${value}'`;
            case 'doesNotContain':
                return `${field} NOT LIKE '%${value}%'`;
            case 'in':
            case 'notIn':
                return `${field} ${operator.toUpperCase()} ${valueProcessor(field, operator, value)}`;
            case 'isTrue':
            case 'isFalse':
                return `${field} = ${operator === 'isTrue' ? 'TRUE' : 'FALSE'}`;

            // SQL not PostgreSQL
            case 'allTrue':
                return `${field} = TRUE`;
            case 'allFalse':
                return `${field} = FALSE`;
            case 'anyTrue': // Contains at least one true value
                return `TRUE = ANY(${field})`; // PostgreSQL syntax for arrays
            case 'anyFalse': // Contains at least one false value
                return `FALSE = ANY(${field})`; // PostgreSQL syntax for arrays

            // Date operators
            case 'between':
            case 'notBetween':
                const betweenValue = valueProcessor(field, operator, value);
                return betweenValue !== 'INVALID_DATE_RANGE'
                    ? `${field} NOT BETWEEN ${betweenValue}`
                    : `${field} = ${field}`; // Invalid date range

            case 'on':
                const onDate = valueProcessor(field, operator, value);
                return onDate !== 'INVALID_DATE'
                    ? `${field} = ${onDate}`
                    : `${field} = ${field}`;

            case 'notOn':
                const notOnDate = valueProcessor(field, operator, value);
                return notOnDate !== 'INVALID_DATE'
                    ? `${field} != ${notOnDate}`
                    : `${field} = ${field}`;

            case 'before':
                const beforeDate = valueProcessor(field, operator, value);
                return beforeDate !== 'INVALID_DATE'
                    ? `${field} < ${beforeDate}`
                    : `${field} = ${field}`;

            case 'since':
                const sinceDate = valueProcessor(field, operator, value);
                return sinceDate !== 'INVALID_DATE'
                    ? `${field} >= ${sinceDate}`
                    : `${field} = ${field}`;

            case 'last':
            case 'notInLast':
                const lastInterval = valueProcessor(field, operator, value);
                return lastInterval !== 'INVALID_INTERVAL'
                    ? `${field} ${operator === 'last' ? '>=' : '<'} DATE_SUB(CURRENT_DATE, ${lastInterval})`
                    : `${field} = ${field}`;

            case 'inNext':
            case 'beforeLast':
                const nextInterval = valueProcessor(field, operator, value);
                return nextInterval !== 'INVALID_INTERVAL'
                    ? `${field} ${operator === 'inNext' ? '<=' : '>'} DATE_ADD(CURRENT_DATE, ${nextInterval})`
                    : `${field} = ${field}`;

            case 'isSet':
                return `${field} IS NOT NULL AND ${field} != ''`;
            case 'isNotSet':
                return `${field} IS NULL OR ${field} = ''`;

            case 'equals':
                return `${field} = ${value}`;
            case 'notEqual':
                return `${field} != ${value}`;
            case 'greaterThan':
                return `${field} > ${value}`;
            case 'greaterThanOrEqual':
                return `${field} >= ${value}`;
            case 'lessThan':
                return `${field} < ${value}`;
            case 'lessThanOrEqual':
                return `${field} <= ${value}`;
            case 'between':
                return `${field} BETWEEN ${value[0]} AND ${value[1]}`;
            case 'notBetween':
                return `${field} NOT BETWEEN ${value[0]} AND ${value[1]}`;
            case 'isNumeric':
                return `${field} REGEXP '^[0-9]+$'`;
            case 'isNotNumeric':
                return `${field} NOT REGEXP '^[0-9]+$'`;

            default:
                return `${field} ${operator} ${valueProcessor(field, operator, value)}`;
        }
    };

    const result = formatQuery(query, { format: 'sql', ruleProcessor });
    console.log('Final SQL query:', result);
    return result;
};

// New component for selecting array element type
// Update the ArrayTypeSelector component to include boolean type
const ArrayTypeSelector = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => (
    <section>
        <div className="mb-2">
            <div className="flex gap-2 items-center">
                <Label>Select array element type</Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info size={15} />
                        </TooltipTrigger>
                        <TooltipContent className="text-white text-sm flex flex-col gap-1 bg-indigo-500">
                            <p>
                                Choose the data type for the elements in the
                                array field. This will be used to validate and
                                format the values.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>

        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select array element type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="string">
                    <div className="flex items-center gap-2">
                        <Type size={16} />
                        String
                    </div>
                </SelectItem>
                <SelectItem value="number">
                    <div className="flex items-center gap-2">
                        <Hash size={16} />
                        Number
                    </div>
                </SelectItem>
                <SelectItem value="boolean">
                    <div className="flex items-center gap-2">
                        <ToggleLeftIcon size={16} />
                        Boolean
                    </div>
                </SelectItem>
                <SelectItem value="date">
                    <div className="flex items-center gap-2">
                        <CalendarIcon size={16} />
                        Date
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    </section>
);

// Components ----

const ValueEditor = ({
    field,
    operator,
    value,
    handleOnChange,
    fieldData: fieldDataPlaceholder,
}: ValueEditorProps) => {
    const fieldData = initialFields.find((f) => f.name === field);

    if (fieldDataPlaceholder.value == '') {
        return null;
    }

    const ensureValidDateValue = (val: any): Date | undefined => {
        if (!val) return undefined;
        if (val instanceof Date) return isValid(val) ? val : undefined;
        if (typeof val === 'string') {
            const parsed = parseISO(val);
            return isValid(parsed) ? parsed : undefined;
        }
        if (typeof val === 'object' && 'from' in val) {
            return ensureValidDateValue(val.from);
        }
        return undefined;
    };

    if (fieldData?.dataType === 'date') {
        switch (operator) {
            case 'between':
            case 'notBetween':
                let rangeValue: DateRange = { from: undefined, to: undefined };
                if (
                    value &&
                    typeof value === 'object' &&
                    'from' in value &&
                    'to' in value
                ) {
                    rangeValue = {
                        from: ensureValidDateValue(value.from),
                        to: ensureValidDateValue(value.to),
                    };
                }
                return (
                    <DatePickerWithRange
                        value={rangeValue}
                        onChange={(range) => {
                            handleOnChange(
                                range
                                    ? {
                                          from: range.from
                                              ? format(range.from, 'yyyy-MM-dd')
                                              : undefined,
                                          to: range.to
                                              ? format(range.to, 'yyyy-MM-dd')
                                              : undefined,
                                      }
                                    : undefined,
                            );
                        }}
                    />
                );
            case 'on':
            case 'notOn':
            case 'before':
            case 'since':
                const singleDateValue = ensureValidDateValue(value);
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                {singleDateValue ? (
                                    format(singleDateValue, 'PPP')
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={singleDateValue}
                                onSelect={(date) =>
                                    handleOnChange(
                                        date
                                            ? format(date, 'yyyy-MM-dd')
                                            : undefined,
                                    )
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );
            case 'last':
            case 'notInLast':
            case 'inNext':
            case 'beforeLast':
                let intervalValue = { amount: '', unit: 'days' as const };
                if (
                    value &&
                    typeof value === 'object' &&
                    'amount' in value &&
                    'unit' in value
                ) {
                    intervalValue = value;
                }
                return (
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={intervalValue.amount}
                            onChange={(e) =>
                                handleOnChange({
                                    amount: e.target.value,
                                    unit: intervalValue.unit,
                                })
                            }
                            className="w-20"
                        />
                        <Select
                            value={intervalValue.unit}
                            onValueChange={(
                                unit: 'days' | 'weeks' | 'months' | 'years',
                            ) =>
                                handleOnChange({
                                    amount: intervalValue.amount,
                                    unit,
                                })
                            }
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="days">Days</SelectItem>
                                <SelectItem value="weeks">Weeks</SelectItem>
                                <SelectItem value="months">Months</SelectItem>
                                <SelectItem value="years">Years</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                );
        }
    } else if (fieldData?.dataType === 'string') {
        if (operator === 'isSet' || operator === 'isNotSet') {
            return null; // No value input needed for these operators
        }
        // For other text operators, use the default string input
        return (
            <Input
                type="text"
                value={value}
                onChange={(e) => handleOnChange(e.target.value)}
            />
        );
    } else if (
        fieldData?.dataType === 'boolean' ||
        (fieldData?.dataType === 'array' && fieldData.elementType === 'boolean')
    ) {
        // No value input needed for boolean and array of boolean
        return null;
    } else if (fieldData?.dataType === 'number') {
        return (
            <Input
                type="number"
                value={value}
                onChange={(e) => handleOnChange(e.target.value)}
            />
        );
    } else if (fieldData?.dataType === 'boolean') {
        return (
            <Select
                value={value ? 'true' : 'false'}
                onValueChange={(val) => handleOnChange(val === 'true')}
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                </SelectContent>
            </Select>
        );
    } else if (fieldData?.dataType === 'array') {
        // Default to 'string' if elementType is not specified
        const elementType = fieldData.elementType || 'string';

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        {value && value.length > 0
                            ? `${value.length} item(s)`
                            : 'Edit array'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-2">
                        {value &&
                            value.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                >
                                    <Input
                                        className="w-full"
                                        value={item}
                                        onChange={(e) => {
                                            const newValue = [...value];
                                            newValue[index] =
                                                parseArrayElementValue(
                                                    e.target.value,
                                                    elementType,
                                                );
                                            handleOnChange(newValue);
                                        }}
                                        type={
                                            elementType === 'number'
                                                ? 'number'
                                                : 'text'
                                        }
                                    />
                                    <Button
                                        className="bg-red-50/50 shadow-none hover:bg-red-100/50"
                                        onClick={() => {
                                            const newValue = value.filter(
                                                (_: any, i: number) =>
                                                    i !== index,
                                            );
                                            handleOnChange(newValue);
                                        }}
                                        size="sm"
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        <div className="flex items-center space-x-2">
                            <Input
                                className="w-full"
                                placeholder={`Add new ${elementType}`}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const newItem = parseArrayElementValue(
                                            e.currentTarget.value,
                                            elementType,
                                        );
                                        handleOnChange([
                                            ...(value || []),
                                            newItem,
                                        ]);
                                        e.currentTarget.value = '';
                                    }
                                }}
                                type={
                                    elementType === 'number' ? 'number' : 'text'
                                }
                            />
                            <Button
                                onClick={() => {
                                    const input = document.querySelector(
                                        'input[placeholder^="Add new"]',
                                    ) as HTMLInputElement;
                                    if (input && input.value) {
                                        const newItem = parseArrayElementValue(
                                            input.value,
                                            elementType,
                                        );
                                        handleOnChange([
                                            ...(value || []),
                                            newItem,
                                        ]);
                                        input.value = '';
                                    }
                                }}
                                size="sm"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    } else if (fieldData?.dataType === 'number') {
        if (operator === 'between' || operator === 'notBetween') {
            return (
                <div className="flex items-center space-x-2">
                    <Input
                        type="number"
                        value={value[0] || ''}
                        onChange={(e) =>
                            handleOnChange([e.target.value, value[1]])
                        }
                        placeholder="Min"
                        className="w-24"
                    />
                    <span>and</span>
                    <Input
                        type="number"
                        value={value[1] || ''}
                        onChange={(e) =>
                            handleOnChange([value[0], e.target.value])
                        }
                        placeholder="Max"
                        className="w-24"
                    />
                </div>
            );
        } else if (operator === 'isNumeric' || operator === 'isNotNumeric') {
            return null; // No value input needed for these operators
        } else {
            return (
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleOnChange(e.target.value)}
                />
            );
        }
    } else {
        // Default to string input
        return (
            <Input
                type="text"
                value={value}
                onChange={(e) => handleOnChange(e.target.value)}
            />
        );
    }
};

const FieldSelector = (props: any, index: number) => {
    console.log('Props Test:', props);
    console.log('Index:', index);

    const isFirstRuleInGroup =
        props.rule &&
        props.parentRule &&
        props.parentRule.rules &&
        props.parentRule.rules[0] === props.rule;

    console.log('Is First Rule In Group:', isFirstRuleInGroup);

    return (
        <section className="flex items-center gap-2">
            <Select defaultValue="and">
                <SelectTrigger
                    hideCaret
                    className="w-fit border-transparent shadow-none hover:border-indigo-500 hover:text-indigo-500 text-zinc-400 p-2"
                >
                    <SelectValue placeholder="And/Or" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="and">And</SelectItem>
                    <SelectItem value="or">Or</SelectItem>
                </SelectContent>
            </Select>
            <Select value={props.value} onValueChange={props.handleOnChange}>
                <SelectTrigger className="w-fit border-transparent shadow-none bg-zinc-100/80 hover:border-indigo-500 hover:text-indigo-500">
                    <SelectValue placeholder="Select field..." />
                </SelectTrigger>
                <SelectContent>
                    {props.options.map((option: any) => (
                        <SelectItem key={option.name} value={option.name}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </section>
    );
};

const OperatorSelector = ({
    value,
    handleOnChange,
    options,
    fieldData,
}: OperatorSelectorProps) => {
    if (fieldData.value == '') {
        return null;
    }
    return (
        <Select value={value} onValueChange={handleOnChange}>
            <SelectTrigger className="w-fit border-transparent shadow-none bg-zinc-100/80 hover:border-indigo-500 hover:text-indigo-500">
                <SelectValue placeholder="Select operator..." />
            </SelectTrigger>
            <SelectContent>
                {options.map((option: any) => (
                    <SelectItem key={option.name} value={option.name}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const RemoveActionElement = ({ label, handleOnClick }: any) => {
    return (
        <Button
            className="hover:bg-red-50/50 shadow-none hover:text-red-500 transition-all duration-200 ease-in-out"
            variant="outline"
            onClick={handleOnClick}
        >
            <Trash className="h-4 w-4" />
        </Button>
    );
};

const DatePickerWithRange = ({
    value,
    onChange,
}: {
    value: DateRange | undefined;
    onChange: (range: DateRange | undefined) => void;
}) => {
    return (
        <div className="grid gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[300px] justify-start text-left font-normal',
                            !value && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, 'LLL dd, y')} -{' '}
                                    {format(value.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(value.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={onChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

// Custom operators ----

const customDateOperators = [
    { name: 'last', label: 'Last' },
    { name: 'notInLast', label: 'Not in the last' },
    { name: 'between', label: 'Between' },
    { name: 'notBetween', label: 'Not between' },
    { name: 'on', label: 'On' },
    { name: 'notOn', label: 'Not on' },
    { name: 'beforeLast', label: 'Before the last' },
    { name: 'before', label: 'Before' },
    { name: 'since', label: 'Since' },
    { name: 'inNext', label: 'In the next' },
];

/*
Equals,
Not equal,
Greater than
Greater than or equal to
Less than
Less than or equal to
Between
Not between
Is numeric
Is not numeric
*/

const customNumberOperators = [
    {
        name: 'equals',
        label: 'Equals',
    },
    {
        name: 'notEqual',
        label: 'Not equal',
    },
    {
        name: 'greaterThan',
        label: 'Greater than',
    },
    {
        name: 'greaterThanOrEqual',
        label: 'Greater than or equal to',
    },
    {
        name: 'lessThan',
        label: 'Less than',
    },
    {
        name: 'lessThanOrEqual',
        label: 'Less than or equal to',
    },
    {
        name: 'between',
        label: 'Between',
    },
    {
        name: 'notBetween',
        label: 'Not between',
    },
    {
        name: 'isNumeric',
        label: 'Is numeric',
    },
    {
        name: 'isNotNumeric',
        label: 'Is not numeric',
    },
];

const customBooleanOperators = [
    { name: 'isTrue', label: 'Is True' },
    { name: 'isFalse', label: 'Is False' },
];

const customArrayOperators = [
    { name: 'contains', label: 'Contains' },
    { name: 'doesNotContain', label: 'Does not contain' },
];

const customArrayBooleanOperators = [
    { name: 'allTrue', label: 'All True' },
    { name: 'allFalse', label: 'All False' },
    { name: 'anyTrue', label: 'Any True' },
    { name: 'anyFalse', label: 'Any False' },
];

const customTextOperators = [
    { name: 'is', label: 'Is' },
    { name: 'isNot', label: 'Is not' },
    { name: 'contains', label: 'Contains' },
    { name: 'doesNotContain', label: 'Does not contain' },
    { name: 'isSet', label: 'Is set' },
    { name: 'isNotSet', label: 'Is not set' },
];

// Helper function to get the appropriate operators for a field
const getOperatorsForField = (
    field: QueryBuilderField & {
        dataType: string;
        elementType?: string;
    },
) => {
    if (field.dataType === 'date') {
        return customDateOperators;
    } else if (field.dataType === 'boolean') {
        return customBooleanOperators;
    } else if (field.dataType === 'array') {
        if (field.elementType === 'boolean') {
            return customArrayBooleanOperators;
        }
        return customArrayOperators;
    } else if (field.dataType === 'string') {
        return customTextOperators;
    } else if (field.dataType === 'number') {
        return customNumberOperators;
    }
    return undefined;
};

// Main component ----

export default function AdvancedQueryBuilder() {
    const [query, setQuery] = useState<{
        groups: RuleGroupType[];
        combinators: string[];
    }>({
        groups: [{ combinator: 'and', rules: [] }],
        combinators: [],
    });
    const [selectedColumns, setSelectedColumns] = useState<string[]>(
        initialFields.map((field) => field.name),
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [mutableData, setMutableData] = useState(sampleData);
    const [filteredData, setFilteredData] = useState(sampleData);
    const [fields, setFields] = useState(initialFields);
    const [queryBuilderFields, setQueryBuilderFields] = useState(
        initialFields.map((field) => ({
            name: field.name,
            label: field.label,
            inputType: field.dataType === 'date' ? 'date' : 'text',
            operators: getOperatorsForField(field),
        })),
    );
    const [newColumnName, setNewColumnName] = useState('');
    const [newColumnType, setNewColumnType] = useState('string');
    const [editingArrayItem, setEditingArrayItem] = useState<string>('');
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');

    // Array element type
    const [newColumnArrayType, setNewColumnArrayType] = useState('string');

    useEffect(() => {
        const newFilteredData = mutableData.filter((item: any) => {
            const matchesQuery = query.groups.every((group, groupIndex) => {
                const evaluateGroup = (ruleGroup: RuleGroupType): boolean => {
                    return ruleGroup.rules.every((ruleOrGroup) => {
                        if ('rules' in ruleOrGroup) {
                            // This is a nested group
                            return evaluateGroup(ruleOrGroup);
                        } else {
                            // This is a rule
                            const rule = ruleOrGroup as RuleType;
                            if (
                                'field' in rule &&
                                'operator' in rule &&
                                'value' in rule
                            ) {
                                const { field, operator, value } = rule;
                                const itemValue = item[field];
                                const fieldType = fields.find(
                                    (f) => f.name === field,
                                )?.dataType;
                                const elementType = fields.find(
                                    (f) => f.name === field,
                                )?.elementType;

                                const compareValues = (
                                    a: any,
                                    b: any,
                                    op: string,
                                ): boolean => {
                                    if (a === undefined || a === null) {
                                        return op === 'isNotSet';
                                    }

                                    switch (fieldType) {
                                        case 'boolean':
                                            return compareBooleans(
                                                Boolean(a),
                                                op,
                                            );
                                        case 'array':
                                            return compareArrays(
                                                a,
                                                b,
                                                op,
                                                elementType,
                                            );
                                        case 'date':
                                            return compareDates(
                                                new Date(a),
                                                b,
                                                op,
                                            );
                                        case 'number':
                                            return compareNumbers(
                                                Number(a),
                                                Number(b),
                                                op,
                                            );
                                        case 'string':
                                        default:
                                            return compareStrings(
                                                String(a),
                                                String(b),
                                                op,
                                            );
                                    }
                                };

                                return compareValues(
                                    itemValue,
                                    value,
                                    operator,
                                );
                            }
                            return true;
                        }
                    });
                };

                const groupMatches = evaluateGroup(group);

                if (groupIndex === 0) return groupMatches;
                return query.combinators[groupIndex - 1] === 'and'
                    ? groupMatches
                    : true;
            });

            const matchesGlobalSearch = globalSearchTerm
                ? Object.values(item).some((value) =>
                      String(value)
                          .toLowerCase()
                          .includes(globalSearchTerm.toLowerCase()),
                  )
                : true;

            return matchesQuery && matchesGlobalSearch;
        });

        setFilteredData(newFilteredData);
    }, [mutableData, query, globalSearchTerm, fields]);

    // Helper functions for type-specific comparisons
    const compareBooleans = (a: boolean, op: string): boolean => {
        switch (op) {
            case 'isTrue':
                return a === true;
            case 'isFalse':
                return a === false;
            default:
                return false;
        }
    };

    const compareArrays = (
        a: any[],
        b: any,
        op: string,
        elementType: string | undefined,
    ): boolean => {
        if (elementType === 'boolean') {
            const boolArray = a.map(Boolean);
            switch (op) {
                case 'allTrue':
                    return boolArray.every(Boolean);
                case 'allFalse':
                    return boolArray.every((v) => !v);
                case 'anyTrue':
                    return boolArray.some(Boolean);
                case 'anyFalse':
                    return boolArray.some((v) => !v);
                default:
                    return false;
            }
        } else {
            const arrayB = Array.isArray(b) ? b : [b];
            switch (op) {
                case 'contains':
                    return a.some((item) => arrayB.includes(item));
                case 'doesNotContain':
                    return !a.some((item) => arrayB.includes(item));
                default:
                    return false;
            }
        }
    };

    const compareDates = (dateA: Date, b: any, op: string): boolean => {
        const now = new Date();
        if (['last', 'notInLast', 'beforeLast', 'inNext'].includes(op)) {
            const { amount, unit } = b;
            const duration = parseInt(amount);
            let comparisonDate;
            switch (unit) {
                case 'days':
                    comparisonDate = addDays(now, -duration);
                    break;
                case 'weeks':
                    comparisonDate = addDays(now, -duration * 7);
                    break;
                case 'months':
                    comparisonDate = addMonths(now, -duration);
                    break;
                case 'years':
                    comparisonDate = addYears(now, -duration);
                    break;
                default:
                    comparisonDate = addDays(now, -duration);
            }
            switch (op) {
                case 'last':
                    return dateA >= comparisonDate;
                case 'notInLast':
                    return dateA < comparisonDate;
                case 'beforeLast':
                    return dateA < comparisonDate;
                case 'inNext':
                    return dateA >= now && dateA <= addDays(now, duration);
            }
        } else if (['between', 'notBetween', 'since'].includes(op)) {
            const startDate = new Date(b.from);
            const endDate = new Date(b.to);
            switch (op) {
                case 'between':
                    return dateA >= startDate && dateA <= endDate;
                case 'notBetween':
                    return dateA < startDate || dateA > endDate;
                case 'since':
                    return dateA >= startDate && dateA <= now;
            }
        } else {
            const dateB = new Date(b);
            const comparison = compareAsc(dateA, dateB);
            switch (op) {
                case '=':
                case 'on':
                    return comparison === 0;
                case '!=':
                case 'notOn':
                    return comparison !== 0;
                case '>':
                case 'after':
                    return comparison > 0;
                case '<':
                case 'before':
                    return comparison < 0;
                case '>=':
                    return comparison >= 0;
                case '<=':
                    return comparison <= 0;
            }
        }
        return false;
    };

    const compareNumbers = (a: number, b: any, op: string): boolean => {
        switch (op) {
            case 'equals':
                return a === Number(b);
            case 'notEqual':
                return a !== Number(b);
            case 'greaterThan':
                return a > Number(b);
            case 'greaterThanOrEqual':
                return a >= Number(b);
            case 'lessThan':
                return a < Number(b);
            case 'lessThanOrEqual':
                return a <= Number(b);
            case 'between':
                if (Array.isArray(b) && b.length === 2) {
                    const [min, max] = b.map(Number);
                    return min <= a && a <= max;
                }
                return false;
            case 'notBetween':
                if (Array.isArray(b) && b.length === 2) {
                    const [min, max] = b.map(Number);
                    return a < min || a > max;
                }
                return false;
            case 'isNumeric':
                return !isNaN(a);
            case 'isNotNumeric':
                return isNaN(a);
            default:
                return false;
        }
    };

    const compareStrings = (a: string, b: string, op: string): boolean => {
        const strA = a.toLowerCase();
        const strB = b.toLowerCase();
        switch (op) {
            case 'is':
            case '=':
                return strA === strB;
            case 'isNot':
            case '!=':
                return strA !== strB;
            case 'contains':
                return strA.includes(strB);
            case 'doesNotContain':
                return !strA.includes(strB);
            case 'beginsWith':
                return strA.startsWith(strB);
            case 'endsWith':
                return strA.endsWith(strB);
            case 'isSet':
                return a !== '';
            case 'isNotSet':
                return a === '';
            default:
                return false;
        }
    };

    // const updateQuery = (newQuery: RuleGroupType) => {
    //     const cleanedQuery = {
    //         ...newQuery,
    //         rules: newQuery.rules.filter((group: any) => {
    //             if ('rules' in group) {
    //                 return group.rules.length > 0;
    //             }
    //             return true;
    //         }),
    //     };
    //     setQuery(cleanedQuery);
    // };

    // Function to add a new top-level group
    const addGroup = () => {
        setQuery((prevQuery) => ({
            groups: [...prevQuery.groups, { combinator: 'and', rules: [] }],
            combinators: [...prevQuery.combinators, 'and'],
        }));
    };

    const deleteGroup = (index: number) => {
        setQuery((prevQuery) => ({
            groups: prevQuery.groups.filter((_, i) => i !== index),
            combinators: prevQuery.combinators.filter(
                (_, i) => i !== index - 1,
            ),
        }));
    };

    const toggleCombinator = (index: number) => {
        setQuery((prevQuery) => ({
            ...prevQuery,
            combinators: prevQuery.combinators.map((c, i) =>
                i === index ? (c === 'and' ? 'or' : 'and') : c,
            ),
        }));
    };

    const handleColumnToggle = (columnName: string) => {
        setSelectedColumns((prev) =>
            prev.includes(columnName)
                ? prev.filter((col) => col !== columnName)
                : [...prev, columnName],
        );
    };

    const handleDeselectAll = () => {
        setSelectedColumns([]);
    };

    const handleClear = () => {
        setSelectedColumns(initialFields.map((field) => field.name));
    };

    // Update the handleCreateColumn function
    const handleCreateColumn = () => {
        if (newColumnName) {
            const capitalizedName =
                newColumnName.charAt(0).toUpperCase() + newColumnName.slice(1);
            const newField = {
                // Camel case, ex. testString
                name: newColumnName
                    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                        return index === 0
                            ? word.toLowerCase()
                            : word.toUpperCase();
                    })
                    .replace(/\s+/g, ''),
                label: capitalizedName,
                dataType: newColumnType,
                ...(newColumnType === 'array' && {
                    elementType: newColumnArrayType,
                }),
            };

            // Update fields
            setFields((prevFields) => [...prevFields, newField]);

            // Update queryBuilderFields
            setQueryBuilderFields((prevQueryBuilderFields) => [
                ...prevQueryBuilderFields,
                {
                    name: newField.name,
                    label: newField.label,
                    inputType: newField.dataType === 'date' ? 'date' : 'text',
                    operators: getOperatorsForField(newField),
                },
            ]);

            setSelectedColumns((prevSelectedColumns) => [
                ...prevSelectedColumns,
                newField.name,
            ]);
            setNewColumnName('');
            setNewColumnType('string');
            setNewColumnArrayType('string');

            // Add the new column to existing data with default values
            const defaultValue = getDefaultValueForType(newField.dataType);
            setMutableData((prevData) =>
                prevData.map((item) => ({
                    ...item,
                    [newField.name]: defaultValue,
                })),
            );
        }
    };

    const handleCellEdit = (rowIndex: number, column: string, value: any) => {
        setMutableData((prevData) => {
            const newData = [...prevData];
            newData[rowIndex] = { ...newData[rowIndex], [column]: value };
            return newData;
        });
    };

    // Update the handleArrayItemEdit function to accept string or boolean
    const handleArrayItemEdit = (
        rowIndex: number,
        column: string,
        itemIndex: number,
        newValue: string | boolean,
    ) => {
        setMutableData((prevData: any) => {
            const newData = [...prevData];
            const newArray = [...newData[rowIndex][column]];
            newArray[itemIndex] = newValue;
            newData[rowIndex] = {
                ...newData[rowIndex],
                [column]: newArray,
            };
            return newData;
        });
    };

    const handleArrayItemDelete = (
        rowIndex: number,
        column: string,
        itemIndex: number,
    ) => {
        setMutableData((prevData: any) => {
            const newData = [...prevData];
            const newArray = newData[rowIndex][column].filter(
                (_: any, index: number) => index !== itemIndex,
            );
            newData[rowIndex] = {
                ...newData[rowIndex],
                [column]: newArray,
            };
            return newData;
        });
    };

    // Update the handleArrayItemAdd function to handle boolean type
    const handleArrayItemAdd = (rowIndex: number, column: string) => {
        const field = fields.find((f) => f.name === column);
        if (field && field.dataType === 'array') {
            const newItem =
                field.elementType === 'boolean'
                    ? editingArrayItem === 'true'
                    : parseArrayElementValue(
                          editingArrayItem,
                          field.elementType || 'string',
                      );

            setMutableData((prevData: any) => {
                const newData = [...prevData];
                newData[rowIndex] = {
                    ...newData[rowIndex],
                    [column]: [...(newData[rowIndex][column] || []), newItem],
                };
                return newData;
            });
            setEditingArrayItem('');
        }
    };

    const handleHideColumn = (columnName: string) => {
        setHiddenColumns((prev) => [...prev, columnName]);
        setSelectedColumns((prev) => prev.filter((col) => col !== columnName));
    };

    const handleUnhideColumn = (columnName: string) => {
        setHiddenColumns((prev) => prev.filter((col) => col !== columnName));
        setSelectedColumns((prev) => [...prev, columnName]);
    };

    const filteredFields = fields.filter((field) =>
        field.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const visibleFields = filteredFields.filter(
        (field) => !hiddenColumns.includes(field.name),
    );

    const hiddenFields = filteredFields.filter((field) =>
        hiddenColumns.includes(field.name),
    );

    const renderCellContent = (item: any, column: string, rowIndex: number) => {
        const field = fields.find((f) => f.name === column);
        if (!field) return null;

        switch (field.dataType) {
            case 'date':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                {item[column] ? (
                                    format(new Date(item[column]), 'PPP')
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={
                                    item[column]
                                        ? new Date(item[column])
                                        : undefined
                                }
                                onSelect={(date) =>
                                    handleCellEdit(
                                        rowIndex,
                                        column,
                                        date
                                            ? format(date, 'yyyy-MM-dd')
                                            : null,
                                    )
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );
            case 'array':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                {item[column] && item[column].length > 0
                                    ? item[column].join(', ')
                                    : 'Empty array'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                            <div className="flex flex-col gap-2">
                                {!item[column] || item[column].length === 0 ? (
                                    <div className="flex flex-col w-full items-center justify-center">
                                        <h2 className="flex items-center text-center justify-center">
                                            Empty array
                                        </h2>
                                        <p className="text-sm text-zinc-500 text-center w-[246px]">
                                            Click the button below to add items
                                            to the array.
                                        </p>
                                    </div>
                                ) : null}
                                {item[column] &&
                                    item[column].map(
                                        (arrayItem: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 w-full justify-between"
                                            >
                                                {field.elementType ===
                                                'boolean' ? (
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={arrayItem}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                handleArrayItemEdit(
                                                                    rowIndex,
                                                                    column,
                                                                    index,
                                                                    checked,
                                                                )
                                                            }
                                                        />
                                                        {arrayItem
                                                            ? 'True'
                                                            : 'False'}
                                                    </div>
                                                ) : (
                                                    <Input
                                                        className="w-full"
                                                        value={arrayItem}
                                                        onChange={(e) =>
                                                            handleArrayItemEdit(
                                                                rowIndex,
                                                                column,
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                <Button
                                                    className="bg-red-50/50 flex items-center gap-1 text-red-500 shadow-none hover:bg-red-100/50 w-fit"
                                                    onClick={() =>
                                                        handleArrayItemDelete(
                                                            rowIndex,
                                                            column,
                                                            index,
                                                        )
                                                    }
                                                    size="sm"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />{' '}
                                                    Delete
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                <div className="w-full my-2 h-[1px] bg-zinc-200" />

                                <div className="flex items-center space-x-2">
                                    {field.elementType === 'boolean' ? (
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={
                                                    editingArrayItem === 'true'
                                                }
                                                onCheckedChange={(checked) =>
                                                    setEditingArrayItem(
                                                        checked.toString(),
                                                    )
                                                }
                                            />
                                            {editingArrayItem === 'true'
                                                ? 'True'
                                                : 'False'}
                                        </div>
                                    ) : (
                                        <Input
                                            className="w-full"
                                            value={editingArrayItem}
                                            onChange={(e) =>
                                                setEditingArrayItem(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Add new item"
                                        />
                                    )}
                                    <Button
                                        onClick={() =>
                                            handleArrayItemAdd(rowIndex, column)
                                        }
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Plus className="mr-1" size={14} /> Add
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                );
            case 'boolean':
                return (
                    <Switch
                        checked={item[column]}
                        onCheckedChange={(checked) =>
                            handleCellEdit(rowIndex, column, checked)
                        }
                    />
                );
            default:
                return (
                    <Input
                        value={item[column]}
                        onChange={(e) =>
                            handleCellEdit(rowIndex, column, e.target.value)
                        }
                    />
                );
        }
    };

    // Function to render a single group
    const renderGroup = (group: RuleGroupType, index: number) => {
        return (
            <div
                key={index}
                className="mb-4 p-4 border border-gray-200 rounded-lg"
            >
                <div className="flex justify-between items-start mb-2">
                    {/* <h3 className="text-lg font-semibold">Group {index + 1}</h3> */}
                    <div className="flex items-center gap-2">
                        <Button
                            className="!p-0 m-0 h-fit hover:bg-transparent"
                            variant="ghost"
                        >
                            <GripVertical className="text-gray-400" size={14} />
                        </Button>
                        <h3 className="text-sm font-medium uppercase text-zinc-400">
                            All Users
                        </h3>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGroup(index)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Group
                    </Button>
                </div>
                <QueryBuilder
                    fields={queryBuilderFields}
                    query={group}
                    onQueryChange={(newGroup) => {
                        setQuery((prevQuery) => ({
                            ...prevQuery,
                            groups: prevQuery.groups.map((g, i) =>
                                i === index ? newGroup : g,
                            ),
                        }));
                    }}
                    controlClassnames={{
                        header: '!mb-0',
                        queryBuilder: 'rqb-structure bg-white',
                        ruleGroup: '!p-0 !bg-white !gap-0 !border-none',
                        body: '!gap-0',
                        combinators: '!flex !items-center',
                        addRule: 'mt-2',
                        addGroup: 'mt-2',
                        removeGroup: 'mt-2',
                        rule: '!flex !items-center !gap-2 !mb-2',
                        fields: 'min-w-[200px]',
                        operators: 'min-w-[120px]',
                        value: 'min-w-[200px]',
                    }}
                    controlElements={{
                        addRuleAction: () => null,
                        addGroupAction: () => null,
                        combinatorSelector: () => null,
                        valueEditor: ValueEditor,
                        fieldSelector: (props) => {
                            // Count the number of fields in the group
                            const fieldCount = group.rules.filter(
                                (rule) => 'field' in rule,
                            ).length;

                            console.log('Field Count:', fieldCount);

                            return <FieldSelector {...props} />;
                        },
                        operatorSelector: (props: OperatorSelectorProps) => (
                            <OperatorSelector {...props} />
                        ),
                        removeRuleAction: RemoveActionElement,
                        removeGroupAction: RemoveActionElement,
                    }}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setQuery((prevQuery) => ({
                            ...prevQuery,
                            groups: prevQuery.groups.map((g, i) => {
                                if (i === index) {
                                    return {
                                        ...g,
                                        rules: [
                                            ...g.rules,
                                            {
                                                field: '',
                                                operator: '',
                                                value: '',
                                            },
                                        ],
                                    };
                                }
                                return g;
                            }),
                        }));
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Filter
                </Button>
            </div>
        );
    };

    // Function to generate SQL query
    const generateSQLQuery = () => {
        return query.groups
            .map((group, index) => {
                const groupSQL = customFormatQuery(group);
                if (index === 0) return groupSQL;
                return `${query.combinators[index - 1].toUpperCase()} ${groupSQL}`;
            })
            .join(' ');
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-4xl font-medium">Users</h2>
                <div className="flex items-center gap-2 justify-between">
                    <div>{filteredData.length} Items</div>
                    <div className="flex gap-2 items-center">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            {showFilter ? 'Hide' : 'Show'} Filter
                        </Button>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Columns • {selectedColumns.length}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px]">
                                    <div className="space-y-4">
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                startIcon={<Search size={15} />}
                                                type="search"
                                                placeholder="Search columns..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full"
                                            />

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-fit"
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" />{' '}
                                                        Create
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <section>
                                                            <div className="mb-2">
                                                                <Label htmlFor="column-name">
                                                                    Enter column
                                                                    name
                                                                </Label>
                                                            </div>
                                                            <Input
                                                                id="column-name"
                                                                placeholder="Column name"
                                                                value={
                                                                    newColumnName
                                                                }
                                                                onChange={(e) =>
                                                                    setNewColumnName(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </section>

                                                        <section>
                                                            <div className="mb-2">
                                                                <Label>
                                                                    Select
                                                                    column type
                                                                </Label>
                                                            </div>
                                                            <Select
                                                                value={
                                                                    newColumnType
                                                                }
                                                                onValueChange={
                                                                    setNewColumnType
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select column type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="string">
                                                                        <div className="flex gap-2 items-center">
                                                                            <Type
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span>
                                                                                String
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="number">
                                                                        <div className="flex gap-2 items-center">
                                                                            <Hash
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span>
                                                                                Number
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="date">
                                                                        <div className="flex gap-2 items-center">
                                                                            <CalendarIcon
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span>
                                                                                Date
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="array">
                                                                        <div className="flex gap-2 items-center">
                                                                            <List
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span>
                                                                                Array
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="boolean">
                                                                        <div className="flex gap-2 items-center">
                                                                            <ToggleLeftIcon
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span>
                                                                                Boolean
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </section>
                                                        {newColumnType ===
                                                            'array' && (
                                                            <ArrayTypeSelector
                                                                value={
                                                                    newColumnArrayType
                                                                }
                                                                onChange={
                                                                    setNewColumnArrayType
                                                                }
                                                            />
                                                        )}
                                                        <Button
                                                            onClick={
                                                                handleCreateColumn
                                                            }
                                                        >
                                                            Create Column
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2 group hover:text-indigo-500 !cursor-pointer">
                                                <Checkbox
                                                    className={cn(
                                                        'mr-2 group-hover:outline-indigo-500/30 group-hover:outline group-hover:outline-4 transition-all duration-100 ease-in-out',
                                                    )}
                                                    id="deselectAll"
                                                    checked={
                                                        selectedColumns.length ===
                                                        0
                                                    }
                                                    onCheckedChange={
                                                        handleDeselectAll
                                                    }
                                                    disabled={
                                                        selectedColumns.length ===
                                                        0
                                                    }
                                                />
                                                <label
                                                    className="cursor-pointer"
                                                    htmlFor="deselectAll"
                                                >
                                                    Deselect All
                                                </label>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            {visibleFields.map((field) => (
                                                <div
                                                    key={field.name}
                                                    className="flex items-center space-x-2 group !cursor-pointer hover:text-indigo-500"
                                                >
                                                    <Checkbox
                                                        className={cn(
                                                            'group-hover:outline-indigo-500/30 group-hover:outline group-hover:outline-4 transition-all duration-100 ease-in-out mr-2',
                                                        )}
                                                        id={field.name}
                                                        checked={selectedColumns.includes(
                                                            field.name,
                                                        )}
                                                        onCheckedChange={() =>
                                                            handleColumnToggle(
                                                                field.name,
                                                            )
                                                        }
                                                    />
                                                    {getIconForDataType(
                                                        field.dataType,
                                                    )}
                                                    <label
                                                        className="cursor-pointer flex-grow flex gap-1 items-center"
                                                        htmlFor={field.name}
                                                    >
                                                        {field.label}
                                                        {
                                                            // If array, state the element type
                                                            field.dataType ===
                                                                'array' && (
                                                                <p className="text-zinc-400">
                                                                    (Array of{' '}
                                                                    {
                                                                        field.elementType
                                                                    }
                                                                    )
                                                                </p>
                                                            )
                                                        }
                                                    </label>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleHideColumn(
                                                                field.name,
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        {hiddenFields.length > 0 && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <h3 className="font-semibold mb-2">
                                                        Hidden Columns
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {hiddenFields.map(
                                                            (field) => (
                                                                <div
                                                                    key={
                                                                        field.name
                                                                    }
                                                                    className="flex items-center space-x-2 group !cursor-pointer hover:text-indigo-500"
                                                                >
                                                                    <Checkbox
                                                                        className={cn(
                                                                            'group-hover:outline-indigo-500/30 group-hover:outline group-hover:outline-4 transition-all duration-100 ease-in-out mr-2',
                                                                        )}
                                                                        id={`hidden-${field.name}`}
                                                                        checked={
                                                                            false
                                                                        }
                                                                        disabled
                                                                    />
                                                                    {getIconForDataType(
                                                                        field.dataType,
                                                                    )}
                                                                    <label
                                                                        className="cursor-pointer flex-grow"
                                                                        htmlFor={`hidden-${field.name}`}
                                                                    >
                                                                        {
                                                                            field.label
                                                                        }
                                                                    </label>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleUnhideColumn(
                                                                                field.name,
                                                                            )
                                                                        }
                                                                    >
                                                                        <EyeOff className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <Separator />
                                        <div className="flex gap-2 items-center">
                                            <p>
                                                {selectedColumns.length === 0
                                                    ? 'No columns selected'
                                                    : `${selectedColumns.length} column${selectedColumns.length > 1 ? 's' : ''} selected`}
                                            </p>
                                            <Button
                                                className={cn(
                                                    // If no columns are selected, hide the clear button
                                                    selectedColumns.length ===
                                                        0 && 'hidden',
                                                )}
                                                onClick={handleClear}
                                                variant="secondary"
                                            >
                                                <X className="h-4 w-4 mr-1" />{' '}
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* Add search for all columns */}
                        <Input
                            startIcon={<Search size={15} />}
                            type="search"
                            placeholder="Search all columns..."
                            className="w-fit"
                            value={globalSearchTerm}
                            onChange={(e) =>
                                setGlobalSearchTerm(e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            {query.groups.map((group, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => toggleCombinator(index - 1)}
                            className="my-2 w-full"
                        >
                            {query.combinators[index - 1].toUpperCase()}
                        </Button>
                    )}
                    {renderGroup(group, index)}
                </React.Fragment>
            ))}
            <div className="mt-4">
                <Button variant="outline" onClick={addGroup}>
                    <Group className="h-4 w-4 mr-2" />
                    Add Group
                </Button>
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">SQL Query</h2>
                <p className="bg-gray-100 p-4 rounded w-full break-before-all">
                    {generateSQLQuery()}
                </p>
            </div>

            <h2 className="text-xl font-medium mt-4 mb-2">Query Results</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        {fields.map((field) => (
                            <TableHead key={field.name}>
                                {field.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map((item: any, rowIndex: number) => (
                        <TableRow key={rowIndex}>
                            {fields.map((field) => (
                                <TableCell key={field.name}>
                                    {renderCellContent(
                                        item,
                                        field.name,
                                        rowIndex,
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
