importScripts("./fmt.js");

function get_db(fmt)
{
    switch (fmt)
    {
        case 'ft':
            importScripts("./db_ft.js");
            return db_ft;
        case 'dt2':
            importScripts("./db_dt2.js");
            return db_dt2;
    }

    throw `Format error: Unknown format '${fmt}'.`;
}

onmessage = function(e)
{
    const files = e.data.files;
    let fmt = e.data.dscfmt;

    try {
        //for (const file of files)
        const file = files[0];
        let thisdb;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function(){
            const data = new DataView(reader.result);
            let commands;
            commands = "";
            for (let i = 0; i < reader.result.byteLength; i+=4)
            {
                postMessage({type: 'progress', data: i / reader.result.byteLength});
                const num = data.getInt32(i, true);
                if (i == 0) 
                {
                    postMessage({type: 'setver', data: num});
                    const newfmt = get_fmt_from_ver(num);
                    if (newfmt == -1)
                    {
                        postMessage({type: 'warning', data: `WARNING: Cannot autodetect format '${num}'.`});
                    }
                    else
                    {
                        fmt = newfmt;
                        postMessage({type: 'setfmt', data: fmt});
                    }
                    thisdb = get_db(fmt);
                    continue;
                }
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
            }
            postMessage({type: 'datatext', data: commands});
        }

        return true;
    }
    catch (e) {
        postMessage({type: 'exception', data: e.toString()});
    }

    return false;
}