const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { BugList } from "../cmps/BugList.jsx"
import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(user => {
                setUser(user)
                loadUserBugs(user._id)
            })

            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function loadUserBugs(userId) {
        bugService.query({ creatorId: userId })
            .then(bugs => {
                setUserBugs(bugs)
            })
            .catch(err => {
                console.log('Cant load user bugs', err)
            })
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = userBugs.filter(bug => bug._id !== bugId)
                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const description = prompt('Description?', bug.description || '')

        const bugToSave = { ...bug, severity, description }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = userBugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onBack() {
        navigate('/')
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-details">
        <h1>User {user.fullname}</h1>
        <pre>
            {JSON.stringify(user, null, 2)}
        </pre>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>
        <h2>Bugs created by {user.fullname}:</h2>
        <BugList bugs={userBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        <button onClick={onBack} >Back</button>
    </section>
}