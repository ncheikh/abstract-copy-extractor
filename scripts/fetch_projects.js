const Abstract = require("abstract-sdk")
const { table } = require("table")
const ora = require('ora')

require('dotenv').config()

// Create a client
const client = new Abstract.Client({
    accessToken: process.env.API_TOKEN,

    transportMode: ["api"]
})


async function run() {
    const spinner = ora('Fetching Data...').start()

    const data = [["Organization Name", "Project Name", "Project Id"]]

    try {
        // Fetch the organizations
        const orgs = await client.organizations.list()

        for (const org of orgs) {

            // Fetch the projects for each or
            const projects = await client.projects.list({ organizationId: org.id })
    
            for (const project of projects) {
                data.push([org.name, project.name, project.id])
            }
        }

        spinner.stop()

        console.log(table(data))
    } catch(e) {
        spinner.stop()
        console.log(e)
    } 
}

run().catch(e => {
    console.log(e)
})