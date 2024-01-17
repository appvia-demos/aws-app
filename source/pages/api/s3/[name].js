import * as AWS from 'aws-sdk';

// Define the default export as an asynchronous function taking request and response parameters
export default async ({ method, query: { name } }, res) => {
  // Create an S3 instance with the specified API version and region from environment variables
  const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.S3_REGION });

  try {
    // Check the HTTP method and perform the corresponding S3 operation
    if (method === 'PUT') {
      // PUT method: Upload an object to S3 bucket with specified key, content encoding, and body
      await s3.putObject({ Bucket: process.env.BUCKET_NAME, Key: name, ContentEncoding: 'text/plain', Body: 'Example', ServerSideEncryption:'AES256' }).promise();
    } else if (method === 'DELETE') {
      // DELETE method: Delete an object from S3 bucket with specified key
      await s3.deleteObject({ Bucket: process.env.BUCKET_NAME, Key: name }).promise();
    }

    // Set HTTP status code to 200 (OK) and send a JSON response indicating success
    res.statusCode = 200;
    res.json({ success: true });
  } catch (err) {
    // If an error occurs, set HTTP status code to 500 (Internal Server Error) and send a JSON response indicating failure
    res.statusCode = 500;
    res.json({ success: false });
  }
};
