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
        document.addEventListener('contextmenu', menu_clickhandler);
    }
    else
    {
        elmenu.setAttribute('hidden', '');
        elmenubaritm.classList.remove('menubaritemclicked');
        menu_open = '';
        document.removeEventListener('keydown', menu_close_esc);
        document.removeEventListener('click', menu_clickhandler);
        document.removeEventListener('contextmenu', menu_clickhandler);
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

function menu_close()
{
    if (menu_open)
    {
        menu_toggle(menu_open);
    }
}

function menu_close_esc(e)
{
    if (menu_open != '' && e.keyCode == 27)
    {
        menu_close();
    }
}

function menu_clickhandler(e)
{
    if (!(e.target.classList.contains('menubaritem') || e.target.classList.contains('menubaritemtext') || e.target.classList.contains('menuitem-disabled') || e.target.parentNode.classList.contains('menuitem-disabled') || e.target.classList.contains('menuitem-checkbox') || e.target.parentNode.classList.contains('menuitem-checkbox')))
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

    item.oncontextmenu = function(e)
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

{
    const toolundo = document.getElementById('toolundo');
    /*toolundo.oncontextmenu = */toolundo.onclick = () => { model.undo(); };

    const menuitem_undo = document.getElementById('menuitem_undo');
    menuitem_undo.oncontextmenu = menuitem_undo.onclick = () => { setTimeout(function() { model.undo(); }, 100 ); };

    const toolredo = document.getElementById('toolredo');
    /*toolredo.oncontextmenu = */toolredo.onclick = () => { model.redo(); };

    const menuitem_redo = document.getElementById('menuitem_redo');
    menuitem_redo.oncontextmenu = menuitem_redo.onclick = () => { setTimeout(function() { model.redo(); }, 100 );}

    const toolsearch = document.getElementById('toolsearch');
    const menuitem_find = document.getElementById('menuitem_find');
    /*toolsearch.oncontextmenu = */toolsearch.onclick = menuitem_find.oncontextmenu = menuitem_find.onclick = function() { editor.getAction('actions.find').run(); }

    const menuitem_replace = document.getElementById('menuitem_replace');
    menuitem_replace.oncontextmenu = menuitem_replace.onclick = function() { editor.getAction('editor.action.startFindReplaceAction').run(); }
    
    const menuitem_about = document.getElementById('menuitem_about');
    menuitem_about.oncontextmenu = menuitem_about.onclick = function() { dialogEx("About", "Online DSC Editor by nastys\nOriginal ScriptEditor by samyuu\nMonaco Editor and Visual Studio Image Library by Microsoft\nWritten using Visual Studio Code\n\nSee CREDITS"); }
    
    const menuitem_src = document.getElementById('menuitem_src');
    menuitem_src.oncontextmenu = menuitem_src.onclick = function() { window.open("https://github.com/nastys/nastys.github.io/tree/master/dsceditor", '_blank'); }

    const menuitem_rmtargets = document.getElementById('menuitem_rmtargets');
    menuitem_rmtargets.oncontextmenu = menuitem_rmtargets.onclick = function () { remove_targets(); }

    const menuitem_timecleanup = document.getElementById('menuitem_timecleanup');
    menuitem_timecleanup.oncontextmenu = menuitem_timecleanup.onclick = function() { dupe_cleanup(); dupe_cleanup("TARGET_FLYING_TIME") }

    const menuitem_rmcommands = document.getElementById('menuitem_rmcommands');
    menuitem_rmcommands.oncontextmenu = menuitem_rmcommands.onclick = function() { window_rmcommands(); }

    const menuitem_normalizetime = document.getElementById('menuitem_normalizetime');
    menuitem_normalizetime.oncontextmenu = menuitem_normalizetime.onclick = function() { normalize_time(); }

    const menuitem_idswap = document.getElementById('menuitem_idswap');
    menuitem_idswap.oncontextmenu = menuitem_idswap.onclick = function() { window_idswap(); }

    const toolpreview = document.getElementById('toolpreview');
    /*toolpreview.oncontextmenu = */toolpreview.onclick = function() { preview_play(); };

    const menuitem_preview = document.getElementById('menuitem_preview');
    menuitem_preview.oncontextmenu = menuitem_preview.onclick = () => { setTimeout(function() { preview_play(); }, 100 ); };

    const toolpreviewall = document.getElementById('toolpreviewall');
    /*toolpreviewall.oncontextmenu = */toolpreviewall.onclick = function() { previewall(); };

    const menuitem_previewall = document.getElementById('menuitem_previewall');
    menuitem_previewall.oncontextmenu = menuitem_previewall.onclick = () => { setTimeout(function() { previewall(); }, 100 ); };

    const toolbktoggle = document.getElementById('toolbktoggle');
    /*toolbktoggle.oncontextmenu = */toolbktoggle.onclick = function() { bookmark_toggle(); };

    const menuitem_togglebkm = document.getElementById('menuitem_togglebkm');
    menuitem_togglebkm.oncontextmenu = menuitem_togglebkm.onclick = () => { setTimeout(function() { bookmark_toggle(); }, 100 ); };

    const toolbkprev = document.getElementById('toolbkprev');
    /*toolbkprev.oncontextmenu = */toolbkprev.onclick = function() { bookmark_find(0); };

    const menuitem_prevbkm = document.getElementById('menuitem_prevbkm');
    menuitem_prevbkm.oncontextmenu = menuitem_prevbkm.onclick = () => { setTimeout(function() { bookmark_find(0); }, 100 ); };

    const toolbknext = document.getElementById('toolbknext');
    /*toolbknext.oncontextmenu = */toolbknext.onclick = function() { bookmark_find(1); };

    const menuitem_nextbkm = document.getElementById('menuitem_nextbkm');
    menuitem_nextbkm.oncontextmenu = menuitem_nextbkm.onclick = () => { setTimeout(function() { bookmark_find(1); }, 100 ); };

    const toolbkclear = document.getElementById('toolbkclear');
    /*toolbkclear.oncontextmenu = */toolbkclear.onclick = function() { bookmark_clear(); };

    const menuitem_rmallbkm = document.getElementById('menuitem_rmallbkm');
    menuitem_rmallbkm.oncontextmenu = menuitem_rmallbkm.onclick = () => { setTimeout(function() { bookmark_clear(); }, 100 ); };

    const cb_autodetectgame = document.getElementById('cb_autodetectgame');
    const lbl_autodetectgame = document.getElementById('lbl_autodetectgame');
    lbl_autodetectgame.oncontextmenu = cb_autodetectgame.oncontextmenu = () => { cb_autodetectgame.click(); };
}