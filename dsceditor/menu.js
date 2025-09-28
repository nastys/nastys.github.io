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
setmenubaritem('branch');
setmenubaritem('tools');
setmenubaritem('convert');
setmenubaritem('preferences');
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
    menuitem_about.oncontextmenu = menuitem_about.onclick = function() { dialogEx("Credits", "Online DSC Studio by nastys\nDSC format spec REd by samyuu\nInspired by samyuu's ScriptEditor for Windows\nAdditional formats REd by korenkonder\nPokeSlow-HQ by mono21400; animated by nastys\nMonaco Editor and Visual Studio Image Library by Microsoft\nWritten using Visual Studio Code\n\nSee CREDITS"); }
    
    const menuitem_copyright = document.getElementById('menuitem_copyright');
    menuitem_copyright.oncontextmenu = menuitem_copyright.onclick = function() { dialogEx("Licence", "DSC Studio\nCopyright (C) 2022-2025 nastys\n\nThis program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\nSee the GNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>."); }
    
    const menuitem_src = document.getElementById('menuitem_src');
    menuitem_src.oncontextmenu = menuitem_src.onclick = function() { window.open("https://github.com/nastys/nastys.github.io/tree/master/dsceditor", '_blank'); }
    
    const menuitem_rmtargets = document.getElementById('menuitem_rmtargets');
    menuitem_rmtargets.oncontextmenu = menuitem_rmtargets.onclick = function () { remove_targets(); }
    
    const menuitem_timecleanup = document.getElementById('menuitem_timecleanup');
    menuitem_timecleanup.oncontextmenu = menuitem_timecleanup.onclick = function() { dupe_cleanup(); dupe_cleanup("TARGET_FLYING_TIME"); }
    
    const menuitem_rmcommands = document.getElementById('menuitem_rmcommands');
    menuitem_rmcommands.oncontextmenu = menuitem_rmcommands.onclick = function() { window_rmcommands(); }
    
    const menuitem_normalizetime = document.getElementById('menuitem_normalizetime');
    menuitem_normalizetime.oncontextmenu = menuitem_normalizetime.onclick = function() { normalize_time(); }
    
    const menuitem_shifttime = document.getElementById('menuitem_shifttime');
    menuitem_shifttime.oncontextmenu = menuitem_shifttime.onclick = function() { shift_time(); }
    
    const menuitem_lyrics = document.getElementById('menuitem_lyrics');
    menuitem_lyrics.oncontextmenu = menuitem_lyrics.onclick = function() { lyrics(); }
    
    const menuitem_injectlyrics = document.getElementById('menuitem_injectlyrics');
    menuitem_lyrics.oncontextmenu = menuitem_injectlyrics.onclick = function() { inject_lyrics(); }
    
    const menuitem_rmbranch0 = document.getElementById('menuitem_rmbranch0');
    menuitem_rmbranch0.oncontextmenu = menuitem_rmbranch0.onclick = function() { remove_branch(0); }
    
    const menuitem_rmbranch1 = document.getElementById('menuitem_rmbranch1');
    menuitem_rmbranch1.oncontextmenu = menuitem_rmbranch1.onclick = function() { remove_branch(1); }
    
    const menuitem_rmbranch2 = document.getElementById('menuitem_rmbranch2');
    menuitem_rmbranch2.oncontextmenu = menuitem_rmbranch2.onclick = function() { remove_branch(2); }
    
    const menuitem_isbranch0 = document.getElementById('menuitem_isbranch0');
    menuitem_isbranch0.oncontextmenu = menuitem_isbranch0.onclick = function() { remove_branch(1); remove_branch(2); }
    
    const menuitem_isbranch1 = document.getElementById('menuitem_isbranch1');
    menuitem_isbranch1.oncontextmenu = menuitem_isbranch1.onclick = function() { remove_branch(0); remove_branch(2); }
    
    const menuitem_isbranch2 = document.getElementById('menuitem_isbranch2');
    menuitem_isbranch2.oncontextmenu = menuitem_isbranch2.onclick = function() { remove_branch(0); remove_branch(1); }
    
    const menuitem_idswap = document.getElementById('menuitem_idswap');
    menuitem_idswap.oncontextmenu = menuitem_idswap.onclick = function() { window_idswap(); }
    
    const menuitem_edit_commands_to_standard = document.getElementById('menuitem_edit_commands_to_standard');
    menuitem_edit_commands_to_standard.oncontextmenu = menuitem_edit_commands_to_standard.onclick = function() { edit_commands_to_standard(); }
    
    const menuitem_f_targets_to_newclassics = document.getElementById('menuitem_f_targets_to_newclassics');
    menuitem_f_targets_to_newclassics.oncontextmenu = menuitem_f_targets_to_newclassics.onclick = function() { f_targets_to_newclassics(); }
    
    const toolloadaudio = document.getElementById('toolloadaudio');
    /*toolloadaudio.oncontextmenu = */toolloadaudio.onclick = function() { load_preview_audio(); };
    
    const menuitem_loadaudio = document.getElementById('menuitem_loadaudio');
    menuitem_loadaudio.oncontextmenu = menuitem_loadaudio.onclick = () => { load_preview_audio(); };
    
    const toolpreview = document.getElementById('toolpreview');
    /*toolpreview.oncontextmenu = */toolpreview.onclick = function() { preview_play(); };
    
    const menuitem_preview = document.getElementById('menuitem_preview');
    menuitem_preview.oncontextmenu = menuitem_preview.onclick = () => { setTimeout(function() { preview_play(); }, 100 ); };
    
    const toolpreviewall = document.getElementById('toolpreviewall');
    /*toolpreviewall.oncontextmenu = */toolpreviewall.onclick = function() { previewall(); };
    
    const menuitem_previewall = document.getElementById('menuitem_previewall');
    menuitem_previewall.oncontextmenu = menuitem_previewall.onclick = () => { setTimeout(function() { previewall(); }, 100 ); };
    
    const toolinserttime = document.getElementById('toolinserttime');
    const menuitem_inserttime = document.getElementById('menuitem_inserttime');
    /*toolinserttime.oncontextmenu = */toolinserttime.onclick = menuitem_inserttime.oncontextmenu = menuitem_inserttime.onclick = function() { insert_command_wnd(); }
    
    const toolprevtime = document.getElementById('toolprevtime');
    const menuitem_prevtime = document.getElementById('menuitem_prevtime');
    /*toolprevtime.oncontextmenu = */toolprevtime.onclick = menuitem_prevtime.oncontextmenu = menuitem_prevtime.onclick = function() { jump_to_previous_timestamp(); }

    const toolnexttime = document.getElementById('toolnexttime');
    const menuitem_nexttime = document.getElementById('menuitem_nexttime');
    /*toolnexttime.oncontextmenu = */toolnexttime.onclick = menuitem_nexttime.oncontextmenu = menuitem_nexttime.onclick = function() { jump_to_next_timestamp(); }

    const menuitem_merge = document.getElementById('menuitem_merge');
    menuitem_merge.oncontextmenu = menuitem_merge.onclick = () => { setTimeout(function() { merge_wnd(); }, 100 ); };

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

    const menuitem_showinlayhints = document.getElementById('menuitem_showinlayhints');
    menuitem_showinlayhints.oncontextmenu = menuitem_showinlayhints.onclick = () => { forceEditorUpdate(); };

    const menuitem_showinlayhints2 = document.getElementById('menuitem_showinlayhints2');
    menuitem_showinlayhints2.oncontextmenu = menuitem_showinlayhints2.onclick = () => { forceEditorUpdate(); };

    const cb_autodetectgame = document.getElementById('cb_autodetectgame');
    const lbl_autodetectgame = document.getElementById('lbl_autodetectgame');
    lbl_autodetectgame.oncontextmenu = cb_autodetectgame.oncontextmenu = () => { cb_autodetectgame.click(); };

    const cb_upgradefmt = document.getElementById('cb_upgradefmt');
    const lbl_upgradefmt = document.getElementById('lbl_upgradefmt');
    lbl_upgradefmt.oncontextmenu = cb_upgradefmt.oncontextmenu = () => { cb_upgradefmt.click(); };
}