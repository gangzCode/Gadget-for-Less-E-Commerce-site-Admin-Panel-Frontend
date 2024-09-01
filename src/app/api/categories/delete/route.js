import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function POST(request) {
  const item = await request.json();
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.post("/categories/delete", item, {
        headers: { token: `Bearer ${user.accessToken}` },
      });


      return Response.json({ success: true, message: "Deleted" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
