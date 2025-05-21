import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNavigate } from "@tanstack/react-router"
import { ArrowUpRight, Info, Search, X } from 'lucide-react'
import { useState } from "react"
import type { IScholarshipSearchInputProps } from "../utils/types"
import SelectedFilters from "./selected-filters"

const ScholarshipSearchInput = ({
  value,
  setValue,
  activeFilters,
  removeFilter,
  clearAllFilters,
  isAuthenticated,
  onSearch
}: IScholarshipSearchInputProps & { onSearch: () => void }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isAlertVisible, setIsAlertVisible] = useState(true)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <Card
        className={`w-full bg-background rounded-full flex flex-row items-center gap-2 p-2 transition-all duration-300 border-muted-foreground/20 ${isFocused ? "ring-2 ring-primary/50 shadow-lg" : ""}`}
      >
        <div className={`p-2 ${isFocused ? "bg-primary/10" : "bg-muted"} rounded-full transition-colors duration-300`}>
          <Search className={`size-5 ${isFocused ? "text-primary" : ""}`} />
        </div>
        <Input
          type="text"
          placeholder="Search by description, keywords, or use filters..."
          className="bg-transparent dark:bg-transparent shadow-none border-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 w-full placeholder:text-muted-foreground"
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 rounded-full"
            onClick={() => setValue("")}
          >
            <X className="size-4" />
          </Button>
        )}
        <Button
          variant="default"
          className="px-4 rounded-full"
          onClick={onSearch}
        >
          Search
        </Button>
      </Card>
      <SelectedFilters
        activeFilters={activeFilters}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
      />
      {
        !isAuthenticated && isAlertVisible && (
          <Alert className="items-center bg-primary/10 shadow shadow-primary/30 border-primary text-primary">
            <Info className="size-4" />
            <AlertTitle className="flex justify-between items-end text-base">
              <p>Heads up!</p>
              <Button variant="ghost" size="sm" className="hover:bg-primary rounded-full" onClick={
                () => setIsAlertVisible(false)
              }>
                <X className="size-3" />
              </Button>
            </AlertTitle>
            <AlertDescription className="flex sm:flex-row flex-col justify-between items-center mt-2">
              <p className="font-medium text-base">Register to start building <span className="font-bold text-primary">your own profile</span> and get <span className="font-bold text-primary">personalized matches</span></p>
              <Button onClick={() => navigate({ to: "/auth/login" })}>
                Head to login
                <ArrowUpRight className="size-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )
      }
    </div>
  )
}

export default ScholarshipSearchInput
