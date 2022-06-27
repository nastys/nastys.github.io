var menu_open = '';

function menu_toggle(menu)
{
    const elmenu = document.getElementById("menu_" + menu);
    const elmenubaritm = document.getElementById("menubaritem_" + menu)
    if (elmenu.hasAttribute('hidden'))
    {
        elmenu.removeAttribute('hidden');
        elmenubaritm.classList.add('menubaritemclicked');
        menu_open = menu;
        document.addEventListener('keydown', menu_close_esc);
        document.addEventListener('click', menu_clickhandler);
    }
    else
    {
        elmenu.setAttribute('hidden', '');
        elmenubaritm.classList.remove('menubaritemclicked');
        menu_open = '';
        document.removeEventListener('keydown', menu_close_esc);
        document.removeEventListener('click', menu_clickhandler);
    }
}

function menu_switch(menu)
{
    if (menu_open != '')
    {
        menu_toggle(menu_open);
        menu_toggle(menu);
    }
}

function menu_close_esc(e)
{
    if (menu_open != '' && e.keyCode == 27)
    {
        menu_toggle(menu_open);
    }
}

function menu_clickhandler(e)
{
    if (!(e.target.classList.contains('menubaritem') || e.target.classList.contains('menubaritemtext')))
    {
        menu_toggle(menu_open);
    }
}

function setmenubaritem(menubaritem)
{
    const popup = document.getElementById('menu_' + menubaritem);
    const item = document.getElementById('menubaritem_' + menubaritem);
    popup.style.left = item.offsetLeft + 'px';
    
    item.onclick = function()
    {
        menu_toggle(menubaritem);
    }

    item.onmouseover = function()
    {
        menu_switch(menubaritem);
    }
}

setmenubaritem('file');
setmenubaritem('tools');
setmenubaritem('edits');
setmenubaritem('help');

document.getElementById('menuitem_about').onclick = function ()
{
    alert("Online DSC Editor by nastys\nOriginal ScriptEditor by samyuu\nMonaco Editor by Microsoft\n\nSee CREDITS");
}

document.getElementById('menuitem_src').onclick = function ()
{
    window.open("https://github.com/nastys/nastys.github.io/tree/master/dsceditor", '_blank');
}

document.getElementById('menuitem_rmtargets').onclick = function ()
{
    const regex = `^[\t\f\v ]*TARGET[\t\f\v ]*\(.*\);?(?:\r?\\n)*`;
    const model = editor.getModel();
    const matches = model.findMatches(regex, true, true, true, null, false, 999999999);
    console.log(`Found ${matches.length} commands.`);

    let ops = [];
    matches.forEach(match => {
        const op = {range: match.range, text: ''};
        ops.push(op);
    });

    model.pushEditOperations([], ops, () => null);
}

document.getElementById('menuitem_timecleanup').onclick = function ()
{
    const regex = `^[\t\f\v ]*TIME[\t\f\v ]*\(.*\);?(?:\r?\\n)*`;
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