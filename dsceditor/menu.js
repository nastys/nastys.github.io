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
    remove_command('TARGET');
    remove_command('TARGET_FLYING_TIME');
    remove_command('BAR_TIME_SET');
    time_adjacent_cleanup();
}

document.getElementById('menuitem_timecleanup').onclick = function ()
{
    time_adjacent_cleanup();
}

document.getElementById('menuitem_rmcommands').onclick = function ()
{
    window_rmcommands();
}