import * as AWS from 'aws-sdk'

export default async (req, res) => {
  const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.S3_REGION })
  const objects = await s3.listObjects({ Bucket : process.env.BUCKET_NAME }).promise()
  res.statusCode = 200
  res.json({ objects: objects })
}
