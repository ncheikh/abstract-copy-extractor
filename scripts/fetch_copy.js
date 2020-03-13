const Abstract = require("abstract-sdk")
const fs = require('fs')
const ora = require('ora')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

require('dotenv').config()

const PROJECT_ID = process.argv.slice(2)[0]
const BRANCH_ID = process.argv.slice(3)[0]
const SHA = process.argv.slice(4)[0]

// Create a client
const client = new Abstract.Client({
    accessToken: process.env.API_TOKEN,

    transportMode: ["api"]
})

async function run() {
    const spinner = ora('Fetching Copy...').start()

    const csvWriter = createCsvWriter({
        path: 'data/copy/copy.csv',
        header: [
            { id: 'file_name', title: 'File' },
            { id: 'artboard_name', title: 'Artboard' },
            { id: 'layer_name', title: 'Layer' },
            { id: 'text', title: 'Text' },
        ]
    })

    const data = []

    const text = []

    try {
        // Query all files
        const files = await client.files.list({
            projectId: PROJECT_ID,
            branchId: BRANCH_ID,
            sha: SHA
        })

        for (const file of files) {
            // Query all layers
            const layers = await client.layers.list({
                projectId: PROJECT_ID,
                branchId: BRANCH_ID,
                fileId: file.id,
                sha: file.sha
            })

            // Write out data files
            fs.writeFile(`data/files/${file.name}.json`, JSON.stringify(file, null, 4), function (err) {
                if (err) {
                    console.log(err)
                }
            })

            for (const layer of layers) {
                const layer_data = await client.data.info({
                    projectId: PROJECT_ID,
                    branchId: BRANCH_ID,
                    fileId: file.id,
                    layerId: layer.id,
                    sha: file.sha
                })

                for (let [id, l] of Object.entries(layer_data.layers)) {
                    if (l.type === 'text') {
                        
                        let traverseToRoot = (parents, parentId, root) => {
                            let parent = layer_data.layers[parentId]

                            if (parentId in layer_data.layers) {
                                parents.push(parent)

                                if (parent.type !== root) {
                                    traverseToRoot(parents, parent.parentId, root)
                                }
                            }

                            return parents
                        }

                        text.push(
                            {
                                file: file,
                                text: l,
                                parents: traverseToRoot([], l.parentId, 'artboard')
                            }
                        )
                    }
                }
            }
        }

        for (ele of text) {
            let artboards = ele.parents.filter(ele => ele.type === 'artboard')

            if (artboards.length > 0) {
                let ab = artboards[0]
                data.push({
                    'file_name': ele.file.name,
                    'artboard_name': ab.properties.name,
                    'layer_name': ele.text.properties.name,
                    'text': ele.text.properties.textContent
                })
            } else {
                data.push({
                    'file_name': ele.file.name,
                    'artboard_name': "",
                    'layer_name': ele.text.properties.name,
                    'text': ele.text.properties.textContent
                })
            }
        }

        spinner.stop()

        fs.writeFile(`data/copy/copy.json`, JSON.stringify(data, null, 4), function (err) {
            if (err) {
                console.log(err)
            }
        })

        csvWriter
            .writeRecords(data)
            .then(() => console.log('The CSV file was written to data/copy/copy.csv'))

    } catch (e) {
        spinner.stop()
        console.log(e)
    }
}

run().catch(e => {
    console.log(e)
})