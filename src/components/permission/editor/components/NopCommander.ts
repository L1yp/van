import { Commander, ComponentInstance, Formats, Injectable } from "@textbus/core";
import { Formatter, FormatValue } from "@textbus/core/bundles/model/_api";

/**
 * 禁止用户输入
 */
@Injectable()
export class NopCommander extends Commander {



  override write(content: string | ComponentInstance, formats?: Formats): boolean
  override write(content: string | ComponentInstance, formatter?: Formatter, value?: FormatValue): boolean
  override write(content: string | ComponentInstance, formatter?: Formatter | Formats, value?: FormatValue): boolean {
    return true
  }

  // override insert(content: string | ComponentInstance, formats?: Formats): boolean
  // override insert(content: string | ComponentInstance, formatter?: Formatter, value?: FormatValue)
  // override insert(content: string | ComponentInstance, formatter?: Formatter | Formats, value?: FormatValue): boolean {
  //   return true
  // }

}