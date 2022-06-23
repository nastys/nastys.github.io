function set_fmt_ver(ver)
{
    document.getElementById('dscver').value = ver;
    const fmt = document.getElementById('dscfmt');

    switch (ver)
    {
        case 285614104:
        case 335874337:
        case 369295649:
        case 353510679:
        case 352458520:
        case 335745816:
        case 335618838:
        case 319956249:
        case 319296802:
        case 318845217:
            fmt.value = 'ft';
            return true;
        case 285419544:
        case 285349657:
        case 302121504:
            fmt.value = 'dt2';
            return true;
    }

    return false;
}

function get_db()
{
    const fmt = document.getElementById('dscfmt').value;

    switch (fmt)
    {
        case 'ft':
            return db_ft;
        case 'dt2':
            return db_dt2;
    }

    console.error("Unknown format " + value);
    alert("Unknown format " + value);
    throw "Format error";
}

function get_db_info()
{
    const fmt = document.getElementById('dscfmt').value;

    switch (fmt)
    {
        case 'ft':
            return 'info_FT';
        case 'dt2':
            return 'info_f';
    }

    console.error("Unknown format " + value);
    alert("Unknown format " + value);
    throw "Format error";
}

document.body.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
});

document.body.addEventListener("drop", (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    read_dsc(files);
});

document.getElementById('dscfmt').onchange = function()
{
    switch (document.getElementById('dscfmt').value)
    {
        case 'ft':
            document.getElementById('dscver').value = 353510679;
            break;
        case 'dt2':
            document.getElementById('dscver').value = 302121504;
            break;
    }
}

let fallback_file_picker;
document.getElementById('toolopen').onclick = async function()
{
    try {
        const handles = await window.showOpenFilePicker({multiple: true});
        const files = [];
        for (const handle of handles)
        {
            files.push(await handle.getFile());
        }
        read_dsc(files);
    }
    catch {
        fallback_file_picker = document.createElement('input');
        fallback_file_picker.type = 'file';
        fallback_file_picker.multiple = 'true';
        fallback_file_picker.onchange = _this => {
            read_dsc(Array.from(fallback_file_picker.files));
            fallback_file_picker.remove();
        };
        fallback_file_picker.click();
        fallback_file_picker.remove();
    }
}

document.getElementById('toolsaveas').onclick = function()
{
    function SaveError(line, column, message) {
        editor.revealLineInCenter(line);
        editor.setPosition({column: column, lineNumber: line});
        throw "line " + line + ": " + message;
    }

    try {
        let filenative = [];

        filenative.push(parseInt(document.getElementById('dscver').value));

        const model = editor.getModel();
        const info = get_db_info();
        for (let i = 1; i <= model.getLineCount(); i++) {
            const line = model.getLineContent(i);
            if (line != '')
            {
                const par_start = line.indexOf('(');
                if (par_start < 0)
                {
                    SaveError(i, 1, "missing '('");
                }
                const par_end = line.indexOf(')');
                if (par_end < 0)
                {
                    SaveError(i, 1, "missing ')'");
                }
                if (line.length > par_end + 1)
                {
                    if (line[par_end + 1] != ';')
                    {
                        const col = par_end + 1;
                        SaveError(i, col, "unexpected character '"+line[col]+"'");
                    }
                    else if (line.length > par_end + 2)
                    {
                        const col = par_end + 2;
                        SaveError(i, col, "unexpected character '"+line[col]+"'");
                    }
                }
                const par_in = line.substring(par_start + 1, par_end);
                const command = line.substring(0, par_start);
                const params = par_in.split(',');
                if (params.length == 1 && params[0] == '') params.pop();
                
                const dbcmd = db[command];
                if (typeof dbcmd === 'undefined')
                {
                    SaveError(i, 1, "command " + command + " not valid");
                }

                const cmd = dbcmd[info];
                const opcode = cmd.id;
                const expected_param_count = cmd.len;

                if (expected_param_count != params.length) {
                    SaveError(i, 1, "command " + command + " expected " + expected_param_count + ", got " + params.length);
                }

                filenative.push(opcode);

                params.forEach(param => {    
                    filenative.push(param);
                });
            }
        }
        
        const filedata = new ArrayBuffer(filenative.length * 4);
        const fileview = new DataView(filedata);
        let fileoffset = 0;

        filenative.forEach(element => {
            fileview.setInt32(fileoffset, element, true);   
            fileoffset += 4;  
        });

        const fileblob = new Blob([filedata]);
        const fileurl = URL.createObjectURL(fileblob);
        const filelink = document.createElement('a');
        filelink.href = fileurl;
        filelink.download = 'test.dsc';
        filelink.click();
        filelink.remove();

        return true;
    }
    catch (e) {
        console.error(e);
        alert(e);
    }

    return false;
};

function read_dsc(files)
{
    try {
        //for (const file of files)
        const file = files[0];

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        document.body.classList.add("progress");
        reader.onload = function(){
            const data = new DataView(reader.result);
            let commands;
            commands = "";
            for (let i = 0; i < reader.result.byteLength; i+=4)
            {
                const num = data.getInt32(i, true);
                if (i == 0) 
                {
                    const set = set_fmt_ver(num);
                    if (!set)
                    {
                        const msg = "Unknown format " + num;
                        console.log(msg);
                        alert(msg);
                    }
                    continue;
                }
                const thisdb = get_db(num);
                const opc = thisdb[num].opcode;
                const len = thisdb[num].len;
                let params = [];
                for (let j = 0; j < len; j++)
                {
                    i+=4;
                    params.push(data.getInt32(i, true));
                }

                commands += opc;
                if (params.length)
                {
                    commands += "(";
                    for (let p = 0; p < params.length; p++)
                    {
                        commands += params[p];
                        if (p == params.length - 1)
                        {
                            commands += ");";
                        }
                        else
                        {
                            commands += ", ";
                        }
                    }
                }
                else
                {
                    commands += "();";
                }

                commands += '\n';
                editor.setValue(commands);
                document.body.classList.remove("progress");
            }
        }

        return true;
    }
    catch (e) {
        console.error(e);
        alert(e);
    }

    return false;
}
