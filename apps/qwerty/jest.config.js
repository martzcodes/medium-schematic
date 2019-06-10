module.exports = {
  name: 'qwerty',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/qwerty/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
