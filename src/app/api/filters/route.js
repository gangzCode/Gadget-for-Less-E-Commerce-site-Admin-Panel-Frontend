import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const filters = await baseApi.get("/filters/getAllFilters", {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({
        success: true,
        filters: filters.data,
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
  const newFilter = await request.formData();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const res = await baseApi.postForm("/filters/createFilter", newFilter, {
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

export async function PUT(request) {
  const searchParams = request.nextUrl.searchParams;
  const filterId = searchParams.get("filterId");
  // console.log(filterId);

  const updatedItem = await request.formData();
  const cookieStore = cookies();
  console.log("Item ", updatedItem);

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.postForm("/filters/editFilter", updatedItem, {
        headers: { token: `Bearer ${user.accessToken}` },
        params: {
          filterId: filterId,
        },
      });

      return Response.json({ success: true, message: "Created" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
