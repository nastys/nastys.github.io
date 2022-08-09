require.config({ paths: { vs: './node_modules/monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], async function () {
    monaco.editor.onDidCreateEditor(function () {
        setProgress(-1);
    });

    editor = await monaco.editor.create(document.getElementById('container'), {
        value: ['PV_BRANCH_MODE(0);', 'TIME(0);', 'MUSIC_PLAY();', 'BAR_TIME_SET(120, 3);', 'PV_END();', 'END();', ''].join('\n'),
        language: 'javascript',
        automaticLayout: true,
        glyphMargin: true,
        theme: browser_dark ? 'vs-dark' : 'vs-light',
    });
    model = await editor.getModel();

    model.onDidChangeContent(() => {
        const allowUndo = model.canUndo();
        const allowRedo = model.canRedo();

        setModified(allowUndo); // TODO not sure if the undo stack has a limit
        if (allowUndo) {
            document.getElementById('toolundo').classList.remove('toolbutton-disabled');
            document.getElementById('menuitem_undo').classList.remove('menuitem-disabled');
        }
        else {
            document.getElementById('toolundo').classList.add('toolbutton-disabled');
            document.getElementById('menuitem_undo').classList.add('menuitem-disabled');
        }

        if (allowRedo) {
            document.getElementById('toolredo').classList.remove('toolbutton-disabled');
            document.getElementById('menuitem_redo').classList.remove('menuitem-disabled');
        }
        else {
            document.getElementById('toolredo').classList.add('toolbutton-disabled');
            document.getElementById('menuitem_redo').classList.add('menuitem-disabled');
        }
    });

    editor.onDidChangeCursorPosition(() => {
        const time = get_current_time();
        document.getElementById('indicator_time').value = time_to_string(time);
        document.getElementById('indicator_frame').innerText = String(6 * time / 10000);
        document.getElementById('indicator_branch').innerText = branch_to_string(get_current_branch());
        document.getElementById('indicator_ts').innerText = get_ts();
    });
});