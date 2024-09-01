"use client";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Modal,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const SamplePage = () => {
  const router = useRouter();
  const [forceReload, setForceReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [users, setUsers] = useState([]);

  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    retypePassword: "",
    isAdmin: true,
    isSuperAdmin: false,
  });

  const [editingItemId, setEditingItemId] = useState("");
  const [editingItemName, setEditingItemName] = useState("");
  const [editForm, setEditForm] = useState({
    password: "",
    retypePassword: "",
  });

  const [passwordModal, setPasswordModal] = useState(false);

  useEffect(() => {
    axios.get("/api/auth/getUser").then((res) => {
      if (res.data.success && res.data.success === true) {
        const user = res.data.user;
        if (user.isSuperAdmin === false) router.push("/");
      } else {
        router.push("/authentication/login");
      }
    });
  }, [router]);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/users").then((res) => {
      if (res.data.success && res.data.success === true) {
        setUsers(res.data.users);
        console.log(res.data.users);
        setIsLoading(false);
        setForceReload(false);
      }
    });
  }, [, forceReload]);

  const createUser = () => {
    const { retypePassword, ...others } = createForm;

    // console.log(others);

    if (createForm.username.trim() === "") return;
    if (createForm.email.trim() === "") return;
    if (createForm.password.trim() === "") return;
    if (createForm.retypePassword.trim() === "") return;
    if (createForm.retypePassword.trim() != createForm.password.trim()) return;

    axios.post("/api/users/", others).then((res) => {
      if (res.data.success && res.data.success === true) {
        setCreateForm({
          username: "",
          email: "",
          password: "",
          retypePassword: "",
          isAdmin: true,
          isSuperAdmin: false,
        });
        setForceReload(true);
      }
    });
  };

  const submitPasswordChange = () => {
    axios.put("/api/users/", { password: editForm.password, id: editingItemId }).then((res) => {
      if (res.data.success && res.data.success === true) {
        setEditingItemId("");
        setEditForm({
          password: "",
          retypePassword: "",
        });
        setForceReload(true);
      }
    });
  };

  const deleteUser = (id) => {
    axios
      .delete("/api/users/", {
        params: {
          id,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setForceReload(true);
        }
      });
  };

  const cancelPasswordChange = () => {
    setEditingItemId("");
    setEditForm({
      password: "",
      retypePassword: "",
    });
  };

  const skeletonTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Username</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Is Admin</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Is Super admin</TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              <Skeleton height={50} />
            </TableCell>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
            <TableCell align="right">
              <Skeleton height={50} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const userRows = (row) => (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} key={row._id}>
      <TableCell component="th" scope="row">
        {row.username}
      </TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.isAdmin?.toString() || "false"}</TableCell> {/* Safely access isAdmin */}
      <TableCell>{row.isSuperAdmin?.toString() || "false"}</TableCell>{" "}
      {/* Safely access isSuperAdmin */}
      <TableCell align="right">
        <Button
          variant="contained"
          sx={{ marginRight: 2 }}
          disabled={editingItemId !== ""}
          onClick={() => {
            setEditingItemId(row._id);
            setEditForm({
              password: "",
              retypePassword: "",
            });
            setEditingItemName(row.username);
            setPasswordModal(true);
          }}
        >
          CHANGE PASSWORD
        </Button>
        <Button
          variant="contained"
          disabled={editingItemId !== ""}
          onClick={() => {
            deleteUser(row._id);
          }}
        >
          DELETE
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <PageContainer title="Users" description="this is Sample page">
      <Stack direction={"column"} spacing={4}>
        <DashboardCard
          title="Create User"
          action={
            <Button variant="contained" onClick={createUser}>
              Create User
            </Button>
          }
        >
          <Grid container justifyContent={"center"} gap={4}>
            <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                label="Username"
                value={createForm.username}
                onChange={(e) => {
                  setCreateForm({ ...createForm, username: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                value={createForm.email}
                onChange={(e) => {
                  setCreateForm({ ...createForm, email: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                label="Password"
                value={createForm.password}
                onChange={(e) => {
                  setCreateForm({ ...createForm, password: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                label="Retype Password"
                value={createForm.retypePassword}
                onChange={(e) => {
                  setCreateForm({ ...createForm, retypePassword: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      setCreateForm({
                        ...createForm,
                        isSuperAdmin: false,
                      });
                    }}
                    checked={!createForm.isSuperAdmin}
                  />
                }
                label="Is Admin"
              />
            </Grid>
            <Grid item textAlign={"center"} xs={5}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      setCreateForm({
                        ...createForm,
                        isSuperAdmin: true,
                        // isAdmin: e.target.checked || createForm.isAdmin,
                      });
                    }}
                    checked={createForm.isSuperAdmin}
                  />
                }
                label="Is Super Admin"
              />
            </Grid>
          </Grid>
          {/* TODO */}
        </DashboardCard>
        <DashboardCard title="Users">
          {isLoading ? (
            skeletonTable
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Username</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Is Admin</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Is Super admin</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{users.map((user) => userRows(user))}</TableBody>
              </Table>
            </TableContainer>
          )}

          {/* <Typography>User list</Typography> */}
          {/* TODO */}
        </DashboardCard>
      </Stack>
      <Modal
        open={passwordModal}
        onClose={() => {
          passwordModal(false);
        }}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: "30vw",
            // height: "30vw",
            padding: 4,
            borderRadius: 4,
          }}
          overflow={"auto"}
        >
          <Grid container sx={{ width: "30vw" }} rowGap={3}>
            <Grid item xs={12}>
              <Typography variant="h5">Change password of {editingItemName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                type="password"
                value={editForm.password}
                onChange={(e) => {
                  setEditForm({ ...editForm, password: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Retype Password"
                type="password"
                value={editForm.retypePassword}
                onChange={(e) => {
                  setEditForm({ ...editForm, retypePassword: e.target.value });
                }}
              />
            </Grid>
            <Grid xs={6} align={"center"}>
              <Button
                variant="contained"
                onClick={() => {
                  submitPasswordChange();
                  setPasswordModal(false);
                }}
              >
                Confirm
              </Button>
            </Grid>
            <Grid xs={6} align={"center"}>
              <Button
                variant="outlined"
                onClick={() => {
                  cancelPasswordChange();
                  setPasswordModal(false);
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </PageContainer>
  );
};

export default SamplePage;
