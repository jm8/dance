// Save to package.json
// ============================================================================

import { Builder, generateIgnoredKeybinds } from "../../meta";
import * as fs from "fs/promises";
import { extensionId } from "../../src/utils/constants";

const version = "0.1.0",
      preRelease = 1,
      preReleaseVersion = `${version}-pre${preRelease}`;

export const pkg = (modules: Builder.ParsedModule[]) => ({

  // Common package.json properties.
  // ==========================================================================

  name: "dance-helix-keybindings",
  description: "Helix keybindings for Dance",
  version,
  license: "ISC",
  extensionDependencies: [extensionId],
  author: {
    name: "Grégoire Geis",
    email: "opensource@gregoirege.is",
  },

  contributors: [
    {
      name: "Rémi Lavergne",
      url: "https://github.com/Strackeror",
    },
  ],

  repository: {
    type: "git",
    url: "https://github.com/71/dance.git",
  },

  engines: {
    vscode: "^1.63.0",
  },

  displayName: "Dance (Helix keybindings)",
  publisher: "gregoire",
  categories: ["Keymaps", "Other"],
  readme: "README.md",
  icon: "assets/dance.png",
  extensionKind: ["ui", "workspace"],

  scripts: {
    "package": "vsce package --allow-star-activation",
    "publish": "vsce publish --allow-star-activation",
    "package:pre": `vsce package --allow-star-activation --pre-release --no-git-tag-version --no-update-package-json ${preReleaseVersion}`,
    "publish:pre": `vsce publish --allow-star-activation --pre-release --no-git-tag-version --no-update-package-json ${preReleaseVersion}`,
  },

  contributes: {
    configurationDefaults: {
      "dance.defaultMode": "helix/normal",
      "dance.modes": {
        "helix/insert": {
          onLeaveMode: [
            [".selections.save", {
              register: " insert",
            }],
          ],
        },
        "helix/select": {
          cursorStyle: "block",
          selectionBehavior: "character",
        },
        "helix/normal": {
          cursorStyle: "block",
          selectionBehavior: "character",
          decorations: {
            applyTo: "main",
            backgroundColor: "$editor.hoverHighlightBackground",
            isWholeLine: true,
          },
          onEnterMode: [
            [".selections.restore", { register: " ^", try: true }],
          ],
          onLeaveMode: [
            [".selections.save", {
              register: " ^",
              style: {
                borderColor: "$editor.selectionBackground",
                borderStyle: "solid",
                borderWidth: "2px",
                borderRadius: "1px",
              },
              until: [
                ["mode-did-change", { include: "normal" }],
                ["selections-did-change"],
              ],
            }],
          ],
        },
      },

    "dance.menus": {
        space: {
          title: "Space",
          items: {
            "f": {
              "text": "Open file picker",
              "command": "workbench.action.quickOpen"
            },
            // "F": {
            //   "text": "Open file picker at current working directory",
            //   "command": "???"
            // },
            "b": {
              "text": "Open buffer picker",
              "command": "workbench.action.showAllEditors"
            },
            // "j": {
            //   "text": "Open jumplist picker",
            //   "command": "???"
            // },
            "s": {
              "text": "Open symbol picker",
              "command": "workbench.action.gotoSymbol"
            },
            // "S": {
            //   "text": "Open workspace symbol picker",
            //   "command": "???"
            // },
            "d": {
              "text": "Open diagnostic picker",
              "command": "workbench.actions.view.problems"
            },
            // "D": {
            //   "text": "Open workspace diagnostic picker",
            //   "command": "???"
            // },
            "a": {
              "text": "Perform code action",
              "command": "editor.action.quickFix"
            },
            // "'": {
            //   "text": "Open last picker",
            //   "command": "???"
            // },
            // "g": {
            //   "text": "Debug",
            //   "command": "dance.openMenu",
            //   "args": [
            //     {
            //       "menu": "debug-hx",
            //       "locked": true
            //     }
            //   ]
            // },
            // "w": {
            //   "text": "Window",
            //   "command": "dance.openMenu",
            //   "args": [
            //     {
            //       "menu": "window-hx"
            //     }
            //   ]
            // },
            "y": {
              "text": "Join and yank selections to clipboard",
              "command": "dance.run",
              "args": [
                {
                  "commands": [
                    [
                      "dance.selections.saveText",
                      {
                        "register": "dquote"
                      }
                    ],
                    ".modes.set.normal"
                  ]
                }
              ]
            },
            "Y": {
              "text": "Yank main selection to clipboard",
              "command": "dance.run",
              "args": [
                {
                  "commands": [
                    [
                      "dance.selections.saveText",
                      {
                        "register": "dquote"
                      }
                    ],
                    ".modes.set.normal"
                  ]
                }
              ]
            },
            "p": {
              "text": "Paste clipboard after selections",
              "command": "dance.edit.insert",
              "args": [
                {
                  "handleNewLine": true,
                  "where": "end"
                }
              ]
            },
            "P": {
              "text": "Paste clipboard before selections",
              "command": "dance.edit.insert",
              "args": [
                {
                  "handleNewLine": true,
                  "where": "start"
                }
              ]
            },
            "R": {
              "text": "Replace selections by clipboard content",
              "command": "dance.edit.insert",
              "args": [
                {
                  "register": "dquote"
                }
              ]
            },
            "/": {
              "text": "Global search in workspace folder",
              "command": "workbench.view.search.focus"
            },
            "k": {
              "text": "Show docs for item under cursor",
              "command": "editor.action.showHover"
            },
            "r": {
              "text": "Rename symbol",
              "command": "editor.action.rename"
            },
            // "h": {
            //   "text": "Select symbol references",
            //   "command": "???"
            // },
            "?": {
              "text": "Open command palette",
              "command": "workbench.action.showCommands"
            },
          }
        },

        match: {
          title: "Match",
          items: {
            // Should be jump in normal mode, extend in select mode, but jump for seek.enclosing is not implemented
            "m": { command: "dance.seek.enclosing", text: "Goto matching bracket" },
            "a": { command: "dance.openMenu", args: [{ menu: "object", title: "Match around" }], text: "Select around object" },
            "i": { command: "dance.openMenu", args: [{ menu: "object", title: "Match inside", pass: [{ inner: true }] }], text: "Select inside object" },
            "s": { command: "dance.selections.surround", text: "Surround add" },
            "r": { command: "dance.selections.surroundReplace", text: "Surround replace" },
            "d": { command: "dance.selections.surroundDelete", text: "Surround delete" },
          },
        },

        object: {
          title: "Select object...",
          items: ((command = "dance.seek.object") => ({
            "()": { command, args: [{ input: "\\((?#inner)\\)" }], text: "parenthesis block" },
            "{}": { command, args: [{ input: "\\{(?#inner)\\}" }], text: "braces block" },
            "[]": { command, args: [{ input: "\\[(?#inner)\\]" }], text: "brackets block" },
            "<>": { command, args: [{ input: "<(?#inner)>" }], text: "angle block" },
            '"': { command, args: [{ input: "(?#noescape)\"(?#inner)(?#noescape)\"" }], text: "double quote string" },
            "'": { command, args: [{ input: "(?#noescape)'(?#inner)(?#noescape)'" }], text: "single quote string" },
            "`": { command, args: [{ input: "(?#noescape)`(?#inner)(?#noescape)`" }], text: "grave quote string" },
            "w": { command, args: [{ input: "[\\p{L}_\\d]+(?<after>[^\\S\\n]+)" }], text: "word" },
            "W": { command, args: [{ input: "[\\S]+(?<after>[^\\S\\n]+)" }], text: "WORD" },
            "p": { command, args: [{ input: "(?#predefined=paragraph)" }], text: "paragraph" },
            "a": { command, args: [{ input: "(?#predefined=argument)" }], text: "argument" },
            "!": { command, text: "custom object desc" },
          }))(),
        },

        view: {
          "title": "View",
          "items": {
            "cz": { text: "Align view center", command: "dance.view.line", args: [{ "at": "center" }] },
            "t": { text: "Align view top", command: "dance.view.line", args: [{ "at": "top" }] },
            "b": { text: "Align view bottom", command: "dance.view.line", args: [{ "at": "bottom" }] },
            "k": { text: "Scroll view up", command: "editorScroll", args: [{ "by": "line", "revealCursor": true, "to": "up" }] },
            "j": { text: "Scroll view down", command: "editorScroll", args: [{ "by": "line", "revealCursor": true, "to": "down" }] },
            "/": { text: "Search for regex pattern", command: "dance.search" },
            "?": { text: "Reverse search for regex pattern", command: "dance.search.backward" },
            "n": { text: "Select next search match", command: "dance.search.next" },
            "N": { text: "Select previous search match", command: "dance.search.previous" },
          },
        },

        goto: {
          title: "Goto",
          items: {
            "g": { text: "to line number else file start", command: "dance.select.lineStart", args: [{ count: 1 }] },
            "e": { text: "to last line", command: "dance.select.lineEnd", args: [{ count: 2 ** 31 - 1 }] },
            "f": { text: "to file/URLs in selections", command: "dance.selections.open" },
            "h": { text: "to line start", command: "dance.select.lineStart" },
            "l": { text: "to line end", command: "dance.select.lineEnd" },
            "i": { text: "to first non-blank in line", command: "dance.select.lineStart", args: [{ skipBlank: true }] },
            "d": { text: "to definition", command: "editor.action.revealDefinition" },
            "r": { text: "to references", command: "editor.action.goToReferences" },
            "j": { text: "to last line", command: "dance.select.lastLine" },
            "t": { text: "to window top", command: "dance.select.firstVisibleLine" },
            "c": { text: "to window center", command: "dance.select.middleVisibleLine" },
            "b": { text: "to window bottom", command: "dance.select.lastVisibleLine" },
            "a": { text: "to last buffer", command: "workbench.action.openPreviousRecentlyUsedEditorInGroup" },
            "A": { text: "to last buffer...", command: "workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup" },
            "n": { text: "to next buffer", command: "workbench.action.nextEditor" },
            "p": { text: "to previous buffer", command: "workbench.action.previousEditor" },
            ".": { text: "to last buffer modification position", command: "dance.selections.restore", args: [{ register: " insert" }],
            },
          },
        },

        rightBracket: {
          title: "Right bracket",
          items: {
            "d": {
              "text": "Goto next diagnostic",
              "command": "dance.seek.diagnostic"
            },
          }
        },

        leftBracket: {
          title: "Left bracket",
          items: {
            "d": {
              "text": "Goto previous diagnostic",
              "command": "dance.seek.diagnostic.backward"
            },
          }
        },
      },
    },

    keybindings: (() => {
      const ignoredKeybindings = [],
            keybindings = modules
              .flatMap((module) => module.keybindings)
              .filter((keybinding) => ["core", "helix", undefined].includes(keybinding.category))
              .map(({ category, ...kb }) => kb);

      for (const mode of ["normal", "select", "insert"]) {
        for (const keybind of keybindings) {
          keybind.when = keybind.when.replace(`dance.mode == '${mode}'`, `dance.mode == 'helix/${mode}'`);
        }
      }

      for (const mode of ["normal", "select"]) {
        const whenMode = `editorTextFocus && dance.mode == 'helix/${mode}'`;
        ignoredKeybindings.push(...generateIgnoredKeybinds(
          keybindings.filter(key => key.when.includes(whenMode)),
          whenMode,
        ));
      }

      return [
        ...keybindings,
        ...ignoredKeybindings,
      ];
    })(),
  },
});


export async function build(builder: Builder) {
  await fs.writeFile(
    `${__dirname}/package.json`,
    JSON.stringify(pkg(await builder.getCommandModules()), undefined, 2) + "\n",
    "utf-8",
  );
}
