import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"
import { SEARCH_KEYS } from "../utils/constants"
import { getOptionsForKey, handleConvertSearchKeyToIncon } from "../utils/functions"
import type { IScholarshipFilterProps } from "../utils/types"

const ScholarshipFilter = ({ activeFilters, setActiveFilters }: IScholarshipFilterProps) => {

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

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                    <SlidersHorizontal className="size-4" />
                    <p>Filter Options</p>
                </div>
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
            </div>

            <Accordion type="multiple" defaultValue={[SEARCH_KEYS.SCHOLARSHIP_TYPE]} className="w-full">
                {Object.values(SEARCH_KEYS).map((key) => {
                    const options = getOptionsForKey(key as SEARCH_KEYS)
                    const selectedCount = activeFilters.filter((filter) => filter.key === key).length
                    const IconComponent = handleConvertSearchKeyToIncon(key);

                    return (
                        <AccordionItem key={key} value={key} className="border-b">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex justify-between w-full pr-2">
                                    <span className="flex items-center gap-2">
                                        {IconComponent && <IconComponent className="size-4 text-primary" />}
                                        {key}
                                    </span>
                                    {selectedCount > 0 && (
                                        <span className="bg-muted text-primary rounded-full size-5 flex items-center justify-center border border-primary/20">
                                            {selectedCount}
                                        </span>
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="">
                                <div className="space-y-2">
                                    {options.map((option) => {
                                        const isSelected = activeFilters.some((filter) => filter.key === key && filter.value === option)

                                        return (
                                            <div key={option} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${key}-${option}`}
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleFilter(key as SEARCH_KEYS, option)}
                                                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                />
                                                <Label htmlFor={`${key}-${option}`} className="cursor-pointer flex-1">
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
        </>
    )
}

export default ScholarshipFilter