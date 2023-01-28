function remove_command(opcode)
{
    const regex = `^[\\t\\f\\v ]*${opcode}[\\t\\f\\v ]*\\(.*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, false, 999999999);
    console.log(`Found ${matches.length} ${opcode} commands.`);

    let ops = [];
    matches.forEach(match => {
        ops.push({range: match.range, text: ''});
    });

    model.pushEditOperations([], ops, () => null);
}

function dupe_adjacent_cleanup(command = "TIME")
{
    // todo cleanup "TIME(A);PV_BRANCH_MODE(any);TIME(B);"
    const regex = `^[\\t\\f\\v ]*${command}[\\t\\f\\v ]*\\(.*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, false, 999999999);
    //console.log(`Found ${matches.length} commands.`);

    let ops = [];
    for (let i = 0; i < matches.length - 1; i++)
    {
        if (matches[i].range.endLineNumber == matches[i+1].range.startLineNumber)
        {
            ops.push({range: matches[i].range, text: ''});
        }
    };

    //console.log(`Will only delete ${ops.length} of them.`);
    model.pushEditOperations([], ops, () => null);
}

function get_previous_command_par(command, position = editor.getPosition())
{
    const regex = `^[\\t\\f\\v ]*${command}[\\t\\f\\v ]*\\((.*)\\);?(?:\\r?\\n)*`;

    let out = [];
    let pos = -1;

    const match = model.findPreviousMatch(regex, {lineNumber: position.lineNumber + 1, column: 1}, true, true, null, true);
    if (match && match.range.startLineNumber <= position.lineNumber)
    {
        const outStr = match.matches[1];
        if (outStr)
        {
            pos = match.range.startLineNumber;

            outStr.split(',').forEach(function (param)
            {
                out.push(parseInt(param));
            });
        }
    }

    return {params: out, line: pos};
}

function get_previous_command_int(command, position)
{
    try
    {
        const str = get_previous_command_par(command, position);
        const num = parseInt(str.params[0]);
        return num ? num : 0;
    }
    catch {}

    return 0;
}

function push_ops(ops, op)
{
    let exists = false;
    ops.forEach(function(eop)
    {
        if (eop.range == op.range)
        {
            exists = true;
            return;
        }
    });

    if (!exists)
    {
        ops.push(op);
    }
}

function dupe_cleanup(command = "TIME")
{
    const regex = `^[\\t\\f\\v ]*${command}[\\t\\f\\v ]*\\(.*\\);?(?:\\r?\\n)*`;
    const model = editor.getModel();
    const matches = model.findMatches(regex, true, true, true, null, false, 999999999);
    //console.log(`Found ${matches.length} commands.`);

    let ops = [];
    let last_time;
    let last_linen;
    for (let i = 0; i < matches.length; i++)
    {
        const line = model.getValueInRange(matches[i].range).trim();
        const par_start = line.indexOf('(');
        const par_end = line.indexOf(')');
        const par_in = line.substring(par_start + 1, par_end);
        const params = par_in.split(',');
        const current_time = params[0];
        const current_linen = matches[i].range.startLineNumber;
        if (params.length != 1 || current_time == '')
        {
            console.error(`Invalid command at line ${linen}.`);
            alert(`Invalid command at line ${linen}.`);
            continue;
        }

        if (i > 0)
        {
            if (parseInt(current_time) <= parseInt(last_time))
            {
                push_ops(ops, {range: matches[i].range, text: ''});
            }
        }

        last_time = current_time;
        last_linen = current_linen;
    };

    //console.log(`Deleting ${ops.length} of them.`);
    model.pushEditOperations([], ops, () => null);

    if (ops.length > 0) 
    {
        dupe_cleanup(command);
    }
    else
    {
        dupe_adjacent_cleanup(command);
    }
}

function window_rmcommands()
{
    const bg = document.getElementById('modalbg');
    const container = document.getElementById('modalwndinside');
    const header = document.getElementById('modalwndheader');
    const footer = document.getElementById('modalwndfooter');
    footer.classList.add('gradient');

    let keys = [];
    const lines = editor.getValue().split(/\r?\n/);
    for (const line of lines)
    {
        if (line != '')
        {
            const par_start = line.indexOf('(');
            if (par_start > 0)
            {
                const thiscommand = line.substring(0, par_start);
                if (!keys.includes(thiscommand))
                {
                    keys.push(thiscommand);
                }
            }
        }
    }
    keys.sort();

    keys.forEach(key => {
        const cont = document.createElement('div');
        cont.classList.add('cbcont');
        const el = document.createElement('input');
        el.type = 'checkbox';
        el.id = 'cb_' + key;
        el.classList.add('cb_rmcommand');
        const lab = document.createElement('label');
        lab.setAttribute('for', el.id);
        lab.innerText = key;
        lab.classList.add('cblabel');
        cont.appendChild(el);
        cont.appendChild(lab);
        container.appendChild(cont);
    });
    
    const operation = document.createElement('select');
    const operation_remove = document.createElement('option');
    operation_remove.value = "remove";
    operation_remove.innerText = "Remove";
    operation.appendChild(operation_remove);
    const operation_isolate = document.createElement('option');
    operation_isolate.value = "isolate";
    operation_isolate.innerText = "Isolate";
    operation.appendChild(operation_isolate);
    header.appendChild(operation);
    const headerlab = document.createElement('label');
    headerlab.setAttribute('for', operation.id);
    headerlab.innerText = " commands";
    header.appendChild(headerlab);

    const btnok = document.createElement('btn');
    btnok.classList.add('modalbtn');
    btnok.classList.add('modalbtn_blue');
    btnok.innerText = 'OK';
    const btncanc = document.createElement('btn');
    btncanc.classList.add('modalbtn');
    btncanc.classList.add('modalbtn_red');
    btncanc.innerText = 'Cancel';
    function closewnd()
    {
        bg.classList.add('invisible');
        setTimeout(function() { 
            bg.classList.add('hidden');
            header.innerHTML = '';
            container.innerHTML = '';
            footer.innerHTML = '';
        }, 300);
    }
    btncanc.onclick = function()
    {
        closewnd();
    }
    btnok.onclick = function()
    {
        const invert = operation.value == "isolate";
        const boxes = document.getElementsByClassName('cb_rmcommand');
        Array.prototype.forEach.call(boxes, function(box) {
            if (!invert && box.checked || invert && !box.checked)
            {
                const opcode = box.id.substring(3);
                remove_command(opcode);
            }
        });

        closewnd();
    }
    footer.appendChild(btnok);
    footer.appendChild(btncanc);

    bg.classList.remove('hidden');
    bg.clientWidth;
    bg.classList.remove('invisible');
}

function remove_targets()
{
    remove_command('TARGET');
    remove_command('TARGET_FLYING_TIME');
    remove_command('BAR_TIME_SET');
    remove_command('MODE_SELECT');
    dupe_cleanup();
    dupe_cleanup("TARGET_FLYING_TIME");
}

function bookmark_update()
{
    if(bookmarks.length)
    {
        document.getElementById('toolbkprev').classList.remove('toolbutton-disabled');
        document.getElementById('menuitem_prevbkm').classList.remove('menuitem-disabled');
        document.getElementById('toolbknext').classList.remove('toolbutton-disabled');
        document.getElementById('menuitem_nextbkm').classList.remove('menuitem-disabled');
        document.getElementById('toolbkclear').classList.remove('toolbutton-disabled');
        document.getElementById('menuitem_rmallbkm').classList.remove('menuitem-disabled');
    }
    else
    {
        document.getElementById('toolbkprev').classList.add('toolbutton-disabled');
        document.getElementById('menuitem_prevbkm').classList.add('menuitem-disabled');
        document.getElementById('toolbknext').classList.add('toolbutton-disabled');
        document.getElementById('menuitem_nextbkm').classList.add('menuitem-disabled');
        document.getElementById('toolbkclear').classList.add('toolbutton-disabled');
        document.getElementById('menuitem_rmallbkm').classList.add('menuitem-disabled');
    }
}

function bookmark_toggle() 
{
    const id_to_remove = [];
    const line = editor.getPosition().lineNumber;
    const decorations = model.getAllDecorations();
    decorations.forEach(function(decoration)
    {
        bookmarks.forEach(function(bookmark)
        {
            if (bookmark.includes(decoration.id) && decoration.range.startLineNumber == line)
            {
                id_to_remove.push(decoration.id);
            }
        });
    });

    if (id_to_remove.length > 0)
    {
        editor.deltaDecorations(id_to_remove,[]);
        const index = bookmarks.indexOf(id_to_remove[0]);
        bookmarks = bookmarks.filter(function(bookmark){
            return bookmark != id_to_remove[0];
        });
    }
    else
    {
        bookmarks.push(editor.deltaDecorations(
            [],
            [
                {
                    range: new monaco.Range(line, 1, line, 1),
                    options:
                    {
                        isWholeLine: true,
                        stickiness: 1,
                        minimap: true,
                        overviewRuler: true,
                        glyphMarginClassName: 'm_bookmark'
                    }
                }
            ]
        ));
    }

    bookmark_update();
}

function bookmark_find(next) 
{
    var BreakException = {};

    const line = editor.getPosition().lineNumber;
    const decorations = editor.getModel().getAllDecorations();
    let bookmap = [];
    bookmarks.forEach(function(bookmark) {
        decorations.forEach(function(dec) {
            if (bookmark.includes(dec.id))
            {
                bookmap.push(dec.range.startLineNumber);
            }
        })
    });
    bookmap.sort((a, b) => {
        if (next)
        {
            return a > b;
        }
        else
        {
            return a < b;
        }
    });
    bookmap = bookmap.filter((a) => {
        if (next)
        {
            return a > line;
        }
        else
        {
            return a < line;
        }
    });
    if (bookmap.length)
    {
        editor.revealLineInCenter(bookmap[0]);
        editor.setPosition({column: 1, lineNumber: bookmap[0]});
    }
}

function bookmark_clear() 
{
    if (typeof model !== 'undefined')
    {
        const ids_to_remove = [];
        const decorations = model.getAllDecorations();
        decorations.forEach(function(decoration)
        {
            bookmarks.forEach(function(bookmark)
            {
                if (bookmark[0] == decoration.id)
                {
                    ids_to_remove.push(decoration.id);
                }
            });
        });

        if (ids_to_remove.length > 0)
        {
            editor.deltaDecorations(ids_to_remove,[]);
            bookmarks = [];
        }

        bookmark_update();
    }
}

function get_current_time()
{
    return get_previous_command_int('TIME');
}

function time_to_string(pdtime)
{
    // thanks to somewhatlurker

    const frac = pdtime % 100000;
    pdtime -= frac;
    pdtime /= 100000;

    const seconds = pdtime % 60;
    pdtime -= seconds;
    pdtime /= 60;

    const minutes = pdtime % 60;
    pdtime -= minutes;
    pdtime /= 60;

    return `${String(pdtime).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(frac).padStart(5, '0')}`;
}

function get_current_branch()
{
    return get_previous_command_int('PV_BRANCH_MODE');
}

function branch_to_string(branch)
{
    switch (branch)
    {
        case 0: return 'Global';
        case 1: return 'Failure';
        case 2: return 'Success';
    }

    return `Invalid/${branch}`;
}

function get_ts(position)
{
    const lastTft = get_previous_command_par('TARGET_FLYING_TIME', position);
    const lastBts = get_previous_command_par('BAR_TIME_SET', position);

    if (lastBts.line == -1 && lastTft.line == -1) return { undefined: true };
    return lastBts.line > lastTft.line ?
    { bpm: lastBts.params[0], ts: lastBts.params[1] + 1, tft: 1000 / (lastBts.params[0] / ((lastBts.params[1] + 1) * 60.0)) } :
    { bpm: Math.round(240000/lastTft.params[0]), ts: NaN, tft: lastTft.params[0]};
}

function reload_indicators()
{
    const time = get_current_time();
    const ts = get_ts();
    document.getElementById('indicator_time').value = time_to_string(time);
    document.getElementById('indicator_frame').innerText = String(6 * time / 10000);
    document.getElementById('indicator_branch').innerText = branch_to_string(get_current_branch());
    document.getElementById('indicator_ts').innerText = ts.undefined ? "Undefined" : ts.ts ? `${ts.bpm}, ${ts.ts}/4` : `~${ts.bpm}`;
    document.getElementById('indicator_hit').innerText = ts.undefined ? "Undefined" : `${time_to_string((ts.tft*100) + time)}`;
}

function normalize_time(diff = NaN, from = NaN, to = NaN)
{
        const regex = `^[\\t\\f\\v ]*TIME[\\t\\f\\v ]*\\((.*)\\);?(?:\\r?\\n)*`;
        const matches = model.findMatches(regex, true, true, true, null, true, 999999999);

        let ops = [];
        for (const match of matches)
        {
            const num = parseInt(match.matches[1]);
            if (!Number.isNaN(num))
            {
                if (Number.isNaN(diff))
                {
                    diff = num * -1;
                }

                if ((Number.isNaN(from) || match.range.startLineNumber >= from) && (Number.isNaN(to) || match.range.startLineNumber <= to))
                {
                    ops.push({range: match.range, text: `TIME(${String(num + diff)});\n`});
                }
            }
        };
    
        model.pushEditOperations([], ops, () => null);

        reload_indicators();
}

function shift_time()
{
    const bg = document.getElementById('modalbg');
    const container = document.getElementById('modalwndinside');
    const header = document.getElementById('modalwndheader');
    const footer = document.getElementById('modalwndfooter');
    footer.classList.add('gradient');

    const cont = document.createElement('div');
    cont.classList.add('cbcont');
    const el = document.createElement('input');
    el.type = 'number';
    el.id = 'nm_diff';
    el.classList.add('mleft');
    el.classList.add('mtop4');
    const lab = document.createElement('label');
    lab.setAttribute('for', el.id);
    lab.innerText = 'TIME difference:';
    cont.appendChild(lab);
    cont.appendChild(el);
    container.appendChild(cont);

    const cont1 = document.createElement('div');
    cont1.classList.add('cbcont');
    const el1 = document.createElement('input');
    el1.type = 'number';
    el1.id = 'nm_from';
    el1.min = 0;
    el1.classList.add('mleft');
    el1.classList.add('mtop4');
    const lab1 = document.createElement('label');
    lab1.setAttribute('for', el1.id);
    lab1.innerText = 'From line:';
    cont1.appendChild(lab1);
    cont1.appendChild(el1);
    container.appendChild(cont1);

    const cont2 = document.createElement('div');
    cont2.classList.add('cbcont');
    const el2 = document.createElement('input');
    el2.type = 'number';
    el2.id = 'nm_to';
    el2.min = 0;
    el2.classList.add('mleft');
    el2.classList.add('mtop4');
    const lab2 = document.createElement('label');
    lab2.setAttribute('for', el2.id);
    lab2.innerText = 'To line:';
    cont2.appendChild(lab2);
    cont2.appendChild(el2);
    container.appendChild(cont2);
    
    const headerlab = document.createElement('label');
    headerlab.innerText = "Advanced TIME shift";
    header.appendChild(headerlab);

    const btnok = document.createElement('btn');
    btnok.classList.add('modalbtn');
    btnok.classList.add('modalbtn_blue');
    btnok.innerText = 'OK';
    const btncanc = document.createElement('btn');
    btncanc.classList.add('modalbtn');
    btncanc.classList.add('modalbtn_red');
    btncanc.innerText = 'Cancel';
    function closewnd()
    {
        bg.classList.add('invisible');
        setTimeout(function() { 
            bg.classList.add('hidden');
            header.innerHTML = '';
            container.innerHTML = '';
            footer.innerHTML = '';
        }, 300);
    }
    btncanc.onclick = function()
    {
        closewnd();
    }
    btnok.onclick = function()
    {
        const diff = parseInt(el.value);
        const from = parseInt(el1.value);
        const to = parseInt(el2.value);

        if (!Number.isNaN(diff) && diff != 0)
        {
            const pfrom = from == 0 ? NaN : from;
            const pto = to == 0 ? NaN : to;

            if (Number.isNaN(pfrom) || Number.isNaN(pto) || pfrom <= pto)
            {
                normalize_time(diff, pfrom, pto);
            }
        }

        closewnd();
    }
    footer.appendChild(btnok);
    footer.appendChild(btncanc);

    bg.classList.remove('hidden');
    bg.clientWidth;
    bg.classList.remove('invisible');
}

function analyze_targets(begin, end)
{
    const regex = `^[\\t\\f\\v ]*TARGET[\\t\\f\\v ]*\\((?:[\\t\\f\\v ]*-?\\d{1,}[\\t\\f\\v ]*,){6}[\\t\\f\\v ]*-?\\d{1,}[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);

    let counter = 0;

    for (const match of matches)
    {
        if (++counter < begin)
        {
            continue;
        }
        else if (counter > end)
        {
            break;
        }

        const time_tgt = get_previous_command_par('TIME', {lineNumber: match.range.startLineNumber, column: 1});
        const current_time = parseInt(time_tgt.params[0]);
        if (isNaN(current_time))
        {
            console.error(`Invalid timestamp for ${match.range.startLineNumber}.`);
            continue;
        }
        const tft = get_ts({lineNumber: match.range.startLineNumber, column: 1}).tft;
        if (isNaN(tft))
        {
            console.error(`Invalid target duration for ${match.range.startLineNumber}.`);
            continue;
        }
        
        console.log(`${counter} - LINE ${match.range.startLineNumber} - SPAWN ${time_to_string(current_time)} - HIT ${time_to_string(current_time + (tft*100))}`);
    }
}

function remove_branch(branch)
{
    const regex = `^[\\t\\f\\v ]*.*[\\t\\f\\v ]*\\(.*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, false, 999999999);

    let ops = [];
    matches.forEach(match => {
        if (get_previous_command_int('PV_BRANCH_MODE', {lineNumber: match.range.startLineNumber, column: 1}) == branch)
        {
            ops.push({range: match.range, text: ''});
        }
    });

    model.pushEditOperations([], ops, () => null);
}