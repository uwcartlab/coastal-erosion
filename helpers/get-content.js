import fs from 'fs'
import matter from 'gray-matter'
import klaw from 'klaw'

function getContent(filepath) {
  let isFile = filepath.includes('.')

  // return code for getting just one file
  if (isFile) {
    let getContent = new Promise((resolve) => {
      if (fs.existsSync(filepath)) {
        let data = fs.readFileSync(filepath, 'utf8')
        let dataObj = matter(data)
        resolve(dataObj.content)
      } else {
        resolve("")
      }
    })

    return getContent
  }

  // return code for getting all files in a directory
  else {
    let returnObj = {}

    let getContent = new Promise(async (resolve) => {
      if (fs.existsSync(filepath)) {
        klaw(filepath)
        .on('data', async (item) => {
          let pathBuffer = item.path.split('/')
          let filename = pathBuffer[pathBuffer.length - 1]
          let data = fs.readFileSync(item.path, 'utf8')
          let dataObj = matter(data)
          returnObj[dataObj.data.title] = dataObj.content
        })
        .on('error', (e) => {
          console.log(e)
        })
        .on('end', () => {
          resolve(returnObj)
        })
      } else {
        resolve(returnObj)
      }
    })

    return getContent
  }
}

module.exports = getContent
