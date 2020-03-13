const Abstract = require("abstract-sdk")
const { table } = require("table")
const ora = require('ora')

require('dotenv').config()

const PROJECT_ID = process.argv.slice(2)[0]
const BRANCH_ID = process.argv.slice(3)[0]

// Create a client
const client = new Abstract.Client({
    accessToken: process.env.API_TOKEN,

    transportMode: ["api"]
})

async function run() {
    const spinner = ora('Fetching SHAs...').start()

    const data = [["Commit SHA", "User Name", "Description"]]

    try {
        // Query all commits
        const commits = await client.commits.list({
            projectId: PROJECT_ID,
            branchId: BRANCH_ID
          });

        // Iterate through each project
        for (const commit of commits) {
            // console.log(commit)
            data.push([commit.sha, commit.userName, commit.description])
        }

        spinner.stop()

        output = table(data)

        console.log(output)
    } catch (e) {
        spinner.stop()
        console.log(e)
    }
}

run().catch(e => {
    console.log(e)
})