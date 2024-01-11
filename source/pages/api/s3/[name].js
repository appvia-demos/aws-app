import * as AWS from 'aws-sdk'

export default async ({ method, query: { name } }, res) => {
  const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.S3_REGION })
  try {
    if (method === 'PUT') {
      await s3.putObject({ Bucket : process.env.BUCKET_NAME, Key: name, ContentEncoding: 'text/plain', Body: 'Example' }).promise()
    } else if (method === 'DELETE') {
      await s3.deleteObject({ Bucket : process.env.BUCKET_NAME, Key: name }).promise()
    }
    res.statusCode = 200
    res.json({ success: true })
  } catch (err) {
    res.statusCode = 500
    res.json({ success: false })
  }
}
