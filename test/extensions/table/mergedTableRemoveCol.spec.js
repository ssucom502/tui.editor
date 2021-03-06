import {_removeColumns} from '../../../src/js/extensions/table/mergedTableRemoveCol';
import tableDataHandler from '../../../src/js/extensions/table/tableDataHandler';

describe('mergedTableRemoveCol', () => {
    describe('_removeColumns()', () => {
        const tableHtml = [
            '<table>',
            '<thead>',
            '<tr><th>title1</th><th>title2</th><th>title3</th></tr>',
            '</thead>',
            '<tbody>',
            '<tr><td colspan="3">content1-1</td></tr>',
            '<tr><td>content2-1</td><td>content2-2</td><td>content2-3</td></tr>',
            '<tbody>',
            '</table>'
        ].join('');
        const $table = $(tableHtml);
        let tableData;

        beforeEach(() => {
            tableData = tableDataHandler.createTableData($table);
        });

        it('Remove columns, when target cell data has start merge cell(has colspan).', () => {
            const tableRange = {
                start: {
                    rowIndex: 2,
                    colIndex: 0
                },
                end: {
                    rowIndex: 2,
                    colIndex: 0
                }
            };
            const actual = _removeColumns(tableData, tableRange);

            expect(tableData[0].length).toBe(2);
            expect(tableData[1][0]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 2,
                content: 'content1-1',
                elementIndex: {
                    rowIndex: 1,
                    colIndex: 0
                }
            });
            expect(tableData[2][0]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-2',
                elementIndex: {
                    rowIndex: 2,
                    colIndex: 1
                }
            });
        });

        it('Remove columns, when target cell data has merged cell.', () => {
            const tableRange = {
                start: {
                    rowIndex: 2,
                    colIndex: 1
                },
                end: {
                    rowIndex: 2,
                    colIndex: 1
                }
            };
            const actual = _removeColumns(tableData, tableRange);

            expect(tableData[0].length).toBe(2);
            expect(tableData[1][0].colspan).toBe(2);
            expect(tableData[1][1]).toEqual({
                nodeName: 'TD',
                colMergeWith: 0
            });
            expect(tableData[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-3',
                elementIndex: {
                    rowIndex: 2,
                    colIndex: 2
                }
            });
        });

        it('Remove columns, when target cell data has last merged cell.', () => {
            const tableRange = {
                start: {
                    rowIndex: 2,
                    colIndex: 2
                },
                end: {
                    rowIndex: 2,
                    colIndex: 2
                }
            };
            const actual = _removeColumns(tableData, tableRange);

            expect(tableData[0].length).toBe(2);
            expect(tableData[1][0].colspan).toBe(2);
            expect(tableData[1][1]).toEqual({
                nodeName: 'TD',
                colMergeWith: 0
            });
            expect(tableData[2][1]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-2',
                elementIndex: {
                    rowIndex: 2,
                    colIndex: 1
                }
            });
        });

        it('Remove columns, when has table selection.', () => {
            const tableRange = {
                start: {
                    rowIndex: 2,
                    colIndex: 0
                },
                end: {
                    rowIndex: 2,
                    colIndex: 1
                }
            };
            const actual = _removeColumns(tableData, tableRange);

            expect(tableData[0].length).toBe(1);
            expect(tableData[1][0].colspan).toBe(1);
            expect(tableData[2][0]).toEqual({
                nodeName: 'TD',
                rowspan: 1,
                colspan: 1,
                content: 'content2-3',
                elementIndex: {
                    rowIndex: 2,
                    colIndex: 2
                }
            });
        });

        it('If removed all cells, cells will not remove.', () => {
            const tableRange = {
                start: {
                    rowIndex: 1,
                    colIndex: 0
                },
                end: {
                    rowIndex: 1,
                    colIndex: 0
                }
            };
            const actual = _removeColumns(tableData, tableRange);

            expect(tableData[0].length).toBe(3);
            expect(tableData[1][0].colspan).toBe(3);
        });
    });
});
