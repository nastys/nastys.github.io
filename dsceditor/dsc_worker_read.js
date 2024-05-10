/*
  DSC Studio
  Copyright (C) 2022-2024 nastys

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
        case 'pd1':
            importScripts("./db_pd1.js");
            return db_pd1;
        case 'pd2':
            importScripts("./db_pd2.js");
            return db_pd2;
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
        let errors = false;

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
                    if (e.data.autodetectfmt)
                    {
                        const newfmt = get_fmt_from_ver(num);
                        if (newfmt == -1)
                        {
                            postMessage({type: 'exception', data: `ERROR: Cannot autodetect format '${num}'.\nPlease disable autodetection and manually select the format, and open the file again.`});
                            errors = true;
                            break;
                        }
                        else
                        {
                            fmt = newfmt;
                            postMessage({type: 'setfmt', data: fmt});
                        }
                    }
                    thisdb = get_db(fmt);
                    if (!(fmt === 'pd1' || fmt === 'pd2'))
                    {
                        continue;
                    }
                }
                if (typeof thisdb[num] === 'undefined')
                {
                    errors = true;
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
            if (errors)
            {
                postMessage({type: 'warning', data: 'Unknown opcodes were found.\nThe file may be corrupt or the selected format wrong.'});
            }
        }

        return true;
    }
    catch (e) {
        postMessage({type: 'exception', data: e.toString()});
    }

    return false;
}