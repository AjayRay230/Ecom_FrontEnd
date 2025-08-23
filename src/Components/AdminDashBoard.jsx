



const AdminDashBoard=()=>{
    <div className="dropdown-admin">
    <button className="dropbtn-admin">
      Admin Panel
      <span style={{ fontSize: '0.7rem', marginLeft: '8px' }}> ▼ </span>
    </button>
    <div className="dropdown-content-admin">
      <a href="/admin/userlist">User List</a>
      <a href="/admin/adduser">Add User</a>
      <a href="/admin/removeuser">Remove User</a>
    </div>
  </div>
}
export default AdminDashBoard;