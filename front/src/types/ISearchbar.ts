export type ISearchBar = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}