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

onmessage = function(e)
{
    const files = e.data.files;

    try
    {
        //for (const file of files)
        const file = files[0];
        //let errors = false;

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(data)
        {
            const lines = data.target.result.split(/\r?\n/);
            const result = [];
            const timestampRegex = /\[(\d{2}):(\d{2}(?:\.\d{1,2})?)\]/g;

            let prog = 0;
            const progInc = lines.length / 100.0;

            postMessage({type: 'progress', data: prog});

            for (let line of lines)
            {
                timestampRegex.lastIndex = 0;
                const timestamps = [];
                let match;
                
                while ((match = timestampRegex.exec(line)) !== null)
                {
                    const minutes = parseInt(match[1], 10);
                    const seconds = parseFloat(match[2]);
                    const ts = Math.floor(((minutes * 60) + seconds) * 100000.0);
                    timestamps.push(ts);
                }

                const lyric = line.replace(timestampRegex, '').trim();

                for (let ts of timestamps)
                {
                    result.push([ts, lyric]);
                }

                prog += progInc;
                postMessage({type: 'progress', data: prog});
            }

            result.sort((a, b) => a[0[0]] - b[0[0]]);
            postMessage({type: 'output', data: result});
        }

        return true;
    }
    catch (e)
    {
        postMessage({type: 'exception', data: e.toString()});
    }

    return false;
}