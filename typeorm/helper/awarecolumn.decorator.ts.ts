import { Column, ColumnOptions, ColumnType } from 'typeorm'

const postgresToBetterSqlite3Map: { [key: string]: ColumnType } = {
    'enum': 'simple-enum',
    'timestamp': 'datetime',
}

function changeColumnType(typeormType: ColumnType): ColumnType {
    const isTest = process.env.NODE_ENV === 'test'
    if (isTest) {
        if (typeormType as string in postgresToBetterSqlite3Map) {
            return postgresToBetterSqlite3Map[typeormType.toString()]
        }
    }
    return typeormType
}

export function AwareColumn(columnOptions: ColumnOptions) {
    if (columnOptions.type) {
        columnOptions.type = changeColumnType(columnOptions.type)
    }
    return Column(columnOptions)
}