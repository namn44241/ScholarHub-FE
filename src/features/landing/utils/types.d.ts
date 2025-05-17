export interface ISearchingStep {
    id: number,
    title: string,
    description: string,
    icon?: LucideIcon,
    image: {
        light: string;
        dark: string;
    }
}