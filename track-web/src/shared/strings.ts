export const strings = {
  brand: 'Track',
  navbar: {
    loginButtonLabel: 'Login',
    logoutButtonLabel: 'Logout',
  },
  graph: {
    noDataset: 'No Dataset',
  },
  modal: {
    delete: {
      title: 'Just checking',
      confirm: 'Confirm',
      cancel: 'Nevermind',
      body: (label: string) => `Dataset "${label}" is about to be <strong>deleted</strong>`
    },
    discard: {
      title: 'Discard Changes?',
      confirm: 'Confirm',
      cancel: 'Nevermind',
    },
  },
  tooltip: {
    notAuthenticated: '<strong>Login</strong> to create private datasets',
    noOwner: 'This dataset has no owner',
    notOwner: 'You do not own this dataset'
  },
  addSeriesButtonLabel: 'Add Series',
  createRecordButtonLabel: 'Add Record',
}