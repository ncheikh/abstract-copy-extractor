const Abstract = require("abstract-sdk")
const { table } = require("table")
const ora = require('ora')

require('dotenv').config()

const PROJECT_ID = process.argv.slice(2)[0]

// Create a client
const client = new Abstract.Client({
    accessToken: process.env.API_TOKEN,

    transportMode: ["api"]
})

async function run() {
    const spinner = ora('Fetching Branches...').start()

    const data = [["Branch Name", "Branch Id"]]

    try {
        // Query all projects
        const branches = await client.branches.list({
            projectId: PROJECT_ID,
        }, {
            filter: "active"
        })

        // Iterate through each project
        for (const branch of branches) {
            data.push([branch.name, branch.id])
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