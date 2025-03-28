const { useState, useEffect } = React

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(loadBugs, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?', 3)
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const description = prompt('Description?', bug.description || '')

        const bugToSave = { ...bug, severity, description }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onSetPage(diff) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }

    function onSetSort(field) {
        setFilterBy(prevFilter => {
            if (prevFilter.sortBy === field) {
                return {
                    ...prevFilter, sortDir: prevFilter.sortDir === 1 ? -1 : 1
                }
            }

            return {
                ...prevFilter, sortBy: field, sortDir: 1
            }
        })
    }

    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
        </header>

        <div className="sorting-controls">
            <span>Sort by:</span>
            <button onClick={() => onSetSort('title')}>
                Title {filterBy.sortBy === 'title' && (filterBy.sortDir === 1 ? '▲' : '▼')}
            </button>
            <button onClick={() => onSetSort('severity')}>
                Severity {filterBy.sortBy === 'severity' && (filterBy.sortDir === 1 ? '▲' : '▼')}
            </button>
            <button onClick={() => onSetSort('createdAt')}>
                Created At {filterBy.sortBy === 'createdAt' && (filterBy.sortDir === 1 ? '▲' : '▼')}
            </button>
        </div>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug} />

        <label>
            Use Paging
            <input type="checkbox" onChange={(ev) => {
                setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: ev.target.checked ? 0 : undefined }))
            }} />
        </label>

        <div hidden={filterBy.pageIdx === undefined}>
            <button disabled={filterBy.pageIdx === 0} onClick={() => { onSetPage(-1) }}>Prev Page</button>
            <span>Page: {filterBy.pageIdx + 1}</span>
            <button onClick={() => { onSetPage(1) }}>Next Page</button>
        </div>

    </section>
}
