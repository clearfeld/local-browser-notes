# LB Notes

Local Browser (LB) Notes - is a fully client side notes app, where all data (ex. notes and folders) are stored locally on your browser (indexeddb). NOTE: Be careful with any notes stored, since anything that might clear your browser data might lead to data lose.

[Use it here - https://clearfeld.github.io/local-browser-notes/#/folder/0](https://clearfeld.github.io/local-browser-notes/#/folder/0)

## Features
- [ ] folders
  - [X] view all master folder
  - [X] parent folders
  - [ ] child folders
  - [X] delete folder + underlying notes
  - [X] rename folder
  - [ ] re-order folders
  - [ ] virtulaization
- [ ] notes
  - [X] track last updated timestamp and creation date
  - [ ] note lock? (maybe)
  - [X] note summary preview
  - [ ] pin notes? (maybe)
  - [ ] wysiwyg note editor
    - [X] bold, italic, underline, strikethrough
    - [X] alignment - left, right, center
    - [X] headings h1-h6
    - [X] code blocks (various languages)
    - [X] links
    - [X] quotes
    - [ ] tables
    - [X] lists - bullet, numbered, checklist
    - [X] undo, redo
    - [X] expand and contract views
    - [X] insert horizontal line
    - [X] highlight hashtags
    - [ ] export as txt
    - [ ] export as html
    - [ ] table of contents
    - [ ] command palette
    - [ ] drag and drop blocks
    - [ ] dragon accessibility support? (maybe)
    - [ ] copy section as raw text
    - [ ] image and gif support
    - [ ] embed / iframe support (test commons ie youtube etc...)
  - [ ] Menu Options
    - [X] duplicate note
    - [X] delete note
    - [X] move note to different folder
    - [ ] lock note
    - [ ] pin note
- [X] pure indexeddb storage
- [ ] tags
  - [ ] search / filter
  - [ ] pull from note context
- [ ] settings
  - [ ] font selection
  - [ ] theme preference - persist
  - [X] delete indexeddb instance (all data - notes folders tags etc...)
  - [ ] remember last opened folder and/or note
- [ ] extras
  - [X] light and dark themes
  - [X] auto save
  - [-] ctrl + s save with some kind of notifcation popup
  - [ ] keyboard shortcuts modal
  - [ ] about modal
  - [ ] global command palette (search support)
  - [ ] notifcations
  - [ ] filesystem api suport - import / export
  - [ ] fully offline capable (service workers)

## Getting Started

This project was bootstrapped with [create-next-gen-react-app](https://github.com/clearfeld/create-next-gen-react-app).

