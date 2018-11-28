var SocialCalc;
if (!SocialCalc) {
    alert("Main SocialCalc code module needed");
    SocialCalc = {};
}
if (!SocialCalc.TableEditor) {
    alert("SocialCalc TableEditor code module needed");
}

SocialCalc.Workbook = function(parentId, formulaId) {
    this.sheetInfoList = []; // name, sheet, context, editor, node
    this.currentSheetIndex = 0;
    this.editor = null;
    this.parentId = parentId;
    this.formulaId = formulaId;

    this.generateSheetName = function () {
        var map = {};
        for (var i = 0; i < this.sheetInfoList.length; ++i) {
            map[this.sheetInfoList[i].name] = 1;
        }
        var i = this.sheetInfoList.length + 1;
        while (true) {
            var name = "sheet" + i;
            if (!map[name]) {
                return name;
            }
            ++i;
        }
    }

    this.getCurrentSheet = function () {
        var info = this.sheetInfoList[this.currentSheetIndex];
        return info ? info.sheet : null;
    }

    this.getIndexBySheetName = function (name) {
        if (name) {
            for (let i = 0; i < this.sheetInfoList.length; ++i) {
                if (this.sheetInfoList[i].name == name) {
                    return i;
                }
            }
        }
        return -1;
    }

    function caclEditorSize () {
        return {
            width: document.body.clientWidth - 10,
            height: document.body.clientHeight - $("#first-part-actions").height() - $("#nav-tabs").height() - 10
        };
    }

    this.addNewSheet = function (name, str) {
        var sheetInfo = null;
        if (!name) {
            name = this.generateSheetName();
        } else {
            const i = this.getIndexBySheetName(name);
            if (i >= 0) {
                sheetInfo = this.sheetInfoList[i];
            }
        }
        if (sheetInfo) {
            sheetInfo.sheet.ParseSheetSave(str);
            return sheetInfo;
        }
        var sheet = new SocialCalc.Sheet();
        SocialCalc.Formula.SheetCache.sheets[name] = {
            sheet: sheet,
            name: name
        };
        if (str) {
            sheet.ParseSheetSave(str);
        }
        var context = new SocialCalc.RenderContext(sheet);
        context.showGrid = true;
        context.showRCHeaders = true;
        var sheetInfo = {
            name: name,
            sheet: sheet,
            context: context,
        };
        this.sheetInfoList.push(sheetInfo);
        return sheetInfo;
    }
    
    this.renameSheet = function (name, newName) {
        const i = this.getIndexBySheetName(name);
        if (i < 0) {
            alert("sheet not exist: " + name);
            return false;
        }
        const j = this.getIndexBySheetName(newName);
        if (j >= 0) {
            alert("repeated name: " + newName);
            return false;
        }
        this.sheetInfoList[i].name = newName;
        delete(SocialCalc.Formula.SheetCache.sheets[name]);
        SocialCalc.Formula.SheetCache.sheets[newName] = { // TODO maybe there is a method to rename?
            sheet: this.sheetInfoList[i].sheet,
            name: newName
        };
        return true;
    }

    this.removeSheet = function (name) {
        const i = this.getIndexBySheetName(name);
        if (i < 0) {
            return;
        }
        var sheetInfo = this.sheetInfoList[i];
        delete(SocialCalc.Formula.SheetCache.sheets[name]);
        this.sheetInfoList.splice(i, 1);
        if (i == this.currentSheetIndex) {
            if (this.sheetInfoList.length > 0) {
                this.selectSheet(this.sheetInfoList[0].name);
            }
        }
    }


    this.selectSheet = function (name) {
        var i = this.getIndexBySheetName(name);
        if (i < 0) {
            return;
        }
        var sheetInfo = this.sheetInfoList[i];
        if (!sheetInfo) {
            alert("no such sheet: " + name);
            return;
        }
        let editor = new SocialCalc.TableEditor(sheetInfo.context);
        let size = caclEditorSize();
        var node = editor.CreateTableEditor(size.width, size.height);
        var inputbox = new SocialCalc.InputBox(document.getElementById(this.formulaId), editor);
        var parentNode = document.getElementById(this.parentId);
        for (child=parentNode.firstChild; child!=null; child=parentNode.firstChild) {
            parentNode.removeChild(child);
        }
        parentNode.appendChild(node);
        this.currentSheetIndex = i;
        this.editor = editor;
        editor.EditorScheduleSheetCommands("redisplay", true, false);
    }

    this.refresh = function () {
        this.editor.EditorScheduleSheetCommands("redisplay", true, false);
    }

    this.generateFile = function() {
        var result = [];
        for (let i = 0; i < this.sheetInfoList.length; ++i) {
            var sheetInfo = this.sheetInfoList[i];
            result.push({
                name: sheetInfo.name,
                content: sheetInfo.sheet.CreateSheetSave()
            });
        }
        return JSON.stringify(result);
    }

    this.addRemoteInfo = function (sheet, crFrom,  crTo, ref, index) {
        var info = {
            coord1: crFrom,
            coord2: crTo,
            ref: ref,
        }
        if (index < 0 || index > sheet.remote.length) {
            sheet.remote.push(info);
        } else {
            sheet.remote[index] = info;
        }
        return info;
    }

    this.updateRemoteData = function (sheet, info, data) {
        var cr1 = SocialCalc.coordToCr(info.coord1);
        var cr2 = SocialCalc.coordToCr(info.coord2);
        var rcount = cr2.row - cr1.row + 1;
        if (rcount > data.length) {
            rcount = data.length;
        }
        var ccount = cr2.col - cr1.col + 1;
        for (var r = 0; r < rcount; ++r) {
            var row = data[r];
            for (var c = 0; c < row.length && c < ccount; ++c) {
                var coord = SocialCalc.crToCoord(c + cr1.col, r + cr1.row);
                var cell = sheet.GetAssuredCell(coord);
                if (!cell.datatype) {
                    if (r == 0) {
                        cell.datatype = "t";
                        cell.valuetype = "t";
                        cell.datavalue = row[c];
                    } else {
                        SocialCalc.SetConvertedCell(sheet, coord, row[c]);
                    }
                } else {
                    cell.datavalue = row[c];
                }
                delete cell.displaystring;
                sheet.recalcchangedavalue = true; // remember something changed in case other code wants to know
            }
        }
    }

    this.executeCommand = function(combostr, sstr) {
        var eobj = this.editor;

        var str = {};
        str.P = "%";
        str.N = "\n"
        if (eobj.range.hasrange) {
            str.R = SocialCalc.crToCoord(eobj.range.left, eobj.range.top)+
                ":"+SocialCalc.crToCoord(eobj.range.right, eobj.range.bottom);
            str.C = str.R;
            str.W = SocialCalc.rcColname(eobj.range.left) + ":" + SocialCalc.rcColname(eobj.range.right);
        }
        else {
            str.C = eobj.ecell.coord;
            str.R = eobj.ecell.coord+":"+eobj.ecell.coord;
            str.W = SocialCalc.rcColname(SocialCalc.coordToCr(eobj.ecell.coord).col);
        }
        str.S = sstr;
        combostr = combostr.replace(/%C/g, str.C);
        combostr = combostr.replace(/%R/g, str.R);
        combostr = combostr.replace(/%N/g, str.N);
        combostr = combostr.replace(/%S/g, str.S);
        combostr = combostr.replace(/%W/g, str.W);
        combostr = combostr.replace(/%P/g, str.P);

        eobj.EditorScheduleSheetCommands(combostr, true, false);
    }

    this.resize = function () {
        const size = caclEditorSize();
        if (this.editor) {
            this.editor.ResizeTableEditor(size.width, size.height);
        }
    }

    this.getHtmlForOutlook = function (chapterList) {
        let html = "";
        if (chapterList && chapterList.length > 0) {
            for (let i = 0; i < chapterList.length; ++i) {
                let sheetIndex = this.getIndexBySheetName(chapterList[i].sheetName);
                if (sheetIndex < 0) {
                    continue;
                }
                let info = this.sheetInfoList[sheetIndex];
                html += '<div><b>' + chapterList[i].title + '</b></div><br/>';
                html += info.context.RenderSheetForOutlook() + "<br/>";
            }
        } else {
            for (let i = 0; i < this.sheetInfoList.length; ++i) {
                let info = this.sheetInfoList[i];
                html += info.name + "<br/>";
                html += info.context.RenderSheetForOutlook() + "<br/>";
            }
        }
        return html;
    }

    this.recalcAllSheet = function () {
        for (let i = 0; i < this.sheetInfoList.length; ++i) {
            let info = this.sheetInfoList[i];
            info.sheet.RecalcSheet();
        }
    }
}