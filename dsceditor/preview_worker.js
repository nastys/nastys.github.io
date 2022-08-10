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
    const offset = classicHolds ? 2 : 0;
    postMessage({
        msg: "target",
        tgt: {
            type:       command.params[0],
            x:          command.params[1 + offset]*0.002666667,
            y:          command.params[2 + offset]*0.002666667,
            angle:      command.params[3 + offset],
            wavecount:  command.params[4 + offset],
            distance:   command.params[5 + offset],
            amplitudde: command.params[6 + offset],
            tft: tft,
        },
    })
}

function sleep(t)
{
    //console.log(`sleep ${t}`);
    const start = Date.now();
    while (Date.now() - start < t);
}