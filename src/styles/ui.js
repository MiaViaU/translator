export const uiStyles = `
:host { all: initial; color-scheme: light dark; }
*, *::before, *::after { box-sizing: border-box; }
.tr-root { position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; font-family: Inter, "Segoe UI", "Microsoft YaHei", system-ui, sans-serif; color: #172033; }
.tr-toolbar { position: fixed; right: 20px; bottom: 20px; display: flex; max-width: calc(100vw - 24px); align-items: center; gap: 5px; padding: 7px; border: 1px solid rgba(255,255,255,.72); border-radius: 16px; background: rgba(255,255,255,.82); box-shadow: 0 16px 42px rgba(25, 40, 72, .22); backdrop-filter: blur(16px); pointer-events: auto; touch-action: none; animation: tr-in .18s ease-out; }
.tr-toolbar-actions { display: flex; align-items: center; gap: 5px; }
.tr-toolbar-drag, .tr-toolbar-collapse { position: relative; display: grid; width: 30px; min-width: 30px; height: 34px; place-items: center; padding: 0; border: 0; border-radius: 10px; color: #61708a; background: transparent; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: color .16s ease, background .16s ease; }
.tr-toolbar-drag { cursor: grab; }
.tr-toolbar-drag:active, .tr-toolbar.is-dragging .tr-toolbar-drag { cursor: grabbing; }
.tr-toolbar-drag svg { display: block; width: 18px; height: 18px; fill: currentColor; opacity: .78; }
.tr-toolbar-collapse svg { display: block; width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transform-origin: 50% 50%; transition: transform .18s ease; }
.tr-toolbar-drag:hover, .tr-toolbar-collapse:hover { color: #315ec9; background: rgba(66,113,255,.13); }
.tr-toolbar-drag:active, .tr-toolbar-collapse:active { background: rgba(66,113,255,.2); }
.tr-toolbar-drag:focus-visible, .tr-toolbar-collapse:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-toolbar.is-dragging { user-select: none; box-shadow: 0 20px 48px rgba(25,40,72,.3); }
.tr-toolbar.is-collapsed { gap: 4px; padding: 7px; border-color: rgba(255,255,255,.8); border-radius: 14px; background: rgba(248,250,255,.88); box-shadow: 0 10px 28px rgba(25,40,72,.18); }
.tr-toolbar.is-collapsed .tr-toolbar-actions { display: none; }
.tr-toolbar.is-collapsed .tr-toolbar-collapse { color: #315ec9; }
.tr-toolbar.is-collapsed .tr-toolbar-collapse svg { transform: rotate(180deg); }
.tr-toolbar.is-edge-hidden { padding: 0; justify-content: flex-end; overflow: visible; border: 0; border-radius: 10px 0 0 10px; background: transparent; box-shadow: none; backdrop-filter: none; transition: left .18s ease; }
.tr-toolbar.is-edge-hidden .tr-toolbar-drag { display: none; }
.tr-toolbar.is-edge-hidden .tr-toolbar-actions { display: none; }
.tr-toolbar.is-edge-hidden .tr-toolbar-collapse { width: 30px; min-width: 30px; height: 34px; border: 1px solid rgba(255,255,255,.82); border-right: 0; border-radius: 10px 0 0 10px; color: #315ec9; background: rgba(244,248,255,.92); box-shadow: -3px 4px 13px rgba(25,40,72,.2); backdrop-filter: blur(16px); }
.tr-toolbar.is-edge-hidden .tr-toolbar-collapse:hover { color: #244fae; background: rgba(232,240,255,.98); }
.tr-toolbar.is-edge-hidden .tr-toolbar-collapse svg { transform: rotate(0deg); }
.tr-toolbar.is-edge-hidden.is-hidden-left { justify-content: flex-start; border-radius: 0 10px 10px 0; }
.tr-toolbar.is-edge-hidden.is-hidden-left .tr-toolbar-collapse { border: 1px solid rgba(255,255,255,.82); border-left: 0; border-radius: 0 10px 10px 0; box-shadow: 3px 4px 13px rgba(25,40,72,.2); }
.tr-toolbar.is-edge-hidden.is-hidden-left .tr-toolbar-collapse svg { transform: rotate(180deg); }
.tr-button { appearance: none; border: 0; border-radius: 11px; min-width: 34px; height: 34px; padding: 0 10px; color: #24314a; background: transparent; cursor: pointer; font: 600 13px/1 inherit; transition: background .16s ease, transform .16s ease; }
.tr-button:hover { background: rgba(66, 113, 255, .13); transform: translateY(-1px); }
.tr-button:focus-visible, .tr-combobox-trigger:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-button.tr-pointer-focused:focus-visible { outline: none; }
.tr-toast-stack { position: fixed; right: 22px; bottom: 68px; z-index: 8; width: max-content; max-width: calc(100vw - 44px); pointer-events: none; }
.tr-toast { display: flex; align-items: center; gap: 3px; max-width: 100%; padding: 4px 6px; border-radius: 6px; color: #fff; background: rgba(25,34,54,.84); box-shadow: 0 4px 12px rgba(0,0,0,.15); font-family: inherit; font-size: 12px; font-weight: 400; line-height: 1.25; animation: tr-toast-in .16s ease-out; }
.tr-toast-icon { display: grid; flex: 0 0 auto; place-items: center; }
.tr-toast-icon svg { width: 9px; height: 9px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.tr-toast-message { min-width: 0; overflow-wrap: anywhere; }
.tr-selection-button { position: fixed; z-index: 4; display: none; width: 26px; height: 26px; padding: 0; border: 2px solid rgba(255,255,255,.9); border-radius: 50%; background: #477cff; box-shadow: 0 5px 14px rgba(40,77,180,.32); cursor: pointer; pointer-events: auto; touch-action: manipulation; transition: background .16s ease, box-shadow .16s ease, transform .16s ease; }
.tr-selection-button::after { display: block; width: 5px; height: 5px; margin: auto; border-radius: 50%; background: #fff; content: ''; }
.tr-selection-button.is-visible { display: block; animation: tr-in .14s ease-out; }
.tr-selection-button:hover { background: #356af0; transform: translateY(-1px); }
.tr-selection-button:focus-visible { outline: 2px solid #477cff; outline-offset: 3px; }
.tr-translation-dialog { width: min(540px, 100%); max-height: min(680px, 90dvh); overflow-y: auto; scrollbar-gutter: stable; scrollbar-width: thin; scrollbar-color: rgba(85,105,145,.52) transparent; }
.tr-translation-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.tr-translation-header .tr-dialog-title { margin-bottom: 14px; }
.tr-selection-close { display: grid; width: 30px; height: 30px; place-items: center; padding: 0; border: 0; border-radius: 9px; color: #61708a; background: transparent; cursor: pointer; font: 22px/1 sans-serif; }
.tr-selection-close:hover { color: #253653; background: #e9effb; }
.tr-selection-close:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-translation-content { display: grid; gap: 12px; }
.tr-translation-languages { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
.tr-translation-content .tr-field { margin: 0; }
.tr-translation-input { width: 100%; min-height: 126px; padding: 11px 12px; resize: vertical; border: 1px solid #d8dfec; border-radius: 11px; color: #1e2b42; background: rgba(255,255,255,.8); font: 14px/1.55 inherit; outline: none; transition: border-color .16s ease, box-shadow .16s ease, background .16s ease; }
.tr-translation-input:focus { border-color: #477cff; background: #fff; box-shadow: 0 0 0 3px rgba(71,124,255,.15); }
.tr-translation-hint { margin: -4px 0 0; color: #7787a2; font-size: 11px; line-height: 1.4; }
.tr-translation-result-section { display: grid; gap: 5px; }
.tr-translation-result-header { display: flex; align-items: center; justify-content: space-between; min-height: 30px; }
.tr-selection-section-label { color: #657592; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.tr-translation-result { display: block; min-height: 112px; margin: 0; padding: 11px 12px; overflow-wrap: anywhere; border-radius: 10px; color: #1d2b44; background: #eaf0ff; font: 14px/1.55 inherit; white-space: pre-wrap; transition: color .16s ease, background .16s ease; }
.tr-translation-result[data-state='placeholder'] { color: #7d8ca6; background: #f1f4f9; }
.tr-translation-result[data-state='loading'] { color: #3559a5; background: #edf2ff; }
.tr-translation-copy { display: grid; width: 32px; min-width: 32px; height: 32px; place-items: center; padding: 0; border: 1px solid #d8dfec; border-radius: 9px; color: #456188; background: rgba(255,255,255,.72); cursor: pointer; }
.tr-translation-copy svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.tr-translation-copy:hover { border-color: #9cb7f6; color: #2c62dc; background: #edf2ff; }
.tr-translation-copy:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-translation-copy:disabled { cursor: default; opacity: .45; }
.tr-translation-dialog::-webkit-scrollbar { width: 9px; height: 9px; }
.tr-translation-dialog::-webkit-scrollbar-track { margin: 10px 0; background: transparent; }
.tr-translation-dialog::-webkit-scrollbar-thumb { min-height: 34px; border: 2px solid transparent; border-radius: 99px; background: rgba(85,105,145,.5); background-clip: padding-box; }
.tr-overlay { position: fixed; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(15, 23, 42, .26); pointer-events: auto; animation: tr-fade .16s ease-out; }
.tr-dialog { width: min(520px, 100%); max-height: min(680px, 90vh); overflow: auto; padding: 20px; border: 1px solid rgba(255,255,255,.7); border-radius: 18px; background: rgba(255,255,255,.93); box-shadow: 0 24px 70px rgba(10, 22, 50, .3); backdrop-filter: blur(18px); animation: tr-scale .18s ease-out; pointer-events: auto; }
.tr-dialog--scrollable { display: flex; flex-direction: column; height: min(680px, calc(100dvh - 40px)); overflow: hidden; }
.tr-dialog-content { flex: 1 1 auto; min-height: 0; padding-right: 7px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: rgba(85,105,145,.52) transparent; }
.tr-dialog-title { margin: 0 0 16px; color: #172033; font-size: 17px; line-height: 1.4; }
.tr-field { display: grid; gap: 7px; margin: 12px 0; color: #40506d; font-size: 13px; }
.tr-switch-row { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 46px; margin: 8px 0; padding: 8px 10px 8px 12px; border: 1px solid #d8dfec; border-radius: 10px; color: #40506d; background: rgba(255,255,255,.44); cursor: pointer; font: 500 13px/1.35 inherit; text-align: left; transition: border-color .16s ease, background .16s ease, box-shadow .16s ease; }
.tr-switch-row:hover { border-color: #a8bdea; background: rgba(248,250,255,.92); }
.tr-switch-row.is-checked { border-color: #81a4ff; background: rgba(71,124,255,.09); }
.tr-switch-row:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-switch-label { padding-right: 12px; }
.tr-switch-track { position: relative; flex: 0 0 auto; width: 38px; height: 22px; border-radius: 999px; background: #c8d2e3; box-shadow: inset 0 0 0 1px rgba(27,53,100,.08); transition: background .16s ease; }
.tr-switch-thumb { position: absolute; top: 3px; left: 3px; display: grid; width: 16px; height: 16px; place-items: center; border-radius: 50%; color: #8090a9; background: #fff; box-shadow: 0 1px 3px rgba(26,44,78,.25); transform: translateX(0); transition: color .16s ease, transform .16s ease; }
.tr-switch-icon { display: block; width: 11px; height: 11px; overflow: visible; }
.tr-switch-row.is-checked .tr-switch-track { background: #477cff; }
.tr-switch-row.is-checked .tr-switch-thumb { color: #356af0; transform: translateX(16px); }
.tr-input { width: 100%; min-height: 40px; padding: 8px 10px; border: 1px solid #d8dfec; border-radius: 9px; color: #1e2b42; background: rgba(255,255,255,.8); font: 14px/1.25 inherit; outline: none; transition: border-color .16s ease, box-shadow .16s ease, background .16s ease; }
.tr-input:focus, .tr-input:focus-visible { border-color: #477cff; background: #fff; box-shadow: 0 0 0 3px rgba(71,124,255,.15); outline: none; }
.tr-textarea { min-height: 76px; resize: vertical; font-family: inherit; line-height: 1.45; }
.tr-combobox { position: relative; z-index: 1; }
.tr-combobox.is-open { z-index: 3; }
.tr-field-label { font-weight: 600; }
.tr-combobox-trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 44px; padding: 9px 12px; border: 1px solid #d8dfec; border-radius: 10px; color: #1e2b42; background: rgba(255,255,255,.82); box-shadow: inset 0 1px rgba(255,255,255,.55); cursor: pointer; font: 14px/1.25 inherit; text-align: left; transition: border-color .16s ease, box-shadow .16s ease, background .16s ease; }
.tr-combobox-trigger:hover, .tr-combobox.is-open .tr-combobox-trigger { border-color: #7b9dff; background: #fff; box-shadow: 0 0 0 3px rgba(71,124,255,.12); }
.tr-combobox-trigger:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-combobox-chevron { width: 8px; height: 8px; margin-left: 12px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(45deg) translateY(-2px); transition: transform .16s ease; }
.tr-combobox.is-open .tr-combobox-chevron { transform: rotate(225deg) translateY(-2px); }
.tr-combobox-menu { position: absolute; top: calc(100% + 6px); right: 0; left: 0; display: grid; max-height: min(260px, 38vh); padding: 5px; overflow: auto; border: 1px solid rgba(122,142,180,.28); border-radius: 12px; background: rgba(255,255,255,.96); box-shadow: 0 16px 36px rgba(25,40,72,.2); backdrop-filter: blur(16px); animation: tr-menu-in .16s ease-out; scrollbar-width: thin; scrollbar-color: rgba(85,105,145,.52) transparent; }
.tr-combobox-menu[hidden] { display: none; }
.tr-combobox-option { min-height: 38px; padding: 8px 10px; border: 0; border-radius: 8px; color: #2b3953; background: transparent; cursor: pointer; font: 14px/1.25 inherit; text-align: left; transition: background .13s ease, color .13s ease; }
.tr-combobox-option:hover, .tr-combobox-option:focus-visible { color: #194bb7; background: #eaf0ff; outline: none; }
.tr-combobox-option.is-selected::after { float: right; content: '✓'; color: #326cf2; font-weight: 800; }
.tr-dialog-content::-webkit-scrollbar, .tr-combobox-menu::-webkit-scrollbar { width: 9px; height: 9px; }
.tr-dialog-content::-webkit-scrollbar-track, .tr-combobox-menu::-webkit-scrollbar-track { margin: 8px 0; background: transparent; }
.tr-dialog-content::-webkit-scrollbar-thumb, .tr-combobox-menu::-webkit-scrollbar-thumb { min-height: 34px; border: 2px solid transparent; border-radius: 99px; background: rgba(85,105,145,.5); background-clip: padding-box; }
.tr-dialog-content::-webkit-scrollbar-thumb:hover, .tr-combobox-menu::-webkit-scrollbar-thumb:hover { background: rgba(61,84,129,.7); background-clip: padding-box; }
.tr-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
.tr-primary { color: #fff; background: #477cff; }
.tr-primary:hover { background: #356af0; }
.tr-result { margin: 0; padding: 11px 12px; overflow-wrap: anywhere; border-radius: 10px; background: #f1f4f9; color: #27364f; font: 14px/1.55 inherit; white-space: pre-wrap; }
.tr-result + .tr-dialog-title { margin-top: 16px; }
@media (prefers-color-scheme: dark) {
  .tr-toolbar { border-color: rgba(255,255,255,.12); background: rgba(27, 35, 55, .86); }
  .tr-toolbar.is-collapsed { border-color: rgba(255,255,255,.14); background: rgba(31, 41, 63, .9); box-shadow: 0 10px 28px rgba(0,0,0,.28); }
  .tr-toolbar-drag, .tr-toolbar-collapse { color: #b5c2da; }
  .tr-toolbar-drag:hover, .tr-toolbar-collapse:hover { color: #fff; background: rgba(125,160,255,.2); }
  .tr-toolbar.is-edge-hidden .tr-toolbar-collapse { border-color: rgba(255,255,255,.14); color: #d7e2ff; background: rgba(35,47,73,.92); box-shadow: -3px 4px 13px rgba(0,0,0,.28); }
  .tr-toolbar.is-edge-hidden .tr-toolbar-collapse:hover { color: #fff; background: rgba(51,68,107,.96); }
  .tr-button { color: #e8edfa; }
  .tr-button:hover { background: rgba(125, 160, 255, .2); }
  .tr-dialog { border-color: rgba(255,255,255,.12); background: rgba(26, 34, 53, .95); }
  .tr-selection-close { color: #b5c2da; }
  .tr-selection-close:hover { color: #fff; background: #33446b; }
  .tr-selection-section-label { color: #aebbd2; }
  .tr-translation-input { border-color: #4b5871; color: #eff4ff; background: #202a40; }
  .tr-translation-input:focus { border-color: #7b9dff; background: #27334d; box-shadow: 0 0 0 3px rgba(115,151,255,.18); }
  .tr-translation-hint { color: #aebbd2; }
  .tr-translation-result { color: #f1f5ff; background: #2c3b60; }
  .tr-translation-result[data-state='placeholder'] { color: #b5c2da; background: #202a40; }
  .tr-translation-result[data-state='loading'] { color: #dce7ff; background: #29385a; }
  .tr-translation-copy { border-color: #4b5871; color: #c6d4ed; background: #202a40; }
  .tr-translation-copy:hover { border-color: #7b9dff; color: #fff; background: #33446b; }
  .tr-translation-dialog { scrollbar-color: rgba(159,181,230,.52) transparent; }
  .tr-translation-dialog::-webkit-scrollbar-thumb { background: rgba(159,181,230,.48); background-clip: padding-box; }
  .tr-dialog-title { color: #f1f5ff; }
  .tr-field, .tr-switch-row { color: #c2cce0; }
  .tr-switch-row { border-color: #44516b; background: rgba(30,40,61,.52); }
  .tr-switch-row:hover { border-color: #62769e; background: rgba(45,59,87,.72); }
  .tr-switch-row.is-checked { border-color: #7196ff; background: rgba(77,120,255,.2); }
  .tr-switch-track { background: #59667e; box-shadow: inset 0 0 0 1px rgba(0,0,0,.22); }
  .tr-switch-thumb { color: #73849f; background: #e9effd; }
  .tr-switch-row.is-checked .tr-switch-track { background: #638cff; }
  .tr-switch-row.is-checked .tr-switch-thumb { color: #376df0; }
  .tr-input, .tr-combobox-trigger { border-color: #4b5871; color: #eff4ff; background: #202a40; }
  .tr-input:focus, .tr-input:focus-visible { border-color: #7b9dff; background: #27334d; box-shadow: 0 0 0 3px rgba(115,151,255,.18); }
  .tr-combobox-trigger:hover, .tr-combobox.is-open .tr-combobox-trigger { border-color: #7b9dff; background: #27334d; box-shadow: 0 0 0 3px rgba(115,151,255,.18); }
  .tr-combobox-menu { border-color: rgba(173,191,230,.22); background: rgba(30,40,61,.98); box-shadow: 0 16px 36px rgba(0,0,0,.34); }
  .tr-combobox-option { color: #dce6fb; }
  .tr-combobox-option:hover, .tr-combobox-option:focus-visible { color: #f2f6ff; background: #33446b; }
  .tr-dialog-content, .tr-combobox-menu { scrollbar-color: rgba(159,181,230,.52) transparent; }
  .tr-dialog-content::-webkit-scrollbar-thumb, .tr-combobox-menu::-webkit-scrollbar-thumb { background: rgba(159,181,230,.48); background-clip: padding-box; }
  .tr-dialog-content::-webkit-scrollbar-thumb:hover, .tr-combobox-menu::-webkit-scrollbar-thumb:hover { background: rgba(190,209,250,.7); background-clip: padding-box; }
  .tr-result { background: #202a40; color: #e6edff; }
}
@keyframes tr-in { from { opacity: 0; transform: translateY(5px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes tr-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes tr-toast-in { from { opacity: 0; transform: translateY(-8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes tr-scale { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: scale(1); } }
@keyframes tr-menu-in { from { opacity: 0; transform: translateY(-4px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
@media (max-width: 430px) { .tr-translation-languages { grid-template-columns: 1fr; } .tr-translation-dialog { scrollbar-gutter: stable; } }
@media (max-width: 360px) { .tr-toolbar, .tr-toolbar.is-collapsed { gap: 2px; padding: 4px; border-radius: 14px; } .tr-toolbar-actions { gap: 2px; } .tr-toolbar-drag, .tr-toolbar-collapse, .tr-toolbar .tr-button { width: 30px; min-width: 30px; padding: 0; } }
`;
