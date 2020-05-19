import Head from 'next/head'
import * as AWS from 'aws-sdk'
import { Button, Input } from 'antd'
import React, { useState } from 'react'

export async function getServerSideProps() {
  const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.S3_REGION })
  const objects = await s3.listObjects({ Bucket : process.env.BUCKET_NAME }).promise()
  return {
    props: {
      initFiles: objects.Contents.map((o) => o.Key)
    }
  }
}

export default function Home({ initFiles }) {
  const [files, setFiles] = useState(initFiles)
  const [fileName, setFileName] = useState(null)
  const [saving, setSaving] = useState(false)

  const refreshFiles = async () => {
    const res = await fetch(`/api/s3`)
    setFiles((await res.json()).objects.Contents.map((o) => o.Key))
  }

  const addFile = async (fileName) => {
    setSaving(true)
    try {
      await fetch(`/api/s3/${encodeURIComponent(fileName)}`)
      setFileName(null)
      refreshFiles()
    } catch (err) {

    }
    setSaving(false)
  }

  const savingDisabled = saving || !fileName || fileName.trim().length === 0

  return (
    <div className="container">
      <Head>
        <title>Example S3 Bucket Listing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h4>S3 Contents</h4>
        <Button onClick={refreshFiles}>Refresh</Button>
        <ul>
          {files.map((file) => <li>{file}</li>)}
        </ul>
        File name: 
        <Input value={fileName} readOnly={saving} onChange={(e) => setFileName(e.target.value)} /> 
        <Button disabled={savingDisabled} onClick={() => addFile(fileName.trim())}>Add file to S3</Button>
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

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
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
