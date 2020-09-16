const AirtablePlus = require('airtable-plus')

const campaignsTable = new AirtablePlus({
  baseID: process.env.AIRTABLE_BASE_ID,
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'Campaigns'
})

exports.handler = async (event, context) => {
  try {
    const { passphrase } = event.queryStringParameters
    if (passphrase === process.env.PASSPHRASE) {
      const campaigns = await campaignsTable.read()
      return { statusCode: 200, body: JSON.stringify(campaigns) }
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
