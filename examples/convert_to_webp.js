// Run this file as:
//
//   env TRANSLOADIT_KEY=xxx TRANSLOADIT_SECRET=yyy node examples/convert_to_webp.js ./fixtures/berkley.jpg
//
// You'll likely just want to `require('transloadit')`, but we're requiring the local
// variant here for easier testing:
const TransloaditClient = require('../src/TransloaditClient')

const client = new TransloaditClient({
  authKey   : process.env.TRANSLOADIT_KEY,
  authSecret: process.env.TRANSLOADIT_SECRET,
})

const fieldName = 'my_file'
const filePath = process.argv[2]
client.addFile(fieldName, filePath)

const opts = {
  waitForCompletion: true,
  params           : {
    steps: {
      webp: {
        use              : ':original',
        robot            : '/image/resize',
        result           : true,
        imagemagick_stack: 'v2.0.7',
        format           : 'webp',
      },
    },
  },
};

(async () => {
  try {
    const status = await client.createAssemblyAsync(opts)
    console.log('Your WebP file:', status.results.webp[0].url)
  } catch (err) {
    console.error(`createAssembly ${err.assembly_id} failed`, err)
  }
})()
