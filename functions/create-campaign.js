const AirtablePlus = require('airtable-plus')

const campaignsTable = new AirtablePlus({
  baseID: process.env.AIRTABLE_BASE_ID,
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'Campaigns'
})

exports.handler = async (event, context) => {
  try {
    const { name } = JSON.parse(event.body)
    const { passphrase } = event.queryStringParameters
    if (passphrase === process.env.PASSPHRASE) {
      const matches = await campaignsTable.read({
        filterByFormula: `name = "${name}"`,
        maxRecords: 1
      })
      if (matches.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            error: 'Campaign with this name already exists'
          })
        }
      } else {
        await campaignsTable.create({ name })
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'ok' })
        }
      }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
