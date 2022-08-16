require.config({ paths: { vs: './node_modules/monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], async function () {
    monaco.editor.onDidCreateEditor(function () {
        setProgress(-1);
    });

    monaco.languages.register({ id: 'dsc_basic' });
    monaco.languages.setMonarchTokensProvider('dsc_basic',
    {
        defaultToken: 'invalid',
        ignoreCase: false,
        tokenizer: {
            root: [
                [/[A-Z][\w\$]*/, 'type.identifier' ],
                { include: '@whitespace' },
                [/[()]/, '@brackets'],
                [/-?\d+/, 'number'],
                [/[;,]/, 'delimiter'],
            ],
            whitespace: [
                [/[ \t\r\n]+/, 'white'],
            ],
        },
    });

    const editorContainer = document.getElementById('container');

    editor = await monaco.editor.create(editorContainer, {
        value: ['PV_BRANCH_MODE(0);', 'TIME(0);', 'MUSIC_PLAY();', 'BAR_TIME_SET(120, 3);', 'PV_END();', 'END();', ''].join('\n'),
        language: 'dsc_basic',
        automaticLayout: true,
        glyphMargin: true,
        theme: browser_dark ? 'vs-dark' : 'vs-light',
    });
    model = await editor.getModel();

    editor.onContextMenu(() => { // based on stackoverflow.com/a/70917930
        const host = editorContainer.querySelector(".shadow-root-host");
        if (host && host.shadowRoot && !host.shadowRoot.querySelector(".monaco-context-custom")) 
        {
          const style = document.createElement("style");
      
          style.setAttribute("class", "monaco-context-custom");
          style.innerHTML = `
            .context-view.monaco-menu-container > .monaco-scrollable-element {
              border-radius: 0.2rem !important;
              box-shadow: 0 2px 10px 0 #1f1f1f22 !important;
            }
            .monaco-action-bar
            {
                padding: 0 !important;
                background: linear-gradient(#eeeef2 80%, #e0e0e3 100%) !important;
            }
            .monaco-menu {
                border: 1px solid rgb(159, 159, 159) !important;
                border-radius: 0.2rem !important; 
            }
            .monaco-menu .action-item {
                color: black !important;
                cursor: default !important;
                border: inherit !important;
            }
            .action-menu-item {
                background-color: inherit !important;
                color: inherit !important;
            }
            .action-menu-item:hover {
                background: linear-gradient(#9a8cee, #7d6fca) !important;
                color: white !important;
            }
            .action-label {
                padding: 0 4px 0 4px !important;
            }
            .keybinding {
                padding-right: 4px !important;
            }
            .action-label.separator {
                padding-top: 0.2em !important;
            }
            @media (prefers-color-scheme: dark) {
                .context-view.monaco-menu-container > .monaco-scrollable-element {
                    box-shadow: 0 2px 10px 0 #cacaca22 !important;
                }
                .monaco-action-bar
                {
                    background: linear-gradient(#2d2d30 80%, #262629 100%) !important;
                }
                .monaco-menu {
                    border: 1px solid rgb(159, 159, 159) !important;
                }
                .monaco-menu .action-item {
                    color: white !important;
                }
            }
          `;
          host.shadowRoot.prepend(style);
        }
    });

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
        reload_indicators();
    });
});