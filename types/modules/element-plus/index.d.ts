// row, column, cell, event


declare type TableRowClickEvent<T> = (row: T, column: import('element-plus').TableColumnCtx<T>, event: PointerEvent) => void

declare type TableContextMenuEvent<T> = (row: T, column: import('element-plus').TableColumnCtx<T>, clickEl: HTMLElement, event: PointerEvent) => void

declare type TableCellClickEvent<T> = (row: T, column: import('element-plus').TableColumnCtx<T>, cell: T[keyof T], event: PointerEvent) => void

declare type TableRowDblClickEvent<T> = TableCellClickEvent<T>

declare type TableCellDblClickEvent<T> = TableCellClickEvent<T>

declare type TableCellContextMenuEvent<T> = TableCellClickEvent<T>

declare type TableHeaderClickEvent<T> = (column: import('element-plus').TableColumnCtx<T>, event: PointerEvent) => void

declare type TableHeaderContextMenuEvent<T> = TableHeaderClickEvent<T>

declare type TableCurrentChangeEvent<T> = (currentRow: T, oldCurrentRow: T) => void

declare type TableSelectionChangeEvent<T> = (selection: T[]) => void
