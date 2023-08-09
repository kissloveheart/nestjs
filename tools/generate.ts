const { generateTemplateFiles } = require('generate-template-files')

generateTemplateFiles([
  {
    option: 'Create Module',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './tools/template/module/',
    },
    stringReplacers: [
      { question: 'Your module name', slot: '__moduleName__' },
    ],
    output: {
      path: './src/modules/__moduleName__(lowerCase)',
      pathAndFileNameDefaultCase: '(kebabCase)',
      overwrite: true,
    },
  },
])
