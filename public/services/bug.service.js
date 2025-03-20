import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugs'
const BASE_URL = '/api/bug/'
_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy) {
    // return storageService.query(STORAGE_KEY)
    return axios.get(BASE_URL)
    .then(res => res.data)
    .then(bugs => {

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugs = bugs.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.minSeverity) {
            bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }

        return bugs
    })
}

function getById(bugId) {
    // return storageService.get(STORAGE_KEY, bugId)
    return axios.get(BASE_URL + bugId)
    .then(res => res.data)
}

function remove(bugId) {
    // return storageService.remove(STORAGE_KEY, bugId)
    return axios.get(BASE_URL + bugId + '/remove')
    .then(res => res.data)
}

function save(bug) {
    // if (bug._id) {
    //     return storageService.put(STORAGE_KEY, bug)
    // } else {
    //     return storageService.post(STORAGE_KEY, bug)
    // }
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&description=${bug.description}&severity${bug.severity}`
    if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.get(url + queryParams)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err)
        })
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (bugs && bugs.length > 0) return 

    bugs = [
        {
            title: "Infinite Loop Detected",
            description: "The system enters an infinite loop when processing certain form inputs",
            severity: 4,
            _id: "1NF1N1T3"
        },
        {
            title: "Keyboard Not Found",
            description: "Virtual keyboard doesn't appear on mobile devices when expected",
            severity: 3,
            _id: "K3YB0RD"
        },
        {
            title: "404 Coffee Not Found",
            description: "Coffee machine API returns 404 errors during peak morning hours",
            severity: 2,
            _id: "C0FF33"
        },
        {
            title: "Unexpected Response",
            description: "Server returns unexpected error messages when processing large datasets",
            severity: 1,
            _id: "G0053"
        }
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}