const db = require('../db')

class ProjectBibleTemplateController {
    //Запросы к таблице project_bible_template
    async getProjectBibleTemplates(req, res) {
        const columnsActive = await db.query('SELECT * FROM project_bible_template WHERE active = true AND col_for_client = false ORDER BY num')
        const colunmsForCLient = await db.query('SELECT * FROM project_bible_template WHERE active = true AND col_for_client = true ORDER BY num')

        res.json({"columnsActive": columnsActive.rows, "columnsForClient": colunmsForCLient.rows})
    }

    async projectBibleTemplateGenerateIndividualCode(req, res) {
        let abc = "abcdefghijklmnopqrstuvwxyz1234567890-";
        let individualCode = "";

        while (individualCode.length < 36) {
            individualCode += abc[Math.floor(Math.random() * abc.length)];
        }

        const exist = await db.query('SELECT * FROM project_bible_template WHERE code = $1', [individualCode])

        res.json({"individualCode": individualCode, "exist": exist.rows})
    }

    async setProjectBibleTemplateAddColumnToTheEnd(req, res) {
        const {name, type, editable, template, num, code, active, col_for_client} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_template (name, type, editable, template, num, code, active, col_for_client) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [name, type, editable, template, num, code, active, col_for_client]
        )

        res.json(queryResult)
    }

    async setProjectBibleTemplateIncNumPredAddColumn(req, res) {
        const {initNum, initType} = req.body
        const colForClient = initType !== "main"
        const queryIncFollowingNum = await db.query(
            'UPDATE project_bible_template SET num = num + 1 WHERE col_for_client = $1 AND num > $2',
            [colForClient, initNum]
        )

        res.json(queryIncFollowingNum)
    }

    async setProjectBibleTemplateAddColumn(req, res) {
        const {name, type, editable, template, num, code, active, col_for_client} = req.body
        const queryAddColumn = await db.query(
            'INSERT INTO project_bible_template (name, type, editable, template, num, code, active, col_for_client) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [name, type, editable, template, num, code, active, col_for_client]
        )

        res.json(queryAddColumn)
    }

    async projectBibleTemplateUpdateColumnTemplate(req, res) {
        const {column, code, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_template SET ' + column + ' = $2 WHERE code = $1',
            [code, value]
        )

        res.json(queryResult)
    }

    async setProjectBibleTemplateMoveUpColumn(req, res) {
        const {type, code, num} = req.body
        const colForClient = type !== "main"
        const previousColumnNum = num - 1
        const queryIncPreviousColumn = await db.query(
            'UPDATE project_bible_template SET num = num + 1 WHERE col_for_client = $1 AND num = $2',
            [colForClient, previousColumnNum]
        )
        const queryDecCurrentColumn = await db.query(
            'UPDATE project_bible_template SET num = num - 1 WHERE col_for_client = $1 AND code = $2 AND num = $3',
            [colForClient, code, num]
        )

        res.json({"queryDecCurrentColumn": queryDecCurrentColumn, "queryIncPreviousColumn": queryIncPreviousColumn})
    }

    async setProjectBibleTemplateMoveDownColumn(req, res) {
        const {type, code, num} = req.body
        const colForClient = type !== "main"
        const followingColumnNum = num + 1
        const queryDecFollowingColumn = await db.query(
            'UPDATE project_bible_template SET num = num - 1 WHERE col_for_client = $1 AND num = $2',
            [colForClient, followingColumnNum]
        )
        const queryIncCurrentColumn = await db.query(
            'UPDATE project_bible_template SET num = num + 1 WHERE col_for_client = $1 AND code = $2 AND num = $3',
            [colForClient, code, num]
        )

        res.json({"queryIncCurrentColumn": queryIncCurrentColumn, "queryDecFollowingColumn": queryDecFollowingColumn})
    }

    async setProjectBibleTemplateDecNumPredDeleteColumn(req, res) {
        const {initNum, initType} = req.body
        const colForClient = initType !== "main"
        const queryDecFollowingNum = await db.query(
            'UPDATE project_bible_template SET num = num - 1 WHERE col_for_client = $1 AND num > $2',
            [colForClient, initNum]
        )

        res.json(queryDecFollowingNum)
    }

    async setProjectBibleTemplateDeleteColumn(req, res) {
        const {code} = req.body
        /*const queryDeleteColumn = await db.query(
            'DELETE FROM project_bible_template WHERE code = $1',
            [code]
        )*/
        const queryDeleteColumn = await db.query(
            'UPDATE project_bible_template SET active = false WHERE code = $1',
            [code]
        )

        res.json(queryDeleteColumn)
    }

    async getProjectBibleColumnsForClientTemplate(req, res) {
        const columns = await db.query(
            'SELECT code, name, type, editable, template FROM project_bible_template WHERE active = true AND col_for_client = true ORDER BY num'
        )

        res.json({"columns": columns.rows})
    }

    //Запросы к таблице project_bible_template_tags
    async getProjectBibleTemplateTags(req, res) {
        const groups = await db.query(
            'SELECT code, name FROM project_bible_template_tag_groups WHERE active = true ORDER BY num'
        )

        const tags = await db.query(
            'SELECT * FROM project_bible_template_tags ORDER BY tag_group, value'
        )

        res.json({"tag_groups": groups.rows, "tags": tags.rows})
    }

    async setProjectBibleTemplateTagsUpdateGroupTag(req, res) {
        const {groupCode, newTitle} = req.body
        const queryUpdateGroupTag = await db.query(
            'UPDATE project_bible_template_tag_groups SET name = $2 WHERE code = $1',
            [groupCode, newTitle]
        )

        res.json(queryUpdateGroupTag)
    }

    /*async setProjectBibleTemplateTagsCheckExistBeforeUpdateTag(req, res) {
        const {group, oldTitle} = req.body
        const queryExist = await db.query(
            'SELECT * FROM project_bible_template_tags WHERE tag_group = $1 AND value = $2',
            [group, oldTitle]
        )

        res.json(queryExist.rows)
    }*/

    async setProjectBibleTemplateTagsAddTag(req, res) {
        const {groupCode, tagCode} = req.body
        const queryAddTag = await db.query(
            'INSERT INTO project_bible_template_tags (tag_group, tag_code) VALUES ($1, $2)',
            [groupCode, tagCode]
        )

        res.json(queryAddTag)
    }

    async setProjectBibleTemplateTagsAddGroupTag(req, res) {
        const {num, code, active} = req.body
        const queryAddTag = await db.query(
            'INSERT INTO project_bible_template_tag_groups (num, code, active) VALUES ($1, $2, $3)',
            [num, code, active]
        )

        res.json(queryAddTag)
    }

    async setProjectBibleTemplateTagsUpdateTag(req, res) {
        const {tagCode, newTitle} = req.body
        const queryUpdateTag = await db.query(
            'UPDATE project_bible_template_tags SET value = $2 WHERE tag_code = $1',
            [tagCode, newTitle]
        )

        res.json(queryUpdateTag)
    }

    async setProjectBibleTemplateTagsDeleteGroupTag(req, res) {
        const {code} = req.body
        const queryDeleteGroupTag = await db.query(
            'UPDATE project_bible_template_tag_groups SET active = false WHERE code = $1',
            [code]
        )

        res.json(queryDeleteGroupTag)
    }

    async setProjectBibleTemplateTagsDeleteTag(req, res) {
        const {tagCode} = req.body
        const queryDeleteTag = await db.query(
            'DELETE FROM project_bible_template_tags WHERE tag_code = $1',
            [tagCode]
        )

        res.json(queryDeleteTag)
    }

    async projectBibleTemplateGenerateTagGroupIndividualCode(req, res) {
        let abc = "abcdefghijklmnopqrstuvwxyz1234567890-";
        let individualCode = "";

        while (individualCode.length < 36) {
            individualCode += abc[Math.floor(Math.random() * abc.length)];
        }

        const exist = await db.query('SELECT * FROM project_bible_template_tag_groups WHERE code = $1', [individualCode])

        res.json({"individualCode": individualCode, "exist": exist.rows})
    }

    async projectBibleTemplateGenerateTagIndividualCode(req, res) {
        let abc = "abcdefghijklmnopqrstuvwxyz1234567890-";
        let individualCode = "";

        while (individualCode.length < 36) {
            individualCode += abc[Math.floor(Math.random() * abc.length)];
        }

        const exist = await db.query('SELECT * FROM project_bible_template_tags WHERE tag_code = $1', [individualCode])

        res.json({"individualCode": individualCode, "exist": exist.rows})
    }

    async setProjectBibleTemplateDecNumPredDeleteTagGroup(req, res) {
        const {initNum} = req.body
        const queryDecFollowingNum = await db.query(
            'UPDATE project_bible_template_tag_groups SET num = num - 1 WHERE num > $1',
            [initNum]
        )

        res.json(queryDecFollowingNum)
    }

    //Запросы к таблице project_bible_template && project_bible_template_rows
    async getProjectBibleColumnsRowsTemplate(req, res) {
        const columns = await db.query(
            'SELECT code, name, type, editable, template FROM project_bible_template WHERE active = true AND col_for_client = false ORDER BY num'
        )
        const rows = await db.query(
            'SELECT code FROM project_bible_template_rows ORDER BY num')

        res.json({"columns": columns.rows, "rows": rows.rows})
    }

    async getProjectBibleActiveColumnsWithTemplateAndRows(req, res) {
        const columns = await db.query(
            'SELECT code, name, type FROM project_bible_template WHERE active = true AND template = true AND col_for_client = false ORDER BY num'
        )
        const rows = await db.query(
            'SELECT code FROM project_bible_template_rows WHERE active = true ORDER BY num')

        res.json({"columns": columns.rows, "rows": rows.rows})
    }

    //Запросы к таблице project_bible_template_rows
    async projectBibleTemplateGenerateRowIndividualCode(req, res) {
        let abc = "abcdefghijklmnopqrstuvwxyz1234567890-";
        let individualCode = "";

        while (individualCode.length < 36) {
            individualCode += abc[Math.floor(Math.random() * abc.length)];
        }

        const exist = await db.query('SELECT * FROM project_bible_template_rows WHERE code = $1', [individualCode])

        res.json({"individualCode": individualCode, "exist": exist.rows})
    }

    async setProjectBibleTemplateAddRowToTheEnd(req, res) {
        const {num, code, active} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_template_rows (num, code, active) VALUES ($1, $2, $3)',
            [num, code, active]
        )

        res.json(queryResult)
    }

    async setProjectBibleTemplateIncNumPredAddRow(req, res) {
        const {initNum} = req.body
        const queryIncFollowingNum = await db.query(
            'UPDATE project_bible_template_rows SET num = num + 1 WHERE num > $1',
            [initNum]
        )

        res.json(queryIncFollowingNum)
    }

    async setProjectBibleTemplateAddRow(req, res) {
        const {num, code, active} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_template_rows (num, code, active) VALUES ($1, $2, $3)',
            [num, code, active]
        )

        res.json(queryResult)
    }

    async setProjectBibleTemplateDecNumPredDeleteRow(req, res) {
        const {initNum} = req.body
        const queryDecFollowingNum = await db.query(
            'UPDATE project_bible_template_rows SET num = num - 1 WHERE num > $1',
            [initNum]
        )

        res.json(queryDecFollowingNum)
    }

    async setProjectBibleTemplateDeleteRow(req, res) {
        const {code} = req.body
        /*const queryDeleteColumn = await db.query(
            'DELETE FROM project_bible_template_rows WHERE code = $1',
            [code]
        )*/
        const queryDeleteColumn = await db.query(
            'UPDATE project_bible_template_rows SET active = false WHERE code = $1',
            [code]
        )

        res.json(queryDeleteColumn)
    }

    async setProjectBibleTemplateMoveUpRow(req, res) {
        const {code, num} = req.body
        const previousRowNum = num - 1
        const queryIncPreviousRow = await db.query(
            'UPDATE project_bible_template_rows SET num = num + 1 WHERE num = $1',
            [previousRowNum]
        )
        const queryDecCurrentRow = await db.query(
            'UPDATE project_bible_template_rows SET num = num - 1 WHERE code = $1 AND num = $2',
            [code, num]
        )

        res.json({"queryDecCurrentRow": queryDecCurrentRow, "queryIncPreviousRow": queryIncPreviousRow})
    }

    async setProjectBibleTemplateMoveDownRow(req, res) {
        const {code, num} = req.body
        const followingRowNum = num + 1
        const queryDecFollowingRow = await db.query(
            'UPDATE project_bible_template_rows SET num = num - 1 WHERE num = $1',
            [followingRowNum]
        )
        const queryIncCurrentRow = await db.query(
            'UPDATE project_bible_template_rows SET num = num + 1 WHERE code = $1 AND num = $2',
            [code, num]
        )

        res.json({"queryIncCurrentRow": queryIncCurrentRow, "queryDecFollowingRow": queryDecFollowingRow})
    }

    //Запросы к таблице project_bible_template_text
    //todo даже во view не везде может быть значение template заполненное
    async getProjectBibleTextTemplateValue(req, res) {
        const {rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_template_text WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode]
        )

        res.json(value.rows[0].value)
    }

    async getProjectBibleTextTemplateIfExistValue(req, res) {
        const {rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_template_text WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode]
        )

        res.json(value.rows)
    }

    async setProjectBibleTemplateOninputUpdateTextCell(req, res) {
        const {colCode, rowCode, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_template_text SET value = $3 WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    async setProjectBibleTemplateOninputInsertTextCell(req, res) {
        const {colCode, rowCode, value} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_template_text (row_code, col_code, value) VALUES ($1, $2, $3)',
            [rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    //Запросы к таблице project_bible_template_bool
    async getProjectBibleBoolTemplateValue(req, res) {
        const {rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_template_bool WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode]
        )

        res.json(value.rows[0].value)
    }

    async getProjectBibleBoolTemplateIfExistValue(req, res) {
        const {rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_template_bool WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode]
        )

        res.json(value.rows)
    }

    async setProjectBibleTemplateOninputUpdateBoolCell(req, res) {
        const {colCode, rowCode, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_template_bool SET value = $3 WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    async setProjectBibleTemplateOninputInsertBoolCell(req, res) {
        const {colCode, rowCode, value} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_template_bool (row_code, col_code, value) VALUES ($1, $2, $3)',
            [rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    //Запросы к таблице project_bible_template_json
    async getProjectBibleTagJsonTemplateValue(req, res) {
        const {rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_template_json WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode]
        )

        res.json(value.rows[0].value)
    }

    async getProjectBibleTagJsonTemplateIfExistValue(req, res) {
        const {rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_template_json WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode]
        )

        res.json(value.rows)
    }

    async setProjectBibleTemplateUpdateTagJsonCell(req, res) {
        const {colCode, rowCode, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_template_json SET value = $3 WHERE row_code = $1 AND col_code = $2',
            [rowCode, colCode, JSON.stringify(value)]
        )

        res.json(queryResult)
    }

    async setProjectBibleTemplateInsertTagJsonCell(req, res) {
        const {colCode, rowCode, value} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_template_json (row_code, col_code, value) VALUES ($1, $2, $3)',
            [rowCode, colCode, JSON.stringify(value)]
        )

        res.json(queryResult)
    }

    //Запросы к таблице project_bible_info
    async getProjectBibleInfo(req, res) {
        const {clientName, projectName, projectCode} = req.body
        const value = await db.query(
            'SELECT columns, rows FROM project_bible_info WHERE client_name = $1 AND project_name = $2 AND project_code = $3',
            [clientName, projectName, projectCode]
        )

        res.json(value.rows)
    }

    async setProjectBibleInfoInsert(req, res) {
        const {clientName, projectName, projectCode, columns, rows} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_info (client_name, project_name, project_code, columns, rows) VALUES ($1, $2, $3, $4, $5)',
            [clientName, projectName, projectCode, JSON.stringify(columns), JSON.stringify(rows)]
        )

        res.json(queryResult)
    }

    async setProjectBibleInfoMoveUpRow(req, res) {
        const {clientName, projectName, projectCode, rows} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_info SET rows = $4 WHERE client_name = $1 AND project_name = $2 AND project_code = $3',
            [clientName, projectName, projectCode, JSON.stringify(rows)]
        )

        res.json(queryResult)
    }

    async setProjectBibleInfoMoveDownRow(req, res) {
        const {clientName, projectName, projectCode, rows} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_info SET rows = $4 WHERE client_name = $1 AND project_name = $2 AND project_code = $3',
            [clientName, projectName, projectCode, JSON.stringify(rows)]
        )

        res.json(queryResult)
    }

    //Запросы к таблице project_bible_text
    async getProjectBibleTextGetCellValue(req, res) {
        const {clientName, projectName, projectCode, rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_text WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND row_code = $4 AND col_code = $5',
            [clientName, projectName, projectCode, rowCode, colCode]
        )

        res.json(value.rows)
    }

    async setProjectBibleOninputUpdateTextCell(req, res) {
        const {clientName, projectName, projectCode, rowCode, colCode, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_text SET value = $6 WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND row_code = $4 AND col_code = $5',
            [clientName, projectName, projectCode, rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    async setProjectBibleOninputInsertTextCell(req, res) {
        const {clientName, projectName, projectCode, rowCode, colCode, value} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_text (client_name, project_name, project_code, row_code, col_code, value) VALUES ($1, $2, $3, $4, $5, $6)',
            [clientName, projectName, projectCode, rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    //Запросы к таблице project_bible_bool
    async getProjectBibleBoolGetCellValue(req, res) {
        const {clientName, projectName, projectCode, rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_bool WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND row_code = $4 AND col_code = $5',
            [clientName, projectName, projectCode, rowCode, colCode]
        )

        res.json(value.rows)
    }

    async setProjectBibleOninputUpdateBoolCell(req, res) {
        const {clientName, projectName, projectCode, rowCode, colCode, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_bool SET value = $6 WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND row_code = $4 AND col_code = $5',
            [clientName, projectName, projectCode, rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    async setProjectBibleOninputInsertBoolCell(req, res) {
        const {clientName, projectName, projectCode, rowCode, colCode, value} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_bool (client_name, project_name, project_code, row_code, col_code, value) VALUES ($1, $2, $3, $4, $5, $6)',
            [clientName, projectName, projectCode, rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    //Запросы к таблице project_bible_client_view
    async projectBibleClientViewGenerateIndividualCode(req, res) {
        let abc = "abcdefghijklmnopqrstuvwxyz1234567890-";
        let individualCode = "";

        while (individualCode.length < 36) {
            individualCode += abc[Math.floor(Math.random() * abc.length)];
        }

        const exist = await db.query('SELECT * FROM project_bible_client_view WHERE code = $1', [individualCode])

        res.json({"individualCode": individualCode, "exist": exist.rows})
    }

    async setProjectBibleClientViewInsert(req, res) {
        const {clientName, projectName, projectCode, code, columns, rows, manager} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_client_view (client_name, project_name, project_code, code, columns, rows, created_by_manager) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [clientName, projectName, projectCode, code, JSON.stringify(columns), JSON.stringify(rows), manager]
        )

        res.json(queryResult)
    }

    async getProjectBibleClientView(req, res) {
        const {clientName, projectName, projectCode} = req.body
        const value = await db.query(
            'SELECT code, columns, rows, date_create, submit, time_create, created_by_manager FROM project_bible_client_view WHERE client_name = $1 AND project_name = $2 AND project_code = $3',
            [clientName, projectName, projectCode]
        )

        res.json(value.rows)
    }

    async getProjectBibleClientViewByCode(req, res) {
        const {clientName, projectName, projectCode, code} = req.body
        const value = await db.query(
            'SELECT code, columns, rows, date_create, submit FROM project_bible_client_view WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND code = $4',
            [clientName, projectName, projectCode, code]
        )

        res.json(value.rows)
    }

    async setProjectBibleClientViewDelete(req, res) {
        const {code} = req.body
        const value = await db.query(
            'DELETE FROM project_bible_client_view WHERE code = $1',
            [code]
        )

        const deleteText = await db.query(
            'DELETE FROM project_bible_client_view_text WHERE view_code = $1',
            [code]
        )

        const deleteBool = await db.query(
            'DELETE FROM project_bible_client_view_bool WHERE view_code = $1',
            [code]
        )

        res.json(value)
    }

    async setCreateProjectBiblePdf(req, res) {
        // const {data} = req.body

        res.json({hello: "klnjnjnlk"})
    }

    async setProjectBibleClientViewSubmit(req, res) {
        const {code, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_client_view SET submit = $2 WHERE code = $1',
            [code, value]
        )

        res.json(queryResult)
    }

    //Запросы к таблице project_bible_client_view_text
    async getProjectBibleClientViewTextGetCellValue(req, res) {
        const {code, rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_client_view_text WHERE view_code = $1 AND row_code = $2 AND col_code = $3',
            [code, rowCode, colCode]
        )

        res.json(value.rows)
    }

    async setProjectBibleClientViewOninputUpdateTextCell(req, res) {
        const {code, rowCode, colCode, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_client_view_text SET value = $4 WHERE view_code = $1 AND row_code = $2 AND col_code = $3',
            [code, rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    async setProjectBibleClientViewOninputInsertTextCell(req, res) {
        const {code, rowCode, colCode, value} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_client_view_text (view_code, row_code, col_code, value) VALUES ($1, $2, $3, $4)',
            [code, rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    //Запросы к таблице project_bible_client_view_bool
    async getProjectBibleClientViewBoolGetCellValue(req, res) {
        const {code, rowCode, colCode} = req.body
        const value = await db.query(
            'SELECT value FROM project_bible_client_view_bool WHERE view_code = $1 AND row_code = $2 AND col_code = $3',
            [code, rowCode, colCode]
        )

        res.json(value.rows)
    }

    async setProjectBibleClientViewOninputUpdateBoolCell(req, res) {
        const {code, rowCode, colCode, value} = req.body
        const queryResult = await db.query(
            'UPDATE project_bible_client_view_bool SET value = $4 WHERE view_code = $1 AND row_code = $2 AND col_code = $3',
            [code, rowCode, colCode, value]
        )

        res.json(queryResult)
    }

    async setProjectBibleClientViewOninputInsertBoolCell(req, res) {
        const {code, rowCode, colCode, value} = req.body
        const queryResult = await db.query(
            'INSERT INTO project_bible_client_view_bool (code, row_code, col_code, value) VALUES ($1, $2, $3, $4)',
            [code, rowCode, colCode, value]
        )

        res.json(queryResult)
    }











    /*async createProjectBibleTemplate(req, res) {
        const {name, type, editable, template, num} = req.body
        /!*const newProjectBibleTemplate = await db.query(
            'INSERT INTO project_bible_template (name, type, editable, template_header, num) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, type, editable, template, num]
        )
        res.json(newProjectBibleTemplate.rows[0])*!/
        res.json({hello: name})
    }*/

    /*async getProjectBibleTemplates(req, res) {
        const projectBibleTemplates = await db.query('SELECT * FROM project_bible_template ORDER BY num')
        res.json(projectBibleTemplates.rows)
    }*/

    /*async getOneProjectBibleTemplate(req, res) {
        const name = req.params.name
        const oneProjectBibleTemplate = await db.query('SELECT * FROM project_bible_template WHERE name = $1', [name])
        res.json(oneProjectBibleTemplate.rows[0])
    }*/

    /*async updateProjectBibleTemplate(req, res) {
        const {name, type, editable, template, num} = req.body
        const projectBibleTemplate = await db.query(
            'UPDATE project_bible_template SET name = $1, type = $2, editable = $3, template_header = $4, num = $5 WHERE name = $1 RETURNING *',
            [name, type, editable, template, num]
        )
        res.json(projectBibleTemplate.rows[0])
    }*/

    /*async deleteProjectBibleTemplate(req, res) {
        const name = req.params.name
        const oneProjectBibleTemplate = await db.query('DELETE FROM project_bible_template WHERE name = $1', [name])
        res.json(oneProjectBibleTemplate.rows[0])
    }*/

    async getProjectBibleTemplatesText(req, res) {
        const projectBibleTemplates = await db.query('SELECT * FROM project_bible_template_text ORDER BY num')
        res.json(projectBibleTemplates.rows)
    }

    async getProjectBibleTemplateTextByName(req, res) {
        const {columnName} = req.body
        const projectBibleTemplates = await db.query('SELECT code, value FROM project_bible_template_text WHERE name = $1 ORDER BY num', [columnName])
        res.json(projectBibleTemplates.rows)
    }

    async getProjectBibleTemplateBoolByName(req, res) {
        const {columnName} = req.body
        const projectBibleTemplates = await db.query('SELECT code, value FROM project_bible_template_bool WHERE name = $1 ORDER BY num', [columnName])
        res.json(projectBibleTemplates.rows)
    }

    async predSetProjectBibleOninputSave(req, res) {
        const {clientName, projectName, projectCode, header, row, type/*, value*/} = req.body

        if (type === "input") {
            const tryToFindRow = await db.query(
                'SELECT COUNT(*) FROM project_bible_text WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND row_code = $4 AND col_code = $5',
                [clientName, projectName, projectCode, row, header]
            )

            res.json({count: +tryToFindRow.rows[0].count})
        } else if (type === "checkbox") {
            const tryToFindRow = await db.query(
                'SELECT COUNT(*) FROM project_bible_bool WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND row_code = $4 AND col_code = $5',
                [clientName, projectName, projectCode, row, header]
            )

            res.json({count: +tryToFindRow.rows[0].count})
        }
    }

    async predSetProjectBibleOninputInsertSave(req, res) {
        const {clientName, projectName, projectCode, header, row, type, value} = req.body

        if (type === "input") {
            const projectBible = await db.query(
                'INSERT INTO project_bible_text VALUES ($1, $2, $3, $4, $5, $6)',
                [clientName, projectName, projectCode, row, header, value]
            )

            // res.json({count: +tryToFindRow.rows[0].count})
        } else if (type === "checkbox") {
            const projectBible = await db.query(
                'INSERT INTO project_bible_bool VALUES ($1, $2, $3, $4, $5, $6)',
                [clientName, projectName, projectCode, row, header, value]
            )

            // res.json({count: +tryToFindRow.rows[0].count})
        }
    }

    async predSetProjectBibleOninputUpdateSave(req, res) {
        const {clientName, projectName, projectCode, header, row, type, value} = req.body

        if (type === "input") {
            const projectBible = await db.query(
                'UPDATE project_bible_text SET col_value = $1 WHERE client_name = $2 AND project_name = $3 AND project_code = $4 AND row_code = $5 AND col_code = $6',
                [value, clientName, projectName, projectCode, row, header]
            )

            // res.json({count: +tryToFindRow.rows[0].count})
        } else if (type === "checkbox") {
            const projectBible = await db.query(
                'UPDATE project_bible_bool SET col_value = $1 WHERE client_name = $2 AND project_name = $3 AND project_code = $4 AND row_code = $5 AND col_code = $6',
                [value, clientName, projectName, projectCode, row, header]
            )

            // res.json({count: +tryToFindRow.rows[0].count})
        }
    }

    /*async setProjectBibleInfoInsert(req, res) {
        const {clientName, projectName, projectCode, columns, rowCount} = req.body

        // if (rowCount) {
            const projectBible = await db.query(
                'INSERT INTO project_bible_info (client_name, project_name, project_code, columns, row_count) VALUES ($1, $2, $3, $4, $5)',
                [clientName, projectName, projectCode, JSON.stringify(columns), rowCount]
            )
        // }
    }*/

    async getProjectBibleFilledCell(req, res) {
        const {clientName, projectName, projectCode, headerName, rowCode, type} = req.body

        if (type === "input") {
            const projectBible = await db.query(
                'SELECT col_value FROM project_bible_text WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND row_code = $5 AND col_code = $4',
                [clientName, projectName, projectCode, headerName, rowCode]
            )

            // res.json({response: projectBible.rows[0].count})
            res.json({response: projectBible})
        } else if (type === "checkbox") {
            const projectBible = await db.query(
                'SELECT col_value FROM project_bible_bool WHERE client_name = $1 AND project_name = $2 AND project_code = $3 AND row_code = $5 AND col_code = $4',
                [clientName, projectName, projectCode, headerName, rowCode]
            )

            // res.json({response: projectBible.rows[0].count})
            res.json({response: projectBible})
        }

        /*if (type === "input") {
            res.json({exist: true, value: "test"})
        } else if (type === "checkbox") {
            res.json({exist: true, value: false})
        }*/
    }
}

module.exports = new ProjectBibleTemplateController()