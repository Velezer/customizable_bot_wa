import { Column, ColumnOptions, ColumnType } from 'typeorm'


export function LocalColumn(columnOptions: ColumnOptions, localType: ColumnType) {
    if (process.env.NODE_ENV === 'test') {
        if (columnOptions.type) {
            columnOptions.type = localType
        }
    }
    return Column(columnOptions)
}