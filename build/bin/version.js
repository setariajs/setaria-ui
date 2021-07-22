var fs = require('fs');
var path = require('path');
var version = process.env.VERSION || require('../../package.json').version;
var content = {};
if (!content[version]) content[version] = '1.6';
fs.writeFileSync(path.resolve(__dirname, '../../examples/versions.json'), JSON.stringify(content));
