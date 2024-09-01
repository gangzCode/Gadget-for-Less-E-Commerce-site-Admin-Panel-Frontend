import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function POST(request) {
  const innerSubcategory = await request.json();
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.post(
        "/categories/createInnerSubcategory/" + innerSubcategory.parentId,
        { innerCategories: innerSubcategory.innerCategories },
        {
          headers: { token: `Bearer ${user.accessToken}` },
        }
      );


      return Response.json({ success: true, message: "Created" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
