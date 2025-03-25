import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService} from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
 
//* Express Config:
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


//* Express Routing:
//* Read
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot load bugs')
        })
})

//* Create
app.post('/api/bug', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot add bug', err)
            res.status(500).send('Cannot add bug')
        })
})


//*Edit
app.put('/api/bug/:bugId', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot update bug', err)
            res.status(500).send('Cannot update bug')
        })
})


//* Get/Read by id
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitedBugs = [] } = req.cookies

    if(visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
    if(!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 70 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot load bug')
        })
})


//* Remove/Delete
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('Bug Removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

// app.get('/cookies', (req, res) => {
//     let visitedCount = req.cookies.visitedCount || 0
//     visitedCount++
//     console.log('visitedCount:', visitedCount)
//     res.cookie('visitedCount', visitedCount, { maxAge: 5 * 1000 })
//     // console.log('visitedCount:', visitedCount)
//     res.send('Hello Puki')
// })

 app.get('/', (req, res) => res.send('Hello there')) 
 
 app.listen(3030, () => console.log('Server ready at port 3030'))