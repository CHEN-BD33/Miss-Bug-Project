const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

import { UserList } from '../cmps/UserList.jsx'
import { authService } from '../services/auth.service.js'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function UserIndex() {
    const user = authService.getLoggedinUser()
    const navigate = useNavigate()
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/')
            return
        }
        userService.query()
            .then(users => setUsers(users))
    }, [user, navigate])

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                setUsers(users => users.filter(user => user._id !== userId))
                showSuccessMsg('User Removed!')
            })
            .catch((err) => {
                console.log(err)
                showErrorMsg('Cannot Remove User')
            })
    }

    return (
        <section className='admin-users-index'>
            <h2>Users List:</h2>
            <UserList users={users} onRemoveUser={onRemoveUser} />
        </section>
    )
}

