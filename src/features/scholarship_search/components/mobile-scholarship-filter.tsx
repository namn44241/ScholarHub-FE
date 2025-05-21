import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { SEARCH_KEYS } from "../utils/constants"
import { getOptionsForKey, handleConvertSearchKeyToIncon } from "../utils/functions"
import type { IScholarshipFilterProps } from "../utils/types"

const MobileScholarshipFilter = ({ activeFilters, setActiveFilters }: IScholarshipFilterProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleFilter = (key: SEARCH_KEYS, value: string) => {
        const isSelected = activeFilters.some((filter) => filter.key === key && filter.value === value)

        if (isSelected) {
            setActiveFilters(activeFilters.filter((filter) => !(filter.key === key && filter.value === value)))
        } else {
            setActiveFilters([...activeFilters, { key, value }])
        }
    }

    const clearAllFilters = () => {
        setActiveFilters([])
    }

    const applyFilters = () => {
        setIsOpen(false)
    }

    const totalActiveFilters = activeFilters.length

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="relative flex items-center gap-2">
                    <SlidersHorizontal className="size-4" />
                    Filters
                    {totalActiveFilters > 0 && (
                        <span className="flex justify-center items-center bg-primary rounded-full size-5 text-muted">
                            {totalActiveFilters}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="p-2 rounded-t-xl h-[80vh]">
                <SheetHeader className="pb-4 border-b">
                    <SheetTitle className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal className="size-4" />
                            Filter Options
                        </span>
                        {activeFilters.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Clear all
                            </Button>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="py-4 h-[calc(100%-8rem)] overflow-y-auto">
                    <Accordion type="multiple" defaultValue={[SEARCH_KEYS.SCHOLARSHIP_TYPE]} className="w-full">
                        {Object.values(SEARCH_KEYS).map((key) => {
                            const options = getOptionsForKey(key as SEARCH_KEYS)
                            const selectedCount = activeFilters.filter((filter) => filter.key === key).length
                            const IconComponent = handleConvertSearchKeyToIncon(key);

                            return (
                                <AccordionItem key={key} value={key} className="border-b">
                                    <AccordionTrigger className="py-3 hover:no-underline">
                                        <div className="flex justify-between pr-2 w-full">
                                            <span className="flex items-center gap-2">
                                                {IconComponent && <IconComponent className="size-4 text-primary" />}
                                                {key}
                                            </span>
                                            {selectedCount > 0 && (
                                                <span className="flex justify-center items-center bg-muted border border-primary/20 rounded-full size-5 text-primary">
                                                    {selectedCount}
                                                </span>
                                            )}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3 py-1">
                                            {options.map((option) => {
                                                const isSelected = activeFilters.some((filter) => filter.key === key && filter.value === option)

                                                return (
                                                    <div key={option} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`mobile-${key}-${option}`}
                                                            checked={isSelected}
                                                            onCheckedChange={() => toggleFilter(key as SEARCH_KEYS, option)}
                                                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                        />
                                                        <Label htmlFor={`mobile-${key}-${option}`} className="flex-1 text-base cursor-pointer">
                                                            {option}
                                                        </Label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </div>

                <SheetFooter className="pt-4 border-t">
                    <Button className="w-full" onClick={applyFilters}>
                        Apply Filters ({totalActiveFilters})
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default MobileScholarshipFilter