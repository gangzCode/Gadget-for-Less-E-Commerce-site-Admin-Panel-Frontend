import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const filters = await baseApi.get("/filters/getFilterGroup", {
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
  const newGroup = await request.json();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const res = await baseApi.post("/filters/createFilterGroup", newGroup, {
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
  const updatedItem = await request.json();
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.put("/filters/editFilterGroup", updatedItem, {
        headers: { token: `Bearer ${user.accessToken}` },
      });


      return Response.json({ success: true, message: "Created" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}