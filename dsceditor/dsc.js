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
        alert("This button only works on Chromium at the moment; just drag&drop the file(s) onto the browser for now.");
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
                const par_in = line.substring(par_start + 1, par_end);
                const command = line.substring(0, par_start);
                const params = par_in.split(',');
                if (params.length == 1 && params[0] == '') params.pop();
                
                const dbcmd = db[command];
                if (typeof dbcmd === 'undefined')
                {
                    SaveError(i, 1, "command " + command + " not valid");
                }

                const cmd = dbcmd.info_FT;
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
                document.getElementById('dscver').value = num;
                continue;
            }
            const opc = db_ft[num].opcode;
            const len = db_ft[num].len;
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
}
