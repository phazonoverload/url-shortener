const AirtablePlus = require('airtable-plus')
const shortid = require('shortid')

const linksTable = new AirtablePlus({
  baseID: process.env.AIRTABLE_BASE_ID,
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'Links'
})

exports.handler = async (event, context) => {
  try {
    const { destination: long, origin, campaign } = JSON.parse(event.body)
    const { passphrase } = event.queryStringParameters
    if (passphrase === process.env.PASSPHRASE) {
      const short = origin || shortid.generate()
      if ((await checkShortCodeIsUnique(short)) == false) {
        return {
          statusCode: 200,
          body: JSON.stringify({ error: 'Short URL already exists' })
        }
      } else {
        await linksTable.create({ long, short, views: 0, campaign })
        return {
          statusCode: 200,
          body: JSON.stringify({ url: short })
        }
      }
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: 'Passphrase was not correct' })
      }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

function checkShortCodeIsUnique(code) {
  return new Promise(async (resolve, reject) => {
    const matches = await linksTable.read({
      filterByFormula: `short = "${code}"`,
      maxRecords: 1
    })
    resolve(matches == 0)
  })
}
