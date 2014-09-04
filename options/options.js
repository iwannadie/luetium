/* global addTab */

addTab('General', [
  { type: 'checkbox', name: 'transloader', desc: 'Enable transloader' },
]);

addTab(
  'Topic List',
  'Includes topics listed in tags, history.php, the main page, and inbox.', [
]);

addTab('Messages', 'Messages inside a topic and private message thread.', [
  { type: 'checkbox', name: 'update_favicon',
    desc: 'Update favicon on new messages',
  },
  { type: 'checkbox', name: 'pm_navi', desc: 'Enable navi in PM threads' },
]);
