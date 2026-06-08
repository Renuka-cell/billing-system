import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import toast from "react-hot-toast";

function StaffManagement() {

  const [staffList, setStaffList] =
    useState([]);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [editingStaff, setEditingStaff] =
    useState(null);

  const [editUsername, setEditUsername] =
    useState("");

  const [resetStaff, setResetStaff] =
    useState(null);

  const [newPassword, setNewPassword] =
    useState("");
  
  const [confirmNewPassword,
    setConfirmNewPassword] =
    useState("");

  // ==========================
  // FETCH STAFF
  // ==========================
  const fetchStaff = async () => {

    try {

      const res =
        await API.get(
          "staff-list/"
        );

      setStaffList(
        res.data
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load staff"
      );
    }
  };

  useEffect(() => {

    fetchStaff();

  }, []);

  // ==========================
  // CREATE STAFF
  // ==========================
  const createStaff = async () => {

    try {

      if (
        password !== confirmPassword
      ) {

        toast.error(
          "Passwords do not match"
        );

        return;
      }

      await API.post(
        "create-staff/",
        {
          username,
          password,
        }
      );

      toast.success(
        "Staff created successfully"
      );

      setUsername("");
      setPassword("");
      setConfirmPassword("");
      fetchStaff();

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.error ||
        "Failed to create staff"
      );
    }
  };

  // ==========================
  // DELETE STAFF
  // ==========================
  const deleteStaff = async (
    userId
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this staff member?"
      );

    if (!confirmDelete)
      return;

    try {

      await API.delete(
        `delete-staff/${userId}/`
      );

      toast.success(
        "Staff deleted successfully"
      );

      fetchStaff();

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.error ||
        "Delete failed"
      );
    }
  };

  const updateStaff = async () => {

    try {

      await API.put(
        `update-staff/${editingStaff.id}/`,
        {
          username: editUsername,
        }
      );

      toast.success(
        "Staff updated successfully"
      );

      setEditingStaff(null);

      setEditUsername("");

      fetchStaff();

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.error ||
        "Update failed"
      );
    }
  };

  const resetPassword = async () => {

    try {

      if (!newPassword.trim()) {

        toast.error(
          "Password is required"
        );

        return;
      }

      if (
        newPassword !==
        confirmNewPassword
      ) {

        toast.error(
          "Passwords do not match"
        );

        return;
      }

      await API.put(
        `reset-staff-password/${resetStaff.id}/`,
        {
          password: newPassword,
        }
      );

      toast.success(
        "Password reset successfully"
      );

      setResetStaff(null);

      setNewPassword("");

      setConfirmNewPassword("");

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.error ||
        "Password reset failed"
      );
    }
  };

  return (

    <Layout>

      <div className="space-y-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Staff Management
          </h1>

          <p className="text-slate-500 mt-2">
            Create and manage staff accounts
          </p>

        </div>

        {/* CREATE STAFF */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Create Staff
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            />

          </div>

          <button
            onClick={createStaff}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Create Staff
          </button>

        </div>

        {/* STAFF TABLE */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="p-5 border-b">

            <h2 className="text-xl font-bold">
              Staff List
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-5 py-3 text-left">
                  Username
                </th>

                <th className="px-5 py-3 text-left">
                  Role
                </th>

                <th className="px-5 py-3 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {staffList.map(
                (staff) => (

                  <tr
                    key={staff.id}
                    className="border-b"
                  >

                    <td className="px-5 py-4">
                      {staff.username}
                    </td>

                    <td className="px-5 py-4">
                      {staff.role}
                    </td>

                    <td className="px-5 py-4 text-center">

                      <div className="flex justify-center gap-2 flex-wrap">

                        <button
                          onClick={() => {

                            setEditingStaff(
                              staff
                            );

                            setEditUsername(
                              staff.username
                            );

                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {

                            setResetStaff(
                              staff
                            );

                            setNewPassword("");

                            setConfirmNewPassword("");

                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                        >
                          Reset Password
                        </button>

                        <button
                          onClick={() =>
                            deleteStaff(
                              staff.id
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {
        editingStaff && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-6 w-full max-w-md">

              <h2 className="text-xl font-bold mb-4">
                Edit Staff
              </h2>

              <input
                type="text"
                value={editUsername}
                onChange={(e) =>
                  setEditUsername(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3"
              />

              <div className="flex justify-end gap-3 mt-5">

                <button
                  onClick={() =>
                    setEditingStaff(
                      null
                    )
                  }
                  className="bg-gray-400 text-white px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={updateStaff}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Save
                </button>

              </div>

            </div>

          </div>

        )
      }

      {
        resetStaff && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-6 w-full max-w-md">

              <h2 className="text-xl font-bold mb-4">
                Reset Password
              </h2>

              <div className="space-y-4">

                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-3"
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) =>
                    setConfirmNewPassword(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-3"
                />

              </div>

              <div className="flex justify-end gap-3 mt-5">

                <button
                  onClick={() => {

                    setResetStaff(
                      null
                    );

                    setNewPassword("");

                    setConfirmNewPassword("");

                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={resetPassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                >
                  Update Password
                </button>

              </div>

            </div>

          </div>

        )
      }
    </Layout>

  );
}

export default StaffManagement;