import Head from 'next/head'
import * as AWS from 'aws-sdk'
import { Button, Input, Card, Icon } from 'antd'
import React, { useState, useEffect } from 'react'

export async function getServerSideProps() {
  try {
    // Check if S3 credentials (region and bucket name) are available
    if (!process.env.S3_REGION || !process.env.BUCKET_NAME) {
      throw new Error('S3_REGION or BUCKET_NAME environment variables are not set.');
    }

    // Create an S3 client using AWS SDK
    const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.S3_REGION });

    // Fetch a list of objects from the specified S3 bucket
    const objects = await s3.listObjects({ Bucket: process.env.BUCKET_NAME }).promise();

    // Return the props object with data to be used in the Next.js page
    return {
      props: {
        // Set initFiles to an array of S3 object keys, or an empty array if objects are not available
        initFiles: objects?.Contents?.map((o) => o.Key) || [],

        // Include environment details such as S3 region and bucket name in the props
        envDetails: {
          region: process.env.S3_REGION,
          bucket: process.env.BUCKET_NAME,
        },
      },
    };
  } catch (error) {
    // Handle errors and provide a default props object in case of failure
    console.error('Error during S3 operation:', error.message);

    return {
      props: {
        initFiles: [],
        envDetails: {
          region: 'unset - run container with S3_REGION',
          bucket: 'unset - run container with BUCKET_NAME',
        },
        error: error.message,
      },
    };
  }
}

export default function Home({ initFiles, envDetails }) {
  const [files, setFiles] = useState(initFiles)
  const [fileName, setFileName] = useState(null)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefresing] = useState(false)

  const refreshFiles = async () => {
    setRefresing(true)
    try {
      const res = await fetch(`/api/s3`)
      setFiles((await res.json()).objects.Contents.map((o) => o.Key))
    } catch {

    }
    setRefresing(false)
  }

  const addFile = async (fileName) => {
    setSaving(true)
    try {
      await fetch(`/api/s3/${encodeURIComponent(fileName)}`, {
        method: 'PUT',
      });
      setFileName(null);
    } catch (error) {
      // Handle the error
      console.error('Error adding file:', error);
    }
    setSaving(false);
    refreshFiles();
  };


  const deleteFile = async (fileName) => {
    setRefresing(true)
    try {
      await fetch(`/api/s3/${encodeURIComponent(fileName)}`, { method: 'DELETE' })
    } catch {
    }
    setRefresing(false)
    refreshFiles()
  }

  const savingDisabled = saving || !fileName || fileName.trim().length === 0

  useEffect(() => {
    const interval = setInterval(refreshFiles, 5000)
    return () => clearImmediate(interval)
  }, [])

  return (
    <div className="container">
      <Head>
        <title>Appvia S3 Demonstration App</title>
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <Card style={{ width: "600px" }} title={<><img src="/appvia-wayfinder-logo-collapsed.svg" height="30" /> Appvia S3 Demonstration</>}>
          <h4>Bucket details:</h4>
          <ul>
            <li>Region: {envDetails.region}</li>
            <li>Bucket: {envDetails.bucket}</li>
          </ul>
          <h4>S3 Contents:</h4>
          <ul>
            {files.map((file) => <li key={file}>{file} <a onClick={() => deleteFile(file)}><Icon type="delete"></Icon></a></li>)}
          </ul>
          <Button loading={refreshing} onClick={refreshFiles} style={{ width: '100%' }}>Refresh</Button>
          <h4>Add new file to bucket:</h4>
          <Input.Group compact>
            <Input style={{ width: '80%' }} value={fileName} placeholder="Enter a file name to create" readOnly={saving} onChange={(e) => setFileName(e.target.value)} /> 
            <Button style={{ width: '20%' }} disabled={savingDisabled} onClick={() => addFile(fileName.trim())} loading={saving}>Create</Button>
          </Input.Group>
        </Card>
      </main>

      <footer>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
