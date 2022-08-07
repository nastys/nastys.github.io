function remove_command(opcode)
{
    const regex = `^[\\t\\f\\v ]*${opcode}[\\t\\f\\v ]*\\(.*\\);?(?:\\r?\\n)*`;
    const model = editor.getModel();
    const matches = model.findMatches(regex, true, true, true, null, false, 999999999);
    console.log(`Found ${matches.length} ${opcode} commands.`);

    let ops = [];
    matches.forEach(match => {
        const op = {range: match.range, text: ''};
        ops.push(op);
    });

    model.pushEditOperations([], ops, () => null);
}

function time_adjacent_cleanup()
{
    // todo cleanup "TIME();PV_BRANCH_MODE();TIME();"
    const regex = `^[\\t\\f\\v ]*TIME[\\t\\f\\v ]*\\(.*\\);?(?:\\r?\\n)*`;
    const model = editor.getModel();
    const matches = model.findMatches(regex, true, true, true, null, false, 999999999);
    //console.log(`Found ${matches.length} commands.`);

    let ops = [];
    for (let i = 0; i < matches.length - 1; i++)
    {
        if (matches[i].range.endLineNumber == matches[i+1].range.startLineNumber)
        {
            const op = {range: matches[i].range, text: ''};
            ops.push(op);
        }
    };

    //console.log(`Will only delete ${ops.length} of them.`);
    model.pushEditOperations([], ops, () => null);
}

function get_previous_command_int(command)
{
    const regex = `^[\\t\\f\\v ]*${command}[\\t\\f\\v ]*\\((.*)\\);?(?:\\r?\\n)*`;
    const model = editor.getModel();
    const position = editor.getPosition();

    const match = model.findPreviousMatch(regex, {lineNumber: position.lineNumber + 1, column: 1}, true, true, null, true);
    if (match && match.range.startLineNumber <= position.lineNumber)
    {
        const out = parseInt(match.matches[1]);
        return out ? out : 0;
    }

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

function time_cleanup()
{
    const regex = `^[\\t\\f\\v ]*TIME[\\t\\f\\v ]*\\(.*\\);?(?:\\r?\\n)*`;
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
            console.error(`Invalid TIME command at line ${linen}.`);
            alert(`Invalid TIME command at line ${linen}.`);
            continue;
        }

        if (i > 0)
        {
            if (parseInt(current_time) <= parseInt(last_time))
            {
                const op = {range: matches[i].range, text: ''};
                push_ops(ops, op);
            }
        }

        last_time = current_time;
        last_linen = current_linen;
    };

    //console.log(`Deleting ${ops.length} of them.`);
    model.pushEditOperations([], ops, () => null);

    if (ops.length > 0) 
    {
        time_cleanup();
    }
    else
    {
        time_adjacent_cleanup();
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
    const decorations = editor.getModel().getAllDecorations();
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
    const ids_to_remove = [];
    const decorations = editor.getModel().getAllDecorations();
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