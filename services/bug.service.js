import { utilService } from './util.service.js'
import fs from 'fs'

const PAGE_SIZE = 5
const bugs = utilService.readJsonFile('data/bugs.json')

export const bugService = {
    query,
    getById,
    save,
    remove,
}

function query(filterBy) {
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            if (filterBy.labels.length) {
                bugs = bugs.filter(bug => filterBy.labels.some(label => bug.labels?.some(bugLabel => bugLabel.indexOf(label) !== -1)));
            }
            if (filterBy.creatorId) {
                bugs = bugs.filter(bug => filterBy.creatorId === bug.creator._id)
            }
            if (filterBy.sortBy) {
                const { sortBy, sortDir } = filterBy

                if (sortBy === 'severity' || sortBy === 'createdAt') {
                    bugs.sort((bug1, bug2) => (bug1[sortBy] - bug2[sortBy]) * sortDir)
                } else if (sortBy === 'title') {
                    bugs.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title) * sortDir)
                }
            }
            if (filterBy.pageIdx !== undefined && filterBy.pageIdx !== null && filterBy.pageIdx !== '') {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return bugs
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Cannot remove bug - ' + bugId)

    if (!loggedinUser.isAdmin &&
        cars[idx].creator._id !== loggedinUser._id) {
        return Promise.reject(`Not your bug`)
    }
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave, loggedinUser) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        if (!loggedinUser.isAdmin &&
            bugToUpdate.creator._id !== loggedinUser._id) {
            return Promise.reject(`Not your bug`)
        }
        bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave }
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.creator = loggedinUser
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}


