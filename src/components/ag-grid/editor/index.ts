import { ICellEditorParams } from "ag-grid-community";

export const AG_EDITOR_SELECT = 'ag-editor-select'

export interface CellEditorParams extends ICellEditorParams {
  componentProps: Record<string, any>
}