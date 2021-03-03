/* eslint-env jest */

import getTableInfo from '../getTableInfo'

afterEach(() => {
  delete process.env.DB_TABLE_NAME_APPENDIX
})

describe('getting table info', () => {
  it('returns expected names', () => {
    process.env.DB_TABLE_NAME_APPENDIX = ''
    const tableNames = getTableInfo()
    expect(tableNames[0].TableName).toBe('Users')
    expect(tableNames[2].TableName).toBe('UserImpact')
  })

  test('uses an appendix on table names when it is set', () => {
    process.env.DB_TABLE_NAME_APPENDIX = '-staging'
    const tableNames = getTableInfo()
    expect(tableNames[0].TableName).toBe('Users-staging')
    expect(tableNames[2].TableName).toBe('UserImpact-staging')
  })

  test('uses no table name appendix when the config value is not in config', () => {
    const tableNames = getTableInfo()
    expect(tableNames[0].TableName).toBe('Users')
    expect(tableNames[2].TableName).toBe('UserImpact')
  })
})
