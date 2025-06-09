import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { format, isValid, parse } from "date-fns"
import { type Control } from "react-hook-form"

interface DefaultDateInputProps {
    control: Control<any>
    name: string
    label?: string
    placeholder?: string
    description?: string
    required?: boolean
    disabled?: boolean
}

export function DefaultDateInput({
    control,
    name,
    label = "Date",
    placeholder = "DD/MM/YYYY",
    description,
    required = false,
    disabled = false,
}: DefaultDateInputProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // Safely format the date value for display
                let displayValue = "";
                
                try {
                    if (field.value) {
                        // Check if value is an ISO string
                        if (typeof field.value === 'string' && field.value.includes('-')) {
                            const date = new Date(field.value);
                            // Verify the date is valid before formatting
                            if (isValid(date)) {
                                displayValue = format(date, 'dd/MM/yyyy');
                            } else {
                                // If invalid ISO string, just show the raw value
                                displayValue = field.value;
                            }
                        } else {
                            // If already in dd/MM/yyyy format or other string
                            displayValue = field.value;
                        }
                    }
                } catch (error) {
                    // If any error occurs during formatting, fallback to the raw value
                    displayValue = field.value || "";
                    console.error("Date formatting error:", error);
                }

                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Input
                                placeholder={placeholder}
                                disabled={disabled}
                                value={displayValue}
                                required={required}
                                onChange={(e) => {
                                    // Always update with the raw input value
                                    field.onChange(e.target.value);
                                }}
                                onBlur={(e) => {
                                    field.onBlur();
                                    const dateValue = e.target.value;
                                    
                                    if (dateValue) {
                                        try {
                                            // Attempt to parse the date but don't crash if invalid
                                            const parsedDate = parse(dateValue, 'dd/MM/yyyy', new Date());
                                            
                                            // You can add custom validation logic here if needed
                                            // For example, setting a custom error in the form
                                            if (!isValid(parsedDate)) {
                                                // This could trigger form validation errors
                                                // but won't crash the component
                                            }
                                        } catch (error) {
                                            // Safely handle any parsing errors
                                            console.error("Date parsing error:", error);
                                        }
                                    }
                                }}
                            />
                        </FormControl>
                        {description && <FormDescription>{description}</FormDescription>}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    )
}
