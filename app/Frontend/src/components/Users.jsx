import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import * as api from "../services/api"
import { Plus, Edit, Trash, User, Mail, Phone, Search, ChevronDown } from "lucide-react"

function Users() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.getAllUsers()
      setUsers(response.data.data)
    } catch (error) {
      toast.error("Error fetching users")
    }
  }

  const validateInput = (name, email, phoneNo) => {
    if (!name || name.trim() === "") {
      toast.error("Name is required")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      toast.error("Invalid email format")
      return false
    }
    const phoneRegex = /^\+?[\d\s-]{10,15}$/
    if (!phoneNo || !phoneRegex.test(phoneNo)) {
      toast.error("Invalid phone number (10-15 digits, may include +, spaces, or -)")
      return false
    }
    return true
  }

  const handleOpen = (user = null) => {
    let name, email, phoneNo
    if (user) {
      name = prompt("Enter name", user.name)
      email = prompt("Enter email", user.email)
      phoneNo = prompt("Enter phone number", user.phoneNo)
    } else {
      name = prompt("Enter name")
      email = prompt("Enter email")
      phoneNo = prompt("Enter phone number")
    }

    if (name === null || email === null || phoneNo === null) {
      toast.info("User input cancelled")
      return
    }

    if (!validateInput(name, email, phoneNo)) {
      return
    }

    const formData = { name, email, phoneNo }
    handleSubmit(user ? user._id : null, formData)
  }

  const handleSubmit = async (id, formData) => {
    try {
      if (id) {
        await api.updateUser(id, formData)
        toast.success("User updated successfully")
      } else {
        await api.createUser(formData)
        toast.success("User created successfully")
      }
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    try {
      await api.deleteUser(id)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      toast.error("Error deleting user")
    }
  }

  const filteredUsers = users ? users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNo.includes(searchTerm),
  ) : []

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <User className="mr-2 text-indigo-600" /> Users
            </h3>
            <button
              onClick={() => handleOpen()}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2" /> Add New User
            </button>
          </div>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <div className="flex space-x-4">
                {["name", "email", "phoneNo"].map((field) => (
                  <button
                    key={field}
                    onClick={() => toggleSort(field)}
                    className={`flex items-center space-x-1 text-sm font-medium ${
                      sortBy === field ? "text-indigo-600" : "text-gray-500"
                    } hover:text-indigo-600 transition-colors duration-200`}
                  >
                    <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        sortBy === field && sortOrder === "desc" ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <ul className="divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <li key={user._id} className="hover:bg-gray-50 transition duration-200">
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <div className="text-lg font-semibold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="mr-1 w-4 h-4" /> {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="mr-1 w-4 h-4" /> {user.phoneNo}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleOpen(user)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center transition duration-200"
                    >
                      <Edit className="mr-1 w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800 flex items-center transition duration-200"
                    >
                      <Trash className="mr-1 w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Users