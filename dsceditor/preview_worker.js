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
onmessage = function(e)
{
    try{
        const commands = e.data.value.split('\n');
        let currentLine = e.data.line;
        let currentTime = e.data.time;
        let currentBpm = e.data.bpm;
        let currentTft = e.data.tft;

        do
        {
            this.postMessage({msg: "lineset", line: currentLine});
            const currentCommand = extract_command_pw(commands[currentLine-1]);
            //console.log(currentCommand.command);
            switch (currentCommand.command)
            {
                case "BAR_TIME_SET":
                currentBpm = currentCommand.params[0];
                currentTft = 1000 / (currentBpm / ((currentCommand.params[1] + 1) * 60));
                break;

                case "TARGET_FLYING_TIME":
                currentTft = currentCommand.params[0];
                currentBpm = 240000/currentTft;
                break;

                case "TARGET":
                set_target(currentCommand, currentTft, e.data.classicHolds);
                break;

                case "TIME":
                sleep((currentCommand.params[0] - currentTime)/100);
                currentTime = currentCommand.params[0];
                break;

                case "PV_END":
                case "END":
                this.postMessage({msg: "end"});
                return;
            }
            currentLine++;
        }
        while (currentLine < e.data.lineCount);
    }
    catch (e)
    {
        console.log(e);
        this.postMessage({msg: "info", info: e});
    }

    this.postMessage({msg: "end"});
    return;
}

function extract_command_pw(cont)
{
    let par = [];
    let cmd = "";

    const regex = RegExp(`^[\\t\\f\\v ]*(.*)[\\t\\f\\v ]*\\((.*)\\);?(?:\\r?\\n)*`);
    const matches = regex.exec(cont);
    if (matches)
    {
        cmd = matches[1];
        const outStr = matches[2];
        if (outStr)
        {
            outStr.split(',').forEach(function (param)
            {
                par.push(parseInt(param));
            });
        }
    }

    return {params: par, command: cmd};
}

function set_target(command, tft, classicHolds)
{
    postMessage({
        msg: "target",
        tgt: {
            type:       command.params[0],
            hold_timer: classicHolds ? command.params[1] : NaN,
            hold_end:   classicHolds ? command.params[2] : NaN,
            x:          command.params[classicHolds ? 3 : 1]*0.002666667,
            y:          command.params[classicHolds ? 4 : 2]*0.002666667,
            angle:      command.params[classicHolds ? 5 : 3],
            wavecount:  command.params[6],
            distance:   command.params[classicHolds ? 7 : 4],
            amplitude:  command.params[classicHolds ? 8 : 5],
            tft:        classicHolds ? command.params[9] : tft,
            ts:         classicHolds ? command.params[10] : NaN,
        },
    })
}

function sleep(t)
{
    //console.log(`sleep ${t}`);
    const start = Date.now();
    while (Date.now() - start < t);
}