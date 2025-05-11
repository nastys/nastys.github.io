/*
  DSC Studio
  Copyright (C) 2022-2025 nastys

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
        case 'f2':
            importScripts("./db_f2.js");
            return db_f2;
        case 'x':
            importScripts("./db_x.js");
            return db_x;
        case 'vrfl':
            importScripts("./db_vrfl.js");
            return db_vrfl;
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

            var isModern = false;
            var isBigEndian = false;
            var fileSize = reader.result.byteLength;
            var startOffset = 0;

            // Check if file is modern (F2/X)
            if (data.getInt32(0, true) == 1129535056) // "PVSC" in UInt32 LE
            {
                isModern = true;
                // Check DSC size, start offset, and endianness
                fileSize = data.getInt32(20, true);
                startOffset = data.getInt32(8, true);
                isBigEndian = data.getInt8(15, true) === 24; // true if byte at 0xF is 0x18
            }

            postMessage({'type': 'setbigendian', data: isBigEndian});

            for (let i = startOffset; i < fileSize+startOffset; i+=4)
            {
                postMessage({type: 'progress', data: i / fileSize});
                const num = data.getInt32(i, !isBigEndian);
                if (i == startOffset) 
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
                        else if (isModern)
                        {
                            // If file size and container size differ, then its likely X/XHD as X+ added ENRS. Assume XHD if thats the case; else, use F2nd.
                            // This is kinda hacky because if enrs is missing (resaving using this/using current ScriptEditor), it will automatically be read as F2nd.
                            fmt = (data.getInt32(4, true) == data.getInt32(20, true)) ? "f2" : "x";
                            postMessage({type: 'setfmt', data: fmt});
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
                if (i == startOffset+4 && isModern) {
                    // Branch mode info
                    postMessage({type: 'setbranch', data: num});
                    continue;
                }
                if (typeof thisdb[num] === 'undefined')
                {
                    errors = true;
                    console.log(`undefined: ${num} at ${i}`)
                    continue;
                }
                const opc = thisdb[num].opcode;
                const len = thisdb[num].len;
                let params = [];
                for (let j = 0; j < len; j++)
                {
                    i+=4;
                    params.push(data.getInt32(i, !isBigEndian));
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