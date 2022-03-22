import { Column, ColumnOptions, ColumnType } from 'typeorm'

interface LocalColumnOptions {
    type: ColumnType
}

export function LocalColumn(columnOptions: ColumnOptions, localColumnOptions: LocalColumnOptions) {
    if (process.env.NODE_ENV === 'test') {
        if (columnOptions.type) {
            columnOptions.type = localColumnOptions.type
        }
    }
    return Column(columnOptions)
}