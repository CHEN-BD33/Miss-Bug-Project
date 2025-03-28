import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugs'
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}

function save(bug) {
    const url = BASE_URL
    if (bug._id) {
        return axios.put(url + bug._id, bug)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })
    } else {
        return axios.post(url, bug)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })
    }
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
    return {
        txt: '', minSeverity: '', pageIdx: 0, sortBy: '', sortDir: 1, labels: []
    }
}