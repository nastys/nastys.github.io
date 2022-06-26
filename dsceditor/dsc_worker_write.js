importScripts("./db.js");

function get_db_info(fmt)
{
    switch (fmt)
    {
        case 'ft':
            return 'info_FT';
        case 'dt2':
            return 'info_f';
    }

    throw `Format error: Unknown format '${fmt}'.`;
}

onmessage = function(e)
{
    const lines = e.data.lines;
    let fmt = e.data.dscfmt;
    let ver = e.data.dscver;

    function SaveError(line, column, message) {
        postMessage({type: 'seteditorpos', data: {lineNumber: line, column: column}});
        throw `line ${line}: ${message}`;
    }

    try {
        let filenative = [];

        filenative.push(parseInt(ver));

        const info = get_db_info(fmt);
        for (let i = 0; i < lines.length; i++) {
            postMessage({type: 'progress', data: i / lines.length});
            const line = lines[i].trim();
            if (line != '')
            {
                const par_start = line.indexOf('(');
                if (par_start < 0)
                {
                    SaveError(i + 1, 1, "missing '('");
                }
                const par_end = line.indexOf(')');
                if (par_end < 0)
                {
                    SaveError(i + 1, 1, "missing ')'");
                }
                if (line.length > par_end + 1)
                {
                    if (line[par_end + 1] != ';')
                    {
                        const col = par_end + 1;
                        SaveError(i + 1, col, `unexpected character '${line[col]}'`);
                    }
                    else if (line.length > par_end + 2)
                    {
                        const col = par_end + 2;
                        SaveError(i + 1, col, `unexpected character '${line[col]}'`);
                    }
                }
                const par_in = line.substring(par_start + 1, par_end);
                const command = line.substring(0, par_start);
                const params = par_in.split(',');
                if (params.length == 1 && params[0] == '') params.pop();
                
                const dbcmd = db[command];
                if (typeof dbcmd === 'undefined')
                {
                    SaveError(i, 1, `command ${command} not valid`);
                }

                const cmd = dbcmd[info];
                if (typeof cmd === 'undefined')
                {
                    SaveError(i, 1, `command ${command} not supported by format '${fmt}'`);
                }

                const opcode = cmd.id;
                const expected_param_count = cmd.len;

                if (expected_param_count != params.length) {
                    SaveError(i, 1, `command ${command} expected ${expected_param_count}, got ${params.length}`);
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
        postMessage({type: 'datasave', data: fileblob});

        return true;
    }
    catch (e) {
        postMessage({type: 'exception', data: e.toString()});
    }

    return false;
}