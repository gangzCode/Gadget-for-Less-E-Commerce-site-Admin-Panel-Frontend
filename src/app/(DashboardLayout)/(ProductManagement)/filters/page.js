"use client";
import {
  Autocomplete,
  Box,
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
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { QuestionMark } from "@mui/icons-material";

const SamplePage = () => {
  const [forceReload, setForceReload] = useState(false);

  const [filterGroups, setFilterGroups] = useState([]);
  const [filters, setFilters] = useState([]);

  const [unassignedFilters, setUnassingedFilters] = useState([]);

  const [filterGroupForm, setFilterGroupForm] = useState({
    name: "",
    filters: [],
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModal, setImageModal] = useState(false);

  const [filterForm, setFilterForm] = useState({
    name: "",
    showAsCard: false,
    tagLine: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [editingItemId, setEditingItemId] = useState("");
  const [editData, setEditData] = useState({});
  const [editingFGFilters, setEditingFGFilters] = useState([]);

  const [openFGModal, setOpenFGModal] = useState(false);

  const [openFGEditModal, setOpenFGEditModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // axios.get()

    let assignedFilters = [];

    axios
      .get("/api/filters/filtergroups")
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setFilterGroups(res.data.filters);
          let tempFilters = [];
          let tempIds = [];
          res.data.filters.forEach((el) => {
            el.filters.forEach((sub) => {
              if (!tempIds.includes(sub._id)) {
                sub.groupId = el._id;
                sub.groupName = el.name;
                tempFilters.push(sub);
                tempIds.push(sub._id);
              }
            });
          });
          // setFilters(tempFilters);
          assignedFilters = tempFilters;
        }
        return axios.get("/api/filters/unassigned");
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setUnassingedFilters(res.data.unassigned);
          setFilters([...assignedFilters, ...res.data.unassigned]);

          setIsLoading(false);
          setForceReload(false);
        }
      });
  }, [, forceReload]);

  const createFilterGroup = () => {
    if (filterGroupForm.name === "") return;
    // if (filterGroupForm.filters.length === 0) return;

    axios
      .post("/api/filters/filtergroups", {
        ...filterGroupForm,
        filters: filterGroupForm.filters.map((filter) => filter._id),
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setForceReload(true);
          setFilterGroupForm({
            name: "",
            filters: [],
          });
          setOpenFGModal(false);
        }
      });
  };

  const createFilter = () => {
    if (filterForm.name === "") return;
    if (filterForm.tagLine === "") return;
    // if (filterForm.image === null) return;
    // if (filterGroupForm.filters.length === 0) return;

    console.log(filterForm);

    axios.postForm("/api/filters", filterForm).then((res) => {
      if (res.data.success && res.data.success === true) {
        setForceReload(true);
        setFilterForm({
          name: "",
          showAsCard: false,
          tagLine: "",
          image: null,
        });
      }
    });
  };

  const deleteItem = (type, parentId) => {
    const deleteBody = {};

    switch (type) {
      case "filter":
        deleteBody.isFilter = true;
        // deleteBody.groupId = parentId;
        deleteBody.filterId = parentId;
        break;
      case "group":
        deleteBody.isSub = false;
        deleteBody.groupId = parentId;
        break;
      default:
        break;
    }
    setIsLoading(true);
    axios.post("/api/filters/delete", deleteBody).then((res) => {
      if (res.data.success && res.data.success === true) {
        setIsLoading(false);
        setForceReload(true);
      }
    });
  };

  const saveEdit = (type, parentId) => {
    // Parent ID - parent of the item or current item if it is a root item
    // Child ID - current item if it is a non-root item

    if (Object.keys(editData).length === 0) return;

    // check if editData has name
    if ("name" in editData) {
      if (editData.name === "") return;
    } else return;
    // check if editData has filters
    if ("filters" in editData) if (editData.filters.length === 0) return;

    const editBody = {};
    // let apiPath = "";

    switch (type) {
      case "filter":
        // editBody.isSub = false;
        // editBody.filterGroup = parentId;
        editBody.name = editData.name;
        editBody.tagLine = editData.tagLine;
        editBody.showAsCard = editData.showAsCard;
        editBody.image = editData.image;
        // apiPath = "/api/filters";
        setIsLoading(true);
        axios
          .putForm("/api/filters", editBody, {
            params: {
              filterId: parentId,
            },
          })
          .then((res) => {
            if (res.data.success && res.data.success === true) {
              setEditingItemId("");
              setEditData({});
              setIsLoading(false);
              setForceReload(true);
              setOpenFGEditModal(false);
            }
          });
        break;
      case "group":
        editBody.isSub = true;
        // editBody.categoryId = parentId;
        editBody.groupId = parentId;
        editBody.updatedData = {
          ...editData,
          filters: editData.filters.map((filter) => filter._id),
        };
        // apiPath = "/api/filters/filtergroups";
        setIsLoading(true);
        axios.put("/api/filters/filtergroups", editBody).then((res) => {
          if (res.data.success && res.data.success === true) {
            cancelEdit();
            setIsLoading(false);
            setForceReload(true);
            setOpenFGEditModal(false);
          }
        });
        break;
      default:
        return;
    }

    // Send update request
    // on success refresh table and remove from editing id
  };

  const cancelEdit = () => {
    // reset editing data
    // remove change editing to current

    setEditingItemId("");
    setEditData({});
    // setForceReload(true);
  };

  const filterGroupCreator = (
    <Stack alignItems={"center"} spacing={2}>
      <Typography>Create Filter Group</Typography>
      <TextField
        id="cat-name"
        label="Filter Group Name"
        variant="outlined"
        value={filterGroupForm.name}
        onChange={(e) => {
          setFilterGroupForm({
            ...filterGroupForm,
            name: e.target.value,
          });
        }}
        fullWidth
      />
      <Autocomplete
        disablePortal
        multiple
        // limitTags={1}
        id="combo-box-demo"
        value={filterGroupForm.filters}
        sx={{ width: 400 }}
        options={unassignedFilters}
        getOptionLabel={(filter) => filter.name}
        renderInput={(params) => <TextField {...params} label="Select Filters" />}
        onChange={(e, newValue) => {
          setFilterGroupForm({
            ...filterGroupForm,
            filters: newValue,
          });
        }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={createFilterGroup}
        disabled={editingItemId != ""}
      >
        Create Filter Group
      </Button>
    </Stack>
  );

  const filterCreator = (
    <Stack alignItems={"center"} spacing={2} direction="row">
      {/* <Typography variant="h6">Create Category</Typography> */}
      <Button variant="contained" component="label" disabled={editingItemId != ""}>
        Choose image{" "}
        <input
          type="file"
          accept="image/*"
          hidden
          name="subCatName"
          onChange={(e) => {
            // setSubcategoryForm({
            //   ...subcategoryForm,
            //   image: e.target.files[0],
            // });
            setSelectedImage(e.target.files[0]);
            setImageModal(true);
            e.target.value = "";
          }}
        />
      </Button>
      <TextField
        id="cat-name"
        label="Filter Name"
        variant="outlined"
        value={filterForm.name}
        onChange={(e) => {
          setFilterForm({
            ...filterForm,
            name: e.target.value,
          });
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => {
              setFilterForm({
                ...filterForm,
                showAsCard: e.target.checked,
              });
            }}
            checked={filterForm.showAsCard}
          />
        }
        label="Show as card"
      />
      <TextField
        id="cat-name"
        label="Tagline"
        variant="outlined"
        value={filterForm.tagLine}
        onChange={(e) => {
          setFilterForm({
            ...filterForm,
            tagLine: e.target.value,
          });
        }}
      />
      <Button variant="contained" onClick={createFilter} disabled={editingItemId != ""}>
        Create Filter
      </Button>
    </Stack>
  );

  const skeletonFilterTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Group</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Show as card</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Tag line</TableCell>
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

  const skeletonGroupTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
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
            <TableCell align="right">
              <Skeleton height={50} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <PageContainer title="Filters" description="this is Sample page">
      <Stack spacing={4}>
        <DashboardCard
          title="Filters"
          action={isLoading ? <Skeleton width={500} height={50} /> : filterCreator}
        >
          {!isLoading ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Image</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Group</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Show as Card</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Tag line</TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filters.map((row) =>
                    row._id != editingItemId ? (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Paper
                            sx={{
                              padding: 4,
                              width: "100px",
                              height: "100px",
                              position: "relative",
                              textAlign: "center",
                              verticalAlign: "center",
                            }}
                          >
                            {!!row.image ? (
                              <Image src={row.image} alt="" objectFit="contain" fill />
                            ) : (
                              <QuestionMark fontSize="large" />
                            )}
                          </Paper>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.groupName || "unassigned"}</TableCell>
                        <TableCell>{row.showAsCard?.toString()}</TableCell>
                        <TableCell>{row.tagLine}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            sx={{ marginRight: 2 }}
                            disabled={editingItemId != ""}
                            onClick={() => {
                              // deleteItem("category", row._id);
                              setEditingItemId(row._id);
                              setEditData({
                                name: row.name,
                                showAsCard: row.showAsCard,
                                tagLine: row.tagLine,
                                image: row.image,
                              });
                            }}
                          >
                            EDIT
                          </Button>
                          <Button
                            variant="contained"
                            disabled={editingItemId != ""}
                            onClick={() => {
                              deleteItem("filter", row._id);
                            }}
                          >
                            DELETE
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Stack alignItems={"center"} gap={2}>
                            <Paper
                              sx={{
                                padding: 4,
                                width: "100px",
                                height: "100px",
                                position: "relative",
                                textAlign: "center",
                                verticalAlign: "center",
                              }}
                            >
                              {!!editData.image ? (
                                typeof editData.image === "string" ? (
                                  <Image src={editData.image} alt="" objectFit="contain" fill />
                                ) : (
                                  <Image
                                    src={URL.createObjectURL(editData.image)}
                                    alt=""
                                    objectFit="contain"
                                    fill
                                  />
                                )
                              ) : (
                                <QuestionMark fontSize="large" />
                              )}
                            </Paper>
                            <Button variant="contained" component="label">
                              Choose{" "}
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                name="subCatName"
                                onChange={(e) => {
                                  // setSubcategoryForm({
                                  //   ...subcategoryForm,
                                  //   image: e.target.files[0],
                                  // });
                                  setSelectedImage(e.target.files[0]);
                                  setImageModal(true);
                                  e.target.value = "";
                                }}
                              />
                            </Button>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <TextField
                            id="cat-name"
                            label="Filter Name"
                            variant="outlined"
                            value={editData.name}
                            onChange={(e) => {
                              setEditData({
                                ...editData,
                                name: e.target.value,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.groupName || "unassigned"}</TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  setEditData({
                                    ...editData,
                                    showAsCard: e.target.checked,
                                  });
                                }}
                                checked={editData.showAsCard}
                              />
                            }
                            label="Show as card"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            id="cat-name"
                            label="Tagline"
                            variant="outlined"
                            value={editData.tagLine}
                            onChange={(e) => {
                              setEditData({
                                ...editData,
                                tagLine: e.target.value,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            sx={{ marginRight: 2 }}
                            // disabled={editingItemId != ""}
                            onClick={() => {
                              // deleteItem("category", row._id);
                              saveEdit("filter", row._id);
                            }}
                          >
                            SAVE
                          </Button>
                          <Button
                            variant="contained"
                            // disabled={editingItemId != ""}
                            onClick={() => {
                              cancelEdit();
                            }}
                          >
                            CANCEL
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            skeletonFilterTable
          )}
        </DashboardCard>
        <DashboardCard
          title="Filter Groups"
          action={
            isLoading ? (
              <Skeleton width={500} height={50} />
            ) : (
              <Button variant="contained" onClick={(e) => setOpenFGModal(true)}>
                Create Filter Group
              </Button>
            )
          }
        >
          <Modal
            open={openFGModal}
            onClose={(e) => {
              setOpenFGModal(false);
              setFilterGroupForm({
                name: "",
                filters: [],
              });
              setForceReload(true);
            }}
          >
            <Box
              title="Create Filter Group"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "fit-content",
                bgcolor: "background.paper",
                // border: "2px solid #000",
                boxShadow: 24,
                p: 4,
                borderRadius: 3,
              }}
            >
              {filterGroupCreator}
            </Box>
          </Modal>
          <Modal
            open={openFGEditModal}
            onClose={(e) => {
              setOpenFGEditModal(false);
              setEditData({});
              setEditingItemId("");
              setForceReload(true);
            }}
          >
            <Box
              title="Create Filter Group"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "fit-content",
                bgcolor: "background.paper",
                // border: "2px solid #000",
                boxShadow: 24,
                p: 4,
                borderRadius: 3,
              }}
            >
              <Stack alignItems={"center"} spacing={2}>
                <Typography>Edit Filter Group</Typography>
                <TextField
                  id="cat-name"
                  label="Filter Group Name"
                  variant="outlined"
                  value={editData.name}
                  onChange={(e) => {
                    setEditData({
                      ...editData,
                      name: e.target.value,
                    });
                  }}
                  fullWidth
                />
                <Autocomplete
                  disablePortal
                  multiple
                  // limitTags={1}
                  id="combo-box-demo"
                  value={editData.filters}
                  sx={{ width: 400 }}
                  options={[...editingFGFilters, ...unassignedFilters]}
                  getOptionLabel={(filter) => filter.name}
                  renderInput={(params) => <TextField {...params} label="Select Filters" />}
                  onChange={(e, newValue) => {
                    setEditData({
                      ...editData,
                      filters: newValue,
                    });
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    saveEdit("group", editingItemId);
                  }}
                >
                  Save Filter Group
                </Button>
              </Stack>
            </Box>
          </Modal>
          {!isLoading ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterGroups.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          sx={{ marginRight: 2 }}
                          disabled={editingItemId != ""}
                          onClick={() => {
                            // deleteItem("category", row._id);
                            setEditingItemId(row._id);
                            setEditData({
                              name: row.name,
                              filters: row.filters,
                            });
                            setOpenFGEditModal(true);
                            setEditingFGFilters(row.filters);
                          }}
                        >
                          EDIT
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            // deleteItem(row, false);
                            deleteItem("group", row._id);
                          }}
                        >
                          DELETE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            skeletonGroupTable
          )}
        </DashboardCard>
      </Stack>
      <Modal
        open={imageModal}
        onClose={() => {
          setSelectedImage(null);
          setImageModal(false);
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
              <Paper
                sx={{
                  padding: 4,
                  width: "30vw",
                  height: "30vw",
                  position: "relative",
                  textAlign: "center",
                  verticalAlign: "center",
                }}
              >
                {!!selectedImage && (
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    alt=""
                    fill
                    style={{ objectFit: "contain" }}
                  />
                )}
              </Paper>
            </Grid>
            <Grid xs={6} align={"center"}>
              <Button
                variant="contained"
                onClick={() => {
                  if (!!editingItemId) {
                    setEditData({
                      ...editData,
                      image: selectedImage,
                    });
                  } else {
                    setFilterForm({
                      ...filterForm,
                      image: selectedImage,
                    });
                  }
                  setSelectedImage(null);
                  setImageModal(false);
                }}
              >
                Confirm
              </Button>
            </Grid>
            <Grid xs={6} align={"center"}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedImage(null);
                  setImageModal(false);
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
