
declare module 'xlsx-populate' {
  import Cell from "xlsx-populate/lib/Cell";
  import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate'
  export type HyperLinkOpts = {
    /**
     * The hyperlink to set, can be a Cell or an internal/external string.
     */
    hyperlink: string | Cell

    /**
     * Additional text to help the user understand more about the hyperlink.
     */
    tooltip: string

    /**
     * Email address, ignored if opts.hyperlink is set.
     */
    email: string

    /**
     * Email subject, ignored if opts.hyperlink is set.
     */
    emailSubject: string
  }

  export type DataValidationAttr = {
    type: any
    allowBlank: any
    showInputMessage: any
    prompt: any
    promptTitle: string
    showErrorMessage: any
    error: any
    errorTitle: string
    operator: any
    sqref: any
    [key: string]: any
  }

  export type AddressOpts = {
    /**
     * Include the sheet name in the address.
     */
    includeSheetName: boolean
    /**
     * Anchor the row.
     */
    rowAnchored: boolean
    /**
     * Anchor the column.
     */
    columnAnchored: boolean
    /**
     * Anchor both the row and the column.
     */
    anchored: boolean
  }

  export default XlsxPopulate
}

declare module 'xlsx-populate/browser/xlsx-populate' {

  import Workbook from 'xlsx-populate/lib/Workbook'

  class XlsxPopulate {
    static MIME_TYPE: string

    static fromBlankAsync(): Promise<Workbook>

    static fromDataAsync(data: string | number[] | ArrayBuffer | Uint8Array | Blob | Promise<any>, opts?: object): Promise<Workbook>

    static fromFileAsync(path: string, opts?: object): Promise<Workbook>

    static numberToDate(num: number): Date
  }


  export default XlsxPopulate
}

declare module 'xlsx-populate/lib/Workbook' {

  import Sheet from "xlsx-populate/lib/Sheet";
  import Cell from "xlsx-populate/lib/Cell";
  import Row from "xlsx-populate/lib/Row";
  import Column from "xlsx-populate/lib/Column";
  import Range from "xlsx-populate/lib/Range";
  import CoreProperties from "xlsx-populate/lib/CoreProperties";
  import SharedStrings from "xlsx-populate/lib/SharedStrings";

  class Workbook {
    static MIME_TYPE: string

    static fromBlankAsync(): Promise<Workbook>

    static fromDataAsync(data: string | number[] | ArrayBuffer | Uint8Array | Blob | Promise<any>, opts: object): Promise<Workbook>

    static fromFileAsync(path: string, opts: object): Promise<any>

    /**
     * Get the active sheet in the workbook.
     * @returns The active sheet.
     */
    activeSheet(): Sheet

    /**
     * Set the active sheet in the workbook.
     * @param sheet - The sheet or name of sheet or index of sheet to activate. The sheet must not be hidden.
     * @returns {Workbook} The workbook.
     */
    activeSheet(sheet?: Sheet | number | string): Workbook


    /**
     * Add a new sheet to the workbook.
     * @param {string} name - The name of the sheet. Must be unique, less than 31 characters, and may not contain the following characters: \ / * [ ] : ?
     * @param {number|string|Sheet} [indexOrBeforeSheet] The index to move the sheet to or the sheet (or name of sheet) to move this sheet before. Omit this argument to move to the end of the workbook.
     * @returns {Sheet} The new sheet.
     */
    addSheet(name: string, indexOrBeforeSheet: number | string | Sheet): Sheet

    /**
     * Gets a defined name scoped to the workbook.
     * @param name - The defined name.
     * @returns What the defined name refers to or undefined if not found. Will return the string formula if not a Row, Column, Cell, or Range.
     */
    definedName(name: string): undefined | string | Cell | Range | Row | Column

    /**
     * Set a defined name scoped to the workbook.
     * @param {string} name - The defined name.
     * @param {string|Cell|Range|Row|Column} refersTo - What the name refers to.
     * @returns {Workbook} The workbook.
     */
    definedName(name: string, refersTo: string | Cell | Range | Row | Column): Workbook

    /**
     * Delete a sheet from the workbook.
     * @param sheet - The sheet or name of sheet or index of sheet to move.
     * @returns The workbook.
     */
    deleteSheet(sheet: Sheet | string | number): Workbook

    /**
     * Find the given pattern in the workbook and optionally replace it.
     * @param pattern - The pattern to look for. Providing a string will result in a case-insensitive substring search. Use a RegExp for more sophisticated searches.
     * @param replacement - The text to replace or a String.replace callback function. If pattern is a string, all occurrences of the pattern in each cell will be replaced.
     * @returns A flag indicating if the pattern was found.
     */
    find(pattern: string | RegExp, replacement: string | Function): boolean

    /**
     * Move a sheet to a new position.
     * @param sheet - The sheet or name of sheet or index of sheet to move.
     * @param [indexOrBeforeSheet] The index to move the sheet to or the sheet (or name of sheet) to move this sheet before. Omit this argument to move to the end of the workbook.
     * @returns The workbook.
     */
    moveSheet(sheet: Sheet | string | number, indexOrBeforeSheet: number | string | Sheet): Workbook

    /**
     * Generates the workbook output.
     * @param {OutputAsyncOpts} [opts] Options
     * @returns {Promise<string|Uint8Array|ArrayBuffer|Blob|Buffer>} The data.
     */
    outputAsync(opts?: string | OutputAsyncOpts): Promise<string | Uint8Array | ArrayBuffer | Blob>

    /**
     * Gets the sheet with the provided name or index (0-based).
     * @param {string|number} sheetNameOrIndex - The sheet name or index.
     * @returns {Sheet|undefined} The sheet or undefined if not found.
     */
    sheet(sheetNameOrIndex: string | number): Sheet | undefined

    /**
     * Get an array of all the sheets in the workbook.
     * @returns {Array.<Sheet>} The sheets.
     */
    sheets(): Sheet[]

    /**
     * Gets an individual property.
     * @param {string} name - The name of the property.
     * @returns {*} The property.
     */
    property(name: string): any

    /**
     * Gets multiple properties.
     * @param {Array.<string>} names - The names of the properties.
     * @returns {object.<string, *>} Object whose keys are the property names and values are the properties.
     */
    property(names: string[]): Record<string, any>

    /**
     * Sets an individual property.
     * @param {string} name - The name of the property.
     * @param {*} value - The value to set.
     * @returns {Workbook} The workbook.
     */
    property(name: string, value: any): Workbook


    /**
     * Sets multiple properties.
     * @param {object.<string, *>} properties - Object whose keys are the property names and values are the values to set.
     * @returns {Workbook} The workbook.
     */
    property(properties: Record<string, any>): Workbook

    /**
     * Get access to core properties object
     * @returns {CoreProperties} The core properties.
     */
    properties(): CoreProperties

    /**
     * Write the workbook to file. (Not supported in browsers.)
     * @param {string} path - The path of the file to write.
     * @param {ToFileAsyncOpts} [opts] - Options
     * @returns {Promise.<undefined>} A promise.
     */
    toFileAsync(path: string, opts?: ToFileAsyncOpts): Promise<void>

    /**
     * Add a new sheet to the workbook.
     *
     * **WARN:** this function has limits:  if you clone a sheet with some images or other things link outside the Sheet object, these things in the cloned sheet will be locked when you open in MS Excel app.
     * @param {Sheet} from - The sheet to be cloned.
     * @param {string} name - The name of the new sheet. Must be unique, less than 31 characters, and may not contain the following characters: \ / * [ ] : ?
     * @param {number|string|Sheet} [indexOrBeforeSheet] The index to move the sheet to or the sheet (or name of sheet) to move this sheet before. Omit this argument to move to the end of the workbook.
     * @returns {Sheet} The new sheet.
     */
    cloneSheet(from: Sheet, name: string, indexOrBeforeSheet: number | string | Sheet): Sheet

    /**
     * Gets a scoped defined name.
     * @param {Sheet} sheetScope - The sheet the name is scoped to. Use undefined for workbook scope.
     * @param {string} name - The defined name.
     * @returns {undefined|Cell|Range|Row|Column} What the defined name refers to.
     * @ignore
     */
    scopedDefinedName(sheetScope: Sheet, name: string): undefined | Cell | Range | Row | Column

    /**
     * Sets a scoped defined name.
     * @param {Sheet} sheetScope - The sheet the name is scoped to. Use undefined for workbook scope.
     * @param {string} name - The defined name.
     * @param {undefined|Cell|Range|Row|Column} refersTo - What the defined name refers to.
     * @returns {Workbook} The workbook.
     * @ignore
     */
    scopedDefinedName(sheetScope: Sheet, name: string, refersTo: undefined | Cell | Range | Row | Column): Workbook


    /**
     * Get the shared strings table.
     * @returns {SharedStrings} The shared strings table.
     * @ignore
     */
    sharedStrings(): SharedStrings

    /**
     * Get the style sheet.
     * @returns {StyleSheet} The style sheet.
     * @ignore
     */
    styleSheet(): StyleSheet

  }

  type OutputAsyncOpts = {

    /**
     * The type of the data to return: base64, binarystring, uint8array, arraybuffer, blob, nodebuffer. Defaults to 'nodebuffer' in Node.js and 'blob' in browsers.
     */
    type: string

    /**
     * The password to use to encrypt the workbook.
     */
    password: string
  }

  type ToFileAsyncOpts = {
    /**
     * The password to encrypt the workbook.
     */
    password: string
  }

  export default Workbook
}

declare module 'xlsx-populate/lib/Sheet' {
  import Cell from "xlsx-populate/lib/Cell";
  import Column from "xlsx-populate/lib/Column";
  import Row from "xlsx-populate/lib/Row";
  import Workbook from "xlsx-populate/lib/Workbook";
  import Range from "xlsx-populate/lib/Range";
  import PageBreaks from "xlsx-populate/lib/PageBreaks";
  import {HyperLinkOpts} from "xlsx-populate";

  class Sheet {

    /**
     * Creates a new instance of Sheet.
     * @param {Workbook} workbook - The parent workbook.
     * @param {{}} idNode - The sheet ID node (from the parent workbook).
     * @param {{}} node - The sheet node.
     * @param {{}} [relationshipsNode] - The optional sheet relationships node.
     */
    constructor(workbook: Workbook, idNode, node, relationshipsNode)

    /**
     * Gets a value indicating whether the sheet is the active sheet in the workbook.
     * @returns {boolean} True if active, false otherwise.
     */
    active(): boolean

    /**
     * Make the sheet the active sheet in the workkbok.
     * @param {boolean} active - Must be set to `true`. Deactivating directly is not supported. To deactivate, you should activate a different sheet instead.
     * @returns {Sheet} The sheet.
     */
    active(active: boolean): Sheet

    /**
     * Get the active cell in the sheet.
     * @returns {Cell} The active cell.
     */
    activeCell(): Cell

    /**
     * Set the active cell in the workbook.
     * @param {string|Cell} cell - The cell or address of cell to activate.
     * @returns {Sheet} The sheet.
     */
    activeCell(cell: string | Cell): Sheet

    /**
     * Set the active cell in the workbook by row and column.
     * @param {number} rowNumber - The row number of the cell.
     * @param {string|number} columnNameOrNumber - The column name or number of the cell.
     * @returns {Sheet} The sheet.
     */
    activeCell(rowNumber: number, columnNameOrNumber: string | number): Sheet

    /**
     * Gets the cell with the given address.
     * @param {string} address - The address of the cell.
     * @returns {Cell} The cell.
     */
    cell(address: string): Cell

    /**
     * Gets the cell with the given row and column numbers.
     * @param {number} rowNumber - The row number of the cell.
     * @param {string|number} columnNameOrNumber - The column name or number of the cell.
     * @returns {Cell} The cell.
     */
    cell(rowNumber: number, columnNameOrNumber: string | number): Cell

    /**
     * Gets a column in the sheet.
     * @param {string|number} columnNameOrNumber - The name or number of the column.
     * @returns {Column} The column.
     */
    column(columnNameOrNumber: string | number): Column

    /**
     * Gets a defined name scoped to the sheet.
     * @param {string} name - The defined name.
     * @returns {undefined|string|Cell|Range|Row|Column} What the defined name refers to or undefined if not found. Will return the string formula if not a Row, Column, Cell, or Range.
     */
    definedName(name: string): undefined | string | Cell | Range | Row | Column

    /**
     * Set a defined name scoped to the sheet.
     * @param {string} name - The defined name.
     * @param {string|Cell|Range|Row|Column} refersTo - What the name refers to.
     * @returns {Workbook} The workbook.
     */
    definedName(name: string, refersTo: string | Cell | Range | Row | Column): Workbook

    /**
     * Deletes the sheet and returns the parent workbook.
     * @returns {Workbook} The workbook.
     */
    delete(): Workbook

    /**
     * Find the given pattern in the sheet and optionally replace it.
     * @param {string|RegExp} pattern - The pattern to look for. Providing a string will result in a case-insensitive substring search. Use a RegExp for more sophisticated searches.
     * @param {string|function} [replacement] - The text to replace or a String.replace callback function. If pattern is a string, all occurrences of the pattern in each cell will be replaced.
     * @returns {Array.<Cell>} The matching cells.
     */
    find(pattern: string | RegExp, replacement: string | Function): Cell[]

    /**
     * Gets a value indicating whether this sheet's grid lines are visible.
     * @returns {boolean} True if selected, false if not.
     */
    gridLinesVisible(): boolean

    /**
     * Sets whether this sheet's grid lines are visible.
     * @param {boolean} selected - True to make visible, false to hide.
     * @returns {Sheet} The sheet.
     */
    gridLinesVisible(selected: boolean): Sheet

    /**
     * Gets a value indicating if the sheet is hidden or not.
     * @returns {boolean|string} True if hidden, false if visible, and 'very' if very hidden.
     */
    hidden(): boolean | string

    /**
     * Set whether the sheet is hidden or not.
     * @param {boolean|string} hidden - True to hide, false to show, and 'very' to make very hidden.
     * @returns {Sheet} The sheet.
     */
    hidden(hidden: boolean | string): Sheet

    /**
     * Move the sheet.
     * @param {number|string|Sheet} [indexOrBeforeSheet] The index to move the sheet to or the sheet (or name of sheet) to move this sheet before. Omit this argument to move to the end of the workbook.
     * @returns {Sheet} The sheet.
     */
    move(indexOrBeforeSheet: number | string | Sheet): Sheet

    /**
     * Get the name of the sheet.
     * @returns {string} The sheet name.
     */
    name(): string

    /**
     * Set the name of the sheet. *Note: this method does not rename references to the sheet so formulas, etc. can be broken. Use with caution!*
     * @param {string} name - The name to set to the sheet.
     * @returns {Sheet} The sheet.
     */
    name(name: string): Sheet

    /**
     * Gets a range from the given range address.
     * @param {string} address - The range address (e.g. 'A1:B3').
     * @returns {Range} The range.
     */
    range(address: string): Range

    /**
     * Gets a range from the given cells or cell addresses.
     * @param {string|Cell} startCell - The starting cell or cell address (e.g. 'A1').
     * @param {string|Cell} endCell - The ending cell or cell address (e.g. 'B3').
     * @returns {Range} The range.
     */
    range(startCell: string | Cell, endCell: string | Cell): Range

    /**
     * Gets a range from the given row numbers and column names or numbers.
     * @param {number} startRowNumber - The starting cell row number.
     * @param {string|number} startColumnNameOrNumber - The starting cell column name or number.
     * @param {number} endRowNumber - The ending cell row number.
     * @param {string|number} endColumnNameOrNumber - The ending cell column name or number.
     * @returns {Range} The range.
     */
    range(startRowNumber: number, startColumnNameOrNumber: string | number, endRowNumber: number, endColumnNameOrNumber: string | number): Range

    /**
     * Unsets sheet autoFilter.
     * @returns {Sheet} This sheet.
     */
    autoFilter(): Sheet

    /**
     * Sets sheet autoFilter to a Range.
     * @param {Range} range - The autoFilter range.
     * @returns {Sheet} This sheet.
     */
    autoFilter(range: Range): Sheet

    /**
     * Gets the row with the given number.
     * @param {number} rowNumber - The row number.
     * @returns {Row} The row with the given number.
     */
    row(rowNumber: number): Row


    /**
     * Get the tab color. (See style [Color](#color).)
     * @returns {undefined|Color} The color or undefined if not set.
     */
    tabColor(): undefined | Color

    /**
     * Sets rgb of the tab color. (See style [Color](#color).)
     * @returns {Color|string|number} color - Color of the tab. If string, will set an RGB color. If number, will set a theme color.
     */
    tabColor(rgb: string): Sheet

    /**
     * Sets theme of the tab color. (See style [Color](#color).)
     * @returns {Color|string|number} color - Color of the tab. If string, will set an RGB color. If number, will set a theme color.
     */
    tabColor(theme: number): Sheet

    /**
     * Sets the tab color. (See style [Color](#color).)
     * @returns {Color|string|number} color - Color of the tab. If string, will set an RGB color. If number, will set a theme color.
     */
    tabColor(color: Color): Sheet

    /**
     * Gets a value indicating whether this sheet is selected.
     * @returns {boolean} True if selected, false if not.
     */
    tabSelected(): boolean

    /**
     * Sets whether this sheet is selected.
     * @param {boolean} selected - True to select, false to deselected.
     * @returns {Sheet} The sheet.
     */
    tabSelected(selected: boolean): Sheet

    /**
     * Gets a value indicating whether this sheet is rtl (Right To Left).
     * @returns {boolean} True if rtl, false if ltr.
     */
    rightToLeft(): boolean

    /**
     * Sets whether this sheet is rtl.
     * @param {boolean} rtl - True to rtl, false to ltr (Left To Right).
     * @returns {Sheet} The sheet.
     */
    rightToLeft(rtl: boolean): Sheet

    /**
     * Get the range of cells in the sheet that have contained a value or style at any point. Useful for extracting the entire sheet contents.
     * @returns {Range|undefined} The used range or undefined if no cells in the sheet are used.
     */
    usedRange(): Range | undefined

    /**
     * Gets the parent workbook.
     * @returns {Workbook} The parent workbook.
     */
    workbook(): Workbook

    /**
     * Gets all page breaks.
     * @returns {{}} the object holds both vertical and horizontal PageBreaks.
     */
    pageBreaks(): PageBreaksResult


    /**
     * Gets the vertical page breaks.
     * @returns {PageBreaks} vertical PageBreaks.
     */
    verticalPageBreaks(): PageBreaks

    /**
     * Gets the horizontal page breaks.
     * @returns {PageBreaks} horizontal PageBreaks.
     */
    horizontalPageBreaks(): PageBreaks


    /**
     * Get the hyperlink attached to the cell with the given address.
     * @param {string} address - The address of the hyperlinked cell.
     * @returns {string|undefined} The hyperlink or undefined if not set.
     */
    hyperlink(address: string): string | undefined

    /**
     * Set the hyperlink on the cell with the given address.
     * @param {string} address - The address of the hyperlinked cell.
     * @param {string} hyperlink - The hyperlink to set or undefined to clear.
     * @param {boolean} [internal] - The flag to force hyperlink to be internal. If true, then autodetect is skipped.
     * @returns {Sheet} The sheet.
     */
    hyperlink(address: string, hyperlink: string, internal: boolean): Sheet

    /**
     * Set the hyperlink on the cell with the given address. If opts is a Cell an internal hyperlink is added.
     * @param {string} address - The address of the hyperlinked cell.
     * @param {object|Cell} opts - Options.
     * @returns {Sheet} The sheet.
     * @ignore
     */
    hyperlink(address: string, opts: object | Cell): Sheet

    /**
     * Set the hyperlink on the cell with the given address and options.
     * @param {string} address - The address of the hyperlinked cell.
     * @param {HyperLinkOpts|Cell} opts - Options or Cell. If opts is a Cell then an internal hyperlink is added.
     * @returns {Sheet} The sheet.
     */
    hyperlink(address: string, opts: HyperLinkOpts | Cell)


    /**
     * Get the print option given a valid print option attribute.
     * @param {string} attributeName - Attribute name of the printOptions.
     *   gridLines - Used in conjunction with gridLinesSet. If both gridLines and gridlinesSet are true, then grid lines shall print. Otherwise, they shall not (i.e., one or both have false values).
     *   gridLinesSet - Used in conjunction with gridLines. If both gridLines and gridLinesSet are true, then grid lines shall print. Otherwise, they shall not (i.e., one or both have false values).
     *   headings - Print row and column headings.
     *   horizontalCentered - Center on page horizontally when printing.
     *   verticalCentered - Center on page vertically when printing.
     * @returns {boolean}
     */
    printOptions(attributeName: string): boolean

    /**
     * Set the print option given a valid print option attribute and a value.
     * @param {string} attributeName - Attribute name of the printOptions. See get print option for list of valid attributes.
     * @param {undefined|boolean} attributeEnabled - If `undefined` or `false` then the attribute is removed, otherwise the print option is enabled.
     * @returns {Sheet} The sheet.
     */
    printOptions(attributeName: string, attributeEnabled: undefined | boolean): Sheet

    /**
     * Get the print option for the gridLines attribute value.
     * @returns {boolean}
     */
    printGridLines()

    /**
     * Set the print option for the gridLines attribute value.
     * @param {undefined|boolean} enabled - If `undefined` or `false` then attribute is removed, otherwise gridLines is enabled.
     * @returns {Sheet} The sheet.
     */
    printGridLines(enabled: boolean | undefined): Sheet

    /**
     * Get the page margin given a valid attribute name.
     * If the value is not yet defined, then it will return the current preset value.
     * @param {string} attributeName - Attribute name of the pageMargins.
     *     left - Left Page Margin in inches.
     *     right - Right page margin in inches.
     *     top - Top Page Margin in inches.
     *     buttom - Bottom Page Margin in inches.
     *     footer - Footer Page Margin in inches.
     *     header - Header Page Margin in inches.
     * @returns {number} the attribute value.
     */
    pageMargins(attributeName: string): number

    /**
     * Set the page margin (or override the preset) given an attribute name and a value.
     * @param {string} attributeName - Attribute name of the pageMargins. See get page margin for list of valid attributes.
     * @param {undefined|number|string} attributeStringValue - If `undefined` then set back to preset value, otherwise, set the given attribute value.
     * @returns {Sheet} The sheet.
     */
    pageMargins(attributeName: string, attributeStringValue: undefined | number | string): Sheet

    /**
     * Page margins preset is a set of page margins associated with a name.
     * The page margin preset acts as a fallback when not explicitly defined by `Sheet.pageMargins`.
     * If a sheet already contains page margins, it attempts to auto-detect, otherwise they are defined as the template preset.
     * If no page margins exist, then the preset is undefined and will not be included in the output of `Sheet.toXmls`.
     * Available presets include: normal, wide, narrow, template.
     *
     * Get the page margins preset name. The registered name of a predefined set of attributes.
     * @returns {string} The preset name.
     */
    pageMarginsPreset(): string

    /**
     * Set the page margins preset by name, clearing any existing/temporary attribute values.
     * @param {undefined|string} presetName - The preset name. If `undefined`, page margins will not be included in the output of `Sheet.toXmls`.
     * @returns {Sheet} The sheet.
     */
    pageMarginsPreset(presetName: undefined | string): Sheet

    /**
     * Set a new page margins preset by name and attributes object.
     * @param {string} presetName - The preset name.
     * @param {object} presetAttributes - The preset attributes.
     * @returns {Sheet} The sheet.
     */
    pageMarginsPreset(presetName: string, presetAttributes: Record<string, any>): Sheet

    /**
     * Gets sheet view pane options
     * @return {PaneOptions} sheet view pane options
     */
    panes(): PaneOptions

    /**
     * Sets sheet view pane options
     * @param {PaneOptions|null|undefined} paneOptions sheet view pane options
     * @return {Sheet} The sheet
     */
    panes(paneOptions: PaneOptions | null | undefined): Sheet

    /**
     * Freezes Panes for this sheet.
     * @param {number} xSplit the number of columns visible in the top pane. 0 (zero) if none.
     * @param {number} ySplit the number of rows visible in the left pane. 0 (zero) if none.
     * @return {Sheet} The sheet
     */
    freezePanes(xSplit: number, ySplit: number): Sheet

    /**
     * freezes Panes for this sheet.
     * @param {string} topLeftCell Top Left Visible Cell. Location of the top left visible cell in the bottom
     * right pane (when in Left-To-Right mode).
     * @return {Sheet} The sheet
     */
    freezePanes(topLeftCell: string): Sheet

    /**
     * Splits Panes for this sheet.
     * @param {number} xSplit (Horizontal Split Position) Horizontal position of the split,
     * in 1/20th of a point; 0 (zero) if none.
     * @param {number} ySplit (Vertical Split Position) VVertical position of the split,
     * in 1/20th of a point; 0 (zero) if none.
     * @return {Sheet} The sheet
     */
    splitPanes(xSplit: number, ySplit: number): Sheet

    /**
     * resets to default sheet view panes.
     * @return {Sheet} The sheet
     */
    resetPanes(): Sheet

  }

  /**
   * https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.pane?view=openxml-2.8.1
   */
  type PaneOptions = {
    /**
     * Split State. Indicates whether the pane has horizontal / vertical splits,
     * and whether those splits are frozen.
     */
    state: 'split' | 'frozen' | 'frozenSplit'
    /**
     * Active Pane. The pane that is active.
     */
    activePane: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
    /**
     * Top Left Visible Cell. Location of the top left visible cell in the bottom
     * right pane (when in Left-To-Right mode).
     */
    topLeftCell: string
    /**
     * (Horizontal Split Position) Horizontal position of the split, in 1/20th of a point;
     * 0 (zero) if none. If the pane is frozen, this value indicates the number of columns visible in the top pane.
     */
    xSplit: number
    /**
     * (Vertical Split Position) Vertical position of the split, in 1/20th of a point; 0
     * (zero) if none. If the pane is frozen, this value indicates the number of rows visible in the left pane.
     */
    ySplit: number
  }


  type PageBreaksResult = {
    colBreaks: PageBreaks
    rowBreaks: PageBreaks
  }

  interface Color extends Record<string, string | number | any> {
    rgb: string
    theme: number
    tint: any
  }

  export default Sheet
}

declare module 'xlsx-populate/lib/Cell' {
  import Column from "xlsx-populate/lib/Column";
  import Row from "xlsx-populate/lib/Row";
  import Workbook from "xlsx-populate/lib/Workbook";
  import Range from "xlsx-populate/lib/Range";
  import {HyperLinkOpts, DataValidationAttr, AddressOpts} from "xlsx-populate";
  import Sheet from "xlsx-populate/lib/Sheet";
  import Style from "xlsx-populate/lib/Style";
  import RichText from "xlsx-populate/lib/RichText";

  class Cell {
    /**
     * Creates a new instance of cell.
     * @param {Row} row - The parent row.
     * @param {{}} node - The cell node.
     * @param {number} styleId - The cell node.
     */
    constructor(row: Row, node: object, styleId: number)

    /**
     * Gets a value indicating whether the cell is the active cell in the sheet.
     * @returns {boolean} True if active, false otherwise.
     */
    active(): boolean

    /**
     * Make the cell the active cell in the sheet.
     * @param {boolean} active - Must be set to `true`. Deactivating directly is not supported. To deactivate, you should activate a different cell instead.
     * @returns {Cell} The cell.
     */
    active(active: boolean): Cell

    /**
     * Get the address of the column.
     * @param {AddressOpts} [opts] - Options
     * @returns {string} The address
     */
    address(opts: AddressOpts): string

    /**
     * Gets the parent column of the cell.
     * @returns {Column} The parent column.
     */
    column(): Column

    /**
     * Clears the contents from the cell.
     * @returns {Cell} The cell.
     */
    clear(): Cell

    /**
     * Gets the column name of the cell.
     * @returns {string} The column name.
     */
    columnName(): string

    /**
     * Gets the column number of the cell (1-based).
     * @returns {number} The column number.
     */
    columnNumber(): number

    /**
     * Find the given pattern in the cell and optionally replace it.
     * @param {string|RegExp} pattern - The pattern to look for. Providing a string will result in a case-insensitive substring search. Use a RegExp for more sophisticated searches.
     * @param {string|function} [replacement] - The text to replace or a String.replace callback function. If pattern is a string, all occurrences of the pattern in the cell will be replaced.
     * @returns {boolean} A flag indicating if the pattern was found.
     */
    find(pattern: string | RegExp, replacement: string | Function): boolean

    /**
     * Gets the formula in the cell. Note that if a formula was set as part of a range, the getter will return 'SHARED'. This is a limitation that may be addressed in a future release.
     * @returns {string} The formula in the cell.
     */

    formula(): string

    /**
     * Sets the formula in the cell.
     * @param {string} formula - The formula to set.
     * @returns {Cell} The cell.
     */
    formula(formula: string): Cell

    /**
     * Gets the hyperlink attached to the cell.
     * @returns {string|undefined} The hyperlink or undefined if not set.
     */
    hyperlink(): string | undefined

    /**
     * Set or clear the hyperlink on the cell.
     * @param {string|Cell|undefined} hyperlink - The hyperlink to set or undefined to clear.
     * @returns {Cell} The cell.
     */
    hyperlink(hyperlink: string | Cell | undefined): Cell

    /**
     * Set the hyperlink options on the cell.
     * @param { HyperLinkOpts |Cell} opts - Options or Cell. If opts is a Cell then an internal hyperlink is added.
     * @returns {Cell} The cell.
     */
    hyperlink(opts: HyperLinkOpts | Cell): Cell

    /**
     * Gets the data validation object attached to the cell.
     * @returns {DataValidationAttr|undefined} The data validation or undefined if not set.
     */
    dataValidation(): DataValidationAttr | undefined


    /**
     * Set or clear the data validation object of the cell.
     * @param {DataValidationAttr|undefined} dataValidation - Object or null to clear.
     * @returns {Cell} The cell.
     */
    dataValidation(dataValidation: DataValidationAttr | undefined): Cell


    /**
     * Invoke a callback on the cell and return the cell. Useful for method chaining.
     * @param {Cell~tapCallback} callback - The callback function.
     * @returns {Cell} The cell.
     */
    tap(callback: TapCallback): Cell

    /**
     * Invoke a callback on the cell and return the value provided by the callback. Useful for method chaining.
     * @param {ThruCallback} callback - The callback function.
     * @returns {*} The return value of the callback.
     */
    thru(callback: ThruCallback): any


    /**
     * Create a range from this cell and another.
     * @param {Cell|string} cell - The other cell or cell address to range to.
     * @returns {Range} The range.
     */
    rangeTo(cell: string | Cell): Range


    /**
     * Returns a cell with a relative position given the offsets provided.
     * @param {number} rowOffset - The row offset (0 for the current row).
     * @param {number} columnOffset - The column offset (0 for the current column).
     * @returns {Cell} The relative cell.
     */
    relativeCell(rowOffset: number, columnOffset: number): Cell

    /**
     * Gets the parent row of the cell.
     * @returns {Row} The parent row.
     */
    row(): Row

    /**
     * Gets the row number of the cell (1-based).
     * @returns {number} The row number.
     */
    rowNumber(): number

    /**
     * Gets the parent sheet.
     * @returns {Sheet} The parent sheet.
     */
    sheet(): Sheet

    /**
     * Gets an individual style.
     * @param {string} name - The name of the style.
     * @returns {*} The style.
     */
    style(name: string): any

    /**
     * Gets multiple styles.
     * @param {Array.<string>} names - The names of the style.
     * @returns {object.<string, *>} Object whose keys are the style names and values are the styles.
     */
    style(names: string[][]): Record<string, any>

    /**
     * Sets an individual style.
     * @param {string} name - The name of the style.
     * @param {*} value - The value to set.
     * @returns {Cell} The cell.
     */
    style(name: string, value: any): Cell

    /**
     * Sets the styles in the range starting with the cell.
     * @param {string} name - The name of the style.
     * @param {Array.<Array.<*>>} values 2D array of values to set.
     * @returns {Range} The range that was set.
     */
    style(name: string, values: any[][]): Range

    /**
     * Sets multiple styles.
     * @param {object.<string, *>} nameValues - Object whose keys are the style names and values are the styles to set.
     * @returns {Cell} The cell.
     */
    style(nameValues: Record<string, any>): Cell

    /**
     * Sets to a specific style
     * @param {Style} style - Style object given from stylesheet.createStyle
     * @returns {Cell} The cell.
     */
    style(style: Style): Cell

    /**
     * Gets the value of the cell.
     * @returns {string|boolean|number|Date|RichText|undefined} The value of the cell.
     */
    value(): string | boolean | number | Date | RichText | undefined

    /**
     * Sets the value of the cell.
     * @param {string|boolean|number|null|undefined|RichText} value - The value to set.
     * @returns {Cell} The cell.
     */
    value(value: string | boolean | number | null | undefined | RichText): Cell

    /**
     * Sets the values in the range starting with the cell.
     * @param {Array.<Array.<string|boolean|number|null|undefined>>} data 2D array of values to set.
     * @returns {Range} The range that was set.
     */
    value(data: Array<Array<string | boolean | number | null | undefined>>): Range

    /**
     * Gets the parent workbook.
     * @returns {Workbook} The parent workbook.
     */
    workbook(): Workbook

    /**
     * Append horizontal page break after the cell.
     * @returns {Cell} the cell.
     */
    addHorizontalPageBreak(): Cell
  }

  type TapCallback = (cell: Cell) => void
  type ThruCallback = (cell: Cell) => any


  export default Cell
}

declare module 'xlsx-populate/lib/Range' {
  import Cell from "xlsx-populate/lib/Cell";
  import Column from "xlsx-populate/lib/Column";
  import Row from "xlsx-populate/lib/Row";
  import Workbook from "xlsx-populate/lib/Workbook";
  import PageBreaks from "xlsx-populate/lib/PageBreaks";
  import {HyperLinkOpts, DataValidationAttr, AddressOpts} from "xlsx-populate";
  import Sheet from "xlsx-populate/lib/Sheet";
  import Style from "xlsx-populate/lib/Style";
  import RichText from "xlsx-populate/lib/RichText";
  import RichTextFragment from "xlsx-populate/lib/RichTextFragment";


  class Range {

    /**
     * Creates a new instance of Range.
     * @param {Cell} startCell - The start cell.
     * @param {Cell} endCell - The end cell.
     */
    constructor(startCell: Cell, endCell: Cell)

    /**
     * Get the address of the range.
     * @param {AddressOpts} [opts] - Options
     * @returns {string} The address.
     */
    address(opts?: AddressOpts): string

    /**
     * Gets a cell within the range.
     * @param {number} ri - Row index relative to the top-left corner of the range (0-based).
     * @param {number} ci - Column index relative to the top-left corner of the range (0-based).
     * @returns {Cell} The cell.
     */
    cell(ri: number, ci: number): Cell

    /**
     * Sets sheet autoFilter to this range.
     * @returns {Range} This range.
     */
    autoFilter(): Range

    /**
     * Get the cells in the range as a 2D array.
     * @returns {Array.<Array.<Cell>>} The cells.
     */
    cells(): Cell[][]

    /**
     * Clear the contents of all the cells in the range.
     * @returns {Range} The range.
     */
    clear(): Range

    /**
     * Get the end cell of the range.
     * @returns {Cell} The end cell.
     */
    endCell(): Cell


    /**
     * Call a function for each cell in the range. Goes by row then column.
     * @param {RangeForEachCallback} callback - Function called for each cell in the range.
     * @returns {Range} The range.
     */
    forEach(callback: RangeForEachCallback): Range

    /**
     * Gets the shared formula in the start cell (assuming it's the source of the shared formula).
     * @returns {string|undefined} The shared formula.
     */
    formula(): string | undefined

    /**
     * Sets the shared formula in the range. The formula will be translated for each cell.
     * @param {string} formula - The formula to set.
     * @returns {Range} The range.
     */
    formula(formula: string): Range


    /**
     * Creates a 2D array of values by running each cell through a callback.
     * @param {RangeMapCallback} callback - Function called for each cell in the range.
     * @returns {Array.<Array.<*>>} The 2D array of return values.
     */
    map(callback: RangeMapCallback): any[][]


    /**
     * Gets a value indicating whether the cells in the range are merged.
     * @returns {boolean} The value.
     */
    merged(): boolean

    /**
     * Sets a value indicating whether the cells in the range should be merged.
     * @param {boolean} merged - True to merge, false to unmerge.
     * @returns {Range} The range.
     */
    merged(merged: boolean): Range


    /**
     * Gets the data validation object attached to the cell.
     * @returns {DataValidationAttr|undefined} The data validation or undefined if not set.
     */
    dataValidation(): DataValidationAttr | undefined


    /**
     * Set or clear the data validation object of the cell.
     * @param {DataValidationAttr|undefined} dataValidation - Object or null to clear.
     * @returns {Cell} The cell.
     */
    dataValidation(dataValidation: DataValidationAttr | undefined): Cell

    /**
     * Callback used by reduce.
     * @callback Range~reduceCallback
     * @param {*} accumulator - The accumulated value.
     * @param {Cell} cell - The cell.
     * @param {number} ri - The relative row index.
     * @param {number} ci - The relative column index.
     * @param {Range} range - The range.
     * @returns {*} The value to map to.
     */
    /**
     * Reduces the range to a single value accumulated from the result of a function called for each cell.
     * @param {Range~reduceCallback} callback - Function called for each cell in the range.
     * @param {*} [initialValue] - The initial value.
     * @returns {*} The accumulated value.
     */
    reduce(callback: RangeReduceCallback, initialValue: any): any

    /**
     * Gets the parent sheet of the range.
     * @returns {Sheet} The parent sheet.
     */
    sheet(): Sheet

    /**
     * Gets the start cell of the range.
     * @returns {Cell} The start cell.
     */
    startCell(): Cell


    /**
     * Gets a single style for each cell.
     * @param {string} name - The name of the style.
     * @returns {Array.<Array.<*>>} 2D array of style values.
     */
    style(name: string): any[][]

    /**
     * Gets multiple styles for each cell.
     * @param {Array.<string>} names - The names of the styles.
     * @returns {Object.<string, Array.<Array.<*>>>} Object whose keys are style names and values are 2D arrays of style values.
     */
    style(names: string[]): Record<string, any[][]>

    /**
     * Set the style in each cell to the result of a function called for each.
     * @param {string} name - The name of the style.
     * @param {Range~mapCallback} callback - The callback to provide value for the cell.
     * @returns {Range} The range.
     */
    style(name: string, callback: RangeMapCallback): Range

    /**
     * Sets the style in each cell to the corresponding value in the given 2D array of values.
     * @param {string} name - The name of the style.
     * @param {Array.<Array.<*>>} values - The style values to set.
     * @returns {Range} The range.
     */
    style(name: string, values: any[][]): Range

    /**
     * Set the style of all cells in the range to a single style value.
     * @param {string} name - The name of the style.
     * @param {*} value - The value to set.
     * @returns {Range} The range.
     */
    style(name: string, value: any): Range

    /**
     * Set multiple styles for the cells in the range.
     * @param {object.<string,Range~mapCallback|Array.<Array.<*>>|*>} styles - Object whose keys are style names and values are either function callbacks, 2D arrays of style values, or a single value for all the cells.
     * @returns {Range} The range.
     */
    style(styles: Record<string, RangeMapCallback | any[][] | any>): Range

    /**
     * Sets to a specific style
     * @param {Style} style - Style object given from stylesheet.createStyle
     * @returns {Range} The range.
     */
    style(style: Style): Range


    /**
     * Callback used by tap.
     * @callback Range~tapCallback
     * @param {Range} range - The range.
     * @returns {undefined}
     */
    /**
     * Invoke a callback on the range and return the range. Useful for method chaining.
     * @param {Range~tapCallback} callback - The callback function.
     * @returns {Range} The range.
     */
    tap(callback: RangeTapCallback): Range

    /**
     * Callback used by thru.
     * @callback Range~thruCallback
     * @param {Range} range - The range.
     * @returns {*} The value to return from thru.
     */
    /**
     * Invoke a callback on the range and return the value provided by the callback. Useful for method chaining.
     * @param {Range~thruCallback} callback - The callback function.
     * @returns {*} The return value of the callback.
     */
    thru(callback: RangeThruCallback): any

    /**
     * Get the values of each cell in the range as a 2D array.
     * @returns {Array.<Array.<*>>} The values.
     */
    value(): any[][]

    /**
     * Set the values in each cell to the result of a function called for each.
     * @param {Range~mapCallback} callback - The callback to provide value for the cell.
     * @returns {Range} The range.
     */
    value(callback: RangeMapCallback): Range

    /**
     * Sets the value in each cell to the corresponding value in the given 2D array of values.
     * @param {Array.<Array.<*>>} values - The values to set.
     * @returns {Range} The range.
     */
    value(values: any[][]): Range

    /**
     * Set the value of all cells in the range to a single value.
     * @param {*} value - The value to set.
     * @returns {Range} The range.
     */
    value(value: any): Range


    /**
     * Gets the parent workbook.
     * @returns {Workbook} The parent workbook.
     */
    workbook(): Workbook

  }

  type RangeForEachCallback = (cell: Cell, ri: number, ci: number, range: Range) => void
  type RangeMapCallback = (cell: Cell, ri: number, ci: number, range: Range) => void
  type RangeReduceCallback = (cell: Cell, ri: number, ci: number, range: Range) => void
  type RangeTapCallback = (range: Range) => void
  type RangeThruCallback = (range: Range) => any

  export default Range
}

declare module 'xlsx-populate/lib/Row' {
  import Cell from "xlsx-populate/lib/Cell";
  import Workbook from "xlsx-populate/lib/Workbook";
  import {AddressOpts} from "xlsx-populate";
  import Sheet from "xlsx-populate/lib/Sheet";
  import Style from "xlsx-populate/lib/Style";

  class Row {

    /**
     * Creates a new instance of Row.
     * @param {Sheet} sheet - The parent sheet.
     * @param {object} node - The row node.
     */
    constructor(sheet: Sheet, node: object)


    /**
     * Get the address of the row.
     * @param {{}} [opts] - Options
     * @param {boolean} [opts.includeSheetName] - Include the sheet name in the address.
     * @param {boolean} [opts.anchored] - Anchor the address.
     * @returns {string} The address
     */
    address(opts: AddressOpts): string

    /**
     * Get a cell in the row.
     * @param {string|number} columnNameOrNumber - The name or number of the column.
     * @returns {Cell} The cell.
     */
    cell(columnNameOrNumber: string | number): Cell

    /**
     * Gets the row height.
     * @returns {undefined|number} The height (or undefined).
     */
    height(): undefined | number

    /**
     * Sets the row height.
     * @param {number} height - The height of the row.
     * @returns {Row} The row.
     */
    height(height: number): Row

    /**
     * Gets a value indicating whether the row is hidden.
     * @returns {boolean} A flag indicating whether the row is hidden.
     */
    hidden(): boolean

    /**
     * Sets whether the row is hidden.
     * @param {boolean} hidden - A flag indicating whether to hide the row.
     * @returns {Row} The row.
     */
    hidden(hidden: boolean): Row

    /**
     * Gets the row number.
     * @returns {number} The row number.
     */
    rowNumber(): number

    /**
     * Gets the parent sheet of the row.
     * @returns {Sheet} The parent sheet.
     */
    sheet(): Sheet

    /**
     * Gets an individual style.
     * @param {string} name - The name of the style.
     * @returns {*} The style.
     */
    style(name: string): any

    /**
     * Gets multiple styles.
     * @param {Array.<string>} names - The names of the style.
     * @returns {object.<string, *>} Object whose keys are the style names and values are the styles.
     */
    style(names: string[]): Record<string, any>

    /**
     * Sets an individual style.
     * @param {string} name - The name of the style.
     * @param {*} value - The value to set.
     * @returns {Cell} The cell.
     */
    style(name: string, value: any): Cell

    /**
     * Sets multiple styles.
     * @param {object.<string, *>} styles - Object whose keys are the style names and values are the styles to set.
     * @returns {Cell} The cell.
     */
    style(styles: Record<string, any>): Cell

    /**
     * Sets to a specific style
     * @param {Style} style - Style object given from stylesheet.createStyle
     * @returns {Cell} The cell.
     */
    style(style: Style): Cell

    /**
     * Get the parent workbook.
     * @returns {Workbook} The parent workbook.
     */
    workbook(): Workbook

    /**
     * Append horizontal page break after the row.
     * @returns {Row} the row.
     */
    addPageBreak(): Row

  }

  export default Row
}

declare module 'xlsx-populate/lib/Column' {
  import Cell from "xlsx-populate/lib/Cell";
  import Workbook from "xlsx-populate/lib/Workbook";
  import {AddressOpts} from "xlsx-populate";
  import Sheet from "xlsx-populate/lib/Sheet";
  import Style from "xlsx-populate/lib/Style";

  class Column {
    /**
     * Creates a new Column.
     * @param {Sheet} sheet - The parent sheet.
     * @param {{}} node - The column node.
     * @constructor
     * @ignore
     * @private
     */
    private constructor(sheet: Sheet, node: object)


    /**
     * Get the address of the column.
     * @param {{}} [opts] - Options
     * @param {boolean} [opts.includeSheetName] - Include the sheet name in the address.
     * @param {boolean} [opts.anchored] - Anchor the address.
     * @returns {string} The address
     */
    address(opts: AddressOpts): string

    /**
     * Get a cell within the column.
     * @param {number} rowNumber - The row number.
     * @returns {Cell} The cell in the column with the given row number.
     */
    cell(rowNumber: number): Cell

    /**
     * Get the name of the column.
     * @returns {string} The column name.
     */
    columnName(): string

    /**
     * Get the number of the column.
     * @returns {number} The column number.
     */
    columnNumber(): number

    /**
     * Gets a value indicating whether the column is hidden.
     * @returns {boolean} A flag indicating whether the column is hidden.
     */
    hidden(): boolean

    /**
     * Sets whether the column is hidden.
     * @param {boolean} hidden - A flag indicating whether to hide the column.
     * @returns {Column} The column.
     */
    hidden(hidden: boolean): Column

    /**
     * Get the parent sheet.
     * @returns {Sheet} The parent sheet.
     */
    sheet(): Sheet

    /**
     * Gets an individual style.
     * @param {string} name - The name of the style.
     * @returns {*} The style.
     */
    style(name: string): any

    /**
     * Gets multiple styles.
     * @param {Array.<string>} names - The names of the style.
     * @returns {object.<string, *>} Object whose keys are the style names and values are the styles.
     */
    style(names: string[]): Record<string, any>

    /**
     * Sets an individual style.
     * @param {string} name - The name of the style.
     * @param {*} value - The value to set.
     * @returns {Cell} The cell.
     */
    style(name: string, value: any): Cell

    /**
     * Sets multiple styles.
     * @param {object.<string, *>} styles - Object whose keys are the style names and values are the styles to set.
     * @returns {Cell} The cell.
     */
    style(styles: Record<string, any>): Cell

    /**
     * Sets to a specific style
     * @param {Style} style - Style object given from stylesheet.createStyle
     * @returns {Cell} The cell.
     */
    style(style: Style): Cell
  }

  export default Column
}

declare module 'xlsx-populate/lib/CoreProperties' {
  class CoreProperties {
    constructor(node: object)


    /**
     * Sets a specific property.
     * @param {string} name - The name of the property.
     * @param {*} value - The value of the property.
     * @returns {CoreProperties} CoreProperties.
     */
    set(name: PropertyName, value: any): CoreProperties

    /**
     * Get a specific property.
     * @param {string} name - The name of the property.
     * @returns {*} The property value.
     */
    get(name: PropertyName): any

    /**
     * Convert the collection to an XML object.
     * @returns {object} The XML node.
     */
    toXml(): object


  }

  type PropertyName = 'title' | 'subject' | 'author' | 'creator' | 'description' | 'keywords' | 'category'

  export default CoreProperties
}

declare module 'xlsx-populate/lib/SharedStrings' {
  class SharedStrings {

    /**
     * Constructs a new instance of _SharedStrings.
     * @param {{}} node - The node.
     */
    constructor(node: object)


    /**
     * Gets the index for a string
     * @param {string|Array.<{}>} string - The string or rich text array.
     * @returns {number} The index
     */
    getIndexForString(string: string | object[]): number

    /**
     * Get the string for a given index
     * @param {number} index - The index
     * @returns {string} The string
     */
    getStringByIndex(index: number): string

    /**
     * Convert the collection to an XML object.
     * @returns {object} The XML object.
     */
    toXml(): object

  }

  export default SharedStrings
}

declare module 'xlsx-populate/lib/PageBreaks' {
  class PageBreaks {
    /**
     * Constructs a new instance of _SharedStrings.
     * @param {{}} node - The node.
     */
    constructor(node: object)

    /**
     * add page-breaks by row/column id
     * @param {number} id - row/column id (rowNumber/colNumber)
     * @return {PageBreaks} the page-breaks
     */
    add(id: number): PageBreaks

    /**
     * remove page-breaks by index
     * @param {number} index - index of list
     * @return {PageBreaks} the page-breaks
     */
    remove(index: number): PageBreaks

    /**
     * get count of the page-breaks
     * @return {number} the page-breaks' count
     */
    get count(): number

    /**
     * get list of page-breaks
     * @return {Array} list of the page-breaks
     */
    get list(): ListPageBreaks[]

  }

  type ListPageBreaks = {
    id: string
    isManual: boolean
  }

  export default PageBreaks
}

declare module 'xlsx-populate/lib/Style' {
  class Style {
    /**
     * Creates a new instance of _Style.
     * @constructor
     * @param {StyleSheet} styleSheet - The styleSheet.
     * @param {number} id - The style ID.
     * @param {{}} xfNode - The xf node.
     * @param {{}} fontNode - The font node.
     * @param {{}} fillNode - The fill node.
     * @param {{}} borderNode - The border node.
     */
    constructor(styleSheet: StyleSheet, id: number, xfNode: object, fontNode: object, fillNode: object, borderNode: object)

    /**
     * Gets the style ID.
     * @returns {number} The ID.
     */
    id(): number

    /**
     * Gets or sets a style.
     * @param {string} name - The style name.
     * @param {*} [value] - The value to set.
     * @returns {*|Style} The value if getting or the style if setting.
     */
    style(name: string, value: any): Style | any

  }

  export default Style
}


declare module 'xlsx-populate/lib/RichText' {

  import RichTextFragment from "xlsx-populate/lib/RichTextFragment";
  import Cell from "xlsx-populate/lib/Cell";

  class RichText {
    /**
     * Creates a new instance of RichText. If you get the instance by calling `Cell.value()`,
     * adding a text contains line separator will trigger {@link Cell.style}('wrapText', true), which
     * will make MS Excel show the new line. i.e. In MS Excel, Tap "alt+Enter" in a cell, the cell
     * will set wrap text to true automatically.
     *
     * @param {undefined|null|Object} [node] - The node stored in the shared string
     */
    constructor(node: undefined | null | object)


    /**
     * Gets which cell this {@link RichText} instance belongs to.
     * @return {Cell|undefined} The cell this instance belongs to.
     */
    get cell(): Cell | undefined

    /**
     * Gets the how many rich text fragment this {@link RichText} instance contains
     * @return {number} The number of fragments this {@link RichText} instance has.
     */
    get length(): number

    /**
     * Gets concatenated text without styles.
     * @return {string} concatenated text
     */
    text(): string

    /**
     * Gets the instance with cell reference defined.
     * @param {Cell} cell - Cell reference.
     * @return {RichText} The instance with cell reference defined.
     */
    getInstanceWithCellRef(cell: Cell): RichText

    /**
     * Returns a deep copy of this instance.
     * If cell reference is provided, it checks line separators and calls
     * `cell.style('wrapText', true)` when needed.
     * @param {Cell|undefined} [cell] - The cell reference.
     * @return {RichText} A deep copied instance
     */
    copy(cell: Cell | undefined): RichText

    /**
     * Gets the ith fragment of this {@link RichText} instance.
     * @param {number} index - The index
     * @return {RichTextFragment} A rich text fragment
     */
    get(index: number): RichTextFragment

    /**
     * Removes a rich text fragment. This instance will be mutated.
     * @param {number} index - the index of the fragment to remove
     * @return {RichText} the rich text instance
     */
    remove(index: number): RichText

    /**
     * Adds a rich text fragment to the last or after the given index. This instance will be mutated.
     * @param {string} text - the text
     * @param {{}} [styles] - the styles js object, i.e. {fontSize: 12}
     * @param {number|undefined|null} [index] - the index of the fragment to add
     * @return {RichText} the rich text instance
     */
    add(text: string, styles: object, index: number | undefined | null): RichText

    /**
     * Clears this rich text
     * @return {RichText} the rich text instance
     */
    clear(): RichText

    /**
     * Remove all unsupported nodes (phoneticPr, rPh for Japanese language).
     * @return {undefined}
     */
    removeUnsupportedNodes(): undefined

    /**
     * Convert the rich text to an XML object.
     * @returns {Array.<{}>} The XML form.
     * @ignore
     */
    toXml(): object[]

  }

  export default RichText
}

declare module 'xlsx-populate/lib/RichTextFragment' {
  import RichText from "xlsx-populate/lib/RichText";

  class RichTextFragment {
    /**
     * Creates a new instance of RichTextFragment.
     * @constructor
     * @param {string|Object} value - Text value or XML node
     * @param {object|undefined|null} [styles] - Multiple styles.
     * @param {RichText} richText - The rich text instance where this fragment belongs to.
     */
    constructor(value: string | object, styles: object | undefined | null, richText: RichText)

    /**
     * Gets the value of this part of rich text
     * @return {string} text
     */
    value(): string

    /**
     * Sets the value of this part of rich text
     * @param {string} text - the text to set
     * @return {RichTextFragment} - RichTextFragment
     */
    value(text: string): RichTextFragment

    /**
     * Convert the rich text to an XML object.
     * @returns {{}} The XML form.
     * @ignore
     */
    toXml(): object


    /**
     * Gets an individual style.
     * @param {string} name - The name of the style.
     * @returns {*} The style.
     */
    style(name: string): any

    /**
     * Gets multiple styles.
     * @param {Array.<string>} names - The names of the style.
     * @returns {object.<string, *>} Object whose keys are the style names and values are the styles.
     */
    style(names: string[]): Record<string, any>

    /**
     * Sets an individual style.
     * @param {string} name - The name of the style.
     * @param {*} value - The value to set.
     * @returns {RichTextFragment} This RichTextFragment.
     */
    style(name: string, value: any): RichTextFragment

    /**
     * Sets multiple styles.
     * @param {object.<string, *>} styles - Object whose keys are the style names and values are the styles to set.
     * @returns {RichTextFragment} This RichTextFragment.
     */
    style(styles: Record<string, any>): RichTextFragment


  }

  export default RichTextFragment
}
