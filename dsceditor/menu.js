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
    if (!(e.target.classList.contains('menubaritem') || e.target.classList.contains('menubaritemtext') || e.target.classList.contains('menuitem-disabled') || e.target.parentNode.classList.contains('menuitem-disabled')))
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
setmenubaritem('edit');
setmenubaritem('bookmarks');
setmenubaritem('tools');
setmenubaritem('convert');
setmenubaritem('help');

document.getElementById('toolundo').onclick = () => { model.undo(); };
document.getElementById('menuitem_undo').onclick = () => { setTimeout(function() { model.undo(); }, 100 ); };
document.getElementById('toolredo').onclick = () => { model.redo(); };
document.getElementById('menuitem_redo').onclick = () => { setTimeout(function() { model.redo(); }, 100 );}
document.getElementById('toolsearch').onclick = document.getElementById('menuitem_find').onclick = function() { editor.getAction('actions.find').run(); }
document.getElementById('menuitem_replace').onclick = function() { editor.getAction('editor.action.startFindReplaceAction').run(); }
document.getElementById('menuitem_about').onclick = function() { dialogEx("About", "Online DSC Editor by nastys\nOriginal ScriptEditor by samyuu\nMonaco Editor and Visual Studio Image Library by Microsoft\nWritten using Visual Studio Code\n\nSee CREDITS"); }
document.getElementById('menuitem_src').onclick = function() { window.open("https://github.com/nastys/nastys.github.io/tree/master/dsceditor", '_blank'); }
document.getElementById('menuitem_rmtargets').onclick = function ()
{
    remove_command('TARGET');
    remove_command('TARGET_FLYING_TIME');
    remove_command('BAR_TIME_SET');
    time_cleanup();
}
document.getElementById('menuitem_timecleanup').onclick = function() { time_cleanup(); }
document.getElementById('menuitem_rmcommands').onclick = function() { window_rmcommands(); }
document.getElementById('toolbktoggle').onclick = function() { bookmark_toggle(); };
document.getElementById('menuitem_togglebkm').onclick = () => { setTimeout(function() { bookmark_toggle(); }, 100 ); };
document.getElementById('toolbkprev').onclick = function() { bookmark_find(0); };
document.getElementById('menuitem_prevbkm').onclick = () => { setTimeout(function() { bookmark_find(0); }, 100 ); };
document.getElementById('toolbknext').onclick = function() { bookmark_find(1); };
document.getElementById('menuitem_nextbkm').onclick = () => { setTimeout(function() { bookmark_find(1); }, 100 ); };
document.getElementById('toolbkclear').onclick = function() { bookmark_clear(); };
document.getElementById('menuitem_rmallbkm').onclick = () => { setTimeout(function() { bookmark_clear(); }, 100 ); };