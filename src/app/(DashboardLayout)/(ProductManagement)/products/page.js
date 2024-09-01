"use client";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TextField,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useEffect, useState } from "react";
import axios from "axios";
// import TextField from "@mui/material/TextField";
import Image from "next/image";
import ProductsModal from "../../components/products/ProductsModal";
import Swal from "sweetalert2";
import { QuestionMark } from "@mui/icons-material";
// import ReactQuill from "react-quill";
const emptyVariation = {
  sku: "",
  name: "",
  quantity: 0,
  cost: 0,
  price: 0,
  discountedPrice: null,
};

const emptySpecification = {
  name: "",
  value: "",
};

const emptyProduct = {
  name: "",
  image: null,
  imageAlt: null,
  otherImages: [],
  description: "",
  richDescription: "",
  isNumericVariation: true,
  variations: [
    {
      ...emptyVariation,
    },
  ],
  specifications: [
    {
      ...emptySpecification,
    },
  ],
  brand: "",
  price: 0,
  discountedPrice: 0,
  category: null, // replace with a valid category ObjectId
  subCategory: null, // replace with a valid subcategory ObjectId
  innerSubCategory: null,
  filterList: [], // replace with valid filter ObjectIds
  rating: 0,
  numReviews: 0,
  isFeatured: false,
  type: "physical",
};

const SamplePage = () => {
  const [forceReload, setForceReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState([]);

  const [productForm, setProductForm] = useState({ ...emptyProduct });

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);

  const [editingItemId, setEditingItemId] = useState("");
  const [editData, setEditData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  const [viewingItemId, setViewingItemId] = useState("");
  const [viewData, setViewData] = useState({});
  const [viewLoading, setViewLoading] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/products")
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setProducts(res.data.products);
          console.log(res.data.products);
        }
        return axios.get("/api/categories");
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setCategories(res.data.categories);
        }
        return axios.get("/api/filters");
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setFilters(res.data.filters);
          console.log(res.data.filters);

          setIsLoading(false);
          setForceReload(false);
        }
      });
  }, [, forceReload]);

  const createProduct = () => {
    const transformedFormData = {
      ...productForm,
      category: productForm.category?._id,
      subCategory: productForm.subCategory?._id,
      innerSubCategory: productForm.innerSubCategory?._id,
      filterList: JSON.stringify(productForm.filterList.map((filter) => filter._id)),
      variations: JSON.stringify([...productForm.variations]),
      specifications: JSON.stringify([...productForm.specifications]),
    };

    const formData = new FormData();

    Object.keys(transformedFormData).forEach((key) => {
      if (key != "otherImages") formData.append(key, transformedFormData[key]);
      else
        transformedFormData.otherImages.forEach((file) => {
          formData.append("otherImages", file);
        });
    });

    axios.post("/api/products", formData).then((res) => {
      if (res.data.success && res.data.success === true) {
        setProductForm({ ...emptyProduct });
        setForceReload(true);
        setOpenCreateModal(false);
        Swal.fire("Product created");
      }
    });
  };

  const viewProduct = (id) => {
    setViewLoading(true);
    axios
      .get("/api/products", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setViewData({
            ...res.data.products,
            innerSubCategory: res.data.products.subCategory.innerCategories.find(
              (ic) => ic._id === res.data.products.innerSubCategory
            ),
          });
          setViewLoading(false);
        }
      });
  };

  const editProduct = (id) => {
    setEditLoading(true);
    axios
      .get("/api/products", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setEditData({
            ...res.data.products,
            innerSubCategory: res.data.products.subCategory.innerCategories.find(
              (ic) => ic._id === res.data.products.innerSubCategory
            ),
          });
          setEditLoading(false);
        }
      });
  };

  const updateProduct = () => {
    axios
      .postForm("/api/products/update", {
        ...editData,
        productId: editData._id,
        category: editData.category?._id,
        subCategory: editData.subCategory?._id,
        innerSubCategory: editData.innerSubCategory?._id,
        filterList: JSON.stringify(editData.filterList.map((filter) => filter._id)),
        // otherImages: JSON.stringify(productForm.otherImages)
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setForceReload(true);
          setEditData({});
          setEditingItemId("");
          setOpenEditModal(false);
          Swal.fire("Product Updated");
        }
      });
  };

  const deleteProduct = (id) => {
    axios
      .delete("/api/products", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setForceReload(true);
          Swal.fire("Product deleted");
        }
      });
  };

  const skeletonTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Image</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Rich description</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Subcategory</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Quantity</TableCell>
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
            <TableCell sx={{ width: "10rem", maxWidth: "10rem" }}>
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

  const productTableRow = (row) => (
    <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
        {/* name */}
        <Typography>{row.name}</Typography>
      </TableCell>
      <TableCell sx={{ width: "10rem", maxWidth: "10rem" }}>
        {/* Rich desc */}
        <Typography variant="body2" noWrap>
          {row.richDescription}
        </Typography>
      </TableCell>
      <TableCell>
        {/* Category */}
        {row.category?.name || "Uncatagorized"}
      </TableCell>
      <TableCell>
        {/* Subcategory */}
        {row.subCategory?.name || "Uncatagorized"}
      </TableCell>
      <TableCell>
        {/* Quantity */}
        {row.variations.reduce((total, variation) => total + variation.quantity, 0)}
      </TableCell>
      <TableCell align="right">
        {/* Action */}
        <Button
          variant="contained"
          sx={{ marginRight: 2 }}
          // disabled={editingItemId != ""}
          onClick={() => {
            setOpenViewModal(true);
            setViewingItemId(row._id);
            viewProduct(row._id);
          }}
        >
          VIEW
        </Button>
        <Button
          variant="contained"
          sx={{ marginRight: 2 }}
          // disabled={editingItemId != ""}
          onClick={() => {
            setOpenEditModal(true);
            setEditingItemId(row._id);
            editProduct(row._id);
          }}
        >
          EDIT
        </Button>
        <Button
          variant="contained"
          // disabled={editingItemId != ""}
          onClick={() => {
            // deleteItem("filter", row._id);
            deleteProduct(row._id);
          }}
        >
          DELETE
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <PageContainer title="Products" description="this is Sample page">
      <DashboardCard
        title="Products"
        action={
          isLoading ? (
            <Skeleton width={500} height={50} />
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setOpenCreateModal(true);
                setProductForm({ ...emptyProduct });
              }}
            >
              Create Product
            </Button>
          )
        }
      >
        {/* <Typography>This is a Products page</Typography> */}
        {!isLoading ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Image</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Rich description</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Subcategory</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Quantity</TableCell>
                  <TableCell align="right" style={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{products.map((row) => productTableRow(row))}</TableBody>
            </Table>
          </TableContainer>
        ) : (
          skeletonTable
        )}
      </DashboardCard>
      <Modal
        open={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          setProductForm({ ...emptyProduct });
        }}
      >
        {/* {createModal} */}
        <ProductsModal
          create
          categories={categories}
          productForm={productForm}
          filters={filters}
          setProductForm={(i) => {
            setProductForm(i);
          }}
          createProduct={createProduct}
        />
      </Modal>
      <Modal
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setViewingItemId("");
          setViewData({});
        }}
      >
        {viewLoading ? (
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "fit-content",
              height: "fit-content",
              padding: 4,
              borderRadius: 4,
            }}
          >
            <Stack spacing={4}>
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
            </Stack>
          </Paper>
        ) : (
          <ProductsModal view productForm={viewData} categories={null} />
        )}
      </Modal>
      <Modal
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setEditingItemId("");
          setEditData({});
        }}
      >
        {editLoading ? (
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "fit-content",
              height: "fit-content",
              padding: 4,
              borderRadius: 4,
            }}
          >
            <Stack spacing={4}>
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
              <Skeleton variant="rounded" width={800} height={100} />
            </Stack>
          </Paper>
        ) : (
          <ProductsModal
            edit
            productForm={editData}
            setProductForm={(i) => {
              setEditData(i);
            }}
            filters={filters}
            categories={categories}
            updateProduct={updateProduct}
            // initSubcats={
            //   categories?.find((cat) => cat._id === editData.category._id)?.subCategory
            // }
            // initInnerCats={
            //   categories
            //     ?.find((cat) => cat._id === editData.category._id)
            //     ?.subCategory.find((subcat) => subcat._id === editData.subCategory._id)
            //     ?.innerCategories
            // }
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default SamplePage;
