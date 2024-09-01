import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function POST(request) {
  const subcategory = await request.formData();
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.postForm("/categories/createSubcategory", subcategory, {
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
