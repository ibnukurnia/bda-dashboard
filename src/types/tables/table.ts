type TableHeader = {
    title: string
}

export type TableProps = {
    headers: Array<TableHeader>
    rows: Array<any>
}