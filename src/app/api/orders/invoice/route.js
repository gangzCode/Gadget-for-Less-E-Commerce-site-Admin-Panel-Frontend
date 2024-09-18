import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function POST(request) {
  const cookieStore = cookies();
  const orderData = await request.json();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const res = await baseApi.post("/order/printReportForAdmin", orderData, {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({ success: true, invoice: res.data });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
