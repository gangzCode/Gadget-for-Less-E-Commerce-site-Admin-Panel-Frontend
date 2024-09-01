import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function POST(request) {
  const cookieStore = cookies();
  const deleteItem = await request.json();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const res = await baseApi.post("/filters/delete", deleteItem, {
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
