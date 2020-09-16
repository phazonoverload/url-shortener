const AirtablePlus = require('airtable-plus')

const linksTable = new AirtablePlus({
  baseID: process.env.AIRTABLE_BASE_ID,
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'Links'
})

exports.handler = async (event, context) => {
  try {
    const { code } = event.queryStringParameters
    const matches = await linksTable.read({
      filterByFormula: `short = "${code}"`,
      maxRecords: 1
    })
    if (matches.length > 0) {
      linksTable.update(matches[0].id, {
        views: matches[0].fields.views + 1
      })
      return { statusCode: 200, body: matches[0].fields.long }
    } else {
      return { statusCode: 200, body: process.env.URL_404 }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
