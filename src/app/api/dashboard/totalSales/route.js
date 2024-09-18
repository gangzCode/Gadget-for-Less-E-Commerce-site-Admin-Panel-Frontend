import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const sales = await baseApi.get("/order/get/total-sales", {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({
        success: true,
        sales: sales.data,
      });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
