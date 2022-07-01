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
    const regex = `^[\\t\\f\\v ]*TIME[\\t\\f\\v ]*\\(.*\\);?(?:\\r?\\n)*`;
    const model = editor.getModel();
    const matches = model.findMatches(regex, true, true, true, null, false, 999999999);
    console.log(`Found ${matches.length} commands.`);

    let ops = [];
    for (let i = 0; i < matches.length - 1; i++)
    {
        if (matches[i].range.endLineNumber == matches[i+1].range.startLineNumber)
        {
            const op = {range: matches[i].range, text: ''};
            ops.push(op);
        }
    };

    console.log(`Will only delete ${ops.length} of them.`);
    model.pushEditOperations([], ops, () => null);
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

    const btnok = document.createElement('btn1');
    btnok.classList.add('modalbtn');
    btnok.classList.add('modalbtn_blue');
    btnok.innerText = 'OK';
    const btncanc = document.createElement('btn2');
    btncanc.classList.add('modalbtn');
    btncanc.classList.add('modalbtn_red');
    btncanc.innerText = 'Cancel';
    function closewnd()
    {
        header.innerHTML = '';
        container.innerHTML = '';
        footer.innerHTML = '';
        bg.style.display = 'none';
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
    footer.appendChild(btncanc);
    footer.appendChild(btnok);

    bg.style.display = '';
}