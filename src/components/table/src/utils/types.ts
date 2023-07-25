import { TableProps } from "element-plus/es/components/table/src/table/defaults";
import { TableColumnCtx, TableColumn } from "element-plus";

export interface VTableProps<T> extends TableProps<T> {
  columns: TableColumnCtx<T>
}