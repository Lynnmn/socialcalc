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

    this.addNewSheet = function (name, str, selected) {
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
        if (selected || this.sheetInfoList.length == 1) {
            this.selectSheet(name);
        }
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
        var editor = new SocialCalc.TableEditor(sheetInfo.context);
        var node = editor.CreateTableEditor(document.body.clientWidth - 20, 850); // document.body.clientHeight);
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

    this.addRemoteInfo = function (sheet, ref) {
        var range = this.editor.range;
        var info = {
            coord1: SocialCalc.crToCoord(range.left, range.top),
            coord2: SocialCalc.crToCoord(range.right, range.bottom),
            ref: ref,
        }
        sheet.remote.push(info);
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
                cell.datavalue = row[c];
                if (!cell.datatype) {
                    if (r == 0) {
                        cell.datatype = "t";
                        cell.valuetype = "t";
                    } else {
                        cell.datatype = "v";
                        cell.valuetype = "n";
                    }
                }
            }
        }
    }

}