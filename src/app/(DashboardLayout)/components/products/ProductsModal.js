import React, { useEffect, useState } from "react";
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
  Grid,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Image from "next/image";

const ProductsModal = ({
  create = false,
  edit = false,
  view = false,
  categories = [],
  productForm,
  initSubcats = [],
  initInnerCats = [],
  setProductForm = () => {},
  filters,
  createProduct = () => {},
  updateProduct = () => {},
}) => {
  const [subcategories, setSubcategories] = useState(edit ? productForm.category.subCategory : []);
  const [innerSubcategories, setInnerSubcategories] = useState(
    edit ? productForm.category.subCategory.innerCategories : []
  );
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
  const [helperTexts, setHelperTexts] = useState({
    name: "",
    image: "",
    imageAlt: "",
    description: "",
    richDescription: "",
    variations: [
      {
        sku: "",
        quantity: "",
        name: "",
        cost: "",
        price: "",
        discountedPrice: "",
      },
    ],
    specifications: [
      {
        name: "",
        value: "",
      },
    ],
    brand: "",
    category: "",
    subCategory: "",
    innerSubCategory: "",
    filterList: "",
    type: "",
  });

  const checkErrors = () => {
    console.log(productForm);

    const errorsObj = {
      name: productForm.name.trim() === "",
      image: productForm.image == null,
      imageAlt: productForm.imageAlt == null,
      // otherImages: [],
      description: productForm.description.trim() === "",
      richDescription: productForm.richDescription.trim() === "",
      variations:
        productForm.variations.length === 0
          ? []
          : productForm.variations.map((variation) => {
              return {
                sku: variation.sku.trim() === "",
                name: variation.name.trim() === "",
                quantity:
                  isNaN(variation.quantity) ||
                  !Number.isInteger(parseFloat(variation.quantity)) ||
                  parseInt(variation.quantity) < 0,
                cost: isNaN(variation.cost) || parseFloat(variation.cost) <= 0.0,
                price: isNaN(variation.price) || parseFloat(variation.price) <= 0,
                discountedPrice:
                  isNaN(variation.discountedPrice) ||
                  parseFloat(variation.discountedPrice) > parseFloat(variation.price),
              };
            }),

      specifications:
        productForm.specifications.length === 0
          ? []
          : productForm.specifications.map((spec) => {
              return {
                name: spec.name.trim() === "",
                value: spec.value.trim() === "",
              };
            }),
      brand: productForm.brand.trim() === "",
      category: productForm.category == null, // replace with a valid category ObjectId
      subCategory: productForm.subCategory == null, // replace with a valid subcategory ObjectId
      innerSubCategory: productForm.innerSubCategory == null,
      filterList: productForm.filterList.length === 0, // replace with valid filter ObjectIds
      type: productForm.type == null,
    };

    const helperObj = {
      name: errorsObj.name ? "Name cannot be empty" : "",
      image: errorsObj.image ? "Image is required" : "",
      imageAlt: errorsObj.imageAlt ? "Alt Image is required" : "",
      // otherImages: [],
      description: errorsObj.description ? "Description cannot be empty" : "",
      richDescription: errorsObj.richDescription ? "Rich description cannot be empty" : "",
      variations:
        errorsObj.variations.length === 0
          ? []
          : errorsObj.variations.map((variation) => {
              return {
                sku: variation.sku ? "SKU cannot be empty" : "",
                name: variation.name ? "Name cannot be empty" : "",
                quantity: variation.quantity ? "Quantity should be a positive integer number" : "",
                cost: variation.cost ? "Cost should be a positive number above 0" : "",
                price: variation.price ? "Price should be a positive number above 0" : "",
                discountedPrice: variation.discountedPrice
                  ? "Discounted price should be empty or a positive number between 0 and given price"
                  : "",
              };
            }),

      specifications:
        productForm.specifications.length === 0
          ? []
          : errorsObj.specifications.map((spec) => {
              return {
                name: spec.name ? "Name cannot be empty" : "",
                value: spec.value ? "Value cannot be empty" : "",
              };
            }),
      brand: errorsObj.brand ? "Brand cannot be empty" : "",
      category: errorsObj.category ? "Category is required" : "", // replace with a valid category ObjectId
      subCategory: errorsObj.subCategory ? "Subcategory is required" : "", // replace with a valid subcategory ObjectId
      innerSubCategory: errorsObj.innerSubCategory ? "Inner Subcategory is required" : "",
      filterList: errorsObj.filterList ? "Filters cannot be empty" : "", // replace with valid filter ObjectIds
      type: errorsObj.type ? "Please choose a product type" : "",
    };

    console.log(errorsObj);
    console.log(helperObj);
    setHelperTexts(helperObj);

    for (const errorItem of Object.keys(errorsObj)) {
      if (errorItem === "variations") {
        console.log(errorItem);
        for (const variationError of errorsObj[errorItem]) {
          if (variationError.sku === true) {
            return true;
          }
          if (variationError.name === true) {
            return true;
          }
          if (variationError.quantity === true) {
            return true;
          }
          if (variationError.cost === true) {
            return true;
          }
          if (variationError.price === true) {
            return true;
          }
          if (variationError.discountedPrice === true) {
            return true;
          }
        }
      } else if (errorItem === "specifications") {
        console.log(errorItem);
        for (const specError of errorsObj[errorItem]) {
          if (specError.name === true) {
            return true;
          }
          if (specError.value === true) {
            return true;
          }
        }
      } else {
        console.log(errorItem);
        if (errorsObj[errorItem] === true) {
          return true;
        }
      }
    }
    return false;
  };

  const variationsTableInput = (label, value, field, index) => (
    <TextField
      variant="outlined"
      label={label}
      fullWidth
      disabled={view}
      value={value}
      helperText={helperTexts.variations?.[index]?.[field] || ""}
      error={!!helperTexts.variations?.[index]?.[field]}
      onChange={(e) => {
        const updatedVariations = [...productForm.variations];
        updatedVariations[index][field] = e.target.value;

        setProductForm({
          ...productForm,
          variations: updatedVariations,
        });
      }}
    />
  );

  const imagePreview = (img, size, onDelete = null) => (
    <Paper
      sx={{
        padding: 4,
        width: size || "100%",
        height: size || "100%",
        position: "relative",
        textAlign: "center",
        verticalAlign: "center",
      }}
    >
      {img ? (
        typeof img === "string" ? (
          <Image src={img} alt="" fill style={{ objectFit: "contain" }} />
        ) : (
          <Image src={URL.createObjectURL(img)} alt="" fill style={{ objectFit: "contain" }} />
        )
      ) : (
        <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} height={"100%"}>
          {(create || edit) && <Typography>Please select an image</Typography>}
          {view && <Typography>Image unavailable</Typography>}
        </Stack>
      )}
      {onDelete && !view && (
        <Button
          variant="contained"
          sx={{ position: "absolute", bottom: 10, right: 5 }}
          onClick={onDelete}
        >
          REMOVE IMAGE
        </Button>
      )}
    </Paper>
  );

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80vw",
        height: "80vh",
        padding: 4,
        borderRadius: 4,
      }}
      overflow={"auto"}
    >
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          padding: 4,
        }}
      >
        <Stack spacing={2}>
          {create && <Typography variant="h5">Create product</Typography>}
          {view && <Typography variant="h5">View product</Typography>}
          {edit && <Typography variant="h5">Edit product</Typography>}
          <TextField
            disabled={view}
            variant="outlined"
            label="Name"
            value={productForm.name}
            error={!!helperTexts.name}
            helperText={helperTexts.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          />
          <TextField
            disabled={view}
            variant="outlined"
            multiline
            label="Description"
            value={productForm.description}
            error={!!helperTexts.description}
            helperText={helperTexts.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          />
          <TextField
            variant="outlined"
            multiline
            label="Rich Description"
            value={productForm.richDescription}
            disabled={view}
            error={!!helperTexts.richDescription}
            helperText={helperTexts.richDescription}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                richDescription: e.target.value,
              })
            }
          />
          {/* <FormControlLabel
            control={
              <Checkbox
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    isNumericVariation: e.target.checked,
                  })
                }
                disabled={view}
                checked={productForm.isNumericVariation}
              />
            }
            label="Is Numeric Variation?"
          /> */}
          <DashboardCard title="Images">
            <Stack direction={"column"} spacing={2}>
              <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>
                <Paper
                  sx={{
                    padding: 4,
                    width: "48%",
                    background: !!helperTexts.image ? "#FA896B" : "",
                  }}
                >
                  <Stack direction={"column"} spacing={2} alignItems={"center"}>
                    <Typography variant="h5">Main Image</Typography>
                    <Typography variant="body2">{helperTexts.image}</Typography>
                    <Button disabled={view} variant="contained" component="label">
                      Choose Image{" "}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          setProductForm({
                            ...productForm,
                            image: e.target.files[0],
                          });
                          // alert("File Selected");
                        }}
                      />
                    </Button>
                    {imagePreview(productForm.image, 350)}
                  </Stack>
                </Paper>
                <Paper
                  sx={{
                    padding: 4,
                    width: "48%",
                    background: !!helperTexts.imageAlt ? "#FA896B" : "",
                  }}
                >
                  <Stack direction={"column"} spacing={2} alignItems={"center"}>
                    <Typography variant="h5">Alt Image</Typography>
                    <Typography variant="body2">{helperTexts.imageAlt}</Typography>
                    <Button disabled={view} variant="contained" component="label">
                      Choose Image{" "}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          setProductForm({
                            ...productForm,
                            imageAlt: e.target.files[0],
                          });
                          // alert("File Selected");
                        }}
                      />
                    </Button>
                    {imagePreview(productForm.imageAlt, 350)}
                  </Stack>
                </Paper>
              </Stack>
              <DashboardCard
                title="Additional Images"
                action={
                  <Button disabled={view} variant="contained" component="label">
                    Add image{" "}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      multiple
                      name="otherImages"
                      onChange={(e) => {
                        setProductForm({
                          ...productForm,
                          otherImages: [...productForm.otherImages, ...e.target.files],
                        });
                        e.target.value = "";
                        // alert("File Selected");
                      }}
                    />
                  </Button>
                }
              >
                <Stack direction={"column"} spacing={2} alignItems={"center"}>
                  {/* <Typography variant="h5">Alt Image</Typography> */}
                  <Grid
                    container
                    spacing={5}
                    alignItems={"flex-start"}
                    px={"auto"}
                    justifyContent={"flex-start"}
                  >
                    {productForm.otherImages.map((img, key) => (
                      <Grid item xs={4} key={key}>
                        {imagePreview(img, 220, () => {
                          setProductForm({
                            ...productForm,
                            otherImages: productForm.otherImages.filter(
                              (img, index) => key != index
                            ),
                          });
                        })}
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </DashboardCard>
            </Stack>
          </DashboardCard>
          <DashboardCard
            title="Variations"
            action={
              <Button
                variant="contained"
                disabled={view}
                onClick={() => {
                  setProductForm({
                    ...productForm,
                    variations: [...productForm.variations, emptyVariation],
                  });
                }}
              >
                Add New Variation
              </Button>
            }
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>SKU</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Quantity</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Cost</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Discounted Price</TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productForm.variations.map((variation, key) => (
                    <TableRow key={key}>
                      <TableCell>
                        {variationsTableInput("SKU", variation.sku, "sku", key)}
                      </TableCell>
                      <TableCell>
                        {variationsTableInput("Name", variation.name, "name", key)}
                      </TableCell>
                      <TableCell>
                        {variationsTableInput("Quantity", variation.quantity, "quantity", key)}
                      </TableCell>
                      <TableCell>
                        {variationsTableInput("Cost", variation.cost, "cost", key)}
                      </TableCell>
                      <TableCell>
                        {variationsTableInput("Price", variation.price, "price", key)}
                      </TableCell>
                      <TableCell>
                        {variationsTableInput(
                          "Discounted Price",
                          variation.discountedPrice,
                          "discountedPrice",
                          key
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ width: "fit-content" }}
                          disabled={view}
                          onClick={() => {
                            if (productForm.variations.length > 1) {
                              setProductForm({
                                ...productForm,
                                variations: productForm.variations.filter(
                                  (variation, index) => key != index
                                ),
                              });
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
          <DashboardCard
            title="Specifications"
            action={
              <Button
                variant="contained"
                disabled={view}
                onClick={() => {
                  setProductForm({
                    ...productForm,
                    specifications: [...productForm.specifications, emptySpecification],
                  });
                }}
              >
                Add New Specification
              </Button>
            }
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Values</TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productForm.specifications.map((spec, key) => (
                    <TableRow key={key}>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          label="Enter Name"
                          value={spec.name}
                          disabled={view}
                          fullWidth
                          helperText={helperTexts.specifications?.[key]?.name || ""}
                          error={!!helperTexts.specifications?.[key]?.name}
                          onChange={(e) => {
                            const updatedSpec = [...productForm.specifications];
                            updatedSpec[key].name = e.target.value;

                            setProductForm({
                              ...productForm,
                              specifications: updatedSpec,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          variant="outlined"
                          disabled={view}
                          multiline
                          label="Enter Value"
                          value={spec.value}
                          helperText={helperTexts.specifications?.[key]?.value || ""}
                          error={!!helperTexts.specifications?.[key]?.value}
                          onChange={(e) => {
                            const updatedSpec = [...productForm.specifications];
                            updatedSpec[key].value = e.target.value;

                            setProductForm({
                              ...productForm,
                              specifications: updatedSpec,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          disabled={view}
                          onClick={() => {
                            if (productForm.specifications.length > 1) {
                              setProductForm({
                                ...productForm,
                                specifications: productForm.specifications.filter(
                                  (spec, index) => key != index
                                ),
                              });
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
          <TextField
            variant="outlined"
            label="Brand"
            disabled={view}
            error={!!helperTexts.brand}
            helperText={helperTexts.brand}
            value={productForm.brand}
            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
          />
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Typography>Type</Typography>
            <ToggleButtonGroup
              exclusive
              disabled={view}
              value={productForm.type}
              onChange={(e, newValue) => {
                setProductForm({
                  ...productForm,
                  type: newValue,
                });
              }}
            >
              <ToggleButton value="physical">Physical</ToggleButton>
              <ToggleButton value="digital">Digital</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="body2" color={"error"}>
              {helperTexts.type}
            </Typography>
          </Stack>
          <Autocomplete
            disablePortal
            disabled={view}
            options={categories || [productForm.category]}
            getOptionLabel={(category) => category.name}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={helperTexts.category}
                error={!!helperTexts.category}
                label="Category"
              />
            )}
            value={productForm.category}
            onChange={(e, newValue) => {
              setSubcategories(newValue.subCategory);
              setProductForm({
                ...productForm,
                category: newValue,
                subCategory: null,
                innerSubCategory: null,
              });
            }}
          />
          <Autocomplete
            disablePortal
            disabled={view}
            options={subcategories || [productForm.subCategory]}
            getOptionLabel={(subcategory) => subcategory.name}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={helperTexts.subCategory}
                error={!!helperTexts.subCategory}
                label="Subcategory"
              />
            )}
            value={productForm.subCategory}
            onChange={(e, newValue) => {
              setInnerSubcategories(newValue.innerCategories);
              setProductForm({
                ...productForm,
                subCategory: newValue,
                innerSubCategory: null,
              });
            }}
          />
          <Autocomplete
            disablePortal
            disabled={view}
            options={innerSubcategories || [productForm.innerSubCategory]}
            getOptionLabel={(innerSubCategory) => innerSubCategory.name}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={helperTexts.innerSubCategory}
                error={!!helperTexts.innerSubCategory}
                label="Inner Subcategory"
              />
            )}
            value={productForm.innerSubCategory}
            onChange={(e, newValue) => {
              // setInnerSubcategories(newValue.innerCategories);
              setProductForm({ ...productForm, innerSubCategory: newValue });
            }}
          />
          <Autocomplete
            multiple
            disablePortal
            disabled={view}
            color="error"
            options={filters || [productForm.filterList]}
            getOptionLabel={(filter) => filter.name}
            // groupBy={(filter) => (filter.filterGroup ? filter.filterGroup : "Ungrouped")}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={helperTexts.filterList}
                error={!!helperTexts.filterList}
                label="Filters"
              />
            )}
            value={productForm.filterList}
            onChange={(e, newValue) => {
              // setInnerSubcategories(newValue.innerCategories);
              setProductForm({ ...productForm, filterList: newValue });
            }}
          />
          {/* <Typography variant="body2" color={"error"}>
            {helperTexts.filterList}
          </Typography> */}
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  setProductForm({
                    ...productForm,
                    isFeatured: e.target.checked,
                  });
                }}
                disabled={view}
                checked={productForm.isFeatured}
              />
            }
            label="Is Featured?"
          />

          {create && (
            <Button
              variant="contained"
              onClick={() => {
                const isError = checkErrors();
                if (!isError) {
                  // alert("Creating product");
                  createProduct();
                } else {
                  alert("Errors found in the form");
                }
              }}
            >
              Create Product
            </Button>
          )}

          {edit && (
            <Button variant="contained" onClick={updateProduct}>
              Update Product
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProductsModal;
