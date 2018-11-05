$(document).ready(function() {

    const btns = {
        "line0": {"img": "line","tooltip": "", "command": ""},
        "button_undo": { "img": "button_undo", "tooltip": "上一步", "command": "undo"},
        "button_redo": {"img": "button_redo","tooltip": "下一步", "command": "redo"},
        "button_copy": {"img": "button_copy","tooltip": "复制", "command": "copy %C all"},
        "button_cut": {"img": "button_cut","tooltip": "剪切", "command": "cut %C all"},
        "button_paste": {"img": "button_paste","tooltip": "粘贴", "command": "paste %C all"},
        "line1": {"img": "line","tooltip": "", "command": ""},
        "button_delete": {"img": "button_delete","tooltip": "清空内容", "command": "erase %C formulas"},
        "button_pasteformats": {"img": "button_pasteformats","tooltip": "格式化粘贴", "command": "paste %C formats"},
        "button_filldown": {"img": "button_filldown","tooltip": "向下填充", "command": "filldown %C all"},
        "button_fillright": {"img": "button_fillright","tooltip": "向右填充", "command": "fillright %C all"},
        "line2": {"img": "line","tooltip": "", "command": ""},
        "button_alignleft": {"img": "button_alignleft","tooltip": "左对齐", "command": "set %C cellformat left"},
        "button_aligncenter": {"img": "button_aligncenter","tooltip": "居中", "command": "set %C cellformat center"},
        "button_alignright": {"img": "button_alignright","tooltip": "右对齐", "command": "set %C cellformat right"},
        "button_borderon": {"img": "button_borderon","tooltip": "边框", "command": "set %C bt %S%Nset %C br %S%Nset %C bb %S%Nset %C bl %S", "arg": "1px solid rgb(0,0,0)"},
        "button_borderoff": {"img": "button_borderoff","tooltip": "取消边框", "command": "set %C bt %S%Nset %C br %S%Nset %C bb %S%Nset %C bl %S"},
        "line3": {"img": "line","tooltip": "", "command": ""},
        "button_merge": {"img": "button_merge","tooltip": "合并单元格", "command": "merge %C"},
        "button_unmerge": {"img": "button_unmerge","tooltip": "取消合并单元格", "command": "unmerge %C"},
        "button_insertrow": {"img": "button_insertrow","tooltip": "上方插入一行", "command": "insertrow %C"},
        "button_insertcol": {"img": "button_insertcol","tooltip": "左侧插入一列", "command": "insertcol %C"},
        "button_deleterow": {"img": "button_deleterow","tooltip": "删除行", "command": "deleterow %C"},
        "button_deletecol": {"img": "button_deletecol","tooltip": "删除列", "command": "deletecol %C"},
        "line4": {"img": "line","tooltip": "", "command": ""},
        "button_percent": {"img": "percent","tooltip": "切换成百分比格式", "command": "set %C nontextvalueformat #,##0.00%"},
        "button_dot2": {"img": "dot","tooltip": "保留两位小数", "command": "set %C nontextvalueformat #,##0.00"},
        "button_int": {"img": "int","tooltip": "保留整数", "command": "set %C nontextvalueformat #,##0"},
        "line5": {"img": "line","tooltip": "", "command": ""},
    }
    
    let btnHtml = ""
    $.each(btns, function(key, value) {
        const isLine = /line/.test(value.img)
        const className = isLine ? '' : 'icon-btn'
        btnHtml += '<img class="'+ className
            + '" id="'+ key
            + '" src="./images/' + value.img +'.png" title="'+ value.tooltip
            + '" command="' + value.command
            + '" arg="' + value.arg + '"/>'
    })
    $(".action-btns").html(btnHtml)
})
