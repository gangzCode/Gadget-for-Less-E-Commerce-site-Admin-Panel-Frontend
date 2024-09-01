import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      let products;

      if (id) {
        products = await baseApi.get(`/products/admin/${id}`, {
          headers: { token: `Bearer ${user.accessToken}` },
        });
      } else {
        products = await baseApi.get("/products/?categories&subCategories", {
          headers: { token: `Bearer ${user.accessToken}` },
        });
      }

      return Response.json({
        success: true,
        products: products.data,
      });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}

export async function POST(request) {
  const cookieStore = cookies();
  const newProduct = await request.formData();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const res = await baseApi.post("/products/", newProduct, {
        headers: {
          token: `Bearer ${user.accessToken}`,
        },
      });

      return Response.json({
        success: true,
        filters: res.data,
      });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}

export async function DELETE(request) {
  const cookieStore = cookies();
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const res = await baseApi.delete(`/products/${id}`, {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({
        success: true,
        filters: res.data,
      });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
