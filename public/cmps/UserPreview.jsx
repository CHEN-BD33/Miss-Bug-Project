export function UserPreview({ user, onRemoveUser }) {
  return (
    <li className="user-details">
      <h2>Fullname: {user.fullname}</h2>
      <h3>ID Number: {user._id}</h3>
      <button className="delete-user" onClick={() => onRemoveUser(user._id)} title="Delete user">Delete</button>
    </li>
  )






}



