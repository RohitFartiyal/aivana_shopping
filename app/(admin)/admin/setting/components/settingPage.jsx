"use client";

import { getUsers, updateUserRole } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useFetch from "@/hooks/use-fetch";
import { CheckCircle, Loader2, Search, Shield, Users, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const SettingPage = () => {

  const [userSearch, setUserSearch] = useState("");
  const [confirmAdminDialog, setConfirmAdminDialog] = useState(false);
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState(false);
  const [userToPromote, setUserToPromote] = useState(null);
  const [userToDemote, setUserToDemote] = useState(null);

    const {
    loading: fetchingUsers,
    fn,
    data: usersData,
  } = useFetch(getUsers);

  const {
    loading: updatingRole,
    fn: updateRole,
    data: updateRoleResult,
    error: updateRoleError,
  } = useFetch(updateUserRole);

  useEffect(() => {
      fn()
    }, [])

    // Filter users by search term
  const filteredUsers = usersData?.success
    ? usersData.data.filter(
        (user) =>
          user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearch.toLowerCase())
      )
    : [];

    // Make user admin
  const handleMakeAdmin = async () => {
    if (!userToPromote) return;
    await updateRole(userToPromote.id, "ADMIN");
  };

  // Remove admin privileges
  const handleRemoveAdmin = async () => {
    if (!userToDemote) return;
    await updateRole(userToDemote.id, "USER");
  };

  // Handle successful operations
  useEffect(() => {

    if (updateRoleResult?.success) {
      toast.success("User role updated successfully");
      fn();
      setConfirmAdminDialog(false);
      setConfirmRemoveDialog(false);
    }
  }, [updateRoleResult]);
  console.log("g", updateRoleResult)

  return (
    <div>
      <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Manage users with admin privileges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-9 w-full"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              {fetchingUsers ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : usersData?.success && filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {user.imageUrl ? (
                                  <img
                                    src={user.imageUrl}
                                    alt={user.name || "User"}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Users className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <span>{user.name || "Unnamed User"}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.role === "ADMIN"
                                  ? "bg-green-800"
                                  : "bg-gray-800"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {user.role === "ADMIN" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                                onClick={() => {
                                  setUserToDemote(user);
                                  setConfirmRemoveDialog(true);
                                }}
                                disabled={updatingRole}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Remove Admin
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setUserToPromote(user);
                                  setConfirmAdminDialog(true);
                                }}
                                disabled={updatingRole}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Make Admin
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No users found
                  </h3>
                  <p className="text-gray-500">
                    {userSearch
                      ? "No users match your search criteria"
                      : "There are no users registered yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confirm Make Admin Dialog */}
          <Dialog
            open={confirmAdminDialog}
            onOpenChange={setConfirmAdminDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Admin Privileges</DialogTitle>
                <DialogDescription>
                  Are you sure you want to give admin privileges to{" "}
                  {userToPromote?.name || userToPromote?.email}? Admin users can
                  manage all aspects of the dealership.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConfirmAdminDialog(false)}
                  disabled={updatingRole}
                >
                  Cancel
                </Button>
                <Button onClick={handleMakeAdmin} disabled={updatingRole}>
                  {updatingRole ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Confirm Remove Admin Dialog */}
          <Dialog
            open={confirmRemoveDialog}
            onOpenChange={setConfirmRemoveDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Admin Privileges</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove admin privileges from{" "}
                  {userToDemote?.name || userToDemote?.email}? They will no
                  longer be able to access the admin dashboard.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConfirmRemoveDialog(false)}
                  disabled={updatingRole}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveAdmin}
                  disabled={updatingRole}
                >
                  {updatingRole ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove Admin"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </div>
  )
}
export default SettingPage