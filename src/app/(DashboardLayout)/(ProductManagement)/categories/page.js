"use client";
import {
  Autocomplete,
  Button,
  CardContent,
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

const Categories = () => {
  const [forceReload, setForceReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [innerSubcategories, setInnerSubcategories] = useState([]);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    showInNav: false,
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    category: null,
    showInNav: false,
    image: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModal, setImageModal] = useState(false);

  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [innerSubcategoryForm, setInnerSubcategoryForm] = useState({
    name: "",
    category: null,
    subcategory: null,
  });

  const [editingItemId, setEditingItemId] = useState("");
  const [editData, setEditData] = useState({});

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/categories").then((res) => {
      if (res.data.success && res.data.success === true) {
        setCategories(res.data.categories);
        setCategoryOptions(
          res.data.categories.map((category) => {
            return {
              label: category.name,
              _id: category._id,
            };
          })
        );
        let tempSubCats = [];
        let tempIds = [];
        let tempInnerSubs = [];
        res.data.categories.forEach((el) => {
          el.subCategory.forEach((sub) => {
            if (!tempIds.includes(sub._id)) {
              sub.categoryId = el._id;
              sub.categoryName = el.name;
              tempSubCats.push(sub);
              tempIds.push(sub._id);
            }
            if (sub.innerCategories) {
              sub.innerCategories.forEach((val) => {
                let obj = { name: val.name, _id: val._id };
                obj.subCategoryName = sub.name;
                obj.parentSubcategory = sub._id;
                tempInnerSubs.push(obj);
              });
            }
          });
        });
        console.log(tempSubCats);

        setSubcategories(tempSubCats);
        setInnerSubcategories(tempInnerSubs);
        setForceReload(false);
        setIsLoading(false);
      }
    });
  }, [, forceReload]);

  const createCategory = () => {
    if (categoryForm.name.trim() === "") return;

    axios.post("/api/categories", categoryForm).then((res) => {
      if (res.data.success && res.data.success === true) {
        setCategoryForm({
          name: "",
          showInNav: false,
        });

        setForceReload(true);
      }
    });
  };

  const createSubcategory = () => {
    if (subcategoryForm.name.trim() === "") return;
    if (subcategoryForm.category == null) return;

    axios
      .postForm("/api/categories/subcategories", {
        ...subcategoryForm,
        category: subcategoryForm.category._id,
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setSubcategoryForm({
            name: "",
            category: null,
            showInNav: false,
            image: null,
          });

          setForceReload(true);
        }
      });
  };

  const createInnerSubcategory = () => {
    if (innerSubcategoryForm.name.trim() === "") return;
    if (innerSubcategoryForm.category == null) return;
    if (innerSubcategoryForm.subcategory == null) return;

    axios
      .post("/api/categories/innercategories", {
        // ...subcategoryForm,
        parentId: innerSubcategoryForm.subcategory._id,
        innerCategories: [
          {
            name: innerSubcategoryForm.name,
          },
        ],
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setSubcategoryForm({
            name: "",
            category: null,
            subcategory: null,
          });

          setForceReload(true);
        }
      });
  };

  const deleteItem = (itemType, parentId, childId = "") => {
    // Parent ID - parent of the item or current item if it is a root item
    // Child ID - current item if it is a non-root item
    const deleteBody = {};

    switch (itemType) {
      case "category":
        deleteBody.isSub = false;
        deleteBody.categoryId = parentId;
        break;
      case "subcategory":
        deleteBody.isSub = true;
        deleteBody.categoryId = parentId;
        deleteBody.subId = childId;
        break;
      case "innersubcategory":
        deleteBody.isSub = true;
        deleteBody.isInnerSub = true;
        deleteBody.categoryId = parentId;
        deleteBody.subId = childId;
        break;
      default:
        break;
    }
    setIsLoading(true);
    axios.post("/api/categories/delete", deleteBody).then((res) => {
      if (res.data.success && res.data.success === true) {
        setIsLoading(false);
        setForceReload(true);
      }
    });
  };

  const saveEdit = (type, parentId, childId = "") => {
    // Parent ID - parent of the item or current item if it is a root item
    // Child ID - current item if it is a non-root item

    if (Object.keys(editData).length === 0) return;

    // check if editData has name
    if ("name" in editData) {
      if (editData.name === "") return;
    } else return;
    // check if editData has category for subcategory edits
    if ("category" in editData) if (editData.category == null) return;

    const editBody = {};

    switch (type) {
      case "category":
        // editBody.isSub = false;
        editBody.categoryId = parentId;
        editBody.updatedData = editData;
        break;
      case "subcategory":
        editBody.isSub = true;
        // editBody.categoryId = parentId;
        editBody.subId = parentId;
        editBody.image = editData.imagePath;
        editBody.updatedData = {
          name: editData.name,
          showInNav: editData.showInNav,
          category: editData.category._id,
        };
        break;
      case "innersubcategory":
        editBody.isSub = true;
        editBody.isInnerSub = true;
        editBody.parentSubcategory = parentId;
        editBody.subId = childId;
        editBody.updatedData = editData;
        console.log(editBody);

        break;
      default:
        break;
    }

    setIsLoading(true);

    axios.putForm("/api/categories", editBody).then((res) => {
      if (res.data.success && res.data.success === true) {
        setEditingItemId("");
        setEditData({});
        setIsLoading(false);
        setForceReload(true);
      }
    });

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

  const skeletonTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Show on Navbar</TableCell>
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
            <TableCell align="right">
              <Skeleton height={50} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const categoryCreator = (
    <Stack alignItems={"center"} spacing={2} direction="row">
      {/* <Typography variant="h6">Create Category</Typography> */}
      <TextField
        id="cat-name"
        label="Category Name"
        variant="outlined"
        value={categoryForm.name}
        onChange={(e) => {
          setCategoryForm({
            ...categoryForm,
            name: e.target.value,
          });
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => {
              setCategoryForm({
                ...categoryForm,
                showInNav: e.target.checked,
              });
            }}
            checked={categoryForm.showInNav}
          />
        }
        label="Show on Navbar"
      />
      <Button variant="contained" onClick={createCategory} disabled={editingItemId != ""}>
        Create
      </Button>
    </Stack>
  );

  const subcategoryCreator = (
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
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        value={subcategoryForm.category}
        sx={{ width: 150 }}
        options={categoryOptions}
        renderInput={(params) => <TextField {...params} label="Category" />}
        onChange={(e, newValue) => {
          setSubcategoryForm({
            ...subcategoryForm,
            category: newValue,
          });
        }}
      />
      <TextField
        id="subcat-name"
        label="Subcategory Name"
        variant="outlined"
        sx={{ width: 150 }}
        value={subcategoryForm.name}
        onChange={(e) => {
          setSubcategoryForm({
            ...subcategoryForm,
            name: e.target.value,
          });
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => {
              setSubcategoryForm({
                ...subcategoryForm,
                showInNav: e.target.checked,
              });
            }}
            checked={subcategoryForm.showInNav}
          />
        }
        label="Show on Navbar"
      />
      <Button variant="contained" onClick={createSubcategory} disabled={editingItemId != ""}>
        Create
      </Button>
    </Stack>
  );

  const innerSubcategoryCreator = (
    <Stack alignItems={"center"} spacing={2} direction="row">
      {/* <Typography variant="h6">Create Category</Typography> */}
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        value={innerSubcategoryForm.category}
        sx={{ width: 200 }}
        options={categoryOptions}
        renderInput={(params) => <TextField {...params} label="Category" />}
        onChange={(e, newValue) => {
          setInnerSubcategoryForm({
            ...innerSubcategoryForm,
            category: newValue,
          });

          if (newValue === null) return;
          setSubcategoryOptions(
            categories
              .find((cat) => cat._id === newValue._id)
              .subCategory.map((subcat) => {
                return {
                  label: subcat.name,
                  _id: subcat._id,
                };
              })
          );
        }}
      />
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        value={innerSubcategoryForm.subcategory}
        sx={{ width: 200 }}
        options={subcategoryOptions}
        renderInput={(params) => <TextField {...params} label="Subcategory" />}
        onChange={(e, newValue) => {
          setInnerSubcategoryForm({
            ...innerSubcategoryForm,
            subcategory: newValue,
          });
        }}
      />
      <TextField
        id="subcat-name"
        label="Inner Subcategory Name"
        variant="outlined"
        value={innerSubcategoryForm.name}
        onChange={(e) => {
          setInnerSubcategoryForm({
            ...innerSubcategoryForm,
            name: e.target.value,
          });
        }}
      />
      <Button variant="contained" onClick={createInnerSubcategory} disabled={editingItemId != ""}>
        Create
      </Button>
    </Stack>
  );

  return (
    <PageContainer title="Categories" description="this is Sample page">
      {/* <Typography>This is a Categories page</Typography> */}
      <Stack spacing={4}>
        <DashboardCard
          title="Categories"
          action={isLoading ? <Skeleton width={500} height={50} /> : categoryCreator}
        >
          {!isLoading ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Show on Navbar</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((row) =>
                    row._id != editingItemId ? (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.showInNav?.toString()}</TableCell>
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
                                showInNav: row.showInNav,
                              });
                            }}
                          >
                            EDIT
                          </Button>
                          <Button
                            variant="contained"
                            disabled={editingItemId != ""}
                            onClick={() => {
                              deleteItem("category", row._id);
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
                        <TableCell component="th" scope="row">
                          <TextField
                            id="cat-name"
                            label="New Category Name"
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
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  setEditData({
                                    ...editData,
                                    showInNav: e.target.checked,
                                  });
                                }}
                                checked={editData.showInNav}
                              />
                            }
                            label="Show on Navbar"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            sx={{ marginRight: 2 }}
                            // disabled={editingItemId != ""}
                            onClick={() => {
                              // deleteItem("category", row._id);
                              saveEdit("category", row._id);
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
            skeletonTable
          )}
        </DashboardCard>
        <DashboardCard
          title="Subcategories"
          action={isLoading ? <Skeleton width={500} height={50} /> : subcategoryCreator}
        >
          {/* SubCategories Table */}
          {!isLoading ? (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Image</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Show on Navbar</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subcategories.map((row) =>
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
                        <TableCell>{row.categoryName}</TableCell>
                        <TableCell>{row.showInNav?.toString()}</TableCell>
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
                                category: {
                                  label: row.categoryName,
                                  _id: row.categoryId,
                                },
                                showInNav: row.showInNav,
                                imagePath: row.image,
                              });
                            }}
                          >
                            EDIT
                          </Button>
                          <Button
                            variant="contained"
                            disabled={editingItemId != ""}
                            onClick={() => {
                              deleteItem("subcategory", row.categoryId, row._id);
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
                              {!!editData.imagePath ? (
                                typeof editData.imagePath === "string" ? (
                                  <Image src={editData.imagePath} alt="" objectFit="contain" fill />
                                ) : (
                                  <Image
                                    src={URL.createObjectURL(editData.imagePath)}
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
                            label="New Category Name"
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
                        <TableCell>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={editData.category}
                            sx={{ width: 200 }}
                            options={categoryOptions}
                            renderInput={(params) => <TextField {...params} label="Category" />}
                            onChange={(e, newValue) => {
                              setEditData({
                                ...editData,
                                category: newValue,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  setEditData({
                                    ...editData,
                                    showInNav: e.target.checked,
                                  });
                                }}
                                checked={editData.showInNav}
                              />
                            }
                            label="Show on Navbar"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            sx={{ marginRight: 2 }}
                            // disabled={editingItemId != ""}
                            onClick={() => {
                              // deleteItem("category", row._id);
                              saveEdit("subcategory", row._id);
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
            skeletonTable
          )}
        </DashboardCard>
        <DashboardCard
          title="Inner Categories"
          action={isLoading ? <Skeleton width={500} height={50} /> : innerSubcategoryCreator}
        >
          {/* InnerCategories Table */}
          {!isLoading ? (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Sub Category</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {innerSubcategories.map((row) =>
                    row._id != editingItemId ? (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.subCategoryName}</TableCell>
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
                              });
                            }}
                          >
                            EDIT
                          </Button>
                          <Button
                            variant="contained"
                            disabled={editingItemId != ""}
                            onClick={() => {
                              deleteItem("innersubcategory", row.parentSubcategory, row._id);
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
                        <TableCell component="th" scope="row">
                          <TextField
                            id="cat-name"
                            label="New Category Name"
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
                        <TableCell>{row.subCategoryName}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            sx={{ marginRight: 2 }}
                            // disabled={editingItemId != ""}
                            onClick={() => {
                              // deleteItem("category", row._id);
                              saveEdit("innersubcategory", row.parentSubcategory, row._id);
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
            skeletonTable
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
                      imagePath: selectedImage,
                    });
                  } else {
                    setSubcategoryForm({
                      ...subcategoryForm,
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

export default Categories;
