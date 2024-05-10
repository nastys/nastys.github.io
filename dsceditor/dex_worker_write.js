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
    let performer = e.data.performer;
    let dex_name = e.data.dexname;

    function SaveError(line, column, message) {
        postMessage({type: 'seteditorpos', data: {lineNumber: line, column: column}});
        throw `line ${line}: ${message}`;
    }

    try {
        let dex_face = [];
        let dex_facecl = [];

        let frame = 0;

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

                switch (command)
                {
                    case 'TIME':
                        frame = (6 * Number.parseInt(params[0])) / 10000;
                    break;
                    case 'EXPRESSION':
                        if (params[0] == performer)
                        {
                            dex_face.push({
                                frame: frame,
                                type: 0,
                                id: Number.parseInt(params[1]),
                                value: 1,
                                trans: Number.parseFloat(params[2]),
                            });
                        }
                    break;
                    case 'EYE_ANIM':
                        if (params[0] == performer)
                        {
                            dex_facecl.push({
                                frame: frame,
                                type: 1,
                                id: Number.parseInt(params[1]),
                                value: 1,
                                trans: Number.parseFloat(params[2]),
                            });
                        }
                    break;
                }
            }
        }

        console.log("Extracted face (EXPRESSION)", dex_face);
        console.log("Extracted facecl (EYE_ANIM)", dex_facecl);
        
        const end =
        {
            frame: 999999.0,
            type: 0xFFFF,
            id: 0,
            value: 0.0,
            trans: 0.0,
        };

        dex_face.push(end);
        dex_facecl.push(end);

        const dex_name_bin = new TextEncoder().encode(dex_name);

        const filelen = 0x3C + (dex_face.length * 16) + (dex_facecl.length * 16) + dex_name_bin.length + 2;
        const filedata = new ArrayBuffer(filelen);
        const fileview = new DataView(filedata);

        console.log("Created new file...", filelen);

        fileview.setInt32(0x00, 0x64, true); // magic
        fileview.setInt32(0x04, 0x01, true); // exp length
        fileview.setInt32(0x08, 0x20, true); // dex offsets (face,facecl)*len
        fileview.setInt32(0x0C, 0x28, true); // dex names*len offset

        // dex offset
        fileview.setInt32(0x20, 0x40, true); // exp[0].face start offset
        let fileoffset = 0x2C;
        console.log("Written header...", fileoffset);

        fileoffset = 0x3C;
        dex_face.forEach(element => {
            fileview.setFloat32(fileoffset += 0x04, element.frame, true);
            fileview.setUint16(fileoffset += 0x04, element.type, true);
            fileview.setUint16(fileoffset += 0x02, element.id, true);
            fileview.setFloat32(fileoffset += 0x02, element.value, true);
            fileview.setFloat32(fileoffset += 0x04, element.trans, true);
        });
        console.log("Written face...", fileoffset);

        fileview.setInt32(0x24, fileoffset + 0x04, true);
        dex_facecl.forEach(element => {
            fileview.setFloat32(fileoffset += 0x04, element.frame, true);
            fileview.setUint16(fileoffset += 0x04, element.type, true);
            fileview.setUint16(fileoffset += 0x02, element.id, true);
            fileview.setFloat32(fileoffset += 0x02, element.value, true);
            fileview.setFloat32(fileoffset += 0x04, element.trans, true);
        });
        console.log("Written facecl...", fileoffset);

        fileview.setInt32(0x28, fileoffset + 0x01, true);
        for (const character of dex_name_bin)
        {
            fileview.setUint8(fileoffset += 0x01, character);
        }
        console.log("Written name. Done!", fileoffset);

        const fileblob = new Blob([filedata]);
        postMessage({type: 'dataexport', data: { blob: fileblob, filename: `${dex_name}.bin` }});

        return true;
    }
    catch (e) {
        postMessage({type: 'exception', data: e.toString()});
    }

    return false;
}